'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { VideoStatus } from '@/types';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // If no title is set, use the filename as the title (without extension)
      if (!title) {
        const filename = selectedFile.name;
        const titleFromFilename = filename.substring(0, filename.lastIndexOf('.')) || filename;
        setTitle(titleFromFilename);
      }
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a video file to upload');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for your video');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(uploadInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);

      // Send the upload request to our API
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(uploadInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload video');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      
      setSuccess(true);
      setTitle('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
      const filename = droppedFile.name;
      const titleFromFilename = filename.substring(0, filename.lastIndexOf('.')) || filename;
      setTitle(titleFromFilename);
      setError(null);
    } else {
      setError('Please upload a valid video file');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          file ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-700'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          id="video-upload"
          disabled={isUploading}
        />
        
        {file ? (
          <div className="py-4">
            <div className="text-sm font-medium mb-2">Selected File:</div>
            <div className="flex items-center justify-center space-x-2">
              <span className="font-semibold">{file.name}</span>
              <span className="text-sm text-gray-500">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
            </div>
            <button
              type="button"
              className="mt-4 text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              disabled={isUploading}
            >
              Change file
            </button>
          </div>
        ) : (
          <div className="py-8">
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Drag and drop your video file here, or{' '}
              <label
                htmlFor="video-upload"
                className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 cursor-pointer"
              >
                browse
              </label>{' '}
              to select a file
            </p>
            <p className="mt-1 text-xs text-gray-500">
              MP4, MOV, AVI, or other video formats (max. 500MB)
            </p>
          </div>
        )}
      </div>

      {/* Video Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Video Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input w-full"
          placeholder="Enter a title for your video"
          disabled={isUploading}
          required
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
          Video uploaded successfully! It will be processed shortly.
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-primary-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full btn-primary py-3 flex items-center justify-center"
        disabled={isUploading || !file}
      >
        {isUploading ? 'Uploading...' : 'Upload Video'}
      </button>
    </form>
  );
} 