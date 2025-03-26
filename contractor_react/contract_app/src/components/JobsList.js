import React, { useState, useEffect } from 'react';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clients, setClients] = useState([]);
  const [showPastJobs, setShowPastJobs] = useState(false);

  const handleDelete = async (jobId, clientName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete this job for "${clientName}"?\n\nThis action cannot be undone!`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/delete-job', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: jobId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      // Refresh the jobs list
      await fetchJobs(showPastJobs);
    } catch (error) {
      setError(`Failed to delete job: ${error.message}`);
    }
  };

  const handleComplete = async (jobId, clientName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to mark this job for "${clientName}" as complete?\n\nThis will move it to the past jobs list.`
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

      // Refresh the jobs list
      await fetchJobs(showPastJobs);
    } catch (error) {
      setError(`Failed to complete job: ${error.message}`);
    }
  };

  const fetchJobs = async (isPastJobs) => {
    try {
      const endpoint = isPastJobs ? '/api/past-jobs' : '/api/jobs';
      const jobsResponse = await fetch(`http://localhost:4000${endpoint}`);
      
      if (!jobsResponse.ok) {
        throw new Error(`Failed to fetch jobs: ${jobsResponse.status}`);
      }
      
      const jobsData = await jobsResponse.json();
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(`Failed to load jobs: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // First fetch clients to have their names for reference
        const clientsResponse = await fetch('http://localhost:4000/api/clients');
        
        if (!clientsResponse.ok) {
          throw new Error(`Failed to fetch clients: ${clientsResponse.status}`);
        }
        
        const clientsData = await clientsResponse.json();
        setClients(clientsData);
        
        // Then fetch jobs based on current toggle state
        await fetchJobs(showPastJobs);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to load data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showPastJobs]); // Re-run when showPastJobs changes

  // Helper function to find client name by ID
  const getClientNameById = (clientId) => {
    const client = clients.find(c => c.client_id === clientId);
    return client ? client.name : 'N/A';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    
    try {
      // Parse the ISO date string
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      // Format as YYYY-MM-DD
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error('Date parsing error:', e);
      return 'Invalid Date';
    }
  };

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="list-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Jobs List</h3>
        <button 
          onClick={() => setShowPastJobs(!showPastJobs)}
          style={{ padding: '0.5rem 1rem' }}
        >
          {showPastJobs ? 'Show Current Jobs' : 'Show Past Jobs'}
        </button>
      </div>
      {jobs.length === 0 ? (
        <p>No {showPastJobs ? 'past ' : ''}jobs found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Contractor</th>
              <th>Work Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>{getClientNameById(job.client_id)}</td>
                <td>{job.assigned_contractor ? `ID: ${job.assigned_contractor}` : 'Not Assigned'}</td>
                <td>{formatDate(job.day)}</td>
                <td>{job.complete ? 'Completed' : 'Pending'}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {!showPastJobs && !job.complete && (
                    <>
                      <button
                        onClick={() => handleComplete(job.id, getClientNameById(job.client_id))}
                        className="action-btn complete-btn"
                        title="Mark as complete"
                        style={{ 
                          marginRight: '8px', 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          fontSize: '1.2em',
                          color: '#2ecc71',  // Nice green color
                          fontWeight: 'bold'
                        }}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleDelete(job.id, getClientNameById(job.client_id))}
                        className="action-btn delete-btn"
                        title="Delete job"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JobsList;
