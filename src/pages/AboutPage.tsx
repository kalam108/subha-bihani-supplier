import React from 'react';
import { ShieldCheck, Award, Users, Warehouse, Building2, Truck, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              About Our Enterprise
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
              Subbha Bihani Suppliers
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
              Founded as a premier commercial distribution and contractor service company, Subbha Bihani Suppliers bridges industrial manufacturing standards directly to construction sites, commercial developments, and homeowners.
            </p>
          </div>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-2xl font-bold text-slate-900 leading-snug">
              Specialized Electrical, Plumbing, and Heavy Hardware Solutions
            </h2>
            <p>
              In modern construction and infrastructure, substandard electrical wiring and poor plumbing fittings lead to catastrophic failures, concealed leakages, and fire hazards. Subbha Bihani Suppliers was established with a singular mission: to supply <strong>100% verified, high-spec industrial materials</strong> paired with certified master technicians.
            </p>
            <p>
              We maintain direct supplier authorizations with leading domestic and international manufacturing powerhouses. From 1100V fire-retardant electrolytic copper cables to SDR-11 high-pressure CPVC plumbing systems and structural fasteners, every product in our catalog meets strict ISO and safety criteria.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-2xl font-extrabold text-slate-900">5,000+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Catalog SKUs In Stock</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-2xl font-extrabold text-slate-900">100%</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Certified Genuine Goods</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200 space-y-6">
            <h3 className="font-bold text-slate-900 text-base">Our Quality Guarantees</h3>

            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-sky-600 text-white shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">Batch-Tested Materials</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  We supply test certificates for copper conductivity, pressure burst thresholds, and flame resistance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-sky-600 text-white shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">Licensed Contractor Network</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Over 30 vetted electricians and plumbers with verified state trade licenses and continuous safety training.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-sky-600 text-white shrink-0">
                <Warehouse className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">Depot Distribution Infrastructure</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Centralized warehouse logistics enabling rapid truckload deliveries to job sites within hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership / Commitment */}
      <section className="bg-slate-50 border-t border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Partner with Subbha Bihani Suppliers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 mb-6">
            Whether you need a commercial project bill-of-materials quote or on-site technician dispatch, our engineering desk is ready.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate('/products')}
              className="px-5 py-2.5 bg-slate-900 hover:bg-sky-700 text-white text-xs font-semibold rounded-md transition-colors"
            >
              Browse Supply Catalog
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-md transition-colors"
            >
              Contact Sales & Dispatch
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
