import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CryptoTicker from './CryptoTicker.jsx'

const STATUS_MESSAGES = [
  'Initializing Web3 Environment...',
  'Clearing Browser Cache...',
  'Checking Security Protocols...',
  'Validating RPC Endpoints...',
  'Establishing Blockchain Connection...',
  'Updating Web3 Extensions...',
  'Configuring Smart Contract Interface...',
  'Optimizing Network Performance...',
  'Finalizing Connection...',
  'Launching RPC Browser...',
]

export default function App() {
  const [steps, setSteps] = useState([])      // { text, complete }
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('Initializing Web3 Environment...')
  const [exiting, setExiting] = useState(false)
  const containerRef = useRef(null)
  const statusRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    let currentStep = 0

    const interval = setInterval(() => {
      if (currentStep < STATUS_MESSAGES.length) {
        const pct = Math.round(((currentStep + 1) / STATUS_MESSAGES.length) * 100)
        setProgress(pct)
        setStatusText(STATUS_MESSAGES[currentStep])

        setSteps(prev => {
          // mark previous complete
          const updated = prev.map((s, i) =>
            i === prev.length - 1 ? { ...s, complete: true } : s
          )
          return [...updated, { text: STATUS_MESSAGES[currentStep], complete: false }]
        })

        currentStep++
      } else {
        // all done
        setProgress(100)
        setStatusText('Connection Established! Redirecting...')
        setSteps(prev => prev.map(s => ({ ...s, complete: true })))
        clearInterval(interval)

        setTimeout(() => {
          setExiting(true)
          setTimeout(() => navigate('/connect'), 800)
        }, 400)
      }
    }, 1400)

    return () => clearInterval(interval)
  }, [])

  // auto-scroll status list
  useEffect(() => {
    if (statusRef.current) {
      statusRef.current.scrollTop = statusRef.current.scrollHeight
    }
  }, [steps])

  return (
    <>
      <style>{`
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          min-height: 100vh;
          margin: 0;
        }

        .bg-animation {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0; left: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .bg-animation::before {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(58,150,255,0.15), transparent);
          border-radius: 50%;
          top: -200px; right: -200px;
          animation: bgFloat 20s ease-in-out infinite;
        }
        .bg-animation::after {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(0,200,150,0.1), transparent);
          border-radius: 50%;
          bottom: -150px; left: -150px;
          animation: bgFloat 15s ease-in-out infinite reverse;
        }
        @keyframes bgFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(50px,50px) scale(1.1); }
        }

        .crypto-float-sym {
          position: fixed;
          opacity: 0.1;
          z-index: 1;
          pointer-events: none;
          animation: floatCrypto 20s ease-in-out infinite;
          font-family: sans-serif;
          color: white;
        }
        .crypto-float-sym:nth-child(1){ top:20%; left:10%; font-size:60px; animation-delay:0s; }
        .crypto-float-sym:nth-child(2){ top:60%; right:15%; font-size:80px; animation-delay:5s; }
        .crypto-float-sym:nth-child(3){ bottom:20%; left:20%; font-size:50px; animation-delay:10s; }
        @keyframes floatCrypto {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-30px) rotate(10deg); }
        }

        .main-container {
          position: relative;
          z-index: 10;
          min-height: calc(100vh - 45px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 20px 30px;
        }

        .logo-section {
          text-align: center;
          margin-bottom: 60px;
          animation: fadeInDown 0.6s ease-out;
        }
        @keyframes fadeInDown {
          from { opacity:0; transform:translateY(-30px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .logo-icon {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, #3a96ff 0%, #2575d8 100%);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 8px 32px rgba(58,150,255,0.25);
          position: relative;
        }
        .logo-icon::after {
          content: '';
          position: absolute; inset: -2px;
          background: linear-gradient(135deg, #3a96ff, #00c896);
          border-radius: 18px;
          z-index: -1;
          opacity: 0.3;
          filter: blur(8px);
        }
        .logo-icon svg { width:40px; height:40px; fill:white; }

        .brand-name {
          font-size: 42px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .rpc-text {
          background: linear-gradient(135deg, #3a96ff 0%, #00c896 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
        }
        .brand-tagline {
          color: rgba(255,255,255,0.5);
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        .loading-card {
          background: rgba(26,32,44,0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 40px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: fadeInUp 0.8s ease-out 0.2s backwards;
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .loading-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .loading-text {
          font-size: 15px;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }
        .loading-percentage {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #3a96ff, #00c896);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .progress-container {
          position: relative;
          width: 100%;
          height: 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 25px;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #3a96ff, #00c896, #3a96ff);
          background-size: 200% 100%;
          border-radius: 10px;
          transition: width 0.3s ease;
          animation: shimmer 2s linear infinite;
          box-shadow: 0 0 20px rgba(58,150,255,0.5);
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .status-container {
          margin-top: 20px;
          max-height: 250px;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 10px;
        }
        .status-container::-webkit-scrollbar { width: 6px; }
        .status-container::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05); border-radius: 10px;
        }
        .status-container::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3a96ff, #00c896); border-radius: 10px;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }

        .status-icon {
          width: 20px; height: 20px;
          flex-shrink: 0;
          border: 2px solid rgba(58,150,255,0.3);
          border-radius: 50%;
          border-top-color: #3a96ff;
          animation: spinIcon 1s linear infinite;
        }
        .status-icon.complete {
          border: none;
          background: #00c896;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: none;
        }
        .status-icon.complete::after {
          content: '✓';
          color: white;
          font-size: 12px;
          font-weight: bold;
        }
        @keyframes spinIcon {
          to { transform: rotate(360deg); }
        }

        .footer-note {
          text-align: center;
          margin-top: 30px;
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          animation: fadeIn 0.8s ease-out 0.6s backwards;
        }

        .page-exit {
          animation: pageExit 0.8s cubic-bezier(0.68,-0.55,0.265,1.55) forwards;
        }
        @keyframes pageExit {
          0%   { transform: scale(1) rotate(0deg);   opacity:1; filter:blur(0px); }
          50%  { transform: scale(1.1);              filter:blur(5px); }
          100% { transform: scale(0) rotate(180deg); opacity:0; filter:blur(20px); }
        }

        @media (max-width: 600px) {
          .brand-name { font-size: 28px; }
          .brand-tagline { font-size: 13px; }
          .logo-icon { width:56px; height:56px; }
          .logo-icon svg { width:30px; height:30px; }
          .loading-card { padding: 25px 18px; }
          .logo-section { margin-bottom: 40px; }
          .status-container { max-height: 180px; }
        }
      `}</style>

      {/* Crypto ticker */}
      <CryptoTicker />

      {/* Animated background blobs */}
      <div className="bg-animation" />

      {/* Floating crypto symbols — 10% opacity, same as original */}
      <div className="crypto-float-sym">₿</div>
      <div className="crypto-float-sym">Ξ</div>
      <div className="crypto-float-sym">◈</div>

      {/* Main content */}
      <div className={`main-container${exiting ? ' page-exit' : ''}`} ref={containerRef}>

        {/* Logo / brand */}
        <div className="logo-section">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.22-.78-6-4.68-6-9V8.3l6-3.27 6 3.27V11c0 4.32-2.78 8.22-6 9zm-1-7h2v2h-2v-2zm0-6h2v4h-2V7z"/>
            </svg>
          </div>
          <h1 className="brand-name"><span className="rpc-text">RPC</span> Browser</h1>
          <p className="brand-tagline">Secure Web3 Connection Protocol</p>
        </div>

        {/* Loading card */}
        <div className="loading-card">
          <div className="loading-header">
            <span className="loading-text">{statusText}</span>
            <span className="loading-percentage">{progress}%</span>
          </div>

          <div className="progress-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="status-container" ref={statusRef}>
            {steps.map((s, i) => (
              <div className="status-item" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`status-icon${s.complete ? ' complete' : ''}`} />
                <span>{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="footer-note">⚠️ Do not close this window or refresh your browser</p>
      </div>
    </>
  )
}
