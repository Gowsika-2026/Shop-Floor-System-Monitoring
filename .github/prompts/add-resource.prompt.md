---
description: "Add a new resource type with complete backend (model, service, controller, routes) and frontend (service, slice, page)"
argument-hint: "resource name (e.g., 'Shift', 'Department')"
agent: "agent"
---

# Add Resource Type

Generate a complete resource type for the Shop-floor Resource Allocation System with full backend and frontend implementation.

## What to Generate

### Backend
1. **Model** (`backend/src/models/<Resource>.ts`)
   - Sequelize model with proper fields and types
   - Status enum if applicable
   - Indexes for performance
   - Relationships to other models
   - Virtual fields if needed

2. **Service** (`backend/src/services/<resource>Service.ts`)
   - Full CRUD operations (getAll, getById, create, update, delete)
   - Business logic and validation
   - Conflict detection
   - WebSocket event emissions
   - Custom methods (e.g., updateStatus, getAvailable)

3. **Controller** (`backend/src/controllers/<resource>.controller.ts`)
   - Request handlers calling service methods
   - Proper HTTP status codes
   - Error handling

4. **Routes** (`backend/src/routes/<resource>.routes.ts`)
   - RESTful endpoints
   - Authentication middleware
   - Authorization checks

### Frontend
1. **Redux Slice** (`frontend/src/store/slices/<resource>Slice.ts`)
   - TypeScript interface
   - Initial state with loading flag
   - Actions: set*, add*, update*, remove*, setLoading
   - Selectors if needed

2. **Service** (`frontend/src/services/<resource>Service.ts`)
   - API methods matching backend endpoints
   - Type-safe responses
   - Error handling

3. **Page** (`frontend/src/pages/<resource>/<Resource>Page.tsx`)
   - Material-UI Table displaying items
   - Add/Edit/Delete functionality
   - Dialog form for create/edit
   - Status chips with color coding
   - Redux integration
   - Toast notifications
   - Loading states

## Pattern to Follow

Reference existing resources:
- **Operator**: Skills, certifications, status management
- **Machine**: Type, capabilities, status tracking
- **Material**: Quantity tracking, allocation logic
- **WorkOrder**: Priority, status, requirements

## Instructions

1. Ask for the resource name (singular, PascalCase)
2. Ask for key fields and their types
3. Confirm if it needs status management
4. Confirm if it needs relationship to other resources
5. Generate all files following the project patterns
6. Update routes index and model associations
7. Verify with get_errors tool

## Example

**Input**: "Add a Shift resource to track operator schedules"

**Fields**:
- name: string
- startTime: Date
- endTime: Date
- operatorId: number (FK to Operator)
- status: 'scheduled' | 'active' | 'completed' | 'cancelled'

**Output**: Complete backend + frontend implementation following project conventions
