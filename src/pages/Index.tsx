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

// // Dummy profile data
// const dummyProfiles = [
//   {
//     id: 1,
//     name: "Sarah Chen",
//     school: "Stanford CS",
//     location: "San Francisco, CA",
//     experience: "Built robotics LLMs at Meta AI, now exploring climate tech applications",
//     interests: ["Climate Tech", "Robotics", "LLMs", "Computer Vision"],
//     lookingFor: "Co-founder for climate + AI startup. Looking for someone with domain expertise in renewable energy or carbon capture.",
//     support: "I'm looking for a co-founder to build a climate + AI startup. I'm looking for someone with domain expertise in renewable energy or carbon capture.",
//     linkedin: "https://linkedin.com/in/sarahchen",
//     portfolio: "https://sarahchen.dev",
//     instagram: "https://instagram.com/sarahchen",
//     discord: "https://discord.com/sarahchen",
//     twitter: "https://twitter.com/sarahchen"
//   },
//   {
//     id: 2,
//     name: "Marcus Rodriguez",
//     school: "MIT EECS",
//     location: "Boston, MA",
//     experience: "Lead AI Engineer at Anthropic, 3 years in conversational AI",
//     interests: ["NLP", "AI Safety", "Developer Tools", "Education"],
//     lookingFor: "Technical co-founder to build AI-powered educational tools. Open to relocating to SF.",
//     support: "I'm looking for a technical co-founder to build AI-powered educational tools. Open to relocating to SF.",
//     linkedin: "https://linkedin.com/in/marcusrodriguez",
//     portfolio: null,
//     instagram: "https://instagram.com/marcusrodriguez",
//     discord: "https://discord.com/marcusrodriguez",
//     twitter: "https://twitter.com/marcusrodriguez"
//   },
//   {
//     id: 3,
//     name: "Priya Patel",
//     school: "UC Berkeley Haas",
//     location: "Oakland, CA",
//     experience: "Product Manager at OpenAI, previously consultant at McKinsey",
//     interests: ["FinTech", "AI Ethics", "Product Strategy", "Healthcare"],
//     lookingFor: "Looking for technical co-founder to build AI-powered financial planning tools for underserved communities.",
//     support: "I'm looking for a technical co-founder to build AI-powered financial planning tools for underserved communities.",
//     linkedin: "https://linkedin.com/in/priyapatel",
//     portfolio: "https://priyapatel.com",
//     instagram: "https://instagram.com/priyapatel",
//     discord: "https://discord.com/priyapatel",
//     twitter: "https://twitter.com/priyapatel"
//   },
//   {
//     id: 4,
//     name: "David Kim",
//     school: "Carnegie Mellon CS",
//     location: "Pittsburgh, PA",
//     experience: "Senior ML Engineer at Google DeepMind, expertise in reinforcement learning",
//     interests: ["Gaming", "RL", "Simulation", "VR/AR"],
//     lookingFor: "Co-founder for AI-powered game development tools. Want to democratize game creation.",
//     support: "I'm looking for a co-founder to build AI-powered game development tools. Want to democratize game creation.",
//     linkedin: "https://linkedin.com/in/davidkim",
//     portfolio: "https://davidkim.ai",
//     instagram: "https://instagram.com/davidkim",
//     discord: "https://discord.com/davidkim",
//     twitter: "https://twitter.com/davidkim"
//   },
//   {
//     id: 5,
//     name: "Elena Vasquez",
//     school: "Harvard Business School",
//     location: "Cambridge, MA",
//     experience: "VP of Growth at Stripe, previously founded a YC-backed fintech startup",
//     interests: ["B2B SaaS", "AI Automation", "Sales Tech", "Marketing"],
//     lookingFor: "Technical co-founder to build AI sales automation platform. Have strong distribution channels ready.",
//     support: "I'm looking for a technical co-founder to build AI sales automation platform. Have strong distribution channels ready.",
//     linkedin: "https://linkedin.com/in/elenavasquez",
//     portfolio: null,
//     instagram: "https://instagram.com/elenavasquez",
//     discord: "https://discord.com/elenavasquez",
//     twitter: "https://twitter.com/elenavasquez"
//   },
//   {
//     id: 6,
//     name: "Alex Thompson",
//     school: "Georgia Tech CS",
//     location: "Atlanta, GA",
//     experience: "Founding Engineer at Hugging Face, expert in open-source AI models",
//     interests: ["Open Source", "Model Training", "DevOps", "MLOps"],
//     lookingFor: "Business co-founder to commercialize open-source AI infrastructure tools. Revenue already at $10k MRR.",
//     support: "I'm looking for a business co-founder to commercialize open-source AI infrastructure tools. Revenue already at $10k MRR.",
//     linkedin: "https://linkedin.com/in/alexthompson",
//     portfolio: "https://alexthompson.dev",
//     instagram: "https://instagram.com/alexthompson",
//     discord: "https://discord.com/alexthompson",
//     twitter: "https://twitter.com/alexthompson"
//   }
// ];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

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

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredProfiles(profiles);
      return;
    }

    // Simple search implementation - in production this would be more sophisticated
    const filtered = profiles.filter(profile => 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.experience.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase())) ||
      profile.lookingFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.school.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredProfiles(filtered);
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
                  placeholder="Try: 'Agentic AI' or 'Based in San Francisco' or 'Stanford CS'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
            {searchQuery ? `Search Results (${filteredProfiles.length})` : `All Profiles (${filteredProfiles.length})`}
          </h2>
          {searchQuery && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setFilteredProfiles(profiles);
              }}
              className="text-sm"
            >
              Clear search
            </Button>
          )}
        </div>

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
