import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import ContractorCheck from './pages/ContractorCheck'
import ManageJobs from './pages/ManageJobs'
import './App.css'

function App() {
  return (
    <div className="app">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/check">Contractor Check</Link></li>
          <li><Link to="/jobs">Manage Jobs</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/check" element={<ContractorCheck />} />
        <Route path="/jobs" element={<ManageJobs />} />
      </Routes>
    </div>
  )
}

export default App