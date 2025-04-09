import { NextRequest, NextResponse } from 'next/server';
import { getVideoById, updateVideo } from '@/lib/gibson-api';
import { VideoStatus, Platform } from '@/types';

// This would be replaced with actual social platform APIs in a real implementation
async function publishToSocialPlatform(
  platform: Platform, 
  videoId: string, 
  description: string, 
  videoUrl: string
): Promise<boolean> {
  console.log(`Publishing to ${platform}:`, { videoId, description, videoUrl });
  
  // Simulate API call to social platforms
  // In a real implementation, this would call the actual APIs
  return new Promise((resolve) => {
    // Simulate some failures for testing
    const success = Math.random() > 0.2;
    
    // Add delay to simulate API call
    setTimeout(() => {
      resolve(success);
    }, 1500);
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    // Get the request body
    const body = await request.json();
    const { platform, description } = body;
    
    if (!platform || !Object.values(Platform).includes(platform)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid platform specified' 
        }, 
        { status: 400 }
      );
    }
    
    // Get the video
    const video = await getVideoById(id);
    
    if (!video) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Video not found' 
        }, 
        { status: 404 }
      );
    }
    
    // Check if video is ready to be published
    if (video.status !== VideoStatus.READY && video.status !== VideoStatus.PUBLISHED) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Video is not ready to be published' 
        }, 
        { status: 400 }
      );
    }
    
    // The video URL would typically be a CDN URL in a real application
    const videoUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/uploads/${video.filename}`;
    
    // Publish to the specified platform
    const publishSuccess = await publishToSocialPlatform(
      platform as Platform, 
      id, 
      description, 
      videoUrl
    );
    
    if (!publishSuccess) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to publish to ${platform}` 
        }, 
        { status: 500 }
      );
    }
    
    // Update the video status and platforms
    let platforms = video.platforms || [];
    if (!platforms.includes(platform)) {
      platforms.push(platform);
    }
    
    // Save the description
    const descriptions = {
      ...(video.descriptions || {}),
      [platform]: description
    };
    
    // Update the video
    await updateVideo(id, {
      status: VideoStatus.PUBLISHED,
      platforms,
      descriptions
    });
    
    return NextResponse.json({
      success: true,
      message: `Successfully published to ${platform}`
    });
    
  } catch (error) {
    console.error('Error publishing video:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error publishing video' 
      }, 
      { status: 500 }
    );
  }
} 