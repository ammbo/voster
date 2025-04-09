'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VideoPreview from '@/components/VideoPreview';
import UploadProgress from '@/components/UploadProgress';

interface UploadResponse {
  uuid: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }

      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      if (selectedFile.size > maxSize) {
        setError('File size must be less than 100MB');
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a video file');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadStatus('Preparing upload...');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', file);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
          setUploadStatus('Uploading...');
        }
      };

      const response = await new Promise<UploadResponse>((resolve, reject) => {
        xhr.open('POST', '/api/videos/upload');
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        };
        
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(formData);
      });

      setUploadStatus('Processing...');
      router.push(`/videos/${response.uuid}`);
    } catch (err) {
      setError('Failed to upload video. Please try again.');
      setUploadStatus('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                Select Video File
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                disabled={uploading}
              />
              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}
            </div>

            {uploading && (
              <UploadProgress
                progress={uploadProgress}
                status={uploadStatus}
              />
            )}

            <button
              type="submit"
              disabled={!file || uploading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium
                ${!file || uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </form>
        </div>

        <div>
          {file && <VideoPreview file={file} />}
        </div>
      </div>
    </div>
  );
} 