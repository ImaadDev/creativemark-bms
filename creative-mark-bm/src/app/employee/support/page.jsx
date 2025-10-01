"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import ConversationList from "../../../components/message/ConversationList";
import MessageList from "../../../components/message/MessageList";
import MessageInput from "../../../components/message/MessageInput";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function EmployeeSupport() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages([]);
    setIsMobileMenuOpen(false);
  };

  const handleMessageSent = (newMessage) => {
    setMessages(prev => [...prev, newMessage]);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="flex flex-col items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-xl max-w-sm sm:max-w-md w-full">
          <LoadingSpinner />
          <p className="text-gray-600 font-medium text-sm sm:text-base text-center">Loading your support dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      {/* Modern Header */}
      <div className="bg-white border border-gray-200 shadow-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.188 8.188 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01z"/>
                </svg>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-gray-800 font-bold text-lg sm:text-xl lg:text-2xl truncate">Client Support</h1>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">Manage client communications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] lg:h-[calc(100vh-160px)]">
        {/* Conversations Sidebar */}
        <div className="w-full sm:w-80 lg:w-96 h-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl">
          <ConversationList 
            onSelectConversation={handleSelectConversation}
            selectedApplicationId={selectedConversation?.applicationId}
          />
        </div>

        {/* Messages Area */}
        <div className="flex-1 h-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl">
          {selectedConversation ? (
            <div className="flex flex-col h-full">
              {/* Conversation Header */}
              <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {selectedConversation.conversationPartner?.fullName || 'Unknown Client'}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.conversationPartner?.email || 'No email'} • {selectedConversation.application?.serviceType || 'Unknown Service'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedConversation.application?.status === "approved" 
                        ? "bg-green-100 text-green-800"
                        : selectedConversation.application?.status === "under_review"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {selectedConversation.application?.status?.replace("_", " ") || 'Unknown Status'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
                      <div className="flex-1 overflow-hidden flex flex-col">
                        <MessageList 
                          applicationId={selectedConversation.applicationId}
                          currentUserId={user.id}
                        />
                      </div>

              {/* Message Input */}
              <div className="p-3 sm:p-4 lg:p-6 border-t border-gray-200 bg-white">
                <MessageInput
                  applicationId={selectedConversation.applicationId}
                  onMessageSent={handleMessageSent}
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-gradient-to-b from-gray-50/50 to-white/50">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Conversation</h3>
                <p className="text-gray-500">Choose a client conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}