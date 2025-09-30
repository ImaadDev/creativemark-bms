# Employee Dashboard API Documentation

This document describes the comprehensive backend API endpoints for the employee dashboard functionality.

## Base URL
```
http://localhost:5000/api/employees
```

## Authentication
All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Dashboard Statistics
**GET** `/dashboard/stats`

Returns comprehensive statistics for the employee's dashboard.

**Response:**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalApplications": 45,
    "completedApplications": 32,
    "pendingApplications": 10,
    "overdueApplications": 3,
    "completionRate": 71,
    "averageCompletionTime": 5,
    "thisWeekApplications": 8
  }
}
```

### 2. Employee Applications/Tasks
**GET** `/applications`

Returns paginated list of applications assigned to the employee.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (submitted, under_review, in_process, completed, rejected)
- `search` (optional): Search by service type or client name
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order - desc/asc (default: desc)

**Response:**
```json
{
  "success": true,
  "message": "Employee applications retrieved successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "type": "commercial",
      "serviceType": "commercial",
      "client": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "status": "in_process",
      "priority": "medium",
      "progress": 80,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T14:45:00.000Z",
      "expectedCompletion": "2024-01-25T00:00:00.000Z",
      "assignedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalApplications": 45,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 3. Recent Activities
**GET** `/activities`

Returns recent timeline activities for applications assigned to the employee.

**Query Parameters:**
- `limit` (optional): Number of activities to return (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Recent activities retrieved successfully",
  "data": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "type": "in_process",
      "description": "Application moved to in process",
      "application": {
        "id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "type": "commercial",
        "status": "in_process"
      },
      "user": {
        "name": "Jane Smith"
      },
      "date": "2024-01-20T14:45:00.000Z",
      "progress": 80
    }
  ]
}
```

### 4. Performance Metrics
**GET** `/performance`

Returns performance metrics for the employee over a specified period.

**Query Parameters:**
- `period` (optional): Time period - week, month, quarter, year (default: month)

**Response:**
```json
{
  "success": true,
  "message": "Performance metrics retrieved successfully",
  "data": {
    "period": "month",
    "totalTasks": 25,
    "completedTasks": 18,
    "pendingTasks": 5,
    "overdueTasks": 2,
    "averageCompletionTime": 4,
    "successRate": 72,
    "monthlyData": [
      {
        "month": "Jan",
        "tasks": 8,
        "completed": 6,
        "successRate": 75
      },
      {
        "month": "Feb",
        "tasks": 12,
        "completed": 9,
        "successRate": 75
      }
    ]
  }
}
```

### 5. Upcoming Deadlines
**GET** `/deadlines`

Returns applications with upcoming deadlines assigned to the employee.

**Query Parameters:**
- `limit` (optional): Number of deadlines to return (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Deadlines retrieved successfully",
  "data": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "title": "commercial Application",
      "client": "John Doe",
      "deadline": "2024-01-25T00:00:00.000Z",
      "daysUntilDeadline": 3,
      "priority": "high",
      "status": "in_process",
      "applicationId": "64f1a2b3c4d5e6f7g8h9i0j1"
    }
  ]
}
```

### 6. Notifications
**GET** `/notifications`

Returns notifications for the employee based on their assigned applications.

**Query Parameters:**
- `limit` (optional): Number of notifications to return (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": [
    {
      "id": "status-64f1a2b3c4d5e6f7g8h9i0j1",
      "type": "info",
      "title": "New Task Assigned",
      "message": "You have been assigned a new commercial application from John Doe",
      "date": "2024-01-15T10:30:00.000Z",
      "read": false,
      "priority": "medium",
      "actionUrl": "/employee/my-tasks?id=64f1a2b3c4d5e6f7g8h9i0j1",
      "applicationId": "64f1a2b3c4d5e6f7g8h9i0j1"
    },
    {
      "id": "overdue-64f1a2b3c4d5e6f7g8h9i0j2",
      "type": "urgent",
      "title": "Task Overdue",
      "message": "commercial application is past its due date",
      "date": "2024-01-20T00:00:00.000Z",
      "read": false,
      "priority": "high",
      "actionUrl": "/employee/my-tasks?id=64f1a2b3c4d5e6f7g8h9i0j2",
      "applicationId": "64f1a2b3c4d5e6f7g8h9i0j2"
    }
  ]
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not found
- `500`: Internal server error

## Data Models

### Application Status Values
- `submitted`: Initial submission
- `under_review`: Being reviewed
- `approved`: Approved for processing
- `in_process`: Currently being processed
- `completed`: Successfully completed
- `rejected`: Rejected

### Priority Levels
- `urgent`: Overdue or critical
- `high`: Due within 3 days
- `medium`: Normal priority
- `low`: Low priority

### Notification Types
- `info`: General information
- `urgent`: Urgent action required
- `success`: Success/completion notification

## Usage Examples

### Frontend Integration

```javascript
// Get dashboard statistics
const stats = await fetch('/api/employees/dashboard/stats', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get employee applications with pagination
const applications = await fetch('/api/employees/applications?page=1&limit=10&status=pending', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get performance metrics for current month
const performance = await fetch('/api/employees/performance?period=month', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Notes

1. All endpoints are protected by authentication middleware
2. Employee can only access their own assigned applications
3. Data is filtered based on the authenticated user's ID
4. All timestamps are in ISO 8601 format
5. Pagination is implemented for large datasets
6. Search functionality supports partial matching
7. Performance metrics can be filtered by different time periods



