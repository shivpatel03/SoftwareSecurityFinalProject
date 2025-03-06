import { useState, useEffect } from 'react'
import axios from 'axios'

function ManageJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:3000/api/jobs')
        setJobs(response.data)
      } catch (error) {
        setError('Failed to fetch jobs')
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return (
    <div>
      <h2>Manage Jobs</h2>
      <div>
        {jobs.map(job => (
          <div key={job.id}>
            <h3>Job #{job.id}</h3>
            <p>Contractor: {job.assigned_contractor}</p>
            <p>Client ID: {job.clientId}</p>
            <p>Date: {new Date(job.day).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageJobs