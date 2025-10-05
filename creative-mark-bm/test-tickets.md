# Ticket System Test Guide

## Backend API Endpoints

The ticket system has been updated with the following endpoints:

### User Endpoints (requires authentication)
- `GET /api/tickets` - Get user's tickets with pagination and filtering
- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets/:id` - Get specific ticket with replies
- `PUT /api/tickets/:id` - Update ticket (title, description, priority, category)
- `DELETE /api/tickets/:id` - Soft delete ticket (sets status to closed)
- `POST /api/tickets/:id/replies` - Add reply to ticket
- `PUT /api/tickets/:id/rate` - Rate resolved ticket
- `GET /api/tickets/stats` - Get ticket statistics

### Admin Endpoints (requires admin role)
- `PUT /api/tickets/:id/assign` - Assign ticket to employee
- `PUT /api/tickets/:id/resolve` - Resolve ticket
- `PUT /api/tickets/:id/close` - Close ticket

## Frontend Components Updated

### 1. Ticket Service (`src/services/ticketService.js`)
- Updated to match backend API structure
- Added pagination support
- Added admin-specific functions
- Proper error handling

### 2. Ticket Components
- **CreateTicketModal**: Create new support tickets
- **TicketList**: Display and filter user's tickets
- **TicketDetail**: View ticket details and add replies

### 3. Pages Updated
- **Client Support** (`/client/support`): Added ticket tab
- **Employee Support** (`/employee/support`): Added ticket tab
- **Admin Tickets** (`/admin/tickets`): Complete ticket management

## Testing Steps

### 1. Create a Ticket (Client/Employee)
1. Navigate to `/client/support` or `/employee/support`
2. Click on "My Support Tickets" tab
3. Click "New Ticket" button
4. Fill out the form:
   - Title: "Test Issue"
   - Category: "General"
   - Priority: "Medium"
   - Description: "This is a test ticket"
5. Click "Create Ticket"

### 2. View Tickets
1. After creating a ticket, it should appear in the ticket list
2. Click on a ticket to view details
3. Verify all ticket information is displayed correctly

### 3. Add Reply
1. In ticket detail view, scroll to bottom
2. Type a message in the reply textarea
3. Click "Send Reply"
4. Verify reply appears in the conversation

### 4. Admin Management
1. Login as admin
2. Navigate to `/admin/tickets`
3. View all tickets in the system
4. Test ticket actions (resolve, close, assign)

## Expected Behavior

- Tickets should be created successfully
- Ticket list should update after creation
- Replies should be added to tickets
- Admin should see all tickets
- Status updates should work properly
- Error handling should display appropriate messages

## Data Structure

### Ticket Object
```javascript
{
  _id: "ticket_id",
  userId: { _id: "user_id", fullName: "User Name", email: "user@email.com" },
  title: "Ticket Title",
  description: "Ticket Description",
  status: "open|in_progress|resolved|closed",
  priority: "low|medium|high|urgent",
  category: "general|application|payment|document|technical|billing",
  attachments: [],
  assignedTo: { _id: "employee_id", fullName: "Employee Name" },
  replies: [],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## Notes

- All ticket operations require authentication
- Users can only see their own tickets
- Admins can see and manage all tickets
- Tickets are soft deleted (status set to closed)
- File attachments are supported but not fully implemented in UI
- Real-time notifications would require WebSocket implementation


