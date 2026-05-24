"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Search, MessageSquare, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRefreshUnreadMessages } from "@/app/contexts/UnreadMessagesContext";
import { useRealtimeMessaging } from "@/app/contexts/RealtimeMessagingContext";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  vendorId: string;
  coupleId: string;
  vendorName: string;
  vendorBusinessName: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
  isVirtual?: boolean;
}

export default function CoupleMessagesClient({ userId }: { userId: string }) {
  const searchParams = useSearchParams();
  const vendorIdParam = searchParams.get('vendorId');
  const refreshUnreadMessages = useRefreshUnreadMessages();
  const { subscribeToConversation, unsubscribeFromConversation, messages: realtimeMessages } = useRealtimeMessaging();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Define displayMessages before useEffect
  const activeConversation = conversations.find((c) => c.id === selectedConversation);
  const displayMessages = realtimeMessages.get(selectedConversation || "") || activeConversation?.messages || [];

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (vendorIdParam && conversations.length > 0) {
      const conversation = conversations.find(c => c.vendorId === vendorIdParam);
      if (conversation) {
        setSelectedConversation(conversation.id);
      }
    }
  }, [vendorIdParam, conversations]);

  // Subscribe to real-time updates when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      subscribeToConversation(selectedConversation);
      markMessagesAsRead(selectedConversation);
      setShouldAutoScroll(true);
      return () => {
        unsubscribeFromConversation(selectedConversation);
      };
    }
  }, [selectedConversation, subscribeToConversation, unsubscribeFromConversation]);

  // Auto-scroll when messages update
  useEffect(() => {
    if (shouldAutoScroll) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [displayMessages, shouldAutoScroll]);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  };

  const markMessagesAsRead = async (conversationId: string) => {
    try {
      await fetch(`/api/messages?conversationId=${conversationId}`);
      await refreshUnreadMessages();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        await refreshUnreadMessages();
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      const conversation = conversations.find((c) => c.id === selectedConversation);
      if (!conversation) {
        toast.error("Conversation not found");
        return;
      }

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId: conversation.vendorId,
          coupleId: conversation.coupleId,
          content: messageText.trim(),
        }),
      });

      if (res.ok) {
        setMessageText("");
        setShouldAutoScroll(true);
        await fetchConversations();
        toast.success("Message sent");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.vendorBusinessName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Conversations List */}
      <div className={`w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-charcoal mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No conversations yet</p>
              <p className="text-gray-400 text-xs mt-1">Book a vendor to start chatting</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-sand/20 transition-colors text-left ${
                  selectedConversation === conv.id ? "bg-sand/30" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-charcoal truncate">{conv.vendorBusinessName}</h3>
                  <div className="flex items-center gap-2">
                    {conv.unreadCount > 0 && (
                      <span className="bg-burgundy text-white text-xs px-2 py-0.5 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                    {conv.isVirtual && (
                      <span className="text-xs text-gray-400">New</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {conv.messages?.length > 0
                    ? conv.messages[conv.messages.length - 1]?.content
                    : "No messages yet - Start a conversation"}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Conversation View */}
      <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        {selectedConversation && activeConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden text-gray-500 hover:text-charcoal"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-charcoal">
                {activeConversation.vendorBusinessName}
              </h2>
            </div>

            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {displayMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs mt-1">Start the conversation below</p>
                  </div>
                </div>
              ) : (
                displayMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.senderId === userId
                          ? "bg-burgundy text-white"
                          : "bg-gray-100 text-charcoal"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.senderId === userId ? "text-white/70" : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  disabled={sending}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim() || sending}
                  className="px-4 md:px-6 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span className="hidden md:inline">Send</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
