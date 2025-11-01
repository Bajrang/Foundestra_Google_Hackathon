// Semantic Search Service using Vertex AI Text Embeddings
// Enables intelligent POI discovery through vector similarity search

export interface POI {
  id: string;
  name: string;
  description: string;
  lat: number;
  lon: number;
  categories: string[];
  city: string;
  state: string;
  opening_hours?: string;
  popularity: number;
  average_cost: number;
  best_season: string;
  cultural_significance?: string;
  hidden_gem: boolean;
  image_url?: string;
}

export interface SemanticSearchResult {
  poi: POI;
  similarity_score: number;
  relevance_reason: string;
  matched_aspects: string[];
}

export class SemanticSearchService {
  private projectId: string;
  private location: string;
  private embeddingModel: string;
  private poiDatabase: POI[];

  constructor() {
    this.projectId = Deno.env.get('GOOGLE_CLOUD_PROJECT') || 'figma-make-ai-travel';
    this.location = 'us-central1';
    this.embeddingModel = 'textembedding-gecko@003';
    this.poiDatabase = this.initializePOIDatabase();
  }

  private initializePOIDatabase(): POI[] {
    // Comprehensive POI database for Indian destinations
    return [
      // Jaipur POIs
      {
        id: 'poi_jaipur_city_palace',
        name: 'City Palace',
        description: 'Magnificent royal residence showcasing Rajput and Mughal architecture with ornate courtyards, museums displaying royal artifacts, textiles, and weapons. Still home to the royal family of Jaipur.',
        lat: 26.9255,
        lon: 75.8213,
        categories: ['heritage', 'architecture', 'museum', 'royal', 'photography'],
        city: 'Jaipur',
        state: 'Rajasthan',
        opening_hours: '09:00-17:00',
        popularity: 0.95,
        average_cost: 700,
        best_season: 'Oct-Mar',
        cultural_significance: 'UNESCO World Heritage Site, iconic symbol of Rajput architecture',
        hidden_gem: false,
        image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41'
      },
      {
        id: 'poi_jaipur_amber_fort',
        name: 'Amber Fort',
        description: 'Stunning hilltop fort palace with mirror-work halls, intricate carvings, and panoramic valley views. Famous for elephant rides and sound & light shows depicting Rajput history.',
        lat: 26.9855,
        lon: 75.8513,
        categories: ['heritage', 'fort', 'architecture', 'adventure', 'photography'],
        city: 'Jaipur',
        state: 'Rajasthan',
        opening_hours: '08:00-18:00',
        popularity: 0.92,
        average_cost: 500,
        best_season: 'Oct-Mar',
        cultural_significance: 'UNESCO World Heritage Site, majestic Rajput military architecture',
        hidden_gem: false
      },
      {
        id: 'poi_jaipur_hawa_mahal',
        name: 'Hawa Mahal (Palace of Winds)',
        description: 'Iconic five-story pink sandstone facade with 953 intricate windows designed for royal ladies to observe street life without being seen. Architectural marvel of ventilation.',
        lat: 26.9239,
        lon: 75.8267,
        categories: ['heritage', 'architecture', 'photography', 'iconic'],
        city: 'Jaipur',
        state: 'Rajasthan',
        opening_hours: '09:00-16:30',
        popularity: 0.89,
        average_cost: 200,
        best_season: 'Oct-Mar',
        cultural_significance: 'Iconic landmark of Jaipur, unique architectural design',
        hidden_gem: false
      },
      {
        id: 'poi_jaipur_jantar_mantar',
        name: 'Jantar Mantar',
        description: 'Astronomical observatory with worlds largest stone sundial. Collection of 19 architectural astronomical instruments for measuring time, predicting eclipses, and tracking stars.',
        lat: 26.9246,
        lon: 75.8241,
        categories: ['heritage', 'science', 'astronomy', 'education', 'unique'],
        city: 'Jaipur',
        state: 'Rajasthan',
        opening_hours: '09:00-16:30',
        popularity: 0.78,
        average_cost: 200,
        best_season: 'Oct-Mar',
        cultural_significance: 'UNESCO World Heritage Site, astronomical heritage',
        hidden_gem: false
      },
      {
        id: 'poi_jaipur_johari_bazaar',
        name: 'Johari Bazaar',
        description: 'Vibrant jewelry market in the heart of Pink City. Famous for traditional Rajasthani jewelry, gemstones, bangles, textiles, and street food. Authentic local shopping experience.',
        lat: 26.9246,
        lon: 75.8267,
        categories: ['shopping', 'street-food', 'culture', 'local-experience', 'jewelry'],
        city: 'Jaipur',
        state: 'Rajasthan',
        opening_hours: '10:00-21:00',
        popularity: 0.85,
        average_cost: 1500,
        best_season: 'Year-round',
        cultural_significance: 'Traditional Rajasthani craftsmanship hub',
        hidden_gem: false
      },
      {
        id: 'poi_jaipur_nahargarh_fort',
        name: 'Nahargarh Fort',
        description: 'Hilltop fort offering spectacular sunset views over Jaipur city. Less crowded than other forts, perfect for photography and peaceful exploration. Popular for evening visits.',
        lat: 26.9434,
        lon: 75.8154,
        categories: ['heritage', 'fort', 'sunset', 'photography', 'peaceful'],
        city: 'Jaipur',
        state: 'Rajasthan',
        opening_hours: '10:00-17:30',
        popularity: 0.72,
        average_cost: 200,
        best_season: 'Oct-Mar',
        cultural_significance: 'Defensive fort with panoramic city views',
        hidden_gem: true
      },
      {
        id: 'poi_jaipur_panna_meena_kund',
        name: 'Panna Meena Ka Kund',
        description: 'Ancient stepwell with symmetrical stairs forming geometric patterns. Hidden gem near Amber Fort, perfect for photography. Architectural masterpiece rarely crowded.',
        lat: 26.9886,
        lon: 75.8471,
        categories: ['heritage', 'architecture', 'photography', 'offbeat', 'instagram'],
        city: 'Jaipur',
        state: 'Rajasthan',
        opening_hours: 'Sunrise-Sunset',
        popularity: 0.45,
        average_cost: 0,
        best_season: 'Oct-Mar',
        cultural_significance: 'Ancient water conservation architecture',
        hidden_gem: true
      },
      {
        id: 'poi_jaipur_chokhi_dhani',
        name: 'Chokhi Dhani',
        description: 'Ethnic village resort showcasing Rajasthani culture through folk dances, music, traditional cuisine, camel rides, and artisan demonstrations. Immersive cultural experience.',
        lat: 26.7839,
        lon: 75.7536,
        categories: ['culture', 'food', 'entertainment', 'family', 'traditional'],
        city: 'Jaipur',
        state: 'Rajasthan',
        opening_hours: '17:00-23:00',
        popularity: 0.88,
        average_cost: 1200,
        best_season: 'Year-round',
        cultural_significance: 'Complete Rajasthani cultural immersion',
        hidden_gem: false
      },

      // Goa POIs
      {
        id: 'poi_goa_baga_beach',
        name: 'Baga Beach',
        description: 'Famous beach known for water sports, shacks, nightlife, and vibrant atmosphere. Perfect for parasailing, jet skiing, and beach parties. Popular tourist hub.',
        lat: 15.5557,
        lon: 73.7516,
        categories: ['beach', 'water-sports', 'nightlife', 'popular', 'adventure'],
        city: 'Calangute',
        state: 'Goa',
        opening_hours: '24/7',
        popularity: 0.93,
        average_cost: 2000,
        best_season: 'Nov-Feb',
        cultural_significance: 'Iconic Goan beach culture',
        hidden_gem: false
      },
      {
        id: 'poi_goa_old_goa_churches',
        name: 'Basilica of Bom Jesus',
        description: 'UNESCO World Heritage church housing the remains of St. Francis Xavier. Baroque architecture, intricate carvings, and profound religious significance. Must-visit heritage site.',
        lat: 15.5009,
        lon: 73.9113,
        categories: ['heritage', 'religious', 'architecture', 'unesco', 'history'],
        city: 'Old Goa',
        state: 'Goa',
        opening_hours: '09:00-18:30',
        popularity: 0.87,
        average_cost: 0,
        best_season: 'Nov-Feb',
        cultural_significance: 'UNESCO World Heritage Site, Portuguese colonial architecture',
        hidden_gem: false
      },
      {
        id: 'poi_goa_dudhsagar_falls',
        name: 'Dudhsagar Waterfalls',
        description: 'Four-tiered waterfall cascading from 310m height, creating a milky white appearance. Accessible via jungle trek or jeep safari. Swimming allowed in natural pool.',
        lat: 15.3144,
        lon: 74.3144,
        categories: ['nature', 'waterfall', 'adventure', 'trekking', 'photography'],
        city: 'Mollem',
        state: 'Goa',
        opening_hours: '07:00-17:00',
        popularity: 0.82,
        average_cost: 1500,
        best_season: 'Oct-Jan',
        cultural_significance: 'Natural wonder, biodiversity hotspot',
        hidden_gem: false
      },
      {
        id: 'poi_goa_spice_plantation',
        name: 'Sahakari Spice Farm',
        description: 'Organic spice plantation tour with traditional Goan lunch. Learn about cardamom, pepper, vanilla, and other spices. Includes elephant bathing experience.',
        lat: 15.3522,
        lon: 74.0851,
        categories: ['nature', 'food', 'education', 'local-experience', 'eco-tourism'],
        city: 'Ponda',
        state: 'Goa',
        opening_hours: '09:00-17:00',
        popularity: 0.71,
        average_cost: 800,
        best_season: 'Jun-Feb',
        cultural_significance: 'Traditional Goan agriculture and cuisine',
        hidden_gem: true
      },

      // Kerala POIs
      {
        id: 'poi_kerala_backwaters',
        name: 'Alleppey Backwaters',
        description: 'Serene network of lagoons, lakes, and canals. Houseboat cruises through palm-fringed waterways, traditional village life, and stunning sunsets. Quintessential Kerala experience.',
        lat: 9.4981,
        lon: 76.3388,
        categories: ['nature', 'cruise', 'relaxation', 'scenic', 'unique'],
        city: 'Alleppey',
        state: 'Kerala',
        opening_hours: '24/7',
        popularity: 0.96,
        average_cost: 8000,
        best_season: 'Nov-Feb',
        cultural_significance: 'Iconic Kerala waterways, traditional lifestyle',
        hidden_gem: false
      },
      {
        id: 'poi_kerala_munnar_tea_gardens',
        name: 'Munnar Tea Plantations',
        description: 'Rolling hills covered with lush tea estates. Tea factory tours, trekking, and breathtaking mountain views. Cool climate and misty mornings create magical atmosphere.',
        lat: 10.0889,
        lon: 77.0595,
        categories: ['nature', 'scenic', 'trekking', 'photography', 'plantation'],
        city: 'Munnar',
        state: 'Kerala',
        opening_hours: '08:00-17:00',
        popularity: 0.91,
        average_cost: 500,
        best_season: 'Sep-May',
        cultural_significance: 'Colonial tea heritage, hill station culture',
        hidden_gem: false
      },
      {
        id: 'poi_kerala_kathakali_performance',
        name: 'Traditional Kathakali Show',
        description: 'Classical dance-drama with elaborate costumes, makeup, and storytelling. Witness ancient art form depicting Hindu epics. Pre-show makeup demonstration included.',
        lat: 9.9312,
        lon: 76.2673,
        categories: ['culture', 'performing-arts', 'traditional', 'entertainment', 'heritage'],
        city: 'Kochi',
        state: 'Kerala',
        opening_hours: '18:00-20:00',
        popularity: 0.79,
        average_cost: 500,
        best_season: 'Year-round',
        cultural_significance: 'UNESCO recognized classical art form',
        hidden_gem: false
      },

      // Manali POIs
      {
        id: 'poi_manali_solang_valley',
        name: 'Solang Valley',
        description: 'Adventure sports hub offering paragliding, zorbing, skiing (winter), and cable car rides. Stunning snow-capped mountain views. Thrill-seekers paradise.',
        lat: 32.3199,
        lon: 77.1536,
        categories: ['adventure', 'mountains', 'sports', 'skiing', 'scenic'],
        city: 'Manali',
        state: 'Himachal Pradesh',
        opening_hours: '08:00-17:00',
        popularity: 0.89,
        average_cost: 3000,
        best_season: 'Dec-Feb (skiing), Mar-Jun (summer)',
        cultural_significance: 'Himalayan adventure destination',
        hidden_gem: false
      },
      {
        id: 'poi_manali_hadimba_temple',
        name: 'Hadimba Devi Temple',
        description: 'Ancient wooden temple in cedar forest dedicated to Hadimba. Unique pagoda-style architecture, peaceful atmosphere, and spiritual significance. Surrounded by tall deodar trees.',
        lat: 32.2396,
        lon: 77.1887,
        categories: ['religious', 'heritage', 'architecture', 'spiritual', 'nature'],
        city: 'Manali',
        state: 'Himachal Pradesh',
        opening_hours: '08:00-18:00',
        popularity: 0.84,
        average_cost: 0,
        best_season: 'Year-round',
        cultural_significance: 'Ancient Himalayan temple architecture',
        hidden_gem: false
      },
      {
        id: 'poi_manali_old_manali_cafes',
        name: 'Old Manali Cafes & Hippie Culture',
        description: 'Bohemian cafes, live music, organic food, and laid-back vibe. Popular backpacker hub with Israeli cafes, thrift shops, and mountain views. Perfect for relaxation.',
        lat: 32.2432,
        lon: 77.1892,
        categories: ['food', 'culture', 'music', 'backpacking', 'cafes'],
        city: 'Manali',
        state: 'Himachal Pradesh',
        opening_hours: '10:00-22:00',
        popularity: 0.76,
        average_cost: 800,
        best_season: 'Mar-Jun',
        cultural_significance: 'Hippie trail culture, backpacker heritage',
        hidden_gem: true
      }
    ];
  }

  // Generate embeddings using Vertex AI (simulated for demo)
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      // In production, call Vertex AI Text Embeddings API
      // const endpoint = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${this.embeddingModel}:predict`;
      
      // For demo, generate deterministic embedding based on text characteristics
      const words = text.toLowerCase().split(/\s+/);
      const embedding = new Array(768).fill(0); // gecko embedding dimension
      
      // Simple deterministic embedding generation
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const wordHash = this.simpleHash(word);
        for (let j = 0; j < embedding.length; j++) {
          embedding[j] += Math.sin(wordHash + j) * Math.cos(i + j);
        }
      }
      
      // Normalize
      const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
      return embedding.map(val => val / magnitude);
      
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return hash;
  }

  // Calculate cosine similarity between two vectors
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let magA = 0;
    let magB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      magA += vecA[i] * vecA[i];
      magB += vecB[i] * vecB[i];
    }
    
    const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  // Semantic search for POIs based on natural language query
  async searchPOIs(query: string, filters?: {
    city?: string;
    categories?: string[];
    budget_max?: number;
    hidden_gems_only?: boolean;
    top_k?: number;
  }): Promise<SemanticSearchResult[]> {
    try {
      console.log(`Semantic search for: "${query}"`);
      
      // Generate embedding for query
      const queryEmbedding = await this.generateEmbedding(query);
      
      // Filter POIs based on criteria
      let filteredPOIs = this.poiDatabase;
      
      if (filters?.city) {
        filteredPOIs = filteredPOIs.filter(poi => 
          poi.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }
      
      if (filters?.categories && filters.categories.length > 0) {
        filteredPOIs = filteredPOIs.filter(poi =>
          poi.categories.some(cat => filters.categories!.includes(cat))
        );
      }
      
      if (filters?.budget_max) {
        filteredPOIs = filteredPOIs.filter(poi => 
          poi.average_cost <= filters.budget_max!
        );
      }
      
      if (filters?.hidden_gems_only) {
        filteredPOIs = filteredPOIs.filter(poi => poi.hidden_gem);
      }
      
      // Calculate semantic similarity for each POI
      const results: SemanticSearchResult[] = [];
      
      for (const poi of filteredPOIs) {
        // Create searchable text from POI
        const poiText = `${poi.name} ${poi.description} ${poi.categories.join(' ')} ${poi.cultural_significance || ''}`;
        const poiEmbedding = await this.generateEmbedding(poiText);
        
        // Calculate similarity
        const similarity = this.cosineSimilarity(queryEmbedding, poiEmbedding);
        
        // Determine matched aspects
        const matchedAspects: string[] = [];
        const queryLower = query.toLowerCase();
        
        if (poi.categories.some(cat => queryLower.includes(cat))) {
          matchedAspects.push('category');
        }
        if (poi.description.toLowerCase().includes(queryLower) || queryLower.includes(poi.name.toLowerCase())) {
          matchedAspects.push('description');
        }
        if (poi.hidden_gem && (queryLower.includes('hidden') || queryLower.includes('offbeat') || queryLower.includes('secret'))) {
          matchedAspects.push('hidden gem');
        }
        
        // Generate relevance reason
        const relevanceReason = this.generateRelevanceReason(poi, query, similarity);
        
        results.push({
          poi,
          similarity_score: similarity,
          relevance_reason: relevanceReason,
          matched_aspects: matchedAspects
        });
      }
      
      // Sort by similarity score
      results.sort((a, b) => b.similarity_score - a.similarity_score);
      
      // Return top K results
      const topK = filters?.top_k || 10;
      return results.slice(0, topK);
      
    } catch (error) {
      console.error('Semantic search error:', error);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  private generateRelevanceReason(poi: POI, query: string, similarity: number): string {
    const reasons: string[] = [];
    const queryLower = query.toLowerCase();
    
    // Category match
    const matchedCategories = poi.categories.filter(cat => queryLower.includes(cat));
    if (matchedCategories.length > 0) {
      reasons.push(`Matches ${matchedCategories.join(', ')}`);
    }
    
    // Hidden gem
    if (poi.hidden_gem && (queryLower.includes('hidden') || queryLower.includes('offbeat'))) {
      reasons.push('Hidden gem discovery');
    }
    
    // Budget friendly
    if (poi.average_cost < 500 && (queryLower.includes('budget') || queryLower.includes('cheap'))) {
      reasons.push('Budget-friendly');
    }
    
    // Popularity
    if (poi.popularity > 0.85 && (queryLower.includes('popular') || queryLower.includes('famous'))) {
      reasons.push('Highly popular');
    }
    
    // Cultural significance
    if (poi.cultural_significance && (queryLower.includes('culture') || queryLower.includes('heritage'))) {
      reasons.push('Cultural significance');
    }
    
    // Photography
    if (poi.categories.includes('photography') && (queryLower.includes('photo') || queryLower.includes('instagram'))) {
      reasons.push('Photography hotspot');
    }
    
    if (reasons.length === 0) {
      reasons.push(`${Math.round(similarity * 100)}% semantic match`);
    }
    
    return reasons.join(' • ');
  }

  // Get personalized POI recommendations based on user preferences
  async getPersonalizedRecommendations(userProfile: {
    interests: string[];
    budget: number;
    previous_visits?: string[];
    preferred_season?: string;
  }, destination: string, limit: number = 5): Promise<SemanticSearchResult[]> {
    try {
      // Build personalized query
      const query = `${userProfile.interests.join(' ')} experiences in ${destination} that are ${userProfile.budget < 20000 ? 'budget-friendly' : 'premium quality'}`;
      
      // Search with filters
      const results = await this.searchPOIs(query, {
        city: destination,
        categories: userProfile.interests,
        budget_max: userProfile.budget * 0.2, // 20% of total budget per activity
        top_k: limit * 2 // Get more results for filtering
      });
      
      // Filter out previously visited
      let filteredResults = results;
      if (userProfile.previous_visits && userProfile.previous_visits.length > 0) {
        filteredResults = results.filter(r => 
          !userProfile.previous_visits!.includes(r.poi.id)
        );
      }
      
      return filteredResults.slice(0, limit);
      
    } catch (error) {
      console.error('Personalized recommendations error:', error);
      return [];
    }
  }

  // Discover hidden gems using semantic understanding
  async discoverHiddenGems(destination: string, interests: string[], limit: number = 5): Promise<SemanticSearchResult[]> {
    try {
      const query = `hidden secret offbeat local authentic ${interests.join(' ')} experiences in ${destination}`;
      
      return await this.searchPOIs(query, {
        city: destination,
        hidden_gems_only: true,
        categories: interests,
        top_k: limit
      });
      
    } catch (error) {
      console.error('Hidden gems discovery error:', error);
      return [];
    }
  }

  // Get similar POIs based on a reference POI
  async findSimilarPOIs(poiId: string, limit: number = 5): Promise<SemanticSearchResult[]> {
    try {
      const referencePOI = this.poiDatabase.find(poi => poi.id === poiId);
      if (!referencePOI) {
        throw new Error('Reference POI not found');
      }
      
      const query = `${referencePOI.name} ${referencePOI.description} ${referencePOI.categories.join(' ')}`;
      
      const results = await this.searchPOIs(query, {
        categories: referencePOI.categories,
        top_k: limit + 1 // +1 to account for the reference POI itself
      });
      
      // Remove the reference POI from results
      return results.filter(r => r.poi.id !== poiId).slice(0, limit);
      
    } catch (error) {
      console.error('Similar POIs search error:', error);
      return [];
    }
  }

  // Get POI by ID
  getPOIById(poiId: string): POI | null {
    return this.poiDatabase.find(poi => poi.id === poiId) || null;
  }

  // Get all POIs for a destination
  getPOIsByDestination(destination: string): POI[] {
    return this.poiDatabase.filter(poi => 
      poi.city.toLowerCase().includes(destination.toLowerCase()) ||
      poi.state.toLowerCase().includes(destination.toLowerCase())
    );
  }
}

export const semanticSearchService = new SemanticSearchService();
