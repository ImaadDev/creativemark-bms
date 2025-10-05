"use client";
import { useEffect, useState } from "react";
import { X, Search, Clock, CheckCircle, AlertCircle, User, Users, ChevronDown, Edit2, Trash2, Eye, Loader2 } from "lucide-react";
import { getAllTickets, deleteTicket } from '../../../services/ticketService';
import { getAllEmployees } from "../../../services/employeeApi";
import api from '../../../services/api';
import Swal from 'sweetalert2';

export default function AdminTicketDashboard() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAssignDropdown, setShowAssignDropdown] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigningTicket, setAssigningTicket] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deletingTicket, setDeletingTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await getAllTickets();
        if (response.success) {
          setTickets(response.tickets || []);
        } else {
          setError(response.message || 'Failed to load tickets');
        }
      } catch (err) {
        setError('Failed to load tickets');
        console.error('Error loading tickets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees();
        if (response.success) {
          setEmployees(response.data || []);
        }
      } catch (err) {
        console.error('Error loading employees:', err);
      }
    };
    fetchEmployees();
  }, []);
  

  const handleAssignEmployee = async (ticketId, employee) => {
    try {
      setAssigningTicket(ticketId);
      
      const response = await api.patch(`/tickets/${ticketId}/assign`, {
        employeeId: employee._id
      });
      
      if (response.data.success) {
        // Update the ticket in the list
        setTickets(tickets.map(ticket => 
          ticket._id === ticketId ? { ...ticket, assignedTo: employee, status: 'in_progress' } : ticket
        ));
        
        // Update selected ticket if it's the same one
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket({...selectedTicket, assignedTo: employee, status: 'in_progress'});
        }
        
        setShowAssignDropdown(null);
        
        // Show success alert
        Swal.fire({
          title: 'Success!',
          text: `Ticket assigned to ${employee.name || employee.fullName}`,
          icon: 'success',
          confirmButtonColor: '#242021',
          confirmButtonText: 'OK',
          background: '#fff',
          color: '#242021',
          customClass: {
            confirmButton: 'bg-[#242021] hover:bg-[#3a3537] text-[#ffd17a] px-6 py-2 rounded-lg font-medium transition-colors',
            title: 'text-[#242021] font-bold',
            content: 'text-gray-700'
          }
        });
      }
    } catch (err) {
      console.error('Error assigning ticket:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to assign ticket',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'OK',
        background: '#fff',
        color: '#242021',
        customClass: {
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors',
          title: 'text-[#242021] font-bold',
          content: 'text-gray-700'
        }
      });
    } finally {
      setAssigningTicket(null);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      setUpdatingStatus(ticketId);
      
      const response = await api.patch(`/tickets/${ticketId}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        // Update the ticket in the list
        setTickets(tickets.map(ticket => 
          ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
        ));
        
        // Update selected ticket if it's the same one
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket({...selectedTicket, status: newStatus});
        }
        
        // Show success alert
        Swal.fire({
          title: 'Updated!',
          text: `Ticket status changed to ${newStatus.replace('_', ' ')}`,
          icon: 'success',
          confirmButtonColor: '#242021',
          confirmButtonText: 'OK',
          background: '#fff',
          color: '#242021',
          customClass: {
            confirmButton: 'bg-[#242021] hover:bg-[#3a3537] text-[#ffd17a] px-6 py-2 rounded-lg font-medium transition-colors',
            title: 'text-[#242021] font-bold',
            content: 'text-gray-700'
          }
        });
      }
    } catch (err) {
      console.error('Error updating status:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update ticket status',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'OK',
        background: '#fff',
        color: '#242021',
        customClass: {
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors',
          title: 'text-[#242021] font-bold',
          content: 'text-gray-700'
        }
      });
    } finally {
      setUpdatingStatus(null);
    }
  };


  const handleDeleteTicket = async (ticketId) => {
    const ticket = tickets.find(t => t._id === ticketId);
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete ticket "${ticket?.title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#fff',
      color: '#242021',
      customClass: {
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors',
        cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors',
        title: 'text-[#242021] font-bold',
        content: 'text-gray-700'
      }
    });

    if (result.isConfirmed) {
      try {
        setDeletingTicket(ticketId);
        
        const response = await deleteTicket(ticketId);
        if (response.success) {
          setTickets(tickets.filter(ticket => ticket._id !== ticketId));
          setIsDetailsOpen(false);
          
          Swal.fire({
            title: 'Deleted!',
            text: 'Ticket has been deleted successfully.',
            icon: 'success',
            confirmButtonColor: '#242021',
            confirmButtonText: 'OK',
            background: '#fff',
            color: '#242021',
            customClass: {
              confirmButton: 'bg-[#242021] hover:bg-[#3a3537] text-[#ffd17a] px-6 py-2 rounded-lg font-medium transition-colors',
              title: 'text-[#242021] font-bold',
              content: 'text-gray-700'
            }
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: response.message || 'Failed to delete ticket',
            icon: 'error',
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'OK',
            background: '#fff',
            color: '#242021',
            customClass: {
              confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors',
              title: 'text-[#242021] font-bold',
              content: 'text-gray-700'
            }
          });
        }
      } catch (err) {
        console.error('Error deleting ticket:', err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete ticket',
          icon: 'error',
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'OK',
          background: '#fff',
          color: '#242021',
          customClass: {
            confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors',
            title: 'text-[#242021] font-bold',
            content: 'text-gray-700'
          }
        });
      } finally {
        setDeletingTicket(null);
      }
    }
  };

  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsOpen(true);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesFilter = filter === "all" || ticket.status === filter;
    const customerName = ticket.userId?.name || ticket.userId?.fullName || 'Unknown';
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    all: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    in_progress: tickets.filter(t => t.status === "in_progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
    unassigned: tickets.filter(t => !t.assignedTo).length,
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "urgent": return "from-red-500 to-red-600";
      case "high": return "from-orange-500 to-orange-600";
      case "medium": return "from-amber-500 to-amber-600";
      case "low": return "from-emerald-500 to-emerald-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "open": return "bg-orange-50 text-orange-700 border-orange-200";
      case "in_progress": return "bg-blue-50 text-blue-700 border-blue-200";
      case "resolved": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case "in_progress": return "In Progress";
      case "open": return "Open";
      case "resolved": return "Resolved";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="mb-8 md:mb-12">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-[#242021] mb-2 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-base md:text-lg">Manage tickets, assign employees, and track progress</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`p-4 md:p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                filter === "all" 
                  ? "bg-gradient-to-br from-[#242021] to-[#3a3537] text-[#ffd17a] shadow-xl" 
                  : "bg-white hover:bg-gray-50 text-gray-700 shadow-lg border border-gray-200"
              }`}
            >
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.all}</div>
              <div className="text-xs md:text-sm opacity-80">All Tickets</div>
            </button>

            <button
              onClick={() => setFilter("open")}
              className={`p-4 md:p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                filter === "open" 
                  ? "bg-gradient-to-br from-[#242021] to-[#3a3537] text-[#ffd17a] shadow-xl" 
                  : "bg-white hover:bg-gray-50 text-gray-700 shadow-lg border border-gray-200"
              }`}
            >
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.open}</div>
              <div className="text-xs md:text-sm opacity-80">Open</div>
            </button>

            <button
              onClick={() => setFilter("in_progress")}
              className={`p-4 md:p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                filter === "in_progress" 
                  ? "bg-gradient-to-br from-[#242021] to-[#3a3537] text-[#ffd17a] shadow-xl" 
                  : "bg-white hover:bg-gray-50 text-gray-700 shadow-lg border border-gray-200"
              }`}
            >
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.in_progress}</div>
              <div className="text-xs md:text-sm opacity-80">In Progress</div>
            </button>

            <button
              onClick={() => setFilter("resolved")}
              className={`p-4 md:p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                filter === "resolved" 
                  ? "bg-gradient-to-br from-[#242021] to-[#3a3537] text-[#ffd17a] shadow-xl" 
                  : "bg-white hover:bg-gray-50 text-gray-700 shadow-lg border border-gray-200"
              }`}
            >
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.resolved}</div>
              <div className="text-xs md:text-sm opacity-80">Resolved</div>
            </button>

            <div className="col-span-2 sm:col-span-3 lg:col-span-1 p-4 md:p-6 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl">
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.unassigned}</div>
              <div className="text-xs md:text-sm opacity-90">Unassigned</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by ticket title, customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-gray-800 pl-14 pr-6 py-4 md:py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#242021] placeholder-gray-400 shadow-lg border border-gray-200"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#242021] to-[#3a3537] text-[#ffd17a]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">Ticket</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">Assigned To</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#242021] mx-auto mb-4"></div>
                      <p className="text-gray-500 text-lg">Loading tickets...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <AlertCircle size={48} className="mx-auto mb-4 text-red-300" />
                      <p className="text-red-500 text-lg">{error}</p>
                    </td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 text-lg">No tickets found</p>
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${getPriorityColor(ticket.priority)}`}></div>
                          <div>
                            <div className="font-semibold text-gray-900 mb-1">{ticket.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{ticket.description}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {ticket.userId?.name || ticket.userId?.fullName || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ticket.userId?.email || ''}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-gray-100 text-gray-700 border border-gray-200">
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <select
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                            disabled={updatingStatus === ticket._id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#242021] ${getStatusBadge(ticket.status)} ${updatingStatus === ticket._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                          {updatingStatus === ticket._id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                              <Loader2 className="h-4 w-4 animate-spin text-[#242021]" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          {ticket.assignedTo ? (
                            <button
                              onClick={() => setShowAssignDropdown(showAssignDropdown === ticket._id ? null : ticket._id)}
                              disabled={assigningTicket === ticket._id}
                              className={`flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200 ${assigningTicket === ticket._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {assigningTicket === ticket._id ? (
                                <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                                  {(ticket.assignedTo.name || ticket.assignedTo.fullName || 'U').charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="text-xs font-medium">
                                {ticket.assignedTo?.name?.split(' ')[0] || ticket.assignedTo?.fullName?.split(' ')[0] || 'U'}
                              </span>
                              <ChevronDown size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setShowAssignDropdown(showAssignDropdown === ticket._id ? null : ticket._id)}
                              disabled={assigningTicket === ticket._id}
                              className={`flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200 ${assigningTicket === ticket._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {assigningTicket === ticket._id ? (
                                <Loader2 className="h-4 w-4 animate-spin text-orange-700" />
                              ) : (
                                <User size={14} />
                              )}
                              <span className="text-xs font-medium">Assign</span>
                              <ChevronDown size={14} />
                            </button>
                          )}
                          
                          {showAssignDropdown === ticket._id && (
                            <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 min-w-[200px]">
                              {employees.map((employee) => (
                                <button
                                  key={employee._id}
                                  onClick={() => handleAssignEmployee(ticket._id, employee)}
                                  disabled={assigningTicket === ticket._id}
                                  className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${assigningTicket === ticket._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                    {(employee.name || employee.fullName || 'E').charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">{employee.name || employee.fullName}</div>
                                    <div className="text-xs text-gray-500">{employee.email}</div>
                                  </div>
                                  {assigningTicket === ticket._id && (
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openTicketDetails(ticket)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteTicket(ticket._id)}
                            disabled={deletingTicket === ticket._id}
                            className={`p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 ${deletingTicket === ticket._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Delete Ticket"
                          >
                            {deletingTicket === ticket._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isDetailsOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-[#242021] to-[#3a3537] p-6 md:p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#ffd17a] mb-2">{selectedTicket.title}</h2>
                  <p className="text-[#ffd17a]/70 text-sm">Ticket #{selectedTicket._id} • Created {new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="text-[#ffd17a]/70 hover:text-[#ffd17a] transition-colors p-2 hover:bg-white/10 rounded-xl"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
               

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <p className="p-4 bg-gray-50 rounded-xl text-gray-700 border border-gray-200">
                    {selectedTicket.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                    <span className="inline-block px-4 py-2 rounded-xl text-sm font-semibold capitalize bg-gray-100 text-gray-700 border border-gray-200">
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <span className="inline-block px-4 py-2 rounded-xl text-sm font-semibold capitalize bg-gray-100 text-gray-700 border border-gray-200">
                      {selectedTicket.category}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <div className="relative">
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => {
                        handleStatusChange(selectedTicket._id, e.target.value);
                        setSelectedTicket({...selectedTicket, status: e.target.value});
                      }}
                      disabled={updatingStatus === selectedTicket._id}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-[#242021] ${getStatusBadge(selectedTicket.status)} ${updatingStatus === selectedTicket._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    {updatingStatus === selectedTicket._id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                        <Loader2 className="h-5 w-5 animate-spin text-[#242021]" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Employee</label>
                  {selectedTicket.assignedTo ? (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                        {(selectedTicket.assignedTo.name || selectedTicket.assignedTo.fullName || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{selectedTicket.assignedTo.name || selectedTicket.assignedTo.fullName}</div>
                        <div className="text-sm text-gray-600">{selectedTicket.assignedTo.email}</div>
                      </div>
                      <button
                        onClick={() => setShowAssignDropdown(showAssignDropdown === 'modal' ? null : 'modal')}
                        disabled={assigningTicket === selectedTicket._id}
                        className={`px-4 py-2 bg-white text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-colors border border-emerald-300 ${assigningTicket === selectedTicket._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {assigningTicket === selectedTicket._id ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Changing...
                          </div>
                        ) : (
                          'Change'
                        )}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAssignDropdown(showAssignDropdown === 'modal' ? null : 'modal')}
                      disabled={assigningTicket === selectedTicket._id}
                      className={`w-full p-4 bg-orange-50 text-orange-700 rounded-xl font-semibold hover:bg-orange-100 transition-colors border border-orange-200 flex items-center justify-center gap-2 ${assigningTicket === selectedTicket._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {assigningTicket === selectedTicket._id ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Assigning...
                        </>
                      ) : (
                        <>
                          <User size={20} />
                          Assign Employee
                        </>
                      )}
                    </button>
                  )}
                  
                  {showAssignDropdown === 'modal' && (
                    <div className="mt-4 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                              {employees.map((employee) => (
                                <button
                                  key={employee._id}
                                  onClick={() => {
                                    handleAssignEmployee(selectedTicket._id, employee);
                                    setSelectedTicket({...selectedTicket, assignedTo: employee});
                                    setShowAssignDropdown(null);
                                  }}
                                  disabled={assigningTicket === selectedTicket._id}
                                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${assigningTicket === selectedTicket._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                    {(employee.name || employee.fullName || 'E').charAt(0).toUpperCase()}
                                  </div>
                                  <div className="text-left flex-1">
                                    <div className="text-sm font-semibold text-gray-900">{employee.name || employee.fullName}</div>
                                    <div className="text-xs text-gray-500">{employee.email}</div>
                                  </div>
                                  {assigningTicket === selectedTicket._id && (
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                                  )}
                                </button>
                              ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTicket.tags && selectedTicket.tags.length > 0 ? (
                      selectedTicket.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No tags assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}