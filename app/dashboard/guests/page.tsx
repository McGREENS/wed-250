"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

export default function GuestsPage() {
    const [guests, setGuests] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+250 788 111 222', rsvp: 'confirmed', meal: 'Vegetarian', table: 1 },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+250 788 222 333', rsvp: 'confirmed', meal: 'Regular', table: 1 },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+250 788 333 444', rsvp: 'pending', meal: 'None', table: 0 },
        { id: 4, name: 'Alice Williams', email: 'alice@example.com', phone: '+250 788 444 555', rsvp: 'declined', meal: 'None', table: 0 },
        { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', phone: '+250 788 555 666', rsvp: 'confirmed', meal: 'Gluten-free', table: 2 },
    ]);

    const confirmedCount = guests.filter(g => g.rsvp === 'confirmed').length;
    const pendingCount = guests.filter(g => g.rsvp === 'pending').length;
    const declinedCount = guests.filter(g => g.rsvp === 'declined').length;

    const getRsvpBadge = (status: string) => {
        const styles = {
            confirmed: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            declined: 'bg-red-100 text-red-700',
        };
        return styles[status as keyof typeof styles];
    };

    return (
        <UserPageLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif text-charcoal mb-2">Guest List</h1>
                    <p className="text-gray-600">Manage your wedding guests and RSVPs</p>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Total Guests</p>
                            <p className="text-2xl font-bold text-charcoal">{guests.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Confirmed</p>
                            <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Declined</p>
                            <p className="text-2xl font-bold text-red-600">{declinedCount}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-gray-100 shadow-sm mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-charcoal">Add New Guest</h3>
                            <Button className="bg-burgundy hover:bg-burgundy-light text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Guest
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-sm">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-charcoal mb-6">Guest List</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Name</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Email</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Phone</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">RSVP</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Meal</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Table</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guests.map(guest => (
                                        <tr key={guest.id} className="border-b border-gray-100 hover:bg-sand/20">
                                            <td className="py-3 px-4 text-sm text-charcoal font-medium">{guest.name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{guest.email}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{guest.phone}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRsvpBadge(guest.rsvp)}`}>
                                                    {guest.rsvp}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{guest.meal}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{guest.table > 0 ? `Table ${guest.table}` : '-'}</td>
                                            <td className="py-3 px-4">
                                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setGuests(guests.filter(g => g.id !== guest.id))}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </UserPageLayout>
    );
}
