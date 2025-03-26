import React, { useState } from 'react';
import './App.css';

function App() {
  const [pin, setPin] = useState('');
  const [uid, setUid] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState(null);

  const handleComplete = async (jobId, contractorName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to mark ${contractorName}'s job as complete?`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/complete-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: jobId }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete job');
      }

      const data = await response.json();
      setStatus(`Job completed successfully: ${data.message}`);
      setJobData(null); // Clear the job data after completion
    } catch (error) {
      setStatus(`Error completing job: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setJobData(null);

    try {
      // Using POST method to send body data with correct field names
      console.log(`Attempting to validate contractor with PIN: ${pin} and UID: ${uid}`);
      const apiUrl = `http://localhost:4000/api/check-contractor`;
      console.log(`API URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: pin, uid: uid }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text.substring(0, 100) + '...');
        throw new Error(`Server returned non-JSON response (${response.status}). Your API server might not be configured correctly.`);
      }
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus(`Valid contractor: ${data.message}`);
        if (data.jobId) {
          setJobData(data);
        }
      } else {
        setStatus(`Error: ${data.message || 'Contractor validation failed'}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Contractor Verification</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pin">PIN:</label>
            <input
              type="text"
              id="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="uid">Card UID:</label>
            <input
              type="text"
              id="uid"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Contractor'}
          </button>
        </form>
        {status && (
          <div className={status.includes('Error') ? 'error' : 'success'}>
            {status}
          </div>
        )}
        {jobData && jobData.jobId && (
          <div className="job-actions" style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={() => handleComplete(jobData.jobId, jobData.contractorName)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1em'
              }}
            >
              Mark Job as Complete
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;