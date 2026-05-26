---
name: resource-scaffold
description: 'Scaffold complete resource (model, service, controller, routes, Redux slice, API service, CRUD page) for Shop-floor Resource Allocation System following all project patterns'
argument-hint: 'resource name and fields'
user-invocable: true
---

# Resource Scaffold Skill

Quickly scaffold a complete resource type for the Shop-floor Resource Allocation System with full-stack implementation in one operation.

## When to Use

- Adding new entity types to the system (e.g., Shift, Department, Equipment)
- Need complete CRUD functionality across backend and frontend
- Want to follow all project patterns consistently
- Rapid prototyping of new features

## What Gets Created

### Backend (4 files)

1. **Model** - `backend/src/models/<Resource>.ts`
   - Sequelize model with TypeScript
   - Field definitions with types
   - Indexes for performance
   - Relationships if specified
   - Virtual fields if needed

2. **Service** - `backend/src/services/<resource>Service.ts`
   - getAll() - List all with ordering
   - getById(id) - Find by ID with NotFoundError
   - create(data) - Create with validation
   - update(id, data) - Update with conflict checking
   - delete(id) - Delete with conflict checking
   - Custom methods (getAvailable, updateStatus, etc.)
   - WebSocket event emissions

3. **Controller** - `backend/src/controllers/<resource>.controller.ts`
   - Request handlers for all service methods
   - Proper HTTP status codes (200, 201, 204, 404, 409)
   - Error handling

4. **Routes** - `backend/src/routes/<resource>.routes.ts`
   - RESTful endpoint definitions
   - Authentication middleware
   - Authorization if needed

### Frontend (3 files)

1. **Redux Slice** - `frontend/src/store/slices/<resource>Slice.ts`
   - TypeScript interface
   - Initial state with loading
   - Actions: set*, add*, update*, remove*, setLoading
   - Export actions and reducer

2. **API Service** - `frontend/src/services/<resource>Service.ts`
   - getAll() - GET /api/<resources>
   - getById(id) - GET /api/<resources>/:id
   - create(data) - POST /api/<resources>
   - update(id, data) - PUT /api/<resources>/:id
   - delete(id) - DELETE /api/<resources>/:id
   - Custom methods matching backend

3. **CRUD Page** - `frontend/src/pages/<resource>/<Resource>Page.tsx`
   - Material-UI table
   - Add/Edit dialog
   - Delete with confirmation
   - Status chips
   - Redux integration
   - Toast notifications

### Updates to Existing Files

- `backend/src/models/index.ts` - Add model associations
- `backend/src/routes/index.ts` - Register routes
- `frontend/src/store/index.ts` - Add slice to store
- `frontend/src/App.tsx` - Add route (if new page)

## Procedure

### 1. Gather Requirements

Ask the user:
- **Resource name** (singular, PascalCase, e.g., "Shift")
- **Fields**: name, type, required?, default?
  - Example: `name: string, required; startTime: Date, required; status: enum`
- **Status field**: Does it have status? Values?
- **Relationships**: Foreign keys to other models?
- **Custom methods**: Any special operations? (e.g., assign, allocate, schedule)

### 2. Generate Backend Files

```typescript
// Example Model
@Table({ tableName: 'shifts' })
export class Shift extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ allowNull: false })
  name!: string;

  @Column({ allowNull: false })
  startTime!: Date;

  @Column({ allowNull: false })
  endTime!: Date;

  @Column({
    type: DataType.ENUM('scheduled', 'active', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  })
  status!: string;

  @ForeignKey(() => Operator)
  @Column
  operatorId!: number;

  @BelongsTo(() => Operator)
  operator!: Operator;
}
```

### 3. Generate Service with Patterns

Follow [service template](./templates/service.template.ts):
- Error handling with custom errors
- Conflict detection
- WebSocket events
- Business logic validation

### 4. Generate Controller

Follow [controller template](./templates/controller.template.ts):
- Async request handlers
- Call service methods
- Return proper status codes

### 5. Generate Routes

Follow [routes template](./templates/routes.template.ts):
- RESTful endpoints
- Authentication middleware
- Method + path combinations

### 6. Generate Frontend Files

Follow [frontend templates](./templates/):
- Redux slice with TypeScript
- API service with Axios
- CRUD page with Material-UI

### 7. Update Index Files

Add imports and registrations to:
- Model associations
- Route registration
- Redux store
- App router

### 8. Verify

- Run `get_errors` to check for TypeScript errors
- Verify imports are correct
- Check that all patterns are followed

## Templates

Reference templates in `./templates/`:
- [model.template.ts](./templates/model.template.ts)
- [service.template.ts](./templates/service.template.ts)
- [controller.template.ts](./templates/controller.template.ts)
- [routes.template.ts](./templates/routes.template.ts)
- [slice.template.ts](./templates/slice.template.ts)
- [api-service.template.ts](./templates/api-service.template.ts)
- [page.template.tsx](./templates/page.template.tsx)

## Example Usage

**User Request**: "Add a Shift resource to track operator work schedules"

**Agent Response**:
1. Asks for fields: name, startTime, endTime, operatorId (FK), status
2. Generates all 7 files following templates
3. Updates 4 index files
4. Verifies with get_errors
5. Returns summary of created files

**Result**: Complete CRUD functionality for Shifts in ~2 minutes

## Output

After scaffolding:
- List of created files with paths
- List of updated files
- Next steps (e.g., "Add navigation link to Shifts page")
- API endpoints available
- Example requests to test
