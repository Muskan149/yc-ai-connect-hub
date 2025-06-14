import { supabase } from './supabase';
import { ProfileCardProps } from '@/components/ProfileCard';

export interface Profile {
  id: number;
  name: string;
  school: string;
  location: string;
  experience: string;
  interests: string[];
  looking_for: string;
  linkedin: string;
  portfolio: string;
  support: string;
  instagram: string;
  twitter: string;
  discord: string;
  email: string;
  image?: string;
  acceptance_email?: string;
}

export const fetchAttendees = async (): Promise<ProfileCardProps[]> => {
  const { data, error } = await supabase
    .from('attendees')
    .select('*')
    .eq('mukku_approved', true);

  if (error) {
    console.error('Error fetching attendees:', error);
    throw error;
  }

  // Transform the data to match ProfileCardProps
  return data.map((attendee) => ({
    id: attendee.id,
    name: attendee.name,
    school: attendee.school,
    location: attendee.location,
    experience: attendee.experience,
    interests: attendee.interests || [],
    lookingFor: attendee.looking_for,
    support: attendee.support,
    profile_pic: attendee.image,
    linkedin: attendee.linkedin,
    portfolio: attendee.portfolio,
    instagram: attendee.instagram,
    discord: attendee.discord,
    twitter: attendee.twitter
  }));
};

export const fetchProfileById = async (id: string): Promise<ProfileCardProps | null> => {
  const { data, error } = await supabase
    .from('attendees')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw error;
  }

  // Transform the data to match ProfileCardProps
  return {
    id: data.id,
    name: data.name,
    school: data.school,
    location: data.location,
    experience: data.experience,
    interests: data.interests || [],
    lookingFor: data.looking_for,
    support: data.support,
    profile_pic: data.image,
    linkedin: data.linkedin,
    portfolio: data.portfolio,
    instagram: data.instagram,
    discord: data.discord,
    twitter: data.twitter
  };
}; 