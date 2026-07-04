const DESTINATION_META = {
  jaipur: {
    state: 'Rajasthan',
    cuisine: 'Rajasthani thali',
    accommodation: 'Heritage haveli',
    themes: ['heritage', 'culture', 'forts'],
    coords: { lat: 26.9124, lon: 75.7873 },
    pois: [
      { id: 'poi_amber_fort', name: 'Amber Fort', lat: 26.9855, lon: 75.8513, category: 'heritage', description: 'Magnificent hilltop fort with mirror palace and elephant rides.' },
      { id: 'poi_city_palace', name: 'City Palace', lat: 26.9255, lon: 75.8213, category: 'heritage', description: 'Royal residence blending Rajput and Mughal architecture.' },
      { id: 'poi_hawa_mahal', name: 'Hawa Mahal', lat: 26.9239, lon: 75.8267, category: 'heritage', description: 'Iconic pink facade with 953 windows for royal women to observe street life.' },
      { id: 'poi_jantar_mantar', name: 'Jantar Mantar', lat: 26.9246, lon: 75.8241, category: 'heritage', description: 'UNESCO astronomical observatory with massive sundials.' },
      { id: 'poi_johari_bazaar', name: 'Johari Bazaar', lat: 26.9246, lon: 75.8267, category: 'shopping', description: 'Famous jewellery and textile market in the old city.' },
    ],
  },
  goa: {
    state: 'Goa',
    cuisine: 'Goan fish curry',
    accommodation: 'Beach resort',
    themes: ['beaches', 'nightlife', 'portuguese heritage'],
    coords: { lat: 15.2993, lon: 74.1240 },
    pois: [
      { id: 'poi_baga', name: 'Baga Beach', lat: 15.5551, lon: 73.7515, category: 'beach', description: 'Lively beach with water sports, shacks, and sunset views.' },
      { id: 'poi_fort_aguada', name: 'Fort Aguada', lat: 15.4923, lon: 73.7734, category: 'heritage', description: '17th-century Portuguese fort overlooking the Arabian Sea.' },
      { id: 'poi_old_goa', name: 'Basilica of Bom Jesus', lat: 15.5007, lon: 73.9116, category: 'heritage', description: 'UNESCO church holding St. Francis Xavier relics.' },
      { id: 'poi_dudhsagar', name: 'Dudhsagar Falls', lat: 15.3144, lon: 74.3144, category: 'nature', description: 'Four-tiered waterfall trek through Bhagwan Mahavir sanctuary.' },
      { id: 'poi_anjuna', name: 'Anjuna Flea Market', lat: 15.5794, lon: 73.7428, category: 'shopping', description: 'Wednesday flea market with handicrafts and bohemian vibe.' },
    ],
  },
  mumbai: {
    state: 'Maharashtra',
    cuisine: 'vada pav and street food',
    accommodation: 'Boutique city hotel',
    themes: ['urban culture', 'heritage', 'food'],
    coords: { lat: 19.0760, lon: 72.8777 },
    pois: [
      { id: 'poi_gateway', name: 'Gateway of India', lat: 18.9220, lon: 72.8347, category: 'heritage', description: 'Iconic arch monument on the waterfront built in 1924.' },
      { id: 'poi_marine_drive', name: 'Marine Drive', lat: 18.9432, lon: 72.8230, category: 'scenic', description: 'Queen\'s Necklace promenade — perfect evening stroll.' },
      { id: 'poi_elephanta', name: 'Elephanta Caves', lat: 18.9633, lon: 72.9315, category: 'heritage', description: 'Ancient rock-cut cave temples dedicated to Lord Shiva.' },
      { id: 'poi_csmvs', name: 'Chhatrapati Shivaji Museum', lat: 18.9280, lon: 72.8321, category: 'culture', description: 'Premier museum with Indus Valley and Mughal artefacts.' },
      { id: 'poi_colaba', name: 'Colaba Causeway', lat: 18.9155, lon: 72.8270, category: 'shopping', description: 'Bustling street market for antiques, clothes, and snacks.' },
    ],
  },
  delhi: {
    state: 'Delhi',
    cuisine: 'Mughlai cuisine',
    accommodation: 'Central Delhi hotel',
    themes: ['heritage', 'monuments', 'food'],
    coords: { lat: 28.6139, lon: 77.2090 },
    pois: [
      { id: 'poi_red_fort', name: 'Red Fort', lat: 28.6562, lon: 77.2410, category: 'heritage', description: 'Mughal fortress and UNESCO site — Independence Day flag hoisting venue.' },
      { id: 'poi_qutub', name: 'Qutub Minar', lat: 28.5245, lon: 77.1855, category: 'heritage', description: 'Tallest brick minaret in the world at 73 metres.' },
      { id: 'poi_india_gate', name: 'India Gate', lat: 28.6129, lon: 77.2295, category: 'monument', description: 'War memorial arch honouring Indian soldiers.' },
      { id: 'poi_humayun', name: "Humayun's Tomb", lat: 28.5933, lon: 77.2507, category: 'heritage', description: 'Mughal garden tomb that inspired the Taj Mahal.' },
      { id: 'poi_chandni', name: 'Chandni Chowk', lat: 28.6506, lon: 77.2303, category: 'food', description: 'Historic market lane famous for parathas and Old Delhi chaos.' },
    ],
  },
  udaipur: {
    state: 'Rajasthan',
    cuisine: 'Mewari cuisine',
    accommodation: 'Lake-view palace hotel',
    themes: ['lakes', 'romance', 'heritage'],
    coords: { lat: 24.5854, lon: 73.7125 },
    pois: [
      { id: 'poi_lake_pichola', name: 'Lake Pichola Boat Ride', lat: 24.5712, lon: 73.6835, category: 'scenic', description: 'Sunset boat cruise past Lake Palace and Jag Mandir.' },
      { id: 'poi_city_palace_ud', name: 'City Palace Udaipur', lat: 24.5760, lon: 73.6835, category: 'heritage', description: 'Sprawling palace complex with museums and rooftop views.' },
      { id: 'poi_jag_mandir', name: 'Jag Mandir', lat: 24.5700, lon: 73.6800, category: 'heritage', description: 'Island palace on Lake Pichola with marble elephants.' },
      { id: 'poi_saheliyon', name: 'Saheliyon Ki Bari', lat: 24.6020, lon: 73.6860, category: 'garden', description: 'Garden of maidens with fountains and lotus pools.' },
      { id: 'poi_sajjangarh', name: 'Sajjangarh Monsoon Palace', lat: 24.5935, lon: 73.6395, category: 'scenic', description: 'Hilltop palace with panoramic Aravalli sunset views.' },
    ],
  },
  manali: {
    state: 'Himachal Pradesh',
    cuisine: 'Himachali dham',
    accommodation: 'Mountain lodge',
    themes: ['adventure', 'mountains', 'snow'],
    coords: { lat: 32.2432, lon: 77.1892 },
    pois: [
      { id: 'poi_rohtang', name: 'Rohtang Pass', lat: 32.3717, lon: 77.2486, category: 'adventure', description: 'High-altitude pass with snow activities and glacier views.' },
      { id: 'poi_solang', name: 'Solang Valley', lat: 32.3150, lon: 77.1580, category: 'adventure', description: 'Paragliding, zorbing, and skiing in season.' },
      { id: 'poi_hadimba', name: 'Hadimba Temple', lat: 32.2483, lon: 77.1890, category: 'spiritual', description: 'Ancient wooden temple in deodar forest.' },
      { id: 'poi_old_manali', name: 'Old Manali Village', lat: 32.2550, lon: 77.1820, category: 'culture', description: 'Café-lined lanes with Israeli bakeries and river walks.' },
      { id: 'poi_vashisht', name: 'Vashisht Hot Springs', lat: 32.2650, lon: 77.1780, category: 'wellness', description: 'Natural sulphur springs and ancient temple.' },
    ],
  },
  kerala: {
    state: 'Kerala',
    cuisine: 'Kerala sadya on banana leaf',
    accommodation: 'Backwater houseboat',
    themes: ['backwaters', 'nature', 'ayurveda'],
    coords: { lat: 9.4981, lon: 76.3388 },
    pois: [
      { id: 'poi_alleppey', name: 'Alleppey Houseboat Cruise', lat: 9.4981, lon: 76.3388, category: 'backwaters', description: 'Overnight houseboat through palm-fringed canals.' },
      { id: 'poi_munnar', name: 'Munnar Tea Gardens', lat: 10.0889, lon: 77.0595, category: 'nature', description: 'Rolling tea estates and Eravikulam National Park.' },
      { id: 'poi_fort_kochi', name: 'Fort Kochi Heritage Walk', lat: 9.9647, lon: 76.2420, category: 'heritage', description: 'Chinese fishing nets, synagogues, and colonial lanes.' },
      { id: 'poi_periyar', name: 'Periyar Wildlife Sanctuary', lat: 9.4670, lon: 77.1480, category: 'wildlife', description: 'Boat safari to spot elephants and hornbills.' },
      { id: 'poi_kovalam', name: 'Kovalam Beach', lat: 8.4004, lon: 76.9787, category: 'beach', description: 'Crescent beach with lighthouse and ayurveda centres.' },
    ],
  },
  rishikesh: {
    state: 'Uttarakhand',
    cuisine: 'organic café fare',
    accommodation: 'Riverside ashram stay',
    themes: ['yoga', 'rafting', 'spiritual'],
    coords: { lat: 30.0869, lon: 78.2676 },
    pois: [
      { id: 'poi_rafting', name: 'Ganges River Rafting', lat: 30.0869, lon: 78.2676, category: 'adventure', description: 'Grade III-IV rapids on the holy Ganges.' },
      { id: 'poi_laxman', name: 'Laxman Jhula', lat: 30.1265, lon: 78.3303, category: 'spiritual', description: 'Suspension bridge and spiritual hub on the Ganges.' },
      { id: 'poi_triveni', name: 'Triveni Ghat Aarti', lat: 30.1038, lon: 78.2948, category: 'spiritual', description: 'Evening Ganga aarti ceremony with lamps and chanting.' },
      { id: 'poi_neelkanth', name: 'Neelkanth Mahadev Temple', lat: 30.0830, lon: 78.3580, category: 'spiritual', description: 'Sacred Shiva temple in forested hills.' },
      { id: 'poi_beatles', name: 'Beatles Ashram', lat: 30.1190, lon: 78.3152, category: 'culture', description: 'Abandoned ashram with graffiti art and meditation halls.' },
    ],
  },
  hampi: {
    state: 'Karnataka',
    cuisine: 'South Indian meals',
    accommodation: 'Heritage guesthouse',
    themes: ['ruins', 'bouldering', 'history'],
    coords: { lat: 15.3350, lon: 76.4600 },
    pois: [
      { id: 'poi_virupaksha', name: 'Virupaksha Temple', lat: 15.3350, lon: 76.4600, category: 'heritage', description: 'Active 7th-century temple at the heart of Hampi bazaar.' },
      { id: 'poi_vittala', name: 'Vittala Temple', lat: 15.3420, lon: 76.4750, category: 'heritage', description: 'Stone chariot and musical pillars — Hampi\'s most photographed site.' },
      { id: 'poi_matanga', name: 'Matanga Hill Sunrise', lat: 15.3300, lon: 76.4680, category: 'scenic', description: 'Panoramic sunrise hike over boulder-strewn landscape.' },
      { id: 'poi_lotus', name: 'Lotus Mahal', lat: 15.3180, lon: 76.4710, category: 'heritage', description: 'Indo-Islamic pavilion in the Zenana enclosure.' },
      { id: 'poi_tungabhadra', name: 'Tungabhadra Coracle Ride', lat: 15.3355, lon: 76.4620, category: 'adventure', description: 'Traditional round boat across the river to ancient sites.' },
    ],
  },
  coorg: {
    state: 'Karnataka',
    cuisine: 'Coorgi pandi curry',
    accommodation: 'Coffee estate homestay',
    themes: ['coffee', 'nature', 'trekking'],
    coords: { lat: 12.3375, lon: 75.8069 },
    pois: [
      { id: 'poi_abbey', name: 'Abbey Falls', lat: 12.4560, lon: 75.7230, category: 'nature', description: 'Coffee plantation waterfall surrounded by spice estates.' },
      { id: 'poi_raja_seat', name: 'Raja\'s Seat', lat: 12.4140, lon: 75.7340, category: 'scenic', description: 'Sunset viewpoint once favoured by Kodava kings.' },
      { id: 'poi_dubare', name: 'Dubare Elephant Camp', lat: 12.3700, lon: 75.9000, category: 'wildlife', description: 'Interact with elephants and enjoy river bathing sessions.' },
      { id: 'poi_talacauvery', name: 'Talacauvery', lat: 12.3810, lon: 75.5080, category: 'spiritual', description: 'Origin of the Cauvery river — sacred pilgrimage site.' },
      { id: 'poi_coffee', name: 'Coffee Plantation Tour', lat: 12.3375, lon: 75.8069, category: 'culture', description: 'Walk through estates and learn bean-to-cup processing.' },
    ],
  },
};

const ALIASES = {
  jaipur: 'jaipur', 'pink city': 'jaipur',
  goa: 'goa', panaji: 'goa', 'north goa': 'goa',
  mumbai: 'mumbai', bombay: 'mumbai',
  delhi: 'delhi', 'new delhi': 'delhi', ncr: 'delhi',
  udaipur: 'udaipur', 'city of lakes': 'udaipur',
  manali: 'manali', kullu: 'manali',
  kerala: 'kerala', kochi: 'kerala', cochin: 'kerala', alleppey: 'kerala', allepey: 'kerala', munnar: 'kerala', 'kerala backwaters': 'kerala',
  rishikesh: 'rishikesh', haridwar: 'rishikesh',
  hampi: 'hampi',
  coorg: 'coorg', kodagu: 'coorg',
};

const INTEREST_THEMES = {
  heritage: ['Heritage & Monuments', 'Cultural Discovery', 'Royal History'],
  adventure: ['Adventure Day', 'Outdoor Thrills', 'Active Exploration'],
  nature: ['Nature & Scenery', 'Wildlife & Greenery', 'Eco Discovery'],
  beaches: ['Beach & Coast', 'Sun & Sand', 'Coastal Vibes'],
  nightlife: ['Evening Entertainment', 'Night Markets', 'Social Scene'],
  photography: ['Golden Hour Spots', 'Scenic Frames', 'Photo Walk'],
  spiritual: ['Spiritual Journey', 'Temple Trail', 'Mindful Moments'],
  food: ['Culinary Trail', 'Local Flavours', 'Street Food Safari'],
  shopping: ['Market Hop', 'Local Crafts', 'Bazaar Day'],
};

export function resolveDestinationKey(destination = '') {
  const normalized = destination.toLowerCase().trim();
  if (ALIASES[normalized]) return ALIASES[normalized];
  for (const [alias, key] of Object.entries(ALIASES)) {
    if (normalized.includes(alias)) return key;
  }
  for (const key of Object.keys(DESTINATION_META)) {
    if (normalized.includes(key)) return key;
  }
  return null;
}

export function getDestinationMeta(destination) {
  const key = resolveDestinationKey(destination);
  if (key && DESTINATION_META[key]) {
    return { key, ...DESTINATION_META[key] };
  }
  return {
    key: 'custom',
    state: destination,
    cuisine: 'local specialties',
    accommodation: 'Boutique hotel',
    themes: ['exploration', 'discovery', 'local culture'],
    coords: { lat: 20.5937, lon: 78.9629 },
    pois: [
      { id: 'poi_city_tour', name: `${destination} City Highlights`, lat: 20.5937, lon: 78.9629, category: 'culture', description: `Guided tour of top attractions in ${destination}.` },
      { id: 'poi_local_market', name: `${destination} Local Market`, lat: 20.5940, lon: 78.9630, category: 'shopping', description: `Explore bazaars and street food in ${destination}.` },
      { id: 'poi_heritage_walk', name: `${destination} Heritage Walk`, lat: 20.5935, lon: 78.9625, category: 'heritage', description: `Discover historic neighbourhoods of ${destination}.` },
      { id: 'poi_viewpoint', name: `${destination} Scenic Viewpoint`, lat: 20.5945, lon: 78.9635, category: 'scenic', description: `Best panoramic views over ${destination}.` },
      { id: 'poi_cultural_show', name: `${destination} Cultural Experience`, lat: 20.5930, lon: 78.9620, category: 'culture', description: `Evening folk performance and local cuisine in ${destination}.` },
    ],
  };
}

export function getPoisForDestination(destination) {
  return getDestinationMeta(destination).pois;
}

export function getDayTheme(interests, dayIndex, destinationThemes) {
  const themes = [];
  for (const interest of interests) {
    if (INTEREST_THEMES[interest]) themes.push(...INTEREST_THEMES[interest]);
  }
  if (!themes.length) themes.push(...destinationThemes);
  return themes[dayIndex % themes.length] || 'Exploration';
}

export function getActivityDescription(poi, destination, interests) {
  const interestHint = interests.length ? ` tailored for ${interests.slice(0, 2).join(' & ')} lovers` : '';
  return poi.description || `Discover ${poi.name} in ${destination}${interestHint}.`;
}