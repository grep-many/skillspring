import React from 'react';
import './index.css';

const ServerCheck = () => {
    return (
        <div className="loading error">
        <div className="loader"></div>
        <h2>Checking server status...</h2>
        <p>Please wait while we ensure everything is up and running.</p>
      </div>
    );
}

export default ServerCheck;
