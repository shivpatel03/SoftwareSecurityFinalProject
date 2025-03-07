import React, { useState, useEffect } from 'react';

const AddJob = () => {
  const [clientId, setClientId] = useState('');
  const [contractorId, setContractorId] = useState('');
  const [workDate, setWorkDate] = useState('');
  const [clients, setClients] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse, contractorsResponse] = await Promise.all([
          fetch('http://localhost:4000/api/clients'),
          fetch('http://localhost:4000/api/contractors')
        ]);
        
        if (!clientsResponse.ok) {
          throw new Error(`Server responded with status: ${clientsResponse.status}`);
        }
        
        if (!contractorsResponse.ok) {
          throw new Error(`Server responded with status: ${contractorsResponse.status}`);
        }
        
        const clientsData = await clientsResponse.json();
        const contractorsData = await contractorsResponse.json();
        
        console.log('Contractors data:', contractorsData);
        
        setClients(clientsData);
        setContractors(contractorsData);

        // Set defaults if data exists
        if (clientsData.length > 0) {
          setClientId(clientsData[0].client_id);
        }
        if (contractorsData.length > 0) {
          // Use person_id instead of id
          setContractorId(contractorsData[0].person_id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to load data: ${error.message}`);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      console.log(`Submitting job with contractor ID: ${contractorId}`);
      
      const response = await fetch('http://localhost:4000/api/add-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractor: contractorId,
          clientId: clientId,
          day: workDate
        }),
      });

      const data = await response.json();
      console.log('Job creation response:', data);
      
      if (response.ok) {
        setStatus('Job added successfully!');
        setWorkDate('');
      } else {
        setStatus(`Error: ${data.message || data.error || 'Failed to add job'}`);
      }
    } catch (error) {
      console.error('Error creating job:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <div className="loading">Loading data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="add-form-container">
      <h3>Create New Job</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="clientId">Client:</label>
          <select
            id="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            {clients.map((client) => (
              <option key={client.client_id} value={client.client_id}>
                {client.name} - {client.address}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="workDate">Work Date:</label>
          <input
            type="date"
            id="workDate"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="contractorId">Contractor:</label>
          <select
            id="contractorId"
            value={contractorId}
            onChange={(e) => setContractorId(e.target.value)}
            required
          >
            {contractors.map((contractor) => (
              <option key={contractor.person_id} value={contractor.person_id}>
                {contractor.name} - {contractor.company || 'No Company'}
              </option>
            ))}
          </select>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Job'}
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

export default AddJob;