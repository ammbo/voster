import axios from 'axios';
import { 
  VideoUpload, 
  VideoMetadata, 
  VideoStatus, 
  VideoUploadStatusEnum,
  VideoStatusStatusEnum,
  TranscriptionJob, 
  TranscriptionResult,
  UserProfile,
  SocialAccount,
  SocialPlatform,
  PlatformPost,
  PostJob,
  AiDescription,
  AiHashtag,
  VideoAnalytics
} from '@/types';

const API_BASE_URL = 'https://api.gibsonai.com';
const API_KEY = process.env.GIBSON_API_KEY || 'gAAAAABn4ZVAcFpniSKl0952FrBag1F7u0vqO0yqPyga7LPG7GRuMFW142XqfXfUFbpDWiphnEAsFv4OUMrfcy6iTOg7wMODJg==';

// Create axios instance with default config
export const gibsonApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-Gibson-API-Key': API_KEY,
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
gibsonApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Gibson API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Fetches the OpenAPI specification for the Gibson API
 */
export async function fetchOpenApiSpec() {
  try {
    const response = await gibsonApi.get('/v1/-/openapi/r6bzMYf7cwWFy');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch OpenAPI spec:', error);
    throw error;
  }
}

/**
 * Video Upload service functions
 */

// Create a new video upload record
export async function createVideoUpload(videoUploadData: Partial<VideoUpload>): Promise<VideoUpload> {
  try {
    const response = await gibsonApi.post('/v1/-/video-upload', videoUploadData);
    return response.data;
  } catch (error) {
    console.error('Failed to create video upload:', error);
    throw error;
  }
}

// Get a video upload by UUID
export async function getVideoUpload(uuid: string): Promise<VideoUpload> {
  try {
    const response = await gibsonApi.get(`/v1/-/video-upload/${uuid}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get video upload ${uuid}:`, error);
    throw error;
  }
}

// Get all video uploads for a user
export async function getUserVideos(userId: string | number): Promise<VideoUpload[]> {
  try {
    const response = await gibsonApi.get(`/v1/-/video-upload?where=user_id.eq.${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get videos for user ${userId}:`, error);
    throw error;
  }
}

// Update a video upload record
export async function updateVideoUpload(uuid: string, updates: Partial<VideoUpload>): Promise<VideoUpload> {
  try {
    const response = await gibsonApi.patch(`/v1/-/video-upload/${uuid}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Failed to update video upload ${uuid}:`, error);
    throw error;
  }
}

// Delete a video upload record
export async function deleteVideoUpload(uuid: string): Promise<void> {
  try {
    await gibsonApi.delete(`/v1/-/video-upload/${uuid}`);
  } catch (error) {
    console.error(`Failed to delete video upload ${uuid}:`, error);
    throw error;
  }
}

/**
 * Video Metadata service functions
 */

// Create video metadata
export async function createVideoMetadata(metadata: Partial<VideoMetadata>): Promise<VideoMetadata> {
  try {
    const response = await gibsonApi.post('/v1/-/video-metadata', metadata);
    return response.data;
  } catch (error) {
    console.error('Failed to create video metadata:', error);
    throw error;
  }
}

// Get video metadata by video upload ID
export async function getVideoMetadataByUploadId(uploadId: number): Promise<VideoMetadata> {
  try {
    const response = await gibsonApi.get(`/v1/-/video-metadata?where=upload_id.eq.${uploadId}`);
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    throw new Error(`No metadata found for upload ID ${uploadId}`);
  } catch (error) {
    console.error(`Failed to get metadata for upload ID ${uploadId}:`, error);
    throw error;
  }
}

/**
 * Video Status service functions
 */

// Create or update video status
export async function createVideoStatus(statusData: Partial<VideoStatus>): Promise<VideoStatus> {
  try {
    const response = await gibsonApi.post('/v1/-/video-status', statusData);
    return response.data;
  } catch (error) {
    console.error('Failed to create video status:', error);
    throw error;
  }
}

// Get video status by video upload ID
export async function getVideoStatusByUploadId(uploadId: number): Promise<VideoStatus> {
  try {
    const response = await gibsonApi.get(`/v1/-/video-status?where=upload_id.eq.${uploadId}`);
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    throw new Error(`No status found for upload ID ${uploadId}`);
  } catch (error) {
    console.error(`Failed to get status for upload ID ${uploadId}:`, error);
    throw error;
  }
}

// Update video status
export async function updateVideoStatus(uuid: string, updates: Partial<VideoStatus>): Promise<VideoStatus> {
  try {
    const response = await gibsonApi.patch(`/v1/-/video-status/${uuid}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Failed to update video status ${uuid}:`, error);
    throw error;
  }
}

/**
 * Transcription service functions
 */

// Create a new transcription job
export async function createTranscriptionJob(jobData: Partial<TranscriptionJob>): Promise<TranscriptionJob> {
  try {
    const response = await gibsonApi.post('/v1/-/transcription-job', jobData);
    return response.data;
  } catch (error) {
    console.error('Failed to create transcription job:', error);
    throw error;
  }
}

// Get a transcription job by UUID
export async function getTranscriptionJob(uuid: string): Promise<TranscriptionJob> {
  try {
    const response = await gibsonApi.get(`/v1/-/transcription-job/${uuid}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get transcription job ${uuid}:`, error);
    throw error;
  }
}

// Get a transcription job by video upload ID
export async function getTranscriptionJobByVideoId(videoUploadId: number): Promise<TranscriptionJob> {
  try {
    const response = await gibsonApi.get(`/v1/-/transcription-job?where=video_upload_id.eq.${videoUploadId}`);
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    throw new Error(`No transcription job found for video upload ID ${videoUploadId}`);
  } catch (error) {
    console.error(`Failed to get transcription job for video upload ID ${videoUploadId}:`, error);
    throw error;
  }
}

// Update a transcription job
export async function updateTranscriptionJob(uuid: string, updates: Partial<TranscriptionJob>): Promise<TranscriptionJob> {
  try {
    const response = await gibsonApi.patch(`/v1/-/transcription-job/${uuid}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Failed to update transcription job ${uuid}:`, error);
    throw error;
  }
}

// Create a transcription result
export async function createTranscriptionResult(resultData: Partial<TranscriptionResult>): Promise<TranscriptionResult> {
  try {
    const response = await gibsonApi.post('/v1/-/transcription-result', resultData);
    return response.data;
  } catch (error) {
    console.error('Failed to create transcription result:', error);
    throw error;
  }
}

// Get a transcription result by job ID
export async function getTranscriptionResultByJobId(jobId: number): Promise<TranscriptionResult> {
  try {
    const response = await gibsonApi.get(`/v1/-/transcription-result?where=job_id.eq.${jobId}`);
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    throw new Error(`No transcription result found for job ID ${jobId}`);
  } catch (error) {
    console.error(`Failed to get transcription result for job ID ${jobId}:`, error);
    throw error;
  }
}

/**
 * AI Description service functions
 */

// Create an AI description
export async function createAiDescription(descriptionData: Partial<AiDescription>): Promise<AiDescription> {
  try {
    const response = await gibsonApi.post('/v1/-/ai-description', descriptionData);
    return response.data;
  } catch (error) {
    console.error('Failed to create AI description:', error);
    throw error;
  }
}

// Get an AI description by transcription job ID
export async function getAiDescriptionByJobId(jobId: number): Promise<AiDescription> {
  try {
    const response = await gibsonApi.get(`/v1/-/ai-description?where=transcription_job_id.eq.${jobId}`);
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    throw new Error(`No AI description found for job ID ${jobId}`);
  } catch (error) {
    console.error(`Failed to get AI description for job ID ${jobId}:`, error);
    throw error;
  }
}

/**
 * Social Platform/Account service functions
 */

// Get all social platforms
export async function getSocialPlatforms(): Promise<SocialPlatform[]> {
  try {
    const response = await gibsonApi.get('/v1/-/social-platform');
    return response.data;
  } catch (error) {
    console.error('Failed to get social platforms:', error);
    throw error;
  }
}

// Get all social accounts for a user
export async function getUserSocialAccounts(userId: number): Promise<SocialAccount[]> {
  try {
    const response = await gibsonApi.get(`/v1/-/social-account?where=user_id.eq.${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get social accounts for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Post Job service functions
 */

// Create a post job
export async function createPostJob(jobData: Partial<PostJob>): Promise<PostJob> {
  try {
    const response = await gibsonApi.post('/v1/-/post-job', jobData);
    return response.data;
  } catch (error) {
    console.error('Failed to create post job:', error);
    throw error;
  }
}

// Get a post job by UUID
export async function getPostJob(uuid: string): Promise<PostJob> {
  try {
    const response = await gibsonApi.get(`/v1/-/post-job/${uuid}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get post job ${uuid}:`, error);
    throw error;
  }
}

/**
 * Helper function to fetch complete video details
 */
export async function getVideoById(uuid: string): Promise<any> {
  try {
    // Get the video upload record
    const videoUpload = await getVideoUpload(uuid);
    
    // Initialize the response object
    const response: any = {
      upload: videoUpload
    };
    
    try {
      // Try to get the video metadata
      const metadata = await getVideoMetadataByUploadId(videoUpload.id);
      response.metadata = metadata;
    } catch (error) {
      console.warn(`No metadata found for video ${uuid}`);
    }
    
    try {
      // Try to get the video status
      const status = await getVideoStatusByUploadId(videoUpload.id);
      response.status = status;
    } catch (error) {
      console.warn(`No status found for video ${uuid}`);
    }
    
    try {
      // Try to get the transcription job and result
      const transcriptionJob = await getTranscriptionJobByVideoId(videoUpload.id);
      response.transcriptionJob = transcriptionJob;
      
      try {
        const transcriptionResult = await getTranscriptionResultByJobId(transcriptionJob.id);
        response.transcription = transcriptionResult;
        
        try {
          // If we have a transcription, try to get the AI description
          const aiDescription = await getAiDescriptionByJobId(transcriptionJob.id);
          response.description = aiDescription;
        } catch (error) {
          console.warn(`No AI description found for video ${uuid}`);
        }
      } catch (error) {
        console.warn(`No transcription result found for video ${uuid}`);
      }
    } catch (error) {
      console.warn(`No transcription job found for video ${uuid}`);
    }
    
    return response;
  } catch (error) {
    console.error(`Error fetching video by ID (${uuid}):`, error);
    throw error;
  }
} 