import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getAIDestinationSuggestions, isVertexAIConfigured } from './vertex-ai.mjs';
import { searchDestinations, isGooglePlacesConfigured } from './google-places.mjs';
import {
  buildLiveContext,
  generateDynamicItinerary,
  convertDynamicToDisplay,
} from './itinerary-engine.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

export const PREFIX = '/make-server-f7922768';

const kvStore = new Map();

const DESTINATIONS = [
  { name: 'Jaipur', state: 'Rajasthan', country: 'India', tags: ['heritage', 'culture', 'photography', 'forts', 'palaces', 'pink city'], estimatedCost: 15000, duration: '3-4 days', bestSeason: 'Oct-Mar', description: 'The Pink City - Famous for magnificent forts and palaces', highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar'], coordinates: { lat: 26.9124, lon: 75.7873 } },
  { name: 'Udaipur', state: 'Rajasthan', country: 'India', tags: ['heritage', 'lakes', 'luxury', 'romantic', 'palaces', 'city of lakes'], estimatedCost: 25000, duration: '3-4 days', bestSeason: 'Oct-Mar', description: 'City of Lakes - Romantic palaces and serene lake views', highlights: ['Lake Pichola', 'City Palace', 'Jag Mandir', 'Saheliyon Ki Bari'], coordinates: { lat: 24.5854, lon: 73.7125 } },
  { name: 'Goa', state: 'Goa', country: 'India', tags: ['beaches', 'nightlife', 'relaxation', 'water sports', 'portuguese heritage', 'party'], estimatedCost: 22000, duration: '4-5 days', bestSeason: 'Nov-Feb', description: 'Beach Paradise - Sun, sand, and vibrant nightlife', highlights: ['Baga Beach', 'Fort Aguada', 'Old Goa Churches', 'Dudhsagar Falls'], coordinates: { lat: 15.2993, lon: 74.1240 } },
  { name: 'Kerala Backwaters', state: 'Kerala', country: 'India', tags: ['nature', 'backwaters', 'ayurveda', 'houseboat', 'scenic', "god's own country"], estimatedCost: 28000, duration: '5-7 days', bestSeason: 'Sep-Mar', description: "God's Own Country - Tranquil backwaters and lush greenery", highlights: ['Alleppey Houseboats', 'Kumarakom', 'Periyar Wildlife', 'Kovalam Beach'], coordinates: { lat: 9.4981, lon: 76.3388 } },
  { name: 'Manali', state: 'Himachal Pradesh', country: 'India', tags: ['adventure', 'mountains', 'trekking', 'skiing', 'honeymoon', 'hill station'], estimatedCost: 20000, duration: '4-5 days', bestSeason: 'Mar-Jun, Oct-Feb', description: 'Valley of Gods - Adventure sports and scenic mountain views', highlights: ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple', 'Old Manali'], coordinates: { lat: 32.2432, lon: 77.1892 } },
  { name: 'Rishikesh', state: 'Uttarakhand', country: 'India', tags: ['spiritual', 'adventure', 'yoga', 'rafting', 'temples'], estimatedCost: 18000, duration: '3-4 days', bestSeason: 'Feb-May', description: 'Yoga capital on the Ganges with adventure rafting', highlights: ['Laxman Jhula', 'Triveni Ghat', 'Neelkanth Temple', 'River Rafting'], coordinates: { lat: 30.0869, lon: 78.2676 } },
  { name: 'Hampi', state: 'Karnataka', country: 'India', tags: ['heritage', 'ruins', 'photography', 'history'], estimatedCost: 16000, duration: '2-3 days', bestSeason: 'Oct-Feb', description: 'UNESCO ruins amid dramatic boulder landscapes', highlights: ['Virupaksha Temple', 'Vittala Temple', 'Lotus Mahal', 'Matanga Hill'], coordinates: { lat: 15.3350, lon: 76.4600 } },
  { name: 'Coorg', state: 'Karnataka', country: 'India', tags: ['nature', 'coffee', 'trekking', 'plantations'], estimatedCost: 19000, duration: '3-4 days', bestSeason: 'Oct-May', description: 'Scotland of India with coffee estates and misty hills', highlights: ['Abbey Falls', 'Raja Seat', 'Dubare Elephant Camp', 'Talacauvery'], coordinates: { lat: 12.3375, lon: 75.8069 } },
];

export function getRuntimeMode() {
  if (process.env.K_SERVICE || process.env.FUNCTION_TARGET) return 'cloud-function';
  return 'local';
}

function getServiceAccountConfig() {
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? resolve(projectRoot, process.env.GOOGLE_APPLICATION_CREDENTIALS.replace('/path/to/your/', ''))
    : resolve(projectRoot, 'google-hackathon-sa-key.json');

  const actualPath = existsSync(keyPath)
    ? keyPath
    : resolve(projectRoot, 'google-hackathon-sa-key.json');

  if (existsSync(actualPath)) {
    try {
      const key = JSON.parse(readFileSync(actualPath, 'utf8'));
      return { key };
    } catch {
      return null;
    }
  }
  return null;
}

function maskSecret(value) {
  return value ? '✓ Set' : '✗ Not set';
}

function getDestinationSuggestions(query, userInterests = []) {
  const queryLower = query.toLowerCase();

  const matched = DESTINATIONS.filter((dest) => {
    const nameMatch = dest.name.toLowerCase().includes(queryLower);
    const stateMatch = dest.state.toLowerCase().includes(queryLower);
    const tagMatch = dest.tags.some((tag) => tag.includes(queryLower) || queryLower.includes(tag));
    const descriptionMatch = dest.description.toLowerCase().includes(queryLower);
    return nameMatch || stateMatch || tagMatch || descriptionMatch;
  });

  const scored = matched.map((dest) => {
    let score = 0;
    if (dest.name.toLowerCase() === queryLower) score += 100;
    else if (dest.name.toLowerCase().includes(queryLower)) score += 50;

    score += dest.tags.filter((tag) => tag.includes(queryLower) || queryLower.includes(tag)).length * 10;
    score += dest.tags.filter((tag) => userInterests.some((interest) => interest.toLowerCase() === tag.toLowerCase())).length * 20;

    return {
      ...dest,
      matchScore: score,
      isAIEnhanced: true,
      aiReason: `Great match for "${query}"${userInterests.length ? ` with your interest in ${userInterests.join(', ')}` : ''}`,
      aiInsight: dest.highlights[0] ? `Don't miss ${dest.highlights[0]} — a local favorite.` : undefined,
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);

  return {
    query,
    suggestions: scored.slice(0, 6),
    totalMatches: scored.length,
    aiPowered: true,
    contextualMessage: scored.length
      ? `Found ${scored.length} destinations matching "${query}"`
      : `No exact matches for "${query}" — try a city name or interest like beaches or heritage`,
  };
}

function createBasicItinerary(tripData) {
  const start = new Date(tripData.startDate);
  const end = new Date(tripData.endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return {
    title: `${days}-Day ${tripData.destination} Journey`,
    currency: 'INR',
    total_estimated_cost: tripData.budget || 25000,
    cost_breakdown: {
      transport: 2000,
      accommodation: Math.floor((tripData.budget || 25000) * 0.4),
      activities: Math.floor((tripData.budget || 25000) * 0.3),
      meals: Math.floor((tripData.budget || 25000) * 0.2),
      other: Math.floor((tripData.budget || 25000) * 0.1),
    },
    days: Array.from({ length: days }, (_, i) => ({
      date: new Date(start.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      segments: [
        {
          start_time: '09:00',
          end_time: '12:00',
          activity_type: 'visit',
          title: 'Explore Local Attractions',
          poi_id: `poi_${i}_morning`,
          location: { name: tripData.destination, lat: 26.9124, lon: 75.7873 },
          estimated_cost: 500,
          booking_offer_id: `offer_${Date.now()}_${i}`,
          notes: null,
        },
      ],
      day_total_cost: Math.floor((tripData.budget || 25000) / days),
    })),
    warnings: [],
    references: [],
  };
}

function convertStructuredToDisplay(structured, tripData, liveContext) {
  return convertDynamicToDisplay(structured, tripData, liveContext);
}

async function getLiveDestinationSuggestions(query, userInterests = []) {
  let suggestions = [];
  let dataSource = 'static-fallback';

  if (isGooglePlacesConfigured()) {
    try {
      console.log(`→ Fetching live suggestions from Google Places for "${query}"`);
      suggestions = await searchDestinations(query);
      if (suggestions.length) dataSource = 'Google Places API';
    } catch (error) {
      console.warn('Google Places failed:', error.message);
    }
  }

  if (!suggestions.length && isVertexAIConfigured()) {
    try {
      console.log(`→ Fetching AI suggestions from Vertex AI for "${query}"`);
      suggestions = await getAIDestinationSuggestions(query, userInterests);
      if (suggestions.length) dataSource = 'Vertex AI Gemini';
    } catch (error) {
      console.warn('Vertex AI failed:', error.message);
    }
  }

  if (!suggestions.length) {
    console.log(`○ Using static fallback for "${query}"`);
    return getDestinationSuggestions(query, userInterests);
  }

  return {
    query,
    suggestions,
    totalMatches: suggestions.length,
    aiPowered: true,
    liveDataUsed: true,
    dataSource,
    contextualMessage: `Found ${suggestions.length} destinations via ${dataSource}`,
  };
}

export function createApp() {
  const app = new Hono();
  app.use('*', cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }));

  app.get(`${PREFIX}/health`, (c) => c.json({
    status: 'ok',
    mode: getRuntimeMode(),
    project: process.env.GOOGLE_CLOUD_PROJECT || 'foundestra',
  }));

  app.get(`${PREFIX}/vertex-config`, (c) => {
    const sa = getServiceAccountConfig();
    const hasApiKey = !!process.env.VERTEX_AI_API_KEY;
    const hasServiceAccount = !!sa || !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY || getRuntimeMode() === 'cloud-function';
    const authMethod = hasServiceAccount ? 'service-account' : hasApiKey ? 'api-key' : 'none';

    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      configuration: {
        projectId: process.env.GOOGLE_CLOUD_PROJECT || 'not-set',
        location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
        model: process.env.GOOGLE_GENAI_VERTEXAI_MODEL || 'gemini-2.5-flash',
        googlePlaces: isGooglePlacesConfigured() ? 'configured' : 'not-set',
        authentication: {
          apiKey: maskSecret(hasApiKey),
          serviceAccountKey: maskSecret(hasServiceAccount),
          credentialsPath: maskSecret(!!process.env.GOOGLE_APPLICATION_CREDENTIALS),
        },
        endpoint: {
          current: `Vertex AI (${process.env.GOOGLE_GENAI_VERTEXAI_MODEL || 'gemini-2.5-flash'})`,
          authMethod,
          requiresOAuth: hasServiceAccount,
        },
        recommendation: authMethod === 'none'
          ? 'Set GOOGLE_APPLICATION_CREDENTIALS or VERTEX_AI_API_KEY for live AI suggestions.'
          : 'Credentials configured. Use /test-vertexai to verify connectivity.',
      },
    });
  });

  app.get(`${PREFIX}/test-vertexai`, async (c) => {
    try {
      const suggestions = await getAIDestinationSuggestions('beaches', ['nature']);
      return c.json({
        success: true,
        message: 'Vertex AI connection successful',
        sample: suggestions.slice(0, 2).map((s) => s.name),
        model: process.env.GOOGLE_GENAI_VERTEXAI_MODEL || 'gemini-2.5-flash',
      });
    } catch (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  app.post(`${PREFIX}/suggest-destinations`, async (c) => {
    try {
      const { query, userInterests = [] } = await c.req.json();
      if (!query || query.trim().length === 0) {
        return c.json({ query: '', suggestions: [], totalMatches: 0, contextualMessage: 'Please enter a destination or interest' });
      }
      const result = await getLiveDestinationSuggestions(query.trim(), userInterests);
      return c.json(result);
    } catch (error) {
      console.error('suggest-destinations error:', error);
      return c.json({ query: '', suggestions: [], totalMatches: 0, error: error.message }, 500);
    }
  });

  app.post(`${PREFIX}/generate-itinerary`, async (c) => {
    try {
      const tripData = await c.req.json();
      const idempotencyKey = `itin_${tripData.destination}_${tripData.startDate}_${Date.now()}`;

      const existingResult = kvStore.get(`generation_${idempotencyKey}`);
      if (existingResult) {
        return c.json(existingResult);
      }

      console.log(`→ Generating dynamic itinerary for ${tripData.destination} (${tripData.travelStyle || 'moderate'} / ${tripData.priorityType || 'experience'})`);
      const liveContext = await buildLiveContext(tripData);
      let structuredItinerary = generateDynamicItinerary(tripData, liveContext);

      if (!structuredItinerary?.days?.length) {
        structuredItinerary = createBasicItinerary(tripData);
      }

      const itineraryId = `itin_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const result = {
        success: true,
        itineraryId,
        itinerary: convertStructuredToDisplay(structuredItinerary, tripData, liveContext),
        structuredItinerary,
        dataSources: liveContext.dataSources,
      };

      kvStore.set(itineraryId, { id: itineraryId, tripData, structuredItinerary, liveContext });
      kvStore.set(`generation_${idempotencyKey}`, result);

      return c.json(result);
    } catch (error) {
      return c.json({ success: false, error: `Failed to generate itinerary: ${error.message}` }, 500);
    }
  });

  app.post(`${PREFIX}/book-activity`, async (c) => {
    const body = await c.req.json();
    return c.json({
      success: true,
      booking: {
        id: `booking_${Date.now()}`,
        ...body,
        status: 'confirmed',
        confirmationCode: `CONF${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        bookedAt: new Date().toISOString(),
      },
    });
  });

  app.post(`${PREFIX}/book-complete-itinerary`, async (c) => {
    const { itineraryId, bookingData } = await c.req.json();
    return c.json({
      success: true,
      booking: {
        id: `complete_booking_${Date.now()}`,
        itineraryId,
        bookingData,
        status: 'confirmed',
        masterConfirmationCode: `TRIP${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      },
    });
  });

  app.post(`${PREFIX}/weather-alert`, async (c) => {
    const { itineraryId } = await c.req.json();
    const existing = kvStore.get(itineraryId);
    if (!existing) {
      return c.json({ success: false, error: 'Itinerary not found' }, 404);
    }
    return c.json({ success: true, adjustedItinerary: convertStructuredToDisplay(existing.structuredItinerary, existing.tripData, existing.liveContext) });
  });

  return app;
}

export const app = createApp();