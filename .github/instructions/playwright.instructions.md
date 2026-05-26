---
description: Playwright E2E testing guidelines for Shop-floor Resource Allocation System
applyTo: '**/*.spec.ts,**/e2e/**,**/tests/e2e/**,playwright.config.ts'
---

# Playwright E2E Testing Guidelines

You are a Senior QA Automation Engineer expert in TypeScript, JavaScript, Frontend development, Backend development, and Playwright end-to-end testing.

## Code Style

- Write concise, technical TypeScript and JavaScript code with accurate examples and correct types
- Use descriptive and meaningful test names that clearly describe the expected behavior
- Add JSDoc comments to describe the purpose of helper functions and reusable logic
- Avoid commenting on the resulting code

## Test Structure

### Fixtures and Isolation

- Utilize Playwright fixtures (`test`, `page`, `expect`) to maintain test isolation and consistency
- Use `test.beforeEach` and `test.afterEach` for setup and teardown to ensure a clean state for each test
- Ensure tests run reliably in parallel without shared state conflicts

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/dashboard');
});
```

### DRY Principles

- Keep tests DRY (Don't Repeat Yourself) by extracting reusable logic into helper functions
- Reuse Playwright locators by using variables or constants for commonly used elements

```typescript
/**
 * Navigate to operators page and open create dialog
 */
async function openCreateOperatorDialog(page: Page) {
  await page.goto('/operators');
  await page.getByRole('button', { name: 'Add Operator' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
}
```

## Locator Strategy

**CRITICAL:** Avoid using `page.locator()` - always use recommended built-in and role-based locators

### Priority Order

1. `page.getByRole()` - for interactive elements (button, link, textbox, checkbox, etc.)
2. `page.getByLabel()` - for form fields with associated labels
3. `page.getByPlaceholder()` - for inputs with placeholder text
4. `page.getByText()` - for text content
5. `page.getByTitle()` - for elements with title attributes
6. `page.getByTestId()` - when `data-testid` is defined on elements

```typescript
// ✅ CORRECT
const submitButton = page.getByRole('button', { name: 'Submit' });
const usernameInput = page.getByLabel('Username');
const statusChip = page.getByTestId('status-chip');

// ❌ INCORRECT - DO NOT USE
const submitButton = page.locator('button[type="submit"]');
const usernameInput = page.locator('#username');
const statusChip = page.locator('.status-chip');
```

## Assertions

### Web-First Assertions (Preferred)

Prefer to use web-first assertions whenever possible - they auto-wait for conditions:

- `toBeVisible()` - element is visible
- `toHaveText()` - element has specific text
- `toBeEnabled()` / `toBeDisabled()` - element state
- `toBeChecked()` - checkbox/radio state
- `toHaveValue()` - input value
- `toHaveCount()` - number of matching elements

```typescript
// ✅ CORRECT - Auto-waiting assertions
await expect(page.getByRole('heading')).toBeVisible();
await expect(page.getByText('Success')).toHaveText('Operation successful');
await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();

// ✅ CORRECT - General assertions
expect(users.length).toBeGreaterThan(0);
expect(response.status).toEqual(200);
expect(items).toContain('Operator');

// ❌ INCORRECT - Avoid assert statements
assert(users.length > 0);
```

## Timing and Waiting

### Avoid Hardcoded Timeouts

- **NEVER** use hardcoded timeouts like `page.waitForTimeout(5000)`
- Use `page.waitFor` with specific conditions or events to wait for elements or states
- Rely on auto-waiting built into Playwright actions and assertions

```typescript
// ✅ CORRECT - Wait for specific conditions
await page.waitForURL('/dashboard');
await page.waitForLoadState('networkidle');
await page.waitForLoadState('domcontentloaded');
await expect(page.getByRole('status')).toBeVisible();

// ❌ INCORRECT - Hardcoded timeout
await page.waitForTimeout(3000);
```

## Configuration

### playwright.config.ts

- Use `playwright.config.ts` for global configuration and environment setup
- Implement projects for multiple browsers and devices to ensure cross-browser compatibility
- Use built-in config objects like `devices` whenever possible

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Error Handling

Implement proper error handling and logging in tests to provide clear failure messages:

```typescript
// ✅ CORRECT - Descriptive error messages
await expect(
  page.getByRole('alert'),
  'Error message should be visible after failed login'
).toBeVisible();

// Use try-catch for complex scenarios
try {
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Success')).toBeVisible();
} catch (error) {
  throw new Error(`Form submission failed: ${error.message}`);
}
```

## Shop-floor Resource Allocation Test Patterns

### Test Organization

```
tests/
  e2e/
    auth/
      login.spec.ts
      logout.spec.ts
    operators/
      crud.spec.ts
      status-update.spec.ts
    machines/
      crud.spec.ts
      maintenance.spec.ts
    materials/
      crud.spec.ts
      quantity-management.spec.ts
    workOrders/
      crud.spec.ts
      priority.spec.ts
      status-transitions.spec.ts
    allocations/
      allocate-resources.spec.ts
      bulk-allocation.spec.ts
      conflict-detection.spec.ts
    dashboard/
      overview.spec.ts
      real-time-updates.spec.ts
```

### Common Patterns

#### Authentication Flow
```typescript
test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel('Username').fill('invalid');
    await page.getByLabel('Password').fill('wrong');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page.getByRole('alert')).toHaveText(/Invalid credentials/i);
  });
});
```

#### CRUD Operations
```typescript
test.describe('Operator Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.goto('/operators');
  });

  test('should create new operator', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Operator' }).click();
    
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Skills').fill('Welding, Assembly');
    await page.getByLabel('Certifications').fill('ISO 9001');
    await page.getByRole('button', { name: 'Save' }).click();
    
    await expect(page.getByText('Operator created successfully')).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
  });

  test('should update operator status', async ({ page }) => {
    const operatorRow = page.getByRole('row', { name: /John Doe/i });
    
    await operatorRow.getByRole('button', { name: 'Edit' }).click();
    await page.getByLabel('Status').selectOption('on-break');
    await page.getByRole('button', { name: 'Update' }).click();
    
    await expect(operatorRow.getByTestId('status-chip')).toHaveText('On Break');
  });

  test('should delete operator', async ({ page }) => {
    const operatorRow = page.getByRole('row', { name: /John Doe/i });
    
    await operatorRow.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    
    await expect(page.getByText('Operator deleted successfully')).toBeVisible();
    await expect(page.getByText('John Doe')).not.toBeVisible();
  });
});
```

#### Resource Allocation
```typescript
test.describe('Resource Allocation', () => {
  test('should allocate operator to work order', async ({ page }) => {
    await page.goto('/allocations');
    
    await page.getByRole('button', { name: 'Allocate Resources' }).click();
    await page.getByLabel('Work Order').selectOption('WO-001');
    await page.getByLabel('Resource Type').selectOption('operator');
    await page.getByLabel('Operator').selectOption('John Doe');
    await page.getByRole('button', { name: 'Allocate' }).click();
    
    await expect(page.getByText('Resource allocated successfully')).toBeVisible();
  });

  test('should detect allocation conflict', async ({ page }) => {
    await page.goto('/allocations');
    
    await page.getByRole('button', { name: 'Allocate Resources' }).click();
    await page.getByLabel('Work Order').selectOption('WO-002');
    await page.getByLabel('Resource Type').selectOption('operator');
    await page.getByLabel('Operator').selectOption('John Doe'); // Already allocated
    await page.getByRole('button', { name: 'Allocate' }).click();
    
    await expect(page.getByRole('alert')).toHaveText(/already assigned/i);
  });
});
```

#### Real-Time Updates (WebSocket)
```typescript
test.describe('Real-Time Updates', () => {
  test('should reflect updates across sessions', async ({ page, context }) => {
    // User 1 session
    const page1 = page;
    await page1.goto('/login');
    await page1.getByLabel('Username').fill('user1');
    await page1.getByLabel('Password').fill('password123');
    await page1.getByRole('button', { name: 'Login' }).click();
    await page1.goto('/operators');
    
    // User 2 session
    const page2 = await context.newPage();
    await page2.goto('/login');
    await page2.getByLabel('Username').fill('user2');
    await page2.getByLabel('Password').fill('password123');
    await page2.getByRole('button', { name: 'Login' }).click();
    await page2.goto('/operators');
    
    // Create operator in page1
    await page1.getByRole('button', { name: 'Add Operator' }).click();
    await page1.getByLabel('Name').fill('Jane Smith');
    await page1.getByRole('button', { name: 'Save' }).click();
    
    // Verify update appears in page2 via WebSocket
    await expect(page2.getByText('Jane Smith')).toBeVisible({ timeout: 5000 });
  });
});
```

## Critical User Paths

Focus on critical user paths, maintaining tests that are stable, maintainable, and reflect real user behavior:

1. **Authentication Flow**: Login, logout, role-based access control
2. **Operator Management**: CRUD operations, status updates, skill management
3. **Machine Management**: CRUD operations, maintenance scheduling, status tracking
4. **Material Management**: CRUD operations, quantity tracking, low-stock alerts
5. **Work Order Management**: CRUD operations, priority updates, status transitions
6. **Resource Allocation**: Single allocation, bulk allocation, conflict detection, reallocation
7. **Dashboard**: View statistics, real-time updates via WebSocket
8. **Validation**: Input validation, error handling, business rule enforcement

## Reference

Follow the official Playwright documentation and best practices: https://playwright.dev/docs/writing-tests