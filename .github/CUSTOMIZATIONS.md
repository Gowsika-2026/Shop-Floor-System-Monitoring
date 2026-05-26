# Customizations Summary

Complete set of custom prompts, hooks, and skills created for the Shop-floor Resource Allocation System.

## Prompts (3 files)

Located in `.github/prompts/`

### 1. add-resource.prompt.md
**Purpose**: Add new resource type with complete backend and frontend  
**Invocation**: `/add-resource` or "Add resource"  
**Generates**:
- Backend: Model, Service, Controller, Routes
- Frontend: Redux Slice, API Service, CRUD Page
**When to use**: Adding new entities like Shift, Department, Equipment

### 2. add-endpoint.prompt.md
**Purpose**: Add new API endpoint to existing resource  
**Invocation**: `/add-endpoint` or "Add endpoint"  
**Generates**:
- Service method with business logic
- Controller method
- Route definition
- Frontend service method (optional)
**When to use**: Adding custom operations like bulk-assign, schedule, allocate

### 3. generate-page.prompt.md
**Purpose**: Generate CRUD page following project patterns  
**Invocation**: `/generate-page` or "Generate page"  
**Generates**:
- Complete React page with Material-UI table
- Add/Edit dialog
- Redux integration
- Toast notifications
**When to use**: Creating remaining pages (Machines, Materials, Work Orders, etc.)

## Hooks (3 files)

Located in `.github/hooks/`

### 1. format-on-save.json
**Event**: PostToolUse  
**Action**: Auto-format TypeScript/JavaScript files with Prettier after create/edit  
**Benefits**: Consistent code style, no manual formatting

### 2. validate-imports.json
**Event**: PreToolUse  
**Action**: Check that frontend files use path aliases (@hooks, @services) instead of deep relative imports  
**Script**: `.github/hooks/scripts/validate-imports.ps1`  
**Benefits**: Enforces import conventions, catches incorrect paths

### 3. check-environment.json
**Event**: SessionStart  
**Action**: Verify Node.js, PostgreSQL, and .env file exist  
**Script**: `.github/hooks/scripts/check-env.ps1`  
**Benefits**: Early warning about missing dependencies

## Skills (3 folders)

Located in `.github/skills/`

### 1. refactor-codebase/
**Invocation**: `/refactor-codebase` or "refactor"  
**Purpose**: Systematically refactor codebase for quality and performance  
**Includes**:
- SKILL.md with refactoring checklist
- references/patterns.md with code examples
**Covers**:
- Code duplication elimination
- Type safety improvements
- Error handling standardization
- Performance optimization
- Code organization
- Best practices

**When to use**: Task #6 "Refactor codebase" phase

### 2. test-generator/
**Invocation**: `/test-generator` or "generate tests"  
**Purpose**: Generate comprehensive tests for services, controllers, and components  
**Includes**:
- SKILL.md with test patterns
- templates/service.test.ts - Backend service tests
- templates/controller.test.ts - API endpoint tests
- templates/component.test.tsx - React component tests
**Covers**:
- Unit tests for services
- Integration tests for controllers
- Component tests with React Testing Library
- E2E test patterns

**When to use**: Task #7 "Test scenarios" phase

### 3. resource-scaffold/
**Invocation**: `/resource-scaffold` or "scaffold resource"  
**Purpose**: Rapidly create complete resource with full-stack implementation  
**Includes**:
- SKILL.md with scaffolding procedure
- templates/ (placeholders for code templates)
**Generates**:
- 4 backend files (model, service, controller, routes)
- 3 frontend files (slice, service, page)
- Updates to index files

**When to use**: Adding new entity types quickly

## Instructions File

Located in `.github/copilot-instructions.md`

**Purpose**: Project-wide coding standards that apply to all tasks  
**Contains**:
- Tech stack reference
- Architecture patterns (Controller→Service→Model)
- Code style guidelines
- Resource management rules
- Allocation business logic
- Build and test commands
- File organization conventions
- Domain-specific patterns

**Applies to**: Every chat interaction in this workspace

## How to Use

### Quick Start
1. Type `/` in chat to see all available prompts and skills
2. Select the appropriate prompt/skill for your task
3. Follow the interactive prompts

### Example Workflows

**Adding New Resource**:
1. Type `/add-resource` or `/resource-scaffold`
2. Provide resource name and fields
3. Agent generates all files following patterns

**Refactoring** (Task #6):
1. Type `/refactor-codebase`
2. Choose area to refactor (backend/frontend/all)
3. Agent applies refactoring patterns systematically

**Testing** (Task #7):
1. Type `/test-generator`
2. Specify test type or file to test
3. Agent generates tests following templates

**Adding Custom Endpoint**:
1. Type `/add-endpoint`
2. Describe endpoint (method, path, purpose)
3. Agent generates service, controller, and route

**Creating Pages**:
1. Type `/generate-page`
2. Specify page name and fields
3. Agent creates Material-UI page following operators pattern

## Files Created

**Total**: 19 files

### Prompts
- .github/prompts/add-resource.prompt.md
- .github/prompts/add-endpoint.prompt.md
- .github/prompts/generate-page.prompt.md

### Hooks
- .github/hooks/format-on-save.json
- .github/hooks/validate-imports.json
- .github/hooks/check-environment.json
- .github/hooks/scripts/validate-imports.ps1
- .github/hooks/scripts/check-env.ps1

### Skills
- .github/skills/refactor-codebase/SKILL.md
- .github/skills/refactor-codebase/references/patterns.md
- .github/skills/test-generator/SKILL.md
- .github/skills/test-generator/templates/service.test.ts
- .github/skills/test-generator/templates/controller.test.ts
- .github/skills/test-generator/templates/component.test.tsx
- .github/skills/resource-scaffold/SKILL.md

### Instructions
- .github/copilot-instructions.md

## Benefits

✅ **Consistency**: All code follows established patterns  
✅ **Speed**: Rapid scaffolding with prompts and skills  
✅ **Quality**: Automated formatting and validation with hooks  
✅ **Guidance**: Clear procedures for refactoring and testing  
✅ **Discovery**: Type `/` to see all available tasks  
✅ **Reusability**: Templates and patterns for common tasks  

## Next Steps

1. **Test the customizations**: Try invoking prompts and skills with `/`
2. **Execute refactoring**: Use `/refactor-codebase` for task #6
3. **Generate tests**: Use `/test-generator` for task #7
4. **Complete pages**: Use `/generate-page` for remaining CRUD pages
5. **Add features**: Use `/add-resource` for new entity types
