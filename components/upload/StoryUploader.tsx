'use client';

import React from 'react';

interface StoryUploaderProps {
  onStoryUpload: (file: File) => void;
}

export default function StoryUploader({ onStoryUpload }: StoryUploaderProps) {
  return (
    <div>
      <h3>Upload Your Story</h3>
      <p>Upload a text file with your background story</p>
      {/* TODO: Implement file upload functionality */}
    </div>
  );
} 