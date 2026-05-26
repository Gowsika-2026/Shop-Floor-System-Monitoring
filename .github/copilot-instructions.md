# Shop-floor Resource Allocation System

Manufacturing resource allocation system enabling supervisors to assign operators, machines, and materials to work orders with real-time updates to minimize idle time.

## Tech Stack

**Backend**: Node.js 18+ with Express.js, TypeScript 5.3.3, PostgreSQL 14+ with Sequelize ORM 6.35.0  
**Frontend**: React 18.2.0 with TypeScript, Vite 5.0.8, Redux Toolkit 2.0.1, Material-UI 5.15.0  
**Real-time**: Socket.io 4.6.1 for WebSocket communication  
**Authentication**: JWT with bcrypt, role-based access (admin, supervisor, operator)

## Architecture

### Backend Pattern: Controller → Service → Model
- **Controllers** (`src/controllers/`): Handle HTTP requests/responses, call services, send WebSocket events
- **Services** (`src/services/`): Business logic, validation, conflict detection, database operations
- **Models** (`src/models/`): Sequelize models with relationships, indexes, and virtual fields

### Frontend Pattern: Component → Service → Redux
- **Pages** (`src/pages/`): Material-UI components with tables, dialogs, forms
- **Services** (`src/services/`): Axios API calls, type-safe responses
- **Store** (`src/store/slices/`): Redux Toolkit slices with actions and selectors

### Real-time Updates
All resource mutations emit WebSocket events:
```typescript
emitResourceUpdate(resourceType, resourceId, data);
emitAllocationUpdate(allocationId, data);
emitWorkOrderUpdate(workOrderId, data);
emitStatusChange(entityType, entityId, oldStatus, newStatus);
```

## Code Style

### Backend
- **Services**: Always return data or throw errors (never null)
- **Validation**: Check conflicts BEFORE database operations
- **Error handling**: Use custom error classes (ConflictError, NotFoundError, ValidationError)
- **Transactions**: Use Sequelize transactions for multi-step operations
- **Status updates**: Automatically set timestamps (startTime, endTime) on work order status changes

**Example Service Pattern**:
```typescript
export const updateStatus = async (id: number, status: string): Promise<Resource> => {
  const resource = await Resource.findByPk(id);
  if (!resource) throw new NotFoundError('Resource not found');
  
  // Validation logic
  if (status === 'available' && resource.currentAssignment) {
    throw new ConflictError('Cannot set to available while assigned');
  }
  
  resource.status = status;
  await resource.save();
  
  emitStatusChange('resource', id, oldStatus, status);
  return resource;
};
```

### Frontend
- **Pages**: Use Material-UI `Container`, `Table`, `Dialog` components
- **Forms**: Track editing state separately, use dialog for create/edit
- **Redux**: Dispatch actions immediately, handle errors with toast notifications
- **Status display**: Use `Chip` components with color coding (success, info, warning, error)
- **Loading states**: Show loading from Redux slice during fetch operations

**Example Page Pattern**:
```typescript
const [open, setOpen] = useState(false);
const [editingItem, setEditingItem] = useState<Item | null>(null);

const handleSubmit = async () => {
  try {
    if (editingItem) {
      const updated = await service.update(editingItem.id, data);
      dispatch(updateItem(updated));
      toast.success('Updated successfully');
    } else {
      const created = await service.create(data);
      dispatch(addItem(created));
      toast.success('Created successfully');
    }
    handleClose();
  } catch (error) {
    toast.error('Failed to save');
  }
};
```

## Resource Management

### Core Entities
- **Operators**: skills[], certifications[], status (available|assigned|on-break|absent)
- **Machines**: type, capabilities[], status (idle|busy|maintenance|breakdown)
- **Materials**: quantity, unit, location, allocatedQuantity, virtual availableQuantity
- **WorkOrders**: priority (urgent|high|normal|low), status (pending|in-progress|completed|on-hold)
- **ResourceAllocations**: Junction table linking resources to work orders

### Allocation Rules
1. Check resource availability BEFORE allocation
2. Validate material quantities (available ≥ requested)
3. Prevent concurrent assignments (operators/machines to multiple work orders)
4. Update resource status when allocated/deallocated
5. Track allocatedBy (user who made the allocation)
6. Support bulk allocation for efficiency

### Conflict Detection
- Cannot delete resources with active allocations
- Cannot change operator/machine status to 'available' if currently assigned
- Cannot allocate more materials than available quantity
- Cannot assign operator/machine already assigned to another active work order

## Build and Test

**Backend**:
```bash
cd backend
npm install
npm run dev          # Start development server
npm run build        # Compile TypeScript
npm test            # Run Jest tests
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev         # Start Vite dev server (port 5173)
npm run build       # Production build
npm run preview     # Preview production build
```

**Database**:
- PostgreSQL 14+ required
- Configure `.env` in backend directory with DATABASE_URL
- Sequelize auto-creates tables on startup (sync in dev)

## Conventions

### File Organization
- Backend routes: `src/routes/<resource>.routes.ts` (e.g., operator.routes.ts)
- Frontend pages: `src/pages/<resource>/<ResourcePage>.tsx` (e.g., operators/OperatorsPage.tsx)
- Redux slices: `src/store/slices/<resource>Slice.ts` with consistent action names (set*, add*, update*, remove*, setLoading)

### Naming
- Models: Singular PascalCase (Operator, Machine, WorkOrder)
- Services: Singular camelCase (operatorService, machineService)
- Redux slices: Plural camelCase state name (operators, machines, workOrders)
- API endpoints: Plural kebab-case (/api/operators, /api/work-orders)

### TypeScript
- Define interfaces in slice files for frontend types
- Use Sequelize model types directly in backend
- Enable strict mode, no implicit any
- Use type guards for status checks

### Error Handling
- Backend: Global error handler middleware catches all errors
- Frontend: Axios interceptors handle 401/403/500, show toast notifications
- Always provide user-friendly error messages

### Real-time Events
Emit events AFTER successful database operations:
```typescript
await resource.save();
emitResourceUpdate('operator', resource.id, resource.toJSON());
```

Listen in frontend via Socket.io client:
```typescript
socket.on('resource:update', (data) => {
  dispatch(updateResource(data));
});
```

## Project Structure

```
backend/
  src/
    models/         # Sequelize models
    services/       # Business logic
    controllers/    # Request handlers
    routes/         # Express routes
    middleware/     # Auth, error handling
    socket/         # WebSocket events
    types/          # TypeScript types
    
frontend/
  src/
    pages/          # React page components
    components/     # Reusable components
    services/       # API service layer
    store/          # Redux configuration
      slices/       # Redux Toolkit slices
    hooks/          # Custom React hooks
    types/          # TypeScript types
```

## Testing Strategy

### Backend Tests
- Unit tests for services (business logic)
- Integration tests for controllers (API endpoints)
- Mock database operations with Sequelize mocks
- Test conflict detection and validation logic

### Frontend Tests
- Component tests for pages (user interactions)
- Service tests (API calls)
- Redux slice tests (state mutations)
- E2E tests for critical flows (allocation workflow)

## Domain-Specific Patterns

### Availability Checking
Always check `currentAssignment` for operators and `currentWorkOrder` for machines:
```typescript
const availableOperators = await Operator.findAll({
  where: { status: 'available', currentAssignment: null }
});
```

### Material Quantity Management
Use virtual field `availableQuantity` in queries, update `allocatedQuantity` on allocation:
```typescript
const available = material.quantity - material.allocatedQuantity;
if (available < requestedQuantity) {
  throw new ConflictError('Insufficient materials');
}
```

### Work Order Status Transitions
Auto-set timestamps:
- `startTime`: When status changes to 'in-progress'
- `endTime`: When status changes to 'completed'

### Dashboard Statistics
Aggregate counts by status using Sequelize group queries for real-time dashboard metrics.

## Documentation

See project documentation:
- `PROMPT.md` - Complete requirements and user stories
- `DEVELOPMENT_PLAN.md` - 7-phase implementation plan with API endpoints
- `IMPLEMENTATION_SUMMARY.md` - Generated code catalog
- `README.md` - Setup and installation guide
