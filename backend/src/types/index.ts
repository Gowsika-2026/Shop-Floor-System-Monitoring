/**
 * Shared type definitions for the Shop-floor Resource Allocation System
 */

// Status type definitions
export type OperatorStatus = 'available' | 'assigned' | 'on-break' | 'absent';
export type MachineStatus = 'idle' | 'busy' | 'maintenance' | 'breakdown';
export type MaterialStatus = 'in-stock' | 'low-stock' | 'out-of-stock';
export type WorkOrderStatus = 'pending' | 'in-progress' | 'completed' | 'on-hold';
export type WorkOrderPriority = 'urgent' | 'high' | 'normal' | 'low';
export type ResourceType = 'operator' | 'machine' | 'material';
export type AllocationStatus = 'active' | 'completed' | 'cancelled';

// User and authentication types
export interface UserData {
  username: string;
  password: string;
  role: 'admin' | 'supervisor' | 'operator';
  name: string;
  email: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
    name: string;
    email: string;
  };
}

// Resource DTOs
export interface CreateOperatorDTO {
  name: string;
  skills: string[];
  certifications: string[];
  status?: OperatorStatus;
}

export interface UpdateOperatorDTO extends Partial<CreateOperatorDTO> {}

export interface CreateMachineDTO {
  name: string;
  type: string;
  capabilities: string[];
  status?: MachineStatus;
  lastMaintenanceDate?: Date;
}

export interface UpdateMachineDTO extends Partial<CreateMachineDTO> {}

export interface CreateMaterialDTO {
  name: string;
  quantity: number;
  unit: string;
  location: string;
}

export interface UpdateMaterialDTO extends Partial<CreateMaterialDTO> {}

export interface MaterialQuantityDTO {
  quantity: number;
}

export interface CreateWorkOrderDTO {
  description: string;
  priority: WorkOrderPriority;
  requiredOperators: number;
  requiredMachines: string[];
  requiredMaterials: Array<{
    materialId: number;
    quantity: number;
  }>;
  estimatedDuration?: number;
}

export interface UpdateWorkOrderDTO extends Partial<CreateWorkOrderDTO> {}

export interface WorkOrderStatusDTO {
  status: WorkOrderStatus;
}

export interface WorkOrderPriorityDTO {
  priority: WorkOrderPriority;
}

// Allocation DTOs
export interface CreateAllocationDTO {
  workOrderId: number;
  resourceType: ResourceType;
  resourceId: number;
  quantity?: number;
  allocatedBy: number;
}

export interface BulkAllocationDTO {
  workOrderId: number;
  allocations: Array<{
    resourceType: ResourceType;
    resourceId: number;
    quantity?: number;
  }>;
  allocatedBy: number;
}

export interface ReallocateDTO {
  allocationId: number;
  newWorkOrderId: number;
  reallocatedBy: number;
}

export interface UpdateAllocationDTO {
  status?: AllocationStatus;
  quantity?: number;
}

// Dashboard and Analytics types
export interface DashboardOverview {
  operators: {
    total: number;
    available: number;
    assigned: number;
    onBreak: number;
    absent: number;
  };
  machines: {
    total: number;
    idle: number;
    busy: number;
    maintenance: number;
    breakdown: number;
  };
  materials: {
    total: number;
    lowStock: number;
  };
  workOrders: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    onHold: number;
  };
}

export interface UtilizationParams {
  resourceType: ResourceType;
  startDate?: string;
  endDate?: string;
}

export interface IdleTimeParams {
  resourceType: ResourceType;
  threshold?: number;
  startDate?: string;
  endDate?: string;
}

export interface WorkOrderStatsParams {
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  startDate?: string;
  endDate?: string;
}

// WebSocket event types
export interface ResourceUpdateEvent {
  type: ResourceType;
  id: number;
  data: Record<string, unknown>; // Specific resource data (operators, machines, materials)
}

export interface AllocationUpdateEvent {
  id: number;
  workOrderId: number;
  resourceType: ResourceType;
  resourceId: number;
  status: AllocationStatus;
}

export interface WorkOrderUpdateEvent {
  id: number;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
}

export interface StatusChangeEvent {
  entityType: string;
  entityId: number;
  oldStatus: string;
  newStatus: string;
}
