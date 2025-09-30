import Message from "../models/Message.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let applications;

    if (userRole === "client") {
      // Get applications where user is the client
      applications = await Application.find({ userId })
        .populate("assignedEmployees.employeeId", "fullName email role")
        .sort({ updatedAt: -1 });
    } else if (userRole === "employee") {
      // Get applications where user is assigned as employee
      applications = await Application.find({
        "assignedEmployees.employeeId": userId
      })
        .populate("userId", "fullName email role")
        .populate("assignedEmployees.employeeId", "fullName email role")
        .sort({ updatedAt: -1 });
    } else if (userRole === "admin") {
      // Admins can see all applications
      applications = await Application.find()
        .populate("userId", "fullName email role")
        .populate("assignedEmployees.employeeId", "fullName email role")
        .sort({ updatedAt: -1 });
    }

    // Get conversation summaries for each application
    const conversations = await Promise.all(
      applications.map(async (app) => {
        // Get the last message for this application
        const lastMessage = await Message.findOne({
          applicationId: app._id,
          isDeleted: false
        })
        .populate("senderId", "fullName email role")
        .sort({ createdAt: -1 });

        // Get unread count for this application
        const unreadCount = await Message.getUnreadCount(userId, app._id);

        // Determine conversation partner
        let conversationPartner = null;
        if (userRole === "client") {
          // Client can message with assigned employees and admins
          conversationPartner = app.assignedEmployees[0]?.employeeId || null;
        } else if (userRole === "employee") {
          // Employee can message with the client and admins
          conversationPartner = app.userId;
        } else if (userRole === "admin") {
          // Admin can message with client and assigned employees
          conversationPartner = app.userId;
        }

        return {
          applicationId: app._id,
          application: {
            id: app._id,
            serviceType: app.serviceType,
            status: app.status,
            createdAt: app.createdAt
          },
          conversationPartner,
          lastMessage: lastMessage ? {
            id: lastMessage._id,
            content: lastMessage.content,
            sender: lastMessage.senderId,
            createdAt: lastMessage.createdAt,
            isRead: lastMessage.isRead
          } : null,
          unreadCount
        };
      })
    );

    res.json({
      success: true,
      conversations: conversations.filter(conv => conv.conversationPartner)
    });
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching conversations",
      error: error.message
    });
  }
};

// @desc    Get messages for a specific conversation
// @route   GET /api/messages/conversation/:applicationId
// @access  Private
export const getConversationMessages = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const { page = 1, limit = 50 } = req.query;

    // Verify user has access to this application
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Check if user has permission to access this conversation
    let hasAccess = false;
    if (userRole === "client" && application.userId.toString() === userId) {
      hasAccess = true;
    } else if (userRole === "employee" && 
               application.assignedEmployees.some(emp => emp.employeeId.toString() === userId)) {
      hasAccess = true;
    } else if (userRole === "admin") {
      hasAccess = true;
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this conversation"
      });
    }

    // Determine conversation partner
    let conversationPartnerId = null;
    if (userRole === "client") {
      // Client can message with assigned employees and admins
      conversationPartnerId = application.assignedEmployees[0]?.employeeId || null;
    } else if (userRole === "employee") {
      // Employee can message with the client and admins
      conversationPartnerId = application.userId;
    } else if (userRole === "admin") {
      // Admin can message with client and assigned employees
      conversationPartnerId = application.userId;
    }

    if (!conversationPartnerId) {
      return res.status(400).json({
        success: false,
        message: "No conversation partner found"
      });
    }

    // Get messages
    const messages = await Message.getConversation(
      applicationId,
      userId,
      conversationPartnerId,
      parseInt(page),
      parseInt(limit)
    );

    // Mark messages as read
    const unreadMessageIds = messages
      .filter(msg => msg.recipientId._id.toString() === userId && !msg.isRead)
      .map(msg => msg._id);

    if (unreadMessageIds.length > 0) {
      await Message.markAsRead(unreadMessageIds, userId);
    }

    res.json({
      success: true,
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: messages.length
      }
    });
  } catch (error) {
    console.error("Error getting conversation messages:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching messages",
      error: error.message
    });
  }
};

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { applicationId, content, type = "text", replyTo } = req.body;
    const senderId = req.user.id;
    const userRole = req.user.role;

    // Validate required fields
    if (!applicationId || !content) {
      return res.status(400).json({
        success: false,
        message: "Application ID and content are required"
      });
    }

    // Verify application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Check if user has permission to send messages for this application
    let hasAccess = false;
    let recipientId = null;

    if (userRole === "client" && application.userId.toString() === senderId) {
      hasAccess = true;
      // Client can message with assigned employees and admins
      recipientId = application.assignedEmployees[0]?.employeeId || null;
    } else if (userRole === "employee" && 
               application.assignedEmployees.some(emp => emp.employeeId.toString() === senderId)) {
      hasAccess = true;
      // Employee can message with the client and admins
      recipientId = application.userId;
    } else if (userRole === "admin") {
      hasAccess = true;
      // Admin can message with client and assigned employees
      recipientId = application.userId;
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied to send messages for this application"
      });
    }

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: "No recipient found for this conversation"
      });
    }

    // Create message
    const message = new Message({
      applicationId,
      senderId,
      recipientId,
      content: content.trim(),
      type,
      replyTo
    });

    await message.save();

    // Populate sender and recipient details
    await message.populate([
      { path: "senderId", select: "fullName email role" },
      { path: "recipientId", select: "fullName email role" }
    ]);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message
    });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/read
// @access  Private
export const markMessagesAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;
    const userId = req.user.id;

    if (!messageIds || !Array.isArray(messageIds)) {
      return res.status(400).json({
        success: false,
        message: "Message IDs array is required"
      });
    }

    const result = await Message.markAsRead(messageIds, userId);

    res.json({
      success: true,
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({
      success: false,
      message: "Error marking messages as read",
      error: error.message
    });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:messageId
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    // Only sender can delete their own message
    if (message.senderId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages"
      });
    }

    // Soft delete
    message.isDeleted = true;
    message.deletedAt = new Date();
    message.deletedBy = userId;
    await message.save();

    res.json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting message",
      error: error.message
    });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { applicationId } = req.query;

    const unreadCount = await Message.getUnreadCount(userId, applicationId);

    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({
      success: false,
      message: "Error getting unread count",
      error: error.message
    });
  }
};
