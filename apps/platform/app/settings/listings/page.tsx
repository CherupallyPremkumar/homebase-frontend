'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Inline Toggle Switch                                               */
/* ------------------------------------------------------------------ */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-green-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Checkbox helper                                                    */
/* ------------------------------------------------------------------ */
function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
      />
      {label}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function ListingsSettingsPage() {
  const [minImages, setMinImages] = useState(3);
  const [maxImages, setMaxImages] = useState(10);
  const [minResolution, setMinResolution] = useState('800x800');
  const [maxFileSize, setMaxFileSize] = useState('5MB');
  const [autoApprove, setAutoApprove] = useState(false);

  // Allowed image formats
  const [formatJpg, setFormatJpg] = useState(true);
  const [formatPng, setFormatPng] = useState(true);
  const [formatWebp, setFormatWebp] = useState(true);

  // Mandatory fields
  const [mandatoryDesc, setMandatoryDesc] = useState(true);
  const [mandatoryBrand, setMandatoryBrand] = useState(true);
  const [mandatoryCategory, setMandatoryCategory] = useState(true);
  const [mandatoryWeight, setMandatoryWeight] = useState(true);
  const [mandatoryHsn, setMandatoryHsn] = useState(false);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-600 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </Link>

      {/* Header + Save */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Product Listings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Image rules, listing rules, and mandatory fields
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert('Settings saved')}
          className="px-5 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition shadow-sm"
        >
          Save Changes
        </button>
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6 space-y-6">
          {/* Min Images */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Min Images Required
            </label>
            <div className="col-span-2">
              <input
                type="number"
                value={minImages}
                onChange={(e) => setMinImages(Number(e.target.value))}
                className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
              />
              <p className="text-xs text-gray-400 mt-1">
                Minimum number of product images per listing
              </p>
            </div>
          </div>

          {/* Max Images */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Max Images
            </label>
            <div className="col-span-2">
              <input
                type="number"
                value={maxImages}
                onChange={(e) => setMaxImages(Number(e.target.value))}
                className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
              />
              <p className="text-xs text-gray-400 mt-1">
                Maximum number of product images per listing
              </p>
            </div>
          </div>

          {/* Min Resolution */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Min Image Resolution
            </label>
            <div className="col-span-2">
              <input
                type="text"
                value={minResolution}
                onChange={(e) => setMinResolution(e.target.value)}
                className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
              />
              <p className="text-xs text-gray-400 mt-1">
                Minimum width x height in pixels
              </p>
            </div>
          </div>

          {/* Max File Size */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Max File Size per Image
            </label>
            <div className="col-span-2">
              <input
                type="text"
                value={maxFileSize}
                onChange={(e) => setMaxFileSize(e.target.value)}
                className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
              />
            </div>
          </div>

          {/* Allowed Formats */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Allowed Formats
            </label>
            <div className="col-span-2 flex items-center gap-6 pt-2">
              <Checkbox
                label="JPG"
                checked={formatJpg}
                onChange={setFormatJpg}
              />
              <Checkbox
                label="PNG"
                checked={formatPng}
                onChange={setFormatPng}
              />
              <Checkbox
                label="WebP"
                checked={formatWebp}
                onChange={setFormatWebp}
              />
            </div>
          </div>

          {/* Auto-approve */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Auto-approve Listings
            </label>
            <div className="col-span-2 flex items-center gap-3">
              <Toggle checked={autoApprove} onChange={setAutoApprove} />
              <span className="text-sm text-gray-500">
                Automatically approve new listings without manual review
              </span>
            </div>
          </div>

          {/* Mandatory Fields */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Mandatory Fields
            </label>
            <div className="col-span-2">
              <div className="grid grid-cols-3 gap-3 pt-1">
                <Checkbox
                  label="Description"
                  checked={mandatoryDesc}
                  onChange={setMandatoryDesc}
                />
                <Checkbox
                  label="Brand"
                  checked={mandatoryBrand}
                  onChange={setMandatoryBrand}
                />
                <Checkbox
                  label="Category"
                  checked={mandatoryCategory}
                  onChange={setMandatoryCategory}
                />
                <Checkbox
                  label="Weight"
                  checked={mandatoryWeight}
                  onChange={setMandatoryWeight}
                />
                <Checkbox
                  label="HSN Code"
                  checked={mandatoryHsn}
                  onChange={setMandatoryHsn}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Title, Price, Category, and at least 1 Image are always
                required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
