'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setIsUploading(true);

    try {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        setIsUploading(false);
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload the file
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`image-upload ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            ref={fileInputRef}
            disabled={isUploading}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
          {isUploading && (
            <p className="mt-1 text-sm text-blue-600">Uploading...</p>
          )}
          {value && (
            <div className="mt-2 flex items-center">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Image URL"
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        {value && (
          <div className="w-24 h-24 border border-slate-200 rounded-md overflow-hidden bg-slate-50 relative">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
} 