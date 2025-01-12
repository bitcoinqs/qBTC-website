import React from 'react';
import { useWallet } from '../hooks/useWallet';

export function Navbar() {
  const { closeAllConnections } = useWallet();

  const handleDisconnect = () => {
    // Clear local storage
    localStorage.removeItem('bqs.address');
    localStorage.removeItem('bqs.privatekey');
    localStorage.removeItem('bqs.publickey');

    // Close all WebSocket connections
    closeAllConnections();

    console.log('User disconnected and WebSocket connections closed');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-lg">My App</h1>
        <button
          onClick={handleDisconnect}
          className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Disconnect
        </button>
      </div>
    </nav>
  );
}