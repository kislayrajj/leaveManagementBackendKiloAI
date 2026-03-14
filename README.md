# Leave Management System

An MVP for an Automated Leave, Attendance & Workload Balancing System.

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express
- **Data**: In-memory mock data (no database)

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation & Running

**Backend:**
```bash
cd backend
npm install
npm start
```
Server runs on http://localhost:3001

**Frontend (in new terminal):**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaves` | Get all leave requests |
| GET | `/api/leaves/history` | Get leave history |
| POST | `/api/leaves` | Submit new leave request |
| POST | `/api/leaves/:id/approve` | Approve a leave request |
| GET | `/api/health` | Health check |

### Request/Response Formats

**POST /api/leaves**
```json
{
  "user": "John Doe",
  "email": "john@company.com",
  "team": "Engineering",
  "from": "2026-02-25",
  "to": "2026-02-27",
  "type": "vacation"
}
```

**Response:**
```json
{
  "success": true,
  "leave": {
    "id": 26,
    "user": "John Doe",
    "email": "john@company.com",
    "team": "Engineering",
    "from": "2026-02-25",
    "to": "2026-02-27",
    "status": "pending",
    "type": "vacation",
    "createdAt": "2026-02-20"
  }
}
```

## Data Model

```typescript
interface Leave {
  id: number;
  user: string;
  email?: string;
  team?: string;
  from: "YYYY-MM-DD";
  to: "YYYY-MM-DD";
  status: "pending" | "approved" | "rejected";
  type: "casual" | "sick" | "vacation";
  createdAt: "YYYY-MM-DD";
}
```

## Features

- ✅ Submit leave requests (name, from date, to date, type)
- ✅ List all leave requests in manager dashboard
- ✅ Approve leave requests
- ✅ Auto-approve short leaves (≤ 2 days)
- ✅ Status badges (pending/approved/rejected)
- ✅ Leave type indicators
- ✅ Statistics dashboard

## Demo Checklist

- [ ] Backend starts on port 3001
- [ ] Frontend starts on port 5173
- [ ] Form submits new leave successfully
- [ ] New leave appears in list
- [ ] Stats update correctly
- [ ] Approve button works
- [ ] Auto-approve works for ≤2 days
- [ ] Refresh button fetches latest data

## Project Structure

```
├── backend/
│   ├── index.js          # Express server + API routes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React app
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Tailwind imports
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Known TODOs (Relay Handoff)

### Backend
- [ ] Add authentication middleware
- [ ] Add database integration (MongoDB/PostgreSQL)
- [ ] Add rejection endpoint (POST /api/leaves/:id/reject)
- [ ] Add email notifications
- [ ] Add validation middleware (joi/zod)
- [ ] Add pagination for leaves list
- [ ] Add filtering by status/type/date range

### Frontend
- [ ] Add React Query or SWR for data fetching
- [ ] Add form validation library (react-hook-form)
- [ ] Add error boundaries
- [ ] Add loading skeletons
- [ ] Split into separate component files
- [ ] Add TypeScript
- [ ] Add toast/notification system
- [ ] Consider using a UI library (shadcn/ui, Mantine)

## License

MIT
