import Groq from 'groq-sdk';

// Initialize the Groq client
const apiKey = process.env.GROQ_API_KEY || '';
const groqClient = new Groq({ apiKey });

/**
 * Generates text using Groq LLama3 model
 * @param prompt The prompt to generate a response for
 * @returns The generated text
 */
export async function generateDescription(prompt: string): Promise<string> {
  try {
    // Call the LLM to generate the description
    const completion = await groqClient.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 800,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating description:', error);
    throw error;
  }
}

/**
 * Helper function to create a social media description prompt from a transcript
 * @param transcript The transcript text to generate a description from
 * @param platform The social media platform to optimize for
 * @param videoTitle The title of the video (optional)
 * @returns The prompt for generating a description
 */
export function createDescriptionPrompt(transcript: string, platform: string, videoTitle?: string): string {
  return `
You are a professional social media copywriter. 
Based on the following video transcript, create an engaging ${platform} post:

${videoTitle ? `VIDEO TITLE: ${videoTitle}` : ''}

TRANSCRIPT:
${truncateTranscript(transcript, 3000)}

Write a compelling, engaging caption for ${platform} that:
- Captures the main points of the video
- Uses an attention-grabbing hook
- Includes relevant hashtags (if appropriate for the platform)
- Maintains an authentic voice
- Is optimized for ${platform}'s audience
- Has appropriate length for ${platform} (e.g. shorter for Twitter, longer for YouTube)

CAPTION:
`;
}

/**
 * Truncates a transcript to a specified length to stay within token limits
 * @param transcript The full transcript
 * @param maxLength The maximum length to keep
 * @returns The truncated transcript
 */
function truncateTranscript(transcript: string, maxLength: number): string {
  if (transcript.length <= maxLength) {
    return transcript;
  }

  // Take the beginning and end of the transcript
  const beginning = transcript.substring(0, maxLength / 2);
  const end = transcript.substring(transcript.length - maxLength / 2);

  return `${beginning}\n\n[...content truncated...]\n\n${end}`;
} 