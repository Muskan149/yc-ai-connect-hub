
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Submit = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    location: "",
    experience: "",
    interests: [],
    lookingFor: "",
    linkedin: "",
    portfolio: ""
  });
  const [newInterest, setNewInterest] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.school || !formData.location || !formData.experience || !formData.lookingFor) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields to submit your profile.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would submit to the backend
    console.log("Profile submitted:", formData);
    
    toast({
      title: "Profile submitted successfully!",
      description: "Your profile has been added to the roster. You'll be notified when it goes live.",
    });

    // Reset form
    setFormData({
      name: "",
      school: "",
      location: "",
      experience: "",
      interests: [],
      lookingFor: "",
      linkedin: "",
      portfolio: ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Roster
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yc-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">YC</span>
              </div>
              <span className="font-semibold text-gray-900">Add Your Profile</span>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Join the AI Startup School Roster</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your profile to connect with fellow builders, find co-founders, and discover collaboration opportunities.
          </p>
        </div>

        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Your Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Your full name"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="school" className="text-sm font-medium text-gray-700">
                    School / Program *
                  </Label>
                  <Input
                    id="school"
                    type="text"
                    value={formData.school}
                    onChange={(e) => handleInputChange("school", e.target.value)}
                    placeholder="e.g., Stanford CS, MIT EECS, Harvard Business School"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Location *
                </Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., San Francisco, CA or New York, NY"
                  className="mt-1"
                  required
                />
              </div>

              {/* Experience */}
              <div>
                <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                  Work Experience *
                </Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="Built a robotics LLM at Meta AI, now exploring climate tech applications..."
                  className="mt-1 resize-none"
                  rows={3}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Brief description of your background, current role, or recent projects
                </p>
              </div>

              {/* Interests */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Interests & Expertise</Label>
                <div className="mt-1 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="e.g., Machine Learning, Climate Tech, FinTech"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addInterest();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={addInterest}
                      variant="outline"
                      className="shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="flex items-center gap-1"
                        >
                          {interest}
                          <button
                            type="button"
                            onClick={() => removeInterest(interest)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Add tags for your areas of interest and expertise
                </p>
              </div>

              {/* Looking For */}
              <div>
                <Label htmlFor="lookingFor" className="text-sm font-medium text-gray-700">
                  What are you looking for? *
                </Label>
                <Textarea
                  id="lookingFor"
                  value={formData.lookingFor}
                  onChange={(e) => handleInputChange("lookingFor", e.target.value)}
                  placeholder="Co-founder for climate + AI startup. Looking for someone with domain expertise in renewable energy or carbon capture..."
                  className="mt-1 resize-none"
                  rows={4}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Describe what kind of collaboration, co-founder, or opportunities you're seeking
                </p>
              </div>

              {/* Optional Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="linkedin" className="text-sm font-medium text-gray-700">
                    LinkedIn Profile
                  </Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="portfolio" className="text-sm font-medium text-gray-700">
                    Portfolio / Website
                  </Label>
                  <Input
                    id="portfolio"
                    type="url"
                    value={formData.portfolio}
                    onChange={(e) => handleInputChange("portfolio", e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button 
                  type="submit" 
                  className="bg-yc-orange hover:bg-yc-orange-dark px-8 py-2"
                  size="lg"
                >
                  Submit Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Your profile will be reviewed and added to the roster within 24 hours. 
            We'll notify you via email when it goes live.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Submit;
