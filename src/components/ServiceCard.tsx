import React from 'react';
import { Clock, Tag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ServiceItem } from '../types';
import { useCurrency } from '../context/LanguageCurrencyContext';

interface ServiceCardProps {
  service: ServiceItem;
  onBook: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  const { currency, exchangeRate, formatMoney, t } = useCurrency();

  // Convert rate string like "$45 / visit" into "रू 6,050 / visit" if NPR
  const formatRate = (rateStr: string) => {
    if (currency === 'USD') return rateStr;
    return rateStr.replace(/\$(\d+(\.\d+)?)/g, (_, numStr) => {
      const val = parseFloat(numStr);
      return formatMoney(val);
    });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between h-full">
      <div>
        <div className="relative h-44 bg-slate-100 overflow-hidden">
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2.5 left-2.5">
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase border shadow-xs ${
                service.category === 'Electrical'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-sky-50 text-sky-800 border-sky-200'
              }`}
            >
              {service.category}
            </span>
          </div>

          {service.popular && (
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-900 text-white shadow-xs">
              High Demand
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-bold text-slate-900 text-base leading-snug">
            {service.name}
          </h3>
          <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Pricing and time metadata */}
          <div className="mt-3 flex items-center justify-between text-xs py-2 px-2.5 rounded bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <Tag className="w-3.5 h-3.5 text-sky-600" />
              <span>{formatRate(service.standardRate)}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{service.estimatedDuration}</span>
            </div>
          </div>

          {/* Common issues handled */}
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Typical Jobs
            </div>
            <div className="space-y-1">
              {service.commonIssues.map((issue, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{issue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={() => onBook(service)}
          className="w-full py-2 px-3 rounded-md text-xs font-semibold bg-slate-900 hover:bg-sky-700 text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <span>{t('requestService')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
