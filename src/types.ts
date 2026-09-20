export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName?: string;
  itemCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryId: string;
  sku: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  minStockAlert: number;
  unit: string;
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  specifications: Record<string, string>;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Electrical' | 'Plumbing';
  description: string;
  standardRate: string;
  estimatedDuration: string;
  commonIssues: string[];
  imageUrl: string;
  popular?: boolean;
}

export type ServiceRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'TECHNICIAN_ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ServiceRequest {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  category: 'Electrical' | 'Plumbing';
  description: string;
  address: string;
  city: string;
  preferredDate: string;
  preferredTimeSlot: string;
  status: ServiceRequestStatus;
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  assignedTechnicianPhone?: string;
  estimatedCost?: number;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type TechnicianStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export interface Technician {
  id: string;
  name: string;
  trade: 'Electrical' | 'Plumbing' | 'Multi-craft';
  phone: string;
  email: string;
  experienceYears: number;
  status: TechnicianStatus;
  rating: number;
  completedJobs: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentMethod =
  | 'CASH_ON_DELIVERY'
  | 'STORE_PICKUP'
  | 'BANK_TRANSFER'
  | 'DIGITAL_WALLET';

export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl: string;
  unit?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  shippingAddress?: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  entity?: string;
  entityType?: string;
  entityId: string;
  performedBy?: string;
  details: any;
  timestamp: string;
}

export interface AdminStats {
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  activeServiceRequests: number;
  totalServiceRequests?: number;
  totalRevenue: number;
  lowStockCount: number;
  availableTechnicians: number;
}

export interface SyncQueueItem {
  id: string;
  type: 'order' | 'service_request';
  data: any;
  timestamp: number;
  attempts: number;
}
