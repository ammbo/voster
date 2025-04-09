import { NextRequest, NextResponse } from 'next/server';
import { getUserVideos } from '@/lib/gibson-api';

// GET handler to retrieve videos
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId') || '1'; // In a real app, this would come from authentication
    
    // Get videos for the user from GibsonAI
    const videoUploads = await getUserVideos(parseInt(userId, 10));
    
    return NextResponse.json({
      success: true,
      videos: videoUploads,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos', details: (error as Error).message },
      { status: 500 }
    );
  }
} 