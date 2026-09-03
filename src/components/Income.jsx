import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, DollarSign, Award, Users, TrendingUp, Filter } from 'lucide-react';

export default function Income() {
  const { users } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  // Dynamically calculate totals across the 6 categories for all users
  const totalJoinBonus = users.reduce((sum, u) => sum + (u.earnings.joinBonus || 0), 0);
  const totalRoi = users.reduce((sum, u) => sum + (u.earnings.roiIncome || 0), 0);
  const totalReferral = users.reduce((sum, u) => sum + (u.earnings.referralIncome || 0), 0);
  const totalBooster = users.reduce((sum, u) => sum + (u.earnings.boosterIncome || 0), 0);
  const totalRank = users.reduce((sum, u) => sum + (u.earnings.rankBonus || 0), 0);
  const totalLeadership = users.reduce((sum, u) => sum + (u.earnings.leadershipBonus || 0), 0);
  const grandTotal = users.reduce((sum, u) => sum + u.income, 0);

  const filteredUsers = users.filter(u => 
    u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const incomeCategories = [
    { name: 'Join Bonus', total: totalJoinBonus, desc: 'Earned upon registration', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'ROI Income (0.5%)', total: totalRoi, desc: '0.5% daily yield pool', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Referral (15%)', total: totalReferral, desc: '15% new sponsor fee', color: 'text-gold', bg: 'bg-gold/10' },
    { name: 'Booster (15%)', total: totalBooster, desc: '15% high-frequency node', color: 'text-pink-400', bg: 'bg-pink-400/10' },
    { name: 'Rank Bonus', total: totalRank, desc: 'One-off achievement reward', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { name: 'Leadership Bonus', total: totalLeadership, desc: 'Monthly tier rewards', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Grand Total Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl border border-white/5 bg-gradient-to-r from-gold/10 via-black/20 to-emerald-500/10 glass-panel">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Grand Total Commission Paid</h3>
          <h2 className="text-3xl font-black tracking-tight text-white">
            ${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </h2>
          <p className="text-xs text-gray-500">Aggregated across all system pools and multi-tier network nodes</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-xs font-semibold">
          <TrendingUp size={14} className="animate-bounce" />
          <span>Active Yield Pools Operating</span>
        </div>
      </div>

      {/* Six Categories Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {incomeCategories.map((cat, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-white/5 glass-panel flex flex-col justify-between">
            <div className="space-y-1">
              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${cat.bg} ${cat.color}`}>
                Cat 0{idx + 1}
              </span>
              <h4 className="text-xs font-bold text-gray-200 mt-1.5">{cat.name}</h4>
              <p className="text-[10px] text-gray-500 leading-snug">{cat.desc}</p>
            </div>
            <div className="mt-4">
              <span className="text-base font-extrabold text-white">
                ${cat.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Details List */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 glass-panel">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search user income profiles by Name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-black/30 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-gold/50 transition-all"
            />
          </div>
          <div className="text-xs text-gray-400 font-semibold flex items-center">
            <Filter size={13} className="mr-1.5 text-gold" /> Search filter active
          </div>
        </div>

        {/* User Income Breakdown Table */}
        <div className="overflow-x-auto rounded-xl border border-white/5 glass-panel">
          <table className="w-full border-collapse text-left text-sm text-gray-300">
            <thead className="bg-black/40 text-[11px] font-bold text-gold uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4 text-center">Join Bonus</th>
                <th className="px-6 py-4 text-center">ROI Yield</th>
                <th className="px-6 py-4 text-center">Referrals</th>
                <th className="px-6 py-4 text-center">Boosters</th>
                <th className="px-6 py-4 text-center">Rank Bonus</th>
                <th className="px-6 py-4 text-center">Leadership</th>
                <th className="px-6 py-4 text-right">Gross Income</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-white/[0.01]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-200 block">{user.name}</span>
                    <span className="text-[10px] text-gray-500">ID: {user.id} • Rank: {user.currentRank}</span>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-400">
                    ${(user.earnings.joinBonus || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-emerald-400">
                    ${(user.earnings.roiIncome || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-gold">
                    ${(user.earnings.referralIncome || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-pink-400">
                    ${(user.earnings.boosterIncome || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-purple-400">
                    ${(user.earnings.rankBonus || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-cyan-400">
                    ${(user.earnings.leadershipBonus || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-extrabold text-white">
                    ${user.income.toFixed(2)}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-500 font-semibold">
                    No matching users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
