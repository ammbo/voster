// Video types
export interface VideoUpload {
  uuid: string;
  id: number;
  file_path: string;
  mime_type: string;
  upload_status: VideoUploadStatus;
  user_id: number;
  date_created: string;
  date_updated: string;
}

export enum VideoUploadStatus {
  PENDING = 'pending',
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  ERROR = 'error',
  COMPLETE = 'complete'
}

export interface VideoMetadata {
  uuid: string;
  id: number;
  upload_id: number;
  duration: number;
  file_size: number;
  resolution: string;
  date_created: string;
  date_updated: string;
}

export interface VideoStatus {
  uuid: string;
  id: number;
  upload_id: number;
  status: VideoProcessingStatus;
  error_message?: string;
  date_created: string;
  date_updated: string;
}

export enum VideoProcessingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  TRANSCRIBING = 'transcribing',
  READY = 'ready',
  PUBLISHED = 'published',
  ERROR = 'error'
}

// Transcription types
export interface TranscriptionJob {
  uuid: string;
  id: number;
  video_upload_id: number;
  api_provider: string;
  status: TranscriptionJobStatusEnum;
  date_created: string;
  date_updated: string;
}

export enum TranscriptionJobStatusEnum {
  PENDING = 1,
  PROCESSING = 2,
  COMPLETED = 3,
  ERROR = 4
}

export interface TranscriptionResult {
  uuid: string;
  id: number;
  job_id: number;
  language: string;
  transcript: string;
  accuracy?: number;
  date_created: string;
  date_updated: string;
}

// Platform types
export enum Platform {
  YOUTUBE = 'YOUTUBE',
  TWITTER = 'TWITTER',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  LINKEDIN = 'LINKEDIN'
}

export interface SocialPlatform {
  uuid: string;
  id: number;
  name: string;
  api_endpoint: string;
  api_key: string;
  date_created: string;
  date_updated: string;
}

export interface SocialAccount {
  uuid: string;
  user_id: number;
  platform: 'youtube' | 'twitter' | 'instagram' | 'tiktok';
  platform_user_id: string;
  username: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface PlatformPost {
  uuid: string;
  id: number;
  social_account_id: number;
  post_content: string;
  post_url?: string;
  published_at?: string;
  date_created: string;
  date_updated: string;
}

export interface PostJob {
  uuid: string;
  id: number;
  video_upload_id: number;
  platform_ids: string; // Comma-separated list of platform IDs
  scheduled_time: string;
  status: PostJobStatusEnum;
  date_created: string;
  date_updated: string;
}

export enum PostJobStatusEnum {
  SCHEDULED = 1,
  PROCESSING = 2,
  COMPLETED = 3,
  ERROR = 4
}

// User types
export interface UserProfile {
  uuid: string;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  date_created: string;
  date_updated: string;
}

// AI-generated content types
export interface AiDescription {
  uuid: string;
  id: number;
  transcription_job_id: number;
  description: string;
  date_created: string;
  date_updated: string;
}

export interface AiHashtag {
  uuid: string;
  id: number;
  transcription_job_id: number;
  hashtags: string;
  date_created: string;
  date_updated: string;
}

// Analytics types
export interface VideoAnalytics {
  uuid: string;
  id: number;
  upload_id: number;
  play_count?: number;
  watch_time?: number;
  engagement_rate?: number;
  date_created: string;
  date_updated: string;
}

// Convenience type for displaying videos in the UI
export interface VideoWithDetails {
  upload: VideoUpload;
  metadata?: VideoMetadata;
  status?: VideoStatus;
  transcription?: TranscriptionResult;
  description?: AiDescription;
  hashtags?: AiHashtag;
  analytics?: VideoAnalytics;
  title?: string;
  platforms?: {
    platform: Platform;
    status: 'pending' | 'success' | 'error';
    url?: string;
    error?: string;
  }[];
}

export interface SocialPost {
  uuid: string;
  video_id: number;
  account_id: number;
  platform: 'youtube' | 'twitter' | 'instagram' | 'tiktok';
  platform_post_id?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  content: string;
  scheduled_for?: Date;
  published_at?: Date;
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SocialMessage {
  uuid: string;
  post_id: number;
  platform: 'youtube' | 'twitter' | 'instagram' | 'tiktok';
  message_type: 'comment' | 'reply' | 'direct';
  content: string;
  platform_message_id?: string;
  parent_message_id?: string;
  sent_at?: Date;
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}

export * from './video.types'; 