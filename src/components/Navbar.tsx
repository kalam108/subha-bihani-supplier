import React, { useState } from 'react';
import {
  ShoppingCart,
  User,
  Shield,
  Menu,
  X,
  Phone,
  Wrench,
  Search,
  Check,
  ChevronDown,
  LogOut,
  Package,
  CalendarCheck,
  ArrowRightLeft,
  Globe,
  Coins,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/LanguageCurrencyContext';
import { SyncStatusBadge } from './SyncStatusBadge';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, role, isAdmin, logout, switchDemoRole } = useAuth();
  const { cartCount } = useCart();
  const { language, setLanguage, currency, setCurrency, openConverter, t } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { label: t('home'), path: '/' },
    { label: t('products'), path: '/products' },
    { label: t('services'), path: '/services' },
    { label: t('about'), path: '/about' },
    { label: t('contact'), path: '/contact' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-slate-200 font-medium">
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('emergencySupport')}: +977 984-1234567</span>
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-400">
              {t('commercialDistributor')}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Language Switcher (EN / नेपाली) */}
            <div className="flex items-center bg-slate-800 rounded p-0.5 border border-slate-700">
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  language === 'en' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ne')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  language === 'ne' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="नेपाली भाषामा बदल्नुहोस्"
              >
                नेपाली
              </button>
            </div>

            {/* Currency Switcher (NPR / USD) */}
            <div className="flex items-center bg-slate-800 rounded p-0.5 border border-slate-700">
              <button
                onClick={() => setCurrency('NPR')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  currency === 'NPR' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="Nepali Rupees (रू NPR)"
              >
                रू NPR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  currency === 'USD' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="US Dollars ($ USD)"
              >
                $ USD
              </button>
            </div>

            {/* Converter Modal Trigger */}
            <button
              onClick={openConverter}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-semibold transition-colors"
              title="Open English & Nepali Currency Converter"
              id="nav-converter-btn"
            >
              <ArrowRightLeft className="w-3 h-3 text-amber-400" />
              <span>{t('currencyConverter')}</span>
            </button>

            {/* Sync / PWA Status Badge */}
            <SyncStatusBadge />

            {/* Quick Demo Role Switcher for instant testing */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
                title="Switch testing role"
              >
                <span>Role:</span>
                <span className={`font-semibold ${isAdmin ? 'text-amber-400' : 'text-sky-300'}`}>
                  {isAdmin ? 'ADMIN' : 'CUSTOMER'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white text-slate-800 rounded-md shadow-lg border border-slate-200 py-1 z-50 text-xs">
                  <div className="px-3 py-1 font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => {
                      switchDemoRole('CUSTOMER');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-800">Customer (Pooja Karki)</div>
                      <div className="text-[11px] text-slate-500">Standard user checkout & bookings</div>
                    </div>
                    {!isAdmin && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('ADMIN');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-800">Admin (Bikram Subbha)</div>
                      <div className="text-[11px] text-amber-600 font-medium">Full store & dispatch control</div>
                    </div>
                    {isAdmin && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* TOP-LEFT BRAND LOGO */}
          <div className="flex items-center">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-3 text-left group focus:outline-none"
              id="brand-logo-button"
            >
              {/* Crisp SVG Logo mark */}
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center p-1.5 shadow-sm border border-slate-800 group-hover:border-sky-500 transition-colors">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                  <polygon points="50,15 82,33 82,67 50,85 18,67 18,33" stroke="#38bdf8" strokeWidth="6" strokeLinejoin="round" />
                  <path d="M52 24 L36 50 L48 50 L44 76 L64 48 L52 48 Z" fill="#38bdf8" />
                </svg>
              </div>

              <div>
                <div className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5 leading-none">
                  <span>Subbha Bihani</span>
                  <span className="text-sky-600 font-medium text-sm px-1.5 py-0.5 rounded bg-sky-50 border border-sky-100">
                    Suppliers
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5 uppercase tracking-wider">
                  Electrical • Plumbing • Hardware
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-slate-900 bg-slate-100 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Service Request CTA */}
            <button
              onClick={() => handleNav('/services')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <Wrench className="w-3.5 h-3.5 text-sky-600" />
              <span>Book Service</span>
            </button>

            {/* Quick Currency & Converter button in Main Nav */}
            <button
              onClick={openConverter}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors"
              title="Nepali Rupees Converter & Language Settings"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-bold text-amber-950">{currency === 'NPR' ? 'रू NPR' : '$ USD'}</span>
            </button>

            {/* Cart Icon & Badge */}
            <button
              onClick={() => handleNav('/cart')}
              className="relative p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Shopping Cart"
              id="header-cart-button"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Shortcut if Admin */}
            {isAdmin && (
              <button
                onClick={() => handleNav('/admin')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                  currentPath.startsWith('/admin')
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
                id="header-admin-portal-button"
              >
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* User Account / Profile */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
                id="header-user-menu"
              >
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-semibold max-w-[100px] truncate">
                  {user?.name || 'Account'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-md shadow-lg border border-slate-200 py-1.5 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-medium text-slate-500">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Guest'}</p>
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {role}
                    </span>
                  </div>

                  <button
                    onClick={() => handleNav('/orders')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Package className="w-4 h-4 text-slate-400" />
                    <span>My Orders</span>
                  </button>

                  <button
                    onClick={() => handleNav('/service-requests')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <CalendarCheck className="w-4 h-4 text-slate-400" />
                    <span>Service Requests</span>
                  </button>

                  <button
                    onClick={() => handleNav('/profile')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Profile & Address</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => handleNav('/admin')}
                      className="w-full text-left px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-medium"
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNav('/cart')}
              className="relative p-2 rounded-md text-slate-700"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className={`w-full text-left px-3 py-2.5 rounded-md text-base font-medium ${
                currentPath === link.path
                  ? 'text-sky-700 bg-sky-50 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="border-t border-slate-200 pt-3 mt-2 space-y-1">
            <button
              onClick={() => handleNav('/services')}
              className="w-full text-left px-3 py-2 text-sm text-sky-700 font-semibold flex items-center gap-2 bg-sky-50 rounded-md"
            >
              <Wrench className="w-4 h-4" />
              Book Certified Service
            </button>

            <button
              onClick={() => handleNav('/orders')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-slate-400" />
              My Orders
            </button>

            <button
              onClick={() => handleNav('/service-requests')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 text-slate-400" />
              My Service Bookings
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNav('/admin')}
                className="w-full text-left px-3 py-2 text-sm text-amber-800 bg-amber-50 font-semibold flex items-center gap-2 rounded-md"
              >
                <Shield className="w-4 h-4 text-amber-600" />
                Admin Panel (/admin)
              </button>
            )}

            {/* Mobile Language, Currency, & Converter Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold">Language:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2.5 py-1 rounded font-bold text-xs ${
                      language === 'en' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('ne')}
                    className={`px-2.5 py-1 rounded font-bold text-xs ${
                      language === 'ne' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    नेपाली
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold">Currency:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrency('NPR')}
                    className={`px-2.5 py-1 rounded font-bold text-xs ${
                      currency === 'NPR' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    रू NPR
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2.5 py-1 rounded font-bold text-xs ${
                      currency === 'USD' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openConverter();
                }}
                className="w-full mt-1 py-2 px-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold flex items-center justify-center gap-2"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === 'ne' ? 'मुद्रा क्याल्कुलेटर खोल्नुहोस्' : 'Open Currency Converter'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
