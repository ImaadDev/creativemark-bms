import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

// Create ticket (Client)
export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, category, tags } = req.body;

    const ticket = await Ticket.create({
      userId: req.user.id,
      title,
      description,
      priority,
      category,
      tags,
    });

    res.status(201).json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all tickets (Admin)
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("userId", "name email")
      .populate("assignedTo", "name email");
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get my tickets (Client/Employee)
export const getMyTickets = async (req, res) => {
  try {
    const query =
      req.user.role === "employee"
        ? { assignedTo: req.user.id }
        : { userId: req.user.id };

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email");
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Assign ticket to employee (Admin)
export const assignTicket = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Forbidden" });

    const { employeeId } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedTo: employeeId, status: "in_progress" },
      { new: true }
    );

    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update ticket status (Employee/Admin)
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["open", "in_progress", "resolved", "closed"];

    if (!allowedStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete ticket (Admin only)
export const deleteTicket = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Forbidden" });

    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    res.json({ success: true, message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
