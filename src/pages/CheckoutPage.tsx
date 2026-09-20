import React, { useState } from 'react';
import { ShieldCheck, Truck, CreditCard, Banknote, Building2, Store, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/LanguageCurrencyContext';
import { api } from '../services/api';
import { PaymentMethod } from '../types';

interface CheckoutPageProps {
  navigate: (path: string) => void;
  onOrderComplete: (orderNumber: string, wasOffline?: boolean) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate, onOrderComplete }) => {
  const { cart, subtotal, tax, shipping, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { currency, formatMoney, t } = useCurrency();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [city, setCity] = useState('Kathmandu');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName || !customerPhone || !shippingAddress) {
      setErrorMessage('Please fill in all mandatory delivery fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerId: user?.id || 'guest-1',
        customerName,
        customerEmail: customerEmail || 'customer@example.com',
        customerPhone,
        shippingAddress,
        city,
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          sku: item.product.sku,
          price: item.product.price,
          quantity: item.quantity,
          unit: item.product.unit,
        })),
        subtotal,
        tax,
        shipping,
        totalAmount,
        paymentMethod,
        notes,
      };

      const { order, queuedOffline } = await api.createOrder(orderPayload);
      clearCart();
      onOrderComplete(order.orderNumber, queuedOffline);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50/40 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate('/cart')}
            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
              Procurement Process
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Secure Checkout</h1>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer & Delivery Information */}
          <div className="lg:col-span-8 space-y-6">
            {/* Delivery Details */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-600" />
                <span>Jobsite / Delivery Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Thapa"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone Number (Mobile) *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Street Address / Site Location *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Plot #, Building name, Ward number, Street name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">City / Region *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Biratnagar">Biratnagar</option>
                    <option value="Other">Other Municipality</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Order Notes / Gate Access</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Unload at Basement B2, call on arrival"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-sky-600" />
                <span>Payment Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    id: 'CASH_ON_DELIVERY',
                    title: 'Cash on Jobsite Delivery',
                    desc: 'Pay cash or card to the dispatch driver on receipt',
                    icon: Banknote,
                  },
                  {
                    id: 'BANK_TRANSFER',
                    title: 'Direct Corporate Bank Wire',
                    desc: 'Invoice emailed for NEFT/RTGS bank transfer',
                    icon: Building2,
                  },
                  {
                    id: 'DIGITAL_WALLET',
                    title: 'Digital Wallet / QR Pay',
                    desc: 'Instant QR code payment via eSewa / Khalti / Fonepay',
                    icon: CreditCard,
                  },
                  {
                    id: 'STORE_PICKUP',
                    title: 'Warehouse Counter Pickup',
                    desc: 'Collect directly at Biratnagar / Kathmandu depot',
                    icon: Store,
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <label
                      key={m.id}
                      className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50/50 shadow-xs ring-1 ring-sky-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.id}
                        checked={isSelected}
                        onChange={() => setPaymentMethod(m.id as PaymentMethod)}
                        className="mt-0.5 text-sky-600 focus:ring-sky-500"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-slate-500" />
                          <span>{m.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Order Summary */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {t('orderSummary')}
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono">
                {currency}
              </span>
            </div>

            {/* Compact items list */}
            <div className="max-h-48 overflow-y-auto space-y-2 divide-y divide-slate-100 text-xs">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-2 first:pt-0 flex justify-between gap-2">
                  <div>
                    <span className="font-medium text-slate-800 line-clamp-1">{item.product.name}</span>
                    <span className="text-[11px] text-slate-500">
                      {item.quantity} × {formatMoney(item.product.price)}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900 shrink-0">
                    {formatMoney(item.quantity * item.product.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-slate-900">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('vatTax')}</span>
                <span className="font-semibold text-slate-900">{formatMoney(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('shipping')}</span>
                <span className="font-semibold text-slate-900">
                  {shipping === 0 ? 'Free' : formatMoney(shipping)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">{t('total')}</span>
              <span className="text-xl font-extrabold text-slate-900">{formatMoney(totalAmount)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-sky-700 text-white font-semibold text-xs rounded-md flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {isSubmitting ? (
                <span>Registering Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Place Order ({formatMoney(totalAmount)})</span>
                </>
              )}
            </button>

            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <p>• Commercial tax invoice issued with PAN / VAT credentials.</p>
              <p>• Order can be tracked live in your account portal.</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
