import React, { useEffect, useState } from 'react';
import { Users, Phone, Mail, Star, Wrench, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Technician, TechnicianStatus } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';

export const AdminTechnicians: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTechnicians();
  }, []);

  const loadTechnicians = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTechnicians();
      setTechnicians(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (techId: string, currentStatus: TechnicianStatus) => {
    const nextStatus: TechnicianStatus =
      currentStatus === 'AVAILABLE' ? 'BUSY' : currentStatus === 'BUSY' ? 'OFFLINE' : 'AVAILABLE';

    try {
      const updated = await api.updateTechnicianStatus(techId, nextStatus);
      setTechnicians((prev) => prev.map((t) => (t.id === techId ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Contractor Roster & Field Crew</h2>
          <p className="text-xs text-slate-500">
            Licensed electricians and plumbers available for jobsite dispatch.
          </p>
        </div>

        <button
          onClick={loadTechnicians}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Crew</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {technicians.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{t.name}</h3>
                    <span className="text-[11px] font-semibold text-sky-700">{t.trade}</span>
                  </div>
                </div>
                <StatusBadge status={t.status} />
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{t.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{t.email}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{t.rating}</span>
                </div>
                <div className="text-slate-500">
                  <strong className="text-slate-800">{t.completedJobs}</strong> jobs done
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleStatusToggle(t.id, t.status)}
                className="w-full py-1.5 px-3 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200"
              >
                Toggle Status: {t.status}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
