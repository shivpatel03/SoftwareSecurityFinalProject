import React, { useState, useEffect } from 'react';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch clients to have their names for reference
        const clientsResponse = await fetch('http://localhost:4000/api/clients');
        
        if (!clientsResponse.ok) {
          throw new Error(`Failed to fetch clients: ${clientsResponse.status}`);
        }
        
        const clientsData = await clientsResponse.json();
        setClients(clientsData);
        
        // Then fetch jobs
        const jobsResponse = await fetch('http://localhost:4000/api/jobs');
        
        if (!jobsResponse.ok) {
          throw new Error(`Failed to fetch jobs: ${jobsResponse.status}`);
        }
        
        const jobsData = await jobsResponse.json();
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to load data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <h3>Jobs List</h3>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Contractor</th>
              <th>Work Date</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>{getClientNameById(job.client_id)}</td>
                <td>{job.assigned_contractor ? `ID: ${job.assigned_contractor}` : 'Not Assigned'}</td>
                <td>{formatDate(job.day)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JobsList;
