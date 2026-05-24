"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

interface RealtimeMessage {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  createdAt: string;
}

interface RealtimeMessagingContextType {
  messages: Map<string, RealtimeMessage[]>;
  addMessage: (conversationId: string, message: RealtimeMessage) => void;
  subscribeToConversation: (conversationId: string) => void;
  unsubscribeFromConversation: (conversationId: string) => void;
  isConnected: boolean;
  refreshMessages: (conversationId: string) => Promise<void>;
}

const RealtimeMessagingContext = createContext<RealtimeMessagingContextType | undefined>(undefined);

export function RealtimeMessagingProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Map<string, RealtimeMessage[]>>(new Map());
  const [isConnected, setIsConnected] = useState(true);
  const [subscribedConversations, setSubscribedConversations] = useState<Set<string>>(new Set());
  const [pollIntervals, setPollIntervals] = useState<Map<string, NodeJS.Timeout>>(new Map());

  const refreshMessages = useCallback(async (conversationId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        const messages = data.messages || [];
        
        setMessages((prev) => {
          const newMessages = new Map(prev);
          newMessages.set(conversationId, messages);
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error refreshing messages:", error);
    }
  }, []);

  const subscribeToConversation = useCallback((conversationId: string) => {
    setSubscribedConversations((prev) => {
      const newSet = new Set(prev);
      if (!newSet.has(conversationId)) {
        newSet.add(conversationId);
        
        // Start polling for this conversation
        const interval = setInterval(() => {
          refreshMessages(conversationId);
        }, 1000); // Poll every 1 second for real-time feel

        setPollIntervals((prev) => {
          const newIntervals = new Map(prev);
          newIntervals.set(conversationId, interval);
          return newIntervals;
        });

        // Initial fetch
        refreshMessages(conversationId);
      }
      return newSet;
    });
  }, [refreshMessages]);

  const unsubscribeFromConversation = useCallback((conversationId: string) => {
    setSubscribedConversations((prev) => {
      const newSet = new Set(prev);
      newSet.delete(conversationId);
      return newSet;
    });

    // Clear polling interval
    setPollIntervals((prev) => {
      const newIntervals = new Map(prev);
      const interval = newIntervals.get(conversationId);
      if (interval) {
        clearInterval(interval);
        newIntervals.delete(conversationId);
      }
      return newIntervals;
    });
  }, []);

  const addMessage = useCallback((conversationId: string, message: RealtimeMessage) => {
    setMessages((prev) => {
      const newMessages = new Map(prev);
      const convMessages = newMessages.get(conversationId) || [];
      
      // Avoid duplicates
      if (!convMessages.find((m) => m.id === message.id)) {
        newMessages.set(conversationId, [...convMessages, message]);
      }
      return newMessages;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pollIntervals.forEach((interval) => clearInterval(interval));
    };
  }, [pollIntervals]);

  return (
    <RealtimeMessagingContext.Provider
      value={{
        messages,
        addMessage,
        subscribeToConversation,
        unsubscribeFromConversation,
        isConnected,
        refreshMessages,
      }}
    >
      {children}
    </RealtimeMessagingContext.Provider>
  );
}

export function useRealtimeMessaging() {
  const context = useContext(RealtimeMessagingContext);
  if (!context) {
    throw new Error("useRealtimeMessaging must be used within RealtimeMessagingProvider");
  }
  return context;
}
