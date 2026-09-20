import React from 'react';
import { OrderStatus, ServiceRequestStatus, TechnicianStatus } from '../types';

export const StatusBadge: React.FC<{
  status: OrderStatus | ServiceRequestStatus | TechnicianStatus | string;
  type?: 'order' | 'service' | 'technician';
}> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'COMPLETED':
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CONFIRMED':
      case 'ACCEPTED':
      case 'TECHNICIAN_ASSIGNED':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'PROCESSING':
      case 'IN_PROGRESS':
      case 'BUSY':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'READY':
      case 'OUT_FOR_DELIVERY':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'PENDING':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'CANCELLED':
      case 'OFFLINE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatText = (text: string) => {
    return text.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyle()}`}
    >
      {formatText(status)}
    </span>
  );
};
