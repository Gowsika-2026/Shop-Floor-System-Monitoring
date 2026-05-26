# Shop-Floor Resource Allocation System

[![CI/CD Pipeline](https://github.com/Gowsika-2026/Shop-Floor-System-Monitoring/actions/workflows/ci.yml/badge.svg)](https://github.com/Gowsika-2026/Shop-Floor-System-Monitoring/actions/workflows/ci.yml)
[![Code Quality](https://github.com/Gowsika-2026/Shop-Floor-System-Monitoring/actions/workflows/code-quality.yml/badge.svg)](https://github.com/Gowsika-2026/Shop-Floor-System-Monitoring/actions/workflows/code-quality.yml)
[![Deployment](https://github.com/Gowsika-2026/Shop-Floor-System-Monitoring/actions/workflows/deploy.yml/badge.svg)](https://github.com/Gowsika-2026/Shop-Floor-System-Monitoring/actions/workflows/deploy.yml)

A comprehensive system for manufacturing supervisors to manage and allocate shop-floor resources (operators, machines, materials) to work orders in real-time, minimizing idle time and maximizing utilization.

## Project Overview

This system enables:
- Dynamic resource assignment and reallocation
- Real-time visibility into resource status
- Idle time minimization through intelligent allocation
- Conflict detection and resolution
- Analytics and reporting for optimization

## Tech Stack

### Backend
- Node.js + Express.js
- TypeScript
- PostgreSQL
- Sequelize ORM
- Socket.io (real-time)
- JWT (authentication)

### Frontend
- React 18
- TypeScript
- Redux Toolkit
- Material-UI
- Socket.io-client
- Vite

## Project Structure

```
shop-floor-allocation/
├── backend/             # Backend API server
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── socket/      # WebSocket handlers
│   │   ├── utils/       # Utilities
│   │   ├── app.ts       # Express app
│   │   └── server.ts    # Entry point
│   └── package.json
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   ├── services/    # API services
│   │   ├── hooks/       # Custom hooks
│   │   └── main.tsx     # Entry point
│   └── package.json
│
├── PROMPT.md            # Project requirements
├── DEVELOPMENT_PLAN.md  # Development roadmap
├── PLAN_VERIFICATION.md # Plan verification report
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Create database:
```bash
createdb shop_floor_allocation
```

5. Run migrations:
```bash
npm run migrate
```

6. Start development server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env if needed
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## API Documentation

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Resources
- Operators: `/api/v1/operators`
- Machines: `/api/v1/machines`
- Materials: `/api/v1/materials`
- Work Orders: `/api/v1/work-orders`
- Allocations: `/api/v1/allocations`

### Analytics
- Dashboard: `/api/v1/dashboard/overview`
- Utilization: `/api/v1/analytics/utilization`
- Idle Time: `/api/v1/analytics/idle-time`

See individual README files in backend and frontend directories for detailed API documentation.

## Features

### Core Features
- ✅ User authentication and authorization
- ✅ Operator management
- ✅ Machine management
- ✅ Material inventory management
- ✅ Work order creation and tracking
- ✅ Resource allocation and reallocation
- ✅ Real-time updates via WebSocket
- ✅ Dashboard with key metrics
- ✅ Analytics and reporting

### Planned Features
- [ ] Drag-and-drop allocation interface
- [ ] Automatic allocation suggestions
- [ ] Advanced analytics with charts
- [ ] Notification system
- [ ] Audit logging
- [ ] Mobile responsive design
- [ ] Export reports (PDF, CSV)

## Development

### Running Tests

Backend:
```bash
cd backend
npm test
```

Frontend:
```bash
cd frontend
npm test
```

### Linting

Backend:
```bash
cd backend
npm run lint
```

Frontend:
```bash
cd frontend
npm run lint
```

### Building for Production

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## Contributing

1. Create a feature branch
2. Make changes
3. Write tests
4. Run linter and tests
5. Submit pull request

## License

ISC

## Documentation

- [Project Prompt](./PROMPT.md) - Detailed requirements and specifications
- [Development Plan](./DEVELOPMENT_PLAN.md) - Phase-by-phase development roadmap
- [Plan Verification](./PLAN_VERIFICATION.md) - Plan verification and recommendations
- [Backend README](./backend/README.md) - Backend-specific documentation
- [Frontend README](./frontend/README.md) - Frontend-specific documentation

## Support

For issues and questions, please open an issue in the repository.
