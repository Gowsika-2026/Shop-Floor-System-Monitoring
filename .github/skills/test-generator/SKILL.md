---
name: test-generator
description: 'Generate comprehensive tests for Shop-floor Resource Allocation System: unit tests for services, integration tests for controllers, component tests for React pages, E2E tests for critical flows'
argument-hint: 'optional: test type (unit/integration/component/e2e) or file path'
user-invocable: true
---

# Test Generator Skill

Generate comprehensive test coverage for the Shop-floor Resource Allocation System using Jest, Supertest, and React Testing Library.

## When to Use

- Generate tests for services, controllers, and components
- Create test scenarios for critical user flows
- Validate business logic and edge cases
- Ensure code quality before deployment

## Test Types

### 1. Backend Unit Tests (Services)

**Purpose**: Test business logic in isolation  
**Framework**: Jest with mocks  
**Location**: `backend/src/services/__tests__/`

**Pattern**:
```typescript
describe('OperatorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateStatus', () => {
    it('should update operator status to available', async () => {
      // Arrange
      const mockOperator = { 
        id: 1, 
        status: 'on-break',
        currentAssignment: null,
        save: jest.fn()
      };
      Operator.findByPk = jest.fn().mockResolvedValue(mockOperator);

      // Act
      await operatorService.updateStatus(1, 'available');

      // Assert
      expect(mockOperator.status).toBe('available');
      expect(mockOperator.save).toHaveBeenCalled();
    });

    it('should throw ConflictError if operator is assigned', async () => {
      const mockOperator = { 
        id: 1, 
        status: 'assigned',
        currentAssignment: 5
      };
      Operator.findByPk = jest.fn().mockResolvedValue(mockOperator);

      await expect(
        operatorService.updateStatus(1, 'available')
      ).rejects.toThrow(ConflictError);
    });
  });
});
```

**What to Test**:
- Happy path scenarios
- Edge cases (null, empty, invalid input)
- Error conditions (not found, conflicts, validation errors)
- Business rule enforcement

### 2. Backend Integration Tests (Controllers)

**Purpose**: Test API endpoints end-to-end  
**Framework**: Jest + Supertest  
**Location**: `backend/src/controllers/__tests__/`

**Pattern**:
```typescript
describe('Operator Controller', () => {
  let app: Express;
  let token: string;

  beforeAll(async () => {
    app = createTestApp();
    token = await getAuthToken('admin');
  });

  describe('GET /api/operators', () => {
    it('should return all operators', async () => {
      const response = await request(app)
        .get('/api/operators')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/operators')
        .expect(401);
    });
  });

  describe('POST /api/operators', () => {
    it('should create new operator', async () => {
      const operatorData = {
        name: 'John Doe',
        skills: ['welding', 'assembly'],
        certifications: ['ISO-9001']
      };

      const response = await request(app)
        .post('/api/operators')
        .set('Authorization', `Bearer ${token}`)
        .send(operatorData)
        .expect(201);

      expect(response.body).toMatchObject(operatorData);
      expect(response.body.id).toBeDefined();
    });
  });
});
```

**What to Test**:
- All CRUD operations
- Authentication and authorization
- Request validation
- Error responses
- Status codes

### 3. Frontend Component Tests

**Purpose**: Test React components and user interactions  
**Framework**: React Testing Library + Jest  
**Location**: `frontend/src/pages/__tests__/`

**Pattern**:
```typescript
describe('OperatorsPage', () => {
  beforeEach(() => {
    // Mock Redux store
    const mockStore = configureStore({
      reducer: {
        operators: operatorReducer,
        auth: authReducer
      },
      preloadedState: {
        operators: {
          operators: mockOperators,
          loading: false
        }
      }
    });

    render(
      <Provider store={mockStore}>
        <OperatorsPage />
      </Provider>
    );
  });

  it('should display operators in table', () => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('available')).toBeInTheDocument();
  });

  it('should open dialog when Add button clicked', async () => {
    const addButton = screen.getByRole('button', { name: /add operator/i });
    await userEvent.click(addButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('should call API when form submitted', async () => {
    const createSpy = jest.spyOn(operatorService, 'create');
    
    await userEvent.click(screen.getByRole('button', { name: /add/i }));
    await userEvent.type(screen.getByLabelText(/name/i), 'New Operator');
    await userEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(createSpy).toHaveBeenCalledWith({
      name: 'New Operator',
      // ...
    });
  });
});
```

**What to Test**:
- Component rendering with data
- User interactions (clicks, form inputs)
- API calls and Redux dispatches
- Loading and error states
- Conditional rendering

### 4. E2E Tests (Critical Flows)

**Purpose**: Test complete user workflows  
**Framework**: Playwright or Cypress  
**Location**: `e2e/`

**Pattern**:
```typescript
test.describe('Resource Allocation Flow', () => {
  test('should allocate operator to work order', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="username"]', 'supervisor');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Navigate to allocation page
    await page.click('text=Allocations');
    await expect(page).toHaveURL('/allocation');

    // Select work order
    await page.click('text=WO-001');

    // Drag operator to work order
    await page.dragAndDrop(
      '[data-operator-id="1"]',
      '[data-workorder-id="1"]'
    );

    // Verify allocation
    await expect(page.locator('text=Operator assigned')).toBeVisible();
  });
});
```

**What to Test**:
- Login and authentication
- Resource allocation workflow
- Work order status updates
- Real-time updates via WebSocket
- Error handling and recovery

## Procedure

1. **Analyze Code to Test**
   - Read the file to understand functionality
   - Identify critical paths and edge cases
   - List dependencies to mock

2. **Generate Test File**
   - Create __tests__ directory if needed
   - Follow naming convention: `<filename>.test.ts`
   - Import necessary testing utilities

3. **Write Test Cases**
   - Use describe/it structure
   - Follow Arrange-Act-Assert pattern
   - Add descriptive test names
   - Mock external dependencies

4. **Run Tests**
   - Execute with Jest/testing framework
   - Verify all tests pass
   - Check coverage report

5. **Review and Refine**
   - Add missing test cases
   - Improve assertions
   - Remove redundant tests

## Test Coverage Goals

- **Services**: 80%+ coverage, all business logic paths
- **Controllers**: All endpoints, success and error cases
- **Components**: All user interactions, conditional renders
- **E2E**: Critical user journeys (login, allocation, dashboard)

## Reference Files

See [test templates](./templates/) for common test patterns.

## Output

After test generation:
- Test files created for specified components
- Coverage report summary
- List of untested edge cases
- Recommendations for additional tests
