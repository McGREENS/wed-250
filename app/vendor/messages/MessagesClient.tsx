"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Search, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VendorMessagesClient() {
    const { data: session } = useSession();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [replyText, setReplyText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch conversations
    useEffect(() => {
        fetchConversations();
    }, []);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedConversation, conversations]);

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/messages');
            if (res.ok) {
                const data = await res.json();
                setConversations(data.conversations || []);
                if (data.conversations?.length > 0 && !selectedConversation) {
                    setSelectedConversation(data.conversations[0].id);
                }
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
            toast.error('Failed to load conversations');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!replyText.trim() || !selectedConversation) return;

        setSending(true);
        try {
            const conversation = conversations.find(c => c.id === selectedConversation);
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendorId: conversation.vendorId,
                    coupleId: conversation.coupleId,
                    content: replyText.trim(),
                }),
            });

            if (res.ok) {
                setReplyText("");
                await fetchConversations();
            } else {
                toast.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const filteredConversations = conversations.filter(c =>
        (c.coupleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         c.vendorBusinessName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const selectedConv = conversations.find(c => c.id === selectedConversation);
    const selectedMessages = selectedConv?.messages || [];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-200px)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Conversations List */}
            <div className="w-96 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-charcoal mb-4">Messages</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search conversations..."
                            className="pl-10 border-gray-200"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p className="text-sm">No conversations yet</p>
                            <p className="text-xs mt-1">Messages from couples will appear here</p>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => {
                            const displayName = conv.coupleName || conv.vendorBusinessName || 'Unknown';
                            const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
                            const lastMessage = conv.messages?.length > 0 
                                ? conv.messages[conv.messages.length - 1]?.content 
                                : 'No messages yet - Start a conversation';
                            
                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelectedConversation(conv.id)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                                        selectedConversation === conv.id ? "bg-burgundy/5 border-l-4 border-l-burgundy" : "hover:bg-gray-50"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-semibold text-burgundy">{initials}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold text-charcoal truncate">{displayName}</h3>
                                                <div className="flex items-center gap-2">
                                                    {conv.isVirtual && (
                                                        <span className="text-xs text-gray-400">New</span>
                                                    )}
                                                    {conv.lastMessageAt && (
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(conv.lastMessageAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600 truncate">
                                                    {lastMessage}
                                                </p>
                                                {conv.unreadCount > 0 && (
                                                    <Badge className="bg-burgundy text-white ml-2">{conv.unreadCount}</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Conversation View */}
            <div className="flex-1 flex flex-col">
                {selectedConv ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold text-burgundy">
                                        {(selectedConv.coupleName || selectedConv.vendorName || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-charcoal">
                                        {selectedConv.coupleName || selectedConv.vendorBusinessName || 'Unknown'}
                                    </h2>
                                    <p className="text-xs text-gray-500">{selectedConv.coupleEmail || ''}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-cream/30">
                            {selectedMessages.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <p className="text-sm">No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                selectedMessages.map((msg: any) => {
                                    const isCurrentUser = msg.senderId === session?.user?.id;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className={`max-w-lg ${isCurrentUser ? "order-2" : "order-1"}`}>
                                                <div
                                                    className={`rounded-2xl px-4 py-3 ${
                                                        isCurrentUser
                                                            ? "bg-burgundy text-white rounded-br-none"
                                                            : "bg-white border border-gray-200 text-charcoal rounded-bl-none"
                                                    }`}
                                                >
                                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                                </div>
                                                <p className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
                                                    {new Date(msg.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Reply Box */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex items-end gap-3">
                                <Textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your message..."
                                    rows={3}
                                    className="flex-1 resize-none border-gray-200"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!replyText.trim() || sending}
                                    className="bg-burgundy hover:bg-burgundy-light text-white mb-2"
                                >
                                    {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                    Send
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p className="text-sm">Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
