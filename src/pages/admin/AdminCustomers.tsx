import React, { useEffect, useState } from 'react';
import { Users, Mail, Phone, MapPin, RefreshCw, Shield } from 'lucide-react';
import { User } from '../../types';
import { api } from '../../services/api';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Commercial Clients & Accounts</h2>
          <p className="text-xs text-slate-500">
            Registered builders, contractors, and retail accounts.
          </p>
        </div>

        <button
          onClick={loadCustomers}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Contact Phone</th>
                <th className="p-3">Default Delivery Address</th>
                <th className="p-3">Role</th>
                <th className="p-3">Registered Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{c.name}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-slate-600">{c.email}</td>
                  <td className="p-3 font-mono text-slate-600">{c.phone || '—'}</td>
                  <td className="p-3 text-slate-500 max-w-xs truncate">{c.address || '—'}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        c.role === 'ADMIN' || c.role === 'SUPER_ADMIN'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {c.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">
                    {new Date(c.createdAt).toLocaleDateString()}
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
