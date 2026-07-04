import {
  getDestinationMeta,
  getDayTheme,
  getActivityDescription,
} from './destination-pois.mjs';
import {
  searchHotels,
  searchAttractions,
  isGooglePlacesConfigured,
  buildGoogleMapsReviewUrl,
} from './google-places.mjs';
import { getFallbackHotels } from './hotel-data.mjs';

const STYLE_CONFIG = {
  relaxed: { startHour: 10, maxActivities: 2, lunchDuration: 2, activityDuration: 2.5, includeEvening: false, mealCostBase: 250 },
  moderate: { startHour: 9, maxActivities: 3, lunchDuration: 1.5, activityDuration: 2, includeEvening: false, mealCostBase: 350 },
  packed: { startHour: 8, maxActivities: 4, lunchDuration: 1, activityDuration: 1.5, includeEvening: true, mealCostBase: 400 },
};

const PRIORITY_CONFIG = {
  budget: { costMultiplier: 0.7, transportCost: 1200, accommodationTier: 'budget', activityCostBase: 150 },
  experience: { costMultiplier: 1.0, transportCost: 2000, accommodationTier: 'experience', activityCostBase: 300 },
  comfort: { costMultiplier: 1.4, transportCost: 4500, accommodationTier: 'comfort', activityCostBase: 500 },
};

const CATEGORY_INTEREST_MAP = {
  heritage: ['heritage', 'culture', 'monument'],
  adventure: ['adventure', 'wildlife', 'backwaters'],
  beaches: ['beach', 'scenic', 'backwaters'],
  nature: ['nature', 'scenic', 'garden', 'beach', 'backwaters'],
  spiritual: ['spiritual', 'wellness'],
  food: ['food', 'shopping'],
  nightlife: ['shopping', 'culture'],
  photography: ['scenic', 'heritage', 'monument', 'beach'],
  shopping: ['shopping'],
};

function scorePoi(poi, interests, priorityType) {
  let score = (poi.rating || 4) * 2 + Math.random() * 0.5;
  for (const interest of interests) {
    const categories = CATEGORY_INTEREST_MAP[interest] || [interest];
    if (categories.includes(poi.category)) score += 8;
  }
  if (priorityType === 'experience' && ['culture', 'heritage', 'backwaters'].includes(poi.category)) score += 4;
  if (priorityType === 'comfort' && ['scenic', 'heritage'].includes(poi.category)) score += 3;
  if (priorityType === 'budget' && poi.category === 'shopping') score += 2;
  return score;
}

function pickPoisForDay(pois, interests, priorityType, count, usedIds) {
  const available = pois.filter((p) => !usedIds.has(p.id));
  const pool = available.length >= count ? available : [...available, ...pois.filter((p) => !usedIds.has(p.id))];
  const sorted = [...pool].sort((a, b) => scorePoi(b, interests, priorityType) - scorePoi(a, interests, priorityType));
  const picked = [];
  for (const poi of sorted) {
    if (picked.length >= count) break;
    if (!usedIds.has(poi.id)) {
      picked.push(poi);
      usedIds.add(poi.id);
    }
  }
  return picked;
}

function formatTime(hour, minutes = 0) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60) || minutes;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function getTransportCost(transportPreference, priorityType) {
  const base = PRIORITY_CONFIG[priorityType]?.transportCost || 2000;
  const prefs = Array.isArray(transportPreference) ? transportPreference : ['train'];
  if (prefs.includes('flight')) return Math.round(base * 2);
  if (prefs.includes('car') && priorityType === 'comfort') return Math.round(base * 1.3);
  if (prefs.includes('train') && priorityType === 'budget') return Math.round(base * 0.7);
  return base;
}

export async function buildLiveContext(tripData) {
  const {
    destination,
    destinationMeta = {},
    interests = [],
    priorityType = 'experience',
    travelers = 2,
  } = tripData;

  const meta = getDestinationMeta(destination);
  const coords = destinationMeta.coordinates || meta.coords;

  let hotels = [];
  let livePois = [];
  let dataSources = ['local_poi_database'];

  if (isGooglePlacesConfigured()) {
    try {
      hotels = await searchHotels(destination, coords, priorityType, travelers);
      if (hotels.length) dataSources.push('Google Places Hotels');
    } catch (err) {
      console.warn('Hotel search failed:', err.message);
    }

    try {
      livePois = await searchAttractions(destination, coords, interests, 10);
      if (livePois.length) dataSources.push('Google Places Attractions');
    } catch (err) {
      console.warn('Attraction search failed:', err.message);
    }
  }

  if (!hotels.length) {
    hotels = getFallbackHotels(meta.key, priorityType, destination);
    dataSources.push('curated_hotel_database');
  }

  return { hotels, livePois, meta, coords, dataSources };
}

export function generateDynamicItinerary(tripData, liveContext) {
  const {
    destination,
    startDate,
    endDate,
    interests = [],
    budget = 25000,
    travelStyle = 'moderate',
    priorityType = 'experience',
    transportPreference = ['train'],
    hiddenGems = false,
    photographyFocus = false,
    travelers = 2,
  } = tripData;

  const { hotels, livePois, meta } = liveContext;
  const style = STYLE_CONFIG[travelStyle] || STYLE_CONFIG.moderate;
  const priority = PRIORITY_CONFIG[priorityType] || PRIORITY_CONFIG.experience;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  const contextPOIs = livePois.length >= style.maxActivities * days
    ? livePois
    : [...livePois, ...meta.pois.filter((p) => !livePois.some((l) => l.name === p.name))];

  const selectedHotel = hotels[0];
  const nights = Math.max(0, days - 1);
  const accommodationCostPerNight = selectedHotel.costPerNight;
  const totalAccommodationCost = accommodationCostPerNight * nights * Math.ceil(travelers / 2);

  const structuredItinerary = {
    title: `${days}-Day ${destination} — ${travelStyle.charAt(0).toUpperCase() + travelStyle.slice(1)} & ${priorityType.charAt(0).toUpperCase() + priorityType.slice(1)} Journey`,
    currency: 'INR',
    total_estimated_cost: 0,
    cost_breakdown: { transport: 0, accommodation: 0, activities: 0, meals: 0, other: 0 },
    days: [],
    accommodations: [],
    warnings: [],
    references: [],
    trip_inputs: buildTripInputs(tripData),
    personalization: {
      travel_style: travelStyle,
      priority_type: priorityType,
      activities_per_day: style.maxActivities,
      hotel_selected: selectedHotel.name,
    },
  };

  if (nights > 0) {
    structuredItinerary.accommodations.push({
      name: selectedHotel.name,
      type: selectedHotel.type,
      rating: selectedHotel.rating,
      reviews: selectedHotel.reviews,
      cost_per_night: accommodationCostPerNight,
      total_cost: totalAccommodationCost,
      address: selectedHotel.address,
      place_id: selectedHotel.placeId || null,
      google_review_url: selectedHotel.googleReviewUrl,
      source: selectedHotel.source,
      nights,
      travelers,
    });
  }

  let totalCost = 0;
  const costBreakdown = { transport: 0, accommodation: totalAccommodationCost, activities: 0, meals: 0, other: 0 };
  const usedPOIs = new Set();

  for (let dayNum = 1; dayNum <= days; dayNum++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + dayNum - 1);
    const dateStr = currentDate.toISOString().split('T')[0];
    const daySegments = [];
    let dayTotalCost = 0;
    let currentTime = style.startHour;

    const activityCount = travelStyle === 'relaxed' ? 2 : travelStyle === 'packed' ? style.maxActivities : 3;
    const dayPois = pickPoisForDay(contextPOIs, interests, priorityType, activityCount, usedPOIs);

    for (let i = 0; i < dayPois.length; i++) {
      const poi = dayPois[i];
      const activityCost = Math.round(
        (priority.activityCostBase + Math.floor(Math.random() * 200)) * priority.costMultiplier
      );
      const duration = style.activityDuration;

      daySegments.push({
        start_time: formatTime(currentTime),
        end_time: formatTime(currentTime + duration),
        activity_type: 'visit',
        title: poi.name,
        poi_id: poi.id,
        location: { name: poi.name, lat: poi.lat, lon: poi.lon, address: poi.address },
        estimated_cost: activityCost,
        booking_offer_id: `offer_${poi.id}_${Date.now()}_${i}`,
        notes: buildActivityNotes(poi, tripData, i),
        rating: poi.rating,
        google_review_url: poi.googleReviewUrl,
        source: poi.source || 'local_database',
      });
      dayTotalCost += activityCost;
      costBreakdown.activities += activityCost;
      currentTime += duration;

      if (i < dayPois.length - 1 || dayNum <= days) {
        const lunchCost = Math.round(style.mealCostBase * priority.costMultiplier * (travelStyle === 'packed' ? 0.8 : 1));
        if (i === 0 || (i === 1 && travelStyle !== 'packed')) {
          daySegments.push({
            start_time: formatTime(currentTime),
            end_time: formatTime(currentTime + style.lunchDuration),
            activity_type: 'meal',
            title: i === 0 ? `${meta.cuisine}` : 'Local café break',
            poi_id: null,
            location: { name: `${meta.cuisine} — ${destination}`, lat: poi.lat + 0.001, lon: poi.lon + 0.001 },
            estimated_cost: lunchCost,
            booking_offer_id: `meal_${Date.now()}_${dayNum}_${i}`,
            notes: priorityType === 'experience' ? 'Authentic local eatery recommended' : null,
          });
          dayTotalCost += lunchCost;
          costBreakdown.meals += lunchCost;
          currentTime += style.lunchDuration;
        }
      }
    }

    if (style.includeEvening && currentTime + 2 <= 21) {
      const eveningPois = pickPoisForDay(contextPOIs, interests, priorityType, 1, usedPOIs);
      if (eveningPois[0]) {
        const poi = eveningPois[0];
        const eveningCost = Math.round(priority.activityCostBase * 0.8 * priority.costMultiplier);
        daySegments.push({
          start_time: formatTime(currentTime),
          end_time: formatTime(currentTime + 2),
          activity_type: 'visit',
          title: poi.name,
          poi_id: poi.id,
          location: { name: poi.name, lat: poi.lat, lon: poi.lon },
          estimated_cost: eveningCost,
          booking_offer_id: `offer_eve_${poi.id}_${dayNum}`,
          notes: interests.includes('nightlife') ? 'Evening market or cultural show' : 'Sunset viewpoint visit',
          time_of_day: 'evening',
        });
        dayTotalCost += eveningCost;
        costBreakdown.activities += eveningCost;
      }
    }

    structuredItinerary.days.push({
      date: dateStr,
      segments: daySegments,
      day_total_cost: dayTotalCost,
      day_theme: getDayTheme(interests, dayNum - 1, meta.themes),
    });
    totalCost += dayTotalCost;
  }

  const transportCost = getTransportCost(transportPreference, priorityType) * travelers;
  costBreakdown.transport = transportCost;
  totalCost += totalAccommodationCost + transportCost;

  structuredItinerary.total_estimated_cost = totalCost;
  structuredItinerary.cost_breakdown = costBreakdown;

  if (totalCost > budget) {
    structuredItinerary.warnings.push(
      `Estimated ₹${totalCost.toLocaleString('en-IN')} exceeds your ₹${budget.toLocaleString('en-IN')} budget. Consider a ${priorityType === 'comfort' ? 'budget' : 'relaxed'} style or fewer days.`
    );
  }

  contextPOIs.forEach((poi) => {
    structuredItinerary.references.push({ type: 'poi', id: poi.id, source: poi.source || 'local_database' });
  });

  return structuredItinerary;
}

function buildActivityNotes(poi, tripData, index) {
  const notes = [];
  if (tripData.hiddenGems && index === 0) notes.push('Hidden gem with local guide');
  if (tripData.photographyFocus && ['scenic', 'heritage', 'monument'].includes(poi.category)) {
    notes.push('Perfect for photography — golden hour timing');
  }
  if (tripData.priorityType === 'experience') notes.push('Curated local experience');
  return notes.length ? notes.join(' · ') : null;
}

function buildTripInputs(tripData) {
  return {
    destination: tripData.destination,
    dates: { start: tripData.startDate, end: tripData.endDate },
    budget: tripData.budget,
    travelers: tripData.travelers,
    interests: tripData.interests || [],
    travel_style: tripData.travelStyle || 'moderate',
    priority: tripData.priorityType || 'experience',
    transport: tripData.transportPreference || ['train'],
    accommodation_type: tripData.accommodationType,
    hidden_gems: tripData.hiddenGems,
    photography_focus: tripData.photographyFocus,
    destination_meta: tripData.destinationMeta || null,
  };
}

export function convertDynamicToDisplay(structured, tripData, liveContext) {
  const data = tripData || {};
  const destination = data.destination || 'India';
  const interests = data.interests || [];
  const meta = liveContext?.meta || getDestinationMeta(destination);
  const nights = Math.max(0, structured.days.length - 1);

  const poiMap = {};
  const allPois = [...(liveContext?.livePois || []), ...meta.pois];
  allPois.forEach((p) => { poiMap[p.id] = p; });

  const travelStyleLabels = { relaxed: 'Relaxed pace', moderate: 'Balanced pace', packed: 'Adventure-packed' };
  const priorityLabels = { budget: 'Budget-focused', experience: 'Experience-rich', comfort: 'Comfort-first' };

  return {
    title: structured.title,
    destination,
    totalDays: structured.days.length,
    totalCost: structured.total_estimated_cost,
    currency: structured.currency,
    accommodationCost: structured.cost_breakdown.accommodation,
    transportCost: structured.cost_breakdown.transport,
    activityCost: structured.cost_breakdown.activities,
    mealCost: structured.cost_breakdown.meals,
    tripInputs: structured.trip_inputs,
    personalization: structured.personalization,
    dataSources: liveContext?.dataSources || ['local_database'],
    accommodations: (structured.accommodations || []).map((acc) => ({
      name: acc.name,
      type: acc.type,
      costPerNight: acc.cost_per_night,
      totalCost: acc.total_cost,
      rating: acc.rating,
      reviewCount: acc.reviews,
      address: acc.address,
      googleReviewUrl: acc.google_review_url,
      placeId: acc.place_id,
      source: acc.source,
      nights: acc.nights,
      bookingOfferId: `acc_${acc.place_id || Date.now()}`,
    })),
    transport: [{
      types: data.transportPreference || ['train'],
      totalCost: structured.cost_breakdown.transport,
      bookingOfferId: `trans_${Date.now()}`,
      description: buildTransportDescription(data.transportPreference, data.priorityType),
    }],
    days: structured.days.map((day, index) => ({
      dayNumber: index + 1,
      date: day.date,
      activities: day.segments
        .filter((seg) => seg.activity_type === 'visit')
        .map((seg) => {
          const poi = poiMap[seg.poi_id];
          return {
            id: seg.booking_offer_id || `activity_${Date.now()}`,
            startTime: seg.start_time,
            endTime: seg.end_time,
            activity: seg.title,
            type: poi?.category || seg.activity_type,
            location: seg.location?.address || `${seg.location?.name || seg.title}, ${destination}`,
            estimatedCost: seg.estimated_cost,
            bookingOfferId: seg.booking_offer_id,
            description: poi ? getActivityDescription(poi, destination, interests) : `Explore ${seg.title} in ${destination}.`,
            isBookable: true,
            notes: seg.notes,
            rating: seg.rating || poi?.rating,
            reviewCount: poi?.reviews,
            googleReviewUrl: seg.google_review_url || poi?.googleReviewUrl,
            hiddenGem: !!seg.notes?.toLowerCase().includes('hidden gem'),
            photoOpportunity: data.photographyFocus && ['scenic', 'heritage'].includes(poi?.category) ? 'Excellent' : undefined,
            timeOfDay: seg.time_of_day,
          };
        }),
      meals: day.segments
        .filter((seg) => seg.activity_type === 'meal')
        .map((seg) => ({
          title: seg.title,
          time: `${seg.start_time} - ${seg.end_time}`,
          cost: seg.estimated_cost,
        })),
      dayTheme: day.day_theme || getDayTheme(interests, index, meta.themes),
      estimatedBudget: day.day_total_cost,
    })),
    preferencesSummary: {
      travelStyle: data.travelStyle,
      travelStyleLabel: travelStyleLabels[data.travelStyle] || data.travelStyle,
      priority: data.priorityType,
      priorityLabel: priorityLabels[data.priorityType] || data.priorityType,
      interests: interests.map((i) => i.replace('-', ' ')),
    },
    bookingSummary: {
      totalActivities: structured.days.reduce((sum, day) => sum + day.segments.filter((s) => s.activity_type === 'visit').length, 0),
      totalBookings: structured.days.reduce((sum, day) => sum + day.segments.length, 0) + (nights > 0 ? 2 : 1),
      estimatedSavings: Math.floor(structured.total_estimated_cost * (data.priorityType === 'budget' ? 0.15 : 0.1)),
    },
    warnings: structured.warnings,
  };
}

function buildTransportDescription(transportPreference, priorityType) {
  const prefs = Array.isArray(transportPreference) ? transportPreference : ['train'];
  const mode = prefs.includes('flight') ? 'flights' : prefs.includes('car') ? 'private car' : 'train';
  const tier = priorityType === 'comfort' ? 'Premium' : priorityType === 'budget' ? 'Economy' : 'Standard';
  return `${tier} ${mode} transfers between destinations and daily local transport`;
}