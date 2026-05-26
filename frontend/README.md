# Shop-Floor Resource Allocation - Frontend

React frontend application for the Shop-Floor Resource Allocation System.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Charts**: Recharts
- **Forms**: Formik + Yup
- **Drag & Drop**: react-beautiful-dnd
- **Notifications**: react-toastify

## Getting Started

### Prerequisites

- Node.js 18+ and npm

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

### Development

Run development server:
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Build

Build for production:
```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Testing

Run tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── auth/        # Authentication components
│   │   ├── layout/      # Layout components
│   │   └── common/      # Common/shared components
│   ├── pages/           # Page components
│   │   ├── auth/        # Login, Register
│   │   ├── dashboard/   # Dashboard page
│   │   ├── operators/   # Operators management
│   │   ├── machines/    # Machines management
│   │   ├── materials/   # Materials management
│   │   ├── workOrders/  # Work orders management
│   │   ├── allocation/  # Resource allocation
│   │   └── analytics/   # Analytics and reports
│   ├── store/           # Redux store
│   │   ├── slices/      # Redux slices
│   │   └── index.ts     # Store configuration
│   ├── services/        # API services
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── theme.ts         # MUI theme configuration
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Features

### Pages

- **Login**: User authentication
- **Dashboard**: Overview of all resources and work orders
- **Operators**: Manage operators and their assignments
- **Machines**: Manage machines and their status
- **Materials**: Manage materials inventory
- **Work Orders**: Create and manage work orders
- **Allocation**: Drag-and-drop resource allocation interface
- **Analytics**: Utilization metrics and reports

### State Management

Redux Toolkit is used for global state management with the following slices:
- `auth` - Authentication state
- `operators` - Operators data
- `machines` - Machines data
- `materials` - Materials data
- `workOrders` - Work orders data
- `allocations` - Resource allocations
- `dashboard` - Dashboard statistics

### Real-time Updates

WebSocket connection using Socket.io for real-time updates:
- Resource status changes
- Allocation updates
- Work order updates
- Notifications

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix lint errors
- `npm run format` - Format code with Prettier

## Environment Variables

See `.env.example` for all required environment variables:

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_WS_URL` - WebSocket server URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## License

ISC
