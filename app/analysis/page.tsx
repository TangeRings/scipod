"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Mock data for podcast structures
const podcastStructures = [
  {
    id: 'narrative',
    title: 'Narrative Journey',
    description: 'A storytelling approach that follows your personal research journey',
    outline: [
      'Personal Introduction & Background',
      'The Research Problem Discovery',
      'Methodology & Challenges',
      'Key Findings & Breakthroughs',
      'Impact & Future Directions'
    ],
    sampleQuestions: [
      'What inspired you to pursue this specific research topic?',
      'Can you walk us through your "aha!" moment during the research?',
      'What was the biggest challenge you faced, and how did you overcome it?',
      'How do you see your findings changing the field?',
      'What advice would you give to young researchers?'
    ]
  },
  {
    id: 'interview',
    title: 'Expert Interview',
    description: 'A Q&A format positioning you as the expert guest being interviewed',
    outline: [
      'Host Introduction & Guest Background',
      'Research Area Deep Dive',
      'Technical Discussion & Methodology',
      'Practical Applications & Implications',
      'Lightning Round & Conclusion'
    ],
    sampleQuestions: [
      'Can you explain your research in terms a general audience would understand?',
      'What makes your approach different from previous studies?',
      'What were the most surprising results from your research?',
      'How might your findings be applied in real-world scenarios?',
      'What are the next big questions in your field?'
    ]
  },
  {
    id: 'deepdive',
    title: 'Research Deep Dive',
    description: 'Technical exploration focusing on methodology, data, and scientific rigor',
    outline: [
      'Research Context & Literature Review',
      'Detailed Methodology Explanation',
      'Data Analysis & Statistical Findings',
      'Discussion of Limitations & Validity',
      'Scientific Impact & Peer Review Process'
    ],
    sampleQuestions: [
      'How did you design your study to address the research question?',
      'What statistical methods did you use and why?',
      'How do you ensure the reproducibility of your results?',
      'What are the key limitations of your study?',
      'How does your work build upon existing research in the field?'
    ]
  }
]

export default function AnalysisPage() {
  const router = useRouter()
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [editingQuestions, setEditingQuestions] = useState<{[key: string]: string[]}>({})

  // Simulate analysis loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnalyzing(false)
    }, 3000) // 3 seconds loading
    return () => clearTimeout(timer)
  }, [])

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

  const getQuestions = (structure: any) => {
    return structure.sampleQuestions.map((q: string, index: number) => 
      editingQuestions[structure.id]?.[index] || q
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
            Analyzing Your Content
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '24px' }}>
            Our AI is reading your story and research papers to create personalized podcast structures...
          </p>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
              ✅ Story analyzed<br/>
              ✅ Research papers processed<br/>
              🔄 Generating podcast structures...
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Choose Your Podcast Style
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: '700px', margin: '0 auto' }}>
            Based on your story and research, we've created three podcast structures tailored to your content. Select the one that resonates with you.
          </p>
        </div>

        {/* Three Structure Blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {podcastStructures.map((structure) => (
            <div 
              key={structure.id}
              style={{ 
                backgroundColor: 'white', 
                border: selectedStructure === structure.id ? '2px solid #7c3aed' : '1px solid #e5e7eb',
                borderRadius: '12px', 
                padding: '32px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: selectedStructure === structure.id ? 'translateY(-4px)' : 'none',
                boxShadow: selectedStructure === structure.id ? '0 10px 25px rgba(124, 58, 237, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              onClick={() => handleStructureSelect(structure.id)}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  {structure.title}
                </h3>
                <div style={{ 
                  width: '24px', 
                  height: '24px',
                  borderRadius: '50%',
                  border: selectedStructure === structure.id ? '2px solid #7c3aed' : '2px solid #d1d5db',
                  backgroundColor: selectedStructure === structure.id ? '#7c3aed' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedStructure === structure.id && (
                    <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />
                  )}
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.5' }}>
                {structure.description}
              </p>

              {/* Outline */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                  Podcast Structure:
                </h4>
                <ol style={{ margin: 0, paddingLeft: '20px', color: '#6b7280', fontSize: '14px' }}>
                  {structure.outline.map((item, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{item}</li>
                  ))}
                </ol>
              </div>

              {/* Sample Questions */}
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                  Sample Interview Questions:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {getQuestions(structure).map((question, index) => (
                    <div key={index} style={{ 
                      padding: '8px 12px', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => handleQuestionEdit(structure.id, index, e.target.value)}
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
            Back to Upload
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