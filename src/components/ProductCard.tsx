import React, { useState } from 'react';
import { ShoppingCart, Star, Check, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/LanguageCurrencyContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const { formatMoney, t } = useCurrency();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isLowStock = product.stock > 0 && product.stock <= product.minStockAlert;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
    >
      {/* Image container */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden border-b border-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Featured badge */}
        {product.isFeatured && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-900 text-white shadow-xs">
            {t('featuredFirst')}
          </span>
        )}

        {/* Stock pill */}
        <div className="absolute top-2.5 right-2.5">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-100 text-rose-800 border border-rose-200">
              {t('outOfStock')}
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
              {t('onlyLeft').replace('{count}', String(product.stock))}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {t('inStock')}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
            <span className="font-medium text-sky-700 uppercase tracking-wider text-[11px]">
              {product.category}
            </span>
            <span className="font-mono text-[11px] text-slate-400">SKU: {product.sku}</span>
          </div>

          <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 group-hover:text-sky-700 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-slate-800">{product.rating}</span>
            <span className="text-xs text-slate-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900">
                {formatMoney(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatMoney(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500">per {product.unit}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              added
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-sky-700 text-white shadow-xs active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t('added')}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{t('addToCart')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
