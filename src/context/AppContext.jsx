import React, { createContext, useState, useEffect } from 'react';
import api, { API_BASE_URL, API_DOCS_URL } from '../services/api';

export const AppContext = createContext();

// Default values if localStorage is empty
const initialUsers = [
  {
    id: 'UN001',
    name: 'John Smith',
    email: 'john.smith@gmail.com',
    mobile: '+1 (555) 019-2834',
    wallet: '0x71C23D...89aB34',
    sponsor: 'UN000 (Admin)',
    balance: 250.00,
    totalDeposit: 1200.00,
    totalWithdrawal: 600.00,
    income: 850.00,
    currentRank: 'Gold',
    status: 'active',
    joinedDate: '2026-03-12',
    earnings: {
      joinBonus: 1.00,
      roiIncome: 450.00,
      referralIncome: 250.00,
      boosterIncome: 100.00,
      rankBonus: 49.00,
      leadershipBonus: 0.00
    },
    transactions: [
      { id: 'TX901', type: 'deposit', amount: 1000.00, date: '2026-03-12 10:14', status: 'completed', description: 'Initial USDT Deposit' },
      { id: 'TX902', type: 'earning', amount: 1.00, date: '2026-03-12 12:00', status: 'completed', description: 'Social Join Bonus' },
      { id: 'TX903', type: 'earning', amount: 250.00, date: '2026-04-01 18:00', status: 'completed', description: 'Referral Bonus (UN003 Register)' },
      { id: 'TX904', type: 'withdrawal', amount: 600.00, date: '2026-05-15 08:30', status: 'completed', description: 'USDT BEP-20 Withdrawal' }
    ]
  },
  {
    id: 'UN002',
    name: 'Emily Rose',
    email: 'emily.rose@yahoo.com',
    mobile: '+44 20 7946 0958',
    wallet: '0x9a8F12...cd34EF',
    sponsor: 'UN001',
    balance: 1450.00,
    totalDeposit: 3000.00,
    totalWithdrawal: 1500.00,
    income: 2450.00,
    currentRank: 'Platinum',
    status: 'active',
    joinedDate: '2026-01-20',
    earnings: {
      joinBonus: 1.00,
      roiIncome: 1200.00,
      referralIncome: 800.00,
      boosterIncome: 350.00,
      rankBonus: 99.00,
      leadershipBonus: 0.00
    },
    transactions: [
      { id: 'TX905', type: 'deposit', amount: 3000.00, date: '2026-01-20 14:22', status: 'completed', description: 'USDT BEP-20 Deposit' },
      { id: 'TX906', type: 'earning', amount: 1.00, date: '2026-01-20 15:00', status: 'completed', description: 'Social Join Bonus' },
      { id: 'TX907', type: 'withdrawal', amount: 1500.00, date: '2026-06-10 11:15', status: 'completed', description: 'USDT Withdrawal (Success)' }
    ]
  },
  {
    id: 'UN003',
    name: 'Michael Lee',
    email: 'm.lee@techcorp.com',
    mobile: '+852 9012 3456',
    wallet: '0x3cBA56...12eF78',
    sponsor: 'UN001',
    balance: 85.00,
    totalDeposit: 500.00,
    totalWithdrawal: 0.00,
    income: 85.00,
    currentRank: 'Diamond',
    status: 'active',
    joinedDate: '2026-04-01',
    earnings: {
      joinBonus: 1.00,
      roiIncome: 64.00,
      referralIncome: 20.00,
      boosterIncome: 0.00,
      rankBonus: 0.00,
      leadershipBonus: 0.00
    },
    transactions: [
      { id: 'TX908', type: 'deposit', amount: 500.00, date: '2026-04-01 17:45', status: 'completed', description: 'USDT BEP-20 Deposit' },
      { id: 'TX909', type: 'earning', amount: 1.00, date: '2026-04-01 19:00', status: 'completed', description: 'Social Join Bonus' }
    ]
  },
  {
    id: 'UN004',
    name: 'Sophia Martinez',
    email: 'sophia.m@outlook.com',
    mobile: '+34 612 345 678',
    wallet: '0xF89a45...78Cd12',
    sponsor: 'UN002',
    balance: 0.00,
    totalDeposit: 150.00,
    totalWithdrawal: 50.00,
    income: 50.00,
    currentRank: 'Active',
    status: 'blocked',
    joinedDate: '2026-06-15',
    earnings: {
      joinBonus: 1.00,
      roiIncome: 49.00,
      referralIncome: 0.00,
      boosterIncome: 0.00,
      rankBonus: 0.00,
      leadershipBonus: 0.00
    },
    transactions: [
      { id: 'TX910', type: 'deposit', amount: 150.00, date: '2026-06-15 09:12', status: 'completed', description: 'USDT BEP-20 Deposit' },
      { id: 'TX911', type: 'withdrawal', amount: 50.00, date: '2026-07-02 16:30', status: 'completed', description: 'USDT Withdrawal' }
    ]
  },
  {
    id: 'UN005',
    name: 'David Kim',
    email: 'david.kim@gmail.com',
    mobile: '+82 10-1234-5678',
    wallet: '0x56EF34...ab90CD',
    sponsor: 'UN003',
    balance: 45.00,
    totalDeposit: 50.00,
    totalWithdrawal: 0.00,
    income: 45.00,
    currentRank: 'Active',
    status: 'active',
    joinedDate: '2026-08-01',
    earnings: {
      joinBonus: 1.00,
      roiIncome: 44.00,
      referralIncome: 0.00,
      boosterIncome: 0.00,
      rankBonus: 0.00,
      leadershipBonus: 0.00
    },
    transactions: [
      { id: 'TX912', type: 'deposit', amount: 50.00, date: '2026-08-01 11:00', status: 'completed', description: 'USDT BEP-20 Deposit' }
    ]
  }
];

const initialDeposits = [
  { id: 'DEP101', userId: 'UN001', userName: 'John Smith', amount: 1000.00, network: 'BEP-20 USDT', walletAddress: '0x71C23D...89aB34', txHash: '0x3a2f90...bc9942', dateTime: '2026-03-12 10:14', status: 'confirmed' },
  { id: 'DEP102', userId: 'UN002', userName: 'Emily Rose', amount: 3000.00, network: 'BEP-20 USDT', walletAddress: '0x9a8F12...cd34EF', txHash: '0xbf940a...940af1', dateTime: '2026-01-20 14:22', status: 'confirmed' },
  { id: 'DEP103', userId: 'UN003', userName: 'Michael Lee', amount: 500.00, network: 'BEP-20 USDT', walletAddress: '0x3cBA56...12eF78', txHash: '0x2a9f4c...3404bb', dateTime: '2026-04-01 17:45', status: 'confirmed' },
  { id: 'DEP104', userId: 'UN004', userName: 'Sophia Martinez', amount: 150.00, network: 'BEP-20 USDT', walletAddress: '0xF89a45...78Cd12', txHash: '0xcdaef2...89a4ff', dateTime: '2026-06-15 09:12', status: 'confirmed' },
  { id: 'DEP105', userId: 'UN005', userName: 'David Kim', amount: 50.00, network: 'BEP-20 USDT', walletAddress: '0x56EF34...ab90CD', txHash: '0x90afeb...cb4421', dateTime: '2026-08-01 11:00', status: 'confirmed' },
  { id: 'DEP106', userId: 'UN001', userName: 'John Smith', amount: 200.00, network: 'BEP-20 USDT', walletAddress: '0x71C23D...89aB34', txHash: '0x40bc98...de1234', dateTime: '2026-08-24 10:30', status: 'pending' },
  { id: 'DEP107', userId: 'UN003', userName: 'Michael Lee', amount: 25.00, network: 'BEP-20 USDT', walletAddress: '0x3cBA56...12eF78', txHash: '0x8849aa...492aa1', dateTime: '2026-08-24 12:00', status: 'failed' } // Under minimum $30 deposit rule
];

const initialWithdrawals = [
  { id: 'WD201', userId: 'UN001', userName: 'John Smith', amount: 631.58, charge: 31.58, netAmount: 600.00, wallet: '0x71C23D...89aB34', requestTime: '2026-05-15 07:00', processedTime: '2026-05-15 08:30', txHash: '0xefba90...ca4201', status: 'completed' },
  { id: 'WD202', userId: 'UN002', userName: 'Emily Rose', amount: 1578.95, charge: 78.95, netAmount: 1500.00, wallet: '0x9a8F12...cd34EF', requestTime: '2026-06-10 09:30', processedTime: '2026-06-10 11:15', txHash: '0x89a4eb...efba09', status: 'completed' },
  { id: 'WD203', userId: 'UN004', userName: 'Sophia Martinez', amount: 52.63, charge: 2.63, netAmount: 50.00, wallet: '0xF89a45...78Cd12', requestTime: '2026-07-02 14:00', processedTime: '2026-07-02 16:30', txHash: '0x4490ae...33b91a', status: 'completed' },
  { id: 'WD204', userId: 'UN001', userName: 'John Smith', amount: 105.26, charge: 5.26, netAmount: 100.00, wallet: '0x71C23D...89aB34', requestTime: '2026-08-24 15:10', processedTime: '', txHash: '', status: 'pending' },
  { id: 'WD205', userId: 'UN002', userName: 'Emily Rose', amount: 210.53, charge: 10.53, netAmount: 200.00, wallet: '0x9a8F12...cd34EF', requestTime: '2026-08-24 16:00', processedTime: '', txHash: '', status: 'held' }
];

const initialWithdrawalLogs = [
  { id: 'LOG001', withdrawalId: 'WD201', action: 'Approve & Complete', admin: 'Admin', timestamp: '2026-05-15 08:30', details: 'Approved WD201 of $631.58. Tx Hash: 0xefba90...ca4201 saved.' },
  { id: 'LOG002', withdrawalId: 'WD202', action: 'Approve & Complete', admin: 'Admin', timestamp: '2026-06-10 11:15', details: 'Approved WD202 of $1578.95. Tx Hash: 0x89a4eb...efba09 saved.' },
  { id: 'LOG003', withdrawalId: 'WD203', action: 'Approve & Complete', admin: 'Admin', timestamp: '2026-07-02 16:30', details: 'Approved WD203 of $52.63. Tx Hash: 0x4490ae...33b91a saved.' },
  { id: 'LOG004', withdrawalId: 'WD205', action: 'Hold', admin: 'Admin', timestamp: '2026-08-24 16:05', details: 'Placed withdrawal WD205 on hold pending account verification.' }
];

const initialWebsiteContent = {
  carousel: [
    { id: 1, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800', title: 'DREAM BIG TRAVEL MORE', text: 'ACHIEVE YOUR GOALS WITH UNITY NIVO. Build your network, participate in programs and track your activities.', buttonText: 'JOIN NOW', activePeriod: '2026-08-01 to 2026-12-31' },
    { id: 2, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800', title: 'GROW YOUR WEALTH TOGETHER', text: 'Experience transparent trading pools, automatic compounding and real-time dashboard analytics.', buttonText: 'EXPLORE PLANS', activePeriod: '2026-08-15 to 2026-10-15' }
  ],
  topAchievers: [
    { id: 1, name: 'John Smith', rank: 'GOLD', displayInfo: 'Business $35,000', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' },
    { id: 2, name: 'Emily Rose', rank: 'PLATINUM', displayInfo: 'Business $50,000', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
    { id: 3, name: 'Michael Lee', rank: 'DIAMOND', displayInfo: 'Business $100,000', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300' },
    { id: 4, name: 'Sophia Martinez', rank: 'CROWN', displayInfo: 'Business $250,000', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300' },
    { id: 5, name: 'David Kim', rank: 'AMBASSADOR', displayInfo: 'Business $500,000', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
    { id: 6, name: 'Sarah Jenkins', rank: 'ROYAL CROWN', displayInfo: 'Business $1,000,000', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' }
  ],
  aboutUs: 'Unity Nivo is a global platform designed to bring people together, create opportunities and help you achieve financial growth through our proven programs.',
  services: 'We offer ROI pool investments, booster multi-tier network bonuses, support for BEP-20 USDT deposits, safe automatic cold-wallet withdrawals, and rank achievements system.',
  contact: {
    phone: '9288021327',
    email: 'supportunitynivo@gmail.com',
    address: 'Unity nivo, 302 A-WING, VIVEK TOWER, GONDHAL circle,JAMNAGAR 361005 Gujarat, India'
  }
};

const initialTickets = [
  {
    id: 'TCK401',
    userId: 'UN001',
    userName: 'John Smith',
    subject: 'Deposit delay on DEP106',
    status: 'open',
    createdTime: '2026-08-24 10:45',
    messages: [
      { sender: 'user', text: 'Hello, I submitted a deposit for $200 (DEP106) but it is still pending on my screen. Please check.', timestamp: '2026-08-24 10:45' }
    ]
  },
  {
    id: 'TCK402',
    userId: 'UN004',
    userName: 'Sophia Martinez',
    subject: 'Account Blocked Query',
    status: 'pending',
    createdTime: '2026-08-23 15:30',
    messages: [
      { sender: 'user', text: 'My account shows status: BLOCKED. Why was my account blocked? I want to withdraw my balance.', timestamp: '2026-08-23 15:30' },
      { sender: 'admin', text: 'Hello Sophia, your account was flagged for multiple sponsor links violation. Our security team is reviewing it.', timestamp: '2026-08-23 17:00' },
      { sender: 'user', text: 'Okay, how long does the review take?', timestamp: '2026-08-24 09:00' }
    ]
  },
  {
    id: 'TCK403',
    userId: 'UN002',
    userName: 'Emily Rose',
    subject: 'Wallet Address Change Request',
    status: 'resolved',
    createdTime: '2026-08-20 11:00',
    messages: [
      { sender: 'user', text: 'I lost my Trust Wallet keys, I want to update my wallet to 0x9a8F12...cd34EF. Can you change it?', timestamp: '2026-08-20 11:00' },
      { sender: 'admin', text: 'Hello Emily. I have updated your wallet address to the requested one in your user profile.', timestamp: '2026-08-20 14:10' },
      { sender: 'user', text: 'Thank you! It works fine now.', timestamp: '2026-08-20 15:00' }
    ]
  }
];

const initialSettings = {
  minDeposit: 30,
  depositNetwork: 'BEP-20 USDT only',
  minWithdrawal: 15,
  withdrawalCharge: 5,
  internalTransfer: 'Free',
  supportedWallets: ['Trust Wallet', 'MetaMask', 'SafePal'],
  customerSupport: '24/7 Support',
  roiPercentage: 0.5,
  referralPercentage: 15,
  boosterPercentage: 15
};

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('un_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [deposits, setDeposits] = useState(() => {
    const saved = localStorage.getItem('un_deposits');
    return saved ? JSON.parse(saved) : initialDeposits;
  });

  const [withdrawals, setWithdrawals] = useState(() => {
    const saved = localStorage.getItem('un_withdrawals');
    return saved ? JSON.parse(saved) : initialWithdrawals;
  });

  const [withdrawalLogs, setWithdrawalLogs] = useState(() => {
    const saved = localStorage.getItem('un_withdrawal_logs');
    return saved ? JSON.parse(saved) : initialWithdrawalLogs;
  });

  const [websiteContent, setWebsiteContent] = useState(() => {
    const saved = localStorage.getItem('un_website_content');
    return saved ? JSON.parse(saved) : initialWebsiteContent;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('un_tickets');
    return saved ? JSON.parse(saved) : initialTickets;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('un_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('un_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const saved = localStorage.getItem('un_is_admin');
    return saved === 'true';
  });

  const [backendStatus, setBackendStatus] = useState('checking');

  // Check Render Backend API Health on initial load
  const checkBackendHealth = async () => {
    setBackendStatus('checking');
    try {
      const res = await api.checkHealth();
      if (res.success) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('disconnected');
      }
    } catch {
      setBackendStatus('disconnected');
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  // Save updates to localStorage
  useEffect(() => { localStorage.setItem('un_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('un_deposits', JSON.stringify(deposits)); }, [deposits]);
  useEffect(() => { localStorage.setItem('un_withdrawals', JSON.stringify(withdrawals)); }, [withdrawals]);
  useEffect(() => { localStorage.setItem('un_withdrawal_logs', JSON.stringify(withdrawalLogs)); }, [withdrawalLogs]);
  useEffect(() => { localStorage.setItem('un_website_content', JSON.stringify(websiteContent)); }, [websiteContent]);
  useEffect(() => { localStorage.setItem('un_tickets', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem('un_settings', JSON.stringify(settings)); }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('un_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('un_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('un_is_admin', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  // ACTION METHODS

  // Toggle user active/blocked status
  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'blocked' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Modify user balances manually in Admin Panel
  const adjustUserBalance = (userId, field, newAmount) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, [field]: parseFloat(newAmount) || 0 };
      }
      return u;
    }));
  };

  // Approve a deposit
  const confirmDeposit = (depositId) => {
    const dep = deposits.find(d => d.id === depositId);
    if (!dep || dep.status !== 'pending') return;

    // Update deposit status
    setDeposits(prev => prev.map(d => d.id === depositId ? { ...d, status: 'confirmed' } : d));

    // Update user stats
    setUsers(prev => prev.map(u => {
      if (u.id === dep.userId) {
        const amt = parseFloat(dep.amount);
        const updatedBalance = u.balance + amt;
        const updatedTotalDeposit = u.totalDeposit + amt;
        const newTx = {
          id: `TX${Math.floor(100 + Math.random() * 900)}`,
          type: 'deposit',
          amount: amt,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'completed',
          description: `USDT Deposit ($${amt} confirmed)`
        };
        return {
          ...u,
          balance: updatedBalance,
          totalDeposit: updatedTotalDeposit,
          transactions: [newTx, ...u.transactions]
        };
      }
      return u;
    }));
  };

  // Fail a deposit
  const failDeposit = (depositId) => {
    setDeposits(prev => prev.map(d => d.id === depositId ? { ...d, status: 'failed' } : d));
  };

  // Approve/Hold/Reject Withdrawal
  const updateWithdrawalStatus = (withdrawalId, newStatus, reason = '') => {
    const wd = withdrawals.find(w => w.id === withdrawalId);
    if (!wd) return;

    setWithdrawals(prev => prev.map(w => w.id === withdrawalId ? { ...w, status: newStatus } : w));

    // Log the admin action
    const newLog = {
      id: `LOG${Math.floor(100 + Math.random() * 900)}`,
      withdrawalId,
      action: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
      admin: 'Admin',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: `Admin changed withdrawal ${withdrawalId} status to ${newStatus}. ${reason}`
    };
    setWithdrawalLogs(prev => [newLog, ...prev]);

    // If rejected, refund the user
    if (newStatus === 'rejected') {
      setUsers(prev => prev.map(u => {
        if (u.id === wd.userId) {
          const amt = parseFloat(wd.amount); // refund full requested amount
          const updatedBalance = u.balance + amt;
          const newTx = {
            id: `TX${Math.floor(100 + Math.random() * 900)}`,
            type: 'earning',
            amount: amt,
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: 'completed',
            description: `Withdrawal Refund (${withdrawalId} rejected)`
          };
          return {
            ...u,
            balance: updatedBalance,
            transactions: [newTx, ...u.transactions]
          };
        }
        return u;
      }));
    }
  };

  // Complete withdrawal with Tx Hash
  const completeWithdrawal = (withdrawalId, txHash) => {
    const wd = withdrawals.find(w => w.id === withdrawalId);
    if (!wd) return;

    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setWithdrawals(prev => prev.map(w => {
      if (w.id === withdrawalId) {
        return {
          ...w,
          status: 'completed',
          txHash: txHash,
          processedTime: timeStr
        };
      }
      return w;
    }));

    // Update user's totals
    setUsers(prev => prev.map(u => {
      if (u.id === wd.userId) {
        const netAmt = parseFloat(wd.netAmount);
        const grossAmt = parseFloat(wd.amount);
        const updatedTotalWithdrawal = u.totalWithdrawal + netAmt;
        // User balance was already debited when request was made, but let's deduct if balance matches gross amount
        // Wait, standard system: request debits balance immediately. So we don't deduct again here, unless it was pending.
        // Let's check if the last transaction was a withdrawal. We add a transaction entry if not already present.
        const existingTx = u.transactions.find(tx => tx.description.includes(withdrawalId));
        let updatedTxs = [...u.transactions];
        if (!existingTx) {
          const newTx = {
            id: `TX${Math.floor(100 + Math.random() * 900)}`,
            type: 'withdrawal',
            amount: netAmt,
            date: timeStr,
            status: 'completed',
            description: `USDT Withdrawal Completed (${withdrawalId})`
          };
          updatedTxs = [newTx, ...updatedTxs];
        } else {
          updatedTxs = u.transactions.map(tx => {
            if (tx.description.includes(withdrawalId)) {
              return { ...tx, status: 'completed', date: timeStr };
            }
            return tx;
          });
        }

        return {
          ...u,
          totalWithdrawal: updatedTotalWithdrawal,
          transactions: updatedTxs
        };
      }
      return u;
    }));

    // Log the admin action
    const newLog = {
      id: `LOG${Math.floor(100 + Math.random() * 900)}`,
      withdrawalId,
      action: 'Complete',
      admin: 'Admin',
      timestamp: timeStr,
      details: `Completed withdrawal ${withdrawalId}. Tx Hash: ${txHash}.`
    };
    setWithdrawalLogs(prev => [newLog, ...prev]);
  };

  // Add new withdrawal request manually (for testing or user emulation)
  const addWithdrawalRequest = (userId, amount) => {
    const user = users.find(u => u.id === userId);
    if (!user || user.balance < amount) return false;

    const charge = (amount * settings.withdrawalCharge) / 100;
    const netAmount = amount - charge;
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newWdId = `WD${Math.floor(200 + Math.random() * 100)}`;

    const newWd = {
      id: newWdId,
      userId,
      userName: user.name,
      amount,
      charge,
      netAmount,
      wallet: user.wallet,
      requestTime: timeStr,
      processedTime: '',
      txHash: '',
      status: 'pending'
    };

    setWithdrawals(prev => [newWd, ...prev]);

    // Deduct user balance and log transaction
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newTx = {
          id: `TX${Math.floor(100 + Math.random() * 900)}`,
          type: 'withdrawal',
          amount: amount,
          date: timeStr,
          status: 'pending',
          description: `USDT Withdrawal Request (${newWdId})`
        };
        return {
          ...u,
          balance: u.balance - amount,
          transactions: [newTx, ...u.transactions]
        };
      }
      return u;
    }));

    return true;
  };

  // Manage Website Carousels
  const saveCarouselItem = (item) => {
    setWebsiteContent(prev => {
      const exists = prev.carousel.some(c => c.id === item.id);
      let newCarousel = [];
      if (exists) {
        newCarousel = prev.carousel.map(c => c.id === item.id ? item : c);
      } else {
        newCarousel = [...prev.carousel, { ...item, id: Date.now() }];
      }
      return { ...prev, carousel: newCarousel };
    });
  };

  const deleteCarouselItem = (id) => {
    setWebsiteContent(prev => ({
      ...prev,
      carousel: prev.carousel.filter(c => c.id !== id)
    }));
  };

  // Manage Website Top Achievers
  const saveTopAchiever = (achiever) => {
    setWebsiteContent(prev => {
      const exists = prev.topAchievers.some(a => a.id === achiever.id);
      let newAchievers = [];
      if (exists) {
        newAchievers = prev.topAchievers.map(a => a.id === achiever.id ? achiever : a);
      } else {
        newAchievers = [...prev.topAchievers, { ...achiever, id: Date.now() }];
      }
      return { ...prev, topAchievers: newAchievers };
    });
  };

  const deleteTopAchiever = (id) => {
    setWebsiteContent(prev => ({
      ...prev,
      topAchievers: prev.topAchievers.filter(a => a.id !== id)
    }));
  };

  // Edit Basic Website Info
  const updateWebsiteInfo = (section, content) => {
    setWebsiteContent(prev => ({
      ...prev,
      [section]: content
    }));
  };

  // Reply to Support Ticket
  const replyToTicket = (ticketId, replyText) => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'pending', // Pending user response after admin replies
          messages: [...t.messages, { sender: 'admin', text: replyText, timestamp: timeStr }]
        };
      }
      return t;
    }));
  };

  // Resolve Ticket
  const resolveTicket = (ticketId) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'resolved' } : t));
  };

  // Update Settings
  const saveSettings = (newSettings) => {
    setSettings(newSettings);
  };

  // // Auth Operations: Connect to Render Backend API
  // const login = async (email, password) => {
  //   // 1. System Administrator check
  //   if (email === 'admin@unitynivo.com' && password === 'adminpassword') {
  //     setIsAdmin(true);
  //     setCurrentUser({ name: 'System Admin', email: 'admin@unitynivo.com', id: 'ADMIN', role: 'admin' });
  //     return { success: true, isAdmin: true, role: 'admin' };
  //   }

  //   // 2. Call Render Backend API: /api/user/auth/login
  //   try {
  //     const res = await api.user.login({ email, password });
  //     if (res.success && res.data) {
  //       const userData = res.data.user || res.data;
  //       const role = userData.role || (email.toLowerCase().includes('admin') ? 'admin' : 'user');
  //       const isAdminUser = role === 'admin';

  //       setIsAdmin(isAdminUser);

  //       // If Admin login and backend returns allUsers, update users list in state
  //       if (isAdminUser && res.data.allUsers && Array.isArray(res.data.allUsers)) {
  //         const formattedAllUsers = res.data.allUsers.map(u => ({
  //           id: u.userId || u.customUserId || u.referralCode || u._id || u.id || `UN${Math.floor(100 + Math.random() * 900)}`,
  //           userId: u.userId || u.id,
  //           name: u.name || 'User',
  //           email: u.email,
  //           mobile: u.mobile || '',
  //           country: u.country || '',
  //           district: u.district || '',
  //           referralCode: u.referralCode || '',
  //           sponsorId: u.sponsorId || null,
  //           role: u.role || 'user',
  //           wallet: u.wallet || '',
  //           balance: u.balance !== undefined ? parseFloat(u.balance) : 0,
  //           totalDeposit: u.totalDeposit !== undefined ? parseFloat(u.totalDeposit) : 0,
  //           totalWithdrawal: u.totalWithdrawal !== undefined ? parseFloat(u.totalWithdrawal) : 0,
  //           income: u.totalIncome !== undefined ? parseFloat(u.totalIncome) : (u.income !== undefined ? parseFloat(u.income) : 0),
  //           totalIncome: u.totalIncome !== undefined ? parseFloat(u.totalIncome) : (u.income !== undefined ? parseFloat(u.income) : 0),
  //           currentRank: u.rank || 'None',
  //           rank: u.rank || 'None',
  //           status: u.status || 'active',
  //           joinedDate: u.createdAt ? u.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
  //           earnings: u.earnings || { joinBonus: 0, roiIncome: 0, referralIncome: 0, boosterIncome: 0, rankBonus: 0, leadershipBonus: 0 },
  //           transactions: u.transactions || []
  //         }));
  //         setUsers(formattedAllUsers);
  //       }

  //       const userObj = {
  //         id: userData.userId || userData.id || userData.customUserId || userData._id || 'UN10004',
  //         userId: userData.userId || userData.id || 'UN10004',
  //         name: userData.name || email.split('@')[0],
  //         email: userData.email || email,
  //         mobile: userData.mobile || '',
  //         country: userData.country || '',
  //         district: userData.district || '',
  //         referralCode: userData.referralCode || '',
  //         sponsorId: userData.sponsorId || null,
  //         role: role,
  //         wallet: userData.wallet || '',
  //         balance: userData.balance !== undefined ? parseFloat(userData.balance) : 0,
  //         totalDeposit: userData.totalDeposit !== undefined ? parseFloat(userData.totalDeposit) : 0,
  //         totalWithdrawal: userData.totalWithdrawal !== undefined ? parseFloat(userData.totalWithdrawal) : 0,
  //         income: userData.totalIncome !== undefined ? parseFloat(userData.totalIncome) : (userData.income !== undefined ? parseFloat(userData.income) : 0),
  //         totalIncome: userData.totalIncome !== undefined ? parseFloat(userData.totalIncome) : (userData.income !== undefined ? parseFloat(userData.income) : 0),
  //         currentRank: userData.rank || 'None',
  //         rank: userData.rank || 'None',
  //         status: userData.status || 'active',
  //         lastLogin: userData.lastLogin,
  //         joinedDate: userData.createdAt ? userData.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
  //         earnings: userData.earnings || { joinBonus: 0, roiIncome: 0, referralIncome: 0, boosterIncome: 0, rankBonus: 0, leadershipBonus: 0 },
  //         transactions: userData.transactions || []
  //       };
  //       setCurrentUser(userObj);
  //       return { success: true, isAdmin: isAdminUser, role, data: res.data };
  //     } else if (res.error) {
  //       return { success: false, error: res.error };
  //     }
  //   } catch (err) {
  //     console.warn('API login call error, attempting local lookup fallback:', err);
  //   }

  //   // 3. Local fallback for mock users when API is offline / free tier sleeping
  //   const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  //   if (user) {
  //     if (user.status === 'blocked') {
  //       return { success: false, error: 'Your account is blocked. Please contact support.' };
  //     }
  //     const isUserAdmin = user.role === 'admin' || user.email === 'admin@unitynivo.com';
  //     setIsAdmin(isUserAdmin);
  //     setCurrentUser(user);
  //     return { success: true, isAdmin: isUserAdmin, role: user.role || 'user' };
  //   }

  //   return { success: false, error: 'Invalid email or password credentials' };
  // };


  // Auth Operations: Connect to Render Backend API
  const login = async (email, password, role = 'user') => {
    try {
      if (!email || !password) {
        return {
          success: false,
          error: 'Email and password are required.'
        };
      }

      const normalizedRole = role === 'admin' ? 'admin' : 'user';

      let res;

      // =========================
      // ADMIN LOGIN
      // =========================
      if (normalizedRole === 'admin') {
        res = await api.admin.login({
          email: email.trim(),
          password
        });

        if (!res.success) {
          return {
            success: false,
            error: res.error || 'Invalid admin credentials.'
          };
        }

        const adminData = res.data?.admin || res.data?.user || res.data || {};

        const adminObj = {
          id:
            adminData.id ||
            adminData._id ||
            'ADMIN',

          userId:
            adminData.userId ||
            adminData.id ||
            adminData._id ||
            'ADMIN',

          name:
            adminData.name ||
            'System Admin',

          email:
            adminData.email ||
            email,

          role: 'admin',

          status:
            adminData.status ||
            'active'
        };

        // Admin login state
        setIsAdmin(true);
        setCurrentUser(adminObj);

        // Save role
        localStorage.setItem('unity_nivo_role', 'admin');

        // Make sure user token doesn't remain active
        localStorage.removeItem('unity_nivo_token');

        // If backend sends all users, update admin panel users
        if (
          res.data?.allUsers &&
          Array.isArray(res.data.allUsers)
        ) {
          const formattedAllUsers = res.data.allUsers.map(u => ({
            id:
              u.userId ||
              u.customUserId ||
              u.referralCode ||
              u._id ||
              u.id ||
              `UN${Math.floor(100 + Math.random() * 900)}`,

            userId:
              u.userId ||
              u.customUserId ||
              u.id ||
              u._id,

            name: u.name || 'User',

            email: u.email || '',

            mobile: u.mobile || '',

            country: u.country || '',

            district: u.district || '',

            referralCode: u.referralCode || '',

            sponsorId: u.sponsorId || null,

            role: u.role || 'user',

            wallet: u.wallet || '',

            balance:
              u.balance !== undefined
                ? parseFloat(u.balance)
                : 0,

            totalDeposit:
              u.totalDeposit !== undefined
                ? parseFloat(u.totalDeposit)
                : 0,

            totalWithdrawal:
              u.totalWithdrawal !== undefined
                ? parseFloat(u.totalWithdrawal)
                : 0,

            income:
              u.totalIncome !== undefined
                ? parseFloat(u.totalIncome)
                : (
                  u.income !== undefined
                    ? parseFloat(u.income)
                    : 0
                ),

            totalIncome:
              u.totalIncome !== undefined
                ? parseFloat(u.totalIncome)
                : (
                  u.income !== undefined
                    ? parseFloat(u.income)
                    : 0
                ),

            currentRank:
              u.rank || 'None',

            rank:
              u.rank || 'None',

            status:
              u.status || 'active',

            joinedDate:
              u.createdAt
                ? u.createdAt.split('T')[0]
                : new Date()
                  .toISOString()
                  .split('T')[0],

            earnings:
              u.earnings || {
                joinBonus: 0,
                roiIncome: 0,
                referralIncome: 0,
                boosterIncome: 0,
                rankBonus: 0,
                leadershipBonus: 0
              },

            transactions:
              u.transactions || []
          }));

          setUsers(formattedAllUsers);
        }

        return {
          success: true,
          isAdmin: true,
          role: 'admin',
          data: res.data,
          user: adminObj
        };
      }

      // =========================
      // USER LOGIN
      // =========================
      res = await api.user.login({
        email: email.trim(),
        password
      });

      if (!res.success) {
        return {
          success: false,
          error: res.error || 'Invalid user credentials.'
        };
      }

      const userData =
        res.data?.user ||
        res.data ||
        {};

      const userRole = userData.role || 'user';

      // Security:
      // Agar user endpoint se admin role aaye,
      // usko admin login nahi maana jayega.
      if (userRole === 'admin') {
        return {
          success: false,
          error: 'Please use Admin Login for administrator access.'
        };
      }

      const userObj = {
        id:
          userData.userId ||
          userData.id ||
          userData.customUserId ||
          userData._id ||
          'UN10004',

        userId:
          userData.userId ||
          userData.id ||
          userData.customUserId ||
          userData._id ||
          'UN10004',

        name:
          userData.name ||
          email.split('@')[0],

        email:
          userData.email ||
          email,

        mobile:
          userData.mobile || '',

        country:
          userData.country || '',

        district:
          userData.district || '',

        referralCode:
          userData.referralCode || '',

        sponsorId:
          userData.sponsorId || null,

        role: 'user',

        wallet:
          userData.wallet || '',

        balance:
          userData.balance !== undefined
            ? parseFloat(userData.balance)
            : 0,

        totalDeposit:
          userData.totalDeposit !== undefined
            ? parseFloat(userData.totalDeposit)
            : 0,

        totalWithdrawal:
          userData.totalWithdrawal !== undefined
            ? parseFloat(userData.totalWithdrawal)
            : 0,

        income:
          userData.totalIncome !== undefined
            ? parseFloat(userData.totalIncome)
            : (
              userData.income !== undefined
                ? parseFloat(userData.income)
                : 0
            ),

        totalIncome:
          userData.totalIncome !== undefined
            ? parseFloat(userData.totalIncome)
            : (
              userData.income !== undefined
                ? parseFloat(userData.income)
                : 0
            ),

        currentRank:
          userData.rank || 'None',

        rank:
          userData.rank || 'None',

        status:
          userData.status || 'active',

        lastLogin:
          userData.lastLogin,

        joinedDate:
          userData.createdAt
            ? userData.createdAt.split('T')[0]
            : new Date()
              .toISOString()
              .split('T')[0],

        earnings:
          userData.earnings || {
            joinBonus: 0,
            roiIncome: 0,
            referralIncome: 0,
            boosterIncome: 0,
            rankBonus: 0,
            leadershipBonus: 0
          },

        transactions:
          userData.transactions || []
      };

      // Check blocked account
      if (userObj.status === 'blocked') {
        return {
          success: false,
          error: 'Your account is blocked. Please contact support.'
        };
      }

      setIsAdmin(false);
      setCurrentUser(userObj);

      // Save role
      localStorage.setItem('unity_nivo_role', 'user');

      // Remove old admin token
      localStorage.removeItem('unity_nivo_admin_token');

      return {
        success: true,
        isAdmin: false,
        role: 'user',
        data: res.data,
        user: userObj
      };

    } catch (err) {
      console.error('Login error:', err);

      return {
        success: false,
        error:
          err?.message ||
          'Unable to connect to login server.'
      };
    }
  };



  // const logout = () => {
  //   setIsAdmin(false);
  //   setCurrentUser(null);
  //   localStorage.removeItem('unity_nivo_token');
  // };


  const logout = () => {
    setIsAdmin(false);
    setCurrentUser(null);

    localStorage.removeItem('unity_nivo_token');
    localStorage.removeItem('unity_nivo_admin_token');
    localStorage.removeItem('unity_nivo_role');
    localStorage.removeItem('un_current_user');
    localStorage.removeItem('un_is_admin');
  };

  const registerUser = async (formData, emailArg, mobileArg, walletArg, sponsorArg, passwordArg, confirmPasswordArg) => {
    let payload = {};
    if (typeof formData === 'object' && formData !== null && !Array.isArray(formData)) {
      payload = { ...formData };
    } else {
      payload = {
        name: formData,
        email: emailArg,
        mobile: mobileArg,
        wallet: walletArg,
        sponsorId: sponsorArg || 'UN001',
        password: passwordArg || '123456',
        confirmPassword: confirmPasswordArg || passwordArg || '123456',
        country: 'India',
        district: 'Central'
      };
    }

    // Ensure all required fields for /api/user/auth/register exist (no wallet at registration)
    const apiBody = {
      name: payload.name || '',
      email: payload.email || '',
      mobile: payload.mobile || '',
      country: payload.country || 'India',
      district: payload.district || 'Central',
      password: payload.password || '',
      confirmPassword: payload.confirmPassword || payload.password || ''
    };
    if (payload.sponsorId && payload.sponsorId.trim()) {
      apiBody.sponsorId = payload.sponsorId.trim();
    }

    // Call Render Backend API: /api/user/auth/register
    const res = await api.user.register(apiBody);

    if (res.success) {
      const registeredData = res.data?.user || res.data || {};
      const nextId = registeredData.id || registeredData.userId || `UN${String(users.length + 1).padStart(3, '0')}`;
      const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

      const newUser = {
        id: nextId,
        name: payload.name,
        email: payload.email,
        mobile: payload.mobile,
        wallet: payload.wallet || '0x71C...89ab',
        sponsor: payload.sponsorId || 'UN001',
        balance: 1.00,
        totalDeposit: 0.00,
        totalWithdrawal: 0.00,
        income: 1.00,
        currentRank: 'Active',
        status: 'active',
        joinedDate: timeStr.split(' ')[0],
        earnings: { joinBonus: 1.00, roiIncome: 0.00, referralIncome: 0.00, boosterIncome: 0.00, rankBonus: 0.00, leadershipBonus: 0.00 },
        transactions: [
          { id: `TX${Math.floor(100 + Math.random() * 900)}`, type: 'earning', amount: 1.00, date: timeStr, status: 'completed', description: 'Social Media Join Bonus' }
        ]
      };

      setUsers(prev => [...prev, newUser]);
      setIsAdmin(false);
      setCurrentUser(newUser);

      return { success: true, user: newUser, data: res.data };
    }

    if (res.error) {
      return { success: false, error: res.error };
    }

    return { success: false, error: 'Registration failed. Please check details.' };
  };

  // User Actions: Request Deposit
  const requestDeposit = (amount, walletAddress, txHash) => {
    if (!currentUser) return;
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newDepId = `DEP${Math.floor(100 + Math.random() * 900)}`;

    const newDep = {
      id: newDepId,
      userId: currentUser.id,
      userName: currentUser.name,
      amount: parseFloat(amount),
      network: 'BEP-20 USDT',
      walletAddress,
      txHash,
      dateTime: timeStr,
      status: 'pending'
    };

    setDeposits(prev => [newDep, ...prev]);
    return newDepId;
  };

  // User Actions: Submit Support Ticket
  const submitSupportTicket = (subject, messageText) => {
    if (!currentUser) return;
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newTckId = `TCK${Math.floor(400 + Math.random() * 100)}`;

    const newTicket = {
      id: newTckId,
      userId: currentUser.id,
      userName: currentUser.name,
      subject,
      status: 'open',
      createdTime: timeStr,
      messages: [
        { sender: 'user', text: messageText, timestamp: timeStr }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    return newTckId;
  };

  // User Actions: Submit Ticket Message Reply
  const userReplyToTicket = (ticketId, replyText) => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'open', // change back to open when user replies
          messages: [...t.messages, { sender: 'user', text: replyText, timestamp: timeStr }]
        };
      }
      return t;
    }));
  };

  return (
    <AppContext.Provider value={{
      apiBaseUrl: API_BASE_URL,
      apiDocsUrl: API_DOCS_URL,
      backendStatus,
      checkBackendHealth,
      api,
      users,
      deposits,
      withdrawals,
      withdrawalLogs,
      websiteContent,
      tickets,
      settings,
      currentUser,
      isAdmin,
      toggleUserStatus,
      adjustUserBalance,
      confirmDeposit,
      failDeposit,
      updateWithdrawalStatus,
      completeWithdrawal,
      addWithdrawalRequest,
      saveCarouselItem,
      deleteCarouselItem,
      saveTopAchiever,
      deleteTopAchiever,
      updateWebsiteInfo,
      replyToTicket,
      resolveTicket,
      saveSettings,
      login,
      logout,
      registerUser,
      requestDeposit,
      submitSupportTicket,
      userReplyToTicket
    }}>
      {children}
    </AppContext.Provider>
  );
};
