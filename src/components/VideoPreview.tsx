'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoPreviewProps {
  file: File;
}

export default function VideoPreview({ file }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState<number>(0);
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="rounded-lg overflow-hidden bg-gray-100 p-4">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        onLoadedMetadata={handleLoadedMetadata}
        className="w-full rounded-lg shadow-lg mb-4"
      />
      <div className="space-y-2 text-sm text-gray-600">
        <p><span className="font-medium">File name:</span> {file.name}</p>
        <p><span className="font-medium">Duration:</span> {formatDuration(duration)}</p>
        <p><span className="font-medium">Size:</span> {formatFileSize(file.size)}</p>
        <p><span className="font-medium">Type:</span> {file.type}</p>
      </div>
    </div>
  );
} 