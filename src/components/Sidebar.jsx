import React, { useContext, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  DollarSign,
  Award,
  Globe,
  MessageSquare,
  Settings as SettingsIcon,
  Shield,
  Menu,
  X,
  UserPlus,
  LogOut,
  Link
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {

  const [logoLoaded, setLogoLoaded] = useState(false);

  const { logout, apiDocsUrl, currentUser, isAdmin } = useContext(AppContext);

  const isUserAdmin = isAdmin || currentUser?.role === 'admin';

  const allMenuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
    // Referral Menu 
    { id: 'referral', name: 'Referral', icon: UserPlus, adminOnly: false },
    { id: 'users', name: 'Users', icon: Users, adminOnly: true },
    { id: 'deposits', name: 'Deposits', icon: ArrowDownToLine, adminOnly: false },
    { id: 'withdrawals', name: 'Withdrawals', icon: ArrowUpFromLine, adminOnly: false },
    { id: 'income', name: 'Income Plan', icon: DollarSign, adminOnly: false },
    { id: 'rankBonus', name: 'Rank & Bonus', icon: Award, adminOnly: false },
    { id: 'website', name: 'Website Content', icon: Globe, adminOnly: true },
    { id: 'support', name: 'Support Tickets', icon: MessageSquare, adminOnly: false },
    { id: 'settings', name: 'Settings', icon: SettingsIcon, adminOnly: true },
  ];

  const menuItems = allMenuItems.filter(item => isUserAdmin || !item.adminOnly);

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r border-white/5 glass-panel transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Header Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center space-x-3">

            {/* Brand Text */}
            <div className="flex items-center space-x-3">
              <img
                src="/UnityNivo_Website_Logo_HD-1.png"
                alt="Unity Nivo Logo"
                className="w-12 h-12 object-contain"
              />

              <div className="flex flex-col">
                <h1 className="text-base font-bold tracking-wider bg-gradient-to-r from-white via-gold-light to-gold bg-clip-text text-transparent leading-tight">
                  UNITY NIVO
                </h1>

                <p className="mt-0.5 text-[10px] text-emerald-400 font-semibold tracking-widest uppercase leading-tight">
                  United We Grow
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-gray-400 rounded-md md:hidden hover:text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${isActive
                  ? 'bg-gradient-to-r from-gold/15 to-gold/5 border-l-4 border-gold text-gold shadow-md shadow-gold/5'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-white/5 border-l-4 border-transparent'
                  }`}
              >
                <Icon
                  size={18}
                  className={`mr-3 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-gold' : 'text-gray-400 group-hover:text-gold-light'
                    }`}
                />
                <span className="flex-1 text-left">{item.name}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 bg-black/20 space-y-2">
          {/* <a
            href={apiDocsUrl || "https://unity-nivo-backend-nodejs.onrender.com/api-docs/"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold text-xs font-bold transition-all group"
          >
            <span className="flex items-center">
              <Link size={14} className="mr-2 group-hover:rotate-45 transition-transform" />
              API Docs (Render)
            </span>
            <span className="text-[10px] bg-gold/20 px-1.5 py-0.5 rounded text-gold-light">v1.0</span>
          </a> */}

          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
                <Shield size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-gray-200 truncate">
                  {currentUser?.name || (isAdmin ? 'Administrator' : 'User')}
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  {currentUser?.email || 'admin@unitynivo.com'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
              title="Log Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
