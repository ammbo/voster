import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import { exec } from 'child_process';
import { promisify } from 'util';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const execPromise = promisify(exec);

/**
 * Ensures the upload directory exists
 * @returns The path to the upload directory
 */
export async function ensureUploadDir(): Promise<string> {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    return UPLOAD_DIR;
  } catch (error) {
    console.error(`Error ensuring upload directory exists: ${error}`);
    throw error;
  }
}

/**
 * Generates a unique filename
 * @param originalName Original filename
 * @returns A unique filename
 */
export function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const id = uuidv4();
  return `${name}-${id}${ext}`;
}

/**
 * Gets the full filesystem path for a filename
 * @param filename The filename
 * @returns The full path
 */
export function getFilePath(filename: string): string {
  return path.join(UPLOAD_DIR, filename);
}

/**
 * Gets a public URL for the file
 * @param filename The filename
 * @returns The public URL
 */
export function getFileUrl(filename: string): string {
  return `/uploads/${filename}`;
}

/**
 * Gets the duration of a video file
 * @param videoPath Path to the video file
 * @returns Duration in seconds
 */
export function getVideoDuration(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(new Error(`Error getting video metadata: ${err.message}`));
        return;
      }
      
      const durationInSeconds = metadata.format.duration || 0;
      resolve(durationInSeconds);
    });
  });
}

/**
 * Gets the resolution of a video file
 * @param videoPath Path to the video file
 * @returns Resolution in format "widthxheight"
 */
export async function getVideoResolution(videoPath: string): Promise<string> {
  try {
    const { stdout } = await execPromise(
      `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${videoPath}"`
    );
    
    return stdout.trim() || '0x0';
  } catch (error) {
    console.error('Error getting video resolution:', error);
    return '0x0';
  }
}

/**
 * Gets the file size in bytes
 * @param filePath Path to the file
 * @returns File size in bytes
 */
export async function getFileSize(filePath: string): Promise<number> {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    console.error('Error getting file size:', error);
    return 0;
  }
}

/**
 * Extracts audio from a video file
 * @param videoPath Path to the video file
 * @returns Path to the extracted audio file
 */
export async function extractAudio(videoPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const audioFileName = `${path.basename(videoPath, path.extname(videoPath))}.mp3`;
    const audioPath = path.join(UPLOAD_DIR, audioFileName);
    
    ffmpeg(videoPath)
      .output(audioPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .on('end', () => resolve(audioPath))
      .on('error', (err) => reject(new Error(`Error extracting audio: ${err.message}`)))
      .run();
  });
} 