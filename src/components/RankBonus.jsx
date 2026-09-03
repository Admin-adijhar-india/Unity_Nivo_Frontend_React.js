import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Award, ShieldCheck, Trophy, Sparkles, UserCheck, Star } from 'lucide-react';

export default function RankBonus() {
  const { users, adjustUserBalance } = useContext(AppContext);
  const [localUsers, setLocalUsers] = useState(users);

  // Manual rank update logic (mock behavior for admin overrides)
  const handleManualPromote = (userId, newRank) => {
    // Determine rank bonus amount based on rank
    let bonus = 0;
    if (newRank === 'Gold') bonus = 49.00;
    else if (newRank === 'Platinum') bonus = 99.00;
    else if (newRank === 'Diamond') bonus = 299.00;

    setLocalUsers(prev => prev.map(u => {
      if (u.id === userId) {
        // Update user properties
        const updatedEarnings = { ...u.earnings, rankBonus: (u.earnings.rankBonus || 0) + bonus };
        const updatedIncome = u.income + bonus;
        const updatedBalance = u.balance + bonus;
        const newTx = {
          id: `TX${Math.floor(100 + Math.random() * 900)}`,
          type: 'earning',
          amount: bonus,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'completed',
          description: `Rank Bonus Reward (Manually Promoted to ${newRank})`
        };

        // Trigger adjust balance updates in context as well
        adjustUserBalance(userId, 'currentRank', newRank);
        adjustUserBalance(userId, 'income', updatedIncome);
        adjustUserBalance(userId, 'balance', updatedBalance);

        // Update local object representation
        return {
          ...u,
          currentRank: newRank,
          income: updatedIncome,
          balance: updatedBalance,
          earnings: updatedEarnings,
          transactions: [newTx, ...u.transactions]
        };
      }
      return u;
    }));
  };

  const rankRules = [
    { rank: 'Active', volume: '$0', direct: '0', reward: 'Join Bonus eligibility', icon: Star, color: 'text-gray-400', border: 'border-white/5 bg-white/5' },
    { rank: 'Gold', volume: '$35,000', direct: '5 Active', reward: '$49.00 One-time Bonus', icon: Award, color: 'text-yellow-400', border: 'border-yellow-500/20 bg-yellow-500/5' },
    { rank: 'Platinum', volume: '$50,000', direct: '8 Active', reward: '$99.00 One-time Bonus', icon: ShieldCheck, color: 'text-indigo-400', border: 'border-indigo-500/20 bg-indigo-500/5' },
    { rank: 'Diamond', volume: '$100,000', direct: '12 Active', reward: '$299.00 One-time Bonus & Pools', icon: Trophy, color: 'text-cyan-400', border: 'border-cyan-500/20 bg-cyan-500/5' }
  ];

  // Helper to determine mock stats
  const getMockBusinessStats = (userId) => {
    switch (userId) {
      case 'UN001': return { volume: 38500, activeReferrals: 6 };
      case 'UN002': return { volume: 55000, activeReferrals: 9 };
      case 'UN003': return { volume: 104000, activeReferrals: 13 };
      case 'UN004': return { volume: 4500, activeReferrals: 1 };
      case 'UN005': return { volume: 0, activeReferrals: 0 };
      default: return { volume: 0, activeReferrals: 0 };
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Rank Definition Cards */}
      <div>
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">Rank Achievement & Qualification Standards</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {rankRules.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <div key={idx} className={`p-4 rounded-xl border flex items-start space-x-3.5 ${rule.border} glass-panel`}>
                <div className={`p-2.5 rounded-lg bg-black/40 ${rule.color}`}>
                  <Icon size={18} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{rule.rank} Rank</h4>
                  <div className="text-[10px] text-gray-400">Team Business: <span className="text-gray-200 font-bold">{rule.volume}</span></div>
                  <div className="text-[10px] text-gray-400">Referrals: <span className="text-gray-200 font-bold">{rule.direct}</span></div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">{rule.reward}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Users Rank Qualification Ledger */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">User Qualifications Ledger</h3>
        <div className="overflow-x-auto rounded-xl border border-white/5 glass-panel">
          <table className="w-full border-collapse text-left text-sm text-gray-300">
            <thead className="bg-black/40 text-[11px] font-bold text-gold uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4 text-center">Current Rank</th>
                <th className="px-6 py-4 text-right">Team Business Volume</th>
                <th className="px-6 py-4 text-center">Active Referrals</th>
                <th className="px-6 py-4">Eligibility Assessment</th>
                <th className="px-6 py-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-white/[0.01]">
              {localUsers.map((user) => {
                const stats = getMockBusinessStats(user.id);
                
                // Determine eligibility
                let eligibleRank = 'Active';
                if (stats.volume >= 100000 && stats.activeReferrals >= 12) eligibleRank = 'Diamond';
                else if (stats.volume >= 50000 && stats.activeReferrals >= 8) eligibleRank = 'Platinum';
                else if (stats.volume >= 35000 && stats.activeReferrals >= 5) eligibleRank = 'Gold';

                const needsPromotion = eligibleRank !== user.currentRank;

                return (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-200 block">{user.name}</span>
                      <span className="text-[10px] text-gray-500">ID: {user.id} • Joined: {user.joinedDate}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-gold/10 border border-gold/30 text-gold uppercase">
                        {user.currentRank}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-white">
                      ${stats.volume.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-200">
                      {stats.activeReferrals}
                    </td>
                    <td className="px-6 py-4">
                      {needsPromotion ? (
                        <span className="text-xs font-bold text-amber-400 flex items-center">
                          <Sparkles size={12} className="mr-1.5 animate-pulse" />
                          Eligible for {eligibleRank} promotion!
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 font-semibold flex items-center">
                          <UserCheck size={12} className="mr-1.5 text-emerald-400" />
                          Fully Qualified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {needsPromotion ? (
                        <button
                          onClick={() => handleManualPromote(user.id, eligibleRank)}
                          className="px-3 py-1 bg-gold text-darkbg hover:bg-gold-light text-xs font-extrabold rounded-lg shadow shadow-gold/20 transition-colors"
                        >
                          Promote to {eligibleRank}
                        </button>
                      ) : (
                        <div className="flex justify-end space-x-1.5">
                          {user.currentRank !== 'Diamond' && (
                            <button
                              onClick={() => {
                                const ranks = ['Active', 'Gold', 'Platinum', 'Diamond'];
                                const currIdx = ranks.indexOf(user.currentRank);
                                const nextRank = ranks[currIdx + 1];
                                handleManualPromote(user.id, nextRank);
                              }}
                              className="px-2 py-0.5 border border-white/10 hover:border-gold/30 hover:text-white rounded text-[10px] text-gray-500 transition-colors"
                            >
                              Force Override
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
