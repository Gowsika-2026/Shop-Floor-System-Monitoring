/**
 * Status color mapping utility for Material-UI Chip components
 * Maps resource status values to Material-UI color props
 */

export const STATUS_COLORS = {
  // Operator statuses
  available: 'success',
  assigned: 'info',
  'on-break': 'warning',
  absent: 'error',
  
  // Machine statuses
  idle: 'success',
  busy: 'info',
  maintenance: 'warning',
  breakdown: 'error',
  
  // Work order statuses
  pending: 'default',
  'in-progress': 'info',
  completed: 'success',
  'on-hold': 'warning',
  
  // Work order priorities
  urgent: 'error',
  high: 'warning',
  normal: 'info',
  low: 'default',
  
  // Allocation statuses
  active: 'info',
  cancelled: 'error',
} as const;

export type StatusColorType = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

/**
 * Get the Material-UI color for a given status
 * @param status - The status value
 * @returns Material-UI color prop value
 */
export const getStatusColor = (status: string): StatusColorType => {
  return (STATUS_COLORS as Record<string, StatusColorType>)[status] || 'default';
};

/**
 * Format status text for display (convert kebab-case to Title Case)
 * @param status - The status value
 * @returns Formatted status text
 */
export const formatStatus = (status: string): string => {
  return status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
