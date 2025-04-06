import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Scanner from './pages/Scanner.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scanner" element={<Scanner />} />
    </Routes>
  )
}
