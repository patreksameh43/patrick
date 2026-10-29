import express, { type Request, type Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './src/server/db.ts';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // PUBLIC STOREFRONT APIs
  // ----------------------------------------------------

  // Get products catalog
  app.get('/api/products', (req: Request, res: Response) => {
    try {
      const { category, search } = req.query;
      const products = db.getProducts({
        category: category as string,
        search: search as string,
      });
      res.json({ success: true, products });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get single product
  app.get('/api/products/:id', (req: Request, res: Response) => {
    try {
      const product = db.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, product });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Place order
  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const result = db.createOrder(req.body);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Track order by ID
  app.get('/api/orders/:id', (req: Request, res: Response) => {
    try {
      const order = db.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order reference not found' });
      }
      res.json({ success: true, order });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Lookup orders by customer phone
  app.get('/api/orders/lookup/by-phone', (req: Request, res: Response) => {
    try {
      const phone = req.query.phone as string;
      if (!phone) {
        return res.status(400).json({ success: false, error: 'Phone query required' });
      }
      const orders = db.getOrdersByCustomerPhone(phone);
      res.json({ success: true, orders });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Validate discount code
  app.get('/api/discounts/validate', (req: Request, res: Response) => {
    try {
      const code = req.query.code as string;
      const subtotal = Number(req.query.subtotal) || 0;
      if (!code) {
        return res.status(400).json({ valid: false, error: 'Code is required' });
      }
      const validation = db.validateDiscount(code, subtotal);
      res.json(validation);
    } catch (err: any) {
      res.status(500).json({ valid: false, error: err.message });
    }
  });

  // Get shipping rates and store settings
  app.get('/api/shipping-rates', (_req: Request, res: Response) => {
    try {
      const rates = db.getShippingRates();
      const settings = db.getSettings();
      res.json({ success: true, rates, settings });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Submit contact inquiry
  app.post('/api/inquiries', (req: Request, res: Response) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      if (!name || !message) {
        return res.status(400).json({ success: false, error: 'Name and message are required' });
      }
      const inquiry = db.createInquiry({ name, email: email || '', phone: phone || '', subject: subject || '', message });
      res.status(201).json({ success: true, inquiry });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ----------------------------------------------------
  // ADMIN AUTH & MANAGEMENT APIs
  // ----------------------------------------------------

  // Admin login check
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { password } = req.body;
    
    // Check if password matches stored admin password
    const isPasswordValid = Boolean(password && db.verifyAdminPassword(password));

    if (isPasswordValid) {
      return res.json({
        success: true,
        token: `nova_adm_${Date.now()}`,
        admin: {
          role: 'admin',
          fullName: 'Operations Administrator',
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid password. Please check and try again.',
    });
  });

  // Admin change password
  app.post('/api/admin/change-password', (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, error: 'Current password and new password are required.' });
      }

      const result = db.changeAdminPassword(currentPassword, newPassword, 'Admin');
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({ success: true, message: 'Admin password changed successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin analytics overview
  app.get('/api/admin/analytics', (_req: Request, res: Response) => {
    try {
      const analytics = db.getAnalytics();
      res.json({ success: true, analytics });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin orders list & search
  app.get('/api/admin/orders', (req: Request, res: Response) => {
    try {
      const { status, search } = req.query;
      const orders = db.getOrders({
        status: status as string,
        search: search as string,
      });
      res.json({ success: true, orders });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin update order status
  app.patch('/api/admin/orders/:id/status', (req: Request, res: Response) => {
    try {
      const { status, note, carrier, trackingNumber, adminEmail } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, error: 'Status is required' });
      }
      const updated = db.updateOrderStatus(
        req.params.id,
        status,
        adminEmail || 'admin@novawear.eg',
        note,
        carrier,
        trackingNumber
      );
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      res.json({ success: true, order: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin products list (all including drafts)
  app.get('/api/admin/products', (_req: Request, res: Response) => {
    try {
      const products = db.getAllProductsAdmin();
      res.json({ success: true, products });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin create product
  app.post('/api/admin/products', (req: Request, res: Response) => {
    try {
      const adminOperator = req.body.adminOperator || 'Admin';
      const created = db.createProduct(req.body.product, adminOperator);
      res.status(201).json({ success: true, product: created });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin update product
  app.put('/api/admin/products/:id', (req: Request, res: Response) => {
    try {
      const adminOperator = req.body.adminOperator || 'Admin';
      const updated = db.updateProduct(req.params.id, req.body.updates, adminOperator);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, product: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin delete product
  app.delete('/api/admin/products/:id', (req: Request, res: Response) => {
    try {
      const adminOperator = (req.query.adminOperator as string) || 'Admin';
      const deleted = db.deleteProduct(req.params.id, adminOperator);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin discounts
  app.get('/api/admin/discounts', (_req: Request, res: Response) => {
    try {
      res.json({ success: true, discounts: db.getDiscounts() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/admin/discounts', (req: Request, res: Response) => {
    try {
      const adminOperator = req.body.adminOperator || 'Admin';
      const discount = db.createDiscount(req.body.discount, adminOperator);
      res.status(201).json({ success: true, discount });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.patch('/api/admin/discounts/:id/toggle', (req: Request, res: Response) => {
    try {
      const adminOperator = req.body.adminOperator || 'Admin';
      const toggled = db.toggleDiscount(req.params.id, adminOperator);
      if (!toggled) {
        return res.status(404).json({ success: false, error: 'Discount not found' });
      }
      res.json({ success: true, discount: toggled });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin shipping rates
  app.patch('/api/admin/shipping-rates/:id', (req: Request, res: Response) => {
    try {
      const { cost, adminOperator } = req.body;
      const rate = db.updateShippingRate(req.params.id, Number(cost), adminOperator || 'Admin');
      if (!rate) {
        return res.status(404).json({ success: false, error: 'Rate not found' });
      }
      res.json({ success: true, rate });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin inquiries
  app.get('/api/admin/inquiries', (_req: Request, res: Response) => {
    try {
      res.json({ success: true, inquiries: db.getInquiries() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.patch('/api/admin/inquiries/:id', (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const inq = db.updateInquiryStatus(req.params.id, status);
      if (!inq) {
        return res.status(404).json({ success: false, error: 'Inquiry not found' });
      }
      res.json({ success: true, inquiry: inq });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin audit logs
  app.get('/api/admin/audit-logs', (_req: Request, res: Response) => {
    try {
      res.json({ success: true, auditLogs: db.getAuditLogs() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin settings
  app.get('/api/admin/settings', (_req: Request, res: Response) => {
    try {
      res.json({ success: true, settings: db.getSettings() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/admin/settings', (req: Request, res: Response) => {
    try {
      const adminEmail = req.body.adminEmail || 'admin@novawear.eg';
      const settings = db.updateSettings(req.body.settings, adminEmail);
      res.json({ success: true, settings });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ----------------------------------------------------
  // VITE DEV SERVER / STATIC DIST SERVING
  // ----------------------------------------------------
  const distPath = path.resolve(__dirname, 'dist');
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (fs.existsSync(distPath) && process.env.NODE_ENV !== 'development');

  if (isProduction) {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[NOVA WEAR] Server active at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
