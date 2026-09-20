import React from 'react';
import { ShieldCheck, Truck, Clock, Wrench, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      {/* Value Pillars Banner */}
      <div className="border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-slate-800 text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Genuine Supplies</h4>
              <p className="text-xs text-slate-400 mt-1">Direct from certified electrical & plumbing manufacturers.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-slate-800 text-sky-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Certified Technicians</h4>
              <p className="text-xs text-slate-400 mt-1">Licensed electricians and master plumbers on demand.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-slate-800 text-sky-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Fast Jobsite Delivery</h4>
              <p className="text-xs text-slate-400 mt-1">Same-day dispatch for contractors and urgent repairs.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-slate-800 text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Emergency Breakdown</h4>
              <p className="text-xs text-slate-400 mt-1">Rapid response for burst pipes, short circuits & faults.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center p-1">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                  <polygon points="50,15 82,33 82,67 50,85 18,67 18,33" stroke="#0f172a" strokeWidth="6" strokeLinejoin="round" />
                  <path d="M52 24 L36 50 L48 50 L44 76 L64 48 L52 48 Z" fill="#0284c7" />
                </svg>
              </div>
              <span className="font-bold text-white text-base">Subbha Bihani Suppliers</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premier commercial distributor of certified electrical wiring, high-pressure CPVC/PPR plumbing pipelines, heavy-duty industrial hardware, and expert contractor field services.
            </p>
            <div className="text-xs text-slate-400 space-y-1.5 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Commercial Complex, Main Highway, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>+977 984-1234567 / (021) 534890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>orders@subbhabihani.com</span>
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Supply Catalog</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/products?category=cat-elec')} className="hover:text-white transition-colors">
                  Electrical (Wires, Breakers & Panels)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/products?category=cat-plumb')} className="hover:text-white transition-colors">
                  Plumbing (CPVC, PPR & SWR Pipes)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/products?category=cat-hard')} className="hover:text-white transition-colors">
                  Hardware & High-Grade Fasteners
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/products?category=cat-tools')} className="hover:text-white transition-colors">
                  Power & Insulated Hand Tools
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/products?category=cat-elec-acc')} className="hover:text-white transition-colors">
                  Modular Sockets & Conduit Ducts
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Contractor Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/services')} className="hover:text-white transition-colors">
                  Main Distribution & Panel Installation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="hover:text-white transition-colors">
                  Short Circuit & Fault Diagnosis
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="hover:text-white transition-colors">
                  Acoustic Water Leakage Detection
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="hover:text-white transition-colors">
                  Sanitary Fitting & Bathroom Remodel
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="hover:text-white transition-colors">
                  Emergency Pipeline Burst Repairs
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Info & Portal */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                  About Our Enterprise
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                  Contact & Jobsite Quote
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/orders')} className="hover:text-white transition-colors">
                  Track Existing Order
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/service-requests')} className="hover:text-white transition-colors">
                  Check Service Ticket Status
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                  Admin Management Portal (/admin)
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Subbha Bihani Suppliers. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span>Licensed Commercial Supplier</span>
            <span>VAT / PAN Registered</span>
            <span>PWA Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
