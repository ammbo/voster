import { NextRequest, NextResponse } from 'next/server';
import { getVideoById } from '@/lib/gibson-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Get the complete video details from GibsonAI
    const videoDetails = await getVideoById(id);
    
    return NextResponse.json({
      success: true,
      video: videoDetails
    });
  } catch (error) {
    console.error('Error fetching video by ID:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error retrieving video' 
      },
      { status: 500 }
    );
  }
} 