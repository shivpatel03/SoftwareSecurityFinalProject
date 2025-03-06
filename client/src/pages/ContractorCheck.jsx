import { useState } from 'react'
import axios from 'axios'

function ContractorCheck() {
  const [uid, setUid] = useState('')
  const [pin, setPin] = useState('')
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('http://localhost:3000/api/check-contractor', {
        params: { uid, pin }
      })
      setResult(response.data)
    } catch (error) {
      setResult({ error: error.response?.data?.error || 'An error occurred' })
    }
  }

  return (
    <div>
      <h2>Contractor Check</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Card UID:
            <input
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            PIN:
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Check Access</button>
      </form>

      {result && (
        <div>
          {result.error ? (
            <p style={{ color: 'red' }}>{result.error}</p>
          ) : (
            <p style={{ color: 'green' }}>{result.message}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ContractorCheck