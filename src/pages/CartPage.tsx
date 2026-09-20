import React from 'react';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, ShieldCheck, Truck, ArrowRightLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/LanguageCurrencyContext';

interface CartPageProps {
  navigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, tax, shipping, totalAmount } = useCart();
  const { currency, formatMoney, openConverter, t } = useCurrency();

  if (cart.length === 0) {
    return (
      <div className="bg-slate-50/50 min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center max-w-md w-full shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{t('emptyCart')}</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            You have not added any electrical, plumbing, or hardware supplies to your order list yet.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-sky-700 text-white font-semibold text-xs rounded-md transition-colors shadow-xs"
          >
            {t('browseSupplies')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/40 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
              Procurement Cart
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">{t('shoppingCart')}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={openConverter}
              className="text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
              <span>{currency === 'NPR' ? 'रू NPR' : '$ USD'}</span>
            </button>
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium"
            >
              {t('clearAll')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div>
                      <span className="text-[11px] font-semibold text-sky-700 uppercase">
                        {item.product.category}
                      </span>
                      <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                        {item.product.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        SKU: {item.product.sku}
                      </p>
                      <div className="text-xs font-bold text-slate-900 mt-1">
                        {formatMoney(item.product.price)} <span className="text-[11px] font-normal text-slate-500">/ {item.product.unit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex items-center border border-slate-300 rounded-md">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 text-xs font-bold text-slate-800 min-w-7 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <div className="font-bold text-slate-900 text-sm">
                        {formatMoney(item.product.price * item.quantity)}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('continueShopping')}</span>
              </button>
              <span className="text-xs text-slate-500">
                Prices include standard industrial packing
              </span>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {t('orderSummary')}
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono">
                {currency}
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t('subtotal')} ({cart.length} items)</span>
                <span className="font-semibold text-slate-900">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('vatTax')}</span>
                <span className="font-semibold text-slate-900">{formatMoney(tax)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('shipping')}</span>
                {shipping === 0 ? (
                  <span className="font-semibold text-emerald-600">Free ({formatMoney(100)}+ Order)</span>
                ) : (
                  <span className="font-semibold text-slate-900">{formatMoney(shipping)}</span>
                )}
              </div>
              {subtotal < 100 && (
                <p className="text-[11px] text-sky-700 bg-sky-50 p-2 rounded-md border border-sky-100">
                  Add {formatMoney(100 - subtotal)} more to qualify for Free Jobsite Delivery.
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">{t('total')}</span>
              <span className="text-xl font-extrabold text-slate-900">{formatMoney(totalAmount)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-sky-700 text-white font-semibold text-xs rounded-md flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>{t('proceedToCheckout')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-2 text-[11px] text-slate-500 space-y-1.5 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Genuine products with manufacturer guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-sky-600" />
                <span>Fast dispatch with verified tax invoice</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
