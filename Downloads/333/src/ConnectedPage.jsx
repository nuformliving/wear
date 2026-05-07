import CryptoTicker from './CryptoTicker.jsx'

export default function ConnectedPage() {
  return (
    <div style={{
      background: '#02050a',
      fontFamily: '"Outfit", sans-serif',
      minHeight: '100vh',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 20, width: '100%' }}>
        <CryptoTicker />
      </div>

      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        padding: '40px',
        background: 'rgba(26,32,44,0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 32px rgba(16,185,129,0.25)'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 style={{
          fontSize: '36px',
          fontWeight: 700,
          margin: '0 0 16px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Wallet Connected!
        </h1>

        <p style={{
          fontSize: '18px',
          color: 'rgba(255,255,255,0.8)',
          margin: '0 0 32px',
          lineHeight: 1.6
        }}>
          Your wallet has been successfully connected to the RPC Browser.
          You can now access all Web3 features and blockchain functionality.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            padding: '20px',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '12px'
          }}>
            <h3 style={{ margin: '0 0 8px', color: '#10b981' }}>Secure Connection</h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              Your wallet is now securely connected via encrypted protocols.
            </p>
          </div>

          <div style={{
            padding: '20px',
            background: 'rgba(58,150,255,0.1)',
            border: '1px solid rgba(58,150,255,0.2)',
            borderRadius: '12px'
          }}>
            <h3 style={{ margin: '0 0 8px', color: '#3a96ff' }}>Multi-Chain Support</h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              Access Ethereum, Polygon, BSC, and other blockchain networks.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.location.href = '/connect'}
          style={{
            background: 'linear-gradient(135deg, #3a96ff, #2563eb)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 32px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 16px rgba(58,150,255,0.3)'
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        >
          Explore Features
        </button>
      </div>
    </div>
  )
}