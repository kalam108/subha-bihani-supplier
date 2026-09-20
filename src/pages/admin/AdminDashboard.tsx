import React, { useEffect, useState } from 'react';
import {
  Users,
  Package,
  ShoppingCart,
  Clock,
  Wrench,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { AdminStats, Order, ServiceRequest } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { useCurrency } from '../../context/LanguageCurrencyContext';
import { AdminTab } from './AdminLayout';

export const AdminDashboard: React.FC<{ onNavigateTab: (tab: AdminTab) => void }> = ({
  onNavigateTab,
}) => {
  const { formatMoney, currency } = useCurrency();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentRequests, setRecentRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [s, o, r] = await Promise.all([
        api.getAdminStats(),
        api.getOrders(),
        api.getServiceRequests(),
      ]);
      setStats(s);
      setRecentOrders(o.slice(0, 5));
      setRecentRequests(r.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-semibold text-slate-600">Loading live business telemetry...</p>
      </div>
    );
  }

  const kpis = [
    { label: `Total Revenue (${currency})`, value: formatMoney(stats.totalRevenue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Service Requests', value: stats.totalServiceRequests ?? stats.activeServiceRequests, icon: Wrench, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-slate-700', bg: 'bg-slate-100' },
    { label: 'Low Stock Alerts', value: stats.lowStockCount, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Available Technicians', value: stats.availableTechnicians, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Registered Customers', value: stats.totalCustomers, icon: Users, color: 'text-sky-600', bg: 'bg-sky-50' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  {kpi.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {kpi.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Alerts */}
      {stats.lowStockCount > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-bold text-xs text-rose-900">
                Inventory Alert: {stats.lowStockCount} product(s) below minimum reorder threshold
              </h4>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Review warehouse levels to avoid contractor jobsite delivery backorders.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            Review & Restock
          </button>
        </div>
      )}

      {/* Two-Column Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-sky-600" />
                <span>Recent Customer Orders</span>
              </h3>
              <button
                onClick={() => onNavigateTab('orders')}
                className="text-xs text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-mono font-semibold text-slate-900">
                      {order.orderNumber}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {order.customerName} • {order.items.length} items
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 mb-0.5">
                      {formatMoney(order.totalAmount)}
                    </div>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Service Requests */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Wrench className="w-4 h-4 text-sky-600" />
                <span>Incoming Field Service Requests</span>
              </h3>
              <button
                onClick={() => onNavigateTab('services')}
                className="text-xs text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1"
              >
                <span>Dispatch Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentRequests.map((req) => (
                <div key={req.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-mono font-semibold text-sky-700">
                      {req.ticketNumber}
                    </div>
                    <div className="font-medium text-slate-900">{req.serviceName}</div>
                    <div className="text-[11px] text-slate-500">
                      {req.customerName} ({req.city})
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={req.status} />
                    <div className="text-[11px] text-slate-400 mt-1">
                      {req.assignedTechnicianName || 'Unassigned'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
