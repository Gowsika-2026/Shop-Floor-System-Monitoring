---
description: "Add a new API endpoint to an existing resource with proper validation, service logic, and real-time events"
argument-hint: "endpoint details (e.g., 'POST /api/operators/:id/assign')"
agent: "agent"
---

# Add API Endpoint

Add a new endpoint to an existing resource in the Shop-floor Resource Allocation System following the Controller → Service → Model pattern.

## What to Add

1. **Service Method** (`backend/src/services/<resource>Service.ts`)
   - Business logic implementation
   - Validation and conflict detection
   - Database operations with transactions if needed
   - WebSocket event emission
   - Return data or throw custom errors

2. **Controller Method** (`backend/src/controllers/<resource>.controller.ts`)
   - Call service method
   - Handle request/response
   - Proper HTTP status codes
   - Error handling

3. **Route** (`backend/src/routes/<resource>.routes.ts`)
   - Define endpoint with method and path
   - Add authentication middleware
   - Add authorization if needed

4. **Frontend Service Method** (if applicable)
   - Add to `frontend/src/services/<resource>Service.ts`
   - Type-safe request/response
   - Error handling

## Pattern to Follow

**Example Service Method**:
```typescript
export const assignToWorkOrder = async (
  operatorId: number,
  workOrderId: number
): Promise<Operator> => {
  const operator = await Operator.findByPk(operatorId);
  if (!operator) throw new NotFoundError('Operator not found');
  
  if (operator.currentAssignment) {
    throw new ConflictError('Operator already assigned');
  }
  
  const workOrder = await WorkOrder.findByPk(workOrderId);
  if (!workOrder) throw new NotFoundError('Work order not found');
  
  operator.currentAssignment = workOrderId;
  operator.status = 'assigned';
  await operator.save();
  
  emitStatusChange('operator', operatorId, 'available', 'assigned');
  return operator;
};
```

**Example Controller**:
```typescript
export const assignToWorkOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { workOrderId } = req.body;
  const operator = await operatorService.assignToWorkOrder(
    parseInt(id),
    workOrderId
  );
  res.json(operator);
};
```

**Example Route**:
```typescript
router.patch('/:id/assign', authenticate, assignToWorkOrder);
```

## Instructions

1. Ask for the endpoint details (method, path, purpose)
2. Ask for request parameters and body schema
3. Ask for expected response format
4. Identify validation rules and conflict checks
5. Generate service method with error handling
6. Generate controller method
7. Add route with proper middleware
8. Add frontend service method if needed
9. Verify with get_errors tool

## Example

**Input**: "Add endpoint to bulk assign operators to a work order"

**Details**:
- Method: POST
- Path: /api/operators/bulk-assign
- Body: { operatorIds: number[], workOrderId: number }
- Response: { assigned: Operator[], failed: { id: number, reason: string }[] }

**Output**: Service method with transaction, controller, route, and frontend service method
