import React, { useState } from 'react';

const AddClient = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch('http://localhost:4000/api/add-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          address,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus('Client added successfully!');
        // Reset form
        setName('');
        setAddress('');
        window.location.reload();
      } else {
        setStatus(`Error: ${data.message || 'Failed to add client'}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-form-container">
      <h3>Add New Client</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="clientName">Client Name:</label>
          <input
            type="text"
            id="clientName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Building Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Client'}
        </button>
      </form>
      {status && (
        <div className={status.includes('Error') ? 'error' : 'success'}>
          {status}
        </div>
      )}
    </div>
  );
};

export default AddClient;
