import React, { useEffect, useState } from "react";
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
  Sparkles,
  Layers,
  History,
  Calendar,
  Clock
} from "lucide-react";

const ROI = () => {
  const [loading, setLoading] = useState(false);
  const [rawResponse, setRawResponse] = useState(null);
  const [error, setError] = useState(null);

  // States for ROI History (get_All_Roi_payout API)
  const [allRoiLoading, setAllRoiLoading] = useState(false);
  const [allRoiResponse, setAllRoiResponse] = useState(null);
  const [allRoiError, setAllRoiError] = useState(null);

  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://unity-nivo-backend-nodejs.onrender.com";

  const getRoi = async () => {
    const adminToken = localStorage.getItem("unity_nivo_admin_token");

    if (!adminToken) {
      setError("Admin authentication token missing. Please log in as Admin.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const formattedToken = adminToken.startsWith("Bearer ") ? adminToken : `Bearer ${adminToken}`;
      const res = await fetch(`${BASE_URL}/api/admin/dashboard/trigger-roi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: formattedToken,
        },
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setRawResponse(data);
        console.log("ROI DATA:", data);
      } else {
        const text = await res.text();
        setRawResponse({ status: res.status, rawText: text });
        console.log("ROI response (non-JSON):", res.status, text);
        if (!res.ok) {
          setError(`Server returned status ${res.status}: ${text || res.statusText}`);
        }
      }
      setLastUpdated(new Date().toLocaleTimeString());
      // Refresh payout history when ROI calculation is triggered
      getAllRoi();
    } catch (err) {
      console.error("Error triggering ROI:", err);
      setError(err.message || "Failed to trigger ROI calculation");
    } finally {
      setLoading(false);
    }
  };

  const getAllRoi = async () => {
    const adminToken = localStorage.getItem("unity_nivo_admin_token");

    if (!adminToken) {
      setAllRoiError("Admin authentication token missing. Please log in as Admin.");
      return;
    }

    try {
      setAllRoiLoading(true);
      setAllRoiError(null);
      const formattedToken = adminToken.startsWith("Bearer ") ? adminToken : `Bearer ${adminToken}`;
      const res = await fetch(`${BASE_URL}/api/admin/dashboard/get_All_Roi_payout`, {
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
        console.log("ROI ALL PAYOUT DATA:", data);
      } else {
        const text = await res.text();
        setAllRoiResponse({ status: res.status, rawText: text });
        console.log("ROI response (non-JSON):", res.status, text);
        if (!res.ok) {
          setAllRoiError(`Server returned status ${res.status}: ${text || res.statusText}`);
        }
      }
    } catch (err) {
      console.error("Error fetching all ROI payouts:", err);
      setAllRoiError(err.message || "Failed to fetch ROI payout history");
    } finally {
      setAllRoiLoading(false);
    }
  };

  useEffect(() => {
    getRoi();
    getAllRoi();
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to parse payout amount values (handles $numberDecimal objects)
  const parsePayoutAmount = (payoutObj) => {
    if (!payoutObj) return 0;
    if (typeof payoutObj === "object" && payoutObj.$numberDecimal !== undefined) {
      return parseFloat(payoutObj.$numberDecimal) || 0;
    }
    if (typeof payoutObj === "number") return payoutObj;
    if (typeof payoutObj === "string") return parseFloat(payoutObj) || 0;
    return 0;
  };

  // Helper to extract calculated users array from trigger response
  const extractRoiUsers = (resp) => {
    if (!resp) return [];
    if (Array.isArray(resp)) return resp;
    if (Array.isArray(resp.data)) return resp.data;
    if (Array.isArray(resp.users)) return resp.users;
    if (Array.isArray(resp.roiList)) return resp.roiList;
    if (Array.isArray(resp.results)) return resp.results;
    if (Array.isArray(resp.processedUsers)) return resp.processedUsers;
    if (resp.data && typeof resp.data === "object") {
      for (const key of Object.keys(resp.data)) {
        if (Array.isArray(resp.data[key])) return resp.data[key];
      }
    }
    return [];
  };

  // Helper to extract ROI history array from get_All_Roi_payout response
  const extractRoiHistory = (resp) => {
    if (!resp) return [];
    if (Array.isArray(resp)) return resp;
    if (Array.isArray(resp.data)) return resp.data;
    if (Array.isArray(resp.history)) return resp.history;
    if (Array.isArray(resp.payouts)) return resp.payouts;
    if (resp.data && typeof resp.data === "object") {
      for (const key of Object.keys(resp.data)) {
        if (Array.isArray(resp.data[key])) return resp.data[key];
      }
    }
    return [];
  };

  const roiUsersList = extractRoiUsers(rawResponse);
  const roiHistoryList = extractRoiHistory(allRoiResponse);

  // Filter today's list by search query
  const filteredUsers = roiUsersList.filter((item) => {
    const query = searchQuery.toLowerCase();
    const name = (item.name || item.userName || item.user?.name || "").toLowerCase();
    const email = (item.email || item.userEmail || item.user?.email || "").toLowerCase();
    const userId = (item.userId || item.customId || item.userCustomId || item.user?.userId || "").toString().toLowerCase();
    const dbId = (item._id || item.id || item.user?._id || "").toString().toLowerCase();
    return name.includes(query) || email.includes(query) || userId.includes(query) || dbId.includes(query);
  });

  // Filter history list by search query
  const filteredHistory = roiHistoryList.filter((item) => {
    const query = historySearchQuery.toLowerCase();
    const name = (item.name || item.userId?.name || "").toLowerCase();
    const email = (item.email || item.userId?.email || "").toLowerCase();
    const userIdVal = (typeof item.userId === "object" ? item.userId?.userId : item.userId || "").toString().toLowerCase();
    const invId = (typeof item.investmentId === "object" ? item.investmentId?._id : item.investmentId || "").toString().toLowerCase();
    const dbId = (item._id || "").toString().toLowerCase();
    const currency = (item.currency || "").toLowerCase();
    const amount = parsePayoutAmount(item.payoutAmount).toString();

    return (
      name.includes(query) ||
      email.includes(query) ||
      userIdVal.includes(query) ||
      invId.includes(query) ||
      dbId.includes(query) ||
      currency.includes(query) ||
      amount.includes(query)
    );
  });

  // Calculate today's totals
  const totalBefore = filteredUsers.reduce((sum, u) => {
    const val = Number(u.beforeAmount ?? u.previousBalance ?? u.balanceBefore ?? u.oldBalance ?? u.beforeBalance ?? 0);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const totalAfter = filteredUsers.reduce((sum, u) => {
    const val = Number(u.afterAmount ?? u.newBalance ?? u.balanceAfter ?? u.currentBalance ?? u.afterBalance ?? 0);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const netGain = totalAfter - totalBefore;

  // Calculate history totals
  const totalHistoricalPayout = filteredHistory.reduce((sum, item) => {
    return sum + parsePayoutAmount(item.payoutAmount);
  }, 0);

  const uniqueUsersCount = new Set(
    filteredHistory.map((item) => {
      if (typeof item.userId === "object") {
        return item.userId?._id || item.userId?.userId || item.userId?.email || item.email;
      }
      return item.userId || item.email;
    })
  ).size;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner / Action Header */}
      <div className="relative p-6 overflow-hidden rounded-2xl border border-white/10 glass-panel bg-darkbg-deep/80 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/30 text-gold">
                <TrendingUp size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                  Daily ROI Distribution
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Sparkles size={12} className="mr-1" /> Automated Engine
                  </span>
                </h2>
                <p className="text-xs text-gray-400">
                  Trigger daily ROI calculation for all eligible users and monitor updated balance details.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={getRoi}
              disabled={loading}
              className={`flex items-center px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                loading
                  ? "bg-gold/50 cursor-not-allowed text-black/70"
                  : "bg-gold hover:bg-gold-light text-black shadow-gold/20 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              <RefreshCw size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Calculating ROI..." : "Trigger ROI Now"}
            </button>
          </div>
        </div>

        {lastUpdated && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
            <span>Last Execution: <span className="text-gray-200 font-mono">{lastUpdated}</span></span>
            <span className="text-emerald-400 font-medium">API Endpoint: /api/admin/dashboard/trigger-roi</span>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start space-x-3">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">ROI Trigger Issue</h4>
            <p className="text-xs text-red-300/80 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-white/5 glass-panel bg-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Processed Users</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <User size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{roiUsersList.length}</p>
          <p className="text-[11px] text-gray-500 mt-1">Users calculated today</p>
        </div>

        <div className="p-5 rounded-xl border border-white/5 glass-panel bg-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Before Amount</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            ${totalBefore.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Prior user balance sum</p>
        </div>

        <div className="p-5 rounded-xl border border-white/5 glass-panel bg-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total After Amount</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            ${totalAfter.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-emerald-400/70 mt-1">Updated user balance sum</p>
        </div>

        <div className="p-5 rounded-xl border border-white/5 glass-panel bg-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Today ROI Added</span>
            <div className="p-2 rounded-lg bg-gold/10 text-gold border border-gold/20">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gold mt-2">
            +${netGain > 0 ? netGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
          </p>
          <p className="text-[11px] text-gold/70 mt-1">Distributed ROI difference</p>
        </div>
      </div>

      {/* Main Content Area: Calculated Today's ROI Table */}
      <div className="rounded-2xl border border-white/10 glass-panel bg-darkbg-deep/75 backdrop-blur-md overflow-hidden">
        {/* Toolbar Header */}
        <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-white tracking-wide">
            Today's Calculated ROI ({filteredUsers.length})
          </h3>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search Name, Email, User ID, _id..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
        </div>

        {/* Content Table View */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw size={32} className="mx-auto text-gold animate-spin" />
              <p className="text-sm font-semibold text-gray-300">Calculating Today's ROI...</p>
              <p className="text-xs text-gray-500">Contacting backend API and updating user earnings</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">User Details (Name & Email)</th>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Database _id</th>
                  <th className="px-6 py-4">Before Amount</th>
                  <th className="px-6 py-4">After Amount</th>
                  <th className="px-6 py-4 text-right">ROI Diff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredUsers.map((item, idx) => {
                  const name = item.name || item.userName || item.user?.name || "User";
                  const email = item.email || item.userEmail || item.user?.email || "N/A";
                  const userId = item.userId || item.customId || item.userCustomId || item.user?.userId || "N/A";
                  const dbId = item._id || item.id || item.user?._id || "N/A";

                  const beforeVal = Number(item.beforeAmount ?? item.previousBalance ?? item.balanceBefore ?? item.oldBalance ?? item.beforeBalance ?? 0);
                  const afterVal = Number(item.afterAmount ?? item.newBalance ?? item.balanceAfter ?? item.currentBalance ?? item.afterBalance ?? 0);
                  const diff = afterVal - beforeVal;

                  return (
                    <tr key={dbId !== "N/A" ? dbId : idx} className="hover:bg-white/[0.02] transition-colors">
                      {/* Name & Email */}
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

                      {/* User ID */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold">
                          <Hash size={12} className="mr-1" />
                          {userId}
                        </span>
                      </td>

                      {/* _id */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md border border-white/5 select-all">
                            {dbId}
                          </span>
                          {dbId !== "N/A" && (
                            <button
                              onClick={() => handleCopy(dbId, dbId)}
                              className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                              title="Copy _id"
                            >
                              {copiedId === dbId ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Before Amount */}
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-amber-400">
                          ${beforeVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* After Amount */}
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-emerald-400">
                          ${afterVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* ROI Diff */}
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          <ArrowUpRight size={13} className="mr-0.5" />
                          +${diff > 0 ? diff.toFixed(2) : "0.00"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center space-y-3">
              <Layers size={36} className="mx-auto text-gray-600" />
              <h4 className="text-base font-semibold text-white">No ROI Records Found</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                No user ROI calculation records to display. Click <strong className="text-gold">Trigger ROI Now</strong> to execute daily calculations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ROI History Section */}
      <div className="space-y-6 pt-4 border-t border-white/10">
        {/* Section Title & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <History size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                ROI History
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {roiHistoryList.length} Total Records
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Complete log of all past ROI payouts generated across the system.
              </p>
            </div>
          </div>

          <button
            onClick={getAllRoi}
            disabled={allRoiLoading}
            className="flex items-center px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-all cursor-pointer"
          >
            <RefreshCw size={14} className={`mr-2 ${allRoiLoading ? "animate-spin" : ""}`} />
            Refresh History
          </button>
        </div>

        {/* Error Alert */}
        {allRoiError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start space-x-3">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Failed to Load ROI History</h4>
              <p className="text-xs text-red-300/80 mt-0.5">{allRoiError}</p>
            </div>
          </div>
        )}

        {/* History Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-white/5 glass-panel bg-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Payouts Logged</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <History size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{roiHistoryList.length}</p>
            <p className="text-[11px] text-gray-500 mt-1">Total distribution transactions</p>
          </div>

          <div className="p-5 rounded-xl border border-white/5 glass-panel bg-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Distributed Amount</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <DollarSign size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-2">
              ${totalHistoricalPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </p>
            <p className="text-[11px] text-emerald-400/70 mt-1">Cumulative sum of payouts</p>
          </div>

          <div className="p-5 rounded-xl border border-white/5 glass-panel bg-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Unique Beneficiaries</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <User size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{uniqueUsersCount}</p>
            <p className="text-[11px] text-gray-500 mt-1">Distinct users rewarded</p>
          </div>
        </div>

        {/* History Table Container */}
        <div className="rounded-2xl border border-white/10 glass-panel bg-darkbg-deep/75 backdrop-blur-md overflow-hidden">
          {/* Table Header & Search Toolbar */}
          <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-white tracking-wide">
              ROI Payout Records ({filteredHistory.length})
            </h3>

            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search Name, Email, User ID, Record ID..."
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {allRoiLoading ? (
              <div className="p-12 text-center space-y-3">
                <RefreshCw size={32} className="mx-auto text-purple-400 animate-spin" />
                <p className="text-sm font-semibold text-gray-300">Loading ROI Payout History...</p>
              </div>
            ) : filteredHistory.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Investment ID</th>
                    <th className="px-6 py-4">Payout Amount</th>
                    <th className="px-6 py-4">Payout Date</th>
                    <th className="px-6 py-4">Executed At</th>
                    <th className="px-6 py-4">Record ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredHistory.map((item, idx) => {
                    const name = item.name || item.userId?.name || "User";
                    const email = item.email || item.userId?.email || "N/A";
                    const userIdVal = (typeof item.userId === "object" ? item.userId?.userId : item.userId) || "N/A";
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
                        {/* User Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs uppercase">
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

                        {/* User ID */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold">
                            <Hash size={12} className="mr-1" />
                            {userIdVal}
                          </span>
                        </td>

                        {/* Investment ID */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md border border-white/5 select-all">
                              {invId}
                            </span>
                            {invId !== "N/A" && (
                              <button
                                onClick={() => handleCopy(invId, `inv-${invId}-${idx}`)}
                                className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                                title="Copy Investment ID"
                              >
                                {copiedId === `inv-${invId}-${idx}` ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Payout Amount */}
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <span>${amount.toFixed(4)}</span>
                            <span className="text-[10px] text-emerald-300 font-sans uppercase">{currency}</span>
                          </span>
                        </td>

                        {/* Payout Date */}
                        <td className="px-6 py-4 text-xs text-gray-300 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-purple-400 shrink-0" />
                            {payoutDateFormatted}
                          </div>
                        </td>

                        {/* Executed At */}
                        <td className="px-6 py-4 text-xs text-gray-400">
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Clock size={13} className="text-gray-500 shrink-0" />
                            {executedAtFormatted}
                          </div>
                        </td>

                        {/* Record ID */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md border border-white/5 select-all">
                              {recordId}
                            </span>
                            {recordId !== "N/A" && (
                              <button
                                onClick={() => handleCopy(recordId, recordId)}
                                className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                                title="Copy Record ID"
                              >
                                {copiedId === recordId ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
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
                <h4 className="text-base font-semibold text-white">No ROI History Found</h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  No historical ROI payout records matched your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROI;