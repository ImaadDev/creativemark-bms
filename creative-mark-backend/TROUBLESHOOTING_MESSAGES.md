# Message System Troubleshooting Guide

## How the Message System Works

### Client to Employee Message Flow
1. Client sends a message through `/api/messages` endpoint
2. Backend finds the application and checks if client owns it
3. Backend assigns the message to the first assigned employee: `recipientId = application.assignedEmployees[0]?.employeeId`
4. Message is saved to database with `senderId` (client) and `recipientId` (employee)
5. Employee sees the message when they check their conversations

### Employee to Client Message Flow  
1. Employee sends a message through `/api/messages` endpoint
2. Backend finds the application and checks if employee is assigned to it
3. Backend assigns the message to the client: `recipientId = application.userId`
4. Message is saved to database with `senderId` (employee) and `recipientId` (client)
5. Client sees the message when they check their conversations

## Common Issues and Solutions

### Issue 1: Employee Not Seeing Client Messages

**Possible Causes:**
1. Employee is not assigned to the application
2. Application has no `assignedEmployees` array or it's empty
3. Message was sent before employee was assigned
4. Message routing is incorrect

**How to Check:**
```javascript
// In MongoDB, check if employee is assigned to application
db.applications.findOne({ _id: applicationId }, { assignedEmployees: 1 })

// Check if messages exist for this application
db.messages.find({ applicationId: applicationId })

// Check if messages have correct recipient
db.messages.find({ applicationId: applicationId, recipientId: employeeId })
```

**Solutions:**
1. Ensure employee is properly assigned to the application
2. Ensure `assignedEmployees` array exists and has at least one employee
3. Resend messages after employee is assigned
4. Check message routing logic in `sendMessage` function

### Issue 2: Client Not Seeing Employee Messages

**Possible Causes:**
1. Message routing is incorrect
2. Client is not the owner of the application
3. Message was sent to wrong recipient

**How to Check:**
```javascript
// Check if messages exist for this application
db.messages.find({ applicationId: applicationId })

// Check if messages have correct recipient
db.messages.find({ applicationId: applicationId, recipientId: clientId })
```

**Solutions:**
1. Ensure employee is sending messages to the correct application
2. Ensure message routing is correct
3. Check message routing logic in `sendMessage` function

## Current Message Routing Logic

### When Client Sends Message:
```javascript
if (userRole === "client" && application.userId.toString() === senderId) {
  recipientId = application.assignedEmployees[0]?.employeeId || null;
}
```

### When Employee Sends Message:
```javascript
if (userRole === "employee" && application.assignedEmployees.some(emp => emp.employeeId.toString() === senderId)) {
  recipientId = application.userId;
}
```

## Conversation Retrieval Logic

### For Employees:
```javascript
// Find applications where employee is assigned
applications = await Application.find({
  "assignedEmployees.employeeId": userId
})

// For each application, find the last message
lastMessage = await Message.findOne({
  applicationId: app._id,
  isDeleted: false
}).sort({ createdAt: -1 })

// Only show applications that have messages
conversations.filter(conv => conv.conversationPartner && conv.lastMessage)
```

## Debugging Steps

1. **Check Employee Assignment:**
   - Log in as admin
   - Open the application
   - Check if employee is in the `assignedEmployees` array
   - Ensure `employeeId` field is populated

2. **Check Messages:**
   - Check MongoDB to see if messages exist
   - Verify `recipientId` matches the employee's ID
   - Verify `applicationId` matches the application ID

3. **Check Console Logs:**
   - Look for "Employee X found Y assigned applications"
   - Look for "Application X has message from Y to Z"
   - Look for any error messages

4. **Test Message Flow:**
   - Send a message as client
   - Check if message appears in database with correct `recipientId`
   - Refresh employee support page
   - Check if conversation appears

## Expected Behavior

When a client sends a message:
1. Message should be saved with `recipientId` = first assigned employee
2. Employee should see the application in their conversation list
3. Employee should see the message when they open the conversation

When an employee sends a message:
1. Message should be saved with `recipientId` = client (application owner)
2. Client should see the application in their conversation list
3. Client should see the message when they open the conversation

