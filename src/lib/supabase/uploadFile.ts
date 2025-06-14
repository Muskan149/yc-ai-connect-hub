// 1. Import Supabase client
import { supabase } from './supabase'

// 2. Upload function
export const uploadImage = async (file) => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `images/${fileName}`

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('profiles')
      .upload(filePath, file)

    if (error) {
      throw error
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath)

    return {
      success: true,
      path: data.path,
      publicUrl: publicUrlData.publicUrl
    }

  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 3. Usage in React component
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  
  if (!file) return
  
  // Optional: Validate file
  if (!file.type.startsWith('image/')) {
    console.error('Please select an image file')
    return
  }
  
  if (file.size > 5 * 1024 * 1024) {
    console.error('File size must be less than 5MB')
    return
  }

  // Upload the file
  const result = await uploadImage(file)
  
  if (result.success) {
    console.log('Upload successful!')
    console.log('File path:', result.path)
    console.log('Public URL:', result.publicUrl)
    // Use the publicUrl in your app
  } else {
    console.error('Upload failed:', result.error)
  }
}
