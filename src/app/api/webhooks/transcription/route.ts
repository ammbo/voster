import { NextRequest, NextResponse } from 'next/server';
import { 
  getTranscriptionJobByVideoId, 
  updateTranscriptionJob, 
  createTranscriptionResult,
  getVideoStatusByUploadId,
  updateVideoStatus,
  createAiDescription
} from '@/lib/gibson-api';
import { generateDescription } from '@/lib/groq';
import { 
  TranscriptionJobStatusEnum, 
  VideoStatusStatusEnum 
} from '@/types';

// POST handler to receive AssemblyAI webhook notifications
export async function POST(req: NextRequest) {
  try {
    // Parse the webhook payload
    const payload = await req.json();
    
    // Check if this is a valid AssemblyAI webhook
    if (!payload || !payload.transcript_id || !payload.status) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }
    
    // Check if the transcription is completed
    if (payload.status !== 'completed') {
      console.log(`Transcription status: ${payload.status}, not processing further`);
      return NextResponse.json({ success: true, status: 'received' });
    }
    
    const transcriptId = payload.transcript_id;
    const transcriptText = payload.text || '';
    
    console.log(`Received completed transcription for transcript ID: ${transcriptId}`);
    
    // Find the associated transcription job using a custom lookup function
    // This would need to be implemented to match the AssemblyAI ID with our job
    // For now, we'll assume we have a mapping stored somewhere
    let transcriptionJob;
    try {
      // In a real app, you would need a way to find the job by the AssemblyAI ID
      // This is a placeholder - you would need to implement this lookup
      // transcriptionJob = await getTranscriptionJobByAssemblyId(transcriptId);
      
      // For demo purposes, let's assume we're using the first job we find
      // This would need to be replaced with a real lookup in production
      const videoId = 1; // Placeholder - in a real app, you'd retrieve this from a mapping
      transcriptionJob = await getTranscriptionJobByVideoId(videoId);
    } catch (error) {
      console.error(`Failed to find transcription job for transcript ID: ${transcriptId}`, error);
      return NextResponse.json(
        { error: 'Transcription job not found' },
        { status: 404 }
      );
    }
    
    // Update the transcription job status
    await updateTranscriptionJob(transcriptionJob.uuid, {
      status: TranscriptionJobStatusEnum.COMPLETED
    });
    
    // Create the transcription result
    const transcriptionResult = await createTranscriptionResult({
      job_id: transcriptionJob.id,
      language: 'en', // Default to English, AssemblyAI would provide the actual language
      transcript: transcriptText
    });
    
    // Get the video status
    const videoStatus = await getVideoStatusByUploadId(transcriptionJob.video_upload_id);
    
    // Update the video status to generating description
    await updateVideoStatus(videoStatus.uuid, {
      status: VideoStatusStatusEnum.READY
    });
    
    // Generate description using Groq
    try {
      // Generate description
      const prompt = `Generate a concise, engaging social media description based on this transcript: ${transcriptText.substring(0, 1000)}...`;
      const description = await generateDescription(prompt);
      
      // Store the description
      await createAiDescription({
        transcription_job_id: transcriptionJob.id,
        description
      });
      
      console.log(`Generated description for video ID: ${transcriptionJob.video_upload_id}`);
    } catch (error) {
      console.error('Failed to generate description:', error);
      // If description generation fails, we'll still mark the video as ready
    }
    
    return NextResponse.json({
      success: true,
      message: 'Transcription processed successfully'
    });
    
  } catch (error) {
    console.error('Error processing transcription webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process transcription webhook', details: (error as Error).message },
      { status: 500 }
    );
  }
} 