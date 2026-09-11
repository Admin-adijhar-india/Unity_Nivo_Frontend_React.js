import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  TrendingUp,
  RefreshCw,
  User,
  Mail,
  Hash,
  DollarSign,
  AlertCircle,
  Copy,
  Check,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Layers,
  History,
  Calendar,
  Clock,
  CreditCard,
  Wallet,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from "lucide-react";

const UserRoi = () => {
  // States for ROI Payouts
  const [allRoiResponse, setAllRoiResponse] = useState(null);
  const [allRoiLoading, setAllRoiLoading] = useState(false);
  const [allRoiError, setAllRoiError] = useState(null);
  const [roiSearchQuery, setRoiSearchQuery] = useState("");

  // States for Wallet History (user_wallet_transaction API)
  const [walletResponse, setWalletResponse] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState(null);
  const [walletSearchQuery, setWalletSearchQuery] = useState("");
  const [walletPage, setWalletPage] = useState(1);
  const [walletLimit, setWalletLimit] = useState(10);

  const [copiedId, setCopiedId] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://unity-nivo-backend-nodejs.onrender.com";

  const getAllUserRoi = async () => {
    const token = localStorage.getItem("unity_nivo_token") || localStorage.getItem("unity_nivo_admin_token");

    if (!token) {
      setAllRoiError("Authentication token missing. Please log in.");
      return;
    }

    try {
      setAllRoiLoading(true);
      setAllRoiError(null);
      const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      const res = await fetch(`${BASE_URL}/api/user/auth/User_roi_payout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: formattedToken,
        },
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setAllRoiResponse(data);
        console.log("ROI USER ALL PAYOUT DATA:", data);
      } else {
        const text = await res.text();
        setAllRoiResponse({ status: res.status, rawText: text });
        console.log("ROI response (non-JSON):", res.status, text);
        if (!res.ok) {
          setAllRoiError(`Server returned status ${res.status}: ${text || res.statusText}`);
        }
      }
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching all ROI payouts:", err);
      setAllRoiError(err.message || "Failed to fetch ROI payout history");
    } finally {
      setAllRoiLoading(false);
    }
  };

  const getAllWallet = async (page = 1) => {
    const token = localStorage.getItem("unity_nivo_token") || localStorage.getItem("unity_nivo_admin_token");

    if (!token) {
      setWalletError("Authentication token missing. Please log in.");
      return;
    }

    try {
      setWalletLoading(true);
      setWalletError(null);
      const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      const res = await fetch(`${BASE_URL}/api/user/wallet/user_wallet_transaction?page=${page}&limit=${walletLimit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: formattedToken,
        },
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setWalletResponse(data);
        if (data?.pagination?.page) {
          setWalletPage(data.pagination.page);
        }
        console.log("USER WALLET TRANSACTION DATA:", data);
      } else {
        const text = await res.text();
        setWalletResponse({ status: res.status, rawText: text });
        console.log("Wallet response (non-JSON):", res.status, text);
        if (!res.ok) {
          setWalletError(`Server returned status ${res.status}: ${text || res.statusText}`);
        }
      }
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching wallet transactions:", err);
      setWalletError(err.message || "Failed to fetch wallet transaction history");
    } finally {
      setWalletLoading(false);
    }
  };

  useEffect(() => {
    getAllUserRoi();
    getAllWallet(1);
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to parse decimal amounts
  const parsePayoutAmount = (payoutObj) => {
    if (!payoutObj) return 0;
    if (typeof payoutObj === "object" && payoutObj.$numberDecimal !== undefined) {
      return parseFloat(payoutObj.$numberDecimal) || 0;
    }
    if (typeof payoutObj === "number") return payoutObj;
    if (typeof payoutObj === "string") return parseFloat(payoutObj) || 0;
    return 0;
  };

  // Helper to extract array from API response
  const extractList = (resp) => {
    if (!resp) return [];
    if (Array.isArray(resp)) return resp;
    if (Array.isArray(resp.data)) return resp.data;
    if (Array.isArray(resp.payouts)) return resp.payouts;
    if (Array.isArray(resp.history)) return resp.history;
    if (Array.isArray(resp.transactions)) return resp.transactions;
    if (resp.data && typeof resp.data === "object") {
      for (const key of Object.keys(resp.data)) {
        if (Array.isArray(resp.data[key])) return resp.data[key];
      }
    }
    return [];
  };

  const roiList = extractList(allRoiResponse);
  const walletList = extractList(walletResponse);
  const walletPagination = walletResponse?.pagination || {
    page: walletPage,
    limit: walletLimit,
    total: walletList.length,
    totalPages: Math.ceil(walletList.length / walletLimit) || 1,
  };

  // Filter ROI list by search query
  const filteredRoiList = roiList.filter((item) => {
    const query = roiSearchQuery.toLowerCase();
    const name = (item.name || item.userName || item.userId?.name || "").toLowerCase();
    const email = (item.email || item.userEmail || item.userId?.email || "").toLowerCase();
    const userIdVal = (typeof item.userId === "object" ? item.userId?.userId || item.userId?._id : item.userId || "").toString().toLowerCase();
    const invId = (typeof item.investmentId === "object" ? item.investmentId?._id : item.investmentId || "").toString().toLowerCase();
    const recordId = (item._id || "").toString().toLowerCase();
    const currency = (item.currency || "").toLowerCase();
    const amount = parsePayoutAmount(item.payoutAmount).toString();

    return (
      name.includes(query) ||
      email.includes(query) ||
      userIdVal.includes(query) ||
      invId.includes(query) ||
      recordId.includes(query) ||
      currency.includes(query) ||
      amount.includes(query)
    );
  });

  // Filter Wallet History list by search query
  const filteredWalletList = walletList.filter((item) => {
    const query = walletSearchQuery.toLowerCase();
    const userCode = (item.userCode || "").toLowerCase();
    const type = (item.type || "").toLowerCase();
    const direction = (item.direction || "").toLowerCase();
    const desc = (item.description || "").toLowerCase();
    const invId = (item.investmentId || "").toString().toLowerCase();
    const recordId = (item._id || "").toString().toLowerCase();
    const amount = (item.amount || "").toString();

    return (
      userCode.includes(query) ||
      type.includes(query) ||
      direction.includes(query) ||
      desc.includes(query) ||
      invId.includes(query) ||
      recordId.includes(query) ||
      amount.includes(query)
    );
  });

  // Calculate totals
  const totalEarned = filteredRoiList.reduce((sum, item) => sum + parsePayoutAmount(item.payoutAmount), 0);
  const currencySymbol = filteredRoiList.length > 0 ? filteredRoiList[0].currency || "USDT" : "USDT";

  const handleWalletPageChange = (newPage) => {
    if (newPage < 1 || newPage > (walletPagination.totalPages || 1)) return;
    setWalletPage(newPage);
    getAllWallet(newPage);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Banner / Action Header */}
      <div className="relative p-6 overflow-hidden rounded-2xl border border-white/10 glass-panel bg-darkbg-deep/80 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/30 text-gold">
                <TrendingUp size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                  My ROI & Wallet History
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Sparkles size={12} className="mr-1" /> Active Ledger
                  </span>
                </h2>
                <p className="text-xs text-gray-400">
                  Track your daily ROI payout rewards and complete wallet transaction logs.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                getAllUserRoi();
                getAllWallet(walletPage);
              }}
              disabled={allRoiLoading || walletLoading}
              className={`flex items-center px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                allRoiLoading || walletLoading
                  ? "bg-gold/50 cursor-not-allowed text-black/70"
                  : "bg-gold hover:bg-gold-light text-black shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              }`}
            >
              <RefreshCw size={16} className={`mr-2 ${(allRoiLoading || walletLoading) ? "animate-spin" : ""}`} />
              {(allRoiLoading || walletLoading) ? "Refreshing..." : "Refresh All"}
            </button>
          </div>
        </div>

    
      </div>

      {/* ROI Error Alert */}
      {allRoiError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start space-x-3">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Failed to Load ROI Payouts</h4>
            <p className="text-xs text-red-300/80 mt-0.5">{allRoiError}</p>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-white/5 glass-panel bg-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total ROI Earned</span>
            <div className="p-2 rounded-lg bg-gold/10 text-gold border border-gold/20">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gold mt-2">
            ${totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </p>
          <p className="text-[11px] text-gold/70 mt-1">Sum of daily payout credits</p>
        </div>

        <div className="p-5 rounded-xl border border-white/5 glass-panel bg-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total ROI Payout Logs</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <History size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{roiList.length}</p>
          <p className="text-[11px] text-gray-500 mt-1">ROI payout distributions</p>
        </div>

        <div className="p-5 rounded-xl border border-white/5 glass-panel bg-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Wallet Transactions</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wallet size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{walletPagination.total || walletList.length}</p>
          <p className="text-[11px] text-emerald-400/70 mt-1">Recorded wallet credits/debits</p>
        </div>
      </div>

      {/* ROI Payout History Table Container */}
      <div className="rounded-2xl border border-white/10 glass-panel bg-darkbg-deep/75 backdrop-blur-md overflow-hidden space-y-0">
        {/* Table Header Toolbar */}
        <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gold/10 text-gold border border-gold/20">
              <TrendingUp size={18} />
            </div>
            <h3 className="text-base font-bold text-white tracking-wide">
              ROI Payout Records ({filteredRoiList.length})
            </h3>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search ROI by Investment ID, Amount..."
              value={roiSearchQuery}
              onChange={(e) => setRoiSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          {allRoiLoading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw size={32} className="mx-auto text-gold animate-spin" />
              <p className="text-sm font-semibold text-gray-300">Loading ROI Payout History...</p>
            </div>
          ) : filteredRoiList.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Investment ID</th>
                  <th className="px-6 py-4">Payout Amount</th>
                  <th className="px-6 py-4">Payout Date</th>
                  <th className="px-6 py-4">Executed At</th>
                  <th className="px-6 py-4">Record ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredRoiList.map((item, idx) => {
                  const name = item.name || item.userName || item.userId?.name || "User";
                  const email = item.email || item.userEmail || item.userId?.email || "N/A";
                  const invId = (typeof item.investmentId === "object" ? item.investmentId?._id : item.investmentId) || "N/A";
                  const recordId = item._id || "N/A";
                  const amount = parsePayoutAmount(item.payoutAmount);
                  const currency = item.currency || "USDT";

                  const payoutDateFormatted = item.payoutDate ? new Date(item.payoutDate).toLocaleDateString() : "N/A";
                  const executedAtFormatted = item.cronRunAt
                    ? new Date(item.cronRunAt).toLocaleString()
                    : (item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A");

                  return (
                    <tr key={recordId !== "N/A" ? recordId : idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xs uppercase">
                            {name.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              {name}
                            </div>
                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Mail size={12} className="text-gray-500" />
                              {email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md border border-white/5 select-all">
                            {invId}
                          </span>
                          {invId !== "N/A" && (
                            <button
                              onClick={() => handleCopy(invId, `roi-inv-${invId}-${idx}`)}
                              className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                              title="Copy Investment ID"
                            >
                              {copiedId === `roi-inv-${invId}-${idx}` ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                          <ArrowUpRight size={13} className="text-emerald-400" />
                          <span>+${amount.toFixed(4)}</span>
                          <span className="text-[10px] text-emerald-300 font-sans uppercase">{currency}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-300 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-gold shrink-0" />
                          {payoutDateFormatted}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <Clock size={13} className="text-gray-500 shrink-0" />
                          {executedAtFormatted}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md border border-white/5 select-all">
                            {recordId}
                          </span>
                          {recordId !== "N/A" && (
                            <button
                              onClick={() => handleCopy(recordId, `roi-${recordId}`)}
                              className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                              title="Copy Record ID"
                            >
                              {copiedId === `roi-${recordId}` ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center space-y-3">
              <Layers size={36} className="mx-auto text-gray-600" />
              <h4 className="text-base font-semibold text-white">No ROI Payout History Found</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                No ROI payout logs matched your search or no payout distributions have been processed yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Wallet History Table Container */}
      <div className="rounded-2xl border border-white/10 glass-panel bg-darkbg-deep/75 backdrop-blur-md overflow-hidden space-y-0">
        {/* Toolbar Header */}
        <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Wallet size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Wallet History ({filteredWalletList.length})
              </h3>
              <p className="text-xs text-gray-400">Complete log of all wallet credits, debits & balance updates</p>
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search type, desc, amount, _id..."
              value={walletSearchQuery}
              onChange={(e) => setWalletSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Wallet Error Alert */}
        {walletError && (
          <div className="p-4 m-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start space-x-3">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Failed to Load Wallet History</h4>
              <p className="text-xs text-red-300/80 mt-0.5">{walletError}</p>
            </div>
          </div>
        )}

        {/* Table View */}
        <div className="overflow-x-auto">
          {walletLoading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw size={32} className="mx-auto text-purple-400 animate-spin" />
              <p className="text-sm font-semibold text-gray-300">Loading Wallet History...</p>
            </div>
          ) : filteredWalletList.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction Type</th>
                  <th className="px-6 py-4">User Code</th>
                  <th className="px-6 py-4">Amount & Direction</th>
                  <th className="px-6 py-4">Balance (Before → After)</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredWalletList.map((item, idx) => {
                  const recordId = item._id || "N/A";
                  const userCode = item.userCode || "N/A";
                  const type = item.type || "TRANSACTION";
                  const direction = (item.direction || "CREDIT").toUpperCase();
                  const amountVal = Number(item.amount || 0);
                  const currency = item.currency || "USDT";
                  const balBefore = Number(item.balanceBefore || 0);
                  const balAfter = Number(item.balanceAfter || 0);
                  const description = item.description || "N/A";
                  const dateFormatted = item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A";

                  // Type styling helper
                  const getTypeStyle = (t) => {
                    if (t === "DAILY_ROI") return "bg-gold/10 text-gold border-gold/20";
                    if (t === "REFERRAL_COMMISSION") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
                    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
                  };

                  return (
                    <tr key={recordId !== "N/A" ? recordId : idx} className="hover:bg-white/[0.02] transition-colors">
                      {/* Transaction Type */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider ${getTypeStyle(type)}`}>
                          {type.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* User Code */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold">
                          <Hash size={12} className="mr-1" />
                          {userCode}
                        </span>
                      </td>

                      {/* Amount & Direction */}
                      <td className="px-6 py-4">
                        {direction === "CREDIT" ? (
                          <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <ArrowDownLeft size={13} className="text-emerald-400" />
                            <span>+${amountVal.toFixed(4)}</span>
                            <span className="text-[10px] text-emerald-300 font-sans uppercase">{currency}</span>
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <ArrowUpRight size={13} className="text-rose-400" />
                            <span>-${amountVal.toFixed(4)}</span>
                            <span className="text-[10px] text-rose-300 font-sans uppercase">{currency}</span>
                          </span>
                        )}
                      </td>

                      {/* Balance Before -> After */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 font-mono text-xs">
                          <span className="text-gray-400">${balBefore.toFixed(2)}</span>
                          <ArrowRight size={12} className="text-gray-500" />
                          <span className="text-emerald-400 font-semibold">${balAfter.toFixed(2)}</span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4 max-w-xs text-xs text-gray-300">
                        <p className="truncate" title={description}>{description}</p>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <Clock size={13} className="text-gray-500 shrink-0" />
                          {dateFormatted}
                        </div>
                      </td>

                      {/* Transaction ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md border border-white/5 select-all">
                            {recordId}
                          </span>
                          {recordId !== "N/A" && (
                            <button
                              onClick={() => handleCopy(recordId, `wallet-${recordId}`)}
                              className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                              title="Copy Transaction ID"
                            >
                              {copiedId === `wallet-${recordId}` ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center space-y-3">
              <Layers size={36} className="mx-auto text-gray-600" />
              <h4 className="text-base font-semibold text-white">No Wallet Transactions Found</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                No wallet transactions matched your search query.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Toolbar */}
        {walletPagination.totalPages > 1 && (
          <div className="p-4 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400">
              Showing Page <span className="text-white font-bold">{walletPagination.page || walletPage}</span> of{" "}
              <span className="text-white font-bold">{walletPagination.totalPages}</span> ({walletPagination.total} total transactions)
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleWalletPageChange((walletPagination.page || walletPage) - 1)}
                disabled={(walletPagination.page || walletPage) <= 1 || walletLoading}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: walletPagination.totalPages }, (_, i) => i + 1).map((pg) => {
                  const isActive = pg === (walletPagination.page || walletPage);
                  return (
                    <button
                      key={pg}
                      onClick={() => handleWalletPageChange(pg)}
                      disabled={walletLoading}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        isActive
                          ? "bg-purple-500 text-white border border-purple-400"
                          : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5"
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handleWalletPageChange((walletPagination.page || walletPage) + 1)}
                disabled={(walletPagination.page || walletPage) >= walletPagination.totalPages || walletLoading}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRoi;

