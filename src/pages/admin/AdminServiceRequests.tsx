import React, { useEffect, useState } from 'react';
import { Wrench, UserCheck, Calendar, Clock, MapPin, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ServiceRequest, ServiceRequestStatus, Technician } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';

export const AdminServiceRequests: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reqs, techs] = await Promise.all([
        api.getServiceRequests(),
        api.getTechnicians(),
      ]);
      setRequests(reqs);
      setTechnicians(techs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignTechnician = async (requestId: string, techId: string) => {
    const tech = technicians.find((t) => t.id === techId);
    if (!tech) return;

    try {
      const updated = await api.updateServiceRequest(requestId, {
        assignedTechnicianId: tech.id,
        assignedTechnicianName: tech.name,
        assignedTechnicianPhone: tech.phone,
        status: 'TECHNICIAN_ASSIGNED',
      });
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: ServiceRequestStatus) => {
    try {
      const updated = await api.updateServiceRequest(requestId, { status: newStatus });
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = requests.filter((r) => {
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    return true;
  });

  const statuses: ServiceRequestStatus[] = [
    'PENDING',
    'TECHNICIAN_ASSIGNED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Field Service Dispatch Desk</h2>
          <p className="text-xs text-slate-500">
            Assign certified electrical and plumbing contractors to active tickets.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Tickets</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Ticket & Service</th>
                <th className="p-3">Customer & Location</th>
                <th className="p-3">Appointment Window</th>
                <th className="p-3">Issue Scope</th>
                <th className="p-3">Assigned Crew</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Dispatch Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <div className="font-mono font-bold text-sky-700">{req.ticketNumber}</div>
                    <div className="font-semibold text-slate-900 mt-0.5">{req.serviceName}</div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {req.category}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-900">{req.customerName}</div>
                    <div className="text-[11px] text-slate-500">{req.address}, {req.city}</div>
                    <div className="text-[11px] font-mono text-slate-400">{req.customerPhone}</div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{req.preferredDate}</div>
                    <div className="text-[11px] text-slate-500">{req.preferredTimeSlot}</div>
                  </td>
                  <td className="p-3 max-w-xs">
                    <p className="line-clamp-2 text-slate-600 italic">&ldquo;{req.description}&rdquo;</p>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {req.assignedTechnicianName ? (
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          {req.assignedTechnicianName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {req.assignedTechnicianPhone}
                        </span>
                      </div>
                    ) : (
                      <span className="text-amber-600 font-semibold text-[11px]">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="p-3 text-right space-y-1.5">
                    {/* Assign Technician selector */}
                    <div>
                      <select
                        value={req.assignedTechnicianId || ''}
                        onChange={(e) => handleAssignTechnician(req.id, e.target.value)}
                        className="px-2 py-1 text-[11px] border border-slate-300 rounded bg-white text-slate-800 max-w-[140px]"
                      >
                        <option value="">Assign Crew...</option>
                        {technicians.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.status === 'AVAILABLE' ? 'Free' : t.status})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status Changer */}
                    <div>
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value as ServiceRequestStatus)}
                        className="px-2 py-1 text-[11px] font-semibold border border-slate-300 rounded bg-white text-slate-800"
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
