import React, { useEffect, useState } from 'react';
import {
  Wrench,
  Zap,
  Droplets,
  Hammer,
  ShieldCheck,
  Truck,
  Clock,
  ArrowRight,
  Search,
  CheckCircle2,
  PhoneCall,
  Flame,
  Award,
} from 'lucide-react';
import { Product, ServiceItem } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ServiceCard } from '../components/ServiceCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { BookServiceModal } from '../components/BookServiceModal';
import { useCurrency } from '../context/LanguageCurrencyContext';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { formatMoney, t } = useCurrency();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [serviceToBook, setServiceToBook] = useState<ServiceItem | null>(null);
  const [heroSearch, setHeroSearch] = useState('');
  const [activeServiceTab, setActiveServiceTab] = useState<'All' | 'Electrical' | 'Plumbing'>('All');

  useEffect(() => {
    api.getProducts({ featured: true }).then((prods) => setFeaturedProducts(prods.slice(0, 6)));
    api.getServices().then((srvs) => setServices(srvs));
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const filteredServices = services.filter((s) => {
    if (activeServiceTab === 'All') return true;
    return s.category === activeServiceTab;
  });

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION - Minimal, Modern, Professional */}
      <section className="relative border-b border-slate-200 bg-linear-to-b from-slate-50 via-white to-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>Commercial Distributor & Licensed Field Contractors</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                High-Grade Supplies & Certified Field Services
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                Subbha Bihani Suppliers delivers certified electrical cables, heavy-duty switchgear, CPVC/PPR pressure pipelines, and hardware to contractors, commercial sites, and residential builders — backed by licensed technician dispatch.
              </p>

              {/* Fast Search Input */}
              <form onSubmit={handleHeroSearch} className="max-w-xl">
                <div className="relative flex items-center shadow-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search 1,000+ items (e.g. 32A MCB, CPVC pipe, Bosch drill, copper cable)..."
                    className="w-full pl-10 pr-28 py-3 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-2 bg-slate-900 hover:bg-sky-700 text-white rounded-md text-xs font-semibold transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick Category Jump Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Quick categories:</span>
                <button
                  onClick={() => navigate('/products?category=cat-elec')}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-slate-400 font-medium transition-colors"
                >
                  ⚡ Electrical
                </button>
                <button
                  onClick={() => navigate('/products?category=cat-plumb')}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-slate-400 font-medium transition-colors"
                >
                  💧 Plumbing
                </button>
                <button
                  onClick={() => navigate('/products?category=cat-hard')}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-slate-400 font-medium transition-colors"
                >
                  🔩 Hardware
                </button>
                <button
                  onClick={() => navigate('/products?category=cat-tools')}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-slate-400 font-medium transition-colors"
                >
                  🛠️ Tools
                </button>
              </div>
            </div>

            {/* Quick Service Dispatch Box */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-sky-50 text-sky-700">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Need a Licensed Technician?</h3>
                      <p className="text-[11px] text-slate-500">Same-day dispatch for repairs & installations</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="font-medium text-slate-700">Electrical Wiring & MCBs</span>
                    <span className="font-semibold text-slate-900">from {formatMoney(35)}</span>
                  </div>
                  <div className="p-2.5 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="font-medium text-slate-700">Concealed Leakage & Pipe Burst</span>
                    <span className="font-semibold text-slate-900">from {formatMoney(30)}</span>
                  </div>
                  <div className="p-2.5 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="font-medium text-slate-700">Sanitary & Tap Mixer Overhaul</span>
                    <span className="font-semibold text-slate-900">from {formatMoney(20)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigate('/services')}
                    className="w-full py-2.5 px-4 rounded-md text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <span>Schedule Field Service Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Vetted Technicians
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Transparent Rates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN PRODUCT CATEGORIES */}
      <section className="py-14 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
                Industrial & Domestic Supply
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Explore Core Categories
              </h2>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
            >
              <span>View All 7 Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { id: 'cat-elec', label: 'Electrical', count: '8 items', icon: Zap, color: 'text-amber-500' },
              { id: 'cat-plumb', label: 'Plumbing', count: '8 items', icon: Droplets, color: 'text-sky-500' },
              { id: 'cat-hard', label: 'Hardware', count: '6 items', icon: Hammer, color: 'text-slate-700' },
              { id: 'cat-tools', label: 'Tools', count: '6 items', icon: Wrench, color: 'text-emerald-600' },
              { id: 'cat-elec-acc', label: 'Switchgear', count: '5 items', icon: Zap, color: 'text-indigo-600' },
              { id: 'cat-plumb-acc', label: 'Valves & Seals', count: '5 items', icon: Droplets, color: 'text-cyan-600' },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/products?category=${cat.id}`)}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs text-left transition-all group"
                >
                  <div className={`w-9 h-9 rounded-md bg-white border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-xs sm:text-sm group-hover:text-sky-700 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{cat.count}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="py-14 border-b border-slate-200 bg-slate-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
                Direct Distributor Stocks
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Featured Equipment & Supplies
              </h2>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="text-xs font-semibold text-slate-800 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Explore Entire Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(prod) => setSelectedProduct(prod)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. MAIN CONTRACTOR SERVICES BREAKDOWN */}
      <section className="py-16 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
              Licensed Field Support
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5">
              Certified Electrical & Plumbing Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              From commercial 3-phase board wiring to high-pressure pipeline repair, our master electricians and plumbers are available with transparent fixed hourly and point-based tariffs.
            </p>

            {/* Filter Pills */}
            <div className="flex justify-center items-center gap-2 mt-6">
              {(['All', 'Electrical', 'Plumbing'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveServiceTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeServiceTab === tab
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab === 'All' ? 'All Services' : `${tab} Services`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.slice(0, 6).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={(srv) => setServiceToBook(srv)}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200"
            >
              <span>View All 12 Service Programs & Request Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE SUBBHA BIHANI SUPPLIERS */}
      <section className="py-16 border-b border-slate-200 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10">
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
              Commercial Assurance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Why Building Professionals Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Direct Factory Channel</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Authorized distribution tier for Schneider, Astral, Havells, Supreme, and Bosch. We guarantee genuine products with manufacturer test certificates and warranty cards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Licensed & Insured Crews</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our technicians hold official electrical and plumbing trade licenses with minimum 5+ years of commercial jobsite experience. Every service request is digitally tracked with real-time status.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Rapid Jobsite Logistics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never halt your site work waiting for fittings. We stock over 5,000 SKUs in our central warehouse with scheduled contractor delivery and emergency on-site breakdown support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EMERGENCY CTA BANNER */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">Have an urgent water leakage or electrical breakdown?</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Our emergency response unit provides priority dispatch within 60 minutes for active safety hazards.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:+9779841234567"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call +977 984-1234567</span>
              </a>
              <button
                onClick={() => navigate('/services')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <span>Book Online Ticket</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <BookServiceModal
        service={serviceToBook}
        onClose={() => setServiceToBook(null)}
        onSuccess={(req, wasOffline) => {
          setServiceToBook(null);
          navigate('/service-requests');
        }}
      />
    </div>
  );
};
