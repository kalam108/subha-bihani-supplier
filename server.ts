import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Subbha Bihani Suppliers API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // --- Auth APIs ---
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = db.findUserByEmail(email);
    if (!user) {
      // For effortless testing: if user doesn't exist, auto-create a USER or ADMIN if email contains 'admin'
      const role = email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
      const created = db.createUser({
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email,
        role,
      });
      return res.json({
        user: created,
        token: `mock-jwt-token-${created.id}`,
        message: 'Logged in successfully',
      });
    }

    return res.json({
      user,
      token: `mock-jwt-token-${user.id}`,
      message: 'Logged in successfully',
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, address } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    const user = db.createUser({
      name,
      email,
      phone,
      address,
      role: 'USER',
    });
    return res.status(201).json({
      user,
      token: `mock-jwt-token-${user.id}`,
      message: 'Registration successful',
    });
  });

  // --- Categories API ---
  app.get('/api/categories', (req: Request, res: Response) => {
    res.json(db.getCategories());
  });

  // --- Products APIs ---
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, search, featured } = req.query;
    const products = db.getProducts({
      category: category as string,
      search: search as string,
      featured: featured === 'true',
    });
    res.json(products);
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const product = db.createProduct(req.body);
    res.status(201).json(product);
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const soft = req.query.soft !== 'false';
    const success = db.deleteProduct(req.params.id, soft);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted/archived successfully' });
  });

  // --- Services APIs ---
  app.get('/api/services', (req: Request, res: Response) => {
    const { category } = req.query;
    const services = db.getServices(category as string);
    res.json(services);
  });

  // --- Service Requests APIs ---
  app.get('/api/service-requests', (req: Request, res: Response) => {
    const { customerId } = req.query;
    const requests = db.getServiceRequests(customerId as string);
    res.json(requests);
  });

  app.get('/api/service-requests/:id', (req: Request, res: Response) => {
    const request = db.getServiceRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Service request not found' });
    }
    res.json(request);
  });

  app.post('/api/service-requests', (req: Request, res: Response) => {
    const newRequest = db.createServiceRequest(req.body);
    res.status(201).json(newRequest);
  });

  app.put('/api/service-requests/:id', (req: Request, res: Response) => {
    const updated = db.updateServiceRequest(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Service request not found' });
    }
    res.json(updated);
  });

  // --- Technicians APIs ---
  app.get('/api/technicians', (req: Request, res: Response) => {
    res.json(db.getTechnicians());
  });

  app.put('/api/technicians/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const updated = db.updateTechnicianStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Technician not found' });
    }
    res.json(updated);
  });

  // --- Orders APIs ---
  app.get('/api/orders', (req: Request, res: Response) => {
    const { customerId } = req.query;
    const orders = db.getOrders(customerId as string);
    res.json(orders);
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const newOrder = db.createOrder(req.body);
    res.status(201).json(newOrder);
  });

  app.put('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  });

  // --- Offline Sync API ---
  app.post('/api/sync', (req: Request, res: Response) => {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'items array is required' });
    }

    const results = [];
    for (const item of items) {
      try {
        if (item.type === 'order') {
          const created = db.createOrder(item.data);
          results.push({ clientId: item.id, status: 'synced', serverId: created.id, orderNumber: created.orderNumber });
        } else if (item.type === 'service_request') {
          const created = db.createServiceRequest(item.data);
          results.push({ clientId: item.id, status: 'synced', serverId: created.id, ticketNumber: created.ticketNumber });
        }
      } catch (err: any) {
        results.push({ clientId: item.id, status: 'error', message: err?.message || 'Sync failed' });
      }
    }

    res.json({ syncedCount: results.filter(r => r.status === 'synced').length, results });
  });

  // --- Admin APIs ---
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    res.json(db.getAdminStats());
  });

  app.get('/api/admin/products', (req: Request, res: Response) => {
    res.json(db.getAllProductsAdmin());
  });

  app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
    res.json(db.getAuditLogs());
  });

  app.get('/api/admin/customers', (req: Request, res: Response) => {
    const customers = db.getUsers().filter(u => u.role === 'USER');
    res.json(customers);
  });

  // --- Vite middleware for development / Static files for production ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Subbha Bihani Suppliers Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
