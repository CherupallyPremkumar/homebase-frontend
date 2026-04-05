/**
 * Mock data for the Audit Log page.
 *
 * Each export matches the shape returned by the real API contract.
 * When backend endpoints are ready, swap the mock imports in
 * queries.ts for real fetch calls -- no component changes needed.
 */

import type {
  AuditLogEntry,
  AuditStats,
  AuditListResponse,
} from '../types';

export type { AuditAction, EntityType, AuditLogEntry, AuditStats, AuditListResponse } from '../types';

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockAuditStats: AuditStats = {
  totalActionsToday: 89,
  adminUsersActive: 3,
  criticalActions: 5,
};

export const mockAuditEntries: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: '28 Mar 2026, 11:45 AM',
    admin: { name: 'Super Admin', initials: 'SA', avatarGradient: 'from-green-500 to-green-700' },
    action: 'Suspended',
    entityType: 'User',
    entityId: 'USR-4521',
    details: 'Suspended user account - Fraud detected',
    ipAddress: '192.168.1.42',
    isCritical: true,
    expandedData: {
      before: { Status: 'Active', 'Account Type': 'Customer' },
      after: { Status: 'Suspended', Reason: 'Multiple fraudulent payment attempts' },
    },
  },
  {
    id: 'audit-002',
    timestamp: '28 Mar 2026, 11:30 AM',
    admin: { name: 'Ravi Krishnan', initials: 'RK', avatarGradient: 'from-blue-500 to-blue-700' },
    action: 'Approved',
    entityType: 'Seller',
    entityId: 'SLR-0189',
    details: 'Approved seller onboarding - TechZone India',
    ipAddress: '192.168.1.55',
    isCritical: false,
    expandedData: {
      before: { Status: 'Pending Review' },
      after: { Status: 'Active', 'Commission Rate': '5%' },
    },
  },
  {
    id: 'audit-003',
    timestamp: '28 Mar 2026, 10:50 AM',
    admin: { name: 'Deepa Menon', initials: 'DM', avatarGradient: 'from-purple-500 to-purple-700' },
    action: 'Flagged',
    entityType: 'Product',
    entityId: 'PRD-8834',
    details: 'Flagged product - Premium LED Panel (misleading images)',
    ipAddress: '192.168.1.87',
    isCritical: false,
    expandedData: {
      before: { Status: 'Published' },
      after: { Status: 'Flagged for Review', Reason: 'Product images do not match description' },
    },
  },
  {
    id: 'audit-004',
    timestamp: '28 Mar 2026, 10:15 AM',
    admin: { name: 'Super Admin', initials: 'SA', avatarGradient: 'from-green-500 to-green-700' },
    action: 'Updated',
    entityType: 'Settings',
    entityId: 'CFG-COMM',
    details: 'Updated commission rate for Electronics category',
    ipAddress: '192.168.1.42',
    isCritical: true,
    expandedData: {
      before: { 'Commission Rate': '5.0%', Category: 'Electronics' },
      after: { 'Commission Rate': '6.5%', 'Effective From': '1 Apr 2026' },
    },
  },
  {
    id: 'audit-005',
    timestamp: '28 Mar 2026, 9:30 AM',
    admin: { name: 'Ravi Krishnan', initials: 'RK', avatarGradient: 'from-blue-500 to-blue-700' },
    action: 'Processed',
    entityType: 'Order',
    entityId: 'BTH-0045',
    details: 'Processed settlement batch - 18 sellers, \u20B922.3L',
    ipAddress: '192.168.1.55',
    isCritical: false,
    expandedData: {
      before: { 'Batch Status': 'Pending', Sellers: '18' },
      after: { 'Batch Status': 'Processing', Total: '\u20B922,30,000' },
    },
  },
  {
    id: 'audit-006',
    timestamp: '28 Mar 2026, 9:10 AM',
    admin: { name: 'Super Admin', initials: 'SA', avatarGradient: 'from-green-500 to-green-700' },
    action: 'Override',
    entityType: 'Order',
    entityId: '#HB-78102',
    details: 'Overrode order status - Customer escalation',
    ipAddress: '192.168.1.42',
    isCritical: false,
    expandedData: {
      before: { Status: 'Delivered' },
      after: { Status: 'Return Initiated', 'Override Reason': 'Customer claims non-delivery despite tracking' },
    },
  },
  {
    id: 'audit-007',
    timestamp: '28 Mar 2026, 8:45 AM',
    admin: { name: 'Super Admin', initials: 'SA', avatarGradient: 'from-green-500 to-green-700' },
    action: 'Suspended',
    entityType: 'Seller',
    entityId: 'SLR-0134',
    details: 'Suspended seller account - QuickMart (fake products)',
    ipAddress: '192.168.1.42',
    isCritical: true,
    expandedData: {
      before: { Status: 'Active', Products: '47 listed' },
      after: { Status: 'Suspended', Products: 'All delisted', Reason: 'Multiple counterfeit product complaints' },
    },
  },
  {
    id: 'audit-008',
    timestamp: '28 Mar 2026, 8:20 AM',
    admin: { name: 'Deepa Menon', initials: 'DM', avatarGradient: 'from-purple-500 to-purple-700' },
    action: 'Modified',
    entityType: 'Settings',
    entityId: 'TAX-GST-05',
    details: 'Modified tax rule - Updated HSN code mapping',
    ipAddress: '192.168.1.87',
    isCritical: false,
    expandedData: {
      before: { HSN: '8541', Rate: '18%' },
      after: { HSN: '8541', Rate: '12%', Effective: '1 Apr 2026' },
    },
  },
  {
    id: 'audit-009',
    timestamp: '27 Mar 2026, 5:30 PM',
    admin: { name: 'Ravi Krishnan', initials: 'RK', avatarGradient: 'from-blue-500 to-blue-700' },
    action: 'Published',
    entityType: 'Settings',
    entityId: 'CMS-BNR-12',
    details: 'Published CMS banner - Spring Sale 2026',
    ipAddress: '192.168.1.55',
    isCritical: false,
    expandedData: {
      before: { Status: 'Draft' },
      after: { Status: 'Published', Target: 'Homepage Hero Banner' },
    },
  },
  {
    id: 'audit-010',
    timestamp: '27 Mar 2026, 4:15 PM',
    admin: { name: 'Super Admin', initials: 'SA', avatarGradient: 'from-green-500 to-green-700' },
    action: 'Force Refund',
    entityType: 'Order',
    entityId: '#HB-78056',
    details: 'Forced refund of \u20B978,500 - Escalated dispute',
    ipAddress: '192.168.1.42',
    isCritical: true,
    expandedData: {
      before: { Status: 'Dispute - Escalated', Amount: '\u20B978,500' },
      after: { Status: 'Refund Forced', 'Refunded to': 'Customer (Anish Joshi)', 'Deducted from': 'Seller balance (Patel Home Goods)' },
    },
  },
  {
    id: 'audit-011',
    timestamp: '27 Mar 2026, 3:00 PM',
    admin: { name: 'Deepa Menon', initials: 'DM', avatarGradient: 'from-purple-500 to-purple-700' },
    action: 'Approved',
    entityType: 'Product',
    entityId: 'PRD-9102',
    details: 'Approved product listing - Smart WiFi Router Pro',
    ipAddress: '192.168.1.87',
    isCritical: false,
    expandedData: {
      before: { Status: 'Pending Review' },
      after: { Status: 'Published', Category: 'Electronics > Networking' },
    },
  },
  {
    id: 'audit-012',
    timestamp: '27 Mar 2026, 2:00 PM',
    admin: { name: 'Super Admin', initials: 'SA', avatarGradient: 'from-green-500 to-green-700' },
    action: 'Modified',
    entityType: 'Settings',
    entityId: 'CFG-PAY',
    details: 'Modified payment gateway config - Switched backup gateway',
    ipAddress: '192.168.1.42',
    isCritical: true,
    expandedData: {
      before: { 'Backup Gateway': 'PayU', Failover: 'Enabled' },
      after: { 'Backup Gateway': 'Cashfree', Failover: 'Enabled', Reason: 'Lower fees + faster settlements' },
    },
  },
];

export const mockAuditListResponse: AuditListResponse = {
  entries: mockAuditEntries,
  total: 89,
  page: 1,
  pageSize: 12,
  totalPages: 8,
};
