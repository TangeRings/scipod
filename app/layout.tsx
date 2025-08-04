export const metadata = {
  title: "SciPod Studio - Convert Research into Engaging Podcasts",
  description: "Transform your academic papers and research into compelling podcast content with AI assistance.",
}

// Simple Header Component
function Header() {
  return (
    <header style={{ 
      borderBottom: '1px solid #e5e7eb', 
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(8px)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      padding: '16px 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <span style={{ fontSize: '20px', fontFamily: 'serif', fontWeight: 'bold', color: '#6b46c1' }}>SciPod Studio</span>
          </a>
        </div>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>
            About
          </a>
          <a href="#" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>
            How it Works
          </a>
          <button style={{ 
            padding: '8px 16px',
            border: '1px solid #c4b5fd',
            color: '#7c3aed',
            backgroundColor: 'transparent',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            Login
          </button>
        </nav>
      </div>
    </header>
  )
}

// Simple Footer Component
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #e5e7eb', padding: '24px 0', backgroundColor: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
        <p style={{ color: '#64748b', marginBottom: '16px', fontSize: '16px' }}>Built for scientists who want to be heard.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '14px', color: '#94a3b8' }}>
          <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
            Terms
          </a>
          <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
            Privacy
          </a>
          <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
} 