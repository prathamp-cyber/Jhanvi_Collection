import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Button,
  Card,
  Input,
  Select,
  Textarea,
  Badge,
  PageHeader
} from './components/ui';

const CATEGORY_OPTIONS = [
  { value: 'Rings', label: 'Rings' },
  { value: 'Bracelet', label: 'Bracelet' },
  { value: 'Necklace', label: 'Necklace' },
  { value: 'Bangles', label: 'Bangles' },
  { value: 'Earrings', label: 'Earrings' },
  { value: 'Maang Tikka', label: 'Maang Tikka' },
  { value: 'Bridal Sets', label: 'Bridal Sets' },
  { value: 'Anklets', label: 'Anklets' }
];

const AddProduct = ({ token, backendUrl }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Rings');
  const [section, setSection] = useState('Women');
  const [mrp, setMrp] = useState('');
  const [price, setPrice] = useState('');

  const [images, setImages] = useState([null, null, null, null]);
  const [variants, setVariants] = useState([]);

  const [bestseller, setBestseller] = useState(false);
  const [isNavratri, setIsNavratri] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const nameInputRef = useRef(null);

  // Discount calculation
  const numMrp = Number(mrp);
  const numPrice = Number(price);
  const isPriceInvalid = numMrp > 0 && numPrice > 0 && numPrice > numMrp;

  let discountText = null;
  if (numMrp > 0 && numPrice > 0 && !isPriceInvalid) {
    const percent = Math.round(((numMrp - numPrice) / numMrp) * 100);
    discountText = percent > 0 ? `${percent}% OFF` : 'No discount';
  }

  // Handle image select
  const handleImageChange = (index, file) => {
    if (!file) return;
    setImages(prev => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
    setFormErrors(prev => ({ ...prev, images: null }));
  };

  // Handle image remove
  const handleRemoveImage = (index) => {
    setImages(prev => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  };

  // Add new variant row
  const handleAddVariantRow = () => {
    setVariants(prev => [
      ...prev,
      { id: crypto.randomUUID(), label: '', values: [], currentInput: '' }
    ]);
  };

  // Remove variant row
  const handleRemoveVariantRow = (id) => {
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  // Update variant label
  const handleVariantLabelChange = (id, labelVal) => {
    setVariants(prev =>
      prev.map(v => (v.id === id ? { ...v, label: labelVal } : v))
    );
  };

  // Update variant current text input
  const handleVariantInputChange = (id, textVal) => {
    setVariants(prev =>
      prev.map(v => (v.id === id ? { ...v, currentInput: textVal } : v))
    );
  };

  // Add tag/chip to variant
  const handleAddChip = (id) => {
    setVariants(prev =>
      prev.map(v => {
        if (v.id === id) {
          const valToAdd = v.currentInput.trim();
          if (valToAdd && !v.values.includes(valToAdd)) {
            return {
              ...v,
              values: [...v.values, valToAdd],
              currentInput: ''
            };
          }
          return { ...v, currentInput: '' };
        }
        return v;
      })
    );
  };

  // Keydown handler for tag/chip input
  const handleChipKeyDown = (e, id, currentVal, valuesArr) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddChip(id);
    } else if (e.key === 'Backspace' && currentVal === '' && valuesArr.length > 0) {
      // Remove last chip on backspace if input is empty
      setVariants(prev =>
        prev.map(v => {
          if (v.id === id) {
            const newValues = [...v.values];
            newValues.pop();
            return { ...v, values: newValues };
          }
          return v;
        })
      );
    }
  };

  // Remove single chip
  const handleRemoveChip = (variantId, chipVal) => {
    setVariants(prev =>
      prev.map(v => {
        if (v.id === variantId) {
          return { ...v, values: v.values.filter(val => val !== chipVal) };
        }
        return v;
      })
    );
  };

  // Validate form before submit
  const validate = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Product name is required';
    if (!description.trim()) errors.description = 'Description is required';
    if (!mrp || Number(mrp) <= 0) errors.mrp = 'Valid MRP is required';
    if (!price || Number(price) <= 0) errors.price = 'Valid Price is required';
    if (isPriceInvalid) errors.price = 'Price cannot be greater than MRP';

    const hasImage = images.some(img => img !== null);
    if (!hasImage) errors.images = 'At least one image is required';

    // Validate variant rows
    const variantErrorMessages = [];
    variants.forEach((v, idx) => {
      const labelTrimmed = v.label.trim();
      const effectiveValues = [...v.values];
      if (v.currentInput.trim() && !effectiveValues.includes(v.currentInput.trim())) {
        effectiveValues.push(v.currentInput.trim());
      }
      if (!labelTrimmed || effectiveValues.length === 0) {
        variantErrorMessages[idx] = 'Each variant requires a label and at least one value';
      }
    });

    if (variantErrorMessages.some(Boolean)) {
      errors.variantRows = variantErrorMessages;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      toast.error('Please fix the errors in the form before submitting');
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('section', section);
      formData.append('mrp', mrp);
      formData.append('price', price);
      formData.append('isNavratri', isNavratri ? 'true' : 'false');
      formData.append('bestseller', bestseller ? 'true' : 'false');

      // Filter and format variants
      const formattedVariants = variants.map(v => {
        const vals = [...v.values];
        if (v.currentInput.trim() && !vals.includes(v.currentInput.trim())) {
          vals.push(v.currentInput.trim());
        }
        return {
          label: v.label.trim(),
          values: vals
        };
      });

      formData.append('variants', JSON.stringify(formattedVariants));

      // Append images
      images.forEach((img, idx) => {
        if (img) {
          formData.append(`image${idx + 1}`, img);
        }
      });

      const url = `${backendUrl || 'http://localhost:4000'}/api/product/add`;
      const response = await axios.post(url, formData, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message || 'Product added successfully');
        // Reset form
        setName('');
        setDescription('');
        setCategory('Rings');
        setSection('Women');
        setMrp('');
        setPrice('');
        setImages([null, null, null, null]);
        setVariants([]);
        setBestseller(false);
        setIsNavratri(false);
        setFormErrors({});
        setServerError('');

        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      } else {
        setServerError(response.data.message || 'Failed to add product');
        toast.error(response.data.message || 'Failed to add product');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'An unexpected error occurred';
      setServerError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 admin-animate-fade-in">
      <PageHeader
        title="Add New Product"
        subtitle="Add a new jewellery item with custom options, pricing, and images."
      />

      {serverError && (
        <div className="p-4 bg-[#fee2e2] border border-[#fecaca] rounded-xl text-[#b91c1c] text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{serverError}</span>
          </div>
          <button
            type="button"
            onClick={() => setServerError('')}
            className="text-[#b91c1c] hover:text-[#7f1d1d] font-bold p-1 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Basic Info, Pricing, Visibility */}
        <div className="lg:col-span-7 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <h3 className="text-base font-bold text-[#0a1f44] mb-4 pb-2 border-b border-[#e6e1d6]">
              Basic Info
            </h3>
            <div className="space-y-4">
              <Input
                ref={nameInputRef}
                label="Product Name"
                placeholder="e.g. Kundan Necklace Set"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setFormErrors(prev => ({ ...prev, name: null }));
                }}
                error={formErrors.name}
                required
              />

              <Textarea
                label="Description"
                placeholder="Describe the product material, design, and details..."
                value={description}
                rows={4}
                onChange={e => {
                  setDescription(e.target.value);
                  setFormErrors(prev => ({ ...prev, description: null }));
                }}
                error={formErrors.description}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  options={CATEGORY_OPTIONS}
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#1b2437]">
                    Section <span className="text-[#b91c1c]">*</span>
                  </label>
                  <div className="flex items-center gap-2 h-[44px]">
                    <button
                      type="button"
                      onClick={() => setSection('Women')}
                      className={`flex-1 min-h-[44px] rounded-lg font-medium text-sm transition-all duration-150 border cursor-pointer ${
                        section === 'Women'
                          ? 'bg-[#0a1f44] text-white border-[#0a1f44]'
                          : 'bg-white text-[#1b2437] border-[#e6e1d6] hover:bg-[#f8f6f0]'
                      }`}
                    >
                      Women
                    </button>
                    <button
                      type="button"
                      onClick={() => setSection('Kids')}
                      className={`flex-1 min-h-[44px] rounded-lg font-medium text-sm transition-all duration-150 border cursor-pointer ${
                        section === 'Kids'
                          ? 'bg-[#0a1f44] text-white border-[#0a1f44]'
                          : 'bg-white text-[#1b2437] border-[#e6e1d6] hover:bg-[#f8f6f0]'
                      }`}
                    >
                      Kids
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Pricing Card */}
          <Card>
            <h3 className="text-base font-bold text-[#0a1f44] mb-4 pb-2 border-b border-[#e6e1d6]">
              Pricing
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="MRP (₹)"
                  type="number"
                  placeholder="e.g. 999"
                  min="0"
                  step="any"
                  value={mrp}
                  onChange={e => {
                    setMrp(e.target.value);
                    setFormErrors(prev => ({ ...prev, mrp: null, price: null }));
                  }}
                  error={formErrors.mrp}
                  required
                />

                <Input
                  label="Selling Price (₹)"
                  type="number"
                  placeholder="e.g. 599"
                  min="0"
                  step="any"
                  value={price}
                  onChange={e => {
                    setPrice(e.target.value);
                    setFormErrors(prev => ({ ...prev, price: null }));
                  }}
                  error={formErrors.price || (isPriceInvalid ? 'Price cannot be greater than MRP' : null)}
                  required
                />
              </div>

              {/* Live Discount Indicator */}
              <div className="flex items-center justify-between pt-2 px-3 py-2 bg-[#f8f6f0] border border-[#e6e1d6] rounded-lg text-sm">
                <span className="font-semibold text-[#6b7280]">Computed Discount:</span>
                {isPriceInvalid ? (
                  <span className="text-[#b91c1c] font-bold text-xs">Invalid (Price &gt; MRP)</span>
                ) : discountText ? (
                  <Badge variant={discountText === 'No discount' ? 'neutral' : 'success'}>
                    {discountText}
                  </Badge>
                ) : (
                  <span className="text-[#9ca3af] text-xs">Enter MRP & Price</span>
                )}
              </div>
            </div>
          </Card>

          {/* Visibility Card */}
          <Card>
            <h3 className="text-base font-bold text-[#0a1f44] mb-4 pb-2 border-b border-[#e6e1d6]">
              Visibility & Collection
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 border border-[#e6e1d6] rounded-lg cursor-pointer hover:bg-[#f8f6f0] transition-colors">
                <div>
                  <span className="text-sm font-semibold text-[#1b2437] block">Add to Bestseller</span>
                  <span className="text-xs text-[#6b7280] block">Feature this product in bestseller sections.</span>
                </div>
                <input
                  type="checkbox"
                  checked={bestseller}
                  onChange={e => setBestseller(e.target.checked)}
                  className="w-5 h-5 accent-[#0a1f44] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 border border-[#e6e1d6] rounded-lg cursor-pointer hover:bg-[#f8f6f0] transition-colors">
                <div>
                  <span className="text-sm font-semibold text-[#1b2437] block">Show in Navratri Collection</span>
                  <span className="text-xs text-[#6b7280] block">Mark item for special festive Navratri collection.</span>
                </div>
                <input
                  type="checkbox"
                  checked={isNavratri}
                  onChange={e => setIsNavratri(e.target.checked)}
                  className="w-5 h-5 accent-[#0a1f44] cursor-pointer"
                />
              </label>
            </div>
          </Card>
        </div>

        {/* Right Column: Images & Variants */}
        <div className="lg:col-span-5 space-y-6">
          {/* Images Card */}
          <Card>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#e6e1d6]">
              <h3 className="text-base font-bold text-[#0a1f44]">
                Images <span className="text-[#b91c1c]">*</span>
              </h3>
              <span className="text-xs text-[#6b7280]">Min 1 image</span>
            </div>

            {formErrors.images && (
              <p className="text-xs text-[#b91c1c] font-semibold mb-3">{formErrors.images}</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <label
                    htmlFor={`image-slot-${idx}`}
                    className={`relative w-full aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer transition-all duration-150 overflow-hidden ${
                      img
                        ? 'border-[#0a1f44] bg-white'
                        : 'border-[#d6d0c2] bg-[#f8f6f0] hover:border-[#0a1f44] hover:bg-white'
                    }`}
                  >
                    {img ? (
                      <>
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveImage(idx);
                          }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-[#b91c1c] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:bg-[#991b1b]"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-[#6b7280] text-center">
                        <svg className="w-7 h-7 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-xs font-semibold">Slot {idx + 1}</span>
                      </div>
                    )}

                    <input
                      id={`image-slot-${idx}`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={e => handleImageChange(idx, e.target.files[0])}
                      hidden
                    />
                  </label>
                  {idx === 0 && (
                    <span className="text-[11px] text-[#6b7280] mt-1.5 text-center font-medium">
                      First image is shown first
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Variants Card */}
          <Card>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#e6e1d6]">
              <div>
                <h3 className="text-base font-bold text-[#0a1f44]">Variants</h3>
                <p className="text-xs text-[#6b7280]">Free-form options (e.g. Size, Color)</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddVariantRow}
              >
                + Add Variant
              </Button>
            </div>

            {variants.length === 0 ? (
              <p className="text-xs text-[#9ca3af] italic text-center py-4 bg-[#f8f6f0] rounded-lg border border-dashed border-[#e6e1d6]">
                No variants added. Click "+ Add Variant" to create custom options like Size or Color.
              </p>
            ) : (
              <div className="space-y-4">
                {variants.map((v, idx) => (
                  <div
                    key={v.id}
                    className="p-3.5 bg-[#f8f6f0] border border-[#e6e1d6] rounded-xl space-y-3 relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Input
                        label={`Variant ${idx + 1} Name`}
                        placeholder="e.g. Size, Color, Type"
                        value={v.label}
                        onChange={e => handleVariantLabelChange(v.id, e.target.value)}
                        className="bg-white"
                        fullWidth
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVariantRow(v.id)}
                        className="mt-6 p-2 text-[#b91c1c] hover:bg-[#fee2e2] rounded-lg transition-colors cursor-pointer"
                        title="Remove Variant Row"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Tag / Chip input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#1b2437] block">
                        Values (Press Enter or comma to add tag)
                      </label>

                      {/* Render Chips */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {v.values.map((chipVal, cIdx) => (
                          <Badge key={cIdx} variant="neutral" size="sm" className="gap-1.5 bg-white shadow-2xs">
                            <span>{chipVal}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveChip(v.id, chipVal)}
                              className="text-[#6b7280] hover:text-[#b91c1c] font-bold cursor-pointer text-xs"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          placeholder="Type option value..."
                          value={v.currentInput}
                          onChange={e => handleVariantInputChange(v.id, e.target.value)}
                          onKeyDown={e => handleChipKeyDown(e, v.id, v.currentInput, v.values)}
                          onBlur={() => handleAddChip(v.id)}
                          className="bg-white"
                          fullWidth
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAddChip(v.id)}
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    {formErrors.variantRows && formErrors.variantRows[idx] && (
                      <p className="text-xs text-[#b91c1c] font-medium">{formErrors.variantRows[idx]}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Action Submit Card */}
          <Card className="space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              isDisabled={isPriceInvalid}
            >
              Add Product
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
