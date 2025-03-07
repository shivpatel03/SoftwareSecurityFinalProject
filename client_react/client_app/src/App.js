import React, { useState } from 'react';
import './App.css';

function App() {
  const [pin, setPin] = useState('');
  const [uid, setUid] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

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
      </main>
    </div>
  );
}

export default App;