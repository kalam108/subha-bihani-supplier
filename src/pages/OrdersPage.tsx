import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle2, ChevronRight, Truck, MapPin, CreditCard, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/LanguageCurrencyContext';
import { StatusBadge } from '../components/StatusBadge';

interface OrdersPageProps {
  navigate: (path: string) => void;
  newOrderNumber?: string | null;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ navigate, newOrderNumber }) => {
  const { user } = useAuth();
  const { formatMoney, t } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
      if (newOrderNumber) {
        const found = data.find((o) => o.orderNumber === newOrderNumber);
        if (found) setSelectedOrder(found);
      } else if (data.length > 0 && !selectedOrder) {
        setSelectedOrder(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ALL') return true;
    return o.orderStatus === filterStatus;
  });

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'CONFIRMED': return 1;
      case 'PROCESSING': return 2;
      case 'READY': return 3;
      case 'OUT_FOR_DELIVERY': return 4;
      case 'COMPLETED': return 5;
      case 'CANCELLED': return -1;
      default: return 0;
    }
  };

  const steps = [
    'Placed',
    'Confirmed',
    'Processing',
    'Ready',
    'Out for Delivery',
    'Completed',
  ];

  return (
    <div className="bg-slate-50/40 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
              Procurement History
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Track Your Orders</h1>
            <p className="text-xs text-slate-500 mt-1">
              Live status tracking, jobsite dispatch records, and itemized billing.
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors self-start sm:self-auto shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 text-xs">
          {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'OUT_FOR_DELIVERY', 'COMPLETED'].map((st) => (
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

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No orders found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              You haven&apos;t placed any orders under this filter criteria.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-sky-700 transition-colors"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Orders List */}
            <div className="lg:col-span-5 space-y-3">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-sky-600 ring-1 ring-sky-500 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-mono font-bold text-sm text-slate-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      <StatusBadge status={order.orderStatus} />
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {order.items.length} item{order.items.length === 1 ? '' : 's'}
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatMoney(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Order Detail */}
            {selectedOrder && (
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Selected Order</span>
                    <h2 className="text-xl font-bold font-mono text-slate-900">
                      {selectedOrder.orderNumber}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedOrder.orderStatus} />
                  </div>
                </div>

                {/* Tracking Stepper */}
                {selectedOrder.orderStatus !== 'CANCELLED' && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-sky-600" />
                      <span>Order Fulfillment Progress</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[11px]">
                      {steps.map((label, idx) => {
                        const curIdx = getStepIndex(selectedOrder.orderStatus);
                        const isDone = idx <= curIdx;
                        const isCurrent = idx === curIdx;
                        return (
                          <div key={label} className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-colors ${
                                isCurrent
                                  ? 'bg-sky-600 text-white ring-2 ring-sky-200'
                                  : isDone
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span className={`font-medium ${isDone ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Purchased Supplies
                  </h3>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between gap-4 bg-white">
                        <div>
                          <div className="font-semibold text-slate-900">{item.productName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            SKU: {item.sku} • {item.quantity} {item.unit || 'pcs'} × {formatMoney(item.price)}
                          </div>
                        </div>
                        <div className="font-bold text-slate-900 text-sm">
                          {formatMoney(item.quantity * item.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/80 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>{t('subtotal')}</span>
                    <span className="font-medium text-slate-900">{formatMoney(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('vatTax')}</span>
                    <span className="font-medium text-slate-900">{formatMoney(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('shipping')}</span>
                    <span className="font-medium text-slate-900">
                      {selectedOrder.shipping === 0 ? 'Free' : formatMoney(selectedOrder.shipping)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-sm text-slate-900">
                    <span>{t('total')}</span>
                    <span className="text-base text-slate-900">{formatMoney(selectedOrder.totalAmount)}</span>
                  </div>
                </div>

                {/* Delivery & Payment Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-600" />
                      <span>Jobsite Destination</span>
                    </div>
                    <p className="text-slate-700">{selectedOrder.customerName}</p>
                    <p className="text-slate-500">{selectedOrder.shippingAddress}, {selectedOrder.city}</p>
                    <p className="text-slate-500 font-mono text-[11px] mt-0.5">{selectedOrder.customerPhone}</p>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                      <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                      <span>Payment Info</span>
                    </div>
                    <p className="text-slate-700 font-medium">{selectedOrder.paymentMethod.replace(/_/g, ' ')}</p>
                    <p className="text-slate-500">
                      Payment Status: <strong className="text-slate-800">{selectedOrder.paymentStatus}</strong>
                    </p>
                    {selectedOrder.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1">&ldquo;{selectedOrder.notes}&rdquo;</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
