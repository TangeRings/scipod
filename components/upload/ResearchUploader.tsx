'use client';

import React from 'react';

interface ResearchUploaderProps {
  onPapersUpload: (files: File[]) => void;
}

export default function ResearchUploader({ onPapersUpload }: ResearchUploaderProps) {
  return (
    <div>
      <h3>Upload Research Papers</h3>
      <p>Upload multiple PDF files of your academic papers</p>
      {/* TODO: Implement multiple file upload functionality */}
    </div>
  );
} 