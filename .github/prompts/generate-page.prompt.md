---
description: "Generate a CRUD page with Material-UI table, dialogs, and Redux integration following project patterns"
argument-hint: "page name (e.g., 'Machines', 'Materials')"
agent: "agent"
---

# Generate CRUD Page

Generate a complete frontend CRUD page for the Shop-floor Resource Allocation System following the established patterns.

## What to Generate

A React page component with:
- Material-UI Table displaying all items
- Add button to create new items
- Edit/Delete actions for each row
- Dialog form for create/edit operations
- Status chips with color coding
- Redux integration for state management
- Toast notifications for success/error
- Loading states from Redux

## Pattern to Follow

Reference [OperatorsPage.tsx](../../frontend/src/pages/operators/OperatorsPage.tsx) as the canonical example.

### Required Features

1. **State Management**
   ```typescript
   const [open, setOpen] = useState(false);
   const [editingItem, setEditingItem] = useState<Item | null>(null);
   const [formData, setFormData] = useState({...});
   ```

2. **Data Fetching**
   ```typescript
   useEffect(() => {
     fetchItems();
   }, []);
   
   const fetchItems = async () => {
     dispatch(setLoading(true));
     const data = await service.getAll();
     dispatch(setItems(data));
   };
   ```

3. **CRUD Operations**
   - Create: Call service.create(), dispatch addItem(), show success toast
   - Update: Call service.update(), dispatch updateItem(), show success toast
   - Delete: Confirm with window.confirm(), call service.delete(), dispatch removeItem()

4. **Material-UI Components**
   - Container with maxWidth="xl"
   - Box with flex layout for header (title + add button)
   - TableContainer with Paper
   - Table with TableHead and TableBody
   - Chip for status display with color mapping
   - Dialog with DialogTitle, DialogContent, DialogActions
   - TextField for form inputs
   - IconButton for edit/delete actions

5. **Status Color Mapping**
   ```typescript
   const getStatusColor = (status: string) => {
     switch (status) {
       case 'available': case 'idle': return 'success';
       case 'assigned': case 'busy': return 'info';
       case 'on-break': case 'maintenance': return 'warning';
       case 'absent': case 'breakdown': return 'error';
       default: return 'default';
     }
   };
   ```

## Instructions

1. Ask for the page name and resource type
2. Ask for the fields to display in the table
3. Ask for the form fields and their types (text, select, number, date, etc.)
4. Confirm if there's a status field and its possible values
5. Generate the complete page component
6. Verify imports are using path aliases (@hooks, @store, @services)
7. Check with get_errors tool

## Example

**Input**: "Generate MachinesPage"

**Details**:
- Resource: Machine
- Table columns: Name, Type, Capabilities, Status
- Form fields: name (text), type (text), capabilities (comma-separated), status (select)
- Status values: idle, busy, maintenance, breakdown

**Output**: Complete MachinesPage.tsx following the operators page pattern with proper table, dialog, and Redux integration
