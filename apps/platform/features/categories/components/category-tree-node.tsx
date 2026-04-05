'use client';

import { useState, useCallback } from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2, Loader2 } from 'lucide-react';

import type { CategoryNode } from '../types';

// ----------------------------------------------------------------
// Icon registry — maps category name keywords to emoji icons
// ----------------------------------------------------------------

const ICON_REGISTRY: Record<string, { bg: string; symbol: string }> = {
  animals: { bg: 'bg-cyan-50', symbol: '🐾' },
  apparel: { bg: 'bg-purple-50', symbol: '👔' },
  arts: { bg: 'bg-rose-50', symbol: '🎨' },
  baby: { bg: 'bg-yellow-50', symbol: '🍼' },
  business: { bg: 'bg-slate-50', symbol: '🏢' },
  cameras: { bg: 'bg-indigo-50', symbol: '📷' },
  electronics: { bg: 'bg-blue-50', symbol: '📱' },
  food: { bg: 'bg-lime-50', symbol: '🍕' },
  furniture: { bg: 'bg-amber-50', symbol: '🪑' },
  hardware: { bg: 'bg-gray-100', symbol: '🔧' },
  health: { bg: 'bg-teal-50', symbol: '💊' },
  home: { bg: 'bg-emerald-50', symbol: '🏠' },
  luggage: { bg: 'bg-orange-50', symbol: '🧳' },
  mature: { bg: 'bg-red-50', symbol: '🔞' },
  media: { bg: 'bg-indigo-50', symbol: '📚' },
  office: { bg: 'bg-slate-50', symbol: '🖨️' },
  religious: { bg: 'bg-amber-50', symbol: '🕉️' },
  software: { bg: 'bg-violet-50', symbol: '💻' },
  sporting: { bg: 'bg-orange-50', symbol: '⚽' },
  toys: { bg: 'bg-pink-50', symbol: '🧸' },
  vehicles: { bg: 'bg-gray-100', symbol: '🚗' },
};

function getIconInfo(name: string): { bg: string; symbol: string } {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(ICON_REGISTRY)) {
    if (lower.includes(key)) return val;
  }
  return { bg: 'bg-gray-50', symbol: name.charAt(0) };
}

// ----------------------------------------------------------------
// Text constants
// ----------------------------------------------------------------

const TEXT = {
  products: 'products',
  sellers: 'sellers',
  disabled: 'Disabled',
  active: 'Active',
  inactive: 'Inactive',
  commission: 'Commission:',
  hsn: 'HSN:',
  parent: 'parent:',
  sort: 'sort:',
} as const;

// ----------------------------------------------------------------
// Props
// ----------------------------------------------------------------

interface TreeNodeProps {
  node: CategoryNode;
  depth: number;
  searchQuery: string;
  onExpand: (parentId: string) => Promise<void>;
  loadingParents: Set<string>;
  onEdit: (node: CategoryNode) => void;
  onToggleActive: (node: CategoryNode) => void;
  onDelete: (node: CategoryNode) => void;
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function CategoryTreeNode({ node, depth, searchQuery, onExpand, loadingParents, onEdit, onToggleActive, onDelete }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children.length > 0;
  const canExpand = node.hasChildren;
  const isRoot = depth === 0;
  const isInactive = !node.active;
  const iconInfo = getIconInfo(node.name);
  const isLoadingChildren = loadingParents.has(node.id);

  const handleToggle = useCallback(async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    // Lazy-load children if not yet loaded
    if (!node.childrenLoaded) {
      await onExpand(node.id);
    }
    setExpanded(true);
  }, [expanded, node.childrenLoaded, node.id, onExpand]);

  // Search filtering — only check loaded children
  const matchesSearch =
    searchQuery === '' ||
    node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.children.some(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  if (!matchesSearch) return null;

  return (
    <div role="treeitem" aria-expanded={canExpand ? expanded : undefined} aria-level={depth + 1}>
      {/* Node row */}
      <div
        className={`flex items-center justify-between px-4 py-3 ${
          isRoot
            ? isInactive
              ? 'rounded-lg bg-red-50/30'
              : 'rounded-t-lg bg-gray-50'
            : 'transition-colors hover:bg-orange-50/40'
        } ${isInactive ? 'opacity-60' : ''}`}
      >
        {/* Left: toggle + icon + info */}
        <div className="flex items-center gap-3">
          {/* Expand/collapse toggle */}
          {canExpand ? (
            <button
              type="button"
              onClick={handleToggle}
              disabled={isLoadingChildren}
              className="rounded p-0.5 text-gray-500 transition hover:text-gray-700 disabled:opacity-50"
              aria-label={expanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
            >
              {isLoadingChildren ? (
                <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
              ) : expanded ? (
                <ChevronDown className="h-5 w-5 transform transition-transform" />
              ) : (
                <ChevronRight className="h-5 w-5 transform transition-transform" />
              )}
            </button>
          ) : (
            <span className="ml-0.5 mr-0.5 h-5 w-5" aria-hidden="true" />
          )}

          {/* Category icon (root only) */}
          {isRoot && (
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                isInactive ? 'bg-gray-100' : iconInfo.bg
              }`}
            >
              <span className="text-sm" aria-hidden="true">
                {iconInfo.symbol}
              </span>
            </div>
          )}

          {/* Name + meta */}
          <div>
            <p
              className={`text-sm font-semibold ${
                isInactive ? 'text-gray-500' : 'text-gray-900'
              }`}
            >
              {node.name}
            </p>
            {isRoot ? (
              <>
                <p className="text-xs text-gray-400">
                  {isInactive
                    ? `0 ${TEXT.products} \u00B7 ${TEXT.disabled}`
                    : `${node.productCount.toLocaleString('en-IN')} ${TEXT.products} \u00B7 ${node.sellerCount.toLocaleString('en-IN')} ${TEXT.sellers}`}
                </p>
                {!isInactive && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] text-gray-400">
                      ID: {node.id.length > 12 ? node.id.slice(0, 12) + '\u2026' : node.id}
                    </span>
                    <span className="rounded bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] text-gray-400">
                      slug: {node.slug}
                    </span>
                    <span className="rounded bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-400">
                      {TEXT.parent} root
                    </span>
                    <span className="rounded bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-400">
                      {TEXT.sort} {node.displayOrder}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-400">
                {node.productCount.toLocaleString('en-IN')} {TEXT.products}
              </p>
            )}
          </div>
        </div>

        {/* Right: commission + HSN + status + actions */}
        <div className="flex items-center gap-3">
          {/* Commission badge (root active only) */}
          {isRoot && !isInactive && node.commissionRate > 0 && (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
              {TEXT.commission}{' '}
              <span className="font-semibold text-gray-800">{node.commissionRate}%</span>
            </span>
          )}

          {/* HSN badge (root active only) */}
          {isRoot && !isInactive && node.hsnCode && (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
              {TEXT.hsn}{' '}
              <span className="font-semibold text-gray-800 font-mono">{node.hsnCode}</span>
            </span>
          )}

          {/* Status badge (clickable toggle) */}
          <button
            type="button"
            onClick={() => onToggleActive(node)}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition hover:opacity-80 ${
              node.active
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-600'
            }`}
            title={node.active ? `Deactivate ${node.name}` : `Activate ${node.name}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                node.active ? 'bg-green-500' : 'bg-red-400'
              }`}
              aria-hidden="true"
            />
            {node.active ? TEXT.active : TEXT.inactive}
          </button>

          {/* Edit button */}
          <button
            type="button"
            onClick={() => onEdit(node)}
            className="rounded-md p-1.5 text-gray-400 transition hover:bg-orange-50 hover:text-orange-500"
            title={`Edit ${node.name}`}
            aria-label={`Edit ${node.name}`}
          >
            <Edit className="h-4 w-4" />
          </button>

          {/* Delete button (active root nodes only) */}
          {!isInactive && isRoot && (
            <button
              type="button"
              onClick={() => onDelete(node)}
              className="rounded-md p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600"
              title={`Delete ${node.name}`}
              aria-label={`Delete ${node.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Children (expanded + loaded) */}
      {hasChildren && expanded && (
        <div
          role="group"
          className={`overflow-hidden transition-all ${
            isRoot ? 'ml-10 border-l-2 border-gray-200 py-2 pr-4' : 'ml-8 border-l-2 border-gray-100'
          }`}
        >
          {node.children.map((child) => (
            <CategoryTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              searchQuery={searchQuery}
              onExpand={onExpand}
              loadingParents={loadingParents}
              onEdit={onEdit}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
