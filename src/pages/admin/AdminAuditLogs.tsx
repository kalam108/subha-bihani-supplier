import React, { useEffect, useState } from 'react';
import { FileText, Shield, Clock, RefreshCw, User } from 'lucide-react';
import { AuditLog } from '../../types';
import { api } from '../../services/api';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
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
          <h2 className="text-xl font-bold text-slate-900">Security & Administrative Audit Trail</h2>
          <p className="text-xs text-slate-500">
            Immutable log of state changes, dispatch assignments, and catalog edits.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Target Entity</th>
                <th className="p-3">Performed By</th>
                <th className="p-3">Details / Change Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-medium text-slate-800">
                    {log.entityType} ({log.entityId})
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5 font-medium text-slate-900">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{log.performedBy}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-600">
                    <pre className="font-mono text-[11px] whitespace-pre-wrap bg-slate-50 p-1.5 rounded border border-slate-100">
                      {JSON.stringify(log.details)}
                    </pre>
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
