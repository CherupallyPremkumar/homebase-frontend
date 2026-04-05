'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

import type { CategoryNode } from '../types';

// ----------------------------------------------------------------
// Text constants
// ----------------------------------------------------------------

const TEXT = {
  editTitle: 'Edit Category',
  nameLabel: 'Category Name *',
  namePlaceholder: 'e.g. Smartphones',
  parentLabel: 'Parent Category',
  parentRoot: 'None (Root Category)',
  commissionLabel: 'Commission Rate *',
  commissionPlaceholder: '8',
  gstLabel: 'GST Rate *',
  hsnLabel: 'HSN Code *',
  hsnPlaceholder: 'e.g. 8517',
  returnLabel: 'Return Policy',
  weightLabel: 'Max Shipping Weight',
  weightPlaceholder: '25',
  restrictionLabel: 'Listing Restrictions',
  listingRulesLabel: 'Listing Rules',
  minImagesLabel: 'Min Images',
  minDescLabel: 'Min Description',
  eanLabel: 'EAN/UPC',
  descriptionLabel: 'Description',
  descriptionPlaceholder: 'Brief description of the category',
  activeLabel: 'Active Status',
  cancel: 'Cancel',
  save: 'Save Changes',
  modalLabel: 'Edit category dialog',
} as const;

const GST_OPTIONS = [
  { value: 0, label: '0% (Exempt)' },
  { value: 5, label: '5%' },
  { value: 12, label: '12%' },
  { value: 18, label: '18%' },
  { value: 28, label: '28%' },
];

const RETURN_OPTIONS = [
  { value: '7-REPLACEMENT', label: '7 days - Replacement' },
  { value: '10-REPLACEMENT', label: '10 days - Replacement' },
  { value: '30-RETURN', label: '30 days - Return & Refund' },
  { value: 'NON_RETURNABLE', label: 'Non-returnable' },
];

const RESTRICTION_OPTIONS = [
  { value: 'OPEN', label: 'Open — any seller can list' },
  { value: 'GATED', label: 'Gated — needs admin approval' },
  { value: 'RESTRICTED', label: 'Restricted — requires license/certification' },
];

// ----------------------------------------------------------------
// Form state
// ----------------------------------------------------------------

export interface CategoryEditData {
  id: string;
  name: string;
  parentId: string;
  commissionRate: number;
  gstRate: number;
  hsnCode: string;
  returnDays: number;
  returnType: string;
  maxWeightKg: number;
  restrictionType: string;
  minImages: number;
  minDescriptionLength: number;
  eanRequired: boolean;
  description: string;
  active: boolean;
}

// ----------------------------------------------------------------
// Props
// ----------------------------------------------------------------

interface CategoryEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CategoryEditData) => void;
  category: CategoryNode | null;
  rootCategories: CategoryNode[];
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function CategoryEditModal({ open, onClose, onSave, category, rootCategories }: CategoryEditModalProps) {
  const [form, setForm] = useState<CategoryEditData>({
    id: '',
    name: '',
    parentId: '',
    commissionRate: 0,
    gstRate: 18,
    hsnCode: '',
    returnDays: 10,
    returnType: 'REPLACEMENT',
    maxWeightKg: 25,
    restrictionType: 'OPEN',
    minImages: 3,
    minDescriptionLength: 100,
    eanRequired: false,
    description: '',
    active: true,
  });

  // Populate form when category changes
  useEffect(() => {
    if (category) {
      setForm({
        id: category.id,
        name: category.name,
        parentId: category.parentId ?? '',
        commissionRate: category.commissionRate,
        gstRate: category.gstRate,
        hsnCode: category.hsnCode,
        returnDays: 10,
        returnType: 'REPLACEMENT',
        maxWeightKg: 25,
        restrictionType: 'OPEN',
        minImages: 3,
        minDescriptionLength: 100,
        eanRequired: false,
        description: category.description ?? '',
        active: category.active,
      });
    }
  }, [category]);

  const handleChange = useCallback(
    (field: keyof CategoryEditData, value: string | number | boolean) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleReturnChange = useCallback((value: string) => {
    const [days, type] = value.split('-');
    setForm((prev) => ({
      ...prev,
      returnDays: parseInt(days, 10) || 0,
      returnType: type ?? 'NON_RETURNABLE',
    }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSave(form);
    },
    [form, onSave],
  );

  if (!open || !category) return null;

  const returnValue =
    form.returnType === 'NON_RETURNABLE'
      ? 'NON_RETURNABLE'
      : `${form.returnDays}-${form.returnType}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={TEXT.modalLabel}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative mx-4 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">
            {TEXT.editTitle}: {category.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
            {/* Name */}
            <div>
              <label htmlFor="edit-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                {TEXT.nameLabel}
              </label>
              <input
                id="edit-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder={TEXT.namePlaceholder}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Parent */}
            <div>
              <label htmlFor="edit-parent" className="mb-1.5 block text-sm font-medium text-gray-700">
                {TEXT.parentLabel}
              </label>
              <select
                id="edit-parent"
                value={form.parentId}
                onChange={(e) => handleChange('parentId', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="">{TEXT.parentRoot}</option>
                {rootCategories
                  .filter((c) => c.id !== category.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Commission + GST */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-commission" className="mb-1.5 block text-sm font-medium text-gray-700">
                  {TEXT.commissionLabel}
                </label>
                <div className="relative">
                  <input
                    id="edit-commission"
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={form.commissionRate}
                    onChange={(e) => handleChange('commissionRate', parseFloat(e.target.value) || 0)}
                    placeholder={TEXT.commissionPlaceholder}
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-4 pr-8 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
                </div>
              </div>
              <div>
                <label htmlFor="edit-gst" className="mb-1.5 block text-sm font-medium text-gray-700">
                  {TEXT.gstLabel}
                </label>
                <select
                  id="edit-gst"
                  value={form.gstRate}
                  onChange={(e) => handleChange('gstRate', parseInt(e.target.value, 10))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-400"
                >
                  {GST_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* HSN Code */}
            <div>
              <label htmlFor="edit-hsn" className="mb-1.5 block text-sm font-medium text-gray-700">
                {TEXT.hsnLabel}
              </label>
              <input
                id="edit-hsn"
                type="text"
                value={form.hsnCode}
                onChange={(e) => handleChange('hsnCode', e.target.value)}
                placeholder={TEXT.hsnPlaceholder}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 font-mono text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Return Policy + Max Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-return" className="mb-1.5 block text-sm font-medium text-gray-700">
                  {TEXT.returnLabel}
                </label>
                <select
                  id="edit-return"
                  value={returnValue}
                  onChange={(e) => handleReturnChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-400"
                >
                  {RETURN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="edit-weight" className="mb-1.5 block text-sm font-medium text-gray-700">
                  {TEXT.weightLabel}
                </label>
                <div className="relative">
                  <input
                    id="edit-weight"
                    type="number"
                    min={0}
                    value={form.maxWeightKg}
                    onChange={(e) => handleChange('maxWeightKg', parseFloat(e.target.value) || 0)}
                    placeholder={TEXT.weightPlaceholder}
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-4 pr-8 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">kg</span>
                </div>
              </div>
            </div>

            {/* Listing Restrictions */}
            <div>
              <label htmlFor="edit-restriction" className="mb-1.5 block text-sm font-medium text-gray-700">
                {TEXT.restrictionLabel}
              </label>
              <select
                id="edit-restriction"
                value={form.restrictionType}
                onChange={(e) => handleChange('restrictionType', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-400"
              >
                {RESTRICTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Listing Rules */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {TEXT.listingRulesLabel}
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="edit-min-images" className="text-xs text-gray-500">
                    {TEXT.minImagesLabel}
                  </label>
                  <input
                    id="edit-min-images"
                    type="number"
                    min={1}
                    value={form.minImages}
                    onChange={(e) => handleChange('minImages', parseInt(e.target.value, 10) || 1)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-orange-400"
                  />
                </div>
                <div>
                  <label htmlFor="edit-min-desc" className="text-xs text-gray-500">
                    {TEXT.minDescLabel}
                  </label>
                  <input
                    id="edit-min-desc"
                    type="number"
                    min={0}
                    value={form.minDescriptionLength}
                    onChange={(e) => handleChange('minDescriptionLength', parseInt(e.target.value, 10) || 0)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-orange-400"
                  />
                  <span className="text-[10px] text-gray-400">chars</span>
                </div>
                <div>
                  <label htmlFor="edit-ean" className="text-xs text-gray-500">
                    {TEXT.eanLabel}
                  </label>
                  <select
                    id="edit-ean"
                    value={form.eanRequired ? 'required' : 'optional'}
                    onChange={(e) => handleChange('eanRequired', e.target.value === 'required')}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-400"
                  >
                    <option value="optional">Optional</option>
                    <option value="required">Required</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="edit-desc" className="mb-1.5 block text-sm font-medium text-gray-700">
                {TEXT.descriptionLabel}
              </label>
              <textarea
                id="edit-desc"
                rows={2}
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder={TEXT.descriptionPlaceholder}
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-700">{TEXT.activeLabel}</p>
                <p className="text-xs text-gray-400">
                  {form.active ? 'Category is visible to sellers and customers' : 'Category is hidden from all storefronts'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.active}
                onClick={() => handleChange('active', !form.active)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  form.active ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                    form.active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {TEXT.cancel}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              {TEXT.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
