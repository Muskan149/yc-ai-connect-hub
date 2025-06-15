import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, MapPin, Briefcase, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileCard } from "@/components/ProfileCard";
import { fetchAttendees } from "@/lib/supabase/fetchAttendees";
import Logo from "@/components/Logo";
import { Checkbox } from "@/components/ui/checkbox";

const BACKEND_URL = "https://fastapi-backend-production-7f9b.up.railway.app";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  // const [filteredAdvancedProfiles, setFilteredAdvancedProfiles] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch attendees using useEffect
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAttendees();
        setProfiles(data);
        setFilteredProfiles(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
        // setIsSearching(false);
      setSearchQuery("");
      setFilteredProfiles(profiles);
      // setFilteredAdvancedProfiles([]);
      return;
    }
    
    setIsSearching(true);
    // Make a call to the backend to fetch the top k profiles
    const response = await fetch(`${BACKEND_URL}/fetch_top_k_profiles`, {
      method: "POST",
      body: JSON.stringify({ query: searchQuery }),
      headers: {
        "Content-Type": "application/json"
      }
    });
 
    const data = await response.json();
    console.log("Data returned after fetching top k profiles: ", data);

    // Get semantic search results
    const semanticProfileIds = data.results;
    console.log("Semantic profile ids: ", semanticProfileIds);
    const semanticResults = profiles.filter(profile => semanticProfileIds.includes(profile.id));

    // Simple keyword search implementation
    const keywordResults = profiles.filter(profile => 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.experience.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase())) ||
      profile.lookingFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.school.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Combine results and remove duplicates using Set
    const combinedResults = [...semanticResults, ...keywordResults];
    const uniqueProfileIds = new Set();
    const hybridResults = combinedResults.filter(profile => {
      if (uniqueProfileIds.has(profile.id)) {
        return false;
      }
      uniqueProfileIds.add(profile.id);
      return true;
    });

    setFilteredProfiles(hybridResults);
    // setFilteredAdvancedProfiles(semanticResults);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yc-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading profiles. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo title="YC AI SUS Roster" />
            <Link to="/submit">
              <Button className="bg-yc-orange hover:bg-yc-orange-dark">
                <Plus className="w-4 h-4 mr-2" />
                Add Profile
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white via-orange-50/30 to-orange-100/20">
        <style>
          {`
            @keyframes breathing {
              0% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.2);
              }
              100% {
                transform: scale(1);
              }
            }
            .animate-breathing {
              animation: breathing 5s ease-in-out infinite;
            }
          `}
        </style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="w-96 h-96 bg-yc-orange rounded-full filter blur-3xl animate-breathing"></div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yc-orange to-orange-600">
                YC AI Startup School
              </span>
              <span className="text-gray-900"> Roster</span>
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-4xl mx-auto leading-relaxed">
              Connect with students, builders and professionals @ Y Combinator's AI Startup School
            </p>
            <p className="text-xl font-medium text-gray-700 mb-12 max-w-3xl mx-auto">
              Make Epic Lore.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto relative">
              <div className="relative shadow-lg rounded-xl">
                <Input
                  type="text"
                  placeholder="Try: 'Agents' or 'Based in San Francisco' or 'Stanford CS'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-5 text-lg border-2 border-yc-orange rounded-xl focus-visible:ring-2 focus-visible:ring-yc-orange focus-visible:ring-offset-2"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Button 
                  onClick={handleSearch}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-yc-orange hover:bg-yc-orange-dark rounded-lg"
                  size="lg"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            {searchQuery && isSearching ? `Search Results (${filteredProfiles.length})` : `All Profiles`}
          </h2>
          {searchQuery && isSearching && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setFilteredProfiles(profiles);
                // setFilteredAdvancedProfiles([]);
                setIsSearching(false);
              }}
              className="text-sm border-yc-orange"
            >
              Clear search
            </Button>
          )}
        </div>

        {/* a row of filtering checkboxes with names "Is Hiring", "Looking for Co-founders", "Looking for Job🥀" */}
        {/* <div className="flex flex-row gap-4 mb-4">
          <Checkbox id="is-hiring" />
          <label htmlFor="is-hiring">Is Hiring</label>
          <Checkbox id="looking-for-co-founders" />
          <label htmlFor="looking-for-co-founders">Looking for Co-founders</label>
          <Checkbox id="looking-for-job" /> 
          <label htmlFor="looking-for-job">Looking for Job🥀</label>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard key={profile.id} {...profile} />
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all profiles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
