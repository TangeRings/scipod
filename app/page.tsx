"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

// StoryDropZone Component
function StoryDropZone({ onStoryUpload }: { onStoryUpload: (files: FileList | null) => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      onStoryUpload(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStoryUpload(e.target.files)
  }

  return (
    <div
      style={{
        border: isDragging || isHovering ? '2px dashed #7c3aed' : '2px dashed #d1d5db',
        backgroundColor: isDragging || isHovering ? '#f8fafc' : 'white',
        borderRadius: '12px',
        padding: '48px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.2s ease'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".txt"
        multiple
        onChange={handleFileChange}
      />

      <div style={{ 
        width: '48px', 
        height: '48px', 
        backgroundColor: isDragging || isHovering ? '#7c3aed' : '#e5e7eb',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        transition: 'all 0.2s ease'
      }}>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          style={{ color: isDragging || isHovering ? 'white' : '#6b7280' }}
        >
          <path 
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p style={{ 
        fontSize: '16px', 
        fontWeight: '500', 
        color: '#374151', 
        margin: '0 0 8px 0' 
      }}>
        Upload your text files (.txt)
      </p>
      <p style={{ 
        fontSize: '14px', 
        color: '#6b7280', 
        margin: '0' 
      }}>
        Drag and drop multiple files or click to browse
      </p>
    </div>
  )
}



export default function HomePage() {
  const router = useRouter()
  const [storyFiles, setStoryFiles] = useState<FileList | null>(null)

  const handleStoryUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      // Convert FileList to Array and combine with existing files
      const newFiles = Array.from(files)
      const existingFiles = storyFiles ? Array.from(storyFiles) : []
      
      // Combine existing and new files, avoiding duplicates by name
      const allFiles = [...existingFiles]
      newFiles.forEach(newFile => {
        const isDuplicate = existingFiles.some(existingFile => 
          existingFile.name === newFile.name && existingFile.size === newFile.size
        )
        if (!isDuplicate) {
          allFiles.push(newFile)
        }
      })
      
      // Create a new FileList-like object
      const dataTransfer = new DataTransfer()
      allFiles.forEach(file => dataTransfer.items.add(file))
      setStoryFiles(dataTransfer.files)
    } else {
      setStoryFiles(files)
    }
  }



  const handleSubmit = () => {
    // Proceed only if we have text files
    if (storyFiles && storyFiles.length > 0) {
      const allFiles: File[] = Array.from(storyFiles)
      
      // Store file info (we can't store actual File objects in sessionStorage)
      sessionStorage.setItem('uploadedFiles', JSON.stringify(
        allFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      ))
      
      // Store actual files in a temporary global variable
      ;(window as any).uploadedFiles = allFiles
      
      router.push('/template')
    }
  }

  const canSubmit = storyFiles && storyFiles.length > 0

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            Transform Your Text Into a Podcast
          </h1>
          <p style={{ fontSize: '20px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            Upload your text content and let AI help you turn it into an engaging podcast script.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
          {/* Text Files Upload Section */}
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '32px', maxWidth: '600px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                backgroundColor: '#ede9fe', 
                borderRadius: '8px', 
                marginRight: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#7c3aed', fontSize: '16px' }}>📝</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>Upload Your Text Files</h2>
            </div>
            
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.5' }}>
              Upload your research papers, stories, or any text content as .txt files. You can upload multiple files that will be processed together.
            </p>

            <StoryDropZone onStoryUpload={handleStoryUpload} />
            
            {storyFiles && storyFiles.length > 0 && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
                <p style={{ fontSize: '14px', color: '#166534', margin: '0 0 8px 0', fontWeight: '500' }}>
                  ✓ {storyFiles.length} file{storyFiles.length !== 1 ? 's' : ''} uploaded
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {Array.from(storyFiles).map((file, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '4px 8px',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      border: '1px solid #bbf7d0'
                    }}>
                      <span style={{ fontSize: '12px', color: '#166534', flex: 1 }}>
                        📝 {file.name} ({Math.round(file.size / 1024)} KB)
                      </span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '11px', color: '#166534', margin: '8px 0 0 0', fontStyle: 'italic' }}>
                  You can upload additional text files by dropping them or clicking above
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '500',
              borderRadius: '8px',
              border: 'none',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              backgroundColor: canSubmit ? '#7c3aed' : '#d1d5db',
              color: canSubmit ? 'white' : '#6b7280',
              transition: 'all 0.2s ease'
            }}
          >
Analyze Text Content
          </button>
        </div>
      </div>
    </div>
  )
} 