import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function Scanner() {
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)
  const camerasRef = useRef([])
  const currentCameraIndex = useRef(0)

  const [lastScanned, setLastScanned] = useState(null)
  const [isTorchOn, setIsTorchOn] = useState(false)

  const scannerId = 'fullscreen-scanner'

  const waitForElementAndStart = (cameraId, retry = 0) => {
    const element = document.getElementById(scannerId)

    if (!element) {
      if (retry > 10) {
        console.error("Scanner DOM element still not available after retries.")
        return
      }

      setTimeout(() => waitForElementAndStart(cameraId, retry + 1), 100)
      return
    }

    html5QrCodeRef.current
      .start(
        cameraId,
        {
          fps: 15,
          videoConstraints: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        (decodedText) => {
          if (decodedText !== lastScanned) {
            setLastScanned(decodedText)
          }
        },
        () => {}
      )
      .catch((err) => console.error('Start error:', err))
  }

  const stopCamera = async () => {
    const scanner = html5QrCodeRef.current
    if (scanner && scanner._isScanning) {
      try {
        await scanner.stop()
        await scanner.clear()
      } catch (err) {
        console.warn("Stop camera failed:", err)
      }
    }
  }

  const switchCamera = async () => {
    await stopCamera()
    currentCameraIndex.current =
      (currentCameraIndex.current + 1) % camerasRef.current.length
    const nextCamera = camerasRef.current[currentCameraIndex.current]
    waitForElementAndStart(nextCamera.id)
  }

  const toggleTorch = () => {
    html5QrCodeRef.current
      .applyVideoConstraints({
        advanced: [{ torch: !isTorchOn }],
      })
      .then(() => setIsTorchOn((prev) => !prev))
      .catch((err) => console.warn('Torch toggle not supported:', err))
  }

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(scannerId)
    html5QrCodeRef.current = html5QrCode

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!devices.length) return

        camerasRef.current = devices
        const preferredCamera = devices[0]
        currentCameraIndex.current = 0
        waitForElementAndStart(preferredCamera.id)
      })
      .catch((err) => {
        console.error('Camera access error:', err)
      })

    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <h2>📷 Scan a Barcode</h2>

      <div
        id={scannerId}
        ref={scannerRef}
        onClick={switchCamera}
        style={{
          width: '100%',
          maxWidth: '700px',
          aspectRatio: '16/9',
          margin: '0 auto',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          cursor: 'pointer',
        }}
      ></div>

      <button
        onClick={toggleTorch}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '6px',
          backgroundColor: isTorchOn ? '#ffc107' : '#ddd',
          cursor: 'pointer',
        }}
      >
        {isTorchOn ? '🔦 Torch On' : '💡 Turn On Torch'}
      </button>

      {lastScanned && (
        <p style={{ marginTop: '1rem' }}>
          Last scanned: <strong>{lastScanned}</strong>
        </p>
      )}
    </div>
  )
}
