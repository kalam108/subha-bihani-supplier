import React, { useState, useEffect } from 'react';
import {
  Shield,
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Wrench,
  Users,
  FileText,
  Database,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  Store,
  ExternalLink,
  Sparkles,
  ArrowRightLeft,
  Languages,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/LanguageCurrencyContext';
import { SyncStatusBadge } from '../../components/SyncStatusBadge';
import { api } from '../../services/api';
import { AdminStats } from '../../types';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'inventory'
  | 'orders'
  | 'services'
  | 'technicians'
  | 'customers'
  | 'audit-logs'
  | 'database';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  navigate: (path: string) => void;
  children: React.ReactNode;
}

interface MenuItem {
  id: AdminTab;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: 'pendingOrders' | 'lowStockCount' | 'activeServiceRequests';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  navigate,
  children,
}) => {
  const { user, role, isAdmin, switchDemoRole } = useAuth();
  const { language, setLanguage, currency, setCurrency, openConverter, t } = useCurrency();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch quick telemetry for live badges
  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        const s = await api.getAdminStats();
        if (isMounted) setStats(s);
      } catch (err) {
        console.error('Failed to load admin stats for badges', err);
      }
    };
    loadStats();
    const interval = setInterval(loadStats, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-amber-200/60 p-8 max-w-md w-full text-center shadow-[0_8px_30px_rgba(245,158,11,0.08)] space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 border border-amber-400/30 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Admin Portal Authorization</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Subbha Bihani Suppliers management portal is restricted to authorized personnel with <code className="bg-amber-50 text-amber-900 border border-amber-200/60 px-1.5 py-0.5 rounded font-mono text-[11px]">ADMIN</code> or <code className="bg-amber-50 text-amber-900 border border-amber-200/60 px-1.5 py-0.5 rounded font-mono text-[11px]">SUPER_ADMIN</code> credentials.
          </p>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => switchDemoRole('ADMIN')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold transition-all shadow-[0_4px_14px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Switch to Admin Persona (1-Click)</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/70 hover:bg-white border border-slate-200 text-slate-700 transition-colors"
            >
              Return to Customer Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', description: 'Business telemetry & metrics', icon: LayoutDashboard },
      ],
    },
    {
      title: 'COMMERCE & LOGISTICS',
      items: [
        { id: 'products', label: 'Product Catalog', description: 'SKUs, categories & pricing', icon: Package },
        { id: 'inventory', label: 'Inventory & Stock', description: 'Thresholds & batch restock', icon: Boxes, badgeKey: 'lowStockCount' },
        { id: 'orders', label: 'Orders & Dispatch', description: 'Customer jobs & fulfillment', icon: ShoppingCart, badgeKey: 'pendingOrders' },
      ],
    },
    {
      title: 'FIELD SERVICES',
      items: [
        { id: 'services', label: 'Service Requests', description: 'Plumbing & electrical jobs', icon: Wrench, badgeKey: 'activeServiceRequests' },
        { id: 'technicians', label: 'Technicians Desk', description: 'Certified personnel roster', icon: Users },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { id: 'customers', label: 'Customer Directory', description: 'Contractors & verified clients', icon: Users },
        { id: 'audit-logs', label: 'Security Audit Trail', description: 'System activities & logs', icon: FileText },
        { id: 'database', label: 'Supabase & Spring', description: 'PostgreSQL DDL & JPA specs', icon: Database },
      ],
    },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  const getBadgeValue = (key?: 'pendingOrders' | 'lowStockCount' | 'activeServiceRequests') => {
    if (!key || !stats) return null;
    const val = stats[key];
    return val && val > 0 ? val : null;
  };

  const currentItem = menuSections
    .flatMap((s) => s.items)
    .find((i) => i.id === currentTab);

  return (
    <div className="min-h-screen bg-[#fafaf8] text-slate-900 flex flex-col antialiased">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Admin Wrapper */}
      <div className="flex flex-1 relative">
        {/* ========================================================================= */}
        {/* LEFT MENU (SIDEBAR) - Professional Yellow-White Transparent Minimal Look */}
        {/* ========================================================================= */}
        <aside
          className={`
            fixed top-0 bottom-0 left-0 z-50
            flex flex-col
            bg-white/85 backdrop-blur-xl
            border-r border-amber-200/50
            shadow-[4px_0_24px_rgba(245,158,11,0.03)]
            transition-all duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${isCollapsed ? 'lg:w-[76px]' : 'w-72 lg:w-72'}
          `}
        >
          {/* Subtle Ambient Golden Halo Accent in Sidebar Background */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-16 left-0 -ml-16 w-36 h-36 bg-yellow-200/20 rounded-full blur-2xl pointer-events-none" />

          {/* Sidebar Top: Logo Branding */}
          <div className="relative p-4 pb-3 border-b border-amber-100/60 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Monogram Badge */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-[0_2px_12px_rgba(245,158,11,0.3)] border border-amber-300/60">
                SBS
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm tracking-tight text-slate-900 truncate">
                      Subbha Bihani
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-900 border border-amber-400/40 shrink-0">
                      ADMIN
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-900/60 truncate font-medium">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                    </span>
                    <span>Industrial Portal</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-amber-50/60 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse / Expand toggle button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/50 text-amber-900/70 hover:text-amber-950 transition-colors shadow-2xs"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Quick Filter / Search (Only when expanded) */}
          {!isCollapsed && (
            <div className="px-4 pt-3 pb-1">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-amber-800/40 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter sections..."
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-amber-50/30 hover:bg-amber-50/60 focus:bg-white border border-amber-200/50 focus:border-amber-400 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-[10px] text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Nav Items List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin scrollbar-thumb-amber-200/50">
            {menuSections.map((section, idx) => {
              const filteredItems = section.items.filter((item) =>
                item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredItems.length === 0) return null;

              return (
                <div key={idx} className="space-y-1">
                  {!isCollapsed && (
                    <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-amber-900/60 uppercase">
                      {section.title}
                    </div>
                  )}

                  <div className="space-y-0.5">
                    {filteredItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;
                      const badgeValue = getBadgeValue(item.badgeKey);

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectTab(item.id)}
                          title={isCollapsed ? `${item.label} - ${item.description}` : undefined}
                          className={`
                            group relative w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-150
                            ${
                              isActive
                                ? 'bg-amber-400/15 border border-amber-400/40 text-amber-950 font-semibold shadow-[0_2px_12px_rgba(245,158,11,0.08)] backdrop-blur-xs'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50/50 hover:border-amber-200/40 border border-transparent font-medium'
                            }
                            ${isCollapsed ? 'justify-center px-2 py-2.5' : ''}
                          `}
                        >
                          {/* Left Accent Bar for Active Item */}
                          {isActive && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-amber-400 to-amber-500 rounded-r-full shadow-xs" />
                          )}

                          {/* Icon */}
                          <div
                            className={`
                              shrink-0 transition-transform duration-150 group-hover:scale-105
                              ${isActive ? 'text-amber-600' : 'text-slate-400 group-hover:text-amber-600'}
                            `}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          {/* Label & Description (Expanded only) */}
                          {!isCollapsed && (
                            <div className="flex-1 text-left min-w-0">
                              <div className="truncate tracking-tight flex items-center justify-between gap-1">
                                <span className={isActive ? 'text-slate-900 font-bold' : 'text-slate-700'}>
                                  {item.label}
                                </span>
                                {badgeValue !== null && (
                                  <span
                                    className={`
                                      px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0
                                      ${
                                        item.badgeKey === 'lowStockCount'
                                          ? 'bg-rose-100/90 text-rose-700 border border-rose-200/70'
                                          : 'bg-amber-100/90 text-amber-900 border border-amber-300/60 shadow-2xs'
                                      }
                                    `}
                                  >
                                    {badgeValue}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 group-hover:text-amber-900/60 truncate font-normal">
                                {item.description}
                              </div>
                            </div>
                          )}

                          {/* Collapsed Badge Dot */}
                          {isCollapsed && badgeValue !== null && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar Footer: Profile & Storefront Exit */}
          <div className="p-3 border-t border-amber-100/70 bg-gradient-to-t from-white via-white/90 to-transparent space-y-2">
            {/* Quick Storefront Link */}
            <button
              onClick={() => navigate('/')}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold
                bg-amber-50/40 hover:bg-amber-100/60 border border-amber-200/50 text-amber-900
                transition-colors shadow-2xs
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}
              title="Return to Customer Storefront"
            >
              <Store className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 text-left flex items-center justify-between">
                  <span>Customer Storefront</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </div>
              )}
            </button>

            {/* User Profile Card */}
            {!isCollapsed ? (
              <div className="p-2 rounded-xl bg-white/70 border border-amber-200/40 flex items-center justify-between gap-2 shadow-2xs backdrop-blur-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center border border-amber-300/60 shrink-0">
                    {user?.name ? user.name[0].toUpperCase() : 'A'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-slate-900 truncate">
                      {user?.name || 'Administrator'}
                    </div>
                    <div className="text-[9px] text-amber-900/60 font-semibold tracking-wider uppercase">
                      {role}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => switchDemoRole('CUSTOMER')}
                  className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors shrink-0"
                  title="Switch to Customer view"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                onClick={() => switchDemoRole('CUSTOMER')}
                className="w-full flex items-center justify-center p-2 rounded-xl bg-white/70 border border-amber-200/40 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Exit Admin"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center justify-center">
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </div>
              </button>
            )}
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN CONTENT WORKSPACE (OFFSET BY SIDEBAR WIDTH) */}
        {/* ========================================================================= */}
        <div
          className={`
            flex-1 flex flex-col min-w-0 transition-all duration-300
            ${isCollapsed ? 'lg:pl-[76px]' : 'lg:pl-72'}
          `}
        >
          {/* Top Header Bar - Minimal Yellow-White Frosted Glass */}
          <header className="sticky top-0 z-30 bg-white/75 backdrop-blur-xl border-b border-amber-200/40 shadow-xs">
            <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
              {/* Left Side: Mobile Menu Button & Breadcrumbs */}
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-xl bg-amber-50/60 border border-amber-200/50 text-slate-700 hover:bg-amber-100 transition-colors"
                  aria-label="Open left menu"
                >
                  <Menu className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0">
                  <span className="hidden sm:inline font-medium text-slate-400">Admin</span>
                  <span className="hidden sm:inline text-slate-300">/</span>
                  <span className="font-bold text-slate-900 truncate">
                    {currentItem?.label || 'Dashboard'}
                  </span>
                </div>
              </div>

              {/* Right Side: Telemetry Pill, Sync Status, Actions */}
              <div className="flex items-center gap-3">
                {/* Live Quick Counters Pill */}
                {stats && (
                  <div className="hidden md:flex items-center gap-2 bg-amber-50/60 border border-amber-200/50 px-3 py-1 rounded-full text-[11px] text-slate-700 font-medium shadow-2xs">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      <strong className="text-amber-950 font-bold">{stats.pendingOrders}</strong> Pending
                    </span>
                    <span className="text-amber-300">•</span>
                    <span className="flex items-center gap-1">
                      <strong className="text-slate-900 font-bold">{stats.lowStockCount}</strong> Low Stock
                    </span>
                  </div>
                )}

                {/* Offline/Online Sync Badge */}
                <SyncStatusBadge />

                {/* Currency & Converter Switcher */}
                <div className="flex items-center gap-1 bg-amber-50/70 border border-amber-200/60 rounded-lg p-0.5 shadow-2xs">
                  <button
                    onClick={() => setCurrency(currency === 'NPR' ? 'USD' : 'NPR')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      currency === 'NPR'
                        ? 'bg-amber-400 text-slate-950 shadow-2xs'
                        : 'text-amber-900/70 hover:text-slate-900'
                    }`}
                    title="Toggle NPR / USD"
                  >
                    रू NPR
                  </button>
                  <button
                    onClick={() => setCurrency(currency === 'USD' ? 'NPR' : 'USD')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      currency === 'USD'
                        ? 'bg-amber-400 text-slate-950 shadow-2xs'
                        : 'text-amber-900/70 hover:text-slate-900'
                    }`}
                    title="Toggle NPR / USD"
                  >
                    $ USD
                  </button>
                  <button
                    onClick={openConverter}
                    className="p-1 text-amber-800 hover:text-amber-950 hover:bg-amber-200/50 rounded transition-colors"
                    title="Open Currency Calculator & Converter"
                  >
                    <ArrowRightLeft className="w-3 h-3" />
                  </button>
                </div>

                {/* Language Switch */}
                <button
                  onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
                  className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 hover:bg-amber-50 border border-amber-200/60 text-slate-700 hover:text-slate-950 text-[11px] font-semibold transition-colors shadow-2xs"
                  title="Switch Language (English / नेपाली)"
                >
                  <Languages className="w-3 h-3 text-amber-600" />
                  <span>{language === 'en' ? 'नेपाली' : 'English'}</span>
                </button>

                {/* Fast Storefront Button */}
                <button
                  onClick={() => navigate('/')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-200 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                  <span>Storefront</span>
                </button>

                {/* Admin Persona Pill */}
                <div
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-400/20 text-amber-950 border border-amber-400/40 shadow-2xs select-none"
                  title={`Signed in with ${role} permissions`}
                >
                  {role}
                </div>
              </div>
            </div>
          </header>

          {/* Main Body Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

