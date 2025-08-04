import { useState } from 'react';

interface UploadState {
  storyFile: File | null;
  researchFiles: File[];
  isUploading: boolean;
  error: string | null;
}

export function useUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    storyFile: null,
    researchFiles: [],
    isUploading: false,
    error: null
  });

  const setStoryFile = (file: File | null) => {
    setUploadState(prev => ({ ...prev, storyFile: file, error: null }));
  };

  const setResearchFiles = (files: File[]) => {
    setUploadState(prev => ({ ...prev, researchFiles: files, error: null }));
  };

  const uploadFiles = async () => {
    setUploadState(prev => ({ ...prev, isUploading: true, error: null }));
    
    try {
      // TODO: Implement actual upload logic
      console.log('Uploading files:', { 
        story: uploadState.storyFile, 
        research: uploadState.researchFiles 
      });
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadState(prev => ({ ...prev, isUploading: false }));
      return true;
    } catch (error) {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      }));
      return false;
    }
  };

  return {
    ...uploadState,
    setStoryFile,
    setResearchFiles,
    uploadFiles
  };
} 