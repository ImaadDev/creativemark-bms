# Employee Application Edit API Documentation

This document describes the backend API endpoint for employees to edit application data, allowing them to update specific fields of assigned applications.

## Base URL
```
http://localhost:5000/api/employees
```

## Authentication
All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoint

### Update Application Data
**PUT** `/applications/:id`

Updates specific application data fields that employees are allowed to modify.

**Parameters:**
- `id` (path): Application ID

**Request Body:**
```json
{
  "externalCompaniesCount": 2,
  "externalCompaniesDetails": [
    {
      "companyName": "Example Corp",
      "country": "USA",
      "crNumber": "CR123456",
      "sharePercentage": 25
    },
    {
      "companyName": "Another Corp",
      "country": "UK",
      "crNumber": "CR789012",
      "sharePercentage": 15
    }
  ],
  "projectEstimatedValue": 75000,
  "familyMembers": [
    {
      "name": "Jane Doe",
      "relation": "spouse",
      "passportNo": "P123456"
    },
    {
      "name": "John Doe Jr",
      "relation": "child",
      "passportNo": "P789012"
    }
  ],
  "needVirtualOffice": true,
  "companyArrangesExternalCompanies": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application data updated successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "serviceType": "commercial",
    "partnerType": "sole",
    "externalCompaniesCount": 2,
    "externalCompaniesDetails": [
      {
        "companyName": "Example Corp",
        "country": "USA",
        "crNumber": "CR123456",
        "sharePercentage": 25
      },
      {
        "companyName": "Another Corp",
        "country": "UK",
        "crNumber": "CR789012",
        "sharePercentage": 15
      }
    ],
    "projectEstimatedValue": 75000,
    "familyMembers": [
      {
        "name": "Jane Doe",
        "relation": "spouse",
        "passportNo": "P123456"
      },
      {
        "name": "John Doe Jr",
        "relation": "child",
        "passportNo": "P789012"
      }
    ],
    "needVirtualOffice": true,
    "companyArrangesExternalCompanies": false,
    "status": "in_process",
    "approvedBy": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "fullName": "Admin User"
    },
    "approvedAt": null,
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
    "partner": null,
    "createdAt": "2024-01-15T09:00:00.000Z",
    "updatedAt": "2024-01-20T12:00:00.000Z",
    "timeline": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
        "status": "in_process",
        "note": "Application data updated by employee",
        "progress": 80,
        "updatedBy": {
          "name": "Employee Name",
          "id": "64f1a2b3c4d5e6f7g8h9i0j3"
        },
        "createdAt": "2024-01-20T12:00:00.000Z"
      }
    ],
    "documents": [],
    "payment": null
  }
}
```

## Editable Fields

Employees can update the following fields:

### 1. External Companies Information
- `externalCompaniesCount` (number): Number of external companies
- `externalCompaniesDetails` (array): Array of external company objects
  - `companyName` (string): Company name
  - `country` (string): Country of registration
  - `crNumber` (string): Commercial registration number
  - `sharePercentage` (number): Share percentage (0-100)

### 2. Project Information
- `projectEstimatedValue` (number): Estimated project value

### 3. Family Members
- `familyMembers` (array): Array of family member objects
  - `name` (string): Family member name
  - `relation` (string): Relationship (spouse, child, parent, other)
  - `passportNo` (string): Passport number

### 4. Service Options
- `needVirtualOffice` (boolean): Whether virtual office is needed
- `companyArrangesExternalCompanies` (boolean): Whether company arranges external companies

## Security Features

1. **Field Filtering**: Only allowed fields can be updated
2. **Employee Access Control**: Employees can only edit applications assigned to them
3. **Data Validation**: All updates are validated against the schema
4. **Timeline Tracking**: All edits are logged in the timeline
5. **Authentication Required**: Valid JWT token required

## Error Responses

### 404 - Application Not Found
```json
{
  "success": false,
  "message": "Application not found or not assigned to you"
}
```

### 400 - Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "error": "Detailed validation message"
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

## Frontend Integration

### Service Function
```javascript
// Update application data
const result = await updateEmployeeApplicationData(applicationId, {
  externalCompaniesCount: 2,
  externalCompaniesDetails: [
    {
      companyName: "Example Corp",
      country: "USA",
      crNumber: "CR123456",
      sharePercentage: 25
    }
  ],
  projectEstimatedValue: 75000,
  familyMembers: [
    {
      name: "Jane Doe",
      relation: "spouse",
      passportNo: "P123456"
    }
  ],
  needVirtualOffice: true,
  companyArrangesExternalCompanies: false
});
```

### Usage Example
```javascript
const handleEditApplication = async (applicationId, editData) => {
  try {
    setEditing(true);
    const response = await updateEmployeeApplicationData(applicationId, editData);
    
    // Update local state with the complete updated application
    setApplication(response.data);
    
    // Show success message
    showSuccessMessage('Application updated successfully');
  } catch (error) {
    console.error('Error updating application:', error);
    showErrorMessage(error.message || 'Failed to update application');
  } finally {
    setEditing(false);
  }
};
```

## Frontend UI Features

### Edit Modal Components
1. **Project Value Input**: Number input for estimated project value
2. **External Companies Section**: 
   - Dynamic list of external companies
   - Add/Remove company functionality
   - Form fields for each company
3. **Family Members Section**:
   - Dynamic list of family members
   - Add/Remove member functionality
   - Form fields for each member
4. **Service Options**: Checkboxes for virtual office and external company arrangement

### Form Validation
- **Required Fields**: All fields are optional but validated when provided
- **Number Validation**: Numeric fields accept only valid numbers
- **Range Validation**: Share percentages must be 0-100
- **Array Validation**: Arrays are validated for proper structure

### User Experience
- **Real-time Updates**: Changes are reflected immediately
- **Loading States**: Visual feedback during save operations
- **Error Handling**: Clear error messages for validation failures
- **Success Feedback**: Confirmation when updates are successful

## Timeline Integration

Every edit operation creates a timeline entry:
- **Type**: Data update
- **Note**: "Application data updated by employee"
- **User Attribution**: Employee who made the changes
- **Timestamp**: When the update occurred
- **Progress**: Current application progress percentage

## Notes

1. **Partial Updates**: Only provided fields are updated, others remain unchanged
2. **Data Integrity**: All updates maintain referential integrity
3. **Audit Trail**: All changes are tracked in the timeline
4. **Employee Scope**: Employees can only edit applications assigned to them
5. **Real-time Sync**: Frontend updates immediately reflect backend changes

## Testing Checklist

- [ ] Employee can edit assigned application data
- [ ] Employee cannot edit applications not assigned to them
- [ ] All editable fields work correctly
- [ ] Dynamic arrays (companies, family members) work properly
- [ ] Form validation works for all field types
- [ ] Timeline entries are created for updates
- [ ] Error handling works for various scenarios
- [ ] UI updates reflect backend changes
- [ ] Loading states work correctly
- [ ] Success/error messages display properly



