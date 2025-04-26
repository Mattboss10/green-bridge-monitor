# Green Bridge Monitor

A monitoring dashboard for tracking bridge transfers and CO₂ savings between Avalanche subnets.

## Features

- Real-time tracking of bridge transfers
- CO₂ savings calculations
- Interactive charts and visualizations
- Chain filtering and time range selection
- Modern, responsive UI with dark theme

## Setup

1. Install dependencies:
```bash
npm run install-all
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## Deployment

The application is designed to be deployed as a single unit, with the backend serving both the API and frontend static files.

### Local Production Build

1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Cloud Deployment (Recommended: Railway)

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Railway will automatically detect the Node.js application and deploy it
4. The application will be available at the provided Railway URL

## Environment Variables

- `PORT`: Server port (default: 3001)
- `DATABASE_URL`: SQLite database URL (for Railway deployment)

## Project Structure

- `server.js`: Backend server and API
- `green-bridge-dashboard/`: Frontend React application
  - `src/components/`: React components
  - `src/styles/`: CSS and design system
  - `dist/`: Built frontend files (generated)

## Technologies Used

- Frontend: React, Vite, Chart.js
- Backend: Node.js, Express
- Database: SQLite
- Styling: Tailwind CSS 