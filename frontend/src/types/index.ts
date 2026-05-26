/**
 * Shared type definitions for the frontend
 */

// Resource update WebSocket event
export interface ResourceUpdateEvent {
  type: 'operator' | 'machine' | 'material';
  data: Record<string, unknown>;
}

// Allocation update WebSocket event
export interface AllocationUpdateEvent {
  id: number;
  workOrderId: number;
  resourceType: string;
  resourceId: number;
  status: string;
}

// Work order update WebSocket event
export interface WorkOrderUpdateEvent {
  id: number;
  description: string;
  status: string;
  priority: string;
}

// Bulk allocation item
export interface BulkAllocationItem {
  resourceType: 'operator' | 'machine' | 'material';
  resourceId: number;
  quantity?: number;
}

// Bulk allocation response
export interface BulkAllocationResponse {
  success: boolean;
  allocation?: unknown;
  error?: string;
}

// Dashboard stats query params
export interface DashboardStatsParams {
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
}

// Error response type
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
