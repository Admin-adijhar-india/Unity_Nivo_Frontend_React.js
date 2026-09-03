import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Save, Settings as SettingsIcon, ShieldCheck, DollarSign, Wallet, Percent, MessageSquare } from 'lucide-react';

export default function Settings() {
  const { settings, saveSettings } = useContext(AppContext);
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    saveSettings(localSettings);
    setSuccessMsg('System configurations updated successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleWalletToggle = (walletName) => {
    const isSupported = localSettings.supportedWallets.includes(walletName);
    const updatedWallets = isSupported
      ? localSettings.supportedWallets.filter(w => w !== walletName)
      : [...localSettings.supportedWallets, walletName];
    setLocalSettings({ ...localSettings, supportedWallets: updatedWallets });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">System Rule Configuration</h3>
          <p className="text-xs text-gray-500">Adjust transaction boundaries, payment limits, active wallets, and yield percentages</p>
        </div>
        {successMsg && (
          <div className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-bold animate-in fade-in slide-in-from-top-2">
            {successMsg}
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs text-gray-300">
        
        {/* SECTION A: Deposit Rules */}
        <div className="p-5 rounded-2xl border border-white/5 glass-panel space-y-4">
          <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center border-b border-white/5 pb-2">
            <DollarSign size={14} className="mr-1.5" /> Deposit Boundaries
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 font-bold mb-1">Minimum Deposit Amount ($)</label>
              <input
                type="number"
                value={localSettings.minDeposit}
                onChange={(e) => setLocalSettings({ ...localSettings, minDeposit: parseInt(e.target.value) || 0 })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-bold mb-1">Deposit Blockchain Network</label>
              <input
                type="text"
                value={localSettings.depositNetwork}
                onChange={(e) => setLocalSettings({ ...localSettings, depositNetwork: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* SECTION B: Withdrawal Rules */}
        <div className="p-5 rounded-2xl border border-white/5 glass-panel space-y-4">
          <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center border-b border-white/5 pb-2">
            <Wallet size={14} className="mr-1.5" /> Withdrawal Specifications
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 font-bold mb-1">Minimum Payout ($)</label>
              <input
                type="number"
                value={localSettings.minWithdrawal}
                onChange={(e) => setLocalSettings({ ...localSettings, minWithdrawal: parseInt(e.target.value) || 0 })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-bold mb-1">Withdrawal Fee Percentage (%)</label>
              <input
                type="number"
                value={localSettings.withdrawalCharge}
                onChange={(e) => setLocalSettings({ ...localSettings, withdrawalCharge: parseInt(e.target.value) || 0 })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-bold mb-1">Internal Balance Transfers Fee</label>
              <input
                type="text"
                value={localSettings.internalTransfer}
                onChange={(e) => setLocalSettings({ ...localSettings, internalTransfer: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* SECTION C: Supported Cryptographic Wallets */}
        <div className="p-5 rounded-2xl border border-white/5 glass-panel space-y-4">
          <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center border-b border-white/5 pb-2">
            <ShieldCheck size={14} className="mr-1.5" /> Supported Payment Wallets
          </h4>
          <div>
            <label className="block text-gray-400 font-bold mb-2">Enable/Disable accepted Web3 Wallets on Homepage</label>
            <div className="flex space-x-6">
              {['Trust Wallet', 'MetaMask', 'SafePal'].map((wallet) => {
                const isEnabled = localSettings.supportedWallets.includes(wallet);
                return (
                  <label key={wallet} className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleWalletToggle(wallet)}
                      className="w-4 h-4 rounded border-white/10 bg-black/30 text-gold focus:ring-0"
                    />
                    <span className={`font-semibold ${isEnabled ? 'text-white' : 'text-gray-500'}`}>{wallet}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION D: Yield Rules */}
        <div className="p-5 rounded-2xl border border-white/5 glass-panel space-y-4">
          <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center border-b border-white/5 pb-2">
            <Percent size={14} className="mr-1.5" /> Configurable Yield Rules
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 font-bold mb-1">Daily ROI Pool Yield (%)</label>
              <input
                type="number"
                step="0.01"
                value={localSettings.roiPercentage}
                onChange={(e) => setLocalSettings({ ...localSettings, roiPercentage: parseFloat(e.target.value) || 0 })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-bold mb-1">Sponsor Referral Commission (%)</label>
              <input
                type="number"
                value={localSettings.referralPercentage}
                onChange={(e) => setLocalSettings({ ...localSettings, referralPercentage: parseInt(e.target.value) || 0 })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-bold mb-1">Booster Acceleration Node (%)</label>
              <input
                type="number"
                value={localSettings.boosterPercentage}
                onChange={(e) => setLocalSettings({ ...localSettings, boosterPercentage: parseInt(e.target.value) || 0 })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* SECTION E: Support Parameters */}
        <div className="p-5 rounded-2xl border border-white/5 glass-panel space-y-4">
          <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center border-b border-white/5 pb-2">
            <MessageSquare size={14} className="mr-1.5" /> Customer Support Details
          </h4>
          <div>
            <label className="block text-gray-400 font-bold mb-1">Customer Support Availability Tag</label>
            <input
              type="text"
              value={localSettings.customerSupport}
              onChange={(e) => setLocalSettings({ ...localSettings, customerSupport: e.target.value })}
              className="w-full max-w-md bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
            />
          </div>
        </div>

        {/* SECTION F: Render Backend API Settings & Documentation */}
        <div className="p-5 rounded-2xl border border-gold/20 bg-gold/5 space-y-4">
          <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center justify-between border-b border-gold/20 pb-2">
            <span className="flex items-center">
              <SettingsIcon size={14} className="mr-1.5" /> Render Backend API & Swagger Docs
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
              Live Connected
            </span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-400 font-bold mb-1">Render API Server URL</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value="https://unity-nivo-backend-nodejs.onrender.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-gold font-mono font-bold text-xs"
                />
                <a
                  href="https://unity-nivo-backend-nodejs.onrender.com/api/health/test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold flex items-center shrink-0"
                >
                  Test Health
                </a>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-bold mb-1">Swagger API Documentation</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value="https://unity-nivo-backend-nodejs.onrender.com/api-docs/"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-gold font-mono font-bold text-xs"
                />
                <a
                  href="https://unity-nivo-backend-nodejs.onrender.com/api-docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-gold hover:bg-gold-light text-black font-bold rounded-xl flex items-center shrink-0 shadow-md shadow-gold/20"
                >
                  Open Docs
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-gold text-darkbg font-bold hover:bg-gold-light rounded-xl flex items-center shadow-lg shadow-gold/10 hover:shadow-gold/25 transition-all text-xs"
          >
            <Save size={14} className="mr-1.5" /> Save Configuration Settings
          </button>
        </div>

      </form>
    </div>
  );
}
