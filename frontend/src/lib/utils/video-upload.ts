// services/video-upload.service.ts

import { supabase } from "../config/supabase";

export class VideoUploadService {
  static async uploadVideo(file: File, chapterId: string): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${chapterId}-${Date.now()}.${fileExt}`;
    const filePath = `videos/${fileName}`;

    const { data, error } = await supabase.storage
      .from("course-videos")
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("course-videos").getPublicUrl(filePath);

    return publicUrl;
  }
}
