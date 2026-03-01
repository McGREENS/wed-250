"use client";

import { useState } from "react";
import VendorFlexLayout from '@/app/components/vendor/VendorFlexLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Search, Send, Paperclip, Archive, Trash2, Star, MoreVertical } from "lucide-react";

export default function VendorMessagesPage() {
    const [selectedConversation, setSelectedConversation] = useState(1);
    const [replyText, setReplyText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const conversations = [
        {
            id: 1,
            name: "Sarah Johnson",
            avatar: "SJ",
            lastMessage: "Thank you! Can we schedule a call to discuss the timeline?",
            timestamp: "10:30 AM",
            unread: 2,
            starred: true,
            status: "active"
        },
        {
            id: 2,
            name: "Michael Chen",
            avatar: "MC",
            lastMessage: "I'd like to add drone videography to our package",
            timestamp: "Yesterday",
            unread: 1,
            starred: false,
            status: "active"
        },
        {
            id: 3,
            name: "Emma Williams",
            avatar: "EW",
            lastMessage: "Perfect! We're excited to work with you",
            timestamp: "2 days ago",
            unread: 0,
            starred: false,
            status: "active"
        },
        {
            id: 4,
            name: "David Brown",
            avatar: "DB",
            lastMessage: "What's your availability for December 15th?",
            timestamp: "3 days ago",
            unread: 0,
            starred: true,
            status: "active"
        },
        {
            id: 5,
            name: "Jessica Taylor",
            avatar: "JT",
            lastMessage: "Could you send me your portfolio?",
            timestamp: "Oct 15",
            unread: 0,
            starred: false,
            status: "archived"
        }
    ];

    const messages = [
        {
            id: 1,
            sender: "Sarah Johnson",
            text: "Hi! I'm interested in booking your photography services for our wedding on June 15, 2025.",
            timestamp: "Oct 20, 9:15 AM",
            isVendor: false
        },
        {
            id: 2,
            sender: "You",
            text: "Hello Sarah! Thank you for reaching out. I'd love to be part of your special day. June 15th is available. What package are you interested in?",
            timestamp: "Oct 20, 9:45 AM",
            isVendor: true
        },
        {
            id: 3,
            sender: "Sarah Johnson",
            text: "We're looking at the Full Day Coverage package. We'll have about 150 guests at Kigali Serena Hotel.",
            timestamp: "Oct 20, 10:00 AM",
            isVendor: false
        },
        {
            id: 4,
            sender: "You",
            text: "Perfect! The Full Day package includes 10 hours of coverage and 500+ edited photos. For Serena Hotel, I'd also recommend adding a second photographer to capture different angles. Would you like me to send you a detailed quote?",
            timestamp: "Oct 20, 10:15 AM",
            isVendor: true
        },
        {
            id: 5,
            sender: "Sarah Johnson",
            text: "Yes please! And yes, let's add the second photographer. Thank you! Can we schedule a call to discuss the timeline?",
            timestamp: "Oct 20, 10:30 AM",
            isVendor: false
        }
    ];

    const handleSendMessage = () => {
        if (replyText.trim()) {
            console.log("Sending message:", replyText);
            setReplyText("");
        }
    };

    const filteredConversations = conversations.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) && c.status === "active"
    );

    return (
        <VendorFlexLayout>
                {/* Conversations List */}
                <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
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
                        {filteredConversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv.id)}
                                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                                    selectedConversation === conv.id ? "bg-burgundy/5 border-l-4 border-l-burgundy" : "hover:bg-gray-50"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-semibold text-burgundy">{conv.avatar}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-charcoal truncate">{conv.name}</h3>
                                            <div className="flex items-center gap-2">
                                                {conv.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                                <span className="text-xs text-gray-500">{conv.timestamp}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                                            {conv.unread > 0 && (
                                                <Badge className="bg-burgundy text-white ml-2">{conv.unread}</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conversation View */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-burgundy">
                                    {conversations.find(c => c.id === selectedConversation)?.avatar}
                                </span>
                            </div>
                            <div>
                                <h2 className="font-semibold text-charcoal">
                                    {conversations.find(c => c.id === selectedConversation)?.name}
                                </h2>
                                <p className="text-xs text-gray-500">Active now</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                                <Star className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Archive className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-cream/30">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.isVendor ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-lg ${msg.isVendor ? "order-2" : "order-1"}`}>
                                    <div
                                        className={`rounded-2xl px-4 py-3 ${
                                            msg.isVendor
                                                ? "bg-burgundy text-white rounded-br-none"
                                                : "bg-white border border-gray-200 text-charcoal rounded-bl-none"
                                        }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                    </div>
                                    <p className={`text-xs text-gray-500 mt-1 ${msg.isVendor ? "text-right" : "text-left"}`}>
                                        {msg.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reply Box */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex items-end gap-3">
                            <Button variant="ghost" size="sm" className="mb-2">
                                <Paperclip className="w-5 h-5 text-gray-500" />
                            </Button>
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
                                disabled={!replyText.trim()}
                                className="bg-burgundy hover:bg-burgundy-light text-white mb-2"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Send
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
                    </div>
                </div>
        </VendorFlexLayout>
    );
}
