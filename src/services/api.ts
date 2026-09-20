import {
  Product,
  Category,
  ServiceItem,
  ServiceRequest,
  Technician,
  Order,
  User,
  AdminStats,
  AuditLog,
} from '../types';
import { OfflineManager } from '../utils/offlineQueue';

export const api = {
  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return await res.json();
    } catch {
      return [
        { id: 'cat-elec', name: 'Electrical', slug: 'electrical', description: 'Wires, cables, and distribution' },
        { id: 'cat-plumb', name: 'Plumbing', slug: 'plumbing', description: 'Pipes, valves, and sanitary fixtures' },
        { id: 'cat-hard', name: 'Hardware', slug: 'hardware', description: 'Fasteners, locks, and structural supplies' },
        { id: 'cat-elec-acc', name: 'Electrical Accessories', slug: 'electrical-accessories', description: 'Plates, conduits, and accessories' },
        { id: 'cat-plumb-acc', name: 'Plumbing Accessories', slug: 'plumbing-accessories', description: 'Teflon, sealants, and washers' },
        { id: 'cat-tools', name: 'Tools', slug: 'tools', description: 'Power drills, wrenches, and screwdrivers' },
        { id: 'cat-other', name: 'Other Supplies', slug: 'other-supplies', description: 'Safety gear and adhesives' },
      ];
    }
  },

  // Products
  async getProducts(params?: { category?: string; search?: string; featured?: boolean }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.featured) query.set('featured', 'true');

    try {
      const res = await fetch(`/api/products?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      OfflineManager.setCachedProducts(data);
      return data;
    } catch {
      const cached = OfflineManager.getCachedProducts();
      if (cached && cached.length > 0) {
        let list = cached;
        if (params?.category && params.category !== 'all') {
          list = list.filter((p: Product) => p.categoryId === params.category || p.category.toLowerCase() === params.category?.toLowerCase());
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          list = list.filter((p: Product) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
        }
        return list;
      }
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      const cached = OfflineManager.getCachedProducts();
      return cached.find((p: Product) => p.id === id) || null;
    }
  },

  // Admin Product CRUD
  async createProduct(productData: any): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return await res.json();
  },

  async updateProduct(id: string, updates: any): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return await res.json();
  },

  async deleteProduct(id: string, soft = true): Promise<void> {
    const res = await fetch(`/api/products/${id}?soft=${soft}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // Services
  async getServices(category?: string): Promise<ServiceItem[]> {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    try {
      const res = await fetch(`/api/services${query}`);
      if (!res.ok) throw new Error('Failed to fetch services');
      const data = await res.json();
      OfflineManager.setCachedServices(data);
      return data;
    } catch {
      return OfflineManager.getCachedServices();
    }
  },

  // Service Requests
  async getServiceRequests(customerId?: string): Promise<ServiceRequest[]> {
    const query = customerId ? `?customerId=${customerId}` : '';
    try {
      const res = await fetch(`/api/service-requests${query}`);
      if (!res.ok) throw new Error('Failed to fetch service requests');
      return await res.json();
    } catch {
      return [];
    }
  },

  async createServiceRequest(requestData: any): Promise<{ request: ServiceRequest; queuedOffline?: boolean }> {
    if (!OfflineManager.isOnline()) {
      OfflineManager.enqueue('service_request', requestData);
      const mockReq: ServiceRequest = {
        ...requestData,
        id: `offline-${Date.now()}`,
        ticketNumber: `SBS-OFF-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { request: mockReq, queuedOffline: true };
    }

    try {
      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (!res.ok) throw new Error('Failed to submit service request');
      const request = await res.json();
      return { request };
    } catch (err) {
      OfflineManager.enqueue('service_request', requestData);
      const mockReq: ServiceRequest = {
        ...requestData,
        id: `offline-${Date.now()}`,
        ticketNumber: `SBS-OFF-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { request: mockReq, queuedOffline: true };
    }
  },

  async updateServiceRequest(id: string, updates: any): Promise<ServiceRequest> {
    const res = await fetch(`/api/service-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update service request');
    return await res.json();
  },

  // Technicians
  async getTechnicians(): Promise<Technician[]> {
    try {
      const res = await fetch('/api/technicians');
      if (!res.ok) throw new Error('Failed to fetch technicians');
      return await res.json();
    } catch {
      return [];
    }
  },

  async updateTechnicianStatus(id: string, status: Technician['status']): Promise<Technician> {
    const res = await fetch(`/api/technicians/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update technician status');
    return await res.json();
  },

  // Orders
  async getOrders(customerId?: string): Promise<Order[]> {
    const query = customerId ? `?customerId=${customerId}` : '';
    try {
      const res = await fetch(`/api/orders${query}`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      return await res.json();
    } catch {
      return [];
    }
  },

  async createOrder(orderData: any): Promise<{ order: Order; queuedOffline?: boolean }> {
    if (!OfflineManager.isOnline()) {
      OfflineManager.enqueue('order', orderData);
      const mockOrder: Order = {
        ...orderData,
        id: `offline-${Date.now()}`,
        orderNumber: `SBS-OFF-${Math.floor(1000 + Math.random() * 9000)}`,
        orderStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { order: mockOrder, queuedOffline: true };
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error('Failed to create order');
      const order = await res.json();
      return { order };
    } catch {
      OfflineManager.enqueue('order', orderData);
      const mockOrder: Order = {
        ...orderData,
        id: `offline-${Date.now()}`,
        orderNumber: `SBS-OFF-${Math.floor(1000 + Math.random() * 9000)}`,
        orderStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { order: mockOrder, queuedOffline: true };
    }
  },

  async updateOrderStatus(id: string, status: Order['orderStatus']): Promise<Order> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return await res.json();
  },

  // Auth
  async login(email: string, password?: string): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to login');
    }
    return await res.json();
  },

  async register(data: { name: string; email: string; phone?: string; address?: string }): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to register');
    }
    return await res.json();
  },

  // Admin
  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('Failed to load stats');
    return await res.json();
  },

  async getAdminProducts(): Promise<Product[]> {
    const res = await fetch('/api/admin/products');
    if (!res.ok) throw new Error('Failed to load admin products');
    return await res.json();
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/admin/audit-logs');
    if (!res.ok) throw new Error('Failed to load audit logs');
    return await res.json();
  },

  async getAdminCustomers(): Promise<User[]> {
    const res = await fetch('/api/admin/customers');
    if (!res.ok) throw new Error('Failed to load customers');
    return await res.json();
  },
};
