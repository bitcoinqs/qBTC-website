import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, LogOut } from 'lucide-react';
import { useWalletContext } from '../context/WalletContext';
import { useWallet } from '../hooks/useWallet';

export default function Navbar() {
  const { wallet, disconnect } = useWalletContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { closeAllConnections } = useWallet();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleDisconnect = () => {
    localStorage.removeItem("bqs.address")
    localStorage.removeItem("bqs.privatekey")
    localStorage.removeItem("bqs.publickey")
    closeAllConnections();

    disconnect();
  };

  const renderWalletButton = () => {
    if (wallet) {
      return (
        <div className="flex items-center space-x-2">
          <Link 
            to="/dashboard" 
            className="px-4 py-2 rounded-md text-white bg-orange-500 hover:bg-orange-600"
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>
          <button
            onClick={handleDisconnect}
            className="p-2 rounded-md text-white bg-red-500 hover:bg-red-600"
            title="Disconnect wallet"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <Link 
        to="/dashboard" 
        className="px-4 py-2 rounded-md text-white bg-orange-500 hover:bg-orange-600"
        onClick={handleLinkClick}
      >
        Launch App
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={handleLinkClick}>
              <Shield className="h-8 w-8 text-orange-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">Bitcoin QS</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/#features" className="text-gray-700 hover:text-orange-500">
              Features
            </Link>
            <Link to="/security" className="text-gray-700 hover:text-orange-500">
              Security
            </Link>
            <Link to="/docs" className="text-gray-700 hover:text-orange-500">
              Docs
            </Link>
            <Link to="/explorer" className="text-gray-700 hover:text-orange-500">
              Explorer
            </Link>
            <Link to="/news" className="text-gray-700 hover:text-orange-500">
              News
            </Link>
            {/* <Link to="/exchanges" className="text-gray-700 hover:text-orange-500">
              Exchanges
            </Link>*/}
            <Link to="/wallets" className="text-gray-700 hover:text-orange-500">
              Wallets
            </Link>
            <Link to="/team" className="text-gray-700 hover:text-orange-500">
              Team
            </Link>
            <Link to="/faq" className="text-gray-700 hover:text-orange-500">
              FAQ
            </Link>
            {renderWalletButton()}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-500 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/#features" className="block px-3 py-2 text-gray-700 hover:text-orange-500">
              Features
            </Link>
            <Link to="/security" className="block px-3 py-2 text-gray-700 hover:text-orange-500">
              Security
            </Link>
            <Link to="/docs" className="block px-3 py-2 text-gray-700 hover:text-orange-500">
              Docs
            </Link>
            <Link to="/explorer" className="block px-3 py-2 text-gray-700 hover:text-orange-500">
              Explorer
            </Link>
            <Link to="/news" className="block px-3 py-2 text-gray-700 hover:text-orange-500">
              News
            </Link>
          {/*  <Link to="/exchanges" className="block px-3 py-2 text-gray-700 hover:text-orange-500">
              Exchanges
            </Link> */}
            <Link to="/wallets" className="block px-3 py-2 text-gray-700 hover:text-orange-500">
              Wallets
            </Link>
            <Link to="/team" className="block px-3 py-2 text-gray-700 hover:text-orange-500">
              Team
            </Link>
            <Link to="/faq" className="block px-3 py-2 text-gray-700 hover:text-orange-500">
              FAQ
            </Link>
            <div className="px-3 py-2">
              {renderWalletButton()}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}