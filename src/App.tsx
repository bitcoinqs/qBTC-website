import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SecurityPage from './pages/SecurityPage';
import DocsPage from './pages/DocsPage';
import ExplorerPage from './pages/ExplorerPage';
import NewsPage from './pages/NewsPage';
import ExchangesPage from './pages/ExchangesPage';
import WalletsPage from './pages/WalletsPage';
import WalletDashboard from './pages/WalletDashboard';
import FAQPage from './pages/FAQPage';
import TeamPage from './pages/TeamPage';
import LitePaperPage from './pages/LitePaperPage';
import QDayPage from './pages/QDayPage';
import QuantumTheftPage from './pages/QuantumTheftPage';
import Footer from './components/Footer';

export default function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 font-ubuntu">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/*<Route path="/security" element={<SecurityPage />} /> 
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/explorer" element={<ExplorerPage />} />*/}
            <Route path="/news" element={<NewsPage />} />
            {/*<Route path="/exchanges" element={<ExchangesPage />} />*/}
            <Route path="/wallets" element={<WalletsPage />} />
            <Route path="/dashboard" element={<WalletDashboard />} />
           {/* <Route path="/lite-paper" element={<LitePaperPage />} />*/}
            {/*  <Route path="/q-day" element={<QDayPage />} />*/}
           {/* <Route path="/quantum-theft" element={<QuantumTheftPage />} />*/}
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/team" element={<TeamPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </WalletProvider>
  );
}