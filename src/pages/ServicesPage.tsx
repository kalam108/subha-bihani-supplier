import React, { useEffect, useState } from 'react';
import { Wrench, Zap, Droplets, Clock, CheckCircle2, ShieldCheck, ArrowRight, CalendarCheck } from 'lucide-react';
import { ServiceItem } from '../types';
import { api } from '../services/api';
import { ServiceCard } from '../components/ServiceCard';
import { BookServiceModal } from '../components/BookServiceModal';

interface ServicesPageProps {
  navigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Electrical' | 'Plumbing'>('All');
  const [serviceToBook, setServiceToBook] = useState<ServiceItem | null>(null);
  const [bookedNotification, setBookedNotification] = useState<{ ticketNumber: string; wasOffline?: boolean } | null>(null);

  useEffect(() => {
    api.getServices().then((data) => setServices(data));
  }, []);

  const electricalServices = services.filter((s) => s.category === 'Electrical');
  const plumbingServices = services.filter((s) => s.category === 'Plumbing');

  const displayedServices = services.filter((s) => {
    if (activeTab === 'All') return true;
    return s.category === activeTab;
  });

  return (
    <div className="bg-slate-50/40 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
              Licensed Field Engineering
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Electrical & Plumbing Services
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Certified technicians dispatched for scheduled installations, safety testing, and emergency repairs across residential, commercial, and construction sites.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/service-requests')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Track Service Tickets</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner if just booked */}
        {bookedNotification && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">
                  Service Ticket Registered Successfully!
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Ticket Reference: <strong className="font-mono">{bookedNotification.ticketNumber}</strong>
                  {bookedNotification.wasOffline && (
                    <span className="ml-1 text-amber-700 font-medium">
                      (Saved offline — will automatically sync to dispatch center when back online)
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/service-requests')}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-semibold"
            >
              View Ticket Status
            </button>
          </div>
        )}

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab('All')}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Programs ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('Electrical')}
            className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'Electrical'
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Electrical Services ({electricalServices.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('Plumbing')}
            className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'Plumbing'
                ? 'bg-sky-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span>Plumbing Services ({plumbingServices.length})</span>
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onBook={(srv) => setServiceToBook(srv)}
            />
          ))}
        </div>

        {/* Workflow Explanation Banner */}
        <div className="mt-14 bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="font-bold text-slate-900 text-lg">How Field Service Dispatch Works</h3>
            <p className="text-xs text-slate-500 mt-1">
              End-to-end transparent service delivery with verified technician assignment and digital tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center mx-auto">
                1
              </div>
              <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">Submit Request</h4>
              <p className="text-xs text-slate-500">
                Choose service, select your preferred date & time window, and enter job location.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center mx-auto">
                2
              </div>
              <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">Technician Assigned</h4>
              <p className="text-xs text-slate-500">
                Admin review assigns a dedicated trade technician (available/busy status checked).
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center mx-auto">
                3
              </div>
              <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">On-Site Execution</h4>
              <p className="text-xs text-slate-500">
                Technician arrives equipped with testing gear and standard factory replacement parts.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center mx-auto">
                4
              </div>
              <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">Quality Signoff</h4>
              <p className="text-xs text-slate-500">
                Ticket completed with warranty receipt and transparent final invoice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookServiceModal
        service={serviceToBook}
        onClose={() => setServiceToBook(null)}
        onSuccess={(req, wasOffline) => {
          setServiceToBook(null);
          setBookedNotification({ ticketNumber: req.ticketNumber, wasOffline });
        }}
      />
    </div>
  );
};
