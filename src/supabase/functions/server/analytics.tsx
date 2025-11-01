// Analytics service for BigQuery-ready data structures
// This simulates what would be stored in BigQuery tables for production analytics

interface UserPreferences {
  interests: string[];
  budget_per_person: number;
  travel_style: string;
  priority_type: string;
  cultural_immersion: number;
  adventure_level: number;
  nightlife_importance: number;
  accommodation_type: string;
  transport_preference: string[];
  meal_preferences: string[];
  language: string;
}

interface GenerationMetrics {
  total_cost: number;
  days_count: number;
  segments_count: number;
  budget_compliance: boolean;
  warnings_count: number;
  poi_diversity_score: number;
  personalization_score: number;
  generated_at: string;
  generation_time_ms: number;
}

interface BookingMetrics {
  booking_id: string;
  itinerary_id: string;
  booking_type: 'complete_itinerary' | 'individual_activity';
  total_amount: number;
  discount_applied: number;
  payment_method: string;
  booking_status: 'confirmed' | 'failed' | 'cancelled';
  booking_duration_ms: number;
  supplier_confirmations: number;
  rollback_required: boolean;
  booked_at: string;
}

interface ItineraryAnalytics {
  itin_id: string;
  user_id: string | null;
  destination: string;
  starts_on: string;
  ends_on: string;
  currency: string;
  total_estimated_cost: number;
  status: 'draft' | 'confirmed' | 'booked' | 'cancelled';
  user_preferences: UserPreferences;
  generation_metrics: GenerationMetrics;
  booking_metrics?: BookingMetrics;
}

// BigQuery table schemas (DDL ready)
export const BIGQUERY_SCHEMAS = {
  users: `
    CREATE TABLE \`project.dataset.users\` (
      user_id STRING,
      created_at TIMESTAMP,
      prefs JSON,
      default_currency STRING,
      total_bookings INT64,
      total_spent NUMERIC,
      preferred_destinations ARRAY<STRING>,
      last_active TIMESTAMP
    )
    PARTITION BY DATE(created_at)
    CLUSTER BY user_id;
  `,

  pois: `
    CREATE TABLE \`project.dataset.pois\` (
      poi_id STRING,
      name STRING,
      lat FLOAT64,
      lon FLOAT64,
      categories ARRAY<STRING>,
      opening_hours STRING,
      popularity FLOAT64,
      source STRING,
      city STRING,
      state STRING,
      country STRING,
      booking_conversion_rate FLOAT64,
      average_rating FLOAT64,
      review_count INT64,
      updated_at TIMESTAMP
    )
    CLUSTER BY city, categories;
  `,

  itineraries: `
    CREATE TABLE \`project.dataset.itineraries\` (
      itin_id STRING,
      user_id STRING,
      created_at TIMESTAMP,
      starts_on DATE,
      ends_on DATE,
      destination STRING,
      currency STRING,
      total_estimated_cost NUMERIC,
      json_itinerary STRING,
      status STRING,
      user_preferences JSON,
      generation_metrics JSON,
      booking_id STRING,
      booked_at TIMESTAMP
    )
    PARTITION BY DATE(created_at)
    CLUSTER BY destination, status;
  `,

  bookings: `
    CREATE TABLE \`project.dataset.bookings\` (
      booking_id STRING,
      itin_id STRING,
      user_id STRING,
      offer_id STRING,
      supplier_id STRING,
      booked_at TIMESTAMP,
      status STRING,
      external_ref STRING,
      price NUMERIC,
      currency STRING,
      booking_type STRING,
      payment_method STRING,
      confirmation_code STRING,
      cancelled_at TIMESTAMP,
      cancellation_reason STRING
    )
    PARTITION BY DATE(booked_at)
    CLUSTER BY supplier_id, status;
  `,

  supplier_performance: `
    CREATE TABLE \`project.dataset.supplier_performance\` (
      supplier_id STRING,
      date DATE,
      hold_requests INT64,
      hold_success_rate FLOAT64,
      confirmation_requests INT64,
      confirmation_success_rate FLOAT64,
      average_response_time_ms INT64,
      total_revenue NUMERIC,
      currency STRING,
      error_rate FLOAT64,
      cancellation_rate FLOAT64
    )
    PARTITION BY date
    CLUSTER BY supplier_id;
  `
};

// Analytics queries for production insights
export const ANALYTICS_QUERIES = {
  // Cost breakdown analysis
  costBreakdownByDestination: `
    WITH itinerary_costs AS (
      SELECT 
        destination,
        JSON_EXTRACT_SCALAR(json_itinerary, '$.cost_breakdown.accommodation') AS accommodation_cost,
        JSON_EXTRACT_SCALAR(json_itinerary, '$.cost_breakdown.transport') AS transport_cost,
        JSON_EXTRACT_SCALAR(json_itinerary, '$.cost_breakdown.activities') AS activities_cost,
        JSON_EXTRACT_SCALAR(json_itinerary, '$.cost_breakdown.meals') AS meals_cost,
        total_estimated_cost
      FROM \`project.dataset.itineraries\`
      WHERE DATE(created_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    )
    SELECT
      destination,
      COUNT(*) as itinerary_count,
      AVG(CAST(accommodation_cost AS NUMERIC)) as avg_accommodation_cost,
      AVG(CAST(transport_cost AS NUMERIC)) as avg_transport_cost,
      AVG(CAST(activities_cost AS NUMERIC)) as avg_activities_cost,
      AVG(CAST(meals_cost AS NUMERIC)) as avg_meals_cost,
      AVG(total_estimated_cost) as avg_total_cost
    FROM itinerary_costs
    GROUP BY destination
    ORDER BY itinerary_count DESC
  `,

  // Budget compliance analysis
  budgetComplianceRate: `
    WITH budget_analysis AS (
      SELECT
        i.itin_id,
        i.total_estimated_cost,
        JSON_EXTRACT_SCALAR(i.user_preferences, '$.budget_per_person') AS user_budget,
        CASE 
          WHEN i.total_estimated_cost <= CAST(JSON_EXTRACT_SCALAR(i.user_preferences, '$.budget_per_person') AS NUMERIC) 
          THEN 1 ELSE 0 
        END as budget_compliant
      FROM \`project.dataset.itineraries\` i
      WHERE DATE(created_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
    )
    SELECT
      COUNT(*) as total_itineraries,
      SUM(budget_compliant) as compliant_itineraries,
      SAFE_DIVIDE(SUM(budget_compliant), COUNT(*)) as compliance_rate,
      AVG(CAST(user_budget AS NUMERIC)) as avg_user_budget,
      AVG(total_estimated_cost) as avg_generated_cost
    FROM budget_analysis
  `,

  // Popular POIs by booking conversion
  topPOIsByConversion: `
    SELECT 
      p.name,
      p.city,
      p.categories,
      COUNT(b.booking_id) as total_bookings,
      COUNT(DISTINCT i.itin_id) as total_itineraries_featured,
      SAFE_DIVIDE(COUNT(b.booking_id), COUNT(DISTINCT i.itin_id)) as booking_conversion_rate,
      AVG(b.price) as avg_booking_price
    FROM \`project.dataset.pois\` p
    JOIN \`project.dataset.itineraries\` i ON JSON_SEARCH(i.json_itinerary, 'one', p.poi_id) IS NOT NULL
    LEFT JOIN \`project.dataset.bookings\` b ON b.offer_id LIKE CONCAT('%', p.poi_id, '%')
    WHERE DATE(i.created_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    GROUP BY p.poi_id, p.name, p.city, p.categories
    HAVING total_itineraries_featured >= 10
    ORDER BY booking_conversion_rate DESC
    LIMIT 20
  `,

  // Supplier performance metrics
  supplierPerformanceMetrics: `
    SELECT
      supplier_id,
      DATE_TRUNC(booked_at, WEEK) as week,
      COUNT(*) as total_bookings,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as successful_bookings,
      SAFE_DIVIDE(SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END), COUNT(*)) as success_rate,
      AVG(price) as avg_booking_value,
      SUM(price) as total_revenue
    FROM \`project.dataset.bookings\`
    WHERE DATE(booked_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL 8 WEEK)
    GROUP BY supplier_id, week
    ORDER BY week DESC, total_revenue DESC
  `,

  // User preference trends
  userPreferenceTrends: `
    WITH preference_analysis AS (
      SELECT
        DATE_TRUNC(created_at, WEEK) as week,
        JSON_EXTRACT_ARRAY(user_preferences, '$.interests') as interests,
        JSON_EXTRACT_SCALAR(user_preferences, '$.priority_type') as priority_type,
        JSON_EXTRACT_SCALAR(user_preferences, '$.travel_style') as travel_style,
        CAST(JSON_EXTRACT_SCALAR(user_preferences, '$.budget_per_person') AS NUMERIC) as budget_per_person
      FROM \`project.dataset.itineraries\`
      WHERE DATE(created_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 WEEK)
    )
    SELECT
      week,
      priority_type,
      travel_style,
      COUNT(*) as itinerary_count,
      AVG(budget_per_person) as avg_budget,
      APPROX_QUANTILES(budget_per_person, 4)[OFFSET(2)] as median_budget
    FROM preference_analysis
    GROUP BY week, priority_type, travel_style
    ORDER BY week DESC, itinerary_count DESC
  `,

  // Real-time booking success metrics
  realtimeBookingMetrics: `
    SELECT
      DATE(booked_at) as booking_date,
      COUNT(*) as total_booking_attempts,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as successful_bookings,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_bookings,
      SAFE_DIVIDE(SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END), COUNT(*)) as success_rate,
      SUM(CASE WHEN status = 'confirmed' THEN price ELSE 0 END) as confirmed_revenue
    FROM \`project.dataset.bookings\`
    WHERE DATE(booked_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
    GROUP BY booking_date
    ORDER BY booking_date DESC
  `
};

// Analytics helper functions
export function generateAnalyticsRecord(itineraryRecord: any, bookingRecord?: any): ItineraryAnalytics {
  const { tripData, structuredItinerary, analytics } = itineraryRecord;
  
  return {
    itin_id: itineraryRecord.id,
    user_id: null, // Would be populated with actual user ID in production
    destination: tripData.destination,
    starts_on: tripData.startDate,
    ends_on: tripData.endDate,
    currency: structuredItinerary.currency,
    total_estimated_cost: structuredItinerary.total_estimated_cost,
    status: itineraryRecord.status,
    user_preferences: {
      interests: tripData.interests,
      budget_per_person: tripData.budget,
      travel_style: tripData.travelStyle,
      priority_type: tripData.priorityType,
      cultural_immersion: tripData.culturalImmersion,
      adventure_level: tripData.adventureLevel,
      nightlife_importance: tripData.nightlifeImportance,
      accommodation_type: tripData.accommodationType,
      transport_preference: tripData.transportPreference,
      meal_preferences: tripData.mealPreferences,
      language: tripData.language
    },
    generation_metrics: {
      total_cost: structuredItinerary.total_estimated_cost,
      days_count: structuredItinerary.days.length,
      segments_count: structuredItinerary.days.reduce((sum: number, day: any) => sum + day.segments.length, 0),
      budget_compliance: structuredItinerary.total_estimated_cost <= tripData.budget,
      warnings_count: structuredItinerary.warnings.length,
      poi_diversity_score: calculatePOIDiversityScore(structuredItinerary),
      personalization_score: calculatePersonalizationScore(tripData, structuredItinerary),
      generated_at: itineraryRecord.createdAt,
      generation_time_ms: 2000 // Simulated
    },
    booking_metrics: bookingRecord ? {
      booking_id: bookingRecord.id,
      itinerary_id: itineraryRecord.id,
      booking_type: bookingRecord.bookingType,
      total_amount: bookingRecord.finalAmount,
      discount_applied: bookingRecord.discountApplied,
      payment_method: 'card',
      booking_status: bookingRecord.status,
      booking_duration_ms: 5000, // Simulated
      supplier_confirmations: bookingRecord.confirmedBookings?.length || 0,
      rollback_required: bookingRecord.status === 'failed',
      booked_at: bookingRecord.createdAt
    } : undefined
  };
}

function calculatePOIDiversityScore(structuredItinerary: any): number {
  const allPOIIds = structuredItinerary.days
    .flatMap((day: any) => day.segments)
    .filter((segment: any) => segment.poi_id)
    .map((segment: any) => segment.poi_id);
  
  const uniquePOIs = new Set(allPOIIds);
  return uniquePOIs.size / Math.max(allPOIIds.length, 1);
}

function calculatePersonalizationScore(tripData: any, structuredItinerary: any): number {
  let score = 0;
  
  // Check interest matching
  const interestKeywords = tripData.interests.join(' ').toLowerCase();
  const activityTitles = structuredItinerary.days
    .flatMap((day: any) => day.segments)
    .map((segment: any) => segment.title.toLowerCase())
    .join(' ');
  
  // Simple keyword matching for demonstration
  if (interestKeywords.includes('heritage') && activityTitles.includes('fort')) score += 0.2;
  if (interestKeywords.includes('food') && activityTitles.includes('cuisine')) score += 0.2;
  if (tripData.hiddenGems && structuredItinerary.days.some((day: any) => 
    day.segments.some((seg: any) => seg.notes?.includes('Hidden gem')))) score += 0.3;
  
  // Budget alignment
  if (structuredItinerary.total_estimated_cost <= tripData.budget * 1.1) score += 0.3;
  
  return Math.min(score, 1.0);
}

// Export analytics data for BigQuery ingestion
export function prepareForBigQueryIngestion(analyticsRecord: ItineraryAnalytics) {
  return {
    // Flatten nested objects for BigQuery
    itin_id: analyticsRecord.itin_id,
    user_id: analyticsRecord.user_id,
    destination: analyticsRecord.destination,
    starts_on: analyticsRecord.starts_on,
    ends_on: analyticsRecord.ends_on,
    currency: analyticsRecord.currency,
    total_estimated_cost: analyticsRecord.total_estimated_cost,
    status: analyticsRecord.status,
    user_preferences: JSON.stringify(analyticsRecord.user_preferences),
    generation_metrics: JSON.stringify(analyticsRecord.generation_metrics),
    booking_metrics: analyticsRecord.booking_metrics ? JSON.stringify(analyticsRecord.booking_metrics) : null,
    created_at: new Date().toISOString()
  };
}