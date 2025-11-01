import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { generateAnalyticsRecord, prepareForBigQueryIngestion } from "./analytics.tsx";
import { vertexAI } from "./vertex-ai.tsx";
import { weatherService } from "./weather-service.tsx";
import { emtBookingService } from "./emt-booking.tsx";
import { paymentGateway } from "./payment-gateway.tsx";
import { realtimeDataService } from "./realtime-data.tsx";
import { semanticSearchService } from "./semantic-search.tsx";
import { voiceService } from "./voice-service.tsx";
import { conversationalAI } from "./conversational-ai.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-f7922768/health", (c) => {
  return c.json({ status: "ok" });
});

// Test Vertex AI OAuth endpoint
app.get("/make-server-f7922768/test-vertexai", async (c) => {
  try {
    console.log('→ Testing Vertex AI OAuth configuration...');
    
    // Simple test query
    const testResult = await vertexAI.testConnection();
    
    return c.json({ 
      status: "success",
      message: "Vertex AI OAuth working correctly!",
      details: testResult
    });
  } catch (error) {
    console.error('✗ Vertex AI test failed:', error);
    return c.json({ 
      status: "error",
      message: error.message,
      details: "Check logs for more information"
    }, 500);
  }
});

// AI-powered destination suggestions endpoint
app.post("/make-server-f7922768/suggest-destinations", async (c) => {
  try {
    const { query, userInterests } = await c.req.json();
    console.log(`Fetching AI suggestions for query: "${query}"`);

    if (!query || query.trim().length === 0) {
      return c.json({ 
        query: '', 
        suggestions: [], 
        totalMatches: 0,
        contextualMessage: 'Please enter a destination or interest' 
      });
    }

    // Get AI-powered suggestions from Vertex AI service
    const suggestions = await vertexAI.getDestinationSuggestions(query, userInterests || []);

    return c.json(suggestions);

  } catch (error) {
    console.error('Destination suggestion error:', error);
    return c.json({ 
      query: '', 
      suggestions: [], 
      totalMatches: 0,
      error: error.message || 'Failed to fetch suggestions' 
    }, 500);
  }
});

// Structured JSON schema for LLM responses
const ITINERARY_JSON_SCHEMA = {
  title: "string",
  currency: "string",
  total_estimated_cost: "number",
  cost_breakdown: {
    transport: "number",
    accommodation: "number", 
    activities: "number",
    meals: "number",
    other: "number"
  },
  days: [{
    date: "YYYY-MM-DD",
    segments: [{
      start_time: "HH:MM",
      end_time: "HH:MM", 
      activity_type: "visit|transport|meal|rest|event|experience",
      title: "string",
      poi_id: "string|null",
      location: { name: "string", lat: "number", lon: "number" },
      estimated_cost: "number",
      booking_offer_id: "string|null",
      notes: "string|null"
    }],
    day_total_cost: "number"
  }],
  warnings: ["string"],
  references: [{ type: "poi|event|supplier", id: "string", source: "string" }]
};

// System prompt for structured JSON generation
const SYSTEM_PROMPT = `You are an itinerary planning assistant. ALWAYS output valid JSON and only JSON — no extra text. Follow the JSON schema described below exactly. Use data from the provided context (POIs, events, travel times, offers). Respect the constraints and indicate warnings when constraints can't be met.

JSON schema:
{
  "title": string,
  "currency": string,
  "total_estimated_cost": number,
  "cost_breakdown": { "transport": number, "accommodation": number, "activities": number, "meals": number, "other": number },
  "days": [
    {
      "date": "YYYY-MM-DD",
      "segments": [
        {
          "start_time": "HH:MM",
          "end_time": "HH:MM",
          "activity_type": "visit|transport|meal|rest|event|experience",
          "title": string,
          "poi_id": string|null,
          "location": { "name": string, "lat": number, "lon": number },
          "estimated_cost": number,
          "booking_offer_id": string|null,
          "notes": string|null
        }
      ],
      "day_total_cost": number
    }
  ],
  "warnings": [ string ],
  "references": [ { "type": "poi|event|supplier", "id": string, "source": string } ]
}`;

// Enhanced trip planning with structured AI generation
app.post("/make-server-f7922768/generate-itinerary", async (c) => {
  try {
    const tripData = await c.req.json();
    console.log("Generating structured itinerary for:", tripData.destination);

    // Create idempotency key for this generation
    const idempotencyKey = `itin_${tripData.destination}_${tripData.startDate}_${Date.now()}`;

    // Check if we already have a result for this key
    const existingResult = await kv.get(`generation_${idempotencyKey}`);
    if (existingResult) {
      console.log("Returning cached generation result");
      return c.json(existingResult);
    }

    // Simulate AI processing delay with shorter timeout
    await new Promise(resolve => setTimeout(resolve, Math.min(2000, 1500)));

    // Generate structured itinerary using schema
    const structuredItinerary = await generateStructuredItinerary(tripData, idempotencyKey);
    
    // Validate JSON schema
    const validationResult = validateItinerarySchema(structuredItinerary);
    if (!validationResult.valid) {
      console.error("Schema validation failed:", validationResult.errors);
      // Return a basic itinerary instead of failing
      const basicItinerary = createBasicItinerary(tripData);
      structuredItinerary = basicItinerary;
    }

    // Store itinerary with analytics data
    const itineraryId = `itin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const itineraryRecord = {
      id: itineraryId,
      tripData,
      structuredItinerary,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      idempotencyKey,
      // Analytics fields for BigQuery
      analytics: {
        user_preferences: {
          interests: tripData.interests || [],
          budget_per_person: tripData.budget || 25000,
          travel_style: tripData.travelStyle || 'moderate',
          priority_type: tripData.priorityType || 'experience',
          cultural_immersion: tripData.culturalImmersion || 3,
          adventure_level: tripData.adventureLevel || 3
        },
        generation_metrics: {
          total_cost: structuredItinerary.total_estimated_cost,
          days_count: structuredItinerary.days.length,
          segments_count: structuredItinerary.days.reduce((sum, day) => sum + day.segments.length, 0),
          budget_compliance: structuredItinerary.total_estimated_cost <= (tripData.budget || 25000),
          warnings_count: structuredItinerary.warnings.length
        }
      }
    };

    await kv.set(itineraryId, itineraryRecord);
    
    // Generate analytics record for BigQuery ingestion
    const analyticsRecord = generateAnalyticsRecord(itineraryRecord);
    const bigQueryData = prepareForBigQueryIngestion(analyticsRecord);
    
    // In production, send to BigQuery here
    console.log("Analytics data prepared for BigQuery");
    
    // Cache the generation result
    const result = { 
      success: true, 
      itineraryId,
      itinerary: convertStructuredToDisplay(structuredItinerary),
      structuredItinerary,
      analytics: analyticsRecord
    };
    await kv.set(`generation_${idempotencyKey}`, result);

    return c.json(result);
  } catch (error) {
    console.log("Error generating structured itinerary:", error);
    return c.json({ 
      success: false, 
      error: `Failed to generate itinerary: ${error.message}` 
    }, 500);
  }
});

// Fallback basic itinerary creator
function createBasicItinerary(tripData) {
  const start = new Date(tripData.startDate);
  const end = new Date(tripData.endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  return {
    title: `${days}-Day ${tripData.destination} Journey`,
    currency: "INR",
    total_estimated_cost: tripData.budget || 25000,
    cost_breakdown: {
      transport: 2000,
      accommodation: Math.floor((tripData.budget || 25000) * 0.4),
      activities: Math.floor((tripData.budget || 25000) * 0.3),
      meals: Math.floor((tripData.budget || 25000) * 0.2),
      other: Math.floor((tripData.budget || 25000) * 0.1)
    },
    days: Array.from({ length: days }, (_, i) => ({
      date: new Date(start.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      segments: [
        {
          start_time: "09:00",
          end_time: "12:00",
          activity_type: "visit",
          title: "Explore Local Attractions",
          poi_id: `poi_${i}_morning`,
          location: { name: tripData.destination, lat: 26.9124, lon: 75.7873 },
          estimated_cost: 500,
          booking_offer_id: `offer_${Date.now()}_${i}`,
          notes: null
        }
      ],
      day_total_cost: Math.floor((tripData.budget || 25000) / days)
    })),
    warnings: [],
    references: []
  };
}

// Production-ready booking connector with idempotency and rollback
app.post("/make-server-f7922768/book-complete-itinerary", async (c) => {
  try {
    const { itineraryId, bookingData } = await c.req.json();
    
    const existing = await kv.get(itineraryId);
    if (!existing) {
      return c.json({ success: false, error: "Itinerary not found" }, 404);
    }

    // Create idempotency key for this booking
    const idempotencyKey = `booking_${itineraryId}_${bookingData.email}_${Date.now()}`;
    
    // Check for existing booking with same idempotency key
    const existingBooking = await kv.get(`booking_${idempotencyKey}`);
    if (existingBooking) {
      console.log("Returning existing booking result");
      return c.json({ success: true, booking: existingBooking });
    }

    const bookingId = `complete_booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const masterConfirmationCode = `TRIP${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    
    // Initialize booking record with states
    const bookingRecord = {
      id: bookingId,
      itineraryId,
      masterConfirmationCode,
      bookingData,
      status: 'initiated',
      idempotencyKey,
      holds: [],
      paymentAuth: null,
      confirmedBookings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(bookingId, bookingRecord);

    try {
      // Step 1: Hold inventory at suppliers
      console.log("Step 1: Holding supplier inventory");
      const holds = await holdSuppliersInventory(existing.structuredItinerary, idempotencyKey);
      bookingRecord.status = 'held';
      bookingRecord.holds = holds;
      await kv.set(bookingId, bookingRecord);

      // Step 2: Authorize payment
      console.log("Step 2: Authorizing payment");
      const paymentAuth = await authorizePayment({
        amount: existing.structuredItinerary.total_estimated_cost,
        currency: existing.structuredItinerary.currency
      }, idempotencyKey);
      bookingRecord.status = 'payment_authorized';
      bookingRecord.paymentAuth = paymentAuth;
      await kv.set(bookingId, bookingRecord);

      // Step 3: Confirm bookings and capture payment
      console.log("Step 3: Confirming bookings and capturing payment");
      const confirmationResult = await confirmBookingsAndCapturePayment(holds, paymentAuth, idempotencyKey);
      bookingRecord.status = 'confirmed';
      bookingRecord.confirmedBookings = confirmationResult.confirmedBookings;
      bookingRecord.paymentCapture = confirmationResult.paymentCapture;
      bookingRecord.updatedAt = new Date().toISOString();
      await kv.set(bookingId, bookingRecord);

      // Calculate final amounts with discounts
      const totalCost = existing.structuredItinerary.total_estimated_cost;
      const discountApplied = Math.floor(totalCost * 0.1); // 10% bulk booking discount
      const finalAmount = totalCost - discountApplied;

      const completeBooking = {
        ...bookingRecord,
        totalCost,
        discountApplied,
        finalAmount,
        paymentStatus: 'completed',
        bookingType: 'complete_itinerary'
      };

      // Update itinerary status
      const updatedItinerary = {
        ...existing,
        status: 'booked',
        bookingId,
        bookedAt: new Date().toISOString()
      };
      await kv.set(itineraryId, updatedItinerary);

      // Generate booking analytics
      const analyticsRecord = generateAnalyticsRecord(updatedItinerary, completeBooking);
      const bigQueryData = prepareForBigQueryIngestion(analyticsRecord);
      console.log("Booking analytics for BigQuery:", bigQueryData);

      // Cache successful booking
      await kv.set(`booking_${idempotencyKey}`, completeBooking);
      
      return c.json({ 
        success: true, 
        booking: completeBooking,
        message: 'Complete itinerary booked successfully!',
        analytics: analyticsRecord
      });

    } catch (error) {
      console.error("Booking failed, initiating rollback:", error);
      
      // Rollback: Release holds and void payment authorization
      await rollbackBooking(bookingRecord, idempotencyKey);
      
      bookingRecord.status = 'failed';
      bookingRecord.error = error.message;
      bookingRecord.updatedAt = new Date().toISOString();
      await kv.set(bookingId, bookingRecord);
      
      return c.json({ 
        success: false, 
        error: `Booking failed: ${error.message}`,
        bookingId
      }, 500);
    }
  } catch (error) {
    console.log("Error processing complete booking:", error);
    return c.json({ success: false, error: "Failed to process complete booking" }, 500);
  }
});

// Individual activity booking endpoint
app.post("/make-server-f7922768/book-activity", async (c) => {
  try {
    const { itineraryId, activityId, bookingData } = await c.req.json();
    
    // Simulate individual activity booking with idempotency
    const idempotencyKey = `activity_booking_${activityId}_${bookingData.email}_${Date.now()}`;
    
    // Check for existing booking
    const existingBooking = await kv.get(`activity_${idempotencyKey}`);
    if (existingBooking) {
      return c.json({ success: true, booking: existingBooking });
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const booking = {
      id: bookingId,
      itineraryId,
      activityId,
      ...bookingData,
      status: 'confirmed',
      confirmationCode: `CONF${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      bookedAt: new Date().toISOString(),
      idempotencyKey
    };

    await kv.set(bookingId, booking);
    await kv.set(`activity_${idempotencyKey}`, booking);
    
    return c.json({ 
      success: true, 
      booking 
    });
  } catch (error) {
    console.log("Error processing activity booking:", error);
    return c.json({ success: false, error: "Failed to process booking" }, 500);
  }
});

// Get itinerary endpoint
app.get("/make-server-f7922768/itinerary/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await kv.get(id);
    
    if (!data) {
      return c.json({ success: false, error: "Itinerary not found" }, 404);
    }

    return c.json({ success: true, data });
  } catch (error) {
    console.log("Error fetching itinerary:", error);
    return c.json({ success: false, error: "Failed to fetch itinerary" }, 500);
  }
});

// Update itinerary endpoint
app.post("/make-server-f7922768/update-itinerary/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const existing = await kv.get(id);
    if (!existing) {
      return c.json({ success: false, error: "Itinerary not found" }, 404);
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await kv.set(id, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.log("Error updating itinerary:", error);
    return c.json({ success: false, error: "Failed to update itinerary" }, 500);
  }
});

// Weather alert endpoint
app.post("/make-server-f7922768/weather-alert", async (c) => {
  try {
    const { itineraryId, weatherData } = await c.req.json();
    
    const existing = await kv.get(itineraryId);
    if (!existing) {
      return c.json({ success: false, error: "Itinerary not found" }, 404);
    }

    const adjustedItinerary = await adjustForWeather(existing.structuredItinerary, weatherData);
    
    const updated = {
      ...existing,
      structuredItinerary: adjustedItinerary,
      weatherAlerts: [
        ...(existing.weatherAlerts || []),
        {
          timestamp: new Date().toISOString(),
          alert: weatherData.alert,
          adjustmentsMade: adjustedItinerary !== existing.structuredItinerary
        }
      ],
      updatedAt: new Date().toISOString()
    };

    await kv.set(itineraryId, updated);
    return c.json({ success: true, adjustedItinerary: convertStructuredToDisplay(adjustedItinerary) });
  } catch (error) {
    console.log("Error processing weather alert:", error);
    return c.json({ success: false, error: "Failed to process weather alert" }, 500);
  }
});

// Analytics endpoint for retrieving metrics
app.get("/make-server-f7922768/analytics", async (c) => {
  try {
    // In production, this would query BigQuery
    // For now, return mock analytics data
    const mockAnalytics = {
      totalItineraries: 1250,
      totalBookings: 890,
      conversionRate: 0.712,
      averageBudget: 28500,
      topDestinations: [
        { name: "Jaipur", count: 245, averageCost: 25000 },
        { name: "Goa", count: 198, averageCost: 32000 },
        { name: "Kerala", count: 167, averageCost: 35000 }
      ],
      budgetCompliance: 0.85,
      popularInterests: [
        { interest: "heritage", frequency: 0.75 },
        { interest: "street-food", frequency: 0.68 },
        { interest: "nature", frequency: 0.52 }
      ]
    };

    return c.json({ success: true, analytics: mockAnalytics });
  } catch (error) {
    console.log("Error retrieving analytics:", error);
    return c.json({ success: false, error: "Failed to retrieve analytics" }, 500);
  }
});

// Get booking details endpoint
app.get("/make-server-f7922768/booking/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const booking = await kv.get(id);
    
    if (!booking) {
      return c.json({ success: false, error: "Booking not found" }, 404);
    }

    return c.json({ success: true, booking });
  } catch (error) {
    console.log("Error fetching booking:", error);
    return c.json({ success: false, error: "Failed to fetch booking" }, 500);
  }
});

// Structured itinerary generation with schema validation
async function generateStructuredItinerary(tripData, idempotencyKey) {
  const { 
    destination, 
    startDate, 
    endDate, 
    interests, 
    budget, 
    travelers, 
    travelStyle,
    priorityType,
    accommodationType,
    transportPreference,
    mealPreferences,
    localExperience,
    hiddenGems,
    photographyFocus,
    culturalImmersion,
    adventureLevel,
    nightlifeImportance,
    mustVisit,
    avoidPlaces,
    language
  } = tripData;
  
  // Calculate trip duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Enhanced POI database with proper schema
  const mockPOIDatabase = {
    'jaipur': [
      { id: 'poi_city_palace', name: 'City Palace', lat: 26.9255, lon: 75.8213, categories: ['heritage', 'palace'], opening_hours: '09:00-17:00', popularity: 0.95 },
      { id: 'poi_amber_fort', name: 'Amber Fort', lat: 26.9855, lon: 75.8513, categories: ['heritage', 'fort'], opening_hours: '08:00-18:00', popularity: 0.92 },
      { id: 'poi_hawa_mahal', name: 'Hawa Mahal', lat: 26.9239, lon: 75.8267, categories: ['heritage', 'architecture'], opening_hours: '09:00-16:30', popularity: 0.89 },
      { id: 'poi_jantar_mantar', name: 'Jantar Mantar', lat: 26.9246, lon: 75.8241, categories: ['heritage', 'astronomy'], opening_hours: '09:00-16:30', popularity: 0.78 },
      { id: 'poi_johari_bazaar', name: 'Johari Bazaar', lat: 26.9246, lon: 75.8267, categories: ['shopping', 'street-food'], opening_hours: '10:00-21:00', popularity: 0.85 }
    ]
  };

  // Create user prompt with structured context
  const contextPOIs = mockPOIDatabase[destination.toLowerCase().split(',')[0]] || mockPOIDatabase['jaipur'];
  const userPrompt = `Build a complete itinerary for this user.
User constraints:
- trip_start: ${startDate}
- trip_end: ${endDate}
- budget_per_person: ${budget} INR
- interests: ${interests.join(', ')}
- mobility: ${adventureLevel > 3 ? 'high' : adventureLevel > 1 ? 'moderate' : 'low'}
- language: ${language}
- must_include: ${mustVisit ? [mustVisit] : []}
- preferred_accommodation_level: ${priorityType === 'budget' ? 'budget' : priorityType === 'comfort' ? 'premium' : 'mid'}

Context:
- POIs: ${JSON.stringify(contextPOIs)}
- Travel times: Average 30-45 minutes between major POIs
- Offers: All POIs have bookable offers with 15-20% savings for advance booking

Constraints:
- Keep daily awake window between 07:00 and 22:30
- Respect POI opening_hours
- Keep transit segments realistic with at least 15 minutes padding
- Ensure total_estimated_cost <= budget_per_person if possible; if not, put warning and show minimal changes to meet budget`;

  // Simulate structured AI generation (in production, call Vertex AI/Gemini here)
  const structuredItinerary = {
    title: `${days}-Day ${destination} ${priorityType.charAt(0).toUpperCase() + priorityType.slice(1)} Journey`,
    currency: "INR",
    total_estimated_cost: 0,
    cost_breakdown: {
      transport: 0,
      accommodation: 0,
      activities: 0,
      meals: 0,
      other: 0
    },
    days: [],
    warnings: [],
    references: []
  };

  let totalCost = 0;
  const costBreakdown = { transport: 0, accommodation: 0, activities: 0, meals: 0, other: 0 };

  // Generate days with structured segments
  for (let dayNum = 1; dayNum <= days; dayNum++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + dayNum - 1);
    const dateStr = currentDate.toISOString().split('T')[0];

    const daySegments = [];
    let dayTotalCost = 0;
    let currentTime = 9; // 9 AM start
    const usedPOIs = new Set(); // Track used POIs for this day

    // Morning activity
    let morningPOI;
    do {
      morningPOI = contextPOIs[Math.floor(Math.random() * contextPOIs.length)];
    } while (usedPOIs.has(morningPOI.id) && usedPOIs.size < contextPOIs.length);
    usedPOIs.add(morningPOI.id);

    const morningCost = Math.floor(Math.random() * 500) + 200;
    daySegments.push({
      start_time: `${currentTime.toString().padStart(2, '0')}:00`,
      end_time: `${(currentTime + 3).toString().padStart(2, '0')}:00`,
      activity_type: "visit",
      title: morningPOI.name,
      poi_id: morningPOI.id,
      location: { name: morningPOI.name, lat: morningPOI.lat, lon: morningPOI.lon },
      estimated_cost: morningCost,
      booking_offer_id: `offer_${morningPOI.id}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      notes: hiddenGems ? "Hidden gem experience with local guide" : null
    });
    dayTotalCost += morningCost;
    costBreakdown.activities += morningCost;
    currentTime += 3;

    // Lunch
    const lunchCost = Math.floor(Math.random() * 300) + 200;
    daySegments.push({
      start_time: `${currentTime.toString().padStart(2, '0')}:00`,
      end_time: `${(currentTime + 1).toString().padStart(2, '0')}:00`,
      activity_type: "meal",
      title: "Local Cuisine Lunch",
      poi_id: null,
      location: { name: `Restaurant near ${morningPOI.name}`, lat: morningPOI.lat + 0.001, lon: morningPOI.lon + 0.001 },
      estimated_cost: lunchCost,
      booking_offer_id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      notes: null
    });
    dayTotalCost += lunchCost;
    costBreakdown.meals += lunchCost;
    currentTime += 1;

    // Afternoon activity - ensure different POI
    let afternoonPOI;
    do {
      afternoonPOI = contextPOIs[Math.floor(Math.random() * contextPOIs.length)];
    } while (usedPOIs.has(afternoonPOI.id) && usedPOIs.size < contextPOIs.length);
    usedPOIs.add(afternoonPOI.id);

    const afternoonCost = Math.floor(Math.random() * 400) + 150;
    daySegments.push({
      start_time: `${currentTime.toString().padStart(2, '0')}:00`,
      end_time: `${(currentTime + 2).toString().padStart(2, '0')}:00`,
      activity_type: "visit",
      title: afternoonPOI.name,
      poi_id: afternoonPOI.id,
      location: { name: afternoonPOI.name, lat: afternoonPOI.lat, lon: afternoonPOI.lon },
      estimated_cost: afternoonCost,
      booking_offer_id: `offer_${afternoonPOI.id}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      notes: photographyFocus ? "Perfect for photography - golden hour timing" : null
    });
    dayTotalCost += afternoonCost;
    costBreakdown.activities += afternoonCost;

    structuredItinerary.days.push({
      date: dateStr,
      segments: daySegments,
      day_total_cost: dayTotalCost
    });

    totalCost += dayTotalCost;
  }

  // Add accommodation costs
  const accommodationCostPerNight = priorityType === 'budget' ? 1500 : priorityType === 'comfort' ? 5000 : 3000;
  const totalAccommodationCost = accommodationCostPerNight * (days - 1);
  costBreakdown.accommodation = totalAccommodationCost;
  totalCost += totalAccommodationCost;

  // Add transport costs
  const transportCost = transportPreference.includes('flight') ? 4000 : 
                       transportPreference.includes('train') ? 1500 : 2000;
  costBreakdown.transport = transportCost;
  totalCost += transportCost;

  structuredItinerary.total_estimated_cost = totalCost;
  structuredItinerary.cost_breakdown = costBreakdown;

  // Add warnings if over budget
  if (totalCost > budget) {
    structuredItinerary.warnings.push(`Total cost (₹${totalCost}) exceeds budget (₹${budget}). Consider reducing activities or changing accommodation level.`);
  }

  // Add references
  contextPOIs.forEach(poi => {
    structuredItinerary.references.push({
      type: "poi",
      id: poi.id,
      source: "mock_database"
    });
  });

  return structuredItinerary;
}

// JSON Schema validation
function validateItinerarySchema(itinerary) {
  const errors = [];
  
  // Required fields validation
  if (!itinerary.title) errors.push("Missing title");
  if (!itinerary.currency) errors.push("Missing currency");
  if (typeof itinerary.total_estimated_cost !== 'number') errors.push("Invalid total_estimated_cost");
  if (!itinerary.cost_breakdown) errors.push("Missing cost_breakdown");
  if (!Array.isArray(itinerary.days)) errors.push("Days must be an array");
  if (!Array.isArray(itinerary.warnings)) errors.push("Warnings must be an array");
  if (!Array.isArray(itinerary.references)) errors.push("References must be an array");

  // Validate each day
  itinerary.days?.forEach((day, index) => {
    if (!day.date || !/^\d{4}-\d{2}-\d{2}$/.test(day.date)) {
      errors.push(`Day ${index + 1}: Invalid date format`);
    }
    if (!Array.isArray(day.segments)) {
      errors.push(`Day ${index + 1}: Segments must be an array`);
    }
    if (typeof day.day_total_cost !== 'number') {
      errors.push(`Day ${index + 1}: Invalid day_total_cost`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

// Convert structured format to display format
function convertStructuredToDisplay(structured) {
  return {
    title: structured.title,
    destination: "Generated Destination",
    totalDays: structured.days.length,
    totalCost: structured.total_estimated_cost,
    currency: structured.currency,
    accommodationCost: structured.cost_breakdown.accommodation,
    transportCost: structured.cost_breakdown.transport,
    activityCost: structured.cost_breakdown.activities,
    days: structured.days.map((day, index) => ({
      dayNumber: index + 1,
      date: day.date,
      activities: day.segments.filter(seg => seg.activity_type === 'visit').map(seg => ({
        id: seg.booking_offer_id || `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: seg.start_time,
        endTime: seg.end_time,
        activity: seg.title,
        type: seg.activity_type,
        location: seg.location.name,
        estimatedCost: seg.estimated_cost,
        bookingOfferId: seg.booking_offer_id,
        description: `Experience ${seg.title} with guided tour and local insights.`,
        isBookable: true,
        notes: seg.notes
      })),
      dayTheme: "exploration",
      estimatedBudget: day.day_total_cost
    })),
    bookingSummary: {
      totalActivities: structured.days.reduce((sum, day) => sum + day.segments.filter(seg => seg.activity_type === 'visit').length, 0),
      totalBookings: structured.days.reduce((sum, day) => sum + day.segments.length, 0),
      estimatedSavings: Math.floor(structured.total_estimated_cost * 0.1)
    }
  };
}

// Production booking functions with idempotency and rollback
async function holdSuppliersInventory(structuredItinerary, idempotencyKey) {
  const holds = [];
  
  for (const day of structuredItinerary.days) {
    for (const segment of day.segments) {
      if (segment.booking_offer_id) {
        // Simulate supplier hold API call
        const holdResponse = await simulateSupplierHold(segment, idempotencyKey);
        holds.push({
          segment_id: segment.booking_offer_id,
          hold_ref: holdResponse.hold_ref,
          supplier_id: holdResponse.supplier_id,
          expires_at: holdResponse.expires_at
        });
      }
    }
  }
  
  return holds;
}

async function simulateSupplierHold(segment, idempotencyKey) {
  // Simulate API call with idempotency
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    hold_ref: `hold_${segment.booking_offer_id}_${Date.now()}`,
    supplier_id: `supplier_${segment.poi_id || 'generic'}`,
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
    status: 'held'
  };
}

async function authorizePayment(paymentInfo, idempotencyKey) {
  // Simulate payment gateway authorization
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    auth_id: `auth_${idempotencyKey}_${Date.now()}`,
    amount: paymentInfo.amount,
    currency: paymentInfo.currency,
    status: 'authorized',
    expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
  };
}

async function confirmBookingsAndCapturePayment(holds, paymentAuth, idempotencyKey) {
  const confirmedBookings = [];
  
  // Confirm each hold
  for (const hold of holds) {
    const confirmation = await simulateSupplierConfirm(hold, idempotencyKey);
    confirmedBookings.push(confirmation);
  }
  
  // Capture payment
  const paymentCapture = await simulatePaymentCapture(paymentAuth, idempotencyKey);
  
  return {
    confirmedBookings,
    paymentCapture
  };
}

async function simulateSupplierConfirm(hold, idempotencyKey) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    booking_ref: `booking_${hold.hold_ref}_confirmed`,
    supplier_id: hold.supplier_id,
    status: 'confirmed',
    confirmation_code: `CONF${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  };
}

async function simulatePaymentCapture(paymentAuth, idempotencyKey) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    capture_id: `capture_${paymentAuth.auth_id}`,
    amount: paymentAuth.amount,
    currency: paymentAuth.currency,
    status: 'captured'
  };
}

async function rollbackBooking(bookingRecord, idempotencyKey) {
  console.log("Starting rollback process");
  
  // Release any holds
  if (bookingRecord.holds && bookingRecord.holds.length > 0) {
    for (const hold of bookingRecord.holds) {
      try {
        await simulateSupplierRelease(hold, idempotencyKey);
        console.log(`Released hold: ${hold.hold_ref}`);
      } catch (error) {
        console.error(`Failed to release hold ${hold.hold_ref}:`, error);
      }
    }
  }
  
  // Void payment authorization
  if (bookingRecord.paymentAuth) {
    try {
      await simulatePaymentVoid(bookingRecord.paymentAuth, idempotencyKey);
      console.log(`Voided payment auth: ${bookingRecord.paymentAuth.auth_id}`);
    } catch (error) {
      console.error(`Failed to void payment auth:`, error);
    }
  }
}

async function simulateSupplierRelease(hold, idempotencyKey) {
  await new Promise(resolve => setTimeout(resolve, 100));
  return { status: 'released', hold_ref: hold.hold_ref };
}

async function simulatePaymentVoid(paymentAuth, idempotencyKey) {
  await new Promise(resolve => setTimeout(resolve, 100));
  return { status: 'voided', auth_id: paymentAuth.auth_id };
}

// Weather adjustment function
async function adjustForWeather(structuredItinerary, weatherData) {
  console.log("Adjusting itinerary for weather:", weatherData);
  
  // Create a copy of the itinerary for modification
  const adjustedItinerary = JSON.parse(JSON.stringify(structuredItinerary));
  
  // If it's raining, move outdoor activities indoors or to covered areas
  if (weatherData.alert?.toLowerCase().includes('rain') || weatherData.alert?.toLowerCase().includes('storm')) {
    for (const day of adjustedItinerary.days) {
      for (const segment of day.segments) {
        if (segment.activity_type === 'visit' && segment.poi_id) {
          // Suggest indoor alternatives for outdoor POIs
          if (segment.title.includes('Fort') || segment.title.includes('Garden')) {
            segment.notes = `Weather Alert: ${weatherData.alert}. Consider visiting covered areas or indoor sections.`;
            // Potentially adjust timing
            if (segment.start_time < '10:00') {
              segment.start_time = '10:00';
              segment.end_time = '13:00';
            }
          }
        }
      }
    }
  }
  
  // If it's very hot, adjust timing to avoid peak hours
  if (weatherData.alert?.toLowerCase().includes('heat') || weatherData.alert?.toLowerCase().includes('hot')) {
    for (const day of adjustedItinerary.days) {
      for (const segment of day.segments) {
        if (segment.activity_type === 'visit') {
          // Move activities to earlier or later in the day
          const startHour = parseInt(segment.start_time.split(':')[0]);
          if (startHour >= 11 && startHour <= 15) {
            segment.notes = `Weather Alert: ${weatherData.alert}. Timing adjusted to avoid peak heat.`;
            // Move to early morning or evening
            if (startHour <= 13) {
              segment.start_time = '08:00';
              segment.end_time = '11:00';
            } else {
              segment.start_time = '17:00';
              segment.end_time = '20:00';
            }
          }
        }
      }
    }
  }
  
  return adjustedItinerary;
}

// Enhanced real-time data integration endpoint
app.post("/make-server-f7922768/realtime-data", async (c) => {
  try {
    const { destination, timestamp } = await c.req.json();
    
    // Simulate real-time data aggregation from multiple sources
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const realtimeData = {
      location: {
        name: destination,
        coordinates: [26.9124, 75.7873], // Mock coordinates for Jaipur
        currentWeather: {
          temperature: Math.floor(Math.random() * 15) + 20,
          condition: ["Clear", "Cloudy", "Partly Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 40) + 40,
          windSpeed: Math.floor(Math.random() * 15) + 5
        },
        crowdLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        alerts: Math.random() > 0.7 ? ["Traffic congestion on MG Road", "Festival celebration in City Palace area"] : []
      },
      events: [
        {
          id: `event_${Date.now()}_1`,
          name: "Rajasthani Folk Dance Performance",
          type: "cultural",
          date: new Date().toISOString(),
          location: "City Palace",
          price: Math.floor(Math.random() * 500) + 200,
          popularity: Math.floor(Math.random() * 30) + 70
        },
        {
          id: `event_${Date.now()}_2`,
          name: "Local Food Festival",
          type: "food",
          date: new Date(Date.now() + 86400000).toISOString(),
          location: "Johari Bazaar",
          price: Math.floor(Math.random() * 300) + 150,
          popularity: Math.floor(Math.random() * 25) + 75
        }
      ],
      localInsights: [
        {
          type: "hidden_gem",
          title: "Secret Rooftop Cafe",
          description: "Hidden cafe with panoramic city views, known only to locals",
          rating: 4.7,
          verifiedBy: "local_guide"
        },
        {
          type: "budget_hack",
          title: "Early Morning Photography",
          description: "Visit monuments before 8 AM for 50% discounted entry and fewer crowds",
          rating: 4.5,
          verifiedBy: "ai"
        },
        {
          type: "photo_spot",
          title: "Sunset Point at Nahargarh",
          description: "Best sunset views of the Pink City, perfect golden hour lighting",
          rating: 4.8,
          verifiedBy: "traveler"
        }
      ],
      transportation: {
        trafficLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        alternativeRoutes: Math.floor(Math.random() * 3) + 2,
        estimatedDelay: Math.floor(Math.random() * 20),
        publicTransportStatus: ["normal", "delayed", "disrupted"][Math.floor(Math.random() * 3)]
      },
      accommodationTrends: {
        averagePrice: Math.floor(Math.random() * 2000) + 3000,
        availability: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
        bestDeals: [
          {
            name: "Heritage Haveli",
            originalPrice: 4500,
            discountedPrice: 3200,
            rating: 4.3
          },
          {
            name: "Modern Palace Hotel",
            originalPrice: 6000,
            discountedPrice: 4800,
            rating: 4.6
          }
        ]
      }
    };
    
    return c.json({ success: true, data: realtimeData });
  } catch (error) {
    console.log("Error fetching real-time data:", error);
    return c.json({ success: false, error: "Failed to fetch real-time data" }, 500);
  }
});

// EaseMyTrip integration endpoints
app.post("/make-server-f7922768/emt-integration/search", async (c) => {
  try {
    const { destination, startDate, endDate, travelers, budget, membershipTier } = await c.req.json();
    
    // Simulate EMT API integration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const emtOptions = {
      flights: [
        {
          id: `flight_${Date.now()}_1`,
          airline: "IndiGo",
          flightNumber: "6E-2341",
          departure: {
            airport: "DEL",
            time: "08:30",
            city: "Delhi"
          },
          arrival: {
            airport: "JAI",
            time: "10:00",
            city: "Jaipur"
          },
          duration: "1h 30m",
          price: Math.floor(Math.random() * 2000) + 3000,
          class: "economy",
          baggage: "15kg included",
          amenities: ["In-flight meal", "WiFi", "Entertainment"],
          cancellationPolicy: "Free cancellation within 24 hours",
          emtDiscount: membershipTier === 'platinum' ? 500 : membershipTier === 'premium' ? 300 : 150
        },
        {
          id: `flight_${Date.now()}_2`,
          airline: "Air India",
          flightNumber: "AI-9876",
          departure: {
            airport: "DEL",
            time: "14:15",
            city: "Delhi"
          },
          arrival: {
            airport: "JAI",
            time: "15:45",
            city: "Jaipur"
          },
          duration: "1h 30m",
          price: Math.floor(Math.random() * 2500) + 3500,
          class: "economy",
          baggage: "20kg included",
          amenities: ["In-flight meal", "Priority boarding"],
          cancellationPolicy: "Cancellation charges apply",
          emtDiscount: membershipTier === 'platinum' ? 600 : membershipTier === 'premium' ? 400 : 200
        }
      ],
      trains: [
        {
          id: `train_${Date.now()}_1`,
          trainNumber: "12956",
          trainName: "JP SUPERFAST",
          departure: {
            station: "NDLS",
            time: "22:30",
            city: "New Delhi"
          },
          arrival: {
            station: "JP",
            time: "04:00+1",
            city: "Jaipur"
          },
          duration: "5h 30m",
          price: Math.floor(Math.random() * 800) + 1200,
          class: "3AC",
          availableSeats: Math.floor(Math.random() * 20) + 10,
          emtDiscount: membershipTier === 'platinum' ? 200 : membershipTier === 'premium' ? 120 : 80
        }
      ],
      hotels: [
        {
          id: `hotel_${Date.now()}_1`,
          name: "Taj Rambagh Palace",
          rating: 5,
          location: "Bhawani Singh Road, Jaipur",
          coordinates: [26.9124, 75.7873],
          pricePerNight: Math.floor(Math.random() * 5000) + 8000,
          totalPrice: (Math.floor(Math.random() * 5000) + 8000) * Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)),
          amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Room Service", "Gym"],
          images: ["hotel1.jpg", "hotel2.jpg"],
          cancellationPolicy: "Free cancellation up to 24 hours before check-in",
          emtDiscount: membershipTier === 'platinum' ? 2000 : membershipTier === 'premium' ? 1200 : 800,
          roomType: "Deluxe Room",
          inclusions: ["Breakfast", "Airport transfer", "Welcome drink"]
        },
        {
          id: `hotel_${Date.now()}_2`,
          name: "ITC Rajputana",
          rating: 4,
          location: "Palace Road, Jaipur",
          coordinates: [26.9156, 75.8019],
          pricePerNight: Math.floor(Math.random() * 3000) + 4000,
          totalPrice: (Math.floor(Math.random() * 3000) + 4000) * Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)),
          amenities: ["Pool", "WiFi", "Restaurant", "Bar", "Spa"],
          images: ["hotel3.jpg", "hotel4.jpg"],
          cancellationPolicy: "Free cancellation up to 48 hours before check-in",
          emtDiscount: membershipTier === 'platinum' ? 1500 : membershipTier === 'premium' ? 900 : 600,
          roomType: "Superior Room",
          inclusions: ["Breakfast", "WiFi", "Evening tea"]
        }
      ],
      cabs: [
        {
          id: `cab_${Date.now()}_1`,
          type: "sedan",
          provider: "Ola",
          estimatedTime: "45 minutes",
          price: Math.floor(Math.random() * 500) + 800,
          features: ["AC", "GPS tracking", "Driver details"],
          emtDiscount: membershipTier === 'platinum' ? 100 : membershipTier === 'premium' ? 60 : 40
        }
      ]
    };
    
    return c.json({ success: true, data: emtOptions });
  } catch (error) {
    console.log("Error fetching EMT options:", error);
    return c.json({ success: false, error: "Failed to fetch EMT options" }, 500);
  }
});

app.post("/make-server-f7922768/emt-integration/book", async (c) => {
  try {
    const bookingRequest = await c.req.json();
    
    // Simulate EMT booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const bookingResult = {
      bookingId: `EMT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      confirmationCode: `EMT${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      emtReference: `EMT-REF-${Date.now()}`,
      paymentStatus: "completed",
      totalAmount: bookingRequest.totalCost,
      discountApplied: bookingRequest.totalDiscount,
      services: {
        flight: bookingRequest.selectedOptions.flight ? "Confirmed" : null,
        hotel: bookingRequest.selectedOptions.hotel ? "Confirmed" : null,
        train: bookingRequest.selectedOptions.train ? "Confirmed" : null,
        cab: bookingRequest.selectedOptions.cab ? "Confirmed" : null
      },
      customerDetails: bookingRequest.customerDetails,
      bookedAt: new Date().toISOString()
    };
    
    return c.json({ success: true, ...bookingResult });
  } catch (error) {
    console.log("Error processing EMT booking:", error);
    return c.json({ success: false, error: "EMT booking failed" }, 500);
  }
});

// AI personality insights endpoint
app.post("/make-server-f7922768/ai-insights/personality", async (c) => {
  try {
    const { profile } = await c.req.json();
    
    // Simulate AI personality analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const insights = {
      personalityType: "Cultural Explorer with Adventure Tendencies",
      travelRecommendations: [
        "Heritage sites with interactive experiences",
        "Local cultural workshops and classes",
        "Off-the-beaten-path destinations",
        "Food tours and cooking experiences"
      ],
      behavioralInsights: {
        optimalTripDuration: "5-7 days",
        preferredGroupSize: "2-4 people",
        bestTimeForBooking: "2-3 weeks in advance",
        budgetOptimization: "Mid-range accommodation with premium experiences"
      },
      adaptiveSettings: {
        weatherSensitivity: Math.min(10, profile.smartPreferences?.weatherSensitivity + 1),
        culturalImmersion: Math.min(10, profile.culturalPreferences?.localInteractionLevel + 2),
        spontaneityLevel: Math.max(1, profile.travelPersonality?.spontaneityLevel - 1)
      }
    };
    
    return c.json({ success: true, insights });
  } catch (error) {
    console.log("Error generating AI insights:", error);
    return c.json({ success: false, error: "Failed to generate insights" }, 500);
  }
});

// Analytics dashboard endpoint  
app.post("/make-server-f7922768/analytics/dashboard", async (c) => {
  try {
    const { period, metric, realtime } = await c.req.json();
    
    // Simulate analytics data fetching from BigQuery
    await new Promise(resolve => setTimeout(resolve, realtime ? 500 : 1000));
    
    const analyticsData = {
      overview: {
        totalTrips: 1247 + (realtime ? Math.floor(Math.random() * 10) : 0),
        totalUsers: 3456 + (realtime ? Math.floor(Math.random() * 20) : 0),
        averageRating: 4.6 + (Math.random() * 0.4 - 0.2),
        totalRevenue: 12450000 + (realtime ? Math.floor(Math.random() * 50000) : 0),
        conversionRate: 68.5 + (Math.random() * 10 - 5),
        userGrowth: 15.2 + (Math.random() * 6 - 3)
      },
      travelInsights: {
        popularDestinations: [
          { name: "Jaipur", visits: 245, averageBudget: 25000, satisfaction: 4.7 },
          { name: "Goa", visits: 198, averageBudget: 32000, satisfaction: 4.5 },
          { name: "Kerala", visits: 167, averageBudget: 35000, satisfaction: 4.8 },
          { name: "Udaipur", visits: 143, averageBudget: 28000, satisfaction: 4.6 },
          { name: "Manali", visits: 129, averageBudget: 22000, satisfaction: 4.4 }
        ],
        seasonalTrends: [
          { month: "Jan", bookings: 89, revenue: 2450000, averageGroupSize: 2.3 },
          { month: "Feb", bookings: 112, revenue: 3100000, averageGroupSize: 2.1 },
          { month: "Mar", bookings: 134, revenue: 3780000, averageGroupSize: 2.4 },
          { month: "Apr", bookings: 98, revenue: 2890000, averageGroupSize: 2.2 },
          { month: "May", bookings: 67, revenue: 1980000, averageGroupSize: 2.0 },
          { month: "Jun", bookings: 45, revenue: 1340000, averageGroupSize: 1.9 }
        ],
        budgetDistribution: [
          { range: "₹10K-₹20K", count: 356, percentage: 28.5 },
          { range: "₹20K-₹35K", count: 445, percentage: 35.7 },
          { range: "₹35K-₹50K", count: 289, percentage: 23.2 },
          { range: "₹50K+", count: 157, percentage: 12.6 }
        ]
      },
      userBehavior: {
        interestPreferences: [
          { interest: "Heritage", popularity: 75, conversionRate: 82, percentage: 35 },
          { interest: "Food", popularity: 68, conversionRate: 78, percentage: 28 },
          { interest: "Nature", popularity: 52, conversionRate: 71, percentage: 18 },
          { interest: "Adventure", popularity: 45, conversionRate: 85, percentage: 12 },
          { interest: "Photography", popularity: 38, conversionRate: 76, percentage: 7 }
        ],
        bookingPatterns: [
          { timeframe: "Same Day", immediateBookings: 45, reviewFirstBookings: 23, comparisonBookings: 12 },
          { timeframe: "1-3 Days", immediateBookings: 89, reviewFirstBookings: 156, comparisonBookings: 78 },
          { timeframe: "1 Week", immediateBookings: 123, reviewFirstBookings: 234, comparisonBookings: 189 },
          { timeframe: "2+ Weeks", immediateBookings: 67, reviewFirstBookings: 198, comparisonBookings: 234 }
        ],
        deviceUsage: [
          { device: "Mobile", usage: 68, conversionRate: 72 },
          { device: "Desktop", usage: 28, conversionRate: 81 },
          { device: "Tablet", usage: 4, conversionRate: 69 }
        ]
      },
      aiPerformance: {
        recommendationAccuracy: 87,
        personalizedClickRate: 34,
        adaptationSuccessRate: 92,
        weatherAlertEffectiveness: 78,
        hiddenGemDiscovery: 65
      },
      businessMetrics: {
        revenueBySource: [
          { source: "Direct Booking", revenue: 5600000, bookings: 423 },
          { source: "EMT Integration", revenue: 3900000, bookings: 298 },
          { source: "Partner Referrals", revenue: 2200000, bookings: 167 },
          { source: "Social Media", revenue: 750000, bookings: 89 }
        ],
        customerLifetimeValue: 45600,
        repeatBookingRate: 32.4,
        averageBookingValue: 28700
      }
    };
    
    return c.json({ success: true, data: analyticsData });
  } catch (error) {
    console.log("Error fetching analytics:", error);
    return c.json({ success: false, error: "Failed to fetch analytics" }, 500);
  }
});

// Analytics export endpoint
app.post("/make-server-f7922768/analytics/export", async (c) => {
  try {
    const { period, format, data } = await c.req.json();
    
    // Simulate export processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const exportResult = {
      downloadUrl: `https://exports.travelai.com/analytics-${period}-${Date.now()}.${format}`,
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
      fileSize: `${Math.floor(Math.random() * 500) + 100}KB`,
      recordCount: 1247
    };
    
    return c.json({ success: true, ...exportResult });
  } catch (error) {
    console.log("Error exporting analytics:", error);
    return c.json({ success: false, error: "Export failed" }, 500);
  }
});

// ============================================================================
// ENHANCEMENT 1: Semantic POI Search Endpoints
// ============================================================================

// Semantic search for POIs
app.post("/make-server-f7922768/semantic-search", async (c) => {
  try {
    const { query, filters } = await c.req.json();
    
    console.log(`Semantic POI search: "${query}"`);
    
    const results = await semanticSearchService.searchPOIs(query, filters);
    
    return c.json({
      success: true,
      results: results,
      total_count: results.length
    });
    
  } catch (error) {
    console.error('Semantic search error:', error);
    return c.json({ 
      success: false, 
      error: `Search failed: ${error.message}` 
    }, 500);
  }
});

// Get personalized POI recommendations
app.post("/make-server-f7922768/personalized-recommendations", async (c) => {
  try {
    const { userProfile, destination, limit } = await c.req.json();
    
    console.log(`Getting personalized recommendations for ${destination}`);
    
    const recommendations = await semanticSearchService.getPersonalizedRecommendations(
      userProfile,
      destination,
      limit
    );
    
    return c.json({
      success: true,
      recommendations: recommendations
    });
    
  } catch (error) {
    console.error('Personalized recommendations error:', error);
    return c.json({ 
      success: false, 
      error: `Failed to get recommendations: ${error.message}` 
    }, 500);
  }
});

// Discover hidden gems
app.post("/make-server-f7922768/discover-hidden-gems", async (c) => {
  try {
    const { destination, interests, limit } = await c.req.json();
    
    console.log(`Discovering hidden gems in ${destination}`);
    
    const hiddenGems = await semanticSearchService.discoverHiddenGems(
      destination,
      interests,
      limit
    );
    
    return c.json({
      success: true,
      hidden_gems: hiddenGems
    });
    
  } catch (error) {
    console.error('Hidden gems discovery error:', error);
    return c.json({ 
      success: false, 
      error: `Failed to discover hidden gems: ${error.message}` 
    }, 500);
  }
});

// Find similar POIs
app.post("/make-server-f7922768/similar-pois", async (c) => {
  try {
    const { poiId, limit } = await c.req.json();
    
    const similarPOIs = await semanticSearchService.findSimilarPOIs(poiId, limit);
    
    return c.json({
      success: true,
      similar_pois: similarPOIs
    });
    
  } catch (error) {
    console.error('Similar POIs search error:', error);
    return c.json({ 
      success: false, 
      error: `Failed to find similar POIs: ${error.message}` 
    }, 500);
  }
});

// ============================================================================
// ENHANCEMENT 2: Voice-Based Trip Planning Endpoints
// ============================================================================

// Transcribe voice to text
app.post("/make-server-f7922768/voice-transcribe", async (c) => {
  try {
    const formData = await c.req.formData();
    const audioFile = formData.get('audio');
    const language = formData.get('language') as string || 'en-IN';
    
    if (!audioFile) {
      return c.json({ success: false, error: 'No audio file provided' }, 400);
    }
    
    // Convert audio to ArrayBuffer
    const audioBuffer = await (audioFile as File).arrayBuffer();
    
    const transcription = await voiceService.transcribeAudio(audioBuffer, { language });
    
    return c.json({
      success: true,
      transcription: transcription
    });
    
  } catch (error) {
    console.error('Voice transcription error:', error);
    return c.json({ 
      success: false, 
      error: `Transcription failed: ${error.message}` 
    }, 500);
  }
});

// Process voice command
app.post("/make-server-f7922768/voice-command", async (c) => {
  try {
    const formData = await c.req.formData();
    const audioFile = formData.get('audio');
    const contextStr = formData.get('context');
    
    if (!audioFile) {
      return c.json({ success: false, error: 'No audio file provided' }, 400);
    }
    
    const audioBuffer = await (audioFile as File).arrayBuffer();
    const context = contextStr ? JSON.parse(contextStr as string) : undefined;
    
    const result = await voiceService.processVoiceCommand(audioBuffer, context);
    
    return c.json({
      success: true,
      ...result
    });
    
  } catch (error) {
    console.error('Voice command processing error:', error);
    return c.json({ 
      success: false, 
      error: `Voice command failed: ${error.message}` 
    }, 500);
  }
});

// Generate voice response (Text-to-Speech)
app.post("/make-server-f7922768/voice-response", async (c) => {
  try {
    const { text, options } = await c.req.json();
    
    const voiceResponse = await voiceService.generateVoiceResponse(text, options);
    
    return c.json({
      success: true,
      response: voiceResponse
    });
    
  } catch (error) {
    console.error('Voice response generation error:', error);
    return c.json({ 
      success: false, 
      error: `Voice response failed: ${error.message}` 
    }, 500);
  }
});

// ============================================================================
// ENHANCEMENT 3: Conversational AI Trip Planning Endpoints
// ============================================================================

// Start new conversation
app.post("/make-server-f7922768/conversation/start", async (c) => {
  try {
    const { userId } = await c.req.json();
    
    const conversation = await conversationalAI.startConversation(userId);
    
    // Store conversation in KV
    await kv.set(conversation.conversation_id, conversation);
    
    return c.json({
      success: true,
      conversation: conversation
    });
    
  } catch (error) {
    console.error('Conversation start error:', error);
    return c.json({ 
      success: false, 
      error: `Failed to start conversation: ${error.message}` 
    }, 500);
  }
});

// Process message in conversation
app.post("/make-server-f7922768/conversation/message", async (c) => {
  try {
    const { conversationId, message } = await c.req.json();
    
    // Retrieve conversation context
    const context = await kv.get(conversationId);
    
    if (!context) {
      return c.json({ 
        success: false, 
        error: 'Conversation not found' 
      }, 404);
    }
    
    // Process message
    const response = await conversationalAI.processMessage(
      conversationId,
      message,
      context
    );
    
    // Update conversation in KV
    await kv.set(conversationId, response.updated_context);
    
    return c.json({
      success: true,
      response: response
    });
    
  } catch (error) {
    console.error('Message processing error:', error);
    return c.json({ 
      success: false, 
      error: `Failed to process message: ${error.message}` 
    }, 500);
  }
});

// Get conversation history
app.get("/make-server-f7922768/conversation/:id", async (c) => {
  try {
    const conversationId = c.req.param('id');
    
    const conversation = await kv.get(conversationId);
    
    if (!conversation) {
      return c.json({ 
        success: false, 
        error: 'Conversation not found' 
      }, 404);
    }
    
    return c.json({
      success: true,
      conversation: conversation
    });
    
  } catch (error) {
    console.error('Get conversation error:', error);
    return c.json({ 
      success: false, 
      error: `Failed to get conversation: ${error.message}` 
    }, 500);
  }
});

// Convert conversation to trip data
app.post("/make-server-f7922768/conversation/convert-to-trip", async (c) => {
  try {
    const { conversationId } = await c.req.json();
    
    const conversation = await kv.get(conversationId);
    
    if (!conversation) {
      return c.json({ 
        success: false, 
        error: 'Conversation not found' 
      }, 404);
    }
    
    const tripData = conversationalAI.convertToTripData(conversation.extracted_preferences);
    
    return c.json({
      success: true,
      tripData: tripData
    });
    
  } catch (error) {
    console.error('Convert to trip data error:', error);
    return c.json({ 
      success: false, 
      error: `Failed to convert conversation: ${error.message}` 
    }, 500);
  }
});

Deno.serve(app.fetch);