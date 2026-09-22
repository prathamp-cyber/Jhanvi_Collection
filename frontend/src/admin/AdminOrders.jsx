import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/formatPrice';
import {
  PageHeader,
  Card,
  Input,
  Select,
  Badge,
  EmptyState,
  Skeleton,
  Spinner
} from './components/ui';

const STATUS_TABS = [
  'All',
  'Order Placed',
  'Packing',
  'Shipped',
  'Out for delivery',
  'Delivered'
];

const STATUS_OPTIONS = [
  { value: 'Order Placed', label: 'Order Placed' },
  { value: 'Packing', label: 'Packing' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Out for delivery', label: 'Out for delivery' },
  { value: 'Delivered', label: 'Delivered' }
];

const AdminOrders = ({ token, backendUrl }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Active Tab state
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  // Status updating indicator per order ID
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const url = `${backendUrl || 'http://localhost:4000'}/api/order/list`;
      const response = await axios.post(url, {}, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders ? [...response.data.orders].reverse() : []);
      } else {
        toast.error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const url = `${backendUrl || 'http://localhost:4000'}/api/order/status`;
      const response = await axios.post(
        url,
        { orderId, status: newStatus },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Order status updated');
        // Update local order status without requiring full re-fetch
        setOrders(prev =>
          prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        toast.error(response.data.message || 'Failed to update order status');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Compute status counts client-side
  const statusCounts = STATUS_TABS.reduce((acc, tab) => {
    if (tab === 'All') {
      acc[tab] = orders.length;
    } else {
      acc[tab] = orders.filter(o => o.status === tab).length;
    }
    return acc;
  }, {});

  // Client-side filtering logic
  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;

    const fullName = `${order.address?.firstName || ''} ${order.address?.lastName || ''}`.toLowerCase();
    const orderIdStr = (order._id || '').toLowerCase();
    const searchLower = search.trim().toLowerCase();

    const matchesSearch =
      !searchLower ||
      fullName.includes(searchLower) ||
      orderIdStr.includes(searchLower);

    return matchesTab && matchesSearch;
  });

  // Date formatting (Indian locale format, e.g., 22 Sep 2026)
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge variant color
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Packing':
      case 'Out for delivery':
        return 'warning';
      case 'Shipped':
        return 'info';
      case 'Order Placed':
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 pb-12 admin-animate-fade-in">
      <PageHeader
        title="Customer Orders"
        subtitle="View and manage customer order fulfillments and status updates."
      />

      {/* Status Tabs / Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_TABS.map(tab => {
          const isActive = activeTab === tab;
          const count = statusCounts[tab] || 0;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#0a1f44] text-white shadow-sm'
                  : 'bg-white text-[#1b2437] border border-[#e6e1d6] hover:bg-[#f8f6f0]'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#f8f6f0] text-[#6b7280] border border-[#e6e1d6]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar & Counter */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-96">
            <Input
              placeholder="Search by customer name or order ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white"
            />
          </div>
          <span className="text-xs text-[#6b7280] self-end sm:self-center">
            Showing <strong className="text-[#0a1f44]">{filteredOrders.length}</strong> of{' '}
            <strong className="text-[#0a1f44]">{orders.length}</strong> orders
          </span>
        </div>
      </Card>

      {/* Orders List Container */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-44 w-full rounded-xl" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <EmptyState
            title="No orders yet"
            message="When customers place orders, they will appear here."
          />
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <EmptyState
            title="No matching orders"
            message="No orders match your search query or tab filter."
            action={
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setActiveTab('All');
                }}
                className="text-xs text-[#0a1f44] underline font-semibold cursor-pointer"
              >
                Reset filters
              </button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const isUpdating = updatingOrderId === order._id;
            const formattedDate = formatDate(order.date);

            return (
              <Card key={order._id} className="space-y-4">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#e6e1d6] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0a1f44]">
                      Order #{order._id ? order._id.slice(-8) : 'N/A'}
                    </span>
                    <span className="text-[#9ca3af]">•</span>
                    <span className="text-[#6b7280]">{formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" size="sm">
                      {order.paymentMethod}
                    </Badge>
                    <Badge variant={order.payment ? 'success' : 'warning'} size="sm">
                      {order.payment ? 'Paid' : 'Payment Pending'}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(order.status)} size="sm">
                      {order.status}
                    </Badge>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs sm:text-sm">
                  {/* Customer & Address details (md:col-span-4) */}
                  <div className="md:col-span-4 space-y-1 bg-[#f8f6f0] p-3 rounded-xl border border-[#e6e1d6]">
                    <h5 className="font-bold text-[#0a1f44] text-sm">
                      {order.address?.firstName} {order.address?.lastName}
                    </h5>
                    <p className="text-[#1b2437]">{order.address?.street}</p>
                    <p className="text-[#6b7280]">
                      {order.address?.city}, {order.address?.state}, {order.address?.country} - {order.address?.zipcode}
                    </p>
                    <p className="text-[#6b7280] font-medium pt-1">
                      📞 {order.address?.phone}
                    </p>
                  </div>

                  {/* Items List (md:col-span-5) */}
                  <div className="md:col-span-5 space-y-2">
                    <h5 className="font-bold text-[#0a1f44] text-xs uppercase tracking-wider text-[#6b7280]">
                      Items Ordered ({order.items?.length || 0})
                    </h5>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {order.items?.map((item, idx) => {
                        // Display variant info if available on item object
                        const variantText =
                          item.variant ||
                          item.size ||
                          (item.selectedVariant ? JSON.stringify(item.selectedVariant) : null);

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs py-1 border-b border-[#e6e1d6]/60 last:border-none"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="font-semibold text-[#0a1f44]">{item.name}</span>
                              <span className="text-[#6b7280]">x{item.quantity}</span>
                              {variantText && (
                                <Badge variant="neutral" size="sm" className="text-[10px] py-0">
                                  {variantText}
                                </Badge>
                              )}
                            </div>
                            <span className="font-mono text-[#1b2437] shrink-0">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pricing & Status selector (md:col-span-3) */}
                  <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end gap-3 pt-2 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-[#6b7280] block">Total Amount</span>
                      <span className="text-lg font-extrabold text-[#0a1f44]">
                        {formatPrice(order.amount)}
                      </span>
                    </div>

                    <div className="w-full space-y-1.5">
                      <label className="text-xs font-semibold text-[#1b2437] flex items-center justify-between">
                        <span>Change Status</span>
                        {isUpdating && <Spinner size="sm" className="text-[#0a1f44]" />}
                      </label>
                      <Select
                        value={order.status}
                        onChange={e => handleStatusChange(order._id, e.target.value)}
                        options={STATUS_OPTIONS}
                        disabled={isUpdating}
                        className="bg-white text-xs py-1.5"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
