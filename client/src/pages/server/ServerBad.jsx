import React, { useContext } from 'react';
import './index.css'
import { AuthContext } from '@/context/auth-context';

const ServerBad = () => {

    const { checkServerStatus} = useContext(AuthContext)

    return (
        <div className="loading error">
            <div className="loader"></div>
            <h2>Unable to connect to the server</h2>
            <p>We are having trouble connecting to our servers. Please try again later.</p>
            <button onClick={checkServerStatus}>Retry</button>
        </div>
    );
}

export default ServerBad;
