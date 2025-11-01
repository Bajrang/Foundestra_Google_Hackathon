import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Star, 
  IndianRupee, 
  Clock,
  Heart,
  Eye,
  TrendingUp,
  Loader2,
  ExternalLink,
  Info
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface POI {
  id: string;
  name: string;
  description: string;
  lat: number;
  lon: number;
  categories: string[];
  city: string;
  state: string;
  popularity: number;
  average_cost: number;
  best_season: string;
  cultural_significance?: string;
  hidden_gem: boolean;
  image_url?: string;
}

interface SearchResult {
  poi: POI;
  similarity_score: number;
  relevance_reason: string;
  matched_aspects: string[];
}

interface SemanticPOIDiscoveryProps {
  destination?: string;
  interests?: string[];
  onSelectPOI?: (poi: POI) => void;
  onAddToItinerary?: (poi: POI) => void;
}

export function SemanticPOIDiscovery({ 
  destination,
  interests = [],
  onSelectPOI,
  onAddToItinerary 
}: SemanticPOIDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hiddenGems, setHiddenGems] = useState<SearchResult[]>([]);
  const [personalizedRecs, setPersonalizedRecs] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  const performSemanticSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    
    try {
      const projectId = 'figma-make-ai-travel';
      const publicAnonKey = 'demo-key';
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f7922768/semantic-search`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: searchQuery,
            filters: {
              city: destination,
              categories: interests,
              top_k: 10
            }
          })
        }
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.results);
        toast.success(`Found ${data.results.length} relevant places!`);
      }
      
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const discoverHiddenGems = async () => {
    setIsSearching(true);
    
    try {
      const projectId = 'figma-make-ai-travel';
      const publicAnonKey = 'demo-key';
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f7922768/discover-hidden-gems`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            destination: destination || 'Jaipur',
            interests: interests.length > 0 ? interests : ['heritage', 'culture'],
            limit: 10
          })
        }
      );
      
      if (!response.ok) {
        throw new Error('Discovery failed');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setHiddenGems(data.hidden_gems);
        toast.success(`Discovered ${data.hidden_gems.length} hidden gems!`, {
          icon: '💎'
        });
      }
      
    } catch (error) {
      console.error('Discovery error:', error);
      toast.error('Failed to discover hidden gems');
    } finally {
      setIsSearching(false);
    }
  };

  const getPersonalizedRecommendations = async () => {
    setIsSearching(true);
    
    try {
      const projectId = 'figma-make-ai-travel';
      const publicAnonKey = 'demo-key';
      
      const userProfile = {
        interests: interests.length > 0 ? interests : ['heritage', 'culture', 'food'],
        budget: 25000,
        preferred_season: 'winter'
      };
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f7922768/personalized-recommendations`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userProfile,
            destination: destination || 'Jaipur',
            limit: 10
          })
        }
      );
      
      if (!response.ok) {
        throw new Error('Recommendations failed');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPersonalizedRecs(data.recommendations);
        toast.success('Got personalized recommendations for you!', {
          icon: '✨'
        });
      }
      
    } catch (error) {
      console.error('Recommendations error:', error);
      toast.error('Failed to get recommendations');
    } finally {
      setIsSearching(false);
    }
  };

  const POICard = ({ result }: { result: SearchResult }) => {
    const { poi, similarity_score, relevance_reason, matched_aspects } = result;
    
    return (
      <Card className="hover:shadow-lg transition-all duration-200 hover:border-purple-300">
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{poi.name}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>{poi.city}, {poi.state}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <Badge 
                variant={poi.hidden_gem ? "secondary" : "outline"}
                className={poi.hidden_gem ? "bg-purple-100 text-purple-700" : ""}
              >
                {poi.hidden_gem ? '💎 Hidden Gem' : `${Math.round(similarity_score * 100)}% match`}
              </Badge>
              {poi.popularity > 0.8 && (
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">{poi.description}</p>

          {/* Categories */}
          <div className="flex flex-wrap gap-1">
            {poi.categories.slice(0, 4).map((cat, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
            {poi.categories.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{poi.categories.length - 4} more
              </Badge>
            )}
          </div>

          {/* Relevance Reason */}
          <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-md">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">{relevance_reason}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Avg. Cost</p>
                <p className="text-sm font-medium">₹{poi.average_cost}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-xs text-gray-500">Best Season</p>
                <p className="text-sm font-medium">{poi.best_season}</p>
              </div>
            </div>
          </div>

          {/* Cultural Significance */}
          {poi.cultural_significance && (
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500 mb-1">Cultural Significance</p>
              <p className="text-xs text-gray-700">{poi.cultural_significance}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {onSelectPOI && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectPOI(poi)}
                className="flex-1"
              >
                <Eye className="w-3 h-3 mr-1" />
                View Details
              </Button>
            )}
            {onAddToItinerary && (
              <Button
                size="sm"
                onClick={() => {
                  onAddToItinerary(poi);
                  toast.success(`Added ${poi.name} to itinerary!`);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Heart className="w-3 h-3 mr-1" />
                Add to Trip
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <span>AI-Powered Discovery</span>
            <p className="text-sm font-normal text-gray-600 mt-1">
              Find places using natural language
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
            <TabsTrigger value="search">
              <Search className="w-4 h-4 mr-2" />
              Search
            </TabsTrigger>
            <TabsTrigger value="hidden">
              💎 Hidden Gems
            </TabsTrigger>
            <TabsTrigger value="personalized">
              ✨ For You
            </TabsTrigger>
          </TabsList>

          {/* Semantic Search Tab */}
          <TabsContent value="search" className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., 'peaceful temple with sunset views' or 'best street food'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      performSemanticSearch();
                    }
                  }}
                />
                <Button
                  onClick={performSemanticSearch}
                  disabled={isSearching}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Smart Search:</strong> Describe what you're looking for naturally. 
                  Examples: "romantic spots", "adventure activities", "hidden local gems"
                </p>
              </div>
            </div>

            <ScrollArea className="h-[500px]">
              {searchResults.length > 0 ? (
                <div className="space-y-3 pr-4">
                  {searchResults.map((result, idx) => (
                    <POICard key={idx} result={result} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
                  <Search className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Start Discovering
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Use semantic search to find places that match your preferences. 
                    Try describing what you want in your own words!
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Hidden Gems Tab */}
          <TabsContent value="hidden" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Discover offbeat places known only to locals
              </p>
              <Button
                size="sm"
                onClick={discoverHiddenGems}
                disabled={isSearching}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Discover
              </Button>
            </div>

            <ScrollArea className="h-[500px]">
              {hiddenGems.length > 0 ? (
                <div className="space-y-3 pr-4">
                  {hiddenGems.map((result, idx) => (
                    <POICard key={idx} result={result} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
                  <span className="text-6xl mb-4">💎</span>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Hidden Gems Await
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Click "Discover" to find secret spots and local favorites 
                    that most tourists miss!
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Personalized Recommendations Tab */}
          <TabsContent value="personalized" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Places curated based on your preferences
              </p>
              <Button
                size="sm"
                onClick={getPersonalizedRecommendations}
                disabled={isSearching}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Star className="w-4 h-4 mr-2" />
                )}
                Get Recommendations
              </Button>
            </div>

            <ScrollArea className="h-[500px]">
              {personalizedRecs.length > 0 ? (
                <div className="space-y-3 pr-4">
                  {personalizedRecs.map((result, idx) => (
                    <POICard key={idx} result={result} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
                  <span className="text-6xl mb-4">✨</span>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Personalized Just for You
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Get AI-powered recommendations tailored to your interests, 
                    budget, and travel style!
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
