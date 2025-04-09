import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { videoRepository } from '../repositories';
import type { VideoUpload } from '@/types';
import { VideoUploadStatusEnum } from '@/types';

export class VideoService {
  private static instance: VideoService;
  private readonly uploadDir: string;

  private constructor() {
    // Set upload directory relative to project root
    this.uploadDir = path.join(process.cwd(), 'uploads', 'videos');
    this.ensureUploadDirectory();
  }

  public static getInstance(): VideoService {
    if (!VideoService.instance) {
      VideoService.instance = new VideoService();
    }
    return VideoService.instance;
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
      throw new Error('Failed to initialize video upload service');
    }
  }

  /**
   * Upload a video file and create database record
   * @param file The video file from the request
   * @param userId The ID of the user uploading the video
   * @returns The created video upload record
   */
  async uploadVideo(file: Express.Multer.File, userId: number): Promise<VideoUpload> {
    try {
      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${randomUUID()}${fileExtension}`;
      const filePath = path.join(this.uploadDir, fileName);

      // Save file to filesystem
      await fs.writeFile(filePath, file.buffer);

      // Create database record
      const videoUpload = await videoRepository.createUpload({
        file_path: filePath,
        mime_type: file.mimetype,
        upload_status: VideoUploadStatusEnum.UPLOADED,
        user_id: userId,
      });

      return videoUpload;
    } catch (error) {
      // Clean up file if database operation fails
      const fileExtension = path.extname(file.originalname);
      const fileName = `${randomUUID()}${fileExtension}`;
      const filePath = path.join(this.uploadDir, fileName);
      
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Failed to clean up file after upload error:', unlinkError);
      }

      console.error('Video upload failed:', error);
      throw new Error('Failed to upload video');
    }
  }

  /**
   * Delete a video file and its database record
   * @param uuid The UUID of the video to delete
   */
  async deleteVideo(uuid: string): Promise<void> {
    const video = await videoRepository.getUpload(uuid);
    
    try {
      // Delete file from filesystem
      await fs.unlink(video.file_path);
      
      // Delete database record
      await videoRepository.deleteUpload(uuid);
    } catch (error) {
      console.error('Failed to delete video:', error);
      throw new Error('Failed to delete video');
    }
  }
}

// Export singleton instance
export const videoService = VideoService.getInstance(); 