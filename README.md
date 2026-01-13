# Price Memory Project

This project contains two main directories:

- **frontend**: A Next.js application (Frontend).
- **backend**: A Node.js/Express application (Backend).

## Setup & Running

### Frontend

1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies (already installed): `pnpm install`
3. Run the development server: `pnpm dev`
4. Open [http://localhost:3000](http://localhost:3000)

### Backend

1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies (already installed): `pnpm install`
3. Start the server: `pnpm start` (or `node index.js`)
4. The server runs on port 4000 by default.

## Deployment to Vercel

Both folders can be deployed to Vercel.

- **Frontend**: Connect your repository and point Vercel to the `frontend` directory as the Root Directory. Vercel will auto-detect Next.js.
- **Backend**: Connect your repository and point Vercel to the `backend` directory as the Root Directory. The `vercel.json` specific configuration will handle the Express server.
