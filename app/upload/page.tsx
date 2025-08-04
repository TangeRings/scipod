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
        accept=".txt,.docx"
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
        Upload your story (.txt or .docx)
      </p>
      <p style={{ 
        fontSize: '14px', 
        color: '#6b7280', 
        margin: '0' 
      }}>
        Drag and drop or click to browse
      </p>
    </div>
  )
}

// ResearchDropZone Component
function ResearchDropZone({ onResearchUpload }: { onResearchUpload: (files: FileList | null) => void }) {
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
      onResearchUpload(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onResearchUpload(e.target.files)
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
        accept=".pdf"
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
        Upload your academic papers (.pdf)
      </p>
      <p style={{ 
        fontSize: '14px', 
        color: '#6b7280', 
        margin: '0' 
      }}>
        Drag and drop or click to browse
      </p>
    </div>
  )
}

export default function UploadPage() {
  const router = useRouter()
  const [storyFiles, setStoryFiles] = useState<FileList | null>(null)
  const [researchFiles, setResearchFiles] = useState<FileList | null>(null)

  const handleStoryUpload = (files: FileList | null) => {
    setStoryFiles(files)
  }

  const handleResearchUpload = (files: FileList | null) => {
    setResearchFiles(files)
  }

  const handleSubmit = () => {
    if (storyFiles && researchFiles) {
      router.push('/review')
    }
  }

  const canSubmit = storyFiles && researchFiles

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            Turn Your Research Into a Podcast
          </h1>
          <p style={{ fontSize: '20px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            Share your story and your science — we'll help you tell it.
          </p>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', marginBottom: '48px' }}>
          {/* Your Story Section */}
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '32px' }}>
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
                <span style={{ color: '#7c3aed', fontSize: '16px' }}>🎤</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>Your Story</h2>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <button style={{ 
                  padding: '8px 16px', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#6b7280',
                  background: 'none',
                  border: 'none',
                  borderBottom: '2px solid transparent',
                  cursor: 'pointer'
                }}>
                  Write
                </button>
                <button style={{ 
                  padding: '8px 16px', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#7c3aed',
                  background: 'none',
                  border: 'none',
                  borderBottom: '2px solid #7c3aed',
                  cursor: 'pointer'
                }}>
                  Upload File
                </button>
              </div>
            </div>

            <StoryDropZone onStoryUpload={handleStoryUpload} />
            
            {storyFiles && storyFiles.length > 0 && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
                <p style={{ fontSize: '14px', color: '#166534', margin: 0 }}>
                  ✓ {storyFiles[0].name} uploaded
                </p>
              </div>
            )}
          </div>

          {/* Your Research Section */}
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '32px' }}>
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
                <span style={{ color: '#7c3aed', fontSize: '16px' }}>📄</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>Your Research</h2>
            </div>

            <ResearchDropZone onResearchUpload={handleResearchUpload} />
            
            {researchFiles && researchFiles.length > 0 && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
                <p style={{ fontSize: '14px', color: '#166534', margin: '0 0 4px 0' }}>
                  ✓ {researchFiles.length} paper(s) uploaded
                </p>
                <ul style={{ fontSize: '12px', color: '#166534', margin: 0, paddingLeft: '16px' }}>
                  {Array.from(researchFiles).map((file, index) => (
                    <li key={index}>• {file.name}</li>
                  ))}
                </ul>
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
            Continue to Review
          </button>
        </div>
      </div>
    </div>
  )
} 