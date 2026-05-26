# Refactoring Patterns

Common refactoring patterns for the Shop-floor Resource Allocation System.

## Backend Patterns

### 1. Extract Base Service

**Before** (repeated in operatorService, machineService):
```typescript
export const getAll = async (): Promise<Operator[]> => {
  return await Operator.findAll({ order: [['name', 'ASC']] });
};

export const getById = async (id: number): Promise<Operator> => {
  const operator = await Operator.findByPk(id);
  if (!operator) throw new NotFoundError('Operator not found');
  return operator;
};
```

**After** (shared base):
```typescript
// services/base/ResourceService.ts
export class ResourceService<T extends Model> {
  constructor(private model: ModelStatic<T>, private resourceName: string) {}
  
  async getAll(): Promise<T[]> {
    return await this.model.findAll({ order: [['name', 'ASC']] });
  }
  
  async getById(id: number): Promise<T> {
    const resource = await this.model.findByPk(id);
    if (!resource) throw new NotFoundError(`${this.resourceName} not found`);
    return resource;
  }
}

// operatorService.ts
class OperatorService extends ResourceService<Operator> {
  constructor() {
    super(Operator, 'Operator');
  }
  
  // Add operator-specific methods
}
```

### 2. Consolidate Status Color Mapping

**Before** (duplicated across pages):
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'available': return 'success';
    // ... repeated logic
  }
};
```

**After** (shared utility):
```typescript
// frontend/src/utils/statusColors.ts
export const STATUS_COLORS = {
  available: 'success',
  idle: 'success',
  assigned: 'info',
  busy: 'info',
  // ...
} as const;

export const getStatusColor = (status: string) => 
  STATUS_COLORS[status] || 'default';
```

### 3. Shared Table Component

**Before** (table code repeated in every page):
```typescript
<TableContainer component={Paper}>
  <Table>
    <TableHead>...</TableHead>
    <TableBody>...</TableBody>
  </Table>
</TableContainer>
```

**After** (reusable component):
```typescript
// components/common/DataTable.tsx
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export const DataTable = <T extends { id: number }>({
  data, columns, onEdit, onDelete
}: DataTableProps<T>) => {
  // Render table with actions
};
```

### 4. API Error Handler

**Before** (repeated in every service):
```typescript
try {
  const response = await api.get('/operators');
  return response.data;
} catch (error) {
  toast.error('Failed to load');
  throw error;
}
```

**After** (interceptor):
```typescript
// services/api.ts
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'Request failed';
    toast.error(message);
    return Promise.reject(error);
  }
);
```

## Performance Patterns

### 1. Add Database Indexes

```typescript
// Before
@Table({ tableName: 'operators' })
export class Operator extends Model {
  // No indexes on frequently queried fields
}

// After
@Table({
  tableName: 'operators',
  indexes: [
    { fields: ['status'] },
    { fields: ['currentAssignment'] },
    { fields: ['status', 'currentAssignment'] }, // Composite
  ]
})
export class Operator extends Model {}
```

### 2. Eager Loading

```typescript
// Before (N+1 problem)
const workOrders = await WorkOrder.findAll();
for (const wo of workOrders) {
  const allocations = await ResourceAllocation.findAll({
    where: { workOrderId: wo.id }
  });
}

// After (single query)
const workOrders = await WorkOrder.findAll({
  include: [{ model: ResourceAllocation }]
});
```

### 3. React Memoization

```typescript
// Before
const filteredOperators = operators.filter(op => op.status === filter);

// After
const filteredOperators = useMemo(
  () => operators.filter(op => op.status === filter),
  [operators, filter]
);
```

## Type Safety Patterns

### 1. Discriminated Unions

```typescript
// Before
type Status = string;

// After
type OperatorStatus = 'available' | 'assigned' | 'on-break' | 'absent';
type MachineStatus = 'idle' | 'busy' | 'maintenance' | 'breakdown';
```

### 2. Type Guards

```typescript
export function isOperatorStatus(status: string): status is OperatorStatus {
  return ['available', 'assigned', 'on-break', 'absent'].includes(status);
}
```

### 3. DTOs

```typescript
// Separate API types from models
export interface CreateOperatorDTO {
  name: string;
  skills: string[];
  certifications: string[];
}

export interface OperatorResponseDTO extends CreateOperatorDTO {
  id: number;
  status: OperatorStatus;
  createdAt: Date;
}
```
