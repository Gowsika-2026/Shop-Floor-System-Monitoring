---
name: refactor-codebase
description: 'Refactor the Shop-floor Resource Allocation codebase: eliminate duplication, improve code organization, optimize performance, enhance type safety, and follow best practices'
argument-hint: 'optional: specific area (backend/frontend/all)'
user-invocable: true
---

# Refactor Codebase Skill

Systematically refactor the Shop-floor Resource Allocation System to improve code quality, maintainability, and performance.

## When to Use

- After code generation phase to clean up and optimize
- When duplicate code patterns emerge across files
- To improve type safety and error handling
- To enhance performance and reduce technical debt
- Before production deployment

## Refactoring Checklist

### 1. Code Duplication

**Backend**:
- Extract common service patterns into base classes or utilities
- Consolidate repeated validation logic
- Share WebSocket event emission helpers
- Unify error handling patterns

**Frontend**:
- Create reusable table components
- Extract form field generators
- Share status color mapping logic
- Consolidate API error handlers

**Actions**:
```
1. Search for duplicate code patterns using grep_search
2. Identify common abstractions
3. Create shared utilities or base classes
4. Refactor files to use shared code
5. Verify with get_errors tool
```

### 2. Type Safety

**Backend**:
- Add TypeScript interfaces for request/response DTOs
- Use Sequelize model types consistently
- Add type guards for status checks
- Eliminate any 'any' types

**Frontend**:
- Define strict interfaces for all entities
- Use discriminated unions for status types
- Add type guards for API responses
- Enable strict mode in tsconfig

**Actions**:
```
1. Search for 'any' types across codebase
2. Define proper interfaces
3. Add type guards where needed
4. Run TypeScript compiler to verify
```

### 3. Error Handling

**Backend**:
- Ensure all services throw typed errors
- Validate all controller error handling
- Add proper HTTP status codes
- Log errors appropriately

**Frontend**:
- Standardize error message formatting
- Add retry logic for network failures
- Improve user-facing error messages
- Handle edge cases (empty states, loading errors)

**Actions**:
```
1. Review all try-catch blocks
2. Add missing error handlers
3. Standardize error responses
4. Test error scenarios
```

### 4. Performance Optimization

**Backend**:
- Add database indexes for frequent queries
- Use eager loading to avoid N+1 queries
- Implement pagination for large datasets
- Cache frequently accessed data

**Frontend**:
- Memoize expensive computations with useMemo
- Use React.memo for pure components
- Implement virtual scrolling for large tables
- Lazy load pages with React.lazy

**Actions**:
```
1. Profile database queries
2. Add missing indexes to models
3. Optimize React component renders
4. Implement pagination
```

### 5. Code Organization

**Backend**:
- Group related utilities
- Separate DTOs from models
- Organize middleware logically
- Clean up unused imports

**Frontend**:
- Create shared component library
- Organize pages by feature
- Group related hooks
- Clean up unused imports

**Actions**:
```
1. Review file structure
2. Move misplaced files
3. Remove unused code
4. Update import paths
```

### 6. Best Practices

**Backend**:
- Use environment variables for config
- Add input validation schemas (Joi/Yup)
- Implement request rate limiting
- Add API documentation (Swagger)

**Frontend**:
- Add PropTypes or TypeScript for all components
- Implement accessibility features (ARIA labels)
- Add loading skeletons
- Improve responsive design

**Actions**:
```
1. Add validation schemas
2. Implement rate limiting
3. Add accessibility attributes
4. Test on different screen sizes
```

## Procedure

1. **Analyze Current State**
   - Run get_errors to identify issues
   - Search for common patterns using grep_search
   - Review file structure with file_search

2. **Prioritize Refactoring**
   - Critical: Type safety, error handling
   - High: Code duplication, performance
   - Medium: Organization, best practices

3. **Execute Refactoring**
   - Work on one category at a time
   - Make incremental changes
   - Test after each change
   - Commit frequently

4. **Validate Changes**
   - Run get_errors after each refactor
   - Verify all tests pass
   - Check that app still runs
   - Review with user

## Reference Files

See [refactoring patterns](./references/patterns.md) for common refactoring examples specific to this codebase.

## Output

After refactoring:
- Summary of changes made
- List of files modified
- Performance improvements
- Remaining technical debt items
- Recommendations for future work
