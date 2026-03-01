"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { useState } from 'react';

export default function SettingsPage() {
    const [profile, setProfile] = useState({
        coupleName: 'Sarah & Michael',
        email: 'user@andiza.rw',
        phone: '+250 788 123 456',
        weddingDate: '2024-12-15',
        venue: 'Kigali Serena Hotel',
        guestCount: 150,
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        smsNotifications: false,
        bookingUpdates: true,
        vendorMessages: true,
        reminderAlerts: true,
    });

    return (
        <UserPageLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif text-charcoal mb-2">Settings</h1>
                    <p className="text-gray-600">Manage your account and preferences</p>
                </div>

                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="bg-white border border-gray-100">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card className="border-gray-100 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-charcoal mb-6">Wedding Profile</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="coupleName">Couple Names</Label>
                                        <Input id="coupleName" value={profile.coupleName} onChange={(e) => setProfile({...profile, coupleName: e.target.value})} />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="weddingDate">Wedding Date</Label>
                                            <Input id="weddingDate" type="date" value={profile.weddingDate} onChange={(e) => setProfile({...profile, weddingDate: e.target.value})} />
                                        </div>
                                        <div>
                                            <Label htmlFor="guestCount">Guest Count</Label>
                                            <Input id="guestCount" type="number" value={profile.guestCount} onChange={(e) => setProfile({...profile, guestCount: parseInt(e.target.value)})} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="venue">Venue</Label>
                                        <Input id="venue" value={profile.venue} onChange={(e) => setProfile({...profile, venue: e.target.value})} />
                                    </div>
                                    <Button className="bg-burgundy hover:bg-burgundy-light text-white">Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="account">
                        <Card className="border-gray-100 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-charcoal mb-6">Account Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                                    </div>
                                    <Button className="bg-burgundy hover:bg-burgundy-light text-white">Update Account</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <Card className="border-gray-100 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-charcoal mb-6">Notification Preferences</h3>
                                <div className="space-y-4">
                                    {Object.entries(notifications).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between p-3 bg-sand/20 rounded-lg">
                                            <span className="text-sm text-charcoal capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <input type="checkbox" checked={value} onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})} className="w-5 h-5 text-burgundy rounded" />
                                        </div>
                                    ))}
                                    <Button className="bg-burgundy hover:bg-burgundy-light text-white">Save Preferences</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security">
                        <Card className="border-gray-100 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-charcoal mb-6">Change Password</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input id="currentPassword" type="password" />
                                    </div>
                                    <div>
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input id="newPassword" type="password" />
                                    </div>
                                    <div>
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input id="confirmPassword" type="password" />
                                    </div>
                                    <Button className="bg-burgundy hover:bg-burgundy-light text-white">Update Password</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </UserPageLayout>
    );
}
