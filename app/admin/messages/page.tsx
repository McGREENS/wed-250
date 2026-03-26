"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '../AdminLayout';
import {
    Mail,
    Phone,
    User,
    Calendar,
    Trash2,
    Eye,
    Check,
    X,
    Search,
    Filter,
    Send,
    Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { toast } from 'sonner';

export default function AdminMessagesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<any[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;
        
        if (!session?.user || session.user.role !== 'ADMIN') {
            router.push('/login');
            return;
        }

        fetchMessages();
    }, [session, status, router]);

    useEffect(() => {
        filterMessages();
    }, [messages, searchQuery, statusFilter]);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/contact');
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages.reverse());
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterMessages = () => {
        let filtered = [...messages];

        if (searchQuery) {
            filtered = filtered.filter(m => 
                m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.subject?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(m => m.status === statusFilter);
        }

        setFilteredMessages(filtered);
    };

    const handleUpdateStatus = async (messageId: string, status: string) => {
        try {
            const res = await fetch('/api/contact', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageId, status }),
            });

            if (res.ok) {
                toast.success('Status updated');
                await fetchMessages();
                if (selectedMessage?.id === messageId) {
                    setSelectedMessage({ ...selectedMessage, status });
                }
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const res = await fetch(`/api/contact?messageId=${messageId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Message deleted');
                await fetchMessages();
                if (selectedMessage?.id === messageId) {
                    setSelectedMessage(null);
                }
            }
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    const openMessage = async (message: any) => {
        setSelectedMessage(message);
        setReplyMessage('');
        if (message.status === 'UNREAD') {
            await handleUpdateStatus(message.id, 'READ');
        }
    };

    const handleSendReply = async () => {
        if (!replyMessage.trim() || !selectedMessage) return;

        setSendingReply(true);
        try {
            const res = await fetch('/api/contact/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messageId: selectedMessage.id,
                    recipientEmail: selectedMessage.email,
                    recipientName: selectedMessage.name,
                    subject: selectedMessage.subject || 'Your message',
                    replyMessage,
                }),
            });

            if (res.ok) {
                toast.success('Reply sent successfully');
                await handleUpdateStatus(selectedMessage.id, 'REPLIED');
                setSelectedMessage({ ...selectedMessage, status: 'REPLIED' });
                setShowReplyModal(false);
                setReplyMessage('');
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to send reply');
            }
        } catch (error) {
            toast.error('Failed to send reply');
        } finally {
            setSendingReply(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading messages...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const statusColors: any = {
        UNREAD: 'bg-blue-100 text-blue-800',
        READ: 'bg-gray-100 text-gray-800',
        REPLIED: 'bg-green-100 text-green-800',
    };

    const stats = {
        total: messages.length,
        unread: messages.filter(m => m.status === 'UNREAD').length,
        read: messages.filter(m => m.status === 'READ').length,
        replied: messages.filter(m => m.status === 'REPLIED').length,
    };

    return (
        <AdminLayout>
            <div className="p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-charcoal mb-2">Contact Messages</h1>
                    <p className="text-gray-600">View and manage messages from the contact form</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Total Messages</p>
                            <p className="text-2xl font-bold text-charcoal">{stats.total}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Unread</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Read</p>
                            <p className="text-2xl font-bold text-gray-600">{stats.read}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Replied</p>
                            <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="border-gray-100 shadow-sm mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search by name, email, or subject..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value="UNREAD">Unread</SelectItem>
                                    <SelectItem value="READ">Read</SelectItem>
                                    <SelectItem value="REPLIED">Replied</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Messages Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Messages List */}
                    <div className="lg:col-span-1">
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg">
                                    Messages ({filteredMessages.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="max-h-[600px] overflow-y-auto">
                                    {filteredMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            onClick={() => openMessage(message)}
                                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                                selectedMessage?.id === message.id ? 'bg-burgundy/5' : ''
                                            } ${message.status === 'UNREAD' ? 'bg-blue-50/50' : ''}`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-semibold text-charcoal truncate ${
                                                        message.status === 'UNREAD' ? 'font-bold' : ''
                                                    }`}>
                                                        {message.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 truncate">{message.email}</p>
                                                </div>
                                                <Badge className={statusColors[message.status]} variant="secondary">
                                                    {message.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-700 font-medium truncate mb-1">
                                                {message.subject || 'No subject'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(message.createdAt).toLocaleDateString()} at{' '}
                                                {new Date(message.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    ))}
                                    {filteredMessages.length === 0 && (
                                        <div className="text-center py-12">
                                            <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p className="text-gray-500">No messages found</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Message Detail */}
                    <div className="lg:col-span-2">
                        {selectedMessage ? (
                            <Card className="border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">Message Details</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Select
                                                value={selectedMessage.status}
                                                onValueChange={(value) => handleUpdateStatus(selectedMessage.id, value)}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="UNREAD">Unread</SelectItem>
                                                    <SelectItem value="READ">Read</SelectItem>
                                                    <SelectItem value="REPLIED">Replied</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteMessage(selectedMessage.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        {/* Contact Info */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-burgundy" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Name</p>
                                                    <p className="font-semibold text-charcoal">{selectedMessage.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                                                    <Mail className="w-5 h-5 text-burgundy" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Email</p>
                                                    <a href={`mailto:${selectedMessage.email}`} className="font-semibold text-burgundy hover:underline">
                                                        {selectedMessage.email}
                                                    </a>
                                                </div>
                                            </div>
                                            {selectedMessage.phone && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                                                        <Phone className="w-5 h-5 text-burgundy" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Phone</p>
                                                        <a href={`tel:${selectedMessage.phone}`} className="font-semibold text-charcoal">
                                                            {selectedMessage.phone}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-burgundy" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Received</p>
                                                    <p className="font-semibold text-charcoal">
                                                        {new Date(selectedMessage.createdAt).toLocaleDateString()} at{' '}
                                                        {new Date(selectedMessage.createdAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subject */}
                                        {selectedMessage.subject && (
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700 mb-2">Subject</p>
                                                <p className="text-charcoal font-medium">{selectedMessage.subject}</p>
                                            </div>
                                        )}

                                        {/* Message */}
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Message</p>
                                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                                <p className="text-charcoal whitespace-pre-wrap leading-relaxed">
                                                    {selectedMessage.message}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                                            <Button
                                                onClick={() => setShowReplyModal(true)}
                                                className="flex-1 bg-burgundy hover:bg-burgundy-light text-white"
                                            >
                                                <Mail className="w-4 h-4 mr-2" />
                                                Reply to Message
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-gray-100 shadow-sm">
                                <CardContent className="p-12 text-center">
                                    <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-500">Select a message to view details</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Reply Modal */}
                {showReplyModal && selectedMessage && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="w-full max-w-lg my-8">
                            <Card className="bg-white border-gray-200 shadow-2xl">
                                <CardHeader className="border-b border-gray-200 bg-gray-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-bold text-charcoal">Reply to {selectedMessage.name}</CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setShowReplyModal(false);
                                                setReplyMessage('');
                                            }}
                                            disabled={sendingReply}
                                            className="hover:bg-gray-200 h-8 w-8 p-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 bg-white">
                                    <div className="space-y-3">
                                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                            <div className="space-y-1 text-xs">
                                                <div>
                                                    <span className="text-gray-600">To:</span>
                                                    <span className="ml-2 font-semibold text-charcoal">{selectedMessage.email}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Subject:</span>
                                                    <span className="ml-2 font-semibold text-charcoal">
                                                        Re: {selectedMessage.subject || 'Your message'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700 mb-1">Original Message:</p>
                                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 max-h-24 overflow-y-auto">
                                                <p className="text-xs text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Your Reply <span className="text-red-500">*</span>
                                            </label>
                                            <Textarea
                                                value={replyMessage}
                                                onChange={(e) => setReplyMessage(e.target.value)}
                                                placeholder="Type your reply here..."
                                                className="h-32 resize-none border-gray-300 focus:border-burgundy focus:ring-burgundy text-sm"
                                                disabled={sendingReply}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleSendReply}
                                                disabled={!replyMessage.trim() || sendingReply}
                                                className="flex-1 bg-burgundy hover:bg-burgundy/90 text-white disabled:opacity-50 disabled:cursor-not-allowed h-9 text-sm"
                                            >
                                                {sendingReply ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Send Reply
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setShowReplyModal(false);
                                                    setReplyMessage('');
                                                }}
                                                disabled={sendingReply}
                                                className="border-gray-300 hover:bg-gray-100 h-9 text-sm"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
