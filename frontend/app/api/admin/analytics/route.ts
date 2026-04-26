import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [orders, products, vendors, categories, users] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.findMany({
        include: { category: true }
      }),
      prisma.vendor.findMany(),
      prisma.category.findMany(),
      prisma.user.findMany({
        where: { role: 'CUSTOMER' }
      })
    ]);

    // 1. Core Financial Metrics
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    // 2. Market Segmentation (Sales by Category)
    const salesByCategory: Record<string, number> = {};
    orders.forEach(order => {
      const items = JSON.parse(order.items as string) as any[];
      items.forEach(item => {
        // Find category from products list (or item metadata if available)
        const product = products.find(p => p.id === item.id);
        const catName = product?.category?.name || 'Uncategorized';
        salesByCategory[catName] = (salesByCategory[catName] || 0) + (item.price * item.quantity);
      });
    });

    // 3. Inventory Intelligence (Hot Items & Low Stock)
    const productSales: Record<string, { name: string, count: number, revenue: number, image: string }> = {};
    orders.forEach(order => {
      const items = JSON.parse(order.items as string) as any[];
      items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = { 
            name: item.name, 
            count: 0, 
            revenue: 0, 
            image: item.image || '/placeholder.jpg' 
          };
        }
        productSales[item.id].count += item.quantity;
        productSales[item.id].revenue += (item.price * item.quantity);
      });
    });

    const hotItems = Object.values(productSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const lowStockItems = products
      .filter(p => p.inventory < p.lowStockLevel)
      .map(p => ({
        id: p.id,
        name: p.name,
        stock: p.inventory,
        threshold: p.lowStockLevel
      }));

    // 4. Revenue Velocity (Last 7 Days)
    const dailyRevenue: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      dailyRevenue[dateStr] = 0;
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    orders
      .filter(o => new Date(o.createdAt) >= sevenDaysAgo)
      .forEach(order => {
        const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
        if (dailyRevenue[dateStr] !== undefined) {
          dailyRevenue[dateStr] += order.totalPrice;
        }
      });

    // 5. Vendor Performance (Quick Stats)
    const activeVendors = vendors.filter(v => v.status === 'APPROVED').length;

    return NextResponse.json({
      totalRevenue,
      averageOrderValue,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalCustomers: users.length,
      totalVendors: vendors.length,
      activeVendors,
      totalCategories: categories.length,
      hotItems,
      salesByCategory,
      dailyRevenue: Object.entries(dailyRevenue)
        .map(([name, value]) => ({ name, value }))
        .reverse(),
      recentOrders: orders.slice(0, 10).map(o => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerEmail: o.customerEmail,
        totalPrice: o.totalPrice,
        status: o.status,
        createdAt: o.createdAt
      })),
      lowStockItems
    });

  } catch (err) {
    console.error('Enterprise Analytics Error:', err);
    return NextResponse.json(
      { error: 'Critical failure in intelligence aggregation' }, 
      { status: 500 }
    );
  }
}
