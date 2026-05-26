# Shop-Floor Resource Allocation - Backend

Backend API for the Shop-Floor Resource Allocation System.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Real-time**: Socket.io
- **Testing**: Jest, Supertest

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Create database:
```bash
createdb shop_floor_allocation
```

4. Run migrations:
```bash
npm run migrate
```

5. Seed database (optional):
```bash
npm run seed
```

### Development

Run in development mode with hot reload:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

### Run in Production

```bash
npm start
```

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── socket/          # WebSocket handlers
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── tests/               # Test files
├── logs/                # Application logs
├── .env.example         # Environment variables template
├── package.json
└── tsconfig.json
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Operators
- `GET /api/v1/operators` - Get all operators
- `GET /api/v1/operators/available` - Get available operators
- `GET /api/v1/operators/:id` - Get operator by ID
- `POST /api/v1/operators` - Create operator
- `PUT /api/v1/operators/:id` - Update operator
- `DELETE /api/v1/operators/:id` - Delete operator
- `PATCH /api/v1/operators/:id/status` - Update status

### Machines
- `GET /api/v1/machines` - Get all machines
- `GET /api/v1/machines/available` - Get available machines
- `GET /api/v1/machines/:id` - Get machine by ID
- `POST /api/v1/machines` - Create machine
- `PUT /api/v1/machines/:id` - Update machine
- `DELETE /api/v1/machines/:id` - Delete machine
- `PATCH /api/v1/machines/:id/status` - Update status

### Materials
- `GET /api/v1/materials` - Get all materials
- `GET /api/v1/materials/:id` - Get material by ID
- `POST /api/v1/materials` - Create material
- `PUT /api/v1/materials/:id` - Update material
- `DELETE /api/v1/materials/:id` - Delete material
- `PATCH /api/v1/materials/:id/quantity` - Update quantity

### Work Orders
- `GET /api/v1/work-orders` - Get all work orders
- `GET /api/v1/work-orders/:id` - Get work order by ID
- `POST /api/v1/work-orders` - Create work order
- `PUT /api/v1/work-orders/:id` - Update work order
- `DELETE /api/v1/work-orders/:id` - Delete work order
- `PATCH /api/v1/work-orders/:id/status` - Update status
- `PATCH /api/v1/work-orders/:id/priority` - Update priority

### Allocations
- `POST /api/v1/allocations` - Allocate resource
- `POST /api/v1/allocations/bulk` - Bulk allocate
- `POST /api/v1/allocations/reallocate` - Reallocate resource
- `GET /api/v1/allocations/work-order/:id` - Get allocations
- `PUT /api/v1/allocations/:id` - Update allocation
- `DELETE /api/v1/allocations/:id` - Remove allocation

### Dashboard & Analytics
- `GET /api/v1/dashboard/overview` - Get dashboard overview
- `GET /api/v1/analytics/utilization` - Get utilization metrics
- `GET /api/v1/analytics/idle-time` - Get idle time metrics
- `GET /api/v1/analytics/work-orders` - Get work order statistics

## WebSocket Events

### Client → Server
- Connection established automatically

### Server → Client
- `resource:update` - Resource updated
- `allocation:update` - Allocation changed
- `workorder:update` - Work order updated
- `status:change` - Resource status changed

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix lint errors
- `npm run format` - Format code with Prettier
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Rollback last migration
- `npm run seed` - Seed database

## Environment Variables

See `.env.example` for all required environment variables.

## License

ISC
