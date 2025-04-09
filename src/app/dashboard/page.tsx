'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VideoStatus, Platform, Video } from '@/types';
import { 
  PlusCircleIcon, 
  PlayIcon, 
  PencilIcon, 
  TrashIcon, 
  ShareIcon 
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteVideo, setDeleteVideo] = useState<Video | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Fetch videos from our API
    async function fetchVideos() {
      try {
        // In a real app, we would include the user's ID from authentication
        const userId = 'anonymous'; // Placeholder for now
        const response = await fetch(`/api/videos?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch videos');
        }
        
        // Transform the data to match our Video type
        const transformedVideos: Video[] = data.videos.map((video: any) => ({
          id: video.id,
          title: video.title,
          filename: video.filename,
          filePath: video.file_path,
          duration: video.duration || 0,
          userId: video.user_id,
          createdAt: new Date(video.created_at),
          updatedAt: new Date(video.updated_at),
          status: video.status as VideoStatus,
          platforms: video.platforms || [],
          // We'd fetch transcriptions separately in a real app
          // For simplicity, we're assuming transcriptions are included in the video data
          transcription: video.transcription 
            ? {
                id: video.transcription.id,
                videoId: video.id,
                text: video.transcription.text,
                createdAt: new Date(video.transcription.created_at),
                updatedAt: new Date(video.transcription.updated_at),
                assemblyId: video.transcription.assembly_id,
              }
            : undefined
        }));
        
        setVideos(transformedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchVideos();
  }, []);

  const getStatusBadgeClass = (status: VideoStatus) => {
    switch (status) {
      case VideoStatus.UPLOADED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case VideoStatus.PROCESSING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case VideoStatus.TRANSCRIBING:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case VideoStatus.GENERATING_DESCRIPTION:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case VideoStatus.READY:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case VideoStatus.PUBLISHED:
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300';
      case VideoStatus.ERROR:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDelete = async () => {
    if (!deleteVideo) return;
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/videos/${deleteVideo.id}/delete`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove the video from the list
        setVideos(videos.filter(v => v.id !== deleteVideo.id));
        setShowDeleteModal(false);
        setDeleteVideo(null);
      } else {
        alert(`Failed to delete video: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('An error occurred while deleting the video. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Videos</h1>
        <Link href="/upload" className="btn-primary flex items-center">
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Upload New Video
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your videos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">You haven't uploaded any videos yet</p>
          <Link href="/upload" className="btn-primary inline-flex items-center">
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Upload Your First Video
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="card flex flex-col sm:flex-row">
              <Link href={`/videos/${video.id}`} className="sm:w-48 h-32 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <PlayIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </Link>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <Link href={`/videos/${video.id}`}>
                    <h2 className="text-xl font-semibold mb-1 sm:mb-0 hover:text-primary-600 dark:hover:text-primary-400">{video.title}</h2>
                  </Link>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(video.status)}`}>
                    {video.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{video.createdAt.toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDuration(video.duration)}</span>
                </div>
                
                {video.transcription && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transcription</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {video.transcription.text}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Link href={`/videos/${video.id}`} className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </Link>
                  <Link href={`/videos/${video.id}`} className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
                    <ShareIcon className="w-4 h-4 mr-1" />
                    Share
                  </Link>
                  <button 
                    onClick={() => {
                      setDeleteVideo(video);
                      setShowDeleteModal(true);
                    }} 
                    className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete Video
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{deleteVideo.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteVideo(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 