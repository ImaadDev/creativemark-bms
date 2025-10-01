"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import ConversationList from "../../../components/message/ConversationList";
import MessageList from "../../../components/message/MessageList";
import MessageInput from "../../../components/message/MessageInput";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function Support() {
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
              <h1 className="text-gray-800 font-bold text-lg sm:text-xl lg:text-2xl truncate">Support</h1>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">Message your team</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
            <button className="p-2 sm:p-2.5 lg:p-3 hover:bg-gray-100 rounded-xl sm:rounded-2xl transition-all duration-200 group">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 sm:p-2.5 lg:p-3 hover:bg-gray-100 rounded-xl sm:rounded-2xl transition-all duration-200 group">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] lg:h-[calc(100vh-160px)]">
        {/* Conversations Sidebar */}
        <div className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative z-30 w-full sm:w-80 lg:w-96 h-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl transition-all duration-300 ease-in-out shadow-2xl`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-800 font-bold text-lg sm:text-xl">Conversations</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-xl sm:rounded-2xl transition-all duration-200 group"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-500 rounded-xl sm:rounded-2xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              <ConversationList
                onSelectConversation={handleSelectConversation}
                selectedApplicationId={selectedConversation?.applicationId}
              />
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                    <button 
                      onClick={() => setIsMobileMenuOpen(true)}
                      className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-200 rounded-xl sm:rounded-2xl transition-all duration-200 group flex-shrink-0"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm sm:text-base lg:text-lg">
                          {selectedConversation.conversationPartner?.fullName?.charAt(0) || "S"}
                        </span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-800 font-bold text-sm sm:text-base lg:text-lg truncate">
                        {selectedConversation.conversationPartner?.fullName || "Support Team"}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
                        <span className="truncate capitalize">{selectedConversation.application.serviceType.replace('_', ' ')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className={`text-xs sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl font-semibold ${
                      selectedConversation.application.status === 'completed' 
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : selectedConversation.application.status === 'in_process'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : selectedConversation.application.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`}>
                      {typeof selectedConversation.application.status === 'object' 
                        ? selectedConversation.application.status.current?.replace('_', ' ') || 'Unknown'
                        : selectedConversation.application.status?.replace('_', ' ') || 'Unknown'
                      }
                    </span>
                    
                    <button className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-xl sm:rounded-2xl transition-all duration-200 group">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-hidden">
                <MessageList
                  applicationId={selectedConversation.applicationId}
                  currentUserId={user.id}
                />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 bg-gray-50">
                <MessageInput
                  applicationId={selectedConversation.applicationId}
                  onMessageSent={handleMessageSent}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
              <div className="text-center max-w-sm sm:max-w-md lg:max-w-lg">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl sm:rounded-3xl flex items-center justify-center border border-green-200 shadow-2xl">
                  <svg className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Select a Conversation</h3>
                <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base">
                  Choose a conversation from the list to start messaging with your assigned team member.
                </p>
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                  View Conversations
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 4px;
          border: 1px solid rgba(156, 163, 175, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: rgba(34, 197, 94, 0.6);
        }
      `}</style>
    </div>
  );
}