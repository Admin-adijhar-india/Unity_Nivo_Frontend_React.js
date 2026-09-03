import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  DollarSign, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Plus, 
  Send, 
  MessageSquare, 
  LogOut, 
  Award,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';

export default function UserPanel() {
  const { 
    currentUser, 
    logout, 
    deposits, 
    withdrawals, 
    tickets, 
    settings, 
    requestDeposit, 
    addWithdrawalRequest,
    submitSupportTicket,
    userReplyToTicket
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Forms state
  const [depAmount, setDepAmount] = useState('');
  const [depWallet, setDepWallet] = useState(currentUser.wallet);
  const [depTxHash, setDepTxHash] = useState('');

  const [wdAmount, setWdAmount] = useState('');

  const [tckSubject, setTckSubject] = useState('');
  const [tckMsg, setTckMsg] = useState('');
  
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [chatReply, setChatReply] = useState('');

  const triggerAlert = (type, msg) => {
    if (type === 'success') {
      setSuccessMsg(msg);
      setErrorMsg('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(msg);
      setSuccessMsg('');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // Submissions
  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(depAmount);
    if (isNaN(amt) || amt < settings.minDeposit) {
      triggerAlert('error', `Minimum deposit is $${settings.minDeposit} USDT.`);
      return;
    }
    if (!depTxHash.trim()) {
      triggerAlert('error', 'Please provide the transaction hash.');
      return;
    }

    requestDeposit(amt, depWallet, depTxHash.trim());
    setDepAmount('');
    setDepTxHash('');
    triggerAlert('success', `Deposit request of $${amt} submitted. Pending admin blockchain confirmation.`);
  };

  const handleWithdrawalSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(wdAmount);
    if (isNaN(amt) || amt < settings.minWithdrawal) {
      triggerAlert('error', `Minimum withdrawal is $${settings.minWithdrawal} USDT.`);
      return;
    }
    if (currentUser.balance < amt) {
      triggerAlert('error', 'Insufficient available balance.');
      return;
    }

    const success = addWithdrawalRequest(currentUser.id, amt);
    if (success) {
      setWdAmount('');
      triggerAlert('success', `Withdrawal request for $${amt} submitted. Fees: 5%. Pending admin audit.`);
    } else {
      triggerAlert('error', 'Withdrawal request failed.');
    }
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!tckSubject.trim() || !tckMsg.trim()) return;

    const tckId = submitSupportTicket(tckSubject.trim(), tckMsg.trim());
    setTckSubject('');
    setTckMsg('');
    setActiveTicketId(tckId);
    setActiveTab('support');
    triggerAlert('success', 'Support ticket opened successfully.');
  };

  const handleChatReplySubmit = (e) => {
    e.preventDefault();
    if (!chatReply.trim() || !activeTicketId) return;
    userReplyToTicket(activeTicketId, chatReply.trim());
    setChatReply('');
  };

  // Filter user records
  const myDeposits = deposits.filter(d => d.userId === currentUser.id);
  const myWithdrawals = withdrawals.filter(w => w.userId === currentUser.id);
  const myTickets = tickets.filter(t => t.userId === currentUser.id);
  
  const selectedTicket = myTickets.find(t => t.id === activeTicketId) || myTickets[0];

  return (
    <div className="min-h-screen bg-darkbg text-gray-300 flex flex-col text-xs">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 h-20 px-6 border-b border-white/5 bg-darkbg-deep/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center font-extrabold text-gold shadow shadow-gold/20">
            UN
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white">UNITY NIVO</h1>
            <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest leading-none">User Yield Console</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 font-bold uppercase">
          {['dashboard', 'deposit', 'withdraw', 'support'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'support' && myTickets.length > 0 && !activeTicketId) {
                  setActiveTicketId(myTickets[0].id);
                }
              }}
              className={`px-3 py-2 rounded-xl transition-all ${
                activeTab === tab 
                  ? 'bg-gold/15 border border-gold/30 text-gold shadow' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Card & Logout */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-white/10 text-right">
            <div>
              <h4 className="font-bold text-gray-200">{currentUser.name}</h4>
              <span className="inline-flex px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase bg-gold/15 border border-gold/30 text-gold">
                {currentUser.currentRank}
              </span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6 overflow-y-auto">
        
        {/* Success/Error Banners */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 font-bold animate-in fade-in slide-in-from-top-2">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/20 text-red-400 font-bold animate-in fade-in slide-in-from-top-2">
            {errorMsg}
          </div>
        )}

        {/* SCREEN 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Balance Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Spending Balance */}
              <div className="p-5 rounded-2xl border border-white/5 bg-gradient-to-r from-gold/15 via-black/20 to-transparent glass-panel flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Spending Balance</span>
                <h2 className="text-2xl font-black text-white mt-2">${currentUser.balance.toFixed(2)}</h2>
                <span className="text-[9px] text-emerald-400 font-semibold mt-1">Available for Payout</span>
              </div>

              {/* Total Deposits */}
              <div className="p-5 rounded-2xl border border-white/5 glass-panel flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Deposited</span>
                <h2 className="text-2xl font-black text-white mt-2">${currentUser.totalDeposit.toFixed(2)}</h2>
                <span className="text-[9px] text-gray-500 font-semibold mt-1">Audit confirmations complete</span>
              </div>

              {/* Total Withdrawals */}
              <div className="p-5 rounded-2xl border border-white/5 glass-panel flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Payouts</span>
                <h2 className="text-2xl font-black text-white mt-2">${currentUser.totalWithdrawal.toFixed(2)}</h2>
                <span className="text-[9px] text-gray-500 font-semibold mt-1">Transferred to wallet</span>
              </div>

              {/* Rank Reward */}
              <div className="p-5 rounded-2xl border border-white/5 glass-panel flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Rank</span>
                <div className="flex items-center space-x-2 mt-2">
                  <Award className="text-gold" size={24} />
                  <h2 className="text-xl font-black text-gold uppercase tracking-wider">{currentUser.currentRank}</h2>
                </div>
                <span className="text-[9px] text-gray-500 font-semibold mt-1">Team business targets tracking</span>
              </div>
            </div>

            {/* Income Commission Matrix */}
            <div className="p-5 rounded-2xl border border-white/5 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-gold uppercase tracking-wider">My Compounded Earnings Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                  <span className="block text-[9px] text-gray-500 font-bold uppercase">Join Bonus</span>
                  <span className="text-sm font-extrabold text-white">${currentUser.earnings.joinBonus.toFixed(2)}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                  <span className="block text-[9px] text-gray-500 font-bold uppercase">ROI Yield</span>
                  <span className="text-sm font-extrabold text-emerald-400">${currentUser.earnings.roiIncome.toFixed(2)}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                  <span className="block text-[9px] text-gray-500 font-bold uppercase">Referrals</span>
                  <span className="text-sm font-extrabold text-gold">${currentUser.earnings.referralIncome.toFixed(2)}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                  <span className="block text-[9px] text-gray-500 font-bold uppercase">Booster</span>
                  <span className="text-sm font-extrabold text-pink-400">${currentUser.earnings.boosterIncome.toFixed(2)}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                  <span className="block text-[9px] text-gray-500 font-bold uppercase">Rank Bonus</span>
                  <span className="text-sm font-extrabold text-purple-400">${currentUser.earnings.rankBonus.toFixed(2)}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                  <span className="block text-[9px] text-gray-500 font-bold uppercase">Leadership</span>
                  <span className="text-sm font-extrabold text-cyan-400">${currentUser.earnings.leadershipBonus.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* My Ledger */}
            <div className="p-5 rounded-2xl border border-white/5 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">My Transaction Ledger</h3>
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="px-4 py-2.5">Tx ID</th>
                      <th className="px-4 py-2.5">Date</th>
                      <th className="px-4 py-2.5">Description</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {currentUser.transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 font-mono">{tx.id}</td>
                        <td className="px-4 py-3 text-[10px] text-gray-500 whitespace-nowrap">{tx.date}</td>
                        <td className="px-4 py-3 font-semibold text-gray-200">{tx.description}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            tx.type === 'deposit' 
                              ? 'bg-emerald-950 text-emerald-400' 
                              : tx.type === 'withdrawal'
                              ? 'bg-red-950 text-red-400'
                              : 'bg-gold/10 text-gold'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-right font-bold ${
                          tx.type === 'deposit' || tx.type === 'earning' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {tx.type === 'deposit' || tx.type === 'earning' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* SCREEN 2: DEPOSIT PORTAL */}
        {activeTab === 'deposit' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-1 p-5 rounded-2xl border border-white/5 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-gold uppercase tracking-wider">Submit Deposit Request</h3>
              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">USDT Deposit Amount ($)</label>
                  <input
                    type="number"
                    value={depAmount}
                    onChange={(e) => setDepAmount(e.target.value)}
                    required
                    placeholder="Min $30 USDT"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Sending Wallet Address (BEP-20)</label>
                  <input
                    type="text"
                    value={depWallet}
                    onChange={(e) => setDepWallet(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Blockchain Tx Hash (Transaction ID)</label>
                  <input
                    type="text"
                    value={depTxHash}
                    onChange={(e) => setDepTxHash(e.target.value)}
                    required
                    placeholder="0x3a2f..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gold text-darkbg font-bold rounded-xl hover:bg-gold-light transition-all flex items-center justify-center"
                >
                  Submit Deposit
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 p-5 rounded-2xl border border-white/5 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">My Deposit Transactions</h3>
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="px-4 py-2.5">Deposit ID</th>
                      <th className="px-4 py-2.5 text-right">Amount</th>
                      <th className="px-4 py-2.5">Tx Hash</th>
                      <th className="px-4 py-2.5">Date / Time</th>
                      <th className="px-4 py-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {myDeposits.map((dep) => (
                      <tr key={dep.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 font-mono font-bold text-white">{dep.id}</td>
                        <td className="px-4 py-3 text-right font-extrabold">${dep.amount.toFixed(2)}</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-gray-500 max-w-[130px] truncate">{dep.txHash}</td>
                        <td className="px-4 py-3 text-gray-500">{dep.dateTime}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            dep.status === 'confirmed' 
                              ? 'bg-emerald-950 text-emerald-400' 
                              : dep.status === 'pending'
                              ? 'bg-amber-950 text-amber-400'
                              : 'bg-red-950 text-red-400'
                          }`}>
                            {dep.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {myDeposits.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-gray-500 font-semibold">No deposits logged.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3: WITHDRAWAL PORTAL */}
        {activeTab === 'withdraw' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-1 p-5 rounded-2xl border border-white/5 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-gold uppercase tracking-wider">Request Payout</h3>
              
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                <div className="flex justify-between"><span>Available:</span><span className="font-bold text-white">${currentUser.balance.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Minimum withdrawal:</span><span className="font-bold text-white">${settings.minWithdrawal} USDT</span></div>
                <div className="flex justify-between"><span>Processing Fee:</span><span className="font-bold text-red-400">5% Charge</span></div>
              </div>

              <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Withdrawal Amount ($)</label>
                  <input
                    type="number"
                    value={wdAmount}
                    onChange={(e) => setWdAmount(e.target.value)}
                    required
                    placeholder="Min $15 USDT"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div className="text-[10px] text-gray-500">
                  Withdrawals settled directly to your registered wallet: <span className="font-mono text-gray-300 block mt-0.5 break-all">{currentUser.wallet}</span>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gold text-darkbg font-bold rounded-xl hover:bg-gold-light transition-all flex items-center justify-center"
                >
                  Request Withdrawal
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 p-5 rounded-2xl border border-white/5 glass-panel space-y-4">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">My Withdrawal Requests</h3>
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="px-4 py-2.5">Request ID</th>
                      <th className="px-4 py-2.5 text-right">Gross Amount</th>
                      <th className="px-4 py-2.5 text-right">Fee (5%)</th>
                      <th className="px-4 py-2.5 text-right">Net Received</th>
                      <th className="px-4 py-2.5">Tx Hash</th>
                      <th className="px-4 py-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {myWithdrawals.map((wd) => (
                      <tr key={wd.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 font-mono font-bold text-white">{wd.id}</td>
                        <td className="px-4 py-3 text-right text-gray-400">${wd.amount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-red-400">-${wd.charge.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-extrabold text-emerald-400">${wd.netAmount.toFixed(2)}</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-gray-500 max-w-[100px] truncate">{wd.txHash || 'Pending'}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            wd.status === 'completed' 
                              ? 'bg-emerald-950 text-emerald-400' 
                              : wd.status === 'pending'
                              ? 'bg-amber-950 text-amber-400'
                              : wd.status === 'held'
                              ? 'bg-purple-950 text-purple-400'
                              : 'bg-red-950 text-red-400'
                          }`}>
                            {wd.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {myWithdrawals.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-gray-500 font-semibold">No withdrawals logged.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 4: SUPPORT TICKETS & CHAT */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
            {/* Left Pane: New Ticket Form & My Tickets list */}
            <div className="lg:col-span-1 flex flex-col rounded-2xl border border-white/5 bg-darkbg-card overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-black/20 space-y-3">
                <h3 className="text-xs font-bold text-gold uppercase tracking-wider">Open Support Ticket</h3>
                <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
                  <input
                    type="text"
                    placeholder="Ticket Subject..."
                    value={tckSubject}
                    onChange={(e) => setTckSubject(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-white"
                  />
                  <textarea
                    placeholder="Enter message explanation..."
                    value={tckMsg}
                    onChange={(e) => setTckMsg(e.target.value)}
                    required
                    rows="3"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-gold text-darkbg font-bold rounded-xl hover:bg-gold-light transition-all flex items-center justify-center text-xs"
                  >
                    Open Ticket
                  </button>
                </form>
              </div>

              {/* My tickets list */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
                {myTickets.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTicketId(t.id)}
                    className={`w-full p-4 text-left flex flex-col justify-between transition-colors border-l-2 ${
                      t.id === activeTicketId 
                        ? 'bg-white/[0.04] border-gold' 
                        : 'hover:bg-white/[0.02] border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs font-bold text-white">{t.id}</span>
                      <span className={`inline-flex px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase ${
                        t.status === 'open' 
                          ? 'bg-emerald-950 text-emerald-400' 
                          : t.status === 'pending'
                          ? 'bg-amber-950 text-amber-400'
                          : 'bg-white/5 text-gray-500'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-200 mt-1.5 truncate max-w-[150px]">{t.subject}</h4>
                    <span className="text-[9px] text-gray-500 mt-1">{t.createdTime}</span>
                  </button>
                ))}
                {myTickets.length === 0 && (
                  <div className="h-32 flex flex-col justify-center items-center text-gray-600">
                    <MessageSquare size={20} />
                    <span className="text-[10px] mt-1">No tickets opened.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Chat box */}
            <div className="lg:col-span-2 flex flex-col rounded-2xl border border-white/5 bg-darkbg-card overflow-hidden">
              {selectedTicket ? (
                <>
                  <div className="p-4 border-b border-white/5 bg-black/25 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center">
                        {selectedTicket.subject}
                        <span className="ml-2 font-mono text-[9px] text-gray-500">({selectedTicket.id})</span>
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Status: <span className="text-gold font-bold uppercase">{selectedTicket.status}</span></p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/10 scrollbar-thin">
                    {selectedTicket.messages.map((msg, idx) => {
                      const isUser = msg.sender === 'user';
                      return (
                        <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 ${
                            isUser 
                              ? 'bg-white/5 border border-white/5 text-gray-200 rounded-tr-none'
                              : 'bg-gold/10 border border-gold/25 text-white rounded-tl-none'
                          }`}>
                            <p>{msg.text}</p>
                            <span className="block text-[8px] text-gray-500 text-right">{msg.timestamp}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Input */}
                  {selectedTicket.status !== 'resolved' ? (
                    <form onSubmit={handleChatReplySubmit} className="p-3 border-t border-white/5 bg-black/25 flex items-center space-x-2">
                      <input
                        type="text"
                        value={chatReply}
                        onChange={(e) => setChatReply(e.target.value)}
                        placeholder="Type reply message..."
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <button
                        type="submit"
                        disabled={!chatReply.trim()}
                        className="p-2 bg-gold text-darkbg hover:bg-gold-light disabled:opacity-40 rounded-xl flex items-center justify-center"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  ) : (
                    <div className="p-3 bg-emerald-950/20 text-emerald-400 font-bold text-center border-t border-white/5">
                      This ticket is closed and resolved.
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center text-gray-500 space-y-1.5">
                  <HelpCircle size={24} />
                  <span className="text-xs">Select or open a ticket from the left panel.</span>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
