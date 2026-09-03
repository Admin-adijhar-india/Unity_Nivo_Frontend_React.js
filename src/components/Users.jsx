import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, Eye, Slash, CheckCircle, ShieldAlert, ArrowDownLeft, ArrowUpRight, DollarSign, Award, X, Edit, Save } from 'lucide-react';

export default function Users() {
  const { users, toggleUserStatus, adjustUserBalance } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [editValues, setEditValues] = useState({ balance: '', totalDeposit: '', totalWithdrawal: '', income: '' });

  // Filtering users based on search
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.id.toLowerCase().includes(term) ||
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.mobile.toLowerCase().includes(term) ||
      user.wallet.toLowerCase().includes(term)
    );
  });

  const handleOpenUserModal = (user) => {
    setSelectedUser(user);
    setEditValues({
      balance: user.balance.toString(),
      totalDeposit: user.totalDeposit.toString(),
      totalWithdrawal: user.totalWithdrawal.toString(),
      income: user.income.toString()
    });
    setIsEditingBalance(false);
  };

  const handleSaveBalance = () => {
    adjustUserBalance(selectedUser.id, 'balance', parseFloat(editValues.balance));
    adjustUserBalance(selectedUser.id, 'totalDeposit', parseFloat(editValues.totalDeposit));
    adjustUserBalance(selectedUser.id, 'totalWithdrawal', parseFloat(editValues.totalWithdrawal));
    adjustUserBalance(selectedUser.id, 'income', parseFloat(editValues.income));
    
    // Refresh modal user reference with updated user from users array
    const updated = users.find(u => u.id === selectedUser.id);
    setSelectedUser({
      ...updated,
      balance: parseFloat(editValues.balance),
      totalDeposit: parseFloat(editValues.totalDeposit),
      totalWithdrawal: parseFloat(editValues.totalWithdrawal),
      income: parseFloat(editValues.income)
    });
    setIsEditingBalance(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 glass-panel">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by ID, Name, Email, Mobile, Wallet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-black/30 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
          />
        </div>
        <div className="text-xs text-gray-400 font-semibold">
          Showing {filteredUsers.length} of {users.length} Users
        </div>
      </div>

      {/* Users Desktop Table */}
      <div className="overflow-x-auto rounded-xl border border-white/5 glass-panel">
        <table className="w-full border-collapse text-left text-sm text-gray-300">
          <thead className="bg-black/40 text-[11px] font-bold text-gold uppercase tracking-wider border-b border-white/5">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Wallet</th>
              <th className="px-6 py-4">Sponsor</th>
              <th className="px-6 py-4">Balances</th>
              <th className="px-6 py-4">Current Rank</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-white/[0.01]">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-gold/15 text-gold border border-gold/20 flex items-center justify-center font-bold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{user.name}</h4>
                      <p className="text-xs text-gray-500">ID: {user.id} • {user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-400">
                  {user.wallet.substring(0, 8)}...{user.wallet.substring(user.wallet.length - 6)}
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-400">
                  {user.sponsor}
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center text-xs">
                      <span className="text-gray-500 w-12">Bal:</span>
                      <span className="font-bold text-white">${user.balance.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center text-[11px]">
                      <span className="text-gray-500 w-12">Income:</span>
                      <span className="font-semibold text-emerald-400">${user.income.toFixed(2)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gold/10 border border-gold/30 text-gold uppercase">
                    <Award size={12} className="mr-1" />
                    {user.currentRank}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    user.status === 'active' 
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-red-950/60 text-red-400 border border-red-500/20'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleOpenUserModal(user)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 transition-all"
                      title="View Profile Details"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        user.status === 'active' 
                          ? 'text-red-400 hover:bg-red-500/10 border-red-500/10 hover:border-red-500/30' 
                          : 'text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/10 hover:border-emerald-500/30'
                      }`}
                      title={user.status === 'active' ? 'Block User' : 'Activate User'}
                    >
                      {user.status === 'active' ? <Slash size={15} /> : <CheckCircle size={15} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500 font-semibold">
                  No users found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Expanded User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl border border-white/10 bg-darkbg-card p-6 shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gold/25 border border-gold text-gold flex items-center justify-center font-extrabold text-base">
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-gray-400">User Profile Card & History Ledger</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content Split Screen */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card & Balance Editor */}
              <div className="space-y-5 lg:border-r lg:border-white/5 lg:pr-6">
                <h4 className="text-xs font-bold text-gold uppercase tracking-wider">Account Specifications</h4>
                
                <div className="space-y-3.5 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">User ID:</span><span className="font-mono text-white">{selectedUser.id}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Rank:</span><span className="font-semibold text-gold uppercase">{selectedUser.currentRank}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Status:</span><span className={`font-semibold ${selectedUser.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>{selectedUser.status}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Joined:</span><span className="text-gray-300">{selectedUser.joinedDate}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Sponsor:</span><span className="text-gray-300 font-semibold">{selectedUser.sponsor}</span></div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 font-mono">
                    <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">BEP-20 Wallet Address</span>
                    <span className="text-gray-300 text-[10px] break-all">{selectedUser.wallet}</span>
                  </div>
                </div>

                {/* Balances Adjust Form */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-bold text-gray-200">Financial Balances</h5>
                    {isEditingBalance ? (
                      <button 
                        onClick={handleSaveBalance}
                        className="text-[10px] px-2 py-1 rounded bg-gold text-darkbg font-bold flex items-center hover:bg-gold-light"
                      >
                        <Save size={12} className="mr-1" /> Save
                      </button>
                    ) : (
                      <button 
                        onClick={() => setIsEditingBalance(true)}
                        className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400 font-bold flex items-center hover:text-white hover:bg-white/10"
                      >
                        <Edit size={12} className="mr-1" /> Edit
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold">Available Balance ($)</label>
                      <input 
                        type="number" 
                        disabled={!isEditingBalance}
                        value={isEditingBalance ? editValues.balance : selectedUser.balance.toFixed(2)}
                        onChange={(e) => setEditValues({ ...editValues, balance: e.target.value })}
                        className="w-full mt-1 bg-black/30 border border-white/5 disabled:border-transparent rounded-lg px-2.5 py-1 text-xs text-white disabled:text-gray-300 font-bold focus:outline-none focus:border-gold/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold">Total Deposits ($)</label>
                      <input 
                        type="number" 
                        disabled={!isEditingBalance}
                        value={isEditingBalance ? editValues.totalDeposit : selectedUser.totalDeposit.toFixed(2)}
                        onChange={(e) => setEditValues({ ...editValues, totalDeposit: e.target.value })}
                        className="w-full mt-1 bg-black/30 border border-white/5 disabled:border-transparent rounded-lg px-2.5 py-1 text-xs text-white disabled:text-gray-300 font-bold focus:outline-none focus:border-gold/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold">Total Withdrawals ($)</label>
                      <input 
                        type="number" 
                        disabled={!isEditingBalance}
                        value={isEditingBalance ? editValues.totalWithdrawal : selectedUser.totalWithdrawal.toFixed(2)}
                        onChange={(e) => setEditValues({ ...editValues, totalWithdrawal: e.target.value })}
                        className="w-full mt-1 bg-black/30 border border-white/5 disabled:border-transparent rounded-lg px-2.5 py-1 text-xs text-white disabled:text-gray-300 font-bold focus:outline-none focus:border-gold/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-semibold">Total Earnings ($)</label>
                      <input 
                        type="number" 
                        disabled={!isEditingBalance}
                        value={isEditingBalance ? editValues.income : selectedUser.income.toFixed(2)}
                        onChange={(e) => setEditValues({ ...editValues, income: e.target.value })}
                        className="w-full mt-1 bg-black/30 border border-white/5 disabled:border-transparent rounded-lg px-2.5 py-1 text-xs text-white disabled:text-gray-300 font-bold focus:outline-none focus:border-gold/30"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions Ledger & Income Categories */}
              <div className="lg:col-span-2 space-y-6">
                {/* 6 Income Categories Breakdown */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <h4 className="text-xs font-bold text-gold uppercase tracking-wider mb-3">6 Income Plan Earnings Breakdown</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-2.5 rounded bg-black/20 border border-white/5 text-center">
                      <span className="block text-[9px] text-gray-500 font-bold uppercase">Join Bonus</span>
                      <span className="text-xs font-bold text-white">${selectedUser.earnings.joinBonus.toFixed(2)}</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/20 border border-white/5 text-center">
                      <span className="block text-[9px] text-gray-500 font-bold uppercase">ROI Income (0.5%)</span>
                      <span className="text-xs font-bold text-white">${selectedUser.earnings.roiIncome.toFixed(2)}</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/20 border border-white/5 text-center">
                      <span className="block text-[9px] text-gray-500 font-bold uppercase">Referral (15%)</span>
                      <span className="text-xs font-bold text-white">${selectedUser.earnings.referralIncome.toFixed(2)}</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/20 border border-white/5 text-center">
                      <span className="block text-[9px] text-gray-500 font-bold uppercase">Booster Income</span>
                      <span className="text-xs font-bold text-white">${selectedUser.earnings.boosterIncome.toFixed(2)}</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/20 border border-white/5 text-center">
                      <span className="block text-[9px] text-gray-500 font-bold uppercase">Rank Bonus</span>
                      <span className="text-xs font-bold text-white">${selectedUser.earnings.rankBonus.toFixed(2)}</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/20 border border-white/5 text-center">
                      <span className="block text-[9px] text-gray-500 font-bold uppercase">Leadership Bonus</span>
                      <span className="text-xs font-bold text-white">${selectedUser.earnings.leadershipBonus.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Transaction Ledger */}
                <div>
                  <h4 className="text-xs font-bold text-gold uppercase tracking-wider mb-3">Complete Transaction Ledger</h4>
                  <div className="overflow-y-auto max-h-[220px] rounded-xl border border-white/5 bg-black/25">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-black/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky top-0">
                        <tr>
                          <th className="px-4 py-2.5">Tx ID</th>
                          <th className="px-4 py-2.5">Date</th>
                          <th className="px-4 py-2.5">Description</th>
                          <th className="px-4 py-2.5">Type</th>
                          <th className="px-4 py-2.5 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                        {selectedUser.transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-white/5">
                            <td className="px-4 py-3 font-mono">{tx.id}</td>
                            <td className="px-4 py-3 text-[10px] text-gray-500 whitespace-nowrap">{tx.date}</td>
                            <td className="px-4 py-3 font-semibold text-gray-200">{tx.description}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase ${
                                tx.type === 'deposit' 
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' 
                                  : tx.type === 'withdrawal'
                                  ? 'bg-red-950 text-red-400 border border-red-500/20'
                                  : 'bg-gold/10 text-gold border border-gold/20'
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
                        {selectedUser.transactions.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center py-6 text-gray-500">
                              No transactions logged.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
