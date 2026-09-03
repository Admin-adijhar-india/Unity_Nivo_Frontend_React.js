import React, { useContext } from 'react';
import { Menu, ShieldCheck, Cpu, Bell, ExternalLink, Server, RefreshCw } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Header({ activeTab, setSidebarOpen }) {
  const { settings, backendStatus, apiDocsUrl, checkBackendHealth, currentUser, isAdmin } = useContext(AppContext);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'users': return 'Users Management';
      case 'deposits': return 'Deposit Transactions';
      case 'withdrawals': return 'Withdrawal Requests';
      case 'income': return 'Income Categories';
      case 'rankBonus': return 'Rank & Achievements';
      case 'website': return 'Website Manager';
      case 'support': return 'Support Center';
      case 'settings': return 'System Settings';
      default: return 'Admin Console';
    }
  };

  const getSlogan = () => {
    return "WHERE WEALTH MEETS TRUST";
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 border-b border-white/5 bg-darkbg-deep/75 backdrop-blur-md">
      {/* Mobile Toggle & Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-400 rounded-xl md:hidden hover:bg-white/5 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
            {getTitle()}
          </h2>
          <p className="hidden md:block text-[10px] tracking-wider text-gold font-semibold uppercase">
            {getSlogan()}
          </p>
        </div>
      </div>

      {/* Stats Summary / System Status */}
      <div className="flex items-center space-x-3">
        {/* Render API Docs Button */}
        <a
          href={apiDocsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center px-3 py-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold text-xs font-semibold transition-all shadow-sm shadow-gold/10"
          title="Open Render Backend Swagger API Docs"
        >
          <ExternalLink size={13} className="mr-1.5" />
          <span>API Docs</span>
        </a>

        {/* API Backend Health Status Badge */}
        <button
          onClick={checkBackendHealth}
          className={`flex items-center px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            backendStatus === 'connected'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
              : backendStatus === 'checking'
              ? 'bg-amber-950/40 border-amber-500/30 text-amber-400'
              : 'bg-red-950/40 border-red-500/30 text-red-400'
          }`}
          title="Click to re-check Render Backend API status"
        >
          <Server size={13} className={`mr-1.5 ${backendStatus === 'connected' ? 'animate-pulse' : ''}`} />
          <span className="hidden md:inline">Render API: </span>
          <span className="capitalize ml-0.5">{backendStatus}</span>
          {backendStatus === 'checking' && <RefreshCw size={11} className="ml-1.5 animate-spin" />}
        </button>

        {/* Network Badge */}
        <div className="hidden lg:flex items-center px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Cpu size={13} className="mr-1.5 animate-pulse" />
          {settings.depositNetwork}
        </div>

        <div className="relative p-2 text-gray-400 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold" />
        </div>

        {/* Profile Card */}
        <div className="flex items-center space-x-2.5 pl-4 border-l border-white/10">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 text-gold shadow-md">
            <ShieldCheck size={18} />
          </div>
          <div className="hidden md:block">
            <h4 className="text-xs font-bold text-gray-200">
              {currentUser?.name || (isAdmin ? 'System Admin' : 'User')}
            </h4>
            <span className="text-[9px] font-semibold text-emerald-400">Node Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
}
