import { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

export default function Scanner() {
  const [lastScanned, setLastScanned] = useState(null)

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "scanner-container",
      {
        fps: 10,
        qrbox: { width: 350, height: 120 },
        aspectRatio: 1.777,
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true
      },
      false
    )

    scanner.render(
      (decodedText) => {
        setLastScanned(decodedText)
      },
      (errorMessage) => {
        // you can optionally log errors here
      }
    )

    return () => {
      scanner.clear().catch((err) => console.error('Cleanup error:', err))
    }
  }, [])

  return (
    <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>📷 Scan a Barcode</h2>
      <div
        id="scanner-container"
        style={{
          width: '100%',
          height: '300px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }}
      ></div>
      {lastScanned && (
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Last scanned: <strong>{lastScanned}</strong>
        </p>
      )}
    </div>
  )
}
