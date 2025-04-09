import { AssemblyAI } from 'assemblyai';

// Initialize the AssemblyAI client
const apiKey = process.env.ASSEMBLYAI_API_KEY || '';
const assemblyClient = new AssemblyAI({ apiKey });

/**
 * Submits a video/audio file for transcription
 * @param fileUrl URL of the video/audio file to transcribe
 * @returns The transcription object with ID for status polling
 */
export async function submitTranscriptionJob(fileUrl: string) {
  try {
    const transcript = await assemblyClient.transcripts.transcribe({
      audio: fileUrl,
      speaker_labels: true,
    });
    
    return transcript;
  } catch (error) {
    console.error('Error submitting transcription job:', error);
    throw error;
  }
}

/**
 * Checks the status of a transcription job
 * @param transcriptId The ID of the transcript to check
 * @returns The current state of the transcription
 */
export async function getTranscriptionStatus(transcriptId: string) {
  try {
    const transcript = await assemblyClient.transcripts.get(transcriptId);
    return transcript;
  } catch (error) {
    console.error('Error getting transcription status:', error);
    throw error;
  }
}

/**
 * Retrieves the completed transcription
 * @param transcriptId The ID of the completed transcript
 * @returns The completed transcript with text and metadata
 */
export async function getTranscription(transcriptId: string) {
  try {
    const transcript = await assemblyClient.transcripts.get(transcriptId);
    
    if (transcript.status !== 'completed') {
      throw new Error(`Transcription not completed, current status: ${transcript.status}`);
    }
    
    return transcript;
  } catch (error) {
    console.error('Error getting completed transcription:', error);
    throw error;
  }
} 