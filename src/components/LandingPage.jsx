import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
// import {
//   DollarSign,
//   Award,
//   Users,
//   ArrowRight,
//   ShieldCheck,
//   HelpCircle,
//   Phone,
//   MessageSquare,
//   Lock,
//   Mail,  
//   User,
//   Smartphone,
//   Wallet as WalletIcon,
//   X,
//   CheckCircle,
//   HelpCircle as SupportIcon,
//   TrendingUp,
//   Share2,
//   Tv,
//   Send,
//   Sparkles,
//   Info
// } from 'lucide-react';



import {
  DollarSign,
  Award,
  Users,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Phone,
  MessageSquare,
  Lock,
  Mail,
  User,
  Smartphone,
  Wallet as WalletIcon,
  X,
  CheckCircle,
  HelpCircle as SupportIcon,
  TrendingUp,
  Share2,
  Tv,
  Send,
  Sparkles,
  Info,
  Menu
} from 'lucide-react';

export default function LandingPage() {
  const { login, registerUser, adminLogin, websiteContent, settings } = useContext(AppContext);
  const [loginRole, setLoginRole] = useState('user');
  const [loginType, setLoginType] = useState('user');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [sponsorCode, setSponsorCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Parse URL parameters and route path on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl =
      params.get('ref') ||
      params.get('sponsor') ||
      params.get('referral') ||
      params.get('code') ||
      params.get('refCode') ||
      params.get('referrer') ||
      '';

    const path = window.location.pathname;

    if (codeFromUrl) {
      setSponsorCode(codeFromUrl);
      setShowRegisterModal(true);
    } else if (path.includes('/register')) {
      setShowRegisterModal(true);
    } else if (path.includes('/login')) {
      setShowLoginModal(true);
    }
  }, []);

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
    setAuthError('');
    setAuthSuccess('');
    if (window.location.pathname.includes('/register') || window.location.search.includes('ref=')) {
      window.history.replaceState({}, '', '/');
    }
  };

  // Login form handler connecting to VITE_API_BASE_URL/api/user/auth/login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsSubmitting(true);

    const data = new FormData(e.target);
    const email = data.get('email');
    const password = data.get('password');

    try {
      const result = await login(email, password, loginRole);
      if (result.success) {
        setAuthSuccess('Log in successful! Redirecting...');
      } else {
        setAuthError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setAuthError('Network error connecting to API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Registration handler connecting to VITE_API_BASE_URL/api/user/auth/register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const data = new FormData(e.target);
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');

    if (password && confirmPassword && password !== confirmPassword) {
      setAuthError('Password and Confirm Password do not match.');
      return;
    }

    setIsSubmitting(true);

    const registrationPayload = {
      name: data.get('name'),
      email: data.get('email'),
      mobile: data.get('mobile'),
      sponsorId: data.get('sponsor') ? data.get('sponsor').trim() : (sponsorCode ? sponsorCode.trim() : ''),
      country: data.get('country') || 'India',
      district: data.get('district') || 'Central',
      password: password || '',
      confirmPassword: confirmPassword || '',
    };

    try {
      const result = await registerUser(registrationPayload);
      if (result.success) {
        setAuthSuccess('Registration completed successfully! Initializing account...');
        setTimeout(() => {
          setShowRegisterModal(false);
        }, 1200);
      } else {
        setAuthError(result.error || 'Registration failed. Please check details.');
      }
    } catch (err) {
      setAuthError('Network error connecting to API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden text-gray-300 relative select-none bg-darkbg">
      {/* Background decoration blur */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-950/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-[800px] right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-10" />

      {/* 1. Header Bar */}
      {/* 1. Responsive Header */}
      <header className=" fixed top-0 left-0 right-0 z-[100] w-full bg-darkbg-deep/95 backdrop-blur-xl border-b border-white/5">

        <div className="px-4 sm:px-6 md:px-10 h-[72px] md:h-20 flex items-center justify-between">

          {/* Logo + Brand */}
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">

            <div className="flex items-center justify-center w-14 h-14 sm:w-[70px] sm:h-[64px] md:w-[82px] md:h-[68px] rounded-xl overflow-hidden flex-shrink-0">
              <img
                src="/public/UnityNivo_Telegram_Bot_Logo_HD-1.png"
                alt="Unity Nivo Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <h1 className="text-base sm:text-lg md:text-[22px] font-extrabold tracking-wide text-white leading-tight truncate">
                UNITY NIVO
              </h1>

              <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-[9px] md:text-[11px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.18em] text-emerald-400 whitespace-nowrap">
                United We Grow
              </p>
            </div>

          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-semibold text-gray-400">
            <a
              href="#home"
              className="hover:text-gold transition-colors text-white"
            >
              Home
            </a>

            <a
              href="#about"
              className="hover:text-gold transition-colors"
            >
              About Us
            </a>

            <a
              href="#income"
              className="hover:text-gold transition-colors"
            >
              Income Plan
            </a>

            <a
              href="#achievers"
              className="hover:text-gold transition-colors"
            >
              Top Achievers
            </a>

            <a
              href="#business"
              className="hover:text-gold transition-colors"
            >
              Business Plan
            </a>

            <a
              href="#contact"
              className="hover:text-gold transition-colors"
            >
              Contact Us
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3 text-xs font-bold">

            <button
              onClick={() => {
                setAuthError('');
                setAuthSuccess('');
                setShowLoginModal(true);
              }}
              className="px-4 py-2 border border-white/10 hover:border-gold/30 hover:text-white rounded-xl transition-all"
            >
              Login
            </button>

            <button
              onClick={() => {
                setAuthError('');
                setAuthSuccess('');
                setShowRegisterModal(true);
              }}
              className="px-4 py-2 bg-gold text-darkbg hover:bg-gold-light rounded-xl transition-all shadow shadow-gold/15"
            >
              Register
            </button>

          </div>

          {/* Mobile Right Side */}
          <div className="flex lg:hidden items-center gap-2">

            {/* Mobile Login Icon */}
            <button
              onClick={() => {
                setAuthError('');
                setAuthSuccess('');
                setShowLoginModal(true);
              }}
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] text-gray-300 hover:text-gold hover:border-gold/30 flex items-center justify-center transition-all"
              title="Login"
              aria-label="Login"
            >
              <Lock size={17} />
            </button>

            {/* Mobile Register Icon */}
            <button
              onClick={() => {
                setAuthError('');
                setAuthSuccess('');
                setShowRegisterModal(true);
              }}
              className="w-10 h-10 rounded-xl bg-gold text-darkbg hover:bg-gold-light flex items-center justify-center transition-all shadow shadow-gold/20"
              title="Register"
              aria-label="Register"
            >
              <User size={17} />
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] text-gray-300 hover:text-gold hover:border-gold/30 flex items-center justify-center transition-all"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/5 bg-darkbg-deep/98 backdrop-blur-xl">

            <nav className="px-4 sm:px-6 py-3 space-y-1">

              {/* Home */}
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white hover:bg-white/5 hover:text-gold transition-all"
              >
                <span className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 text-gold flex items-center justify-center">
                  <DollarSign size={17} />
                </span>

                <span>Home</span>
              </a>

              {/* About */}
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-gold transition-all"
              >
                <span className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <HelpCircle size={17} />
                </span>

                <span>About Us</span>
              </a>

              {/* Income */}
              <a
                href="#income"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-gold transition-all"
              >
                <span className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <TrendingUp size={17} />
                </span>

                <span>Income Plan</span>
              </a>

              {/* Achievers */}
              <a
                href="#achievers"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-gold transition-all"
              >
                <span className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Award size={17} />
                </span>

                <span>Top Achievers</span>
              </a>

              {/* Business */}
              <a
                href="#business"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-gold transition-all"
              >
                <span className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <ShieldCheck size={17} />
                </span>

                <span>Business Plan</span>
              </a>

              {/* Contact */}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-gold transition-all"
              >
                <span className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Phone size={17} />
                </span>

                <span>Contact Us</span>
              </a>

              {/* Mobile Auth Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-white/5">

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthError('');
                    setAuthSuccess('');
                    setShowLoginModal(true);
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-gold/30 transition-all text-xs font-bold"
                >
                  <Lock size={15} />
                  LOGIN
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthError('');
                    setAuthSuccess('');
                    setShowRegisterModal(true);
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-darkbg hover:bg-gold-light transition-all text-xs font-bold"
                >
                  <User size={15} />
                  REGISTER
                </button>

              </div>

            </nav>

          </div>
        )}

      </header>

      {/* 2. Hero Section */}
      <section id="home" className="relative px-6 md:px-16 py-12 md:py-24 border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-widest rounded-full">
              Launch Platform Active
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              DREAM BIG <br />
              <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                TRAVEL MORE
              </span>
            </h2>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-lg">
              Achieve your financial goals with Unity Nivo. Build your network nodes, participate in mutual program pools, and track your global yield dashboard.
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-6 py-3 bg-gold text-darkbg font-bold rounded-xl flex items-center hover:bg-gold-light transition-all shadow shadow-gold/25 text-xs"
              >
                JOIN NOW <ArrowRight size={14} className="ml-1.5" />
              </button>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Pool ROI: 0.5% Daily</span>
              </div>
            </div>
          </div>

          {/* Beach/Travel Image Graphic inspired by the layout */}
          <div className="relative rounded-2xl border border-white/5 overflow-hidden aspect-video shadow-2xl bg-slate-900 group">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
              alt="Dream Big Destination"
              className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-darkbg-deep via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl glass-panel border border-white/5 space-y-1">
              <span className="text-[10px] text-gold font-bold uppercase tracking-wider">Dream Getaway Goal</span>
              <p className="text-xs text-white font-semibold">Vacation Bonus pools active for high-tier Diamond achievers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Welcome Section */}
      <section className="px-6 md:px-16 py-16 bg-black/10 border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Introduction</h3>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">WELCOME TO UNITY NIVO</h2>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed">
            Build your decentralized network, participate in our secure high-fidelity pools, and monitor all yield metrics from a single dashboard interface. Security and trust form the core foundation of our operational blockchain framework.
          </p>
          <div className="flex justify-center items-center space-x-3.5 text-xs font-bold">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-5 py-2.5 bg-gold text-darkbg hover:bg-gold-light rounded-xl shadow"
            >
              REGISTER NOW
            </button>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-white rounded-xl"
            >
              LOGIN
            </button>
          </div>
        </div>
      </section>

      {/* 4. Income Plan Grid */}
      <section id="income" className="px-6 md:px-16 py-20 border-b border-white/5 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Earning Vectors</h3>
          <h2 className="text-2xl md:text-3xl font-black text-white">OUR INCOME PLAN</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">Multiple commission vectors designed to accelerate wealth compounding</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cat 1: Join Bonus */}
          <div className="p-6 rounded-2xl border border-white/5 glass-panel text-center space-y-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto text-xl font-bold">
              $
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Join Bonus</h4>
            <p className="text-2xl font-black text-gold">$1</p>
            <p className="text-xs text-gray-500">Credited to wallet upon successful verification.</p>
          </div>

          {/* Cat 2: ROI Income */}
          <div className="p-6 rounded-2xl border border-white/5 glass-panel text-center space-y-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <TrendingUp size={22} />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">ROI Income</h4>
            <p className="text-2xl font-black text-gold">0.5% Daily</p>
            <p className="text-xs text-gray-500">Daily yield generated automatically on trading pool funds.</p>
          </div>

          {/* Cat 3: Referral Income */}
          <div className="p-6 rounded-2xl border border-white/5 glass-panel text-center space-y-3.5">
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 text-gold flex items-center justify-center mx-auto">
              <Users size={22} />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Referral Income</h4>
            <p className="text-2xl font-black text-gold">15%</p>
            <p className="text-xs text-gray-500">Immediate bonus credited on direct team nodes deposit volume.</p>
          </div>

          {/* Cat 4: Booster Income */}
          <div className="p-6 rounded-2xl border border-white/5 glass-panel text-center space-y-3.5">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto">
              <Sparkles size={22} />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Booster Income</h4>
            <p className="text-2xl font-black text-gold">15%</p>
            <p className="text-xs text-gray-500">Accelerated referral pools for high-activity network builders.</p>
          </div>

          {/* Cat 5: Rank / Achievement Bonus */}
          <div className="p-6 rounded-2xl border border-white/5 glass-panel text-center space-y-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
              <Award size={22} />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Rank / Achievement</h4>
            <p className="text-xs text-gold font-bold">One-Time Rewards</p>
            <p className="text-xs text-gray-500">Payouts trigger as direct team business targets are reached.</p>
          </div>

          {/* Cat 6: Leadership Monthly Bonus */}
          <div className="p-6 rounded-2xl border border-white/5 glass-panel text-center space-y-3.5">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
              <ShieldCheck size={22} />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Leadership Pool</h4>
            <p className="text-xs text-gold font-bold">Monthly Dividends</p>
            <p className="text-xs text-gray-500">A share of global system revenue paid out to top-tier leaders.</p>
          </div>
        </div>
      </section>

      {/* 5. Social Media Join Bonus Section */}
      <section className="px-6 md:px-16 py-16 bg-black/25 border-b border-white/5">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-1">
            <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Social Media Join Bonus — $1</h3>
            <p className="text-xs text-gray-500">Earn $0.25 instantly by joining each official community channel</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {/* Instagram */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
              <div className="w-9 h-9 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto">
                <Share2 size={16} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Instagram</span>
              <span className="text-xs font-bold text-white">$0.25</span>
            </div>

            {/* Facebook */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
              <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto font-bold text-xs">
                f
              </div>
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Facebook</span>
              <span className="text-xs font-bold text-white">$0.25</span>
            </div>

            {/* Youtube */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
              <div className="w-9 h-9 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
                <Tv size={16} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Youtube</span>
              <span className="text-xs font-bold text-white">$0.25</span>
            </div>

            {/* Telegram */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
              <div className="w-9 h-9 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                <Send size={15} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Telegram</span>
              <span className="text-xs font-bold text-white">$0.25</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Business Plan Details Table */}
      <section id="business" className="px-6 md:px-16 py-20 border-b border-white/5 max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Financial Specs</h3>
          <h2 className="text-2xl md:text-3xl font-black text-white">BUSINESS PLAN</h2>
          <p className="text-xs text-gray-500">Transparent parameters outlining transaction limits and payout timelines</p>
        </div>

        <div className="rounded-xl border border-white/5 overflow-hidden glass-panel text-xs">
          <div className="grid grid-cols-2 p-3.5 border-b border-white/5 bg-black/40 text-gold font-bold uppercase tracking-wider">
            <span>Parameters</span>
            <span className="text-right">Platform Rules Specification</span>
          </div>
          <div className="divide-y divide-white/5">
            <div className="grid grid-cols-2 p-3.5">
              <span className="text-gray-400 font-semibold">Minimum Deposit</span>
              <span className="text-right text-white font-bold">${settings.minDeposit}</span>
            </div>
            <div className="grid grid-cols-2 p-3.5">
              <span className="text-gray-400 font-semibold">Deposit Currency Network</span>
              <span className="text-right text-emerald-400 font-bold">{settings.depositNetwork}</span>
            </div>
            <div className="grid grid-cols-2 p-3.5">
              <span className="text-gray-400 font-semibold">Minimum Withdrawal</span>
              <span className="text-right text-white font-bold">${settings.minWithdrawal}</span>
            </div>
            <div className="grid grid-cols-2 p-3.5">
              <span className="text-gray-400 font-semibold">Withdrawal Fee Charge</span>
              <span className="text-right text-red-400 font-bold">{settings.withdrawalCharge}%</span>
            </div>
            <div className="grid grid-cols-2 p-3.5">
              <span className="text-gray-400 font-semibold">Withdrawal Days Schedule</span>
              <span className="text-right text-white font-bold">Monday - Friday</span>
            </div>
            <div className="grid grid-cols-2 p-3.5">
              <span className="text-gray-400 font-semibold">Withdrawal Settlement Target</span>
              <span className="text-right text-emerald-400 font-bold">Within 24 Hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Top Achievers Section */}
      <section id="achievers" className="px-6 md:px-16 py-20 border-b border-white/5 bg-black/10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-1">
            <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Leaderboard</h3>
            <h2 className="text-2xl md:text-3xl font-black text-white">TOP ACHIEVERS</h2>
            <p className="text-xs text-gray-500">Recognizing leaders driving business and network nodes expansion</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {websiteContent.topAchievers.map((ach) => (
              <div key={ach.id} className="p-6 rounded-2xl border border-white/5 glass-panel text-center space-y-4">
                <div className="w-20 h-20 rounded-full border-2 border-gold overflow-hidden mx-auto shadow-lg shadow-gold/10">
                  <img
                    src={ach.image}
                    alt={ach.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base leading-snug">{ach.name}</h4>
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-gold/15 border border-gold/30 text-gold mt-1.5">
                    {ach.rank}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-semibold border-t border-white/5 pt-3">
                  {ach.displayInfo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. How It Works Section */}
      <section className="px-6 md:px-16 py-20 border-b border-white/5 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-1">
          <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Workflow</h3>
          <h2 className="text-2xl md:text-3xl font-black text-white">HOW IT WORKS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold text-gold flex items-center justify-center font-bold text-xs mx-auto">1</div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Register</h4>
            <p className="text-[10px] text-gray-500">Create your account to secure your unique node ID.</p>
          </div>
          {/* Step 2 */}
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold text-gold flex items-center justify-center font-bold text-xs mx-auto">2</div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Deposit</h4>
            <p className="text-[10px] text-gray-500">Fund your account with a minimum of $30 USDT BEP-20.</p>
          </div>
          {/* Step 3 */}
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold text-gold flex items-center justify-center font-bold text-xs mx-auto">3</div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Participate</h4>
            <p className="text-[10px] text-gray-500">Join investment programs and build sponsor networks.</p>
          </div>
          {/* Step 4 */}
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold text-gold flex items-center justify-center font-bold text-xs mx-auto">4</div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Earn & Track</h4>
            <p className="text-[10px] text-gray-500">Withdraw earnings directly with free internal transfer options.</p>
          </div>
        </div>
      </section>

      {/* 9. Wallet & Payment Options */}
      <section className="px-6 md:px-16 py-16 bg-black/25 border-b border-white/5 text-center space-y-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Crypto Integrations</h3>
            <h2 className="text-xl md:text-2xl font-black text-white">WALLET & PAYMENT</h2>
            <p className="text-xs text-gray-500">We support trusted Web3 wallets for secure blockchain operations</p>
          </div>

          {/* Wallet Logos Grid */}
          <div className="flex flex-wrap justify-center gap-8 py-4">
            {settings.supportedWallets.map((wallet) => (
              <div key={wallet} className="px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center font-bold text-xs text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-gold mr-2" />
                {wallet}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto text-xs">
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1.5">
              <h4 className="font-bold text-white text-[11px] uppercase tracking-wider">Deposit Rule</h4>
              <p className="text-gray-500 leading-relaxed">Minimum deposit is $30 USDT. BEP-20 only. Funds reflect in balance immediately after network confirmation.</p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1.5">
              <h4 className="font-bold text-white text-[11px] uppercase tracking-wider">Withdrawal Rule</h4>
              <p className="text-gray-500 leading-relaxed">Minimum withdrawal is $15 USDT. 5% processing fee. Active withdrawals processed Mon - Fri within 24h.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. About Section */}
      <section id="about" className="px-6 md:px-16 py-20 border-b border-white/5 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gold uppercase tracking-widest">About Our Node</h3>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase">ABOUT UNITY NIVO</h2>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
            {websiteContent.aboutUs}
          </p>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
            {websiteContent.services}
          </p>
        </div>

        {/* Corporate building placeholder image */}
        <div className="rounded-2xl border border-white/5 overflow-hidden aspect-video shadow-2xl bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
            alt="Unity Nivo Headquarters"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
      </section>

      {/* 11. Customer Support Callout */}
      <section id="contact" className="px-6 md:px-16 py-16 bg-black/10 border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Customer Care</h3>
          <h2 className="text-xl md:text-2xl font-black text-white">{settings.customerSupport} AVAILABLE</h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
            We are here to help you anytime, anywhere. Reach our operational node by submitting a ticket in your dashboard.
          </p>
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] inline-grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-left max-w-lg mx-auto">
            <div>
              <span className="block text-gray-500 font-bold uppercase text-[9px]">Inquiries Email</span>
              <span className="text-white font-semibold">{websiteContent.contact.email}</span>
            </div>
            <div>
              <span className="block text-gray-500 font-bold uppercase text-[9px]">Hotline Phone</span>
              <span className="text-white font-semibold">{websiteContent.contact.phone}</span>
            </div>
            <div>
              <span className="block text-gray-500 font-bold uppercase text-[9px]">Operational Office</span>
              <span className="text-white font-semibold leading-tight">{websiteContent.contact.address}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="px-6 md:px-16 py-12 bg-darkbg-deep border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-xs">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gold/25 border border-gold flex items-center justify-center font-bold text-gold">
                <img
                  src="/public/UnityNivo_Telegram_Bot_Logo_HD-1.png"
                  alt="Unity Nivo Logo"
                  className="w-full h-full object-contain"
                /></div>
              <span className="font-bold text-white">UNITY NIVO</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Leading decentralized trading pool infrastructure combining multi-tier referral booster networks and real-time ledger accounting.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="#about" className="hover:text-gold transition-colors">About Us</a></li>
              <li><a href="#home" className="hover:text-gold transition-colors">Services Info</a></li>
              <li><a href="#home" className="hover:text-gold transition-colors">Business Plan</a></li>
              <li><a href="#income" className="hover:text-gold transition-colors">Income Plan Grid</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="#contact" className="hover:text-gold transition-colors">Contact Support</a></li>
              <li><a href="#home" className="hover:text-gold transition-colors">Terms of Operations</a></li>
              <li><a href="#home" className="hover:text-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#home" className="hover:text-gold transition-colors">Knowledge Base</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider">Community channels</h4>
            <div className="flex space-x-3 py-1">
              <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors font-bold text-xs">f</span>
              <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors text-xs font-bold">in</span>
              <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors text-xs font-bold">tg</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-3">© 2026 Unity Nivo. All rights reserved. Blockchain node connected.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/7978895193"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-lg shadow-emerald-500/20 hover:scale-110 transition-all flex items-center justify-center"
        title="Chat on WhatsApp"
      >
        <MessageSquare size={20} />
      </a>

      {/* MODAL: LOGIN */}
      {showLoginModal && (
        // <div className="mt-[46px] fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
        //   <div className="w-full max-w-md rounded-2xl border border-white/10 bg-darkbg-card p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        //     <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-4">
        //       <div>
        //         <h3 className="text-base font-bold text-white">Log In to Account</h3>
        //         <p className="text-[10px] text-gray-500 mt-0.5">Admin or User credentials required</p>
        //       </div>
        //       <button
        //         onClick={() => setShowLoginModal(false)}
        //         className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        //       >
        //         <X size={18} />
        //       </button>
        //     </div>

        //     {/* Dummy Account Helper */}
        //     {/* <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 mb-4 text-[10px]">
        //       <div className="flex items-center space-x-1.5 text-gold font-bold uppercase tracking-wider">
        //         <Info size={12} />
        //         <span>Dummy Account Credentials</span>
        //       </div>
        //       <div className="divide-y divide-white/5">
        //         <div className="py-1.5">
        //           <span className="text-gray-500 font-bold block">System Administrator Role</span>
        //           <span className="text-gray-300">Gmail: </span><span className="text-emerald-400 font-bold select-all">admin@unitynivo.com</span>
        //           <span className="block text-gray-300">Password: </span><span className="text-emerald-400 font-bold select-all">adminpassword</span>
        //         </div>
        //         <div className="py-1.5">
        //           <span className="text-gray-500 font-bold block">Existing User Role (e.g. John Smith)</span>
        //           <span className="text-gray-300">Gmail: </span><span className="text-emerald-400 font-bold select-all">john.smith@gmail.com</span>
        //           <span className="block text-gray-300">Password: </span><span className="text-gray-500 font-semibold">(Any password is accepted)</span>
        //         </div>
        //       </div>
        //     </div> */}

        //     {authError && (
        //       <div className="p-2.5 mb-4 text-xs font-semibold rounded-lg bg-red-950/60 border border-red-500/20 text-red-400">
        //         {authError}
        //       </div>
        //     )}
        //     {authSuccess && (
        //       <div className="p-2.5 mb-4 text-xs font-semibold rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-emerald-400">
        //         {authSuccess}
        //       </div>
        //     )}

        //     <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
        //       <div>
        //         <label className="text-gray-400 font-bold block mb-1">Email Coordinates</label>
        //         <div className="relative">
        //           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
        //           <input
        //             type="email"
        //             name="email"
        //             required
        //             placeholder="email@example.com"
        //             className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-gold/50"
        //           />
        //         </div>
        //       </div>

        //       <div>
        //         <label className="text-gray-400 font-bold block mb-1">Security Password</label>
        //         <div className="relative">
        //           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
        //           <input
        //             type="password"
        //             name="password"
        //             required
        //             placeholder="••••••••"
        //             className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-gold/50"
        //           />
        //         </div>
        //       </div>

        //       <button
        //         type="submit"
        //         disabled={isSubmitting}
        //         className="w-full mt-2 py-2.5 bg-gold text-darkbg font-bold rounded-xl hover:bg-gold-light transition-all flex items-center justify-center text-xs shadow shadow-gold/20 disabled:opacity-50"
        //       >
        //         {isSubmitting ? 'Logging in...' : 'Log In'} <ArrowRight size={14} className="ml-1.5" />
        //       </button>
        //     </form>
        //   </div>
        // </div>

        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-md my-auto max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-darkbg-card p-6 shadow-2xl animate-in fade-in zoom-in duration-200">

            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-5">
              <div>
                <h3 className="text-base font-bold text-white">
                  {loginRole === 'admin' ? 'Admin Login' : 'User Login'}
                </h3>

                <p className="text-[10px] text-gray-500 mt-0.5">
                  {loginRole === 'admin'
                    ? 'Login with your administrator credentials'
                    : 'Login with your Unity Nivo account'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowLoginModal(false);
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Login Role Selector */}
            <div className="mb-5">
              <label className="text-gray-400 font-bold block mb-2 text-xs">
                Login As
              </label>

              <div className="grid grid-cols-2 gap-2">

                {/* User */}
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('user');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${loginRole === 'user'
                      ? 'bg-gold text-darkbg border-gold shadow-lg shadow-gold/10'
                      : 'bg-black/30 text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                >
                  User Login
                </button>

                {/* Admin */}
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('admin');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${loginRole === 'admin'
                      ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20'
                      : 'bg-black/30 text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                >
                  Admin Login
                </button>

              </div>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-2.5 mb-4 text-xs font-semibold rounded-lg bg-red-950/60 border border-red-500/20 text-red-400">
                {authError}
              </div>
            )}

            {/* Success Message */}
            {authSuccess && (
              <div className="p-2.5 mb-4 text-xs font-semibold rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-emerald-400">
                {authSuccess}
              </div>
            )}

            {/* Login Form */}
            <form
              onSubmit={handleLoginSubmit}
              className="space-y-4 text-xs"
            >

              {/* Email */}
              <div>
                <label className="text-gray-400 font-bold block mb-1">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={14}
                  />

                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder={
                      loginRole === 'admin'
                        ? 'admin@example.com'
                        : 'email@example.com'
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-gray-400 font-bold block mb-1">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={14}
                  />

                  <input
                    type="password"
                    name="password"
                    required
                    autoComplete={
                      loginRole === 'admin'
                        ? 'current-password'
                        : 'current-password'
                    }
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-2 py-2.5 font-bold rounded-xl transition-all flex items-center justify-center text-xs shadow disabled:opacity-50 disabled:cursor-not-allowed ${loginRole === 'admin'
                    ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-600/20'
                    : 'bg-gold text-darkbg hover:bg-gold-light shadow-gold/20'
                  }`}
              >
                {isSubmitting
                  ? 'Logging in...'
                  : loginRole === 'admin'
                    ? 'Login as Admin'
                    : 'Login as User'}

                {!isSubmitting && (
                  <ArrowRight
                    size={14}
                    className="ml-1.5"
                  />
                )}
              </button>

            </form>

            {/* Footer Info */}
            <div className="mt-4 text-center">
              <p className="text-[10px] text-gray-600">
                {loginRole === 'admin'
                  ? 'Administrator access is restricted to authorized accounts.'
                  : 'Use your registered Unity Nivo account credentials.'}
              </p>
            </div>

          </div>
        </div>

      )}

      {/* MODAL: REGISTER */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-md my-auto max-h-[90vh] flex flex-col rounded-2xl border border-white/10 bg-darkbg-card p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-4 flex-shrink-0">
              <div>
                <h3 className="text-base font-bold text-white">Register Node Profile</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Secure your place in the Unity Nivo compound network</p>
              </div>
              <button
                onClick={handleCloseRegisterModal}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto pr-1 flex-1 space-y-3.5 custom-scrollbar">
              {authError && (
                <div className="p-2.5 text-xs font-semibold rounded-lg bg-red-950/60 border border-red-500/20 text-red-400">
                  {authError}
                </div>
              )}
              {authSuccess && (
                <div className="p-2.5 text-xs font-semibold rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-emerald-400">
                  {authSuccess}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="John Doe"
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-gold/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 font-bold block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="john.doe@example.com"
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-gold/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 font-bold block mb-1">Mobile Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input
                      type="text"
                      name="mobile"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-gold/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 font-bold block mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                      <input
                        type="password"
                        name="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-gold/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 font-bold block mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        placeholder="••••••••"
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-gold/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 font-bold block mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      defaultValue="India"
                      required
                      placeholder="Country"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold/50"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 font-bold block mb-1">District / City</label>
                    <input
                      type="text"
                      name="district"
                      defaultValue="Central"
                      required
                      placeholder="District"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold/50"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-400 font-bold block text-xs">
                      Sponsor User ID / Refer Code
                    </label>
                    {sponsorCode && (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Referral Code Applied
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    name="sponsor"
                    value={sponsorCode}
                    onChange={(e) => setSponsorCode(e.target.value)}
                    placeholder="UN001 or Refer Code"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold/50"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-gold/5 border border-gold/15 text-gold text-[9px] font-semibold flex items-center">
                  <Sparkles size={14} className="mr-1.5 flex-shrink-0" />
                  <span>Registering immediately credits $1.00 Join Bonus directly to your new balance!</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-gold text-darkbg font-bold rounded-xl hover:bg-gold-light transition-all flex items-center justify-center text-xs shadow shadow-gold/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'} <ArrowRight size={14} className="ml-1.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
