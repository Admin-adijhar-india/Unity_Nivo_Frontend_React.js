import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ShieldAlert, 
  BookOpen, 
  AlertTriangle,
  Wallet,
  DollarSign,
  Link,
  CreditCard,
  MessageSquare,
  Send,
  Calculator
} from 'lucide-react';

export default function Withdrawals() {
  const role = localStorage.getItem("unity_nivo_role");
  const adminToken = localStorage.getItem("unity_nivo_admin_token");

  const { 
    currentUser,
    isAdmin: contextIsAdmin,
    withdrawals, 
    withdrawalLogs, 
    updateWithdrawalStatus, 
    completeWithdrawal, 
    addWithdrawalRequest,
    settings 
  } = useContext(AppContext);

  const isAdmin = role === "admin" || !!adminToken || contextIsAdmin || currentUser?.role === 'admin';

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWdForTx, setSelectedWdForTx] = useState(null);
  const [txHashInput, setTxHashInput] = useState('');

  // Form State
  const [reqAmount, setReqAmount] = useState('');
  const [reqWallet, setReqWallet] = useState(currentUser?.wallet || '');
  const [confirmWallet, setConfirmWallet] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [remarks, setRemarks] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitWithdrawal = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const numAmt = Number(reqAmount);
    const minWd = settings.minWithdrawal || 15;
    if (!reqAmount || isNaN(numAmt) || numAmt < minWd) {
      setFormError(`Minimum withdrawal amount is $${minWd}`);
      return;
    }

    const availableBal = Number(currentUser?.balance || 0);
    if (numAmt > availableBal) {
      setFormError("Insufficient available balance for withdrawal");
      return;
    }

    if (!reqWallet.trim()) {
      setFormError("Please enter your wallet address");
      return;
    }

    if (reqWallet.trim() !== confirmWallet.trim()) {
      setFormError("Wallet address and Confirm wallet address do not match");
      return;
    }

    if (!paymentDetails.trim()) {
      setFormError("Please enter your UPI / Payment details for reference");
      return;
    }

    setSubmitting(true);
    const userId = currentUser?.id || currentUser?.userId || currentUser?._id;
    const res = addWithdrawalRequest(userId, numAmt, reqWallet.trim(), paymentDetails.trim(), remarks.trim());
    setSubmitting(false);

    if (res?.success) {
      setFormSuccess(res.message);
      setReqAmount('');
      setConfirmWallet('');
      setPaymentDetails('');
      setRemarks('');
    } else {
      setFormError(res?.error || "Failed to submit withdrawal request");
    }
  };

  const filteredWithdrawals = (withdrawals || []).filter(wd => {
    // If regular user (non-admin), only show their own withdrawal records
    if (!isAdmin) {
      if (!currentUser) return false;
      const currentUserId = currentUser.id || currentUser.userId || currentUser.customUserId || currentUser._id;
      const currentEmail = currentUser.email;
      const currentName = currentUser.name;

      const matchesUser = 
        (currentUserId && String(wd.userId || '').toLowerCase() === String(currentUserId).toLowerCase()) ||
        (currentEmail && String(wd.email || '').toLowerCase() === String(currentEmail).toLowerCase()) ||
        (currentName && String(wd.userName || '').toLowerCase() === String(currentName).toLowerCase());

      if (!matchesUser) return false;
    }

    const matchesStatus = statusFilter === 'all' || wd.status === statusFilter;
    const matchesSearch = 
      (wd.id && String(wd.id).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (wd.userId && String(wd.userId).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (wd.userName && String(wd.userName).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (wd.wallet && String(wd.wallet).toLowerCase().includes(searchTerm.toLowerCase()));

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
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">

      {/* Top Section: Withdrawal Request Form (Left) & Guide / Rules (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Withdrawal Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-6 glass-panel shadow-xl">
            
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 text-gold">
                <Wallet size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">Withdrawal</h2>
                <p className="text-xs text-gray-400">Request your funds securely and easily</p>
              </div>
            </div>

            {/* Available Balance Box */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Available Balance</p>
                <p className="text-2xl font-extrabold text-emerald-400">
                  $ {Number(currentUser?.balance || 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitWithdrawal} className="space-y-4">
              {/* Form Messages */}
              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>{formSuccess}</span>
                </div>
              )}
              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Withdrawal Amount */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Withdrawal Amount (USD) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min="15"
                    step="any"
                    required
                    placeholder={`Enter amount (Min. $${settings.minWithdrawal || 15})`}
                    value={reqAmount}
                    onChange={(e) => setReqAmount(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-gold/50 transition"
                  />
                </div>
                {/* Live USD to INR Rate Indicator */}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[11px]">
                  <span className="text-gray-400">Current Rate: <span className="font-bold text-gold">1 USD = ₹95.40 INR</span></span>
                  {reqAmount && Number(reqAmount) > 0 && (
                    <span className="font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-500/30">
                      {reqAmount} USD = ₹{(Number(reqAmount) * 95.4).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR
                    </span>
                  )}
                </div>
              </div>

              {/* 2. Wallet Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Wallet Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Link size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your wallet address"
                    value={reqWallet}
                    onChange={(e) => setReqWallet(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-gold/50 transition"
                  />
                </div>
              </div>

              {/* 3. Confirm Wallet Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Confirm Wallet Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Link size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Re-enter wallet address"
                    value={confirmWallet}
                    onChange={(e) => setConfirmWallet(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-gold/50 transition"
                  />
                </div>
              </div>

              {/* 4. Your UPI/Payment Details */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Your UPI/Payment Details (for reference) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter UPI ID / Payment Details"
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-gold/50 transition"
                  />
                </div>
              </div>

              {/* 5. Remarks */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Remarks (Optional)
                </label>
                <div className="relative">
                  <MessageSquare size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Any message (optional)"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-gold/50 transition"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2 text-xs">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wider mb-2">Withdrawal Summary</h4>
                <div className="flex items-center justify-between text-gray-300">
                  <span>Withdrawal Amount</span>
                  <div className="text-right">
                    <span className="font-mono font-bold">${Number(reqAmount || 0).toFixed(2)}</span>
                    {Number(reqAmount || 0) > 0 && (
                      <span className="text-[10px] text-emerald-400/80 block font-semibold">
                        (₹{(Number(reqAmount || 0) * 95.4).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR)
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>TDS ({settings.withdrawalCharge || 5}%)</span>
                  <div className="text-right">
                    <span className="font-mono text-red-400">-${(Number(reqAmount || 0) * (settings.withdrawalCharge || 5) / 100).toFixed(2)}</span>
                    {Number(reqAmount || 0) > 0 && (
                      <span className="text-[10px] text-red-400/80 block font-semibold">
                        (-₹{(Number(reqAmount || 0) * (settings.withdrawalCharge || 5) / 100 * 95.4).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR)
                      </span>
                    )}
                  </div>
                </div>
                <div className="border-t border-emerald-500/20 pt-2 flex items-center justify-between font-extrabold text-sm text-emerald-400">
                  <span>Net Amount</span>
                  <div className="text-right">
                    <span className="font-mono">${(Number(reqAmount || 0) * (1 - (settings.withdrawalCharge || 5) / 100)).toFixed(2)}</span>
                    {Number(reqAmount || 0) > 0 && (
                      <span className="text-xs text-emerald-300 block font-bold">
                        (₹{(Number(reqAmount || 0) * (1 - (settings.withdrawalCharge || 5) / 100) * 95.4).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Send size={15} />
                {submitting ? "Submitting Request..." : "Submit Withdrawal"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Step-by-Step Guide & Rules */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header Banner */}
          <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/15 via-gold/5 to-transparent p-5 text-center shadow-lg">
            <h2 className="text-xl font-extrabold text-gold uppercase tracking-wider">WITHDRAWAL PAGE</h2>
            <p className="text-xs text-gray-300 font-semibold mt-1">Step-by-Step Guide – What to Fill</p>
          </div>

          {/* Steps */}
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5 space-y-4">
            {[
              { step: 1, title: 'Withdrawal Amount', desc: `Enter the amount you want to withdraw. (Minimum $${settings.minWithdrawal || 15})` },
              { step: 2, title: 'Wallet Address', desc: 'Enter your crypto wallet address (e.g. USDT address).' },
              { step: 3, title: 'Confirm Wallet Address', desc: 'Re-enter the same wallet address to avoid errors.' },
              { step: 4, title: 'Your UPI/Payment Details (for reference)', desc: 'Enter your UPI ID or payment details (for record/reference).' },
              { step: 5, title: 'Remarks (Optional)', desc: 'You can add any message if needed.' },
              { step: 6, title: 'Click "Submit Withdrawal"', desc: 'Your request will be processed as per the withdrawal rules.' }
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gold/20 border border-gold/40 text-gold font-extrabold text-xs flex-shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Withdrawal Rules */}
          <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 via-black/40 to-transparent p-5 space-y-3.5">
            <div className="flex items-center gap-2 text-gold border-b border-white/10 pb-2.5">
              <Wallet size={18} />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Withdrawal Rules</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <span className="text-gray-400">Minimum Withdrawal</span>
                <span className="font-bold text-white">: ${settings.minWithdrawal || 15}</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span className="text-gray-400">Withdrawal Charge</span>
                <span className="font-bold text-gold">: {settings.withdrawalCharge || 5}% TDS</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span className="text-gray-400">Processing Time</span>
                <span className="font-bold text-white">: Monday to Saturday</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span className="text-gray-400">Processing</span>
                <span className="font-bold text-emerald-400">: Up to 24 Hours</span>
              </div>
            </div>
          </div>

          {/* Example Card */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 border-b border-emerald-500/20 pb-2">
              <Calculator size={18} />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Example Calculation</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <span>If you withdraw</span>
                <span className="font-mono font-bold text-white">$100 (₹9,540 INR)</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>TDS ({settings.withdrawalCharge || 5}%)</span>
                <span className="font-mono text-red-400">$5 (₹477 INR)</span>
              </div>
              <div className="border-t border-emerald-500/20 pt-2 flex items-center justify-between font-extrabold text-sm text-emerald-400">
                <span>Net Withdrawal</span>
                <span className="font-mono">$95 (₹9,063 INR)</span>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="text-center pt-2">
            <p className="text-xs italic text-gold tracking-widest">— Your Funds, Our Priority —</p>
          </div>
        </div>

      </div>

      {/* Rules Banner (For quick admin/audit info) */}
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
                  {isAdmin && (wd.status === 'pending' || wd.status === 'held') ? (
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
                  ) : isAdmin && wd.status === 'approved' ? (
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
                  ) : wd.status === 'pending' || wd.status === 'held' ? (
                    <span className="text-xs text-amber-400 font-semibold italic">Pending Audit</span>
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
      {isAdmin && (
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
      )}

      {/* Complete Payout Tx Hash Modal */}
      {selectedWdForTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl border border-white/10 bg-darkbg-card p-6 shadow-2xl animate-in fade-in zoom-in duration-200 my-auto">
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
