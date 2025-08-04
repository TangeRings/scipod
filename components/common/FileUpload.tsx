"use client"

import { useState, useRef } from "react"

interface FileUploadProps {
  onUpload: (files: FileList | null) => void
  accept: string
  label: string
  multiple?: boolean
}

export default function FileUpload({ onUpload, accept, label, multiple = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
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
      onUpload(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpload(e.target.files)
  }

  return (
    <div
      style={{
        border: isDragging ? '2px dashed #7c3aed' : '2px dashed #d1d5db',
        backgroundColor: isDragging ? '#f3f4f6' : 'white',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept={accept}
        onChange={handleFileChange}
        multiple={multiple}
      />

      <div style={{ 
        width: '32px', 
        height: '32px', 
        backgroundColor: '#7c3aed',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '8px'
      }}>
        <span style={{ color: 'white', fontSize: '18px' }}>↑</span>
      </div>
      <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: '4px 0' }}>{label}</p>
      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>Drag and drop or click to browse</p>
    </div>
  )
}
