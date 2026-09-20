import React, { useState } from 'react';
import { X, ShoppingCart, Star, ShieldCheck, Check, Truck, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/LanguageCurrencyContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { formatMoney, t } = useCurrency();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 relative animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="bg-slate-50 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-200">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-72 w-full object-contain rounded-lg"
            />
            <div className="mt-4 flex items-center justify-between w-full text-xs text-slate-500 pt-3 border-t border-slate-200">
              <span className="font-mono">SKU: {product.sku}</span>
              <span className="font-medium text-sky-700">{product.category}</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                <span className="text-xs text-slate-500">({product.reviewsCount} verified reviews)</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {formatMoney(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatMoney(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs text-slate-500 ml-1">per {product.unit}</span>
              </div>

              {/* Stock Status */}
              <div className="mt-3">
                {isOutOfStock ? (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {t('outOfStock')}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    <Check className="w-3.5 h-3.5" />
                    {t('inStock')} ({product.stock} units available)
                  </div>
                )}
              </div>

              <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Technical Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Technical Specifications
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80 text-xs space-y-1.5">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-0.5 border-b border-slate-200/50 last:border-none">
                        <span className="text-slate-500 font-medium">{key}</span>
                        <span className="text-slate-900 font-semibold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-md">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-slate-800 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    justAdded
                      ? 'bg-emerald-600 text-white'
                      : isOutOfStock
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-sky-700 text-white shadow-sm'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t('added')}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>{t('addToCart')} — {formatMoney(product.price * quantity)}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Manufacturer Warranty
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-sky-600" /> {t('freeShipping')} Over {formatMoney(100)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
