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

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
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
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-darkbg overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Header 
          activeTab={activeTab} 
          setSidebarOpen={setSidebarOpen} 
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
