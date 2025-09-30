import User from "../models/User.js";
import Application from "../models/Application.js";
import ApplicationDocument from "../models/Document.js";
import ApplicationTimeline from "../models/Timeline.js";
import Payment from "../models/Payment.js";

/**
 * @desc    Get all clients with full details and application counts
 * @route   GET /api/clients
 * @access  Private (Admin/Staff)
 */
export const getAllClients = async (req, res) => {
  try {
    // Fetch clients (exclude password, tokens, sensitive data)
    const clients = await User.find({ role: "client" })
      .select("-passwordHash -refreshToken -__v")
      .sort({ createdAt: -1 }); // Latest first

    if (!clients || clients.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No clients found",
        count: 0,
        data: [],
      });
    }

    // Get application counts for each client
    const clientIds = clients.map(client => client._id);
    const applicationCounts = await Application.aggregate([
      {
        $match: { userId: { $in: clientIds } }
      },
      {
        $group: {
          _id: "$userId",
          totalApplications: { $sum: 1 },
          submittedApplications: {
            $sum: { $cond: [{ $eq: ["$status", "submitted"] }, 1, 0] }
          },
          inProgressApplications: {
            $sum: { $cond: [{ $in: ["$status", ["under_review", "in_process"]] }, 1, 0] }
          },
          completedApplications: {
            $sum: { $cond: [{ $in: ["$status", ["approved", "completed"]] }, 1, 0] }
          }
        }
      }
    ]);

    // Create a map for quick lookup
    const applicationMap = {};
    applicationCounts.forEach(app => {
      applicationMap[app._id.toString()] = app;
    });

    // Format response with application counts
    const formattedClients = clients.map(client => {
      const appData = applicationMap[client._id.toString()] || {
        totalApplications: 0,
        submittedApplications: 0,
        inProgressApplications: 0,
        completedApplications: 0
      };

      return {
        _id: client._id,
        id: client._id,
        name: client.fullName,
        fullName: client.fullName,
        email: client.email,
        phone: client.phone,
        nationality: client.nationality || "N/A",
        residencyStatus: client.residencyStatus || "N/A",
        role: client.role,
        isActive: client.isActive,
        status: client.isActive ? "active" : "inactive",
        // Application statistics
        totalApplications: appData.totalApplications,
        submittedApplications: appData.submittedApplications,
        inProgressApplications: appData.inProgressApplications,
        completedApplications: appData.completedApplications,
        // Partner details if applicable
        partnerDetails: client.partnerDetails || null,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      message: "Clients retrieved successfully",
      count: formattedClients.length,
      data: formattedClients,
    });
  } catch (error) {
    console.error("Get All Clients Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    });
  }
};

/**
 * @desc    Get a single client by ID with full details
 * @route   GET /api/clients/:clientId
 * @access  Private (Admin/Staff)
 */
export const getClientById = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Fetch client details
    const client = await User.findById(clientId)
      .select("-passwordHash -refreshToken -__v");

    if (!client || client.role !== "client") {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Get client's applications
    const applications = await Application.find({ userId: clientId })
      .select("serviceType partnerType status createdAt updatedAt")
      .sort({ createdAt: -1 });

    // Format response
    const formattedClient = {
      _id: client._id,
      id: client._id,
      name: client.fullName,
      fullName: client.fullName,
      email: client.email,
      phone: client.phone,
      nationality: client.nationality || "N/A",
      residencyStatus: client.residencyStatus || "N/A",
      role: client.role,
      isActive: client.isActive,
      status: client.isActive ? "active" : "inactive",
      partnerDetails: client.partnerDetails || null,
      applications: applications,
      totalApplications: applications.length,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: "Client retrieved successfully",
      data: formattedClient,
    });
  } catch (error) {
    console.error("Get Client By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    });
  }
};

/**
 * @desc    Delete a client and all associated data (cascade delete)
 * @route   DELETE /api/clients/:clientId
 * @access  Private (Admin only)
 */
export const deleteClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Check if client exists and is actually a client
    const client = await User.findById(clientId);
    if (!client || client.role !== "client") {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Start a transaction to ensure all deletions succeed or none do
    const session = await User.startSession();
    session.startTransaction();

    try {
      // 1. Get all applications for this client
      const applications = await Application.find({ userId: clientId }).session(session);
      const applicationIds = applications.map(app => app._id);

      // 2. Delete all documents related to these applications
      if (applicationIds.length > 0) {
        await ApplicationDocument.deleteMany(
          { applicationId: { $in: applicationIds } },
          { session }
        );
        console.log(`Deleted documents for ${applicationIds.length} applications`);
      }

      // 3. Delete all timeline entries related to these applications
      if (applicationIds.length > 0) {
        await ApplicationTimeline.deleteMany(
          { applicationId: { $in: applicationIds } },
          { session }
        );
        console.log(`Deleted timeline entries for ${applicationIds.length} applications`);
      }

      // 4. Delete all payments related to these applications
      if (applicationIds.length > 0) {
        await Payment.deleteMany(
          { applicationId: { $in: applicationIds } },
          { session }
        );
        console.log(`Deleted payments for ${applicationIds.length} applications`);
      }

      // 5. Delete all applications for this client
      const deletedApplications = await Application.deleteMany(
        { userId: clientId },
        { session }
      );
      console.log(`Deleted ${deletedApplications.deletedCount} applications`);

      // 6. Finally, delete the client user
      const deletedClient = await User.findByIdAndDelete(clientId, { session });
      console.log(`Deleted client: ${deletedClient.fullName}`);

      // Commit the transaction
      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: "Client and all associated data deleted successfully",
        data: {
          deletedClient: {
            id: deletedClient._id,
            name: deletedClient.fullName,
            email: deletedClient.email
          },
          deletedApplications: deletedApplications.deletedCount,
          deletedDocuments: applicationIds.length > 0 ? "All related documents" : 0,
          deletedTimelineEntries: applicationIds.length > 0 ? "All related timeline entries" : 0,
          deletedPayments: applicationIds.length > 0 ? "All related payments" : 0
        }
      });

    } catch (transactionError) {
      // If anything fails, rollback the transaction
      await session.abortTransaction();
      throw transactionError;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error("Delete Client Error:", error);
    
    // Handle specific error types
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    });
  }
};
