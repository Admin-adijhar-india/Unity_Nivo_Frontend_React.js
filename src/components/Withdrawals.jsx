import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, Clock, CheckCircle, XCircle, ShieldAlert, BookOpen, AlertTriangle } from 'lucide-react';

export default function Withdrawals() {
  const { 
    withdrawals, 
    withdrawalLogs, 
    updateWithdrawalStatus, 
    completeWithdrawal, 
    settings 
  } = useContext(AppContext);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWdForTx, setSelectedWdForTx] = useState(null);
  const [txHashInput, setTxHashInput] = useState('');

  const filteredWithdrawals = withdrawals.filter(wd => {
    const matchesStatus = statusFilter === 'all' || wd.status === statusFilter;
    const matchesSearch = 
      wd.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wd.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wd.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wd.wallet.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenTxModal = (wd) => {
    setSelectedWdForTx(wd);
    setTxHashInput('');
  };

  const handleCompletePayout = () => {
    if (!txHashInput.trim()) return;
    completeWithdrawal(selectedWdForTx.id, txHashInput);
    setSelectedWdForTx(null);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Rules Banner */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/20 text-amber-400 text-xs flex items-start space-x-3">
        <ShieldAlert size={18} className="mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-bold uppercase tracking-wider block mb-0.5">Withdrawal Processing Rules</span>
          Minimum Withdrawal: <span className="font-bold text-white">${settings.minWithdrawal} USDT</span>. Withdrawal Charge: <span className="font-bold text-white">{settings.withdrawalCharge}%</span>. Target processing schedule is Monday to Friday, within 24 hours. Rejecting a withdrawal refunds the full gross amount back to the user's spending balance automatically.
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 glass-panel">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search withdrawals by ID, User ID, Wallet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-black/30 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-gold/50 transition-all"
          />
        </div>

        <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/20 border border-white/5 overflow-x-auto">
          {['all', 'pending', 'approved', 'held', 'rejected', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg transition-all ${
                statusFilter === status 
                  ? 'bg-gold text-darkbg shadow' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="overflow-x-auto rounded-xl border border-white/5 glass-panel">
        <table className="w-full border-collapse text-left text-sm text-gray-300">
          <thead className="bg-black/40 text-[11px] font-bold text-gold uppercase tracking-wider border-b border-white/5">
            <tr>
              <th className="px-6 py-4">WD ID</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4 text-right">Requested</th>
              <th className="px-6 py-4 text-right">Fee (5%)</th>
              <th className="px-6 py-4 text-right">Net Payout</th>
              <th className="px-6 py-4">BEP-20 Wallet</th>
              <th className="px-6 py-4">Request Time</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-white/[0.01]">
            {filteredWithdrawals.map((wd) => (
              <tr key={wd.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold text-white">
                  {wd.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-semibold text-gray-200 block">{wd.userName}</span>
                  <span className="text-[10px] text-gray-500">ID: {wd.userId}</span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-400">
                  ${wd.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-xs text-red-400">
                  -${wd.charge.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-emerald-400">
                  ${wd.netAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-400 max-w-[130px] truncate">
                  {wd.wallet}
                </td>
                <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
                  {wd.requestTime}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                    wd.status === 'completed'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                      : wd.status === 'pending'
                      ? 'bg-amber-950 text-amber-400 border border-amber-500/20'
                      : wd.status === 'approved'
                      ? 'bg-blue-950 text-blue-400 border border-blue-500/20'
                      : wd.status === 'held'
                      ? 'bg-purple-950 text-purple-400 border border-purple-500/20'
                      : 'bg-red-950 text-red-400 border border-red-500/20'
                  }`}>
                    {wd.status}
                  </span>
                  {wd.processedTime && (
                    <span className="block text-[9px] text-gray-500 mt-0.5">{wd.processedTime}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {wd.status === 'pending' || wd.status === 'held' ? (
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => updateWithdrawalStatus(wd.id, 'approved', 'Audit check cleared')}
                        className="px-2 py-1 text-[10px] bg-blue-500 hover:bg-blue-600 text-white font-bold rounded"
                      >
                        Approve
                      </button>
                      {wd.status === 'pending' && (
                        <button
                          onClick={() => updateWithdrawalStatus(wd.id, 'held', 'Audit flags pending clarification')}
                          className="px-2 py-1 text-[10px] bg-purple-500 hover:bg-purple-600 text-white font-bold rounded"
                        >
                          Hold
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const reason = prompt("Enter rejection reason:");
                          if (reason !== null) {
                            updateWithdrawalStatus(wd.id, 'rejected', reason || 'Rejected by Admin');
                          }
                        }}
                        className="px-2 py-1 text-[10px] bg-red-500 hover:bg-red-600 text-white font-bold rounded"
                      >
                        Reject
                      </button>
                    </div>
                  ) : wd.status === 'approved' ? (
                    <button
                      onClick={() => handleOpenTxModal(wd)}
                      className="px-3 py-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-lg shadow-md shadow-emerald-500/20 transition-all"
                    >
                      Complete Payout
                    </button>
                  ) : wd.status === 'completed' && wd.txHash ? (
                    <div className="text-[10px] text-gray-500 font-mono select-all hover:text-gray-300">
                      Tx: {wd.txHash.substring(0, 10)}...
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500 italic">No Actions</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredWithdrawals.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-10 text-gray-500 font-semibold">
                  No withdrawals found under filter "{statusFilter}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Admin Operations Audit Trail Log */}
      <div className="p-5 rounded-2xl border border-white/5 glass-panel space-y-4">
        <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
          <BookOpen size={16} className="text-gold" />
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Admin Actions Audit Trail Log</h3>
        </div>
        <div className="overflow-y-auto max-h-[220px] rounded-xl border border-white/5 bg-black/20">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 border-b border-white/5">
              <tr>
                <th className="px-4 py-2.5">Log ID</th>
                <th className="px-4 py-2.5">Withdrawal ID</th>
                <th className="px-4 py-2.5">Action Type</th>
                <th className="px-4 py-2.5">Admin User</th>
                <th className="px-4 py-2.5">Timestamp</th>
                <th className="px-4 py-2.5">Activity Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {withdrawalLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-mono font-bold text-gold">{log.id}</td>
                  <td className="px-4 py-3 font-mono">{log.withdrawalId}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase ${
                      log.action.includes('Reject') 
                        ? 'bg-red-950 text-red-400 border border-red-500/20' 
                        : log.action.includes('Approve') || log.action.includes('Complete')
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                        : 'bg-purple-950 text-purple-400 border border-purple-500/20'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-400">{log.admin}</td>
                  <td className="px-4 py-3 text-[10px] text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3 font-semibold text-gray-200">{log.details}</td>
                </tr>
              ))}
              {withdrawalLogs.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No actions logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Payout Tx Hash Modal */}
      {selectedWdForTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-darkbg-card p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-bold text-white mb-2">Assign Blockchain Transaction Hash</h3>
            <p className="text-xs text-gray-400 mb-4">
              Payout for <span className="font-bold text-white">{selectedWdForTx.userName}</span> ({selectedWdForTx.id}) is approved. Enter the BEP-20 transaction hash below to complete the payout.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Transaction Hash (Tx Hash)</label>
                <input
                  type="text"
                  placeholder="0x3a4f..."
                  value={txHashInput}
                  onChange={(e) => setTxHashInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-gold/50"
                  autoFocus
                />
              </div>

              <div className="flex items-center space-x-2 p-2.5 rounded bg-emerald-950/20 border border-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                <AlertTriangle size={14} className="flex-shrink-0" />
                <span>Entering Tx Hash deducts spending ledger and logs blockchain confirmation in the system.</span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => setSelectedWdForTx(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-white/5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompletePayout}
                  disabled={!txHashInput.trim()}
                  className="px-3.5 py-1.5 rounded-xl bg-gold text-darkbg disabled:opacity-50 font-bold hover:bg-gold-light text-xs"
                >
                  Complete Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
