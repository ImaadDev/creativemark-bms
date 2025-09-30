# Employee Application Management API Documentation

This document describes the backend API endpoints for employee application management functionality, allowing employees to view detailed application information and update application status/progress.

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

### 1. Get Application Details
**GET** `/applications/:id`

Returns comprehensive details of a specific application assigned to the employee.

**Parameters:**
- `id` (path): Application ID

**Response:**
```json
{
  "success": true,
  "message": "Application details retrieved successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "serviceType": "commercial",
    "partnerType": "sole",
    "externalCompaniesCount": 0,
    "externalCompaniesDetails": [
      {
        "companyName": "Example Corp",
        "country": "USA",
        "crNumber": "CR123456",
        "sharePercentage": 25
      }
    ],
    "projectEstimatedValue": 50000,
    "familyMembers": [
      {
        "name": "John Doe",
        "relation": "spouse",
        "passportNo": "P123456"
      }
    ],
    "needVirtualOffice": true,
    "companyArrangesExternalCompanies": false,
    "status": "in_process",
    "approvedBy": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "fullName": "Admin User"
    },
    "approvedAt": "2024-01-20T10:30:00.000Z",
    "assignedEmployees": [
      {
        "employeeId": {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
          "fullName": "Employee Name",
          "email": "employee@example.com"
        },
        "task": "Process application",
        "assignedAt": "2024-01-15T09:00:00.000Z"
      }
    ],
    "client": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
      "name": "Client Name",
      "email": "client@example.com",
      "phone": "+1234567890",
      "nationality": "American"
    },
    "partner": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
      "name": "Partner Name",
      "email": "partner@example.com",
      "phone": "+1234567891"
    },
    "createdAt": "2024-01-15T09:00:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z",
    "timeline": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
        "status": "in_process",
        "note": "Application moved to in process",
        "progress": 80,
        "updatedBy": {
          "name": "Employee Name",
          "id": "64f1a2b3c4d5e6f7g8h9i0j3"
        },
        "createdAt": "2024-01-20T10:30:00.000Z"
      }
    ],
    "documents": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j7",
        "name": "Passport Copy",
        "type": "passport",
        "url": "/uploads/passport.pdf",
        "uploadedAt": "2024-01-15T09:30:00.000Z"
      }
    ],
    "payment": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j8",
      "amount": 1000,
      "status": "paid",
      "method": "credit_card",
      "paidAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

### 2. Update Application Status
**PATCH** `/applications/:id`

Updates the status of an application and creates a timeline entry.

**Parameters:**
- `id` (path): Application ID

**Request Body:**
```json
{
  "status": "in_process",
  "note": "Starting processing of the application",
  "progress": 80
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application updated successfully",
  "data": {
    "application": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "status": "in_process",
      "approvedAt": null,
      "updatedAt": "2024-01-20T11:00:00.000Z"
    },
    "timelineEntry": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j9",
      "status": "in_process",
      "note": "Starting processing of the application",
      "progress": 80,
      "updatedBy": {
        "name": "Employee Name",
        "id": "64f1a2b3c4d5e6f7g8h9i0j3"
      },
      "createdAt": "2024-01-20T11:00:00.000Z"
    }
  }
}
```

### 3. Add Progress Update
**POST** `/applications/:id/progress`

Adds a progress update to an application without changing the status.

**Parameters:**
- `id` (path): Application ID

**Request Body:**
```json
{
  "progress": 85,
  "note": "Completed document verification"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Progress updated successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j10",
    "status": "in_process",
    "note": "Completed document verification",
    "progress": 85,
    "updatedBy": {
      "name": "Employee Name",
      "id": "64f1a2b3c4d5e6f7g8h9i0j3"
    },
    "createdAt": "2024-01-20T11:30:00.000Z"
  }
}
```

## Data Models

### Application Status Values
- `submitted`: Initial submission
- `under_review`: Being reviewed
- `approved`: Approved for processing
- `in_process`: Currently being processed
- `completed`: Successfully completed
- `rejected`: Rejected

### Progress Values
- Integer between 0 and 100
- Represents completion percentage

### Timeline Entry
```json
{
  "_id": "ObjectId",
  "status": "string",
  "note": "string",
  "progress": "number",
  "updatedBy": {
    "name": "string",
    "id": "ObjectId"
  },
  "createdAt": "ISO Date"
}
```

## Error Responses

### 404 - Application Not Found
```json
{
  "success": false,
  "message": "Application not found or not assigned to you"
}
```

### 400 - Invalid Status
```json
{
  "success": false,
  "message": "Invalid status value"
}
```

### 400 - Invalid Progress
```json
{
  "success": false,
  "message": "Progress must be between 0 and 100"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message (development only)"
}
```

## Security Features

1. **Employee Access Control**: Employees can only access applications assigned to them
2. **Status Validation**: Only valid status transitions are allowed
3. **Progress Validation**: Progress values must be between 0-100
4. **Authentication Required**: All endpoints require valid JWT token
5. **Timeline Tracking**: All updates are logged with user attribution

## Frontend Integration

### Service Functions
```javascript
// Get application details
const application = await getEmployeeApplicationDetails(applicationId);

// Update application status
const result = await updateEmployeeApplication(applicationId, {
  status: 'in_process',
  note: 'Starting processing',
  progress: 80
});

// Add progress update
const progress = await addApplicationProgress(applicationId, {
  progress: 85,
  note: 'Completed verification'
});
```

### Usage Examples
```javascript
// View application details
const handleViewDetails = async (applicationId) => {
  try {
    const response = await getEmployeeApplicationDetails(applicationId);
    setApplication(response.data);
  } catch (error) {
    console.error('Error loading application:', error);
  }
};

// Update status
const handleStatusUpdate = async (applicationId, newStatus, note) => {
  try {
    await updateEmployeeApplication(applicationId, {
      status: newStatus,
      note: note
    });
    // Refresh application data
    await loadApplicationDetails();
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

// Update progress
const handleProgressUpdate = async (applicationId, progress, note) => {
  try {
    await addApplicationProgress(applicationId, {
      progress: progress,
      note: note
    });
    // Refresh application data
    await loadApplicationDetails();
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};
```

## Notes

1. **Timeline Entries**: All status and progress updates create timeline entries for audit trail
2. **Automatic Completion**: Setting status to 'completed' automatically sets `approvedAt` timestamp
3. **Employee Assignment**: Only applications assigned to the authenticated employee are accessible
4. **Data Population**: All related data (client, partner, documents, payment) is populated in responses
5. **Real-time Updates**: Frontend should refresh data after updates to show latest information

## Testing Checklist

- [ ] Employee can view assigned application details
- [ ] Employee cannot access applications not assigned to them
- [ ] Status updates work correctly with timeline entries
- [ ] Progress updates work correctly
- [ ] Invalid status values are rejected
- [ ] Invalid progress values are rejected
- [ ] Timeline entries are created with correct user attribution
- [ ] All related data is properly populated
- [ ] Error handling works for various scenarios



