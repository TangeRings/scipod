"use client"

import { useState, useEffect } from "react"

export default function TemplatePage() {
  const [extractedText, setExtractedText] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [fileCount, setFileCount] = useState(0)
  const [extractionId, setExtractionId] = useState<string>('')
  const [fileDetails, setFileDetails] = useState<Array<{name: string, size: number, status: string}>>([])
  const [processingLog, setProcessingLog] = useState<string[]>([])
  
  // OpenAI state
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [podcastFormats, setPodcastFormats] = useState<any[]>([])
  const [analysisError, setAnalysisError] = useState<string>('')

  useEffect(() => {
    extractTextFromFiles()
  }, [])

  const extractTextFromFiles = async () => {
    try {
      setIsLoading(true)
      setError('')
      setProcessingLog([])

      // Get uploaded files from global variable
      const files = (window as any).uploadedFiles as File[]
      
      if (!files || files.length === 0) {
        setError('No files found. Please go back and upload files.')
        setIsLoading(false)
        return
      }

      setProcessingLog([`Found ${files.length} uploaded file(s)`])

      // Create FormData and add all files
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append('files', file)
        setProcessingLog(prev => [...prev, `Adding file ${index + 1}: ${file.name} (${Math.round(file.size / 1024)} KB)`])
      })

      setProcessingLog(prev => [...prev, 'Sending files to extraction API...'])

      // Send to extract-text API
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setExtractedText(result.extractedText)
        setFileCount(result.fileCount)
        setExtractionId(result.extractionId || '')
        setFileDetails(result.files || [])
        
        setProcessingLog(prev => [
          ...prev, 
          'Extraction completed successfully!',
          `Generated extraction ID: ${result.extractionId}`,
          `Total text length: ${result.extractedText.length} characters`,
          'Data saved to JSON storage file',
          'Starting AI analysis...'
        ])
        
        // Automatically start OpenAI analysis
        await analyzeWithOpenAI(result.extractedText)
        
      } else {
        throw new Error(result.error || 'Failed to extract text')
      }

    } catch (err) {
      console.error('Text extraction error:', err)
      setError(err instanceof Error ? err.message : 'Failed to extract text from files')
      setProcessingLog(prev => [...prev, `ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`])
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeWithOpenAI = async (textContent: string) => {
    try {
      setIsAnalyzing(true)
      setAnalysisError('')
      setProcessingLog(prev => [...prev, 'Sending content to OpenAI for podcast format generation...'])

      const response = await fetch('/api/analyze-podcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: textContent
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI analysis failed: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.podcast_formats) {
        setPodcastFormats(result.podcast_formats)
        setProcessingLog(prev => [
      ...prev,
          'OpenAI analysis completed successfully!',
          `Generated ${result.podcast_formats.length} podcast format options`,
          'Ready for review and selection'
        ])
      } else {
        throw new Error(result.error || 'Failed to generate podcast formats')
      }

    } catch (err) {
      console.error('OpenAI analysis error:', err)
      setAnalysisError(err instanceof Error ? err.message : 'Failed to analyze content with OpenAI')
      setProcessingLog(prev => [...prev, `AI ANALYSIS ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`])
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '20px' }}>
          Extracting text from uploaded files...
        </div>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Please wait while we process your files.
        </div>
        
        {processingLog.length > 0 && (
          <div style={{ 
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            padding: '15px',
            textAlign: 'left',
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Processing Log:</div>
            {processingLog.map((log, index) => (
              <div key={index} style={{ marginBottom: '2px' }}>
                {log}
          </div>
            ))}
        </div>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ fontSize: '18px', color: 'red', marginBottom: '20px' }}>
          Error: {error}
        </div>
            <button
          onClick={() => window.history.back()}
              style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
              }}
            >
              Go Back
            </button>
      </div>
    )
  }

  return (
          <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>
          Your Text Content
          </h1>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
          Successfully processed {fileCount} file{fileCount !== 1 ? 's' : ''}
          </p>
        {extractionId && (
          <p style={{ color: '#007bff', fontSize: '12px', fontFamily: 'monospace' }}>
            Extraction ID: {extractionId}
          </p>
        )}
        </div>

      {/* File Details */}
      {fileDetails.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>File Processing Summary</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {fileDetails.map((file, index) => (
              <div key={index} style={{
                backgroundColor: file.status === 'success' ? '#d4edda' : 
                                file.status === 'empty' ? '#fff3cd' : '#f8d7da',
                border: `1px solid ${file.status === 'success' ? '#c3e6cb' : 
                                   file.status === 'empty' ? '#ffeaa7' : '#f5c6cb'}`,
                borderRadius: '4px',
                padding: '10px',
                fontSize: '14px'
              }}>
                <div style={{ fontWeight: 'bold' }}>{file.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Size: {Math.round(file.size / 1024)} KB | Status: {file.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Extracted Text Content</h3>
                <div style={{ 
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '20px',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: '14px',
          lineHeight: '1.5',
          maxHeight: '60vh',
          overflow: 'auto'
        }}>
          {extractedText || 'No text extracted'}
        </div>
        
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          Total characters: {extractedText.length} | 
          Word count: ~{Math.round(extractedText.split(/\s+/).length)} | 
          Storage: Saved to data/extractions.json
                </div>
              </div>

      {/* Processing Log */}
      {processingLog.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Processing Log</h3>
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            padding: '15px',
            fontSize: '12px',
            fontFamily: 'monospace',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            {processingLog.map((log, index) => (
              <div key={index} style={{ marginBottom: '2px' }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Podcast Formats Section */}
      {podcastFormats.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>🎧 AI-Generated Podcast Formats</h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            {podcastFormats.map((format, index) => (
              <div key={format.id || index} style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {/* Format Header */}
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                    {format.title}
                  </h4>
                  <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                    {format.description}
                  </p>
                </div>

                {/* Segments */}
                <div style={{ marginBottom: '15px' }}>
                  <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                    📋 Segments:
                  </h5>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#555' }}>
                    {format.segments?.map((segment: string, idx: number) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{segment}</li>
                    ))}
                  </ul>
                </div>

                {/* Key Questions */}
                <div style={{ marginBottom: '15px' }}>
                  <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                    ❓ Key Questions:
                  </h5>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#555' }}>
                    {format.key_questions?.map((question: string, idx: number) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{question}</li>
                    ))}
                  </ul>
                </div>

                {/* Potential Guests */}
                <div style={{ marginBottom: '15px' }}>
                  <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                    🎤 Potential Guests:
                  </h5>
                  <div style={{ fontSize: '13px', color: '#555' }}>
                    {format.potential_guests?.join(', ') || 'No guests specified'}
                  </div>
              </div>

                {/* Unique Elements */}
              <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                    ✨ Unique Elements:
                  </h5>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#555' }}>
                    {format.unique_elements?.map((element: string, idx: number) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{element}</li>
                    ))}
                  </ul>
                </div>
                    </div>
                  ))}
                </div>
              </div>
      )}

      {/* Analysis Status */}
      {isAnalyzing && (
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-block',
            padding: '15px 25px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '8px',
            fontSize: '14px',
            color: '#856404'
          }}>
            🤖 AI is analyzing your content and generating podcast formats...
          </div>
        </div>
      )}

      {/* Analysis Error */}
      {analysisError && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb', 
            borderRadius: '8px',
            fontSize: '14px',
            color: '#721c24'
          }}>
            ❌ AI Analysis Error: {analysisError}
            </div>
        </div>
      )}

      {/* Confirm Button - only show when everything is complete */}
      {podcastFormats.length > 0 && !isAnalyzing && !analysisError && (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            onClick={() => window.location.href = '/analysis'}
            style={{
              padding: '16px 32px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          >
            ✅ Confirm & Continue to Analysis
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Go Back
        </button>
        <button 
          onClick={extractTextFromFiles}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
              cursor: 'pointer',
            marginRight: '10px'
            }}
          >
          Refresh
          </button>
          <button
          onClick={() => window.open('/api/get-extracted-text', '_blank')}
            style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
              cursor: 'pointer',
            marginRight: '10px'
            }}
          >
          View Text Storage
          </button>
          <button
          onClick={() => window.open('/api/get-podcast-analyses', '_blank')}
            style={{
            padding: '12px 24px',
            backgroundColor: '#17a2b8',
            color: 'white',
              border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          View Podcast Storage
          </button>
      </div>
    </div>
  )
}