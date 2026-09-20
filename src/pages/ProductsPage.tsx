import React, { useEffect, useState } from 'react';
import { Search, Filter, SlidersHorizontal, Package, RefreshCw, X, ArrowRightLeft } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { useCurrency } from '../context/LanguageCurrencyContext';

interface ProductsPageProps {
  initialCategory?: string;
  initialSearch?: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ initialCategory, initialSearch }) => {
  const { currency, openConverter, t } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery]);

  const loadCategories = async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProducts({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery.trim() || undefined,
      });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sort and filter client-side for immediate responsive feel
  let displayedProducts = [...products];

  if (onlyInStock) {
    displayedProducts = displayedProducts.filter((p) => p.stock > 0);
  }

  displayedProducts.sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    // default featured
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  return (
    <div className="bg-slate-50/40 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
                Full Catalog & Inventory
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Products & Supplies
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Database-driven commercial inventory with real-time stock levels and specifications.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={openConverter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                title="Nepali Rupees Converter"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
                <span>{currency === 'NPR' ? 'रू NPR' : '$ USD'}</span>
              </button>
              <button
                onClick={loadProducts}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Stock</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, SKU, or specification..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown & Stock Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-600"
                >
                  <option value="featured">{t('featuredFirst')}</option>
                  <option value="price-asc">{t('priceLowHigh')}</option>
                  <option value="price-desc">{t('priceHighLow')}</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Product Name (A-Z)</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>{t('inStockOnly')}</span>
              </label>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-t border-slate-100 pt-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Categories ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
          <span>
            Showing <strong className="text-slate-800">{displayedProducts.length}</strong> products
            {selectedCategory !== 'all' && ` in selected category`}
          </span>
          {searchQuery && (
            <span>
              Matches for: &ldquo;<strong className="text-slate-800">{searchQuery}</strong>&rdquo;
            </span>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-700">Loading catalog from database...</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No matching products found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your category filter, clearing your search query, or checking back soon.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyInStock(false);
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-sky-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(prod) => setSelectedProduct(prod)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
