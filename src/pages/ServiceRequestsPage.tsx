import React, { useEffect, useState } from 'react';
import { Wrench, Calendar, Clock, MapPin, User, Phone, CheckCircle2, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { ServiceRequest } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

interface ServiceRequestsPageProps {
  navigate: (path: string) => void;
}

export const ServiceRequestsPage: React.FC<ServiceRequestsPageProps> = ({ navigate }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await api.getServiceRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = requests.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="bg-slate-50/40 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
              Field Operations
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Service Ticket Tracking</h1>
            <p className="text-xs text-slate-500 mt-1">
              Live status, technician assignment, and scheduled appointment windows.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-slate-900 text-white hover:bg-sky-700 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book New Service</span>
            </button>

            <button
              onClick={loadRequests}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 text-xs">
          {['ALL', 'PENDING', 'TECHNICIAN_ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                filterStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
            <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No service requests found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              You do not have any registered service tickets matching the filter.
            </p>
            <button
              onClick={() => navigate('/services')}
              className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-sky-700 transition-colors"
            >
              Explore Services & Book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-sky-700">
                        {req.ticketNumber}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                        {req.serviceName}
                      </h3>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        {req.category}
                      </span>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>

                  {/* Problem Description */}
                  <div className="mt-3">
                    <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                      &ldquo;{req.description}&rdquo;
                    </p>
                  </div>

                  {/* Schedule & Location */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{req.preferredDate} ({req.preferredTimeSlot})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{req.address}, {req.city}</span>
                    </div>
                  </div>
                </div>

                {/* Assigned Technician or Pending Notice */}
                <div className="pt-3 border-t border-slate-100">
                  {req.assignedTechnicianName ? (
                    <div className="p-3 bg-sky-50 rounded-lg border border-sky-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] font-semibold text-sky-800 uppercase tracking-wider">
                          Assigned Field Technician
                        </div>
                        <div className="font-bold text-slate-900 mt-0.5">
                          {req.assignedTechnicianName}
                        </div>
                        {req.assignedTechnicianPhone && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono mt-0.5">
                            <Phone className="w-3 h-3 text-sky-600" />
                            <span>{req.assignedTechnicianPhone}</span>
                          </div>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-200 text-sky-900">
                        Assigned
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                      <span>Awaiting dispatch coordinator assignment</span>
                      <span className="text-[10px] font-semibold text-slate-400">Queueing</span>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Registered: {new Date(req.createdAt).toLocaleDateString()}</span>
                    {req.estimatedCost && (
                      <span className="font-semibold text-slate-700">Est: {req.estimatedCost}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
