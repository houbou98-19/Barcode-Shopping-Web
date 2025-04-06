import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Hello, Shopping App Frontend!</h1>
      <Link to="/scanner">
        <button style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>
          Go to Barcode Scanner
        </button>
      </Link>
    </div>
  )
}
