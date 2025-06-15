import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { submitProfile, Profile } from "@/lib/supabase/uploadProfile";
import { uploadImage } from "@/lib/supabase/uploadFile";

const BACKEND_URL = "https://fastapi-backend-production-7f9b.up.railway.app";

interface FormData {
  name: string;
  school: string;
  location: string;
  experience: string;
  interests: string[];
  lookingFor: string;
  linkedin: string;
  portfolio: string;
  support: string;
  instagram: string;
  twitter: string;
  discord: string;
  image: File | null;
  email: string;
  acceptanceEmail: File | null;
}

export const useProfileSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (formData: FormData): boolean => {
    if (!formData.name || !formData.school || !formData.location || 
        !formData.experience || !formData.lookingFor || !formData.email || 
        !formData.acceptanceEmail) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields to submit your profile.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const uploadFiles = async (formData: FormData) => {
    let imageUrl = null;
    let acceptanceEmailUrl = null;

    if (formData.image) {
      console.log("File type for profile pic: " + formData.image.type);
      const { publicUrl } = await uploadImage(formData.image);
      console.log("Public URL for profile pic: " + publicUrl);
      imageUrl = publicUrl;
    }

    if (formData.acceptanceEmail) {
      console.log("File type for acceptance email " + formData.acceptanceEmail.type);
      const { publicUrl } = await uploadImage(formData.acceptanceEmail);
      console.log("Public URL for acceptance email: " + publicUrl);
      acceptanceEmailUrl = publicUrl;
    }

    return { imageUrl, acceptanceEmailUrl };
  };

  const prepareProfileData = (
    formData: FormData,
    imageUrl: string | null,
    acceptanceEmailUrl: string | null
  ): Profile => ({
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
    image: imageUrl,
    acceptance_email: acceptanceEmailUrl
  });

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      if (!validateForm(formData)) {
        setIsSubmitting(false);
        return;
      }

      const { imageUrl, acceptanceEmailUrl } = await uploadFiles(formData);
      const profileData = prepareProfileData(formData, imageUrl, acceptanceEmailUrl);

      const data = await submitProfile(profileData);
      
      if (!data) {
        console.error("Error submitting profile");
        toast({
          title: "Error submitting profile",
          description: "There was an error submitting your profile. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log("Data returned after submitting profile: ", data);

      const response = await fetch(`${BACKEND_URL}/index_profile`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ profile: data })
      });
      
      if (!response.ok) {
        console.error("Error indexing profile:", await response.text());
        toast({
          title: "Profile submitted but indexing failed",
          description: "Your profile was submitted but there was an error indexing it. Please contact support.",
          variant: "destructive"
        });
        return;
      }
      
      const {message, success} = await response.json();
      console.log("The indexing was successful: ", message, success);
      
      // if (!success.success) {
      //   toast({
      //     title: "Profile submitted but indexing failed",
      //     description: success.message || "There was an error indexing your profile. Please contact support.",
      //     variant: "destructive"
      //   });
      //   return;
      // }

      toast({
        title: "Profile submitted successfully!",
        description: "Your profile has been added to the roster. You'll be notified when it goes live.",
        variant: "default"
      });
      
      navigate("/");
      return data;
    } catch (error) {
      console.error('Error submitting profile:', error.message);
      toast({
        title: "Error submitting profile",
        description: "There was an error submitting your profile. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
}; 