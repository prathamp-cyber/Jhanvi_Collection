import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import {
  PageHeader,
  Card,
  Input,
  Select,
  Button,
  Badge,
  Modal,
  EmptyState,
  Skeleton
} from './components/ui';

const CATEGORY_OPTIONS = [
  { value: 'All', label: 'All Categories' },
  { value: 'Rings', label: 'Rings' },
  { value: 'Bracelet', label: 'Bracelet' },
  { value: 'Necklace', label: 'Necklace' },
  { value: 'Bangles', label: 'Bangles' },
  { value: 'Earrings', label: 'Earrings' },
  { value: 'Maang Tikka', label: 'Maang Tikka' },
  { value: 'Bridal Sets', label: 'Bridal Sets' },
  { value: 'Anklets', label: 'Anklets' }
];

const SECTION_OPTIONS = [
  { value: 'All', label: 'All Sections' },
  { value: 'Women', label: 'Women' },
  { value: 'Kids', label: 'Kids' }
];

const ListProducts = ({ token, backendUrl }) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');

  // Delete modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchList = async () => {
    try {
      setIsLoading(true);
      const url = `${backendUrl || 'http://localhost:4000'}/api/product/list`;
      const response = await axios.get(url);
      if (response.data.success) {
        setList(response.data.products || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const openDeleteConfirmation = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      setIsDeleting(true);
      const url = `${backendUrl || 'http://localhost:4000'}/api/product/remove`;
      const response = await axios.post(
        url,
        { id: selectedProduct._id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Product removed');
        setList(prev => prev.filter(p => p._id !== selectedProduct._id));
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
      } else {
        toast.error(response.data.message || 'Failed to remove product');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to remove product');
    } finally {
      setIsDeleting(false);
    }
  };

  // Client-side filtering logic
  const filteredList = list.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSection = sectionFilter === 'All' || item.section === sectionFilter;
    return matchesSearch && matchesCategory && matchesSection;
  });

  const resetFilters = () => {
    setSearch('');
    setCategoryFilter('All');
    setSectionFilter('All');
  };

  return (
    <div className="space-y-6 pb-12 admin-animate-fade-in">
      <PageHeader
        title="Products Inventory"
        subtitle="Manage and inspect all jewellery items in your store."
        action={
          <Link to="/samay/add">
            <Button variant="primary" size="md">
              + Add New Product
            </Button>
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <Card padding="sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6">
            <Input
              placeholder="Search by product name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              options={CATEGORY_OPTIONS}
              className="bg-white"
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              value={sectionFilter}
              onChange={e => setSectionFilter(e.target.value)}
              options={SECTION_OPTIONS}
              className="bg-white"
            />
          </div>
        </div>

        {/* Counter & Active Filter Reset */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e6e1d6] text-xs text-[#6b7280]">
          <span>
            Showing <strong className="text-[#0a1f44]">{filteredList.length}</strong> of{' '}
            <strong className="text-[#0a1f44]">{list.length}</strong> products
          </span>
          {(search || categoryFilter !== 'All' || sectionFilter !== 'All') && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[#0a1f44] hover:underline font-medium cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* Product Content List */}
      {isLoading ? (
        <Card padding="none">
          <div className="p-4 space-y-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </Card>
      ) : list.length === 0 ? (
        <Card>
          <EmptyState
            title="No products yet"
            message="Your inventory is empty. Start adding your first jewellery product now."
            action={
              <Link to="/samay/add">
                <Button variant="primary">Add Your First Product</Button>
              </Link>
            }
          />
        </Card>
      ) : filteredList.length === 0 ? (
        <Card>
          <EmptyState
            title="No products found"
            message="No products match your current search and filter selections."
            action={
              <Button variant="secondary" onClick={resetFilters}>
                Reset Search Filters
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block">
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8f6f0] border-b border-[#e6e1d6] text-xs font-bold text-[#0a1f44] uppercase tracking-wider">
                      <th className="py-3.5 px-4">Image</th>
                      <th className="py-3.5 px-4">Product Name</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Section</th>
                      <th className="py-3.5 px-4">MRP</th>
                      <th className="py-3.5 px-4">Selling Price</th>
                      <th className="py-3.5 px-4">Discount</th>
                      <th className="py-3.5 px-4">Flags</th>
                      <th className="py-3.5 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6e1d6] text-sm">
                    {filteredList.map((item) => {
                      const discount = item.discountPercent || (item.mrp && item.mrp > item.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0);
                      return (
                        <tr key={item._id} className="hover:bg-[#f8f6f0]/60 transition-colors">
                          <td className="py-3 px-4">
                            <img
                              src={item.image?.[0] || ''}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg border border-[#e6e1d6] bg-white"
                            />
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#0a1f44] max-w-[220px] truncate">
                            {item.name}
                          </td>
                          <td className="py-3 px-4 text-[#1b2437]">{item.category}</td>
                          <td className="py-3 px-4">
                            <Badge variant="neutral" size="sm">
                              {item.section || 'Women'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-[#6b7280]">
                            {item.mrp ? (
                              <span className={item.mrp > item.price ? 'line-through text-xs' : ''}>
                                {formatPrice(item.mrp)}
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#0a1f44]">
                            {formatPrice(item.price)}
                          </td>
                          <td className="py-3 px-4">
                            {discount > 0 ? (
                              <Badge variant="success" size="sm">
                                {discount}% OFF
                              </Badge>
                            ) : (
                              <span className="text-[#9ca3af] text-xs">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {item.isNavratri && (
                                <Badge variant="warning" size="sm">
                                  Navratri
                                </Badge>
                              )}
                              {item.bestseller && (
                                <Badge variant="info" size="sm">
                                  Bestseller
                                </Badge>
                              )}
                              {!item.isNavratri && !item.bestseller && (
                                <span className="text-[#9ca3af] text-xs">—</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => openDeleteConfirmation(item)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile Stacked Cards View (< 768px) */}
          <div className="md:hidden space-y-3">
            {filteredList.map((item) => {
              const discount = item.discountPercent || (item.mrp && item.mrp > item.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0);
              return (
                <Card key={item._id} padding="sm" className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image?.[0] || ''}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl border border-[#e6e1d6] shrink-0 bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-[#0a1f44] truncate">{item.name}</h4>
                        <Badge variant="neutral" size="sm" className="shrink-0">
                          {item.section || 'Women'}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#6b7280] mt-0.5">{item.category}</p>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {item.isNavratri && (
                          <Badge variant="warning" size="sm">
                            Navratri
                          </Badge>
                        )}
                        {item.bestseller && (
                          <Badge variant="info" size="sm">
                            Bestseller
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#e6e1d6] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0a1f44]">{formatPrice(item.price)}</span>
                      {item.mrp && item.mrp > item.price && (
                        <span className="line-through text-[#9ca3af]">{formatPrice(item.mrp)}</span>
                      )}
                      {discount > 0 && (
                        <Badge variant="success" size="sm">
                          {discount}% OFF
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => openDeleteConfirmation(item)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={
          selectedProduct
            ? `Are you sure you want to delete "${selectedProduct.name}"? This action cannot be undone.`
            : 'Are you sure you want to delete this product?'
        }
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ListProducts;
