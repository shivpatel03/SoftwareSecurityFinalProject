import React, { useState, useEffect } from 'react';

const ContractorsList = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/contractors');
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setContractors(data);
      } catch (error) {
        setError(`Failed to load contractors: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, []);

  if (loading) return <div className="loading">Loading contractors...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="list-container">
      <h3>Contractors List</h3>
      {contractors.length === 0 ? (
        <p>No contractors found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {contractors.map((contractor, index) => (
              <tr key={index}>
                <td>{contractor.name}</td>
                <td>{contractor.email}</td>
                <td>{contractor.company}</td>
                <td>{contractor.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContractorsList;
