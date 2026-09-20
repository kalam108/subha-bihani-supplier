import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageCurrencyProvider } from './context/LanguageCurrencyContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CurrencyConverterModal } from './components/CurrencyConverterModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ServicesPage } from './pages/ServicesPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { ServiceRequestsPage } from './pages/ServiceRequestsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Admin Components
import { AdminLayout, AdminTab } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminServiceRequests } from './pages/admin/AdminServiceRequests';
import { AdminTechnicians } from './pages/admin/AdminTechnicians';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminDatabaseView } from './pages/admin/AdminDatabaseView';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [newOrderNumber, setNewOrderNumber] = useState<string | null>(null);

  // Sync state with browser location
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Extract query params for products page
  const getQueryParams = () => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    return {
      category: params.get('category') || undefined,
      search: params.get('search') || undefined,
    };
  };

  const queryParams = getQueryParams();

  // Admin routing
  if (currentPath.startsWith('/admin')) {
    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={(tab) => setAdminTab(tab)}
        navigate={navigate}
      >
        {adminTab === 'dashboard' && <AdminDashboard onNavigateTab={(tab) => setAdminTab(tab)} />}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'inventory' && <AdminInventory />}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'services' && <AdminServiceRequests />}
        {adminTab === 'technicians' && <AdminTechnicians />}
        {adminTab === 'customers' && <AdminCustomers />}
        {adminTab === 'audit-logs' && <AdminAuditLogs />}
        {adminTab === 'database' && <AdminDatabaseView />}
      </AdminLayout>
    );
  }

  // Public & Customer Storefront routing
  const renderPublicPage = () => {
    if (currentPath === '/') {
      return <HomePage navigate={navigate} />;
    }
    if (currentPath.startsWith('/products')) {
      return (
        <ProductsPage
          initialCategory={queryParams.category}
          initialSearch={queryParams.search}
        />
      );
    }
    if (currentPath.startsWith('/services')) {
      return <ServicesPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/cart')) {
      return <CartPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/checkout')) {
      return (
        <CheckoutPage
          navigate={navigate}
          onOrderComplete={(orderNum) => {
            setNewOrderNumber(orderNum);
            navigate('/orders');
          }}
        />
      );
    }
    if (currentPath.startsWith('/orders')) {
      return <OrdersPage navigate={navigate} newOrderNumber={newOrderNumber} />;
    }
    if (currentPath.startsWith('/service-requests')) {
      return <ServiceRequestsPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/profile')) {
      return <ProfilePage navigate={navigate} />;
    }
    if (currentPath.startsWith('/login') || currentPath.startsWith('/auth')) {
      return <AuthPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/about')) {
      return <AboutPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/contact')) {
      return <ContactPage />;
    }
    return <HomePage navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      <Navbar currentPath={currentPath} navigate={navigate} />
      <main className="flex-1">
        {renderPublicPage()}
      </main>
      <Footer navigate={navigate} />
      <CurrencyConverterModal />
    </div>
  );
}

export default function App() {
  return (
    <LanguageCurrencyProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </LanguageCurrencyProvider>
  );
}
