/**
 * Leave Management System - Backend
 * 
 * API Contract (frozen):
 * - GET /api/leaves → { success: true, data: Leave[] }
 * - POST /api/leaves (body: { user, from, to, type }) → { success: true, leave }
 * - POST /api/leaves/:id/approve → { success: true, leave }
 * 
 * Data Model:
 * {
 *   id: number,
 *   user: string,
 *   email?: string,
 *   team?: string,
 *   from: "YYYY-MM-DD",
 *   to: "YYYY-MM-DD",
 *   status: "pending" | "approved" | "rejected",
 *   type: "casual" | "sick" | "vacation",
 *   createdAt: "YYYY-MM-DD"
 * }
 * 
 * TODO for relay handoff:
 * - Add authentication middleware
 * - Add database integration (MongoDB/PostgreSQL)
 * - Add rejection endpoint (POST /api/leaves/:id/reject)
 * - Add email notifications
 * - Add validation middleware (joi/zod)
 * - Add pagination for leaves list
 * - Add filtering by status/type/date range
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8002;

// Middleware
app.use(cors()); // Allow frontend to communicate
app.use(express.json()); // Parse JSON bodies

// In-memory mock data - seeded with ~25 realistic records
// TODO: Replace with database queries
let leaves = [
  { id: 1, user: "Alice Johnson", email: "alice@company.com", team: "Engineering", from: "2026-02-21", to: "2026-02-23", status: "approved", type: "vacation", createdAt: "2026-02-15" },
  { id: 2, user: "Bob Smith", email: "bob@company.com", team: "Design", from: "2026-02-24", to: "2026-02-25", status: "pending", type: "sick", createdAt: "2026-02-18" },
  { id: 3, user: "Carol Davis", email: "carol@company.com", team: "Marketing", from: "2026-02-20", to: "2026-02-20", status: "approved", type: "casual", createdAt: "2026-02-17" },
  { id: 4, user: "David Wilson", email: "david@company.com", team: "Engineering", from: "2026-02-28", to: "2026-03-02", status: "pending", type: "vacation", createdAt: "2026-02-19" },
  { id: 5, user: "Emma Brown", email: "emma@company.com", team: "Sales", from: "2026-02-22", to: "2026-02-24", status: "rejected", type: "casual", createdAt: "2026-02-16" },
  { id: 6, user: "Frank Miller", email: "frank@company.com", team: "HR", from: "2026-02-25", to: "2026-02-26", status: "approved", type: "sick", createdAt: "2026-02-18" },
  { id: 7, user: "Grace Lee", email: "grace@company.com", team: "Engineering", from: "2026-03-01", to: "2026-03-05", status: "pending", type: "vacation", createdAt: "2026-02-19" },
  { id: 8, user: "Henry Taylor", email: "henry@company.com", team: "Finance", from: "2026-02-21", to: "2026-02-22", status: "approved", type: "casual", createdAt: "2026-02-15" },
  { id: 9, user: "Iris Wang", email: "iris@company.com", team: "Design", from: "2026-02-27", to: "2026-02-28", status: "pending", type: "sick", createdAt: "2026-02-20" },
  { id: 10, user: "Jack Chen", email: "jack@company.com", team: "Marketing", from: "2026-03-03", to: "2026-03-07", status: "pending", type: "vacation", createdAt: "2026-02-20" },
  { id: 11, user: "Karen White", email: "karen@company.com", team: "Sales", from: "2026-02-20", to: "2026-02-21", status: "approved", type: "casual", createdAt: "2026-02-14" },
  { id: 12, user: "Leo Garcia", email: "leo@company.com", team: "Engineering", from: "2026-02-23", to: "2026-02-23", status: "rejected", type: "sick", createdAt: "2026-02-19" },
  { id: 13, user: "Maria Rodriguez", email: "maria@company.com", team: "HR", from: "2026-02-26", to: "2026-02-27", status: "approved", type: "vacation", createdAt: "2026-02-17" },
  { id: 14, user: "Nathan Kim", email: "nathan@company.com", team: "Finance", from: "2026-03-02", to: "2026-03-03", status: "pending", type: "casual", createdAt: "2026-02-20" },
  { id: 15, user: "Olivia Martinez", email: "olivia@company.com", team: "Design", from: "2026-02-21", to: "2026-02-22", status: "approved", type: "sick", createdAt: "2026-02-16" },
  { id: 16, user: "Peter Nguyen", email: "peter@company.com", team: "Marketing", from: "2026-02-28", to: "2026-03-01", status: "pending", type: "vacation", createdAt: "2026-02-19" },
  { id: 17, user: "Quinn Adams", email: "quinn@company.com", team: "Sales", from: "2026-02-24", to: "2026-02-25", status: "approved", type: "casual", createdAt: "2026-02-15" },
  { id: 18, user: "Rachel Green", email: "rachel@company.com", team: "Engineering", from: "2026-03-04", to: "2026-03-06", status: "pending", type: "sick", createdAt: "2026-02-20" },
  { id: 19, user: "Sam Wilson", email: "sam@company.com", team: "Finance", from: "2026-02-22", to: "2026-02-23", status: "approved", type: "vacation", createdAt: "2026-02-18" },
  { id: 20, user: "Tina Huang", email: "tina@company.com", team: "HR", from: "2026-02-27", to: "2026-02-28", status: "rejected", type: "casual", createdAt: "2026-02-19" },
  { id: 21, user: "Uma Patel", email: "uma@company.com", team: "Design", from: "2026-03-02", to: "2026-03-03", status: "pending", type: "vacation", createdAt: "2026-02-20" },
  { id: 22, user: "Victor Lopez", email: "victor@company.com", team: "Marketing", from: "2026-02-21", to: "2026-02-21", status: "approved", type: "sick", createdAt: "2026-02-17" },
  { id: 23, user: "Wendy Scott", email: "wendy@company.com", team: "Sales", from: "2026-02-25", to: "2026-02-26", status: "approved", type: "casual", createdAt: "2026-02-16" },
  { id: 24, user: "Xavier Reed", email: "xavier@company.com", team: "Engineering", from: "2026-03-05", to: "2026-03-08", status: "pending", type: "vacation", createdAt: "2026-02-20" },
  { id: 25, user: "Yolanda King", email: "yolanda@company.com", team: "Finance", from: "2026-02-23", to: "2026-02-24", status: "pending", type: "sick", createdAt: "2026-02-19" }
];

// Helper function to calculate days between dates
function calculateDays(from, to) {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffTime = Math.abs(toDate - fromDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end
  return diffDays;
}

// Helper function to generate new ID
function generateId() {
  return Math.max(...leaves.map(l => l.id), 0) + 1;
}

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * GET /api/leaves
 * Get all leave requests
 * Returns: { success: true, data: Leave[] }
 */
app.get('/api/leaves', (req, res) => {
  // TODO: Add query parameters for filtering (status, type, date range)
  // TODO: Add pagination
  res.json({ success: true, data: leaves });
});

/**
 * GET /api/leaves/history
 * Get leave history (same as /api/leaves for MVP)
 * Returns: { success: true, data: Leave[] }
 */
app.get('/api/leaves/history', (req, res) => {
  res.json({ success: true, data: leaves });
});

/**
 * POST /api/leaves
 * Submit a new leave request
 * Body: { user, from, to, type, email?, team? }
 * Returns: { success: true, leave }
 */
app.post('/api/leaves', (req, res) => {
  const { user, from, to, type, email, team } = req.body;

  // Validation
  if (!user || !from || !to || !type) {
    return res.status(400).json({ 
      success: false, 
      error: "Missing required fields: user, from, to, type" 
    });
  }

  // Validate leave type
  const validTypes = ['casual', 'sick', 'vacation'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ 
      success: false, 
      error: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
    });
  }

  // Validate date range
  if (new Date(from) > new Date(to)) {
    return res.status(400).json({ 
      success: false, 
      error: "From date must be before or equal to To date" 
    });
  }

  // Auto-approve logic: short leaves (≤ 2 days) are auto-approved
  // TODO: Make this configurable or remove for production
  const days = calculateDays(from, to);
  const autoApprove = days <= 2;
  const status = autoApprove ? 'approved' : 'pending';

  const newLeave = {
    id: generateId(),
    user,
    email: email || `${user.toLowerCase().replace(/\s+/g, '.')}@company.com`,
    team: team || 'General',
    from,
    to,
    status,
    type,
    createdAt: getTodayDate()
  };

  leaves.push(newLeave);

  console.log(`[NEW LEAVE] ${user} - ${type} (${from} to ${to}) - ${status === 'approved' ? 'AUTO-APPROVED' : 'pending'}`);

  res.status(201).json({ success: true, leave: newLeave });
});

/**
 * POST /api/leaves/:id/approve
 * Approve a leave request
 * Returns: { success: true, leave }
 */
app.post('/api/leaves/:id/approve', (req, res) => {
  const { id } = req.params;
  const leaveId = parseInt(id);

  const leave = leaves.find(l => l.id === leaveId);

  if (!leave) {
    return res.status(404).json({ 
      success: false, 
      error: "Leave request not found" 
    });
  }

  if (leave.status === 'approved') {
    return res.status(400).json({ 
      success: false, 
      error: "Leave is already approved" 
    });
  }

  if (leave.status === 'rejected') {
    return res.status(400).json({ 
      success: false, 
      error: "Cannot approve a rejected leave request" 
    });
  }

  leave.status = 'approved';

  console.log(`[APPROVED] Leave #${leaveId} - ${leave.user}`);

  res.json({ success: true, leave });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   Leave Management System - Backend Server                ║
╠═══════════════════════════════════════════════════════════╣
║   Server running at: http://localhost:${PORT}               ║
║                                                           ║
║   API Endpoints:                                          ║
║   - GET  /api/leaves         → List all leaves            ║
║   - GET  /api/leaves/history → Leave history              ║
║   - POST /api/leaves         → Submit new leave          ║
║   - POST /api/leaves/:id/approve → Approve leave          ║
║   - GET  /api/health         → Health check               ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
