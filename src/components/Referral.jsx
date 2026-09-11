
import React, { useContext, useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Users,
  UserPlus,
  Share2,
  MessageCircle,
  Send,
//   Facebook,
  ExternalLink,
  Link as LinkIcon,
  DollarSign,
  RefreshCw
} from 'lucide-react';

import { AppContext } from '../context/AppContext';

export default function Referral() {
  const { currentUser } = useContext(AppContext);

  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReferralStats = async () => {
    const token = localStorage.getItem("unity_nivo_token");
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://unity-nivo-backend-nodejs.onrender.com';
      const res = await fetch(`${BASE_URL}/api/referral/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      console.log("REFERRAL STATS DATA:", json);

      if (res.ok) {
        const statsData = json?.data || json?.stats || json;
        setStats(statsData);
      } else {
        setError(json?.message || "Failed to fetch referral stats");
      }
    } catch (err) {
      console.error("Referral stats fetch error:", err);
      setError("Unable to load referral stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralStats();
  }, []);

  /*
   * Backend se referralCode / userId jo available ho
   * usko use karenge.
   *
   * Expected:
   * currentUser.userId = "UN10001"
   * OR
   * currentUser.referralCode = "UN10001"
   */

  const referralCode =
    stats?.referralCode ||
    currentUser?.referralCode ||
    currentUser?.userId ||
    currentUser?.userid ||
    currentUser?.user_id ||
    currentUser?.referrerCode ||
    currentUser?.id ||
    '';

  const referralLink = referralCode
    ? `${window.location.origin}/register?ref=${encodeURIComponent(
        referralCode
      )}`
    : '';

  const copyReferralLink = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Copy referral link error:', error);
    }
  };

  const shareWhatsApp = () => {
    if (!referralLink) return;

    const text = `Join me on Unity Nivo using my referral link:\n${referralLink}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const shareTelegram = () => {
    if (!referralLink) return;

    const text = 'Join me on Unity Nivo';

    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(
        referralLink
      )}&text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const shareFacebook = () => {
    if (!referralLink) return;

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        referralLink
      )}`,
      '_blank'
    );
  };

  const shareNative = async () => {
    if (!referralLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Unity Nivo',
          text: 'Join Unity Nivo using my referral link',
          url: referralLink
        });
      } catch (error) {
        if (error?.name !== 'AbortError') {
          console.error('Share error:', error);
        }
      }
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Referral
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Share your referral link and grow your network.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReferralStats}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-bold text-gold transition hover:bg-gold/20 disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          {loading ? "Refreshing..." : "Refresh Stats"}
        </button>
      </div>

      {/* Main Referral Card */}
     <div
  className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 via-white/[0.03] to-transparent p-6 shadow-xl"
>
  <div
    className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gold/10 blur-3xl"
  />

  <div className="relative">


          <div className="flex items-center gap-3 mb-6">
            <div className="
              flex items-center justify-center
              w-12 h-12
              rounded-xl
              bg-gold/10
              border border-gold/20
              text-gold
            ">
              <Share2 size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Your Referral Link
              </h2>

              <p className="text-xs text-gray-400">
                Share this link with your friends
              </p>
            </div>
          </div>

          {/* User ID */}
          <div className="mb-5">

            <label className="block mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              My User ID / Referral Code
            </label>

            <div className="
              flex items-center
              px-4 py-3
              rounded-xl
              bg-black/30
              border border-white/10
            ">
              <span className="font-bold text-gold">
                {referralCode || 'Not available'}
              </span>
            </div>

          </div>

          {/* Referral Link */}
          <div>

            <label className="block mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Personal Referral Link
            </label>

            <div className="
              flex flex-col sm:flex-row
              gap-2
            ">

              <div className="
                flex items-center flex-1
                min-w-0
                px-4 py-3
                rounded-xl
                bg-black/30
                border border-white/10
              ">

                <LinkIcon
                  size={16}
                  className="mr-3 text-gray-500 flex-shrink-0"
                />

                <span className="
                  text-sm
                  text-gray-300
                  truncate
                ">
                  {referralLink || 'Referral link unavailable'}
                </span>

              </div>

              <button
                onClick={copyReferralLink}
                disabled={!referralLink}
                className="
                  flex items-center justify-center
                  gap-2
                  px-5 py-3
                  rounded-xl
                  bg-gold
                  hover:bg-gold-light
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  text-black
                  font-bold
                  text-sm
                  transition-all
                "
              >
                {copied ? (
                  <>
                    <Check size={17} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={17} />
                    Copy Link
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Social Share */}
          <div className="mt-6">

            <p className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Share With
            </p>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={shareWhatsApp}
                disabled={!referralLink}
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  rounded-xl
                  bg-green-500/10
                  border border-green-500/20
                  text-green-400
                  hover:bg-green-500/20
                  disabled:opacity-40
                  transition
                "
              >
                <MessageCircle size={17} />
                WhatsApp
              </button>

              <button
                onClick={shareTelegram}
                disabled={!referralLink}
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  rounded-xl
                  bg-sky-500/10
                  border border-sky-500/20
                  text-sky-400
                  hover:bg-sky-500/20
                  disabled:opacity-40
                  transition
                "
              >
                <Send size={17} />
                Telegram
              </button>

              <button
                onClick={shareFacebook}
                disabled={!referralLink}
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  rounded-xl
                  bg-blue-500/10
                  border border-blue-500/20
                  text-blue-400
                  hover:bg-blue-500/20
                  disabled:opacity-40
                  transition
                "
              >
                {/* <Facebook size={17} /> */}
                Facebook
              </button>

              <button
                onClick={shareNative}
                disabled={!referralLink}
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  rounded-xl
                  bg-white/5
                  border border-white/10
                  text-gray-300
                  hover:bg-white/10
                  disabled:opacity-40
                  transition
                "
              >
                <ExternalLink size={17} />
                More
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* Referral Stats */}
      {(() => {
        const totalReferrals =
          stats?.directReferralCount ??
          stats?.totalReferrals ??
          stats?.totalReferred ??
          stats?.referredUsersCount ??
          stats?.count ??
          stats?.totalReferredUsers ??
          stats?.totalCount ??
          stats?.downline?.length ??
          currentUser?.referralsCount ??
          0;

        const activeReferrals =
          stats?.activeReferrals ??
          stats?.activeCount ??
          stats?.activeReferred ??
          stats?.activeReferralsCount ??
          (Array.isArray(stats?.downline)
            ? stats.downline.filter((u) => (u?.status || '').toLowerCase() === 'active').length
            : 0);

        const referredUserDeposits =
          stats?.totalDownlineInvestment ??
          stats?.totalReferredDeposits ??
          stats?.referredUserDeposits ??
          stats?.totalDepositAmount ??
          stats?.referredDeposits ??
          stats?.totalDeposits ??
          stats?.depositTotal ??
          stats?.totalAmount ??
          0;

        const referralIncome =
          stats?.totalReferralEarned ??
          stats?.referralIncome ??
          stats?.income ??
          stats?.earned ??
          currentUser?.earnings?.referralIncome ??
          0;

        const referredUsersList = Array.isArray(stats?.downline)
          ? stats.downline
          : Array.isArray(stats?.referredUsers)
          ? stats.referredUsers
          : Array.isArray(stats?.users)
          ? stats.users
          : Array.isArray(stats?.referrals)
          ? stats.referrals
          : [];

        return (
          <div className="space-y-6">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Referrals Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                      Total Referrals
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {loading ? '...' : totalReferrals}
                    </p>
                  </div>
                  <Users className="text-gold" size={24} />
                </div>
              </div>

              {/* Active Referrals Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                      Active Referrals
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {loading ? '...' : activeReferrals}
                    </p>
                  </div>
                  <UserPlus className="text-emerald-400" size={24} />
                </div>
              </div>

              {/* Referred Users Deposits Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                      Referred Deposits
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-400">
                      {loading ? '...' : `$${Number(referredUserDeposits).toFixed(2)}`}
                    </p>
                  </div>
                  <DollarSign className="text-emerald-400" size={24} />
                </div>
              </div>

              {/* Referral Income Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                      Referral Income
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gold">
                      {loading ? '...' : `$${Number(referralIncome).toFixed(2)}`}
                    </p>
                  </div>
                  <Share2 className="text-gold" size={24} />
                </div>
              </div>
            </div>

            {/* Referred Users List Table (if provided in API response) */}
            {referredUsersList.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-base font-bold text-white mb-4">
                  Downline / Referred Users ({referredUsersList.length})
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-black/30 text-[11px] font-bold text-gold uppercase border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3">User Info</th>
                        <th className="px-4 py-3">User ID / Code</th>
                        <th className="px-4 py-3 text-right">Investment</th>
                        <th className="px-4 py-3 text-right">Commission</th>
                        <th className="px-4 py-3 text-center">Joined Date</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {referredUsersList.map((user, idx) => {
                        const statusStr = (user.status || 'inactive').toLowerCase();
                        const isActive = statusStr === 'active';
                        const joinedDateStr = user.joinedAt || user.createdAt;
                        const formattedDate = joinedDateStr
                          ? new Date(joinedDateStr).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'N/A';

                        return (
                          <tr key={user._id || user.userId || idx} className="hover:bg-white/5 transition">
                            <td className="px-4 py-3 font-semibold text-white">
                              <div>{user.name || user.userName || 'N/A'}</div>
                              {user.email && (
                                <div className="text-[10px] text-gray-400 font-normal">{user.email}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 font-mono text-gray-400">
                              <div>{user.userId || 'N/A'}</div>
                              {user.referralCode && (
                                <div className="text-[10px] text-gold">{user.referralCode}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-emerald-400">
                              ${Number(user.investmentAmount ?? user.totalDeposit ?? user.depositAmount ?? 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-gold">
                              ${Number(user.commissionEarned ?? 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-400">
                              {formattedDate}
                            </td>
                            <td className="px-4 py-3 text-center capitalize">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isActive
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-red-950/50 text-red-400 border border-red-500/20'
                              }`}>
                                {user.status || 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })()}

    </div>  
  );
}
