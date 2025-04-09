import { NextRequest, NextResponse } from 'next/server';
import { getVideoById, deleteVideo } from '@/lib/gibson-api';
import path from 'path';
import fs from 'fs';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    // Get the video to get its path
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
    
    // Delete from database
    await deleteVideo(id);
    
    // Delete the file from disk if it exists
    const filePath = path.join(process.cwd(), 'public', 'uploads', video.filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error deleting video' 
      }, 
      { status: 500 }
    );
  }
} 