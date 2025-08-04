"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface PodcastFormat {
  id: string;
  title: string;
  description: string;
  segments: string[];
  key_questions: string[];
  potential_guests: string[];
  unique_elements: string[];
}

interface PodcastAnalysisRecord {
  id: string;
  timestamp: string;
  contentLength: number;
  contentPreview: string;
  podcastFormats: PodcastFormat[];
  totalFormats: number;
  processingTimeMs: number;
}

export default function AnalysisPage() {
  const router = useRouter()
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [editingQuestions, setEditingQuestions] = useState<{[key: string]: string[]}>({})
  const [podcastFormats, setPodcastFormats] = useState<PodcastFormat[]>([])
  const [analysisInfo, setAnalysisInfo] = useState<PodcastAnalysisRecord | null>(null)
  const [error, setError] = useState<string>('')

  // Fetch real analysis data
  useEffect(() => {
    fetchLatestAnalysis()
  }, [])

  const fetchLatestAnalysis = async () => {
    try {
      setIsAnalyzing(true)
      setError('')
      
      const response = await fetch('/api/get-podcast-analyses')
      if (!response.ok) {
        throw new Error('Failed to fetch podcast analyses')
      }
      
      const analyses: PodcastAnalysisRecord[] = await response.json()
      
      if (analyses.length === 0) {
        throw new Error('No podcast analyses found. Please go back and upload text files first.')
      }
      
      // Get the most recent analysis
      const latestAnalysis = analyses[analyses.length - 1]
      setAnalysisInfo(latestAnalysis)
      setPodcastFormats(latestAnalysis.podcastFormats)
      
    } catch (err) {
      console.error('Error fetching analysis:', err)
      setError(err instanceof Error ? err.message : 'Failed to load podcast analysis')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleStructureSelect = (structureId: string) => {
    setSelectedStructure(structureId)
  }

  const handleQuestionEdit = (structureId: string, questionIndex: number, newQuestion: string) => {
    setEditingQuestions(prev => ({
      ...prev,
      [structureId]: {
        ...prev[structureId],
        [questionIndex]: newQuestion
      }
    }))
  }

  const getQuestions = (format: PodcastFormat) => {
    return format.key_questions.map((q: string, index: number) => 
      editingQuestions[format.id]?.[index] || q
    )
  }

  const handleGeneratePodcast = () => {
    if (selectedStructure) {
      router.push('/generate')
    }
  }

  if (isAnalyzing) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', padding: '40px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #7c3aed',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }} />
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Loading Your Analysis
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '24px' }}>
            Fetching your AI-generated podcast formats from storage...
          </p>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
              🔄 Loading latest analysis results...
            </p>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', padding: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>❌</div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Analysis Not Found
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px' }}>
            {error}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '500',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#7c3aed',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Start New Analysis
            </button>
            <button
              onClick={fetchLatestAnalysis}
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '500',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Choose Your Podcast Style
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: '700px', margin: '0 auto 24px auto' }}>
            Based on your uploaded content, our AI has generated three unique podcast formats tailored specifically for you. Select the one that resonates with your vision.
          </p>
          {analysisInfo && (
            <div style={{ fontSize: '14px', color: '#6b7280', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '600px', margin: '0 auto' }}>
              📊 Analysis from {new Date(analysisInfo.timestamp).toLocaleDateString()} • 
              {analysisInfo.contentLength.toLocaleString()} characters processed • 
              {analysisInfo.processingTimeMs}ms generation time
            </div>
          )}
        </div>

        {/* AI-Generated Format Blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {podcastFormats.map((format) => (
            <div 
              key={format.id}
              style={{ 
                backgroundColor: 'white', 
                border: selectedStructure === format.id ? '2px solid #7c3aed' : '1px solid #e5e7eb',
                borderRadius: '12px', 
                padding: '32px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: selectedStructure === format.id ? 'translateY(-4px)' : 'none',
                boxShadow: selectedStructure === format.id ? '0 10px 25px rgba(124, 58, 237, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              onClick={() => handleStructureSelect(format.id)}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  {format.title}
                </h3>
                <div style={{ 
                  width: '24px', 
                  height: '24px',
                  borderRadius: '50%',
                  border: selectedStructure === format.id ? '2px solid #7c3aed' : '2px solid #d1d5db',
                  backgroundColor: selectedStructure === format.id ? '#7c3aed' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedStructure === format.id && (
                    <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />
                  )}
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.5' }}>
                {format.description}
              </p>

              {/* Segments */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                  📋 Podcast Segments:
                </h4>
                <ol style={{ margin: 0, paddingLeft: '20px', color: '#6b7280', fontSize: '14px' }}>
                  {format.segments.map((segment, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{segment}</li>
                  ))}
                </ol>
              </div>

              {/* Potential Guests */}
              {format.potential_guests && format.potential_guests.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                    🎤 Potential Guests:
                  </h4>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {format.potential_guests.join(' • ')}
                  </div>
                </div>
              )}

              {/* Unique Elements */}
              {format.unique_elements && format.unique_elements.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                    ✨ Unique Elements:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#6b7280', fontSize: '14px' }}>
                    {format.unique_elements.map((element, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>{element}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Questions */}
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                  ❓ Key Interview Questions:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {getQuestions(format).map((question, index) => (
                    <div key={index} style={{ 
                      padding: '8px 12px', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => handleQuestionEdit(format.id, index, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '13px',
                          color: '#374151',
                          outline: 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ textAlign: 'center', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={() => router.back()}
            style={{
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: '500',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Back to Template
          </button>
          <button
            onClick={handleGeneratePodcast}
            disabled={!selectedStructure}
            style={{
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: '500',
              borderRadius: '8px',
              border: 'none',
              cursor: selectedStructure ? 'pointer' : 'not-allowed',
              backgroundColor: selectedStructure ? '#7c3aed' : '#d1d5db',
              color: selectedStructure ? 'white' : '#6b7280',
              transition: 'all 0.2s ease'
            }}
          >
            Generate Podcast Script
          </button>
        </div>
      </div>
    </div>
  )
}