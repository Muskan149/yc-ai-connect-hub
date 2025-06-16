import { MapPin, Briefcase, Heart, ExternalLink, User, Globe, Github, HandHeart, Search} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Helper function to ensure URLs have proper protocol
const ensureHttps = (url: string | null): string | null => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export interface ProfileCardProps {
  id: number;
  name: string;
  school: string;
  location: string;
  experience: string;
  interests: string[];
  lookingFor: string;
  support: string;
  linkedin: string | null;
  portfolio: string | null;
  instagram: string | null;
  discord: string | null;
  twitter: string | null;
  profile_pic: string | null;
}

export const ProfileCard = (profile : ProfileCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md rounded-2xl">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="space-y-4 flex-grow">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {profile.profile_pic ? (
                <img 
                  src={profile.profile_pic} 
                  alt={`${profile.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{profile.name}</h3>
              <p className="text-sm text-gray-600 font-medium">{profile.school}</p>
            </div>
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


          {/* Looking For and Support Container */}
          
          <div className="space-y-3">
            
            {/* Looking For */}
            {profile.lookingFor && (
              <div className="flex items-start">
                <Search className="w-4 h-4 mr-2 mt-0.5 text-yc-orange" />
                <p className="text-sm text-gray-700 line-clamp-3">{profile.lookingFor}</p>
              </div>
            )}

            {/* Support */}
            {profile.support && (
              <div className="flex items-start">
                <HandHeart className="w-4 h-4 mr-2 mt-0.5 text-yc-orange" />
                <p className="text-sm text-gray-700 line-clamp-3">{profile.support}</p>
              </div>
            )}
          </div>
        </div>

        {/* Links & Connect Button */}
        <div className="flex justify-between items-center pt-4 mt-4 border-t">
          <div className="flex space-x-2">
            {profile.linkedin && (
              <a 
                href={ensureHttps(profile.linkedin)} 
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
            {profile.instagram && (
              <a 
                href={ensureHttps(profile.instagram)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yc-orange transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            {profile.discord && (
              <a 
                href={ensureHttps(profile.discord)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yc-orange transition-colors"
              >
                <span className="sr-only">Discord</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            )}
            {profile.twitter && (
              <a 
                href={ensureHttps(profile.twitter)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yc-orange transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            )}
            {profile.portfolio && (
              <a 
                href={ensureHttps(profile.portfolio)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yc-orange transition-colors"
              >
                {profile.portfolio.toLowerCase().includes('github') ? (
                  <Github className="w-4 h-4" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
              </a>
            )}
          </div>
          <Button 
            size="sm" 
            className="bg-yc-orange hover:bg-yc-orange-dark text-white"
            onClick={() => navigate(`/profile/${profile.id}`)}
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 