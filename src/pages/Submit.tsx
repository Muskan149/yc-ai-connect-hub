import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, X, Upload, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { submitProfile, Profile } from "@/lib/supabase/uploadProfile";
import { uploadImage } from "@/lib/supabase/uploadFile";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AttendeeForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    location: "",
    experience: "",
    interests: [],
    lookingFor: "",
    linkedin: "",
    portfolio: "",
    support: "",
    instagram: "",
    twitter: "",
    discord: "",
    image: null as File | null,
    email: "",
    acceptanceEmail: null as File | null
  });
  const [newInterest, setNewInterest] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [acceptanceEmailPreview, setAcceptanceEmailPreview] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };

  const handleAcceptanceEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        acceptanceEmail: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAcceptanceEmailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAcceptanceEmail = () => {
    setFormData(prev => ({
      ...prev,
      acceptanceEmail: null
    }));
    setAcceptanceEmailPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!formData.name || !formData.school || !formData.location || !formData.experience || !formData.lookingFor || !formData.email || !formData.acceptanceEmail) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields to submit your profile.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Upload data to supabase
    try {
      // Upload files if they exist
      let imageUrl = null;
      let acceptanceEmailUrl = null;

      if (formData.image) {
        console.log("File type for profile pic: " + formData.image.type)
        const { publicUrl } = await uploadImage(formData.image)
        console.log("Public URL for profile pic: " + publicUrl)
        imageUrl = publicUrl
      }

      if (formData.acceptanceEmail) {
        console.log("File type for acceptance email " + formData.acceptanceEmail.type)
        const { publicUrl } = await uploadImage(formData.acceptanceEmail)
        console.log("Public URL for acceptance email: " + publicUrl)
        acceptanceEmailUrl = publicUrl
      }

      // Prepare profile data
      const profileData: Profile = {
        name: formData.name,
        school: formData.school,
        location: formData.location,
        experience: formData.experience,
        interests: formData.interests,
        looking_for: formData.lookingFor,
        linkedin: formData.linkedin,
        portfolio: formData.portfolio,
        support: formData.support,
        instagram: formData.instagram,
        twitter: formData.twitter,
        discord: formData.discord,
        email: formData.email,
        image: imageUrl || "https://zrqneqpcnphxsugbprwj.supabase.co/storage/v1/object/public/screenshots//buzzbazaar_logo.png",
        acceptance_email: acceptanceEmailUrl || "https://zrqneqpcnphxsugbprwj.supabase.co/storage/v1/object/public/screenshots//buzzbazaar_logo.png"
      };

      // Submit profile to database
      const { data, error } = await submitProfile(profileData);
      if (error) {
        console.error("Error submitting profile: " + error.details)
        toast({
          title: "Error submitting profile",
          description: "There was an error submitting your profile. Please try again.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      } else {
        toast({
        title: "Profile submitted successfully!",
        description: "Your profile has been added to the roster. You'll be notified when it goes live.",
        variant: "default"
      }) 
      navigate("/");
    };

      // Reset form
      setFormData({
        name: "",
        school: "",
        location: "",
        experience: "",
        interests: [],
        lookingFor: "",
        linkedin: "",
        portfolio: "",
        support: "",
        instagram: "",
        twitter: "",
        discord: "",
        image: null,
        email: "",
        acceptanceEmail: null
      });
      setImagePreview(null);
      setAcceptanceEmailPreview(null);
    } catch (error) {
      console.error('Error submitting profile:', error.message);
      toast({
        title: "Error submitting profile",
        description: "There was an error submitting your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
            <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo title="Add Your Profile" />
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Roster
            </Link>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">
            Join the <span className="text-yc-orange">AI Startup School</span> Roster
          </h1>
          {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your profile to connect with fellow builders, find co-founders, and discover collaboration opportunities.
          </p> */}
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
                  <div className="flex items-center gap-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      YC AI SUS Email *
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>We need your email in case you'd like to edit your profile in the future - this won't be shared publicly</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="email@example.com"
                    className="mt-1"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    The email you used to get into YC AI SUS
                  </p>
                </div>

                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ada Lovelace"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="school" className="text-sm font-medium text-gray-700">
                    School / Program
                  </Label>
                  <Input
                    id="school"
                    type="text"
                    value={formData.school}
                    onChange={(e) => handleInputChange("school", e.target.value)}
                    placeholder="e.g., CS @ Georia Tech, Stanford EE, Business @ NYU"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Location
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

              {/* Acceptance Email Upload */}
              <div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Upload Acceptance Email Screenshot *
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This is for us to verify your acceptance and won't be shared publicly</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {acceptanceEmailPreview ? (
                      <>
                        <img
                          src={acceptanceEmailPreview}
                          alt="Acceptance email preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeAcceptanceEmail}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAcceptanceEmailChange}
                      className="hidden"
                      id="acceptance-email"
                    />
                    <Label
                      htmlFor="acceptance-email"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Acceptance Email
                    </Label>
                    <p className="text-sm text-gray-500 mt-3">
                      Upload a screenshot of your YC AI SUS acceptance email (max 5MB, JPG or PNG).
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Image Upload */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Profile Image</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : 
                      <Upload className="w-8 h-8 text-gray-400" />
                    }
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="profile-image"
                    />
                    <Label
                      htmlFor="profile-image"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Label>
                    <p className="text-sm text-gray-500 mt-3">
                       Upload a profile picture (max 5MB, JPG or PNG)
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                  Past Experience *
                </Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="hackathons, internships, side projects, club work, volunteering, traveling, etc. what experiences define you?"
                  className="mt-1 resize-none"
                  rows={3}
                  required
                />
                {/* <p className="text-sm text-gray-500 mt-1">
                </p> */}
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
                      placeholder="machine learning, climate tech, fashion, matcha, running, fintech, etc."
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
                  Add tags for your areas of interest and expertise. This will help others discover you.
                </p>
              </div>

              {/* Looking For */}
              <div>
                <Label htmlFor="lookingFor" className="text-sm font-medium text-gray-700">
                  What am I looking for? 
                </Label>
                <Textarea
                  id="lookingFor"
                  value={formData.lookingFor}
                  onChange={(e) => handleInputChange("lookingFor", e.target.value)}
                  placeholder="describe what kind of collaboration, experiences, or opportunities you're seeking..."
                  className="mt-1 resize-none"
                  rows={4}
                  // required
                />
                {/* <p className="text-sm text-gray-500 mt-1">
                  Describe what kind of collaboration, co-founder, or opportunities you're seeking
                </p> */}
              </div>

              {/* Support */}
              <div>
                <Label htmlFor="support" className="text-sm font-medium text-gray-700">
                  I'd love to support y'all with: 
                </Label>
                <Textarea
                  id="support"
                  value={formData.support}
                  onChange={(e) => handleInputChange("support", e.target.value)}
                  placeholder="share how you can help others in the YC AI SUS community..."
                  className="mt-1 resize-none"
                  rows={3}
                  // required
                />
                {/* <p className="text-sm text-gray-500 mt-1">
                  Let others know what kind of support or expertise you can offer
                </p> */}
              </div>

              {/* Optional Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="linkedin" className="text-sm font-medium text-gray-700">
                    LinkedIn Profile *
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

                <div>
                  <Label htmlFor="twitter" className="text-sm font-medium text-gray-700">
                    Twitter / X
                  </Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange("twitter", e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram" className="text-sm font-medium text-gray-700">
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange("instagram", e.target.value)}
                    placeholder="https://instagram.com/yourusername"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="discord" className="text-sm font-medium text-gray-700">
                    Discord Username
                  </Label>
                  <Input
                    id="discord"
                    type="text"
                    value={formData.discord}
                    onChange={(e) => handleInputChange("discord", e.target.value)}
                    placeholder="username#0000"
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Profile'
                  )}
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
          <p className="mt-2 font-medium text-yc-orange">
            Submit the form ONCE - don't overwhelm our lil team - we gotchu <span className="text-gray-900">🤗</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendeeForm;
