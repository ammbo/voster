'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon,
  PlayIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowUpTrayIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { VideoWithDetails, VideoProcessingStatus, Platform } from '@/types';

export default function VideoDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [video, setVideo] = useState<VideoWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Platform states
  const [platforms, setPlatforms] = useState<{
    [key in Platform]: {
      selected: boolean;
      description: string;
      status: 'idle' | 'posting' | 'success' | 'error';
      error?: string;
    };
  }>({
    [Platform.YOUTUBE]: { 
      selected: false, 
      description: '', 
      status: 'idle' 
    },
    [Platform.TWITTER]: { 
      selected: false, 
      description: '', 
      status: 'idle' 
    },
    [Platform.FACEBOOK]: { 
      selected: false, 
      description: '', 
      status: 'idle' 
    },
    [Platform.INSTAGRAM]: { 
      selected: false, 
      description: '', 
      status: 'idle' 
    },
    [Platform.TIKTOK]: { 
      selected: false, 
      description: '', 
      status: 'idle' 
    },
    [Platform.LINKEDIN]: { 
      selected: false, 
      description: '', 
      status: 'idle' 
    }
  });
  
  useEffect(() => {
    async function fetchVideo() {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/videos/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch video');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch video');
        }
        
        // Transform API response to match our Video type
        const videoData = data.video;
        
        const transformedVideo: VideoWithDetails = {
          id: videoData.id,
          title: videoData.title,
          filename: videoData.filename,
          filePath: videoData.file_path,
          duration: videoData.duration || 0,
          userId: videoData.user_id,
          createdAt: new Date(videoData.created_at),
          updatedAt: new Date(videoData.updated_at),
          status: videoData.status as VideoProcessingStatus,
          platforms: videoData.platforms || [],
          // If transcription exists
          transcription: videoData.transcription 
            ? {
                id: videoData.transcription.id,
                videoId: videoData.id,
                text: videoData.transcription.text,
                createdAt: new Date(videoData.transcription.created_at),
                updatedAt: new Date(videoData.transcription.updated_at),
                assemblyId: videoData.transcription.assembly_id,
              }
            : undefined,
          // If descriptions exist, populate them
          descriptions: videoData.descriptions || {}
        };
        
        setVideo(transformedVideo);
        
        // Initialize platforms with descriptions if they exist
        if (videoData.descriptions) {
          const updatedPlatforms = { ...platforms };
          
          Object.entries(videoData.descriptions).forEach(([platform, description]) => {
            if (updatedPlatforms[platform as Platform]) {
              updatedPlatforms[platform as Platform].description = description as string;
            }
          });
          
          setPlatforms(updatedPlatforms);
        }
        
      } catch (error) {
        console.error('Error fetching video:', error);
        setError('Failed to load video details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchVideo();
  }, [id]);
  
  const handlePlatformSelect = (platform: Platform) => {
    setPlatforms(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        selected: !prev[platform].selected
      }
    }));
  };
  
  const handleDescriptionChange = (platform: Platform, value: string) => {
    setPlatforms(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        description: value
      }
    }));
  };
  
  const handlePublish = async () => {
    if (!video) return;
    
    // Get selected platforms
    const selectedPlatforms = Object.entries(platforms)
      .filter(([_, data]) => data.selected)
      .map(([platform]) => platform);
    
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform to publish to.');
      return;
    }
    
    // For each selected platform, update status to posting
    const updatedPlatforms = { ...platforms };
    selectedPlatforms.forEach(platform => {
      updatedPlatforms[platform as Platform].status = 'posting';
    });
    setPlatforms(updatedPlatforms);
    
    // For each selected platform, publish
    for (const platform of selectedPlatforms) {
      try {
        const response = await fetch(`/api/videos/${video.id}/publish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            platform,
            description: platforms[platform as Platform].description
          })
        });
        
        const data = await response.json();
        
        setPlatforms(prev => ({
          ...prev,
          [platform]: {
            ...prev[platform as Platform],
            status: data.success ? 'success' : 'error',
            error: data.error
          }
        }));
      } catch (error) {
        console.error(`Error publishing to ${platform}:`, error);
        setPlatforms(prev => ({
          ...prev,
          [platform]: {
            ...prev[platform as Platform],
            status: 'error',
            error: 'Failed to publish. Please try again.'
          }
        }));
      }
    }
  };
  
  const getStatusBadgeClass = (status: VideoProcessingStatus) => {
    switch (status) {
      case VideoProcessingStatus.UPLOADED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case VideoProcessingStatus.PROCESSING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case VideoProcessingStatus.TRANSCRIBING:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case VideoProcessingStatus.GENERATING_DESCRIPTION:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case VideoProcessingStatus.READY:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case VideoProcessingStatus.PUBLISHED:
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300';
      case VideoProcessingStatus.ERROR:
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
  
  // Check if the video is ready to be published
  const isReadyToPublish = video?.status === VideoProcessingStatus.READY || video?.status === VideoProcessingStatus.PUBLISHED;
  
  const handleDelete = async () => {
    if (!video) return;
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/videos/${video.upload.uuid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      // Redirect to videos list
      window.location.href = '/videos';
    } catch (err) {
      setError('Failed to delete video');
      setIsDeleting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading video details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.back()} 
            className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Video Not Found</h1>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
          {error || 'Video not found. It may have been deleted or you may not have permission to view it.'}
        </div>
        <div className="mt-6">
          <Link href="/dashboard" className="btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => router.back()} 
          className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold">{video.title}</h1>
        <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(video.status)}`}>
          {video.status}
        </span>
      </div>
      
      {/* Video Preview */}
      <div className="mb-8">
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
          {video.filePath ? (
            <video 
              src={video.filePath}
              className="w-full h-full" 
              controls
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <PlayIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-600 dark:text-gray-400 mt-2">Video preview not available</p>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span>Uploaded on {video.createdAt.toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{formatDuration(video.duration)}</span>
          </div>
          <div className="flex space-x-4">
            <button className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
              <PencilIcon className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)} 
              className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
      
      {/* Transcription */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <DocumentTextIcon className="w-5 h-5 mr-2" />
          Transcription
        </h2>
        {video.status === VideoProcessingStatus.TRANSCRIBING ? (
          <div className="flex items-center text-yellow-600 dark:text-yellow-400">
            <ClockIcon className="w-5 h-5 mr-2" />
            <p>Transcription in progress...</p>
          </div>
        ) : video.transcription ? (
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {video.transcription.text}
          </p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No transcription available yet.
          </p>
        )}
      </div>
      
      {/* Publish to Platforms */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <ShareIcon className="w-5 h-5 mr-2" />
          Publish to Social Platforms
        </h2>
        
        {!isReadyToPublish && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-6 dark:bg-yellow-900/30 dark:text-yellow-300">
            <p>The video must be fully processed before it can be published. Current status: {video.status}</p>
          </div>
        )}
        
        <div className="space-y-6">
          {Object.entries(platforms).map(([platformKey, platformData]) => {
            const platform = platformKey as Platform;
            return (
              <div key={platform} className="border rounded-lg p-4 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`platform-${platform}`}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                      checked={platformData.selected}
                      onChange={() => handlePlatformSelect(platform)}
                      disabled={!isReadyToPublish || platformData.status === 'posting'}
                    />
                    <label htmlFor={`platform-${platform}`} className="ml-2 text-lg font-medium">
                      {platform}
                    </label>
                  </div>
                  {platformData.status === 'posting' && (
                    <span className="text-yellow-600 dark:text-yellow-400 flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      Posting...
                    </span>
                  )}
                  {platformData.status === 'success' && (
                    <span className="text-green-600 dark:text-green-400 flex items-center">
                      <CheckIcon className="w-4 h-4 mr-1" />
                      Posted
                    </span>
                  )}
                  {platformData.status === 'error' && (
                    <span className="text-red-600 dark:text-red-400 flex items-center">
                      <XMarkIcon className="w-4 h-4 mr-1" />
                      Failed
                    </span>
                  )}
                </div>
                
                {platformData.selected && (
                  <div>
                    <label htmlFor={`description-${platform}`} className="block text-sm font-medium mb-2">
                      Description for {platform}
                    </label>
                    <textarea
                      id={`description-${platform}`}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600"
                      value={platformData.description}
                      onChange={(e) => handleDescriptionChange(platform, e.target.value)}
                      placeholder={`Enter your ${platform} post text here...`}
                      disabled={platformData.status === 'posting'}
                    />
                    
                    {platformData.error && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {platformData.error}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-8">
          <button
            className="btn-primary w-full"
            disabled={!isReadyToPublish || Object.values(platforms).every(p => !p.selected)}
            onClick={handlePublish}
          >
            Publish Selected Platforms
          </button>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete Video
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{video.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
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