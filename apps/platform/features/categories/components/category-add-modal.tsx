'use client';

import { useState, useCallback } from 'react';
import { X } from 'lucide-react';

import type { CategoryNode } from '../types';
import type { CreateCategoryDto } from '@homebase/api-client';
import { useCreateCategory } from '../hooks/use-categories';

// ----------------------------------------------------------------
// Text constants
// ----------------------------------------------------------------

const TEXT = {
  title: 'Add New Category',
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
  cancel: 'Cancel',
  save: 'Save Category',
  modalLabel: 'Add new category dialog',
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
// Props
// ----------------------------------------------------------------

interface CategoryAddModalProps {
  open: boolean;
  onClose: () => void;
  rootCategories: CategoryNode[];
}

// ----------------------------------------------------------------
// Initial form state
// ----------------------------------------------------------------

const INITIAL_FORM = {
  name: '',
  parentId: '',
  commissionRate: 0,
  gstRate: 18,
  hsnCode: '',
  returnValue: '10-REPLACEMENT',
  maxWeightKg: 25,
  restrictionType: 'OPEN',
  minImages: 3,
  minDescriptionLength: 100,
  eanRequired: false,
  description: '',
};

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function CategoryAddModal({ open, onClose, rootCategories }: CategoryAddModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const createMutation = useCreateCategory();

  const handleChange = useCallback(
    (field: string, value: string | number | boolean) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const [returnDaysStr, returnType] = form.returnValue.split('-');
      const dto: CreateCategoryDto = {
        name: form.name,
        parentId: form.parentId,
        commissionRate: form.commissionRate,
        gstRate: form.gstRate,
        hsnCode: form.hsnCode,
        returnDays: parseInt(returnDaysStr, 10) || 0,
        returnType: returnType ?? 'REPLACEMENT',
        maxWeightKg: form.maxWeightKg,
        restrictionType: form.restrictionType,
        minImages: form.minImages,
        minDescriptionLength: form.minDescriptionLength,
        eanRequired: form.eanRequired,
        description: form.description,
      };

      createMutation.mutate(dto, {
        onSuccess: () => {
          setForm(INITIAL_FORM);
          onClose();
        },
      });
    },
    [form, onClose, createMutation],
  );

  const handleClose = useCallback(() => {
    setForm(INITIAL_FORM);
    onClose();
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={TEXT.modalLabel}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative mx-4 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">{TEXT.title}</h3>
          <button
            type="button"
            onClick={handleClose}
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
              <label htmlFor="add-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                {TEXT.nameLabel}
              </label>
              <input
                id="add-name"
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
              <label htmlFor="add-parent" className="mb-1.5 block text-sm font-medium text-gray-700">
                {TEXT.parentLabel}
              </label>
              <select
                id="add-parent"
                value={form.parentId}
                onChange={(e) => handleChange('parentId', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="">{TEXT.parentRoot}</option>
                {rootCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Commission + GST */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="add-commission" className="mb-1.5 block text-sm font-medium text-gray-700">
                  {TEXT.commissionLabel}
                </label>
                <div className="relative">
                  <input
                    id="add-commission"
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
                <label htmlFor="add-gst" className="mb-1.5 block text-sm font-medium text-gray-700">
                  {TEXT.gstLabel}
                </label>
                <select
                  id="add-gst"
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
              <label htmlFor="add-hsn" className="mb-1.5 block text-sm font-medium text-gray-700">
                {TEXT.hsnLabel}
              </label>
              <input
                id="add-hsn"
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
                <label htmlFor="add-return" className="mb-1.5 block text-sm font-medium text-gray-700">
                  {TEXT.returnLabel}
                </label>
                <select
                  id="add-return"
                  value={form.returnValue}
                  onChange={(e) => handleChange('returnValue', e.target.value)}
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
                <label htmlFor="add-weight" className="mb-1.5 block text-sm font-medium text-gray-700">
                  {TEXT.weightLabel}
                </label>
                <div className="relative">
                  <input
                    id="add-weight"
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
              <label htmlFor="add-restriction" className="mb-1.5 block text-sm font-medium text-gray-700">
                {TEXT.restrictionLabel}
              </label>
              <select
                id="add-restriction"
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
                  <label htmlFor="add-min-images" className="text-xs text-gray-500">
                    {TEXT.minImagesLabel}
                  </label>
                  <input
                    id="add-min-images"
                    type="number"
                    min={1}
                    value={form.minImages}
                    onChange={(e) => handleChange('minImages', parseInt(e.target.value, 10) || 1)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-orange-400"
                  />
                </div>
                <div>
                  <label htmlFor="add-min-desc" className="text-xs text-gray-500">
                    {TEXT.minDescLabel}
                  </label>
                  <input
                    id="add-min-desc"
                    type="number"
                    min={0}
                    value={form.minDescriptionLength}
                    onChange={(e) => handleChange('minDescriptionLength', parseInt(e.target.value, 10) || 0)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-orange-400"
                  />
                  <span className="text-[10px] text-gray-400">chars</span>
                </div>
                <div>
                  <label htmlFor="add-ean" className="text-xs text-gray-500">
                    {TEXT.eanLabel}
                  </label>
                  <select
                    id="add-ean"
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
              <label htmlFor="add-desc" className="mb-1.5 block text-sm font-medium text-gray-700">
                {TEXT.descriptionLabel}
              </label>
              <textarea
                id="add-desc"
                rows={2}
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder={TEXT.descriptionPlaceholder}
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
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
