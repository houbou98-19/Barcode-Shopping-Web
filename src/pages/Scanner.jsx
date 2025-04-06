import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function Scanner() {
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)
  const currentCameraIndex = useRef(0)
  const camerasRef = useRef([])

  const [lastScanned, setLastScanned] = useState(null)
  const [isTorchOn, setIsTorchOn] = useState(false)

  const scannerId = "fullscreen-scanner"

  const startCamera = (cameraId) => {
    const html5QrCode = html5QrCodeRef.current
    html5QrCode
      .start(
        cameraId,
        {
          fps: 10,
          rememberLastUsedCamera: true,
        },
        (decodedText) => {
          setLastScanned(decodedText)
        },
        (errorMessage) => {
          // console.warn("Scan error", errorMessage)
        }
      )
      .catch((err) => console.error("Failed to start camera:", err))
  }

  const stopCamera = () => {
    return html5QrCodeRef.current?.stop().then(() => {
      return html5QrCodeRef.current?.clear()
    })
  }

  const switchCamera = async () => {
    await stopCamera()
    currentCameraIndex.current =
      (currentCameraIndex.current + 1) % camerasRef.current.length
    const newCamera = camerasRef.current[currentCameraIndex.current]
    startCamera(newCamera.id)
  }

  const toggleTorch = () => {
    const html5QrCode = html5QrCodeRef.current
    html5QrCode
      .applyVideoConstraints({
        advanced: [{ torch: !isTorchOn }],
      })
      .then(() => setIsTorchOn((prev) => !prev))
      .catch((err) => console.warn("Torch toggle not supported:", err))
  }

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(scannerId)
    html5QrCodeRef.current = html5QrCode

    Html5Qrcode.getCameras().then((devices) => {
      if (devices.length > 0) {
        camerasRef.current = devices
        startCamera(devices[0].id)
      }
    })

    return () => {
      stopCamera().catch((err) => console.error("Cleanup error:", err))
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
          height: '60vh',
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
