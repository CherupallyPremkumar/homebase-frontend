'use client';

import { Suspense, useState, useCallback } from 'react';
import { Download, Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { SectionErrorBoundary } from '../../../components/section-error-boundary';

import { CategoryStats, CategoryStatsSkeleton } from './category-stats';
import { CategoryTree } from './category-tree';
import { CategoryRulesTable, RulesTableSkeleton } from './category-rules-table';
import { CategoryAddModal } from './category-add-modal';
import { CategoryEditModal } from './category-edit-modal';
import type { CategoryEditData } from './category-edit-modal';
import { useCategoryTree, useDeleteCategory, useExportCategories } from '../hooks/use-categories';
import type { CategoryNode } from '../types';

// ----------------------------------------------------------------
// Text constants
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Category Management',
  pageSubtitle: 'Organize products with hierarchical categories and attributes',
  export: 'Export',
  addCategory: 'Add Category',
} as const;

// ----------------------------------------------------------------
// Orchestrator
// ----------------------------------------------------------------

export function CategoriesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryNode | null>(null);
  const treeQuery = useCategoryTree();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteCategory();
  const exportMutation = useExportCategories();

  const handleEdit = useCallback((node: CategoryNode) => {
    setEditCategory(node);
  }, []);

  const handleDelete = useCallback(
    (node: CategoryNode) => {
      if (!confirm(`Delete category "${node.name}"? This will affect ${node.productCount} products.`)) return;
      deleteMutation.mutate(node.id);
    },
    [deleteMutation],
  );

  const handleExport = useCallback(() => {
    exportMutation.mutate('csv');
  }, [exportMutation]);

  const handleToggleActive = useCallback(
    (node: CategoryNode) => {
      const updated = { ...node, active: !node.active };
      // Optimistic update in the tree cache
      queryClient.setQueryData<CategoryNode[]>(['category-tree-roots'], (old) => {
        if (!old) return old;
        return updateNodeInTree(old, updated);
      });
      // Invalidate stats to refresh counts
      queryClient.invalidateQueries({ queryKey: ['category-stats'] });
    },
    [queryClient],
  );

  const handleSaveEdit = useCallback(
    (data: CategoryEditData) => {
      // Optimistic update in the tree cache
      queryClient.setQueryData<CategoryNode[]>(['category-tree-roots'], (old) => {
        if (!old) return old;
        return updateNodeInTree(old, {
          ...editCategory!,
          name: data.name,
          description: data.description,
          active: data.active,
          commissionRate: data.commissionRate,
          gstRate: data.gstRate,
          hsnCode: data.hsnCode,
        });
      });
      queryClient.invalidateQueries({ queryKey: ['category-stats'] });
      setEditCategory(null);
    },
    [editCategory, queryClient],
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="flex items-center justify-between">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
        </header>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExport}
            disabled={exportMutation.isPending}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {exportMutation.isPending ? 'Exporting...' : TEXT.export}
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {TEXT.addCategory}
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <SectionErrorBoundary section="Category Statistics">
        <Suspense fallback={<CategoryStatsSkeleton />}>
          <CategoryStats />
        </Suspense>
      </SectionErrorBoundary>

      {/* Category Tree */}
      <SectionErrorBoundary section="Category Tree">
        <CategoryTree onEdit={handleEdit} onToggleActive={handleToggleActive} onDelete={handleDelete} />
      </SectionErrorBoundary>

      {/* Category Rules Table */}
      <SectionErrorBoundary section="Category Rules">
        <Suspense fallback={<RulesTableSkeleton />}>
          <CategoryRulesTable />
        </Suspense>
      </SectionErrorBoundary>

      {/* Add Category Modal */}
      <CategoryAddModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        rootCategories={treeQuery.data ?? []}
      />

      {/* Edit Category Modal */}
      <CategoryEditModal
        open={editCategory !== null}
        onClose={() => setEditCategory(null)}
        onSave={handleSaveEdit}
        category={editCategory}
        rootCategories={treeQuery.data ?? []}
      />
    </div>
  );
}

/** Recursively find and update a node in the tree */
function updateNodeInTree(nodes: CategoryNode[], updated: CategoryNode): CategoryNode[] {
  return nodes.map((node) => {
    if (node.id === updated.id) return { ...node, ...updated };
    if (node.children.length > 0) {
      return { ...node, children: updateNodeInTree(node.children, updated) };
    }
    return node;
  });
}
