import React, { useState } from 'react';

const ClientsList = ({ clients, onClientDeleted }) => {
  const [error, setError] = useState('');

  const handleDelete = async (clientId, clientName) => {
    // Show confirmation popup
    const isConfirmed = window.confirm(
      `Are you sure you want to delete client "${clientName}"?\n\nWARNING: This will also delete all jobs associated with this client!`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/delete-client', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ client_id: clientId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete client');
      }

      // Call the callback to refresh the list
      onClientDeleted();
    } catch (error) {
      setError(`Failed to delete client: ${error.message}`);
    }
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="list-container">
      <h3>Clients List</h3>
      {clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.client_id}>
                <td>{client.client_id}</td>
                <td>{client.name}</td>
                <td>{client.address}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(client.client_id, client.name)}
                    className="delete-btn"
                    title="Delete client"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientsList;
