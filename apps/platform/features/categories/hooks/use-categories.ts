'use client';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { catalogApi } from '@homebase/api-client';
import type { CategoryTreeRow, CategoryRuleRow, CategoryAttributeRow, CreateCategoryDto } from '@homebase/api-client';

import type { CategoryStats, CategoryNode, CategoryRule, CategoryAttribute } from '../types';

// ----------------------------------------------------------------
// Convert API rows to CategoryNode (flat, not nested)
// ----------------------------------------------------------------

function toNode(
  row: CategoryTreeRow,
  rulesMap: Map<string, CategoryRuleRow>,
): CategoryNode {
  const rule = rulesMap.get(row.name) ?? rulesMap.get(row.id);
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    parentId: row.parentId,
    level: row.level,
    displayOrder: row.displayOrder,
    active: row.active,
    featured: row.featured,
    icon: row.icon,
    productCount: 0,
    sellerCount: 0,
    commissionRate: rule?.commissionRate ?? 0,
    hsnCode: rule?.hsnCode ?? '',
    gstRate: rule?.gstRate ?? 0,
    children: [],
    childrenLoaded: false,
    hasChildren: row.hasChildren,
  };
}

// ----------------------------------------------------------------
// Category Tree — lazy-loading by parent
// ----------------------------------------------------------------

export function useCategoryTree() {
  const queryClient = useQueryClient();
  const [loadingParents, setLoadingParents] = useState<Set<string>>(new Set());

  // Fetch rules once (55 rows — small)
  const rulesQuery = useQuery({
    queryKey: ['category-rules-map'],
    queryFn: async () => {
      const res = await catalogApi.categoryRules({ pageNum: 1, pageSize: 200 });
      const map = new Map<string, CategoryRuleRow>();
      for (const item of res.list ?? []) {
        map.set(item.row.categoryName, item.row);
        map.set(item.row.categoryId, item.row);
      }
      return map;
    },
    staleTime: 300_000,
  });

  // Fetch root nodes only (level 1, ~21 rows)
  const rootsQuery = useQuery<CategoryNode[]>({
    queryKey: ['category-tree-roots'],
    queryFn: async () => {
      const rulesMap = rulesQuery.data ?? new Map<string, CategoryRuleRow>();

      const treeRes = await catalogApi.categoryTree({
        pageNum: 1,
        pageSize: 200,
        filters: { level: 1 },
      });

      const roots = (treeRes.list ?? [])
        .map((item) => toNode(item.row, rulesMap))
        .sort((a, b) => a.displayOrder - b.displayOrder);

      return roots;
    },
    enabled: rulesQuery.isSuccess,
    staleTime: 300_000,
  });

  // Load children for a given parent ID
  const loadChildren = useCallback(
    async (parentId: string) => {
      setLoadingParents((prev) => new Set(prev).add(parentId));
      try {
        const rulesMap = rulesQuery.data ?? new Map<string, CategoryRuleRow>();

        const childRes = await catalogApi.categoryTree({
          pageNum: 1,
          pageSize: 500,
          filters: { parentId },
        });

        const children = (childRes.list ?? [])
          .map((item) => toNode(item.row, rulesMap))
          .sort((a, b) => a.displayOrder - b.displayOrder);

        // Update the tree in cache — find the parent and set its children
        queryClient.setQueryData<CategoryNode[]>(['category-tree-roots'], (old) => {
          if (!old) return old;
          return updateNodeChildren(old, parentId, children);
        });
      } finally {
        setLoadingParents((prev) => {
          const next = new Set(prev);
          next.delete(parentId);
          return next;
        });
      }
    },
    [rulesQuery.data, queryClient],
  );

  return {
    data: rootsQuery.data,
    isLoading: rulesQuery.isLoading || rootsQuery.isLoading,
    isError: rulesQuery.isError || rootsQuery.isError,
    refetch: rootsQuery.refetch,
    loadChildren,
    loadingParents,
  };
}

/** Recursively find a node by ID and replace its children */
function updateNodeChildren(
  nodes: CategoryNode[],
  parentId: string,
  children: CategoryNode[],
): CategoryNode[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children,
        childrenLoaded: true,
        hasChildren: children.length > 0,
      };
    }
    if (node.children.length > 0) {
      return {
        ...node,
        children: updateNodeChildren(node.children, parentId, children),
      };
    }
    return node;
  });
}

// ----------------------------------------------------------------
// Category Stats
// ----------------------------------------------------------------

export function useCategoryStats() {
  return useQuery<CategoryStats>({
    queryKey: ['category-stats'],
    queryFn: async () => {
      const res = await catalogApi.categorySummary();
      const row = res.list?.[0]?.row;
      const total = row?.totalCategories ?? 0;
      const active = row?.activeCategories ?? 0;
      return {
        totalCategories: total,
        rootCount: row?.rootCount ?? 0,
        subCount: row?.subCount ?? 0,
        leafCount: row?.leafCount ?? 0,
        activeCategories: active,
        activePercent: total > 0 ? Math.round((active / total) * 100) : 0,
        inactiveCategories: row?.inactiveCategories ?? 0,
      };
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Category Rules (for rules table)
// ----------------------------------------------------------------

function adaptRule(row: CategoryRuleRow): CategoryRule {
  return {
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    commissionRate: row.commissionRate,
    gstRate: row.gstRate,
    hsnCode: row.hsnCode,
    returnDays: row.returnDays,
    returnType: row.returnType,
    maxWeightKg: row.maxWeightKg,
    shippingType: row.shippingType,
    restrictionType: row.restrictionType,
    requiredLicense: row.requiredLicense,
    minImages: row.minImages,
    minDescriptionLength: row.minDescriptionLength,
    eanRequired: row.eanRequired,
  };
}

export function useCategoryRules() {
  return useQuery<CategoryRule[]>({
    queryKey: ['category-rules'],
    queryFn: async () => {
      const res = await catalogApi.categoryRules({ pageNum: 1, pageSize: 200 });
      return (res.list ?? []).map((item) => adaptRule(item.row));
    },
    staleTime: 300_000,
  });
}

// ----------------------------------------------------------------
// Category Attributes (grouped by categoryId for rules table)
// ----------------------------------------------------------------

function adaptAttribute(row: CategoryAttributeRow): CategoryAttribute {
  return {
    id: row.id,
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    attributeName: row.attributeName,
    attributeType: row.attributeType,
    isRequired: row.isRequired,
    allowedValues: row.allowedValues,
    sortOrder: row.sortOrder,
  };
}

export function useCategoryAttributes() {
  return useQuery<Map<string, CategoryAttribute[]>>({
    queryKey: ['category-attributes-all'],
    queryFn: async () => {
      const res = await catalogApi.categoryAttributes({
        pageNum: 1,
        pageSize: 500,
      });
      const map = new Map<string, CategoryAttribute[]>();
      for (const item of res.list ?? []) {
        const attr = adaptAttribute(item.row);
        const list = map.get(attr.categoryId) ?? [];
        list.push(attr);
        map.set(attr.categoryId, list);
      }
      return map;
    },
    staleTime: 300_000,
  });
}

// ----------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => catalogApi.createCategory(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-tree-roots'] });
      queryClient.invalidateQueries({ queryKey: ['category-stats'] });
      queryClient.invalidateQueries({ queryKey: ['category-rules-map'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => catalogApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-tree-roots'] });
      queryClient.invalidateQueries({ queryKey: ['category-stats'] });
    },
  });
}

export function useExportCategories() {
  return useMutation({
    mutationFn: (format: 'csv' | 'xlsx') => catalogApi.exportCategories(format),
  });
}
