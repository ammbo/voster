export enum VideoUploadStatusEnum {
  PENDING = 'pending',
  UPLOADED = 'uploaded',
  FAILED = 'failed'
}

export interface VideoUpload {
  uuid: string;
  file_path: string;
  mime_type: string;
  upload_status: VideoUploadStatusEnum;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface VideoMetadata {
  uuid: string;
  video_upload_id: string;
  duration_seconds: number;
  file_size_bytes: number;
  width: number;
  height: number;
  created_at: Date;
  updated_at: Date;
} 