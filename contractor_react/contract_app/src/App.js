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
            <AddClient />
            <ClientsList />
          </div>
        );
      case 'jobs':
        return (
          <div>
            <h2>Jobs Management</h2>
            <AddJob />
            <JobsList />
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