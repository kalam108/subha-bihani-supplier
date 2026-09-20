import React, { useState } from 'react';
import { Database, Copy, Check, Server, Shield, Layers, FileCode } from 'lucide-react';

export const AdminDatabaseView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'spring' | 'architecture'>('sql');

  const supabaseSchemaSql = `-- ==========================================================
-- SUBBHA BIHANI SUPPLIERS: SUPABASE POSTGRESQL PRODUCTION DDL
-- Database: PostgreSQL 15+ with Row Level Security (RLS)
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Roles Enum
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED');
CREATE TYPE service_status AS ENUM ('PENDING', 'TECHNICIAN_ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE technician_status AS ENUM ('AVAILABLE', 'BUSY', 'OFFLINE');

-- 3. Users Table (Integrated with Supabase Auth auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    role user_role DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Categories Table
CREATE TABLE public.categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Products Table
CREATE TABLE public.products (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'prod_' || uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category_id VARCHAR(50) REFERENCES public.categories(id) ON DELETE RESTRICT,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    min_stock_alert INTEGER NOT NULL DEFAULT 5,
    unit VARCHAR(50) DEFAULT 'pcs',
    description TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 6. Services Table
CREATE TABLE public.services (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Electrical or Plumbing
    sub_category VARCHAR(100),
    standard_rate VARCHAR(100) NOT NULL,
    estimated_duration VARCHAR(100) NOT NULL,
    description TEXT,
    common_issues TEXT[] DEFAULT '{}',
    image_url TEXT,
    popular BOOLEAN DEFAULT false
);

-- 7. Technicians Table
CREATE TABLE public.technicians (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'tech_' || uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    trade VARCHAR(50) NOT NULL, -- Electrician, Plumber, Master Contractor
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    status technician_status DEFAULT 'AVAILABLE',
    rating NUMERIC(2, 1) DEFAULT 5.0,
    completed_jobs INTEGER DEFAULT 0
);

-- 8. Service Requests Table
CREATE TABLE public.service_requests (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'req_' || uuid_generate_v4(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    service_id VARCHAR(50) REFERENCES public.services(id),
    service_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time_slot VARCHAR(100) NOT NULL,
    assigned_technician_id VARCHAR(50) REFERENCES public.technicians(id) ON DELETE SET NULL,
    status service_status DEFAULT 'PENDING',
    estimated_cost VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 9. Orders Table
CREATE TABLE public.orders (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'ord_' || uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL,
    shipping NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'UNPAID',
    order_status order_status DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 10. Order Items Table
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(50) REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES public.products(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit VARCHAR(50)
);

-- 11. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view active products
CREATE POLICY "Public Products Access" ON public.products
    FOR SELECT USING (is_deleted = false);

-- Authenticated customers can view their own orders
CREATE POLICY "Customer Orders" ON public.orders
    FOR SELECT USING (auth.uid() = customer_id);

-- Admins full access
CREATE POLICY "Admin Full Access" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );
`;

  const springBootSnippets = `// =========================================================================
// JAVA SPRING BOOT ARCHITECTURE SPECIFICATION
// Package: com.subbhabihani.suppliers
// =========================================================================

// 1. Domain Entity: Product.java
package com.subbhabihani.suppliers.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String sku;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private BigDecimal price;

    private BigDecimal originalPrice;

    @Column(nullable = false)
    private Integer stock;

    private Integer minStockAlert;
    private String unit;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;
    private Boolean isFeatured = false;
    private Boolean isDeleted = false;

    private Instant createdAt;
    private Instant updatedAt;
}

// 2. Service Layer: OrderService.java
package com.subbhabihani.suppliers.service;

import com.subbhabihani.suppliers.domain.entity.Order;
import com.subbhabihani.suppliers.dto.OrderRequestDto;
import org.springframework.transaction.annotation.Transactional;

public interface OrderService {
    @Transactional
    Order createOrder(OrderRequestDto requestDto);

    Order updateOrderStatus(String orderId, String status);

    List<Order> getOrdersByCustomer(String customerId);
}

// 3. Security Config: SecurityConfig.java
package com.subbhabihani.suppliers.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/products/**", "/api/services/**", "/api/categories/**").permitAll()
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth -> oauth.jwt())
            .build();
    }
}
`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Database & Backend Architecture</h2>
          <p className="text-xs text-slate-500">
            Production Supabase PostgreSQL DDL, Row Level Security (RLS), and Java Spring Boot mapping specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => copyToClipboard(activeTab === 'sql' ? supabaseSchemaSql : springBootSnippets)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-sky-700 text-white rounded-md text-xs font-semibold transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg bg-white border border-slate-200 p-1 text-xs font-semibold w-fit">
        <button
          onClick={() => setActiveTab('sql')}
          className={`px-3.5 py-1.5 rounded-md transition-colors ${
            activeTab === 'sql' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Supabase PostgreSQL (DDL & RLS)
        </button>
        <button
          onClick={() => setActiveTab('spring')}
          className={`px-3.5 py-1.5 rounded-md transition-colors ${
            activeTab === 'spring' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Java Spring Boot Entities & Config
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3.5 py-1.5 rounded-md transition-colors ${
            activeTab === 'architecture' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          System Architecture Topology
        </button>
      </div>

      {activeTab === 'sql' && (
        <div className="bg-slate-900 text-slate-200 rounded-xl p-5 font-mono text-xs overflow-x-auto shadow-sm border border-slate-800">
          <pre>{supabaseSchemaSql}</pre>
        </div>
      )}

      {activeTab === 'spring' && (
        <div className="bg-slate-900 text-slate-200 rounded-xl p-5 font-mono text-xs overflow-x-auto shadow-sm border border-slate-800">
          <pre>{springBootSnippets}</pre>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs text-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Layers className="w-4 h-4 text-sky-600" />
                <span>Client Layer (Frontend)</span>
              </div>
              <p>• React 18+ Single Page Application with TypeScript</p>
              <p>• Progressive Web App (PWA) with Service Worker caching</p>
              <p>• Offline queue in IndexedDB/LocalStorage for offline carts and service tickets</p>
              <p>• Minimalist, high-contrast, professional design system</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Server className="w-4 h-4 text-sky-600" />
                <span>API & Orchestration Layer</span>
              </div>
              <p>• Full-stack Express & tsx runtime integrated with Vite middleware</p>
              <p>• Java Spring Boot 3.x enterprise microservice specification</p>
              <p>• Spring Security with JWT & OAuth2 Resource Server</p>
              <p>• REST endpoints for Orders, Service Tickets, and Product CRUD</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Database className="w-4 h-4 text-sky-600" />
                <span>Persistence & Storage</span>
              </div>
              <p>• Supabase managed PostgreSQL 15+ database</p>
              <p>• Row Level Security (RLS) enforcing Role-Based Access Control (RBAC)</p>
              <p>• Automated audit trail logging for all inventory & status shifts</p>
              <p>• Supabase Storage bucket for product spec sheets and site photos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
