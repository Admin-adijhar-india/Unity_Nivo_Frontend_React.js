import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import welcomeImg from '../assets/welcome.jpeg';
import bonusImg from '../assets/bonus.jpeg';
import tripImg from '../assets/trip.jpeg';
import workImg from '../assets/work.jpeg';
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
  Menu,
  Globe,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Download,
  FileText
} from 'lucide-react';

const InstagramIcon = ({ size = 17, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 17, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = ({ size = 17, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15"/>
  </svg>
);

const defaultTopAchievers = [
  { id: 1, name: 'John Smith', rank: 'GOLD', displayInfo: 'Business $35,000', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' },
  { id: 2, name: 'Emily Rose', rank: 'PLATINUM', displayInfo: 'Business $50,000', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
  { id: 3, name: 'Michael Lee', rank: 'DIAMOND', displayInfo: 'Business $100,000', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300' },
  { id: 4, name: 'Sophia Martinez', rank: 'CROWN', displayInfo: 'Business $250,000', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300' },
  { id: 5, name: 'David Kim', rank: 'AMBASSADOR', displayInfo: 'Business $500,000', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
  { id: 6, name: 'Sarah Jenkins', rank: 'ROYAL CROWN', displayInfo: 'Business $1,000,000', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' }
];

const heroSlides = [
  { id: 1, image: welcomeImg, title: 'Welcome to Unity Nivo', desc: 'Secure your spot in our global wealth network.' },
  { id: 2, image: bonusImg, title: 'Maximize Your Earnings', desc: 'Unlock powerful booster pools and ROI rewards.' },
  { id: 3, image: tripImg, title: 'Dream Big, Travel More', desc: 'Vacation Bonus pools active for high-tier achievers.' },
  { id: 4, image: workImg, title: 'Build Your Network', desc: 'Empower your team and scale financial targets.' }
];

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

  // Hero Image Slider State
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [heroHovered, setHeroHovered] = useState(false);

  useEffect(() => {
    if (heroHovered) return;
    const interval = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [heroHovered]);

  // Top Achievers 3D Carousel state
  const [achieverIndex, setAchieverIndex] = useState(0);
  const [achieverHovered, setAchieverHovered] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(3);

  const achieversList = (websiteContent?.topAchievers && websiteContent.topAchievers.length >= 6)
    ? websiteContent.topAchievers
    : [
        ...(websiteContent?.topAchievers || []),
        ...defaultTopAchievers.slice(websiteContent?.topAchievers?.length || 0)
      ].slice(0, 6);

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth < 640) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };
    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);
    return () => window.removeEventListener('resize', updateCardsToShow);
  }, []);

  const maxSlideIndex = Math.max(0, achieversList.length - cardsToShow);

  const handleNextAchiever = () => {
    setAchieverIndex((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
  };

  const handlePrevAchiever = () => {
    setAchieverIndex((prev) => (prev <= 0 ? maxSlideIndex : prev - 1));
  };

  useEffect(() => {
    if (achieverHovered) return;
    const timer = setInterval(() => {
      setAchieverIndex((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
    }, 3200);
    return () => clearInterval(timer);
  }, [achieverHovered, maxSlideIndex]);

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
                src="/UnityNivo_Telegram_Bot_Logo_HD-1.png"
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

            {/* <a
              href="#income"
              className="hover:text-gold transition-colors"
            >
              Income Plan
            </a> */}

            <a
              href="#achievers"
              className="hover:text-gold transition-colors"
            >
              Top Achievers
            </a>

            <a
              href="/UnityNivo_Business_Plan.pdf"
              download="UnityNivo_Business_Plan.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors flex items-center gap-1"
              title="Download Business Plan PDF"
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
                setLoginRole('user');
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
                setLoginRole('user');
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
                href="/UnityNivo_Business_Plan.pdf"
                download="UnityNivo_Business_Plan.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-gold transition-all"
              >
                <span className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <FileText size={17} />
                </span>

                <span>Business Plan (PDF)</span>
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
                    setLoginRole('user');
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
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-6 py-3 bg-gold text-darkbg font-bold rounded-xl flex items-center hover:bg-gold-light transition-all shadow shadow-gold/25 text-xs"
              >
                JOIN NOW <ArrowRight size={14} className="ml-1.5" />
              </button>
              <a
                href="/UnityNivo_Business_Plan.pdf"
                download="UnityNivo_Business_Plan.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-white/5 border border-white/10 hover:border-gold/50 text-white hover:text-gold font-bold rounded-xl flex items-center transition-all text-xs"
              >
                <Download size={14} className="mr-1.5 text-gold" /> Business Plan PDF
              </a>
            </div>
          </div>

          {/* Hero Image Slider Graphic */}
          <div
            className="relative rounded-2xl border border-white/10 overflow-hidden aspect-video shadow-2xl bg-slate-900 group cursor-pointer"
            onClick={() => setShowRegisterModal(true)}
            onMouseEnter={() => setHeroHovered(true)}
            onMouseLeave={() => setHeroHovered(false)}
            title="Click to Register Now"
          >
            {/* Smooth Sliding Image Track */}
            <div
              className="flex w-full h-full transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${heroSlideIndex * 100}%)` }}
            >
              {heroSlides.map((slide) => (
                <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-darkbg-deep/90 via-transparent to-transparent" />
                </div>
              ))}
            </div>

            {/* Caption Overlay */}
            {/* <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl glass-panel border border-white/10 space-y-1 backdrop-blur-md bg-black/40">
              <span className="text-[10px] text-gold font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} /> {heroSlides[heroSlideIndex].title}
              </span>
              <p className="text-xs text-white font-semibold leading-tight">
                {heroSlides[heroSlideIndex].desc}
              </p>
            </div> */}

            {/* Slide Indicator Dots */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHeroSlideIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    heroSlideIndex === idx
                      ? 'w-6 bg-gold'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
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
              onClick={() => {
                setLoginRole('user');
                setAuthError('');
                setAuthSuccess('');
                setShowLoginModal(true);
              }}
              className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-white rounded-xl"
            >
              LOGIN
            </button>
          </div>
        </div>
      </section>

      {/* 4. Income Plan Grid */}
      {false && (
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
            {/* <p className="text-2xl font-black text-gold">$1</p> */}
            <p className="text-xs text-gray-500">Credited to wallet upon successful verification.</p>
          </div>

          {/* Cat 2: ROI Income */}
          <div className="p-6 rounded-2xl border border-white/5 glass-panel text-center space-y-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <TrendingUp size={22} />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">ROI Income</h4>
            {/* <p className="text-2xl font-black text-gold">0.5% Daily</p> */}
            <p className="text-xs text-gray-500">Daily yield generated automatically on trading pool funds.</p>
          </div>

          {/* Cat 3: Referral Income */}
          <div className="p-6 rounded-2xl border border-white/5 glass-panel text-center space-y-3.5">
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 text-gold flex items-center justify-center mx-auto">
              <Users size={22} />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Referral Income</h4>
            {/* <p className="text-2xl font-black text-gold">15%</p> */}
            <p className="text-xs text-gray-500">Immediate bonus credited on direct team nodes deposit volume.</p>
          </div>

          {/* Cat 4: Booster Income */}
          <div className="p-6 rounded-2xl border border-white/5 glass-panel text-center space-y-3.5">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto">
              <Sparkles size={22} />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Booster Income</h4>
            {/* <p className="text-2xl font-black text-gold">15%</p> */}
            <p className="text-xs text-gray-500">Accelerated referral pools for high-activity network builders.</p>
          </div>

          {/* Cat 5: Rank / Achievement Bonus */}
          <div className="p-6 rounded-2xl border border-white/5 glass-panel text-center space-y-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
              <Award size={22} />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Rank / Achievement</h4>
            {/* <p className="text-xs text-gold font-bold">One-Time Rewards</p> */}
            <p className="text-xs text-gray-500">Payouts trigger as direct team business targets are reached.</p>
          </div>

          {/* Cat 6: Leadership Monthly Bonus */}
          <div className="p-6 rounded-2xl border border-white/5 glass-panel text-center space-y-3.5">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
              <ShieldCheck size={22} />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Leadership Pool</h4>
            {/* <p className="text-xs text-gold font-bold">Monthly Dividends</p> */}
            <p className="text-xs text-gray-500">A share of global system revenue paid out to top-tier leaders.</p>
          </div>
        </div>
      </section>
      )}

      {/* 5. Social Media Join Bonus Section */}
      <section className="px-6 md:px-16 py-16 bg-black/25 border-b border-white/5">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-1">
            <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Social Media Join Bonus</h3>
            <p className="text-xs text-gray-500">Earn instantly by joining each official community channel</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/unitynivo_?igsi=MXY0dWJoYjJmdmNuZQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-pink-500/30 transition-all space-y-2 group block"
            >
              <div className="w-9 h-9 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <InstagramIcon size={17} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-pink-400 transition-colors block uppercase">Instagram</span>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/1bG7o9Bmqv/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-blue-500/30 transition-all space-y-2 group block"
            >
              <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <FacebookIcon size={17} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-blue-400 transition-colors block uppercase">Facebook</span>
            </a>

            {/* Youtube */}
            <a
              href="https://youtube.com/@unitynivo?si=3ogSiGV2osSoc3b5"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-red-500/30 transition-all space-y-2 group block"
            >
              <div className="w-9 h-9 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <YoutubeIcon size={17} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-red-400 transition-colors block uppercase">Youtube</span>
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/unitynivo"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all space-y-2 group block"
            >
              <div className="w-9 h-9 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Send size={15} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-cyan-400 transition-colors block uppercase">Telegram</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Business Plan Details Table */}
      {/* <section id="business" className="px-6 md:px-16 py-20 border-b border-white/5 max-w-3xl mx-auto space-y-8">
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
      </section> */}

      {/* 7. Top Achievers Section (3D Animated Carousel) */}
      <section id="achievers" className="px-4 sm:px-6 md:px-16 py-20 border-b border-white/5 bg-black/10 overflow-hidden relative">
        {/* Background glow highlights */}
        <div className="absolute top-1/2 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-1 border-b border-white/5 pb-6 max-w-xl mx-auto">
            <h3 className="text-xs font-bold text-gold uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles size={13} /> Leaderboard
            </h3>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide">TOP ACHIEVERS</h2>
            <p className="text-xs text-gray-400">Recognizing leaders driving business and network nodes expansion</p>
          </div>

          {/* 3D Sliding Cards Track */}
          <div
            className="relative overflow-hidden py-4 px-1"
            onMouseEnter={() => setAchieverHovered(true)}
            onMouseLeave={() => setAchieverHovered(false)}
          >
            <div
              className="flex transition-transform duration-700 ease-out gap-6"
              style={{
                transform: `translateX(-${achieverIndex * (100 / cardsToShow)}%)`
              }}
            >
              {achieversList.map((ach, idx) => (
                <div
                  key={ach.id || idx}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0 group perspective-1000"
                >
                  <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] via-white/[0.01] to-black/60 p-6 text-center space-y-4 shadow-xl hover:shadow-2xl hover:shadow-gold/20 hover:border-gold/50 transition-all duration-500 transform-gpu group-hover:-translate-y-2 group-hover:rotate-1 group-hover:scale-[1.02] backdrop-blur-xl overflow-hidden">
                    {/* 3D Glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Avatar with 3D Ring */}
                    <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 rounded-full bg-gold/20 blur-md group-hover:bg-gold/40 transition-colors" />
                      <div className="relative w-24 h-24 rounded-full border-2 border-gold p-1 shadow-lg shadow-gold/15 overflow-hidden bg-black/40">
                        <img
                          src={ach.image}
                          alt={ach.name}
                          className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-white text-base leading-snug group-hover:text-gold transition-colors">
                        {ach.name}
                      </h4>
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-gold/10 border border-gold/30 text-gold shadow-sm tracking-wider group-hover:bg-gold/20 group-hover:border-gold/50 transition-colors">
                          <Sparkles size={11} className="text-gold" />
                          {ach.rank}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 pt-2">
            {Array.from({ length: maxSlideIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setAchieverIndex(dotIdx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  achieverIndex === dotIdx
                    ? 'w-8 bg-gold shadow shadow-gold/50'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
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
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-left max-w-3xl mx-auto shadow-lg">
            <div className="space-y-1.5 overflow-hidden">
              <span className="flex items-center gap-1.5 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                <Mail size={13} className="text-gold shrink-0" />
                Inquiries Email
              </span>
              <a href="mailto:supportunitynivo@gmail.com" className="block text-white font-semibold hover:text-gold transition-colors break-all">
                supportunitynivo@gmail.com
              </a>
            </div>
            <div className="space-y-1.5 overflow-hidden">
              <span className="flex items-center gap-1.5 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                <Phone size={13} className="text-gold shrink-0" />
                Hotline Phone
              </span>
              <a href="tel:+919288021327" className="block text-white font-semibold hover:text-gold transition-colors break-words">
                +91 9288021327
              </a>
            </div>
            <div className="space-y-1.5 overflow-hidden">
              <span className="flex items-center gap-1.5 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                <MapPin size={13} className="text-gold shrink-0" />
                Operational Office
              </span>
              <span className="block text-white font-semibold leading-relaxed break-words">
                Unity nivo, 302 A-WING, VIVEK TOWER, GONDHAL circle, JAMNAGAR 361005 Gujarat, India
              </span>
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
                  src="/UnityNivo_Telegram_Bot_Logo_HD-1.png"
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
              <li>
                <a
                  href="/UnityNivo_Business_Plan.pdf"
                  download="UnityNivo_Business_Plan.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors flex items-center gap-1"
                >
                  Business Plan (PDF)
                </a>
              </li>
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
              <li>
                <button
                  onClick={() => {
                    setLoginRole('admin');
                    setAuthError('');
                    setAuthSuccess('');
                    setShowLoginModal(true);
                  }}
                  className="hover:text-purple-400 text-gray-500 transition-colors text-left"
                >
                  Admin Login
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider">Community channels</h4>
            <div className="flex flex-wrap items-center gap-2.5 py-1">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/unitynivo_?igsi=MXY0dWJoYjJmdmNuZQ=="
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-pink-400 hover:border-pink-500/40 hover:bg-pink-500/10 transition-all"
              >
                <InstagramIcon size={17} />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1bG7o9Bmqv/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all"
              >
                <FacebookIcon size={17} />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@unitynivo?si=3ogSiGV2osSoc3b5"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all"
              >
                <YoutubeIcon size={17} />
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/unitynivo"
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram"
                aria-label="Telegram"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all"
              >
                <Send size={15} />
              </a>

              {/* Website */}
              {/* <a
                href="https://www.unitynivo.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Official Website (unitynivo.com)"
                aria-label="Official Website"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold/40 hover:bg-gold/10 transition-all"
              >
                <Globe size={17} />
              </a> */}
            </div>
            <p className="text-[10px] text-gray-600 mt-3">© 2026 Unity Nivo. All rights reserved. Blockchain node connected.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/9288021327"
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
