import { supabase } from './supabase'

export interface Profile {
  name: string
  school: string
  location: string
  experience: string
  interests: string[]
  looking_for: string
  linkedin: string
  portfolio: string
  support: string
  instagram: string
  twitter: string
  discord: string
  email: string
  image?: string
  acceptance_email?: string
}

export async function submitProfile(profile: Profile) {
  const { data, error } = await supabase
    .from('attendees')
    .insert([profile])
    .select()
    .single()

  if (error) {
    console.error("Error submitting profile: " + error.details)
    throw error
  }

  return data
}

// export async function uploadFile(file: File, bucket: string, folder: string) {
//   const safeFileName = file.name.replace(/\s+/g, '_'); // Replace spaces with underscores
//   const path = `${folder}/${Date.now()}-${safeFileName}`; // e.g. profile-images/1718348123123-BB_logo.png

//   const { data, error } = await supabase.storage
//     .from(bucket)
//     .upload(path, file)

//   if (error) {
//     console.error(error.message)
//     throw error
//   }

//   const { data: { publicUrl } } = supabase.storage
//     .from(bucket)
//     .getPublicUrl(path)

//   return publicUrl
// } 