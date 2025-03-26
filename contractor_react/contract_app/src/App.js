import React, { useState, useEffect } from 'react';
import './App.css';

// Component imports
import AddContractor from './components/AddContractor';
import AddClient from './components/AddClient';
import AddJob from './components/AddJob';
import ContractorsList from './components/ContractorsList';
import ClientsList from './components/ClientsList';
import JobsList from './components/JobsList';

function App() {
  const [activeTab, setActiveTab] = useState('contractors');
  const [clients, setClients] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showPastJobs, setShowPastJobs] = useState(false);
  
  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/clients');
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchJobs = async (isPastJobs) => {
    try {
      const endpoint = isPastJobs ? '/api/past-jobs' : '/api/jobs';
      const response = await fetch(`http://localhost:4000${endpoint}`);
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'clients') {
      fetchClients();
    } else if (activeTab === 'jobs') {
      fetchJobs(showPastJobs);
    }
  }, [activeTab, showPastJobs]);

  const tabs = [
    { id: 'contractors', label: 'Contractors' },
    { id: 'clients', label: 'Clients' },
    { id: 'jobs', label: 'Jobs' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'contractors':
        return (
          <div>
            <h2>Contractors Management</h2>
            <AddContractor />
            <ContractorsList />
          </div>
        );
      case 'clients':
        return (
          <div>
            <h2>Clients Management</h2>
            <AddClient onClientAdded={fetchClients} />
            <ClientsList clients={clients} onClientDeleted={fetchClients} />
          </div>
        );
      case 'jobs':
        return (
          <div>
            <h2>Jobs Management</h2>
            <AddJob onJobAdded={() => fetchJobs(showPastJobs)} />
            <JobsList 
              jobs={jobs}
              showPastJobs={showPastJobs}
              setShowPastJobs={setShowPastJobs}
              onJobDeleted={() => fetchJobs(showPastJobs)}
              onJobCompleted={() => fetchJobs(showPastJobs)}
            />
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Contracting Company Management</h1>
        <nav className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>
      <main>{renderContent()}</main>
    </div>
  );
}

export default App;