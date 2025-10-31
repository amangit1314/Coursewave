/**
 * Extracts the public ID from a Cloudinary URL.
 * Example input: https://res.cloudinary.com/your-cloud-name/video/upload/v1234567890/folder/video_id.mp4
 * Output: folder/video_id (without file extension)
 */
export function extractPublicId(url: string): string | null {
    try {
      const basePattern = /\/upload\/(?:v\d+\/)?(.+)\.(mp4|webm|ogg|mov|mkv)/;
      const match = url.match(basePattern);
      if (match && match[1]) {
        return match[1]; // This is the public_id
      }
      return null;
    } catch (error) {
      console.error("Error extracting Cloudinary public_id:", error);
      return null;
    }
  }
  

  // Helper function to normalize content type
export const normalizeContentType = (contentType: string): string => {
  const typeMap: Record<string, string> = {
    'video': 'VIDEO',
    'text': 'TEXT', 
    'quiz': 'QUIZ',
    'assignment': 'ASSIGNMENT',
    'resource': 'RESOURCE',
    'live': 'LIVE'
  };
  
  return typeMap[contentType.toLowerCase()] || contentType.toUpperCase();
};

