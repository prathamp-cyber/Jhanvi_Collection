import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/formatPrice';
import {
  Card,
  Badge,
  Button,
  PageHeader,
  StatCardSkeleton,
  OrderRowSkeleton,
  EmptyState,
} from './components/ui';

const Dashboard = ({ token, backendUrl }) => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const urlBase = backendUrl || 'http://localhost:4000';

      const [ordersRes, productsRes] = await Promise.all([
        axios.post(`${urlBase}/api/order/list`, {}, { headers: { token } }),
        axios.get(`${urlBase}/api/product/list`),
      ]);

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders || []);
      } else {
        toast.error(ordersRes.data.message || 'Failed to fetch orders');
      }

      if (productsRes.data.success) {
        setProducts(productsRes.data.products || []);
      } else {
        toast.error(productsRes.data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // Client-side calculations
  const todayDateStr = new Date().toDateString();
  const ordersToday = orders.filter(
    (o) => new Date(o.date).toDateString() === todayDateStr
  ).length;

  const ordersToProcess = orders.filter(
    (o) => o.status === 'Order Placed' || o.status === 'Packing'
  ).length;

  const totalProducts = products.length;

  const salesValue = orders
    .filter((o) => o.status === 'Delivered')
    .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

  // Latest 5 orders (orders array sorted newest first or sliced from reversed copy)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Map order status to Badge variants
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Order Placed':
      case 'Packing':
        return 'warning';
      case 'Shipped':
      case 'Out for delivery':
        return 'info';
      case 'Cancelled':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 admin-animate-fade-in">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back! Here's a snapshot of your shop's performance."
        actions={
          <Button variant="secondary" onClick={fetchDashboardData} isLoading={loading}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        }
      />

      {/* Error state */}
      {error && !loading && (
        <Card className="border-[#fecaca] bg-[#fee2e2]/30 text-center py-8">
          <div className="max-w-md mx-auto space-y-3">
            <svg className="w-10 h-10 text-[#b91c1c] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-bold text-[#b91c1c] text-lg">Failed to load dashboard data</h3>
            <p className="text-sm text-[#6b7280]">{error}</p>
            <Button variant="primary" onClick={fetchDashboardData}>
              Try Again
            </Button>
          </div>
        </Card>
      )}

      {/* Stat Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : !error ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Orders Today */}
          <Card padding="md" className="flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6b7280]">
              <span className="text-xs font-semibold uppercase tracking-wider">Orders Today</span>
              <div className="p-2 rounded-lg bg-[#f6f3ec] text-[#0a1f44]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-[#0a1f44] tracking-tight">{ordersToday}</span>
              <p className="text-xs text-[#6b7280] mt-1">Placed since midnight</p>
            </div>
          </Card>

          {/* Card 2: Orders to Process */}
          <Card padding="md" className="flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6b7280]">
              <span className="text-xs font-semibold uppercase tracking-wider">Orders to Process</span>
              <div className="p-2 rounded-lg bg-[#fef3c7] text-[#b45309]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-[#b45309] tracking-tight">{ordersToProcess}</span>
              <p className="text-xs text-[#6b7280] mt-1">Order Placed or Packing</p>
            </div>
          </Card>

          {/* Card 3: Total Products */}
          <Card padding="md" className="flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6b7280]">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Products</span>
              <div className="p-2 rounded-lg bg-[#dbeafe] text-[#1d4ed8]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-[#0a1f44] tracking-tight">{totalProducts}</span>
              <p className="text-xs text-[#6b7280] mt-1">Active items in catalog</p>
            </div>
          </Card>

          {/* Card 4: Sales Value */}
          <Card padding="md" className="flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6b7280]">
              <span className="text-xs font-semibold uppercase tracking-wider">Sales Value</span>
              <div className="p-2 rounded-lg bg-[#dcfce7] text-[#15803d]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#15803d] tracking-tight">
                {formatPrice(salesValue)}
              </span>
              <p className="text-xs text-[#6b7280] mt-1">Delivered orders total</p>
            </div>
          </Card>
        </div>
      ) : null}

      {/* Main Grid: Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Section (Span 2 cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <Card padding="md" className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#e6e1d6] mb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#0a1f44]">Recent Orders</h2>
                  <p className="text-xs text-[#6b7280]">Latest 5 customer orders</p>
                </div>
                <Link to="/samay/orders">
                  <Button variant="ghost" size="sm">
                    View All
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  <OrderRowSkeleton />
                  <OrderRowSkeleton />
                  <OrderRowSkeleton />
                </div>
              ) : orders.length === 0 ? (
                <EmptyState
                  title="No orders yet"
                  message="When customers place orders on your store, they will show up here."
                  action={
                    <Link to="/samay/add">
                      <Button variant="primary" size="sm">
                        Add New Product
                      </Button>
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => {
                    const customerName = order.address
                      ? `${order.address.firstName || ''} ${order.address.lastName || ''}`.trim() || 'Customer'
                      : 'Customer';
                    const itemCount = order.items ? order.items.length : 0;
                    const formattedDate = order.date
                      ? new Date(order.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'N/A';

                    return (
                      <div
                        key={order._id || Math.random()}
                        className="p-4 border border-[#e6e1d6] rounded-lg bg-white hover:bg-[#f6f3ec]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-[#0a1f44]">
                              {customerName}
                            </span>
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {order.status || 'Order Placed'}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#6b7280]">
                            {itemCount} {itemCount === 1 ? 'item' : 'items'} &bull; {formattedDate}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#e6e1d6]">
                          <span className="font-bold text-base text-[#0a1f44]">
                            {formatPrice(order.amount)}
                          </span>
                          <Link to="/samay/orders">
                            <span className="text-xs font-semibold text-[#0a1f44] hover:underline flex items-center gap-0.5">
                              Details
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions Card */}
        <div className="space-y-4">
          <Card padding="md" className="h-full flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0a1f44] mb-1">Quick Actions</h2>
              <p className="text-xs text-[#6b7280] mb-5">Common store operations</p>

              <div className="space-y-3">
                <Link to="/samay/add" className="block">
                  <div className="p-4 rounded-xl border border-[#e6e1d6] bg-white hover:border-[#0a1f44] hover:shadow-sm transition-all duration-150 group cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-[#0a1f44] text-white group-hover:bg-[#12305f] transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-[#0a1f44]">Add New Product</h3>
                        <p className="text-xs text-[#6b7280]">Upload images & details</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-[#6b7280] group-hover:text-[#0a1f44] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link to="/samay/list" className="block">
                  <div className="p-4 rounded-xl border border-[#e6e1d6] bg-white hover:border-[#0a1f44] hover:shadow-sm transition-all duration-150 group cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-[#f6f3ec] text-[#0a1f44] group-hover:bg-[#eae6db] transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-[#0a1f44]">Manage Catalog</h3>
                        <p className="text-xs text-[#6b7280]">View & delete products</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-[#6b7280] group-hover:text-[#0a1f44] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link to="/samay/orders" className="block">
                  <div className="p-4 rounded-xl border border-[#e6e1d6] bg-white hover:border-[#0a1f44] hover:shadow-sm transition-all duration-150 group cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-[#fef3c7] text-[#b45309] group-hover:bg-[#fde68a] transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-[#0a1f44]">View All Orders</h3>
                        <p className="text-xs text-[#6b7280]">Update shipping statuses</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-[#6b7280] group-hover:text-[#0a1f44] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[#f6f3ec] border border-[#e6e1d6]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0a1f44] mb-1">
                <svg className="w-4 h-4 text-[#b8934a]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Shop Owner Tip
              </div>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Check orders marked as "Order Placed" daily and update them to "Packing" once prepared.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
