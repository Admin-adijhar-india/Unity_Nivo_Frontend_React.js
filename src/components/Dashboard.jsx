import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Users, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  ExternalLink 
} from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  const { users, deposits, withdrawals, currentUser, isAdmin } = useContext(AppContext);

  const isUserAdmin = isAdmin || currentUser?.role === 'admin';

  // Dynamic calculations for Admin (all users' data)
  const totalUsers = users.length;
  const totalDepositVal = deposits
    .filter(d => d.status === 'confirmed')
    .reduce((sum, d) => sum + (d.amount || 0), 0);
  
  const totalWithdrawalVal = withdrawals
    .filter(w => w.status === 'completed')
    .reduce((sum, w) => sum + (w.netAmount || w.amount || 0), 0);

  const pendingWithdrawalVal = withdrawals
    .filter(w => w.status === 'pending' || w.status === 'held')
    .reduce((sum, w) => sum + (w.netAmount || w.amount || 0), 0);

  const totalIncomePaidVal = users.reduce((sum, u) => sum + (u.income || 0), 0);

  // Dynamic calculations for regular User (user's personal data)
  const userBalance = currentUser?.balance !== undefined ? currentUser.balance : 0;
  const userTotalDeposit = currentUser?.totalDeposit !== undefined ? currentUser.totalDeposit : 0;
  const userTotalWithdrawal = currentUser?.totalWithdrawal !== undefined ? currentUser.totalWithdrawal : 0;
  const userIncome = currentUser?.totalIncome !== undefined ? currentUser.totalIncome : (currentUser?.income !== undefined ? currentUser.income : 0);
  const userRank = currentUser?.rank || currentUser?.currentRank || 'None';

  // Sort and slice recent activities
  const userDepositsList = isUserAdmin 
    ? deposits 
    : deposits.filter(d => d.userId === currentUser?.id || d.userName === currentUser?.name);

  const userWithdrawalsList = isUserAdmin 
    ? withdrawals 
    : withdrawals.filter(w => w.userId === currentUser?.id || w.userName === currentUser?.name);

  const recentDeposits = [...userDepositsList]
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
    .slice(0, 5);

  const recentWithdrawals = [...userWithdrawalsList]
    .sort((a, b) => new Date(b.requestTime) - new Date(a.requestTime))
    .slice(0, 5);

  const recentRegistrations = [...users]
    .sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate))
    .slice(0, 5);

  const stats = isUserAdmin
    ? [
        { name: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
        { name: 'Total Deposits', value: `$${totalDepositVal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: ArrowDownCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        { name: 'Total Withdrawals', value: `$${totalWithdrawalVal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: ArrowUpCircle, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
        { name: 'Pending Withdrawals', value: `$${pendingWithdrawalVal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
        { name: 'Total Income Paid', value: `$${totalIncomePaidVal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: DollarSign, color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
      ]
    : [
        { name: 'Available Balance', value: `$${userBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: DollarSign, color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
        { name: 'Total Deposited', value: `$${userTotalDeposit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: ArrowDownCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        { name: 'Total Withdrawn', value: `$${userTotalWithdrawal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: ArrowUpCircle, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
        { name: 'Total Income Earned', value: `$${userIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
        { name: 'Current Rank', value: userRank, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-500/30' },
      ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative p-6 overflow-hidden rounded-2xl border border-white/5 glass-panel">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              {isUserAdmin ? 'Welcome back, Chief Admin!' : `Welcome back, ${currentUser?.name || 'Valued User'}!`}
            </h3>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              {isUserAdmin 
                ? 'Unity Nivo is operating normally. Monitor daily blockchain deposit confirmations, review pending withdrawal tickets, and maintain platform rules.'
                : 'Track your personal deposit balances, compound returns, current rank achievements, and withdrawal requests in real time.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {currentUser?.referralCode && !isUserAdmin && (
              <div className="px-3 py-1.5 rounded-xl bg-gold/10 border border-gold/30 text-gold text-xs font-bold">
                Ref Code: <span className="font-mono">{currentUser.referralCode}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-xs font-bold self-start md:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {isUserAdmin 
                ? 'Blockchain Listener Active (BEP-20)' 
                : `ID: ${currentUser?.userId || currentUser?.id || 'UN10004'} | Status: ${currentUser?.status || 'Active'}`}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="p-5 rounded-2xl border border-white/5 glass-panel glass-panel-hover flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.name}</span>
                <div className={`p-2 rounded-xl border ${item.bg}`}>
                  <Icon size={18} className={item.color} />
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">{item.value}</h4>
                <div className="flex items-center mt-1 text-[10px] text-emerald-400 font-bold">
                  <TrendingUp size={10} className="mr-1" />
                  <span>+4.2% Today</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section (Interactive SVG) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl border border-white/5 glass-panel flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-200">Deposits vs Withdrawals Trend</h3>
              <p className="text-xs text-gray-500">Weekly platform transactional overview</p>
            </div>
            <div className="flex space-x-3 text-xs">
              <span className="flex items-center text-emerald-400 font-semibold"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" /> Deposits</span>
              <span className="flex items-center text-red-400 font-semibold"><span className="w-2 h-2 rounded-full bg-red-500 mr-1.5" /> Withdrawals</span>
            </div>
          </div>
          <div className="flex-1 min-h-[220px] flex items-end relative py-4">
            {/* SVG Visualizing Graphs */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              
              {/* Deposits Line Path */}
              <path 
                d="M0 160 Q 50 140, 100 120 T 200 90 T 300 110 T 400 50" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />
              <path 
                d="M0 160 Q 50 140, 100 120 T 200 90 T 300 110 T 400 50 L 400 200 L 0 200 Z" 
                fill="url(#deposit-grad)" 
                opacity="0.1"
              />

              {/* Withdrawals Line Path */}
              <path 
                d="M0 180 Q 50 170, 100 150 T 200 140 T 300 130 T 400 90" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />
              <path 
                d="M0 180 Q 50 170, 100 150 T 200 140 T 300 130 T 400 90 L 400 200 L 0 200 Z" 
                fill="url(#withdraw-grad)" 
                opacity="0.1"
              />

              {/* Defs */}
              <defs>
                <linearGradient id="deposit-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="withdraw-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Days Label Row */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-gray-500 font-semibold px-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Earning Distribution Panel */}
        <div className="p-5 rounded-2xl border border-white/5 glass-panel flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-200">System Activity Score</h3>
            <p className="text-xs text-gray-500">Real-time engagement meter</p>
          </div>
          
          <div className="my-6 flex justify-center items-center">
            {/* Radial Percentage Ring */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/5"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-gold"
                  strokeWidth="3.5"
                  strokeDasharray="88, 100"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-white">88%</span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Optimized</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between text-xs font-semibold text-gray-400">
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-gold mr-2" /> Active Users</span>
              <span className="text-white">92%</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-gray-400">
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" /> Deposit Confirmations</span>
              <span className="text-white">98%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Three Lists: Registrations, Deposits, Withdrawals */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recent Registrations */}
        <div className="p-5 rounded-2xl border border-white/5 glass-panel flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-200">New Registrations</h3>
            <button 
              onClick={() => setActiveTab('users')}
              className="text-[10px] text-gold font-bold hover:underline flex items-center"
            >
              Manage Users <ExternalLink size={10} className="ml-1" />
            </button>
          </div>
          <div className="flex-1 space-y-3.5">
            {recentRegistrations.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-200">{user.name}</h4>
                    <p className="text-[10px] text-gray-500">ID: {user.id} | Joined: {user.joinedDate}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                  user.status === 'active' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deposits */}
        <div className="p-5 rounded-2xl border border-white/5 glass-panel flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-200">Recent Deposits</h3>
            <button 
              onClick={() => setActiveTab('deposits')}
              className="text-[10px] text-gold font-bold hover:underline flex items-center"
            >
              Verify Deposits <ExternalLink size={10} className="ml-1" />
            </button>
          </div>
          <div className="flex-1 space-y-3.5">
            {recentDeposits.map((dep) => (
              <div key={dep.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <h4 className="text-xs font-bold text-gray-200">{dep.userName}</h4>
                  <p className="text-[10px] text-gray-500">Hash: {dep.txHash.substring(0, 10)}... | {dep.dateTime}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white">${dep.amount}</span>
                  <p className={`text-[9px] font-semibold ${
                    dep.status === 'confirmed' ? 'text-emerald-400' : dep.status === 'pending' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {dep.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Withdrawals */}
        <div className="p-5 rounded-2xl border border-white/5 glass-panel flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-200">Recent Withdrawals</h3>
            <button 
              onClick={() => setActiveTab('withdrawals')}
              className="text-[10px] text-gold font-bold hover:underline flex items-center"
            >
              Process Payouts <ExternalLink size={10} className="ml-1" />
            </button>
          </div>
          <div className="flex-1 space-y-3.5">
            {recentWithdrawals.map((wd) => (
              <div key={wd.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <h4 className="text-xs font-bold text-gray-200">{wd.userName}</h4>
                  <p className="text-[10px] text-gray-500">Wallet: {wd.wallet.substring(0, 10)}... | {wd.requestTime}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white">${wd.netAmount}</span>
                  <p className={`text-[9px] font-semibold ${
                    wd.status === 'completed' ? 'text-emerald-400' : wd.status === 'pending' ? 'text-amber-400' : wd.status === 'held' ? 'text-blue-400' : 'text-red-400'
                  }`}>
                    {wd.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
