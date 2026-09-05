import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Deposits from './components/Deposits';
import Withdrawals from './components/Withdrawals';
import Referral from './components/Referral';
import Income from './components/Income';
import RankBonus from './components/RankBonus';
import Website from './components/Website';
import Support from './components/Support';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';
import UserPanel from './components/UserPanel';

function AdminLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (newTab) => {
    if (newTab !== activeTab) {
      setActiveTab(newTab);
      window.history.pushState({ unityApp: 'app_active', tab: newTab }, '', window.location.href);
    }
  };

  const handleSidebarToggle = (openState) => {
    setSidebarOpen(openState);
    if (openState) {
      window.history.pushState({ unityApp: 'sidebar_drawer', tab: activeTab }, '', window.location.href);
    }
  };

  React.useEffect(() => {
    if (!window.history.state || !window.history.state.unityApp) {
      window.history.replaceState({ unityApp: 'app_root', tab: 'dashboard' }, '', window.location.href);
      window.history.pushState({ unityApp: 'app_active', tab: 'dashboard' }, '', window.location.href);
    }

    const handlePopState = (e) => {
      // 1. Close mobile sidebar if open
      if (sidebarOpen) {
        setSidebarOpen(false);
        return;
      }

      // 2. Go back to previous tab if present
      if (e.state && e.state.tab) {
        setActiveTab(e.state.tab);
      } else {
        // Prevent closing app on dashboard root
        setActiveTab('dashboard');
        window.history.pushState({ unityApp: 'app_active', tab: 'dashboard' }, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [sidebarOpen, activeTab]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={handleTabChange} />;
      case 'users':
        return <Users />;
      case 'referral':
        return <Referral />;
      case 'deposits':
        return <Deposits />;
      case 'withdrawals':
        return <Withdrawals />;
      case 'income':
        return <Income />;
      case 'rankBonus':
        return <RankBonus />;
      case 'website':
        return <Website />;
      case 'support':
        return <Support />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveTab={handleTabChange} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-darkbg overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={handleSidebarToggle} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Header 
          activeTab={activeTab} 
          setSidebarOpen={handleSidebarToggle} 
        />
        
        <main className="flex-1 overflow-y-auto bg-black/10 focus:outline-none font-sans">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}

function MainAppRouter() {
  const { currentUser } = useContext(AppContext);

  const isAuthPath =
    window.location.pathname.includes('/register') ||
    window.location.pathname.includes('/login') ||
    window.location.search.includes('ref=') ||
    window.location.search.includes('sponsor=') ||
    window.location.search.includes('code=');

  if (!currentUser || isAuthPath) {
    return <LandingPage />;
  }

  return <AdminLayout />;
}

function App() {
  return (
    <AppProvider>
      <MainAppRouter />
    </AppProvider>
  );
}

export default App;
