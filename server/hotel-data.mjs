const HOTELS_BY_DESTINATION = {
  jaipur: {
    budget: [
      { name: 'Hotel Pearl Palace', type: 'guesthouse', rating: 4.2, reviews: 1840, costPerNight: 1400, address: 'Hari Kishan Somani Marg, Jaipur' },
      { name: 'Zostel Jaipur', type: 'hostel', rating: 4.4, reviews: 2100, costPerNight: 900, address: 'MI Road, Jaipur' },
    ],
    experience: [
      { name: 'Umaid Bhawan Heritage House', type: 'heritage haveli', rating: 4.6, reviews: 980, costPerNight: 3200, address: 'Bani Park, Jaipur' },
      { name: 'Shahpura House', type: 'boutique hotel', rating: 4.5, reviews: 1250, costPerNight: 3800, address: 'Durgapura, Jaipur' },
    ],
    comfort: [
      { name: 'Rambagh Palace', type: 'luxury palace hotel', rating: 4.8, reviews: 3200, costPerNight: 18000, address: 'Bhawani Singh Road, Jaipur' },
      { name: 'ITC Rajputana', type: 'luxury hotel', rating: 4.6, reviews: 4500, costPerNight: 9500, address: 'Palace Road, Jaipur' },
    ],
  },
  goa: {
    budget: [
      { name: 'The Lost Hostel Anjuna', type: 'hostel', rating: 4.3, reviews: 890, costPerNight: 800, address: 'Anjuna, North Goa' },
      { name: 'Casa Vagator', type: 'beach shack stay', rating: 4.1, reviews: 620, costPerNight: 1500, address: 'Vagator Beach Road, Goa' },
    ],
    experience: [
      { name: 'W Goa', type: 'beach resort', rating: 4.5, reviews: 2800, costPerNight: 6500, address: 'Vagator Beach, Goa' },
      { name: 'Marquis Beach Resort', type: 'boutique resort', rating: 4.4, reviews: 1100, costPerNight: 4200, address: 'Candolim, Goa' },
    ],
    comfort: [
      { name: 'Taj Exotica Resort & Spa', type: 'luxury resort', rating: 4.7, reviews: 5100, costPerNight: 22000, address: 'Benaulim Beach, South Goa' },
      { name: 'Grand Hyatt Goa', type: 'luxury hotel', rating: 4.6, reviews: 3800, costPerNight: 14000, address: 'Bambolim, Goa' },
    ],
  },
  mumbai: {
    budget: [
      { name: 'Hotel Suba Palace', type: 'budget hotel', rating: 4.0, reviews: 1450, costPerNight: 1800, address: 'Marine Drive, Mumbai' },
      { name: 'Zostel Mumbai', type: 'hostel', rating: 4.2, reviews: 980, costPerNight: 1100, address: 'Andheri West, Mumbai' },
    ],
    experience: [
      { name: 'The Taj Mahal Palace', type: 'heritage hotel', rating: 4.7, reviews: 8900, costPerNight: 12000, address: 'Apollo Bunder, Colaba' },
      { name: 'Abode Bombay', type: 'boutique hotel', rating: 4.5, reviews: 720, costPerNight: 5500, address: 'Fort, Mumbai' },
    ],
    comfort: [
      { name: 'The Oberoi Mumbai', type: 'luxury hotel', rating: 4.8, reviews: 4200, costPerNight: 18000, address: 'Nariman Point, Mumbai' },
      { name: 'Trident Nariman Point', type: 'luxury hotel', rating: 4.6, reviews: 3600, costPerNight: 11000, address: 'Nariman Point, Mumbai' },
    ],
  },
  delhi: {
    budget: [
      { name: 'Hotel Godwin Deluxe', type: 'budget hotel', rating: 4.1, reviews: 2100, costPerNight: 1600, address: 'Paharganj, New Delhi' },
      { name: 'Zostel Delhi', type: 'hostel', rating: 4.3, reviews: 1500, costPerNight: 950, address: 'Connaught Place, Delhi' },
    ],
    experience: [
      { name: 'The Imperial New Delhi', type: 'heritage hotel', rating: 4.6, reviews: 3400, costPerNight: 8500, address: 'Janpath, New Delhi' },
      { name: 'Haveli Dharampura', type: 'heritage haveli', rating: 4.5, reviews: 890, costPerNight: 4800, address: 'Chandni Chowk, Old Delhi' },
    ],
    comfort: [
      { name: 'The Leela Palace New Delhi', type: 'luxury hotel', rating: 4.8, reviews: 5200, costPerNight: 20000, address: 'Chanakyapuri, New Delhi' },
      { name: 'Taj Palace New Delhi', type: 'luxury hotel', rating: 4.7, reviews: 4800, costPerNight: 15000, address: 'Diplomatic Enclave, Delhi' },
    ],
  },
  udaipur: {
    budget: [
      { name: 'Mewar Haveli', type: 'guesthouse', rating: 4.3, reviews: 780, costPerNight: 1800, address: 'Lake Pichola, Udaipur' },
      { name: 'Zostel Udaipur', type: 'hostel', rating: 4.4, reviews: 1100, costPerNight: 850, address: 'Ambamata, Udaipur' },
    ],
    experience: [
      { name: 'Jagat Niwas Palace Hotel', type: 'lake-view hotel', rating: 4.5, reviews: 2100, costPerNight: 4500, address: 'Lake Pichola, Udaipur' },
      { name: 'Amet Haveli', type: 'heritage hotel', rating: 4.6, reviews: 980, costPerNight: 5200, address: 'Lake Pichola, Udaipur' },
    ],
    comfort: [
      { name: 'Taj Lake Palace', type: 'luxury palace hotel', rating: 4.9, reviews: 4100, costPerNight: 35000, address: 'Lake Pichola Island, Udaipur' },
      { name: 'The Oberoi Udaivilas', type: 'luxury resort', rating: 4.8, reviews: 3800, costPerNight: 28000, address: 'Haridasji Ki Magri, Udaipur' },
    ],
  },
  manali: {
    budget: [
      { name: 'Zostel Manali', type: 'hostel', rating: 4.4, reviews: 1600, costPerNight: 700, address: 'Old Manali, Himachal Pradesh' },
      { name: 'Hotel Mountain Top', type: 'budget lodge', rating: 4.1, reviews: 540, costPerNight: 1500, address: 'Mall Road, Manali' },
    ],
    experience: [
      { name: 'The Himalayan', type: 'mountain resort', rating: 4.5, reviews: 890, costPerNight: 4200, address: 'Hadimba Road, Manali' },
      { name: 'Johnson Lodge & Spa', type: 'boutique lodge', rating: 4.4, reviews: 720, costPerNight: 3800, address: 'Log Huts Area, Manali' },
    ],
    comfort: [
      { name: 'Span Resort & Spa', type: 'luxury resort', rating: 4.6, reviews: 1200, costPerNight: 12000, address: 'Kullu-Manali Highway' },
      { name: 'Manu Allaya Resort', type: 'luxury resort', rating: 4.5, reviews: 980, costPerNight: 9000, address: 'Sunny Side, Manali' },
    ],
  },
  kerala: {
    budget: [
      { name: 'Green House Homestay', type: 'homestay', rating: 4.3, reviews: 620, costPerNight: 1200, address: 'Fort Kochi, Kerala' },
      { name: 'Zostel Alleppey', type: 'hostel', rating: 4.2, reviews: 480, costPerNight: 900, address: 'Alleppey, Kerala' },
    ],
    experience: [
      { name: 'Punnamada Resort', type: 'backwater resort', rating: 4.5, reviews: 1400, costPerNight: 5500, address: 'Alleppey Backwaters, Kerala' },
      { name: 'Brunton Boatyard', type: 'heritage hotel', rating: 4.6, reviews: 1100, costPerNight: 7500, address: 'Fort Kochi, Kerala' },
    ],
    comfort: [
      { name: 'Kumarakom Lake Resort', type: 'luxury resort', rating: 4.8, reviews: 2800, costPerNight: 18000, address: 'Kumarakom, Kerala' },
      { name: 'Taj Bekal Resort & Spa', type: 'luxury resort', rating: 4.7, reviews: 1900, costPerNight: 15000, address: 'Bekal, Kerala' },
    ],
  },
  rishikesh: {
    budget: [
      { name: 'Zostel Rishikesh', type: 'hostel', rating: 4.4, reviews: 1300, costPerNight: 650, address: 'Tapovan, Rishikesh' },
      { name: 'Hotel Ganga Kinare', type: 'riverside hotel', rating: 4.2, reviews: 890, costPerNight: 1800, address: 'Bharat Nagar, Rishikesh' },
    ],
    experience: [
      { name: 'Aloha on the Ganges', type: 'riverside resort', rating: 4.5, reviews: 1100, costPerNight: 4200, address: 'Tapovan, Rishikesh' },
      { name: 'Divine Resort', type: 'wellness resort', rating: 4.4, reviews: 780, costPerNight: 3500, address: 'Laxman Jhula, Rishikesh' },
    ],
    comfort: [
      { name: 'Ananda in the Himalayas', type: 'luxury spa resort', rating: 4.8, reviews: 2100, costPerNight: 25000, address: 'Narendra Nagar, Rishikesh' },
      { name: 'Taj Rishikesh Resort & Spa', type: 'luxury resort', rating: 4.7, reviews: 1600, costPerNight: 16000, address: 'Rishikesh-Pauri Road' },
    ],
  },
  hampi: {
    budget: [
      { name: 'Gopi Guest House', type: 'guesthouse', rating: 4.2, reviews: 420, costPerNight: 900, address: 'Hampi Bazaar, Karnataka' },
      { name: 'Mango Tree Restaurant & Rooms', type: 'budget stay', rating: 4.1, reviews: 380, costPerNight: 1100, address: 'Virupapur Gaddi, Hampi' },
    ],
    experience: [
      { name: 'Evolve Back Kamalapura Palace', type: 'heritage resort', rating: 4.6, reviews: 890, costPerNight: 8500, address: 'Kamalapura, Hampi' },
      { name: 'Heritage Resort Hampi', type: 'boutique resort', rating: 4.4, reviews: 560, costPerNight: 4200, address: 'Hospet Road, Hampi' },
    ],
    comfort: [
      { name: 'Evolve Back Hampi', type: 'luxury resort', rating: 4.8, reviews: 1200, costPerNight: 16000, address: 'Vidyanagar Township, Hampi' },
      { name: 'Hyatt Place Hampi', type: 'luxury hotel', rating: 4.5, reviews: 980, costPerNight: 7500, address: 'Vidyanagar, Hampi' },
    ],
  },
  coorg: {
    budget: [
      { name: 'Zostel Coorg', type: 'hostel', rating: 4.3, reviews: 520, costPerNight: 800, address: 'Madikeri, Coorg' },
      { name: 'Coorg International', type: 'budget hotel', rating: 4.0, reviews: 680, costPerNight: 1600, address: 'Madikeri, Coorg' },
    ],
    experience: [
      { name: 'The Tamara Coorg', type: 'coffee estate resort', rating: 4.6, reviews: 1100, costPerNight: 9500, address: 'Kabbinakad, Coorg' },
      { name: 'Heritage Resort Coorg', type: 'plantation stay', rating: 4.4, reviews: 780, costPerNight: 4800, address: 'Galibeedu, Coorg' },
    ],
    comfort: [
      { name: 'Evolve Back Coorg', type: 'luxury resort', rating: 4.8, reviews: 1500, costPerNight: 18000, address: 'Karadigodu, Coorg' },
      { name: 'Taj Madikeri Resort & Spa', type: 'luxury resort', rating: 4.7, reviews: 1300, costPerNight: 14000, address: 'Madikeri, Coorg' },
    ],
  },
};

const GENERIC_HOTELS = {
  budget: [
    { name: 'Treebo Trend Hotel', type: 'budget hotel', rating: 4.1, reviews: 890, costPerNight: 1500 },
    { name: 'OYO Townhouse', type: 'budget hotel', rating: 3.9, reviews: 1200, costPerNight: 1200 },
  ],
  experience: [
    { name: 'The Fern Residency', type: 'boutique hotel', rating: 4.4, reviews: 650, costPerNight: 3500 },
    { name: 'Lemon Tree Premier', type: 'mid-range hotel', rating: 4.3, reviews: 1100, costPerNight: 4200 },
  ],
  comfort: [
    { name: 'Taj Hotels Collection', type: 'luxury hotel', rating: 4.7, reviews: 2800, costPerNight: 12000 },
    { name: 'ITC Hotels', type: 'luxury hotel', rating: 4.6, reviews: 2100, costPerNight: 9500 },
  ],
};

export function getFallbackHotels(destinationKey, priorityType, destination) {
  const tier = priorityType === 'budget' ? 'budget' : priorityType === 'comfort' ? 'comfort' : 'experience';
  const key = destinationKey || 'custom';
  const hotels = HOTELS_BY_DESTINATION[key]?.[tier] || GENERIC_HOTELS[tier];

  return hotels.map((hotel) => ({
    ...hotel,
    name: hotel.name.includes(destination) ? hotel.name : `${hotel.name}`,
    address: hotel.address || `${destination}, India`,
    googleReviewUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${destination} India hotel reviews`)}`,
    source: 'curated_database',
  }));
}