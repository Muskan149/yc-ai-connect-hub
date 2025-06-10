
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, MapPin, Briefcase, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Dummy profile data
const dummyProfiles = [
  {
    id: 1,
    name: "Sarah Chen",
    school: "Stanford CS",
    location: "San Francisco, CA",
    experience: "Built robotics LLMs at Meta AI, now exploring climate tech applications",
    interests: ["Climate Tech", "Robotics", "LLMs", "Computer Vision"],
    lookingFor: "Co-founder for climate + AI startup. Looking for someone with domain expertise in renewable energy or carbon capture.",
    linkedin: "https://linkedin.com/in/sarahchen",
    portfolio: "https://sarahchen.dev"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    school: "MIT EECS",
    location: "Boston, MA",
    experience: "Lead AI Engineer at Anthropic, 3 years in conversational AI",
    interests: ["NLP", "AI Safety", "Developer Tools", "Education"],
    lookingFor: "Technical co-founder to build AI-powered educational tools. Open to relocating to SF.",
    linkedin: "https://linkedin.com/in/marcusrodriguez",
    portfolio: null
  },
  {
    id: 3,
    name: "Priya Patel",
    school: "UC Berkeley Haas",
    location: "Oakland, CA",
    experience: "Product Manager at OpenAI, previously consultant at McKinsey",
    interests: ["FinTech", "AI Ethics", "Product Strategy", "Healthcare"],
    lookingFor: "Looking for technical co-founder to build AI-powered financial planning tools for underserved communities.",
    linkedin: "https://linkedin.com/in/priyapatel",
    portfolio: "https://priyapatel.com"
  },
  {
    id: 4,
    name: "David Kim",
    school: "Carnegie Mellon CS",
    location: "Pittsburgh, PA",
    experience: "Senior ML Engineer at Google DeepMind, expertise in reinforcement learning",
    interests: ["Gaming", "RL", "Simulation", "VR/AR"],
    lookingFor: "Co-founder for AI-powered game development tools. Want to democratize game creation.",
    linkedin: "https://linkedin.com/in/davidkim",
    portfolio: "https://davidkim.ai"
  },
  {
    id: 5,
    name: "Elena Vasquez",
    school: "Harvard Business School",
    location: "Cambridge, MA",
    experience: "VP of Growth at Stripe, previously founded a YC-backed fintech startup",
    interests: ["B2B SaaS", "AI Automation", "Sales Tech", "Marketing"],
    lookingFor: "Technical co-founder to build AI sales automation platform. Have strong distribution channels ready.",
    linkedin: "https://linkedin.com/in/elenavasquez",
    portfolio: null
  },
  {
    id: 6,
    name: "Alex Thompson",
    school: "Georgia Tech CS",
    location: "Atlanta, GA",
    experience: "Founding Engineer at Hugging Face, expert in open-source AI models",
    interests: ["Open Source", "Model Training", "DevOps", "MLOps"],
    lookingFor: "Business co-founder to commercialize open-source AI infrastructure tools. Revenue already at $10k MRR.",
    linkedin: "https://linkedin.com/in/alexthompson",
    portfolio: "https://alexthompson.dev"
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState(dummyProfiles);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredProfiles(dummyProfiles);
      return;
    }

    // Simple search implementation - in production this would be more sophisticated
    const filtered = dummyProfiles.filter(profile => 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.experience.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase())) ||
      profile.lookingFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.school.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredProfiles(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yc-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">YC</span>
              </div>
              <span className="font-semibold text-gray-900">AI Startup School</span>
            </div>
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
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Find your next AI collaborator
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with fellow builders from Y Combinator's AI Startup School. 
              Discover co-founders, advisors, and collaborators who share your vision.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Try: 'looking for a cofounder into climate + LLMs in SF' or 'fintech product manager'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-yc-orange focus:ring-0"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Button 
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yc-orange hover:bg-yc-orange-dark"
                  size="sm"
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
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {searchQuery ? `Search Results (${filteredProfiles.length})` : `All Profiles (${filteredProfiles.length})`}
          </h2>
          {searchQuery && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setFilteredProfiles(dummyProfiles);
              }}
              className="text-sm"
            >
              Clear search
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md rounded-2xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{profile.name}</h3>
                    <p className="text-sm text-gray-600 font-medium">{profile.school}</p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {profile.location}
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Briefcase className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                      <p className="text-sm text-gray-700">{profile.experience}</p>
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {profile.interests.slice(0, 4).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {profile.interests.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{profile.interests.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Looking For */}
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Heart className="w-4 h-4 mr-2 mt-0.5 text-yc-orange" />
                      <p className="text-sm text-gray-700 line-clamp-3">{profile.lookingFor}</p>
                    </div>
                  </div>

                  {/* Links & Connect Button */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex space-x-2">
                      {profile.linkedin && (
                        <a 
                          href={profile.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-yc-orange transition-colors"
                        >
                          <span className="sr-only">LinkedIn</span>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      {profile.portfolio && (
                        <a 
                          href={profile.portfolio} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-yc-orange transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-yc-orange hover:bg-yc-orange-dark text-white"
                      onClick={() => profile.linkedin && window.open(profile.linkedin, '_blank')}
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
