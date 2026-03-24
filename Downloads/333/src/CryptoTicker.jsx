/* Exact crypto ticker from original site — uses CDN images just like the original */
const COINS = [
  { symbol: 'BTC',   price: 86191.93, change:  2.28, img: 'https://market-assets.fsn1.your-objectstorage.com/crypto/rx5wufxh.png' },
  { symbol: 'ETH',   price: 2825.05,  change:  2.86, img: 'https://market-assets.fsn1.your-objectstorage.com/crypto/6uz3nomy.png' },
  { symbol: 'USDT',  price: 1.00,     change:  0.01, img: 'https://market-assets.fsn1.your-objectstorage.com/crypto/lnkbsqlv.png' },
  { symbol: 'XRP',   price: 2.05,     change:  5.67, img: 'https://market-assets.fsn1.your-objectstorage.com/crypto/a25ldwo6.png' },
  { symbol: 'BNB',   price: 845.13,   change:  2.19, img: 'https://market-assets.fsn1.your-objectstorage.com/crypto/bpabfako.png' },
  { symbol: 'USDC',  price: 1.00,     change:  0.03, img: 'https://market-assets.fsn1.your-objectstorage.com/crypto/ucek74xs.png' },
  { symbol: 'SOL',   price: 130.18,   change:  3.20, img: 'https://market-assets.fsn1.your-objectstorage.com/crypto/6uu7dhud.png' },
  { symbol: 'TRX',   price: 0.27,     change: -5.56, img: 'https://market-assets.fsn1.your-objectstorage.com/crypto/f7xkii73.png' },
  { symbol: 'STETH', price: 2825.07,  change:  3.14, img: 'https://market-assets.fsn1.your-objectstorage.com/crypto/dpkrokkk.png' },
  { symbol: 'DOGE',  price: 0.14,     change:  4.44, img: 'https://market-assets.fsn1.your-objectstorage.com/crypto/rxfgg6pj.png' },
  { symbol: 'ADA',   price: 0.41,     change: -0.41, img: 'https://market-assets.fsn1.your-objectstorage.com/crypto/iugsd3sn.png' },
  { symbol: 'WBTC',  price: 86150.00, change:  2.10, img: 'https://market-assets.fsn1.your-objectstorage.com/crypto/2kgfdjbq.png' },
  { symbol: 'LINK',  price: 14.67,    change:  1.23, img: 'https://market-assets.fsn1.your-objectstorage.com/crypto/gsuucp3m.png' },
]

export default function CryptoTicker() {
  const doubled = [...COINS, ...COINS]
  return (
    <div className="crypto-ticker" style={{
      background: 'linear-gradient(90deg, #1D2330 0%, #262B38 100%)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '12px 0',
      borderBottom: '1px solid #282E3B',
      position: 'relative',
    }}>
      <div className="ticker-wrap" style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexWrap: 'nowrap', animation: 'scroll-left 40s linear infinite' }}>
          {doubled.map((coin, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center',
              marginRight: 50, color: '#fff', fontSize: 14, fontWeight: 500,
              flexShrink: 0, whiteSpace: 'nowrap',
              fontFamily: 'Outfit, Inter, sans-serif',
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <img
                  src={coin.img}
                  alt={coin.symbol}
                  style={{ width: 20, height: 20, marginRight: 6, borderRadius: '50%', display: 'inline-block', verticalAlign: 'middle' }}
                />
              </span>
              <span style={{ color: '#3a96ff', fontWeight: 600, marginRight: 8 }}>{coin.symbol}</span>
              <span style={{ color: '#00C896', marginRight: 8 }}>
                ${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{ color: coin.change >= 0 ? '#00C896' : '#FF4757' }}>
                {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
