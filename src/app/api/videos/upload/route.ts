import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as File;
    
    if (!video) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!video.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a video file.' },
        { status: 400 }
      );
    }

    // Validate file size (100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (video.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 100MB' },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const uuid = uuidv4();
    const ext = path.extname(video.name);
    const filename = `${uuid}${ext}`;

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads');
    await createDirIfNotExists(uploadDir);

    // Convert File to Buffer and save
    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // TODO: Save video metadata to database
    // For now, just return the UUID
    return NextResponse.json({ uuid });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}

async function createDirIfNotExists(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
} 