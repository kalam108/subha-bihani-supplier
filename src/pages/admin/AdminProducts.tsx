import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Check, X, RefreshCw, AlertCircle, Package } from 'lucide-react';
import { Product, Category } from '../../types';
import { api } from '../../services/api';
import { useCurrency } from '../../context/LanguageCurrencyContext';

export const AdminProducts: React.FC = () => {
  const { formatMoney } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: 'cat-elec',
    category: 'Electrical',
    price: 0,
    originalPrice: 0,
    stock: 10,
    minStockAlert: 5,
    unit: 'pcs',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    specificationsStr: 'Brand: Industrial Standard\nRating: Certified',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        api.getAdminProducts(),
        api.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `SBS-${Math.floor(1000 + Math.random() * 9000)}`,
      categoryId: categories[0]?.id || 'cat-elec',
      category: categories[0]?.name || 'Electrical',
      price: 25.0,
      originalPrice: 30.0,
      stock: 50,
      minStockAlert: 10,
      unit: 'pcs',
      description: 'High-grade commercial specification.',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      isFeatured: false,
      specificationsStr: 'Standard: IS/ISO Certified\nWarranty: 2 Years',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    const specsStr = Object.entries(p.specifications || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    setFormData({
      name: p.name,
      sku: p.sku,
      categoryId: p.categoryId,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || 0,
      stock: p.stock,
      minStockAlert: p.minStockAlert,
      unit: p.unit,
      description: p.description,
      imageUrl: p.imageUrl,
      isFeatured: p.isFeatured,
      specificationsStr: specsStr,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse specifications
    const specifications: Record<string, string> = {};
    formData.specificationsStr.split('\n').forEach((line) => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        specifications[parts[0].trim()] = parts.slice(1).join(':').trim();
      }
    });

    const payload = {
      name: formData.name,
      sku: formData.sku,
      categoryId: formData.categoryId,
      category: categories.find((c) => c.id === formData.categoryId)?.name || formData.category,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stock: Number(formData.stock),
      minStockAlert: Number(formData.minStockAlert),
      unit: formData.unit,
      description: formData.description,
      imageUrl: formData.imageUrl,
      isFeatured: formData.isFeatured,
      specifications,
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to soft-delete "${name}" from the active store?`)) {
      try {
        await api.deleteProduct(id, true);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filtered = products.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.categoryId === categoryFilter;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Product Catalog Management</h2>
          <p className="text-xs text-slate-500">
            Create, update pricing, specifications, and catalog visibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-sky-700 text-white rounded-md text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={loadData}
            className="p-2 bg-white border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name or SKU..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white text-slate-700"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Featured</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-10 h-10 rounded-md object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 line-clamp-1">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono font-medium text-slate-700">{p.sku}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-900">{formatMoney(p.price)}</td>
                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        p.stock <= p.minStockAlert ? 'text-rose-600 font-bold' : 'text-slate-800'
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-3">
                    {p.isFeatured ? (
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-200">
                        Yes
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">No</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-slate-100 rounded"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded"
                        title="Soft delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 space-y-4 animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Commercial Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">SKU Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Sale Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Low Stock Warning Threshold</label>
                  <input
                    type="number"
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Packaging Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. piece, roll, 3m pipe, box"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-sky-600"
                    />
                    <span>Highlight as Featured on Homepage</span>
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">
                    Technical Specifications (Format: Key: Value, one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.specificationsStr}
                    onChange={(e) => setFormData({ ...formData, specificationsStr: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-md font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-sky-700 text-white rounded-md font-semibold transition-colors shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
