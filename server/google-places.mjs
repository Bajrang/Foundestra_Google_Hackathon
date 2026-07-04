const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

function extractState(address = '') {
  for (const state of INDIAN_STATES) {
    if (address.includes(state)) return state;
  }
  return 'India';
}

function generateTags(types = [], query = '') {
  const tags = new Set();
  const mapping = {
    tourist_attraction: ['tourism', 'sightseeing'],
    natural_feature: ['nature', 'scenic'],
    hindu_temple: ['spiritual', 'heritage', 'temple'],
    museum: ['heritage', 'culture', 'history'],
    park: ['nature', 'outdoor', 'relaxation'],
    locality: ['city', 'culture'],
  };

  for (const type of types) {
    (mapping[type] || []).forEach((tag) => tags.add(tag));
  }

  for (const tag of ['heritage', 'beach', 'adventure', 'spiritual', 'nature', 'nightlife', 'food']) {
    if (query.toLowerCase().includes(tag)) tags.add(tag);
  }

  return [...tags];
}

function estimateBudget(priceLevel, type) {
  const base = 15000;
  return base * (priceLevel || 2);
}

function estimateDuration(type) {
  const map = {
    beach: '4-5 days',
    mountain: '5-7 days',
    heritage: '2-3 days',
    temple: '1-2 days',
    city: '3-5 days',
  };
  return map[type] || '3-4 days';
}

function determineType(types = []) {
  if (types.includes('natural_feature')) return 'beach';
  if (types.includes('hindu_temple') || types.includes('place_of_worship')) return 'temple';
  if (types.includes('museum') || types.includes('landmark')) return 'heritage';
  if (types.includes('locality')) return 'city';
  return 'general';
}

async function fetchPlaceDetails(placeId, apiKey) {
  const fields = 'name,formatted_address,geometry,rating,user_ratings_total,types,editorial_summary,price_level';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.status === 'OK' ? data.result : null;
}

async function fetchNearbyAttractions(lat, lng, apiKey) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=tourist_attraction&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK' || !data.results) return [];
  return data.results.slice(0, 5).map((place) => place.name);
}

export function isGooglePlacesConfigured() {
  return !!process.env.GOOGLE_MAPS_API_KEY;
}

export function buildGoogleMapsReviewUrl(placeId, name, address) {
  if (placeId) {
    return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  }
  const query = encodeURIComponent(`${name || ''} ${address || ''}`.trim());
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function estimateHotelCost(priceLevel, priorityType, travelers) {
  const base = priorityType === 'budget' ? 1200 : priorityType === 'comfort' ? 8000 : 3500;
  const multiplier = (priceLevel || 2) * 0.5 + 0.5;
  return Math.round(base * multiplier * Math.max(1, Math.ceil(travelers / 2)));
}

function mapPriorityToHotelQuery(priorityType) {
  if (priorityType === 'budget') return 'budget hotel hostel';
  if (priorityType === 'comfort') return 'luxury hotel 5 star resort';
  return 'boutique hotel heritage stay';
}

export async function searchHotels(destination, coords, priorityType = 'experience', travelers = 2) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return [];

  const hotelQuery = mapPriorityToHotelQuery(priorityType);
  const query = `${hotelQuery} in ${destination} India`;
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=lodging&key=${apiKey}`;

  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Places Hotels: ${searchData.status}`);
  }
  if (!searchData.results?.length) return [];

  const hotels = [];
  for (const place of searchData.results.slice(0, 3)) {
    const details = await fetchPlaceDetails(place.place_id, apiKey);
    const name = details?.name || place.name;
    const address = details?.formatted_address || place.formatted_address || `${destination}, India`;
    const rating = details?.rating || place.rating || 4.0;
    const reviews = details?.user_ratings_total || place.user_ratings_total || 0;
    const costPerNight = estimateHotelCost(details?.price_level ?? place.price_level, priorityType, travelers);

    hotels.push({
      name,
      type: priorityType === 'budget' ? 'budget hotel' : priorityType === 'comfort' ? 'luxury hotel' : 'boutique hotel',
      rating,
      reviews,
      costPerNight,
      address,
      placeId: place.place_id,
      googleReviewUrl: buildGoogleMapsReviewUrl(place.place_id, name, address),
      lat: details?.geometry?.location?.lat || place.geometry?.location?.lat || coords?.lat,
      lon: details?.geometry?.location?.lng || place.geometry?.location?.lng || coords?.lon,
      source: 'Google Places API',
    });
  }

  return hotels;
}

export async function searchAttractions(destination, coords, interests = [], limit = 8) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || !coords?.lat) return [];

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.lat},${coords.lon}&radius=15000&type=tourist_attraction&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK' || !data.results?.length) return [];

  const interestTypeMap = {
    heritage: ['museum', 'landmark', 'place_of_worship', 'hindu_temple'],
    adventure: ['park', 'natural_feature', 'amusement_park'],
    nature: ['park', 'natural_feature'],
    spiritual: ['place_of_worship', 'hindu_temple'],
    food: ['restaurant', 'cafe'],
    nightlife: ['night_club', 'bar'],
    photography: ['tourist_attraction', 'park', 'landmark'],
    shopping: ['shopping_mall', 'store'],
  };

  const scored = data.results.map((place) => {
    let score = place.rating || 3.5;
    for (const interest of interests) {
      const types = interestTypeMap[interest] || [];
      if (place.types?.some((t) => types.includes(t))) score += 2;
    }
    return { place, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ place }, i) => ({
    id: `live_poi_${place.place_id}`,
    name: place.name,
    lat: place.geometry.location.lat,
    lon: place.geometry.location.lng,
    category: determineType(place.types),
    description: `${place.name} is a highly rated attraction near ${destination}${place.rating ? ` (${place.rating}★ from ${place.user_ratings_total || 0} reviews)` : ''}.`,
    rating: place.rating,
    reviews: place.user_ratings_total,
    placeId: place.place_id,
    googleReviewUrl: buildGoogleMapsReviewUrl(place.place_id, place.name, place.vicinity),
    source: 'Google Places API',
  }));
}

export async function searchDestinations(query) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return [];

  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(`${query} India tourism`)}&key=${apiKey}`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Places API: ${searchData.status} ${searchData.error_message || ''}`);
  }

  if (!searchData.results?.length) return [];

  const suggestions = [];
  for (const place of searchData.results.slice(0, 6)) {
    const details = await fetchPlaceDetails(place.place_id, apiKey);
    const name = details?.name || place.name;
    const state = extractState(details?.formatted_address || place.formatted_address || '');
    const type = determineType(details?.types || place.types || []);
    const tags = generateTags(details?.types || place.types || [], query);
    const highlights = await fetchNearbyAttractions(
      details?.geometry?.location?.lat || place.geometry.location.lat,
      details?.geometry?.location?.lng || place.geometry.location.lng,
      apiKey
    );

    suggestions.push({
      name,
      state,
      country: 'India',
      tags,
      estimatedCost: estimateBudget(details?.price_level, type),
      duration: estimateDuration(type),
      bestSeason: 'Oct-Mar',
      description: details?.editorial_summary?.overview || `${name} is a popular destination in ${state}, known for ${tags.slice(0, 3).join(', ') || 'tourism'}.`,
      highlights: highlights.length ? highlights : [name],
      coordinates: {
        lat: details?.geometry?.location?.lat || place.geometry.location.lat,
        lon: details?.geometry?.location?.lng || place.geometry.location.lng,
      },
      rating: details?.rating || place.rating,
      isAIEnhanced: true,
      aiReason: `Live result from Google Places for "${query}"`,
      aiInsight: highlights[0] ? `Popular nearby: ${highlights[0]}` : undefined,
      dataSource: 'Google Places API',
      googlePlaceId: place.place_id,
    });
  }

  return suggestions;
}