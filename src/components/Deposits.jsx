import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, ShieldAlert, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
const DepositStatus = ({ status }) => { const normalizedStatus = String(status || 'pending').toLowerCase(); const statusConfig = { confirmed: { label: 'Confirmed', className: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20', icon: <CheckCircle size={12} />, }, pending: { label: 'Pending', className: 'bg-amber-950/60 text-amber-400 border border-amber-500/20', icon: <Clock size={12} className="animate-pulse" />, }, failed: { label: 'Failed', className: 'bg-red-950/60 text-red-400 border border-red-500/20', icon: <XCircle size={12} />, }, }; const config = statusConfig[normalizedStatus] || statusConfig.pending; return (<span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${config.className}`} > {config.icon} <span>{config.label}</span> </span>); };
export default function Deposits() {
  const { deposits, confirmDeposit, failDeposit, settings } = useContext(AppContext);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [walletInfo, setWalletInfo] = useState(null);

  const [myDeposits, setMyDeposits] = useState([]);
  const [depositsLoading, setDepositsLoading] = useState(false);
  const [depositsError, setDepositsError] = useState("");

  // Fetch deposit info (wallet address + QR) on component mount
  useEffect(() => {
    const fetchInfo = async () => {
      const token = localStorage.getItem('unity_nivo_token');
      if (!token) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://unity-nivo-backend-nodejs.onrender.com'}/api/user/auth/deposit-info`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json?.success && json?.data) {
          setWalletInfo(json.data);
        }
      } catch (e) {
        console.error('Failed to fetch deposit info', e);
      }
    };
    fetchInfo();
  }, []);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://unity-nivo-backend-nodejs.onrender.com';

  // ... (rest kept below in JSX)

  // Form state for payment proof upload

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // const handleUpload = async (e) => {
  //   e.preventDefault();
  //   if (!paymentAmount || !paymentScreenshot) {
  //     setUploadStatus('Please provide amount and screenshot');
  //     return;
  //   }
  //   const token = localStorage.getItem('unity_nivo_token');
  //   const formData = new FormData();
  //   formData.append('amount', paymentAmount);
  //   formData.append('screenshot', paymentScreenshot);
  //   try {
  //     const res = await fetch(`${BASE_URL}/api/user/deposit`, {
  //       method: 'POST',
  //       headers: token ? { Authorization: `Bearer ${token}` } : {},
  //       body: formData,
  //     });
  //     const result = await res.json();
  //     if (res.ok) {
  //       setUploadStatus('Payment submitted successfully');
  //       setPaymentAmount('');
  //       setPaymentScreenshot(null);
  //     } else {
  //       setUploadStatus(result?.message || 'Upload failed');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setUploadStatus('Upload error');
  //   }
  // };

  // Filtering based on search and status


  const handleUpload = async (e) => {
    e.preventDefault();

    if (!paymentAmount || !paymentScreenshot) {
      setUploadStatus("Please provide amount and screenshot");
      return;
    }

    const token = localStorage.getItem("unity_nivo_token");

    const formData = new FormData();
    formData.append("amount", paymentAmount);
    formData.append("paymentScreenshot", paymentScreenshot); // FIX

    try {
      const res = await fetch(`${BASE_URL}/api/user/deposit`, {
        method: "POST",
        headers: token
          ? {
            Authorization: `Bearer ${token}`,
          }
          : {},
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setUploadStatus("Payment submitted successfully");
        setPaymentAmount("");
        setPaymentScreenshot(null);
      } else {
        setUploadStatus(result?.message || "Upload failed");
      }
    } catch (err) {
      console.error("Deposit upload error:", err);
      setUploadStatus("Upload error");
    }
  };

  const fetchMyDeposits = async () => {
    const token = localStorage.getItem("unity_nivo_token");

    if (!token) return;

    try {
      setDepositsLoading(true);
      setDepositsError("");
// http://localhost:5000/api/user/auth/my
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "https://unity-nivo-backend-nodejs.onrender.com"}/api/user/auth/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (json?.success && Array.isArray(json?.data)) {
        setMyDeposits(json.data);
      } else {
        setDepositsError(
          json?.message || "Failed to load deposit history"
        );
      }
    } catch (e) {
      console.error("Failed to fetch my deposits:", e);
      setDepositsError("Unable to load deposit history");
    } finally {
      setDepositsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDeposits();
  }, []);


  const filteredDeposits = myDeposits.filter((deposit) => {
    if (statusFilter === "all") {
      return true;
    }

    if (statusFilter === "pending") {
      return deposit.status === "hold";
    }

    if (statusFilter === "completed") {
      return deposit.status === "confirmed";
    }

    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Deposit Info Section */}
      <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-400">
        <h3 className="font-bold text-base mb-4">Deposit Wallet Info</h3>
        {walletInfo ? (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* QR Code from backend */}
            <div className="flex-shrink-0 p-2 bg-white rounded-xl">
              <img
                src={`${BASE_URL}${walletInfo.qrCode}`}
                alt="Payment QR Code"
                className="w-40 h-40 object-contain"
              />
            </div>
            {/* Wallet Details */}
            <div className="flex-1 space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">Wallet Address</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-white break-all bg-black/30 px-3 py-2 rounded-lg border border-white/10 flex-1">
                    {walletInfo.walletAddress}
                  </span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(walletInfo.walletAddress); }}
                    className="px-3 py-2 text-[10px] bg-gold/20 border border-gold/30 text-gold font-bold rounded-lg hover:bg-gold/30 transition-colors whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-[11px] font-bold">
                  Network: <span className="text-white">{walletInfo.network}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-[11px] font-bold">
                  Currency: <span className="text-white">{walletInfo.currency}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/20 text-amber-400 text-[11px] font-bold">
                  Min Deposit: <span className="text-white">${walletInfo.minimumDeposit}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            Loading deposit info...
          </div>
        )}
      </div>

      {/* Payment Upload Form */}
      <form onSubmit={handleUpload} className="p-4 rounded-xl bg-emerald-950/10 border border-emerald-500/20 text-emerald-400 mb-6">
        <h3 className="font-bold mb-2">Submit Payment Proof</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1">Amount (USDT)</label>
            <input
              type="number"
              step="0.01"
              value={paymentAmount}
              onChange={e => setPaymentAmount(e.target.value)}
              className="w-full bg-black/30 border border-emerald-500/30 rounded px-2 py-1 text-xs text-white focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Screenshot</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setPaymentScreenshot(e.target.files[0])}
              className="w-full bg-black/30 border border-emerald-500/30 rounded px-2 py-1 text-xs text-white focus:outline-none"
              required
            />
          </div>
        </div>
        {uploadStatus && <p className="mt-2 text-xs">{uploadStatus}</p>}
        <button type="submit" className="mt-3 px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs">
          Upload Payment
        </button>
      </form>


      {/* Deposit History */}
      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-4 sm:p-5">

        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-white sm:text-lg">
              Deposit History
            </h3>

            <p className="mt-1 text-xs text-emerald-400/60">
              View your payment submissions and their status
            </p>
          </div>

          <button
            type="button"
            onClick={fetchMyDeposits}
            disabled={depositsLoading}
            className="w-full rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {depositsLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Loading */}
        {depositsLoading && myDeposits.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-500/20 border-t-emerald-400" />

            <p className="mt-3 text-xs text-emerald-400/60">
              Loading deposit history...
            </p>
          </div>
        )}

        {/* Error */}
        {!depositsLoading && depositsError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-xs text-red-400">
              {depositsError}
            </p>

            <button
              type="button"
              onClick={fetchMyDeposits}
              className="mt-2 text-xs font-medium text-red-300 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!depositsLoading &&
          !depositsError &&
          myDeposits.length === 0 && (
            <div className="rounded-xl border border-emerald-500/10 bg-black/20 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                <span className="text-xl">💳</span>
              </div>

              <h4 className="mt-3 text-sm font-semibold text-white">
                No deposits yet
              </h4>

              <p className="mt-1 text-xs text-white/40">
                Your deposit history will appear here.
              </p>
            </div>
          )}

        {/* Desktop Table */}
        {myDeposits.length > 0 && (
          <div className="hidden overflow-hidden rounded-xl border border-emerald-500/10 md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px]">
                <thead>
                  <tr className="border-b border-emerald-500/10 bg-black/20">
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-emerald-400/50">
                      Amount
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-emerald-400/50">
                      Network
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-emerald-400/50">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-emerald-400/50">
                      Date
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-emerald-400/50">
                      Proof
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {myDeposits.map((deposit) => (
                    <tr
                      key={deposit._id}
                      className="border-b border-emerald-500/10 last:border-0 transition hover:bg-emerald-500/5"
                    >
                      {/* Amount */}
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-white">
                            ${Number(deposit.amount).toFixed(2)}
                          </p>

                          <p className="mt-0.5 text-[10px] text-white/30">
                            USDT
                          </p>
                        </div>
                      </td>

                      {/* Network */}
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] font-medium text-blue-400">
                          {deposit.network}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <DepositStatus status={deposit.status} />
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-xs text-white/70">
                            {new Date(deposit.createdAt).toLocaleDateString()}
                          </p>

                          <p className="mt-0.5 text-[10px] text-white/30">
                            {new Date(deposit.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </td>

                      {/* Screenshot */}
                      <td className="px-4 py-4">
                        {deposit.paymentScreenshot ? (
                          <a
                            href={`${BASE_URL}${deposit.paymentScreenshot}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-medium text-emerald-400 transition hover:bg-emerald-500/20"
                          >
                            View Proof
                          </a>
                        ) : (
                          <span className="text-xs text-white/30">
                            No proof
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile Cards */}
        {myDeposits.length > 0 && (
          <div className="space-y-3 md:hidden">
            {myDeposits.map((deposit) => (
              <div
                key={deposit._id}
                className="rounded-xl border border-emerald-500/15 bg-black/20 p-4"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-emerald-400/40">
                      Deposit Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-white">
                      ${Number(deposit.amount).toFixed(2)}
                    </p>

                    <p className="text-[10px] text-white/30">
                      USDT
                    </p>
                  </div>

                  <DepositStatus status={deposit.status} />
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <p className="text-[10px] text-white/30">
                      Network
                    </p>

                    <p className="mt-1 text-xs font-medium text-white">
                      {deposit.network}
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <p className="text-[10px] text-white/30">
                      Date
                    </p>

                    <p className="mt-1 text-xs font-medium text-white">
                      {new Date(deposit.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Wallet */}
                {deposit.walletAddress && (
                  <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <p className="text-[10px] text-white/30">
                      Wallet Address
                    </p>

                    <p className="mt-1 break-all font-mono text-[10px] text-white/60">
                      {deposit.walletAddress}
                    </p>
                  </div>
                )}

                {/* Screenshot */}
                {deposit.paymentScreenshot && (
                  <a
                    href={`${BASE_URL}${deposit.paymentScreenshot}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-full items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20"
                  >
                    View Payment Screenshot
                  </a>
                )}

                {/* Admin Remark */}
                {deposit.adminRemark && (
                  <div className="mt-3 rounded-lg border border-yellow-500/10 bg-yellow-500/5 p-3">
                    <p className="text-[10px] text-yellow-400/50">
                      Admin Remark
                    </p>

                    <p className="mt-1 text-xs text-yellow-300/80">
                      {deposit.adminRemark}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Rule Notice */}
      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs flex items-start space-x-3">
        <ShieldAlert size={18} className="mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-bold uppercase tracking-wider block mb-0.5">Deposit Rule Check</span>
          Minimum Deposit is <span className="font-bold text-white">${settings.minDeposit} USDT</span>. Only <span className="font-bold text-white">{settings.depositNetwork}</span> transactions are valid. Deposits are auto-detected by blockchain listener. Administrators can manually audit, confirm, or flag failed transactions here.
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 glass-panel">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by ID, User, Tx Hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-black/30 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-gold/50 transition-all"
          />
        </div>

        {/* Status Filters Tabs */}
        {/* <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-black/20 border border-white/5 self-start lg:self-auto">
          {['all', 'pending', 'confirmed', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${statusFilter === status
                ? 'bg-gold text-darkbg shadow'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              {status}
            </button>
          ))}
        </div> */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-black/20 border border-white/5">
          {["all", "pending", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${statusFilter === status
                ? "bg-gold text-darkbg shadow"
                : "text-gray-400 hover:text-white"
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Deposits Table */}
      <div className="overflow-x-auto rounded-xl border border-white/5 glass-panel">
        <table className="w-full border-collapse text-left text-sm text-gray-300">
          <thead className="bg-black/40 text-[11px] font-bold text-gold uppercase tracking-wider border-b border-white/5">
            <tr>
              <th className="px-6 py-4">Deposit ID</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4">Network & Wallet Address</th>
              <th className="px-6 py-4">Blockchain Tx Hash</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4">Updated At</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-white/[0.01]">
            {filteredDeposits?.map((deposit) => (
              <tr key={deposit._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold text-white">
                  {deposit._id}
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-200 block">{deposit.userName}</span>
                  <span className="text-[10px] text-gray-500">ID: {deposit.userId}</span>
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-white">
                  ${deposit.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-1.5 py-0.5 rounded-[4px] text-[9px] font-extrabold uppercase bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 mb-1">
                    {deposit.network}
                  </span>
                  <div className="text-[10px] text-gray-400 font-mono break-all max-w-[150px]">
                    {deposit.walletAddress}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1 font-mono text-xs text-gray-400 max-w-[150px] truncate hover:text-white">
                    <span>{deposit.txHash}</span>
                    <a
                      href={`https://bscscan.com/tx/${deposit.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gold-light hover:text-gold flex-shrink-0"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
                  {deposit.createdAt
                    ? new Date(deposit.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                    : "N/A"}
                </td>

                <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
                  {deposit.updatedAt
                    ? new Date(deposit.updatedAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                    : "N/A"}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${deposit.status === 'confirmed'
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20'
                    : deposit.status === 'pending'
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-500/20'
                      : 'bg-red-950/60 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {deposit.status === 'confirmed' && <CheckCircle size={10} className="mr-1" />}
                    {deposit.status === 'pending' && <Clock size={10} className="mr-1 animate-pulse" />}
                    {deposit.status === 'failed' && <XCircle size={10} className="mr-1" />}
                    <span className="capitalize">{deposit.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {deposit.status === 'pending' ? (
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => confirmDeposit(deposit.id)}
                        className="px-2.5 py-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors"
                        title="Confirm & Credit User"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => failDeposit(deposit.id)}
                        className="px-2.5 py-1 text-xs bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
                        title="Mark as Failed"
                      >
                        Fail
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500 font-semibold italic">Audited</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredDeposits.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-500 font-semibold">
                  No deposits found under filter "{statusFilter}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

