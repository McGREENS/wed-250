"use client";

import { useState } from "react";
import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { User, Building2, Lock, Bell, Camera } from "lucide-react";
import { toast } from "sonner";

export default function VendorSettingsPage() {
    const [profileData, setProfileData] = useState({
        businessName: "Elegance Weddings",
        ownerName: "John Doe",
        email: "vendor@andiza.rw",
        phone: "+250 788 123 456",
        bio: "Professional wedding photography and videography services in Rwanda. Capturing your special moments with creativity and passion."
    });

    const [businessData, setBusinessData] = useState({
        category: "Photography",
        location: "Kigali, Rwanda",
        address: "KN 5 Ave, Kigali",
        website: "www.eleganceweddings.rw",
        taxId: "RW123456789",
        bankAccount: "****1234"
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [notifications, setNotifications] = useState({
        emailBookings: true,
        emailMessages: true,
        emailReviews: true,
        pushBookings: true,
        pushMessages: false,
        pushReviews: true
    });

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Profile updated successfully");
    };

    const handleBusinessSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Business information updated successfully");
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (securityData.newPassword !== securityData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        toast.success("Password changed successfully");
        setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    const handleNotificationsSave = () => {
        toast.success("Notification preferences updated");
    };

    return (
        <VendorPageLayout>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-charcoal mb-2">Settings</h1>
                        <p className="text-gray-600">Manage your account and business preferences</p>
                    </div>

                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className="bg-white border border-gray-100">
                            <TabsTrigger value="profile">
                                <User className="w-4 h-4 mr-2" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger value="business">
                                <Building2 className="w-4 h-4 mr-2" />
                                Business
                            </TabsTrigger>
                            <TabsTrigger value="security">
                                <Lock className="w-4 h-4 mr-2" />
                                Security
                            </TabsTrigger>
                            <TabsTrigger value="notifications">
                                <Bell className="w-4 h-4 mr-2" />
                                Notifications
                            </TabsTrigger>
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value="profile">
                            <Card className="border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100">
                                    <CardTitle>Profile Information</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleProfileSave} className="space-y-6">
                                        <div className="flex items-center gap-6 mb-6">
                                            <div className="w-24 h-24 bg-burgundy/10 rounded-full flex items-center justify-center">
                                                <span className="text-3xl font-bold text-burgundy">EW</span>
                                            </div>
                                            <div>
                                                <Button type="button" variant="outline" className="mb-2">
                                                    <Camera className="w-4 h-4 mr-2" />
                                                    Change Photo
                                                </Button>
                                                <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-charcoal mb-2">Business Name</label>
                                                <Input
                                                    value={profileData.businessName}
                                                    onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                                                    className="border-gray-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-charcoal mb-2">Owner Name</label>
                                                <Input
                                                    value={profileData.ownerName}
                                                    onChange={(e) => setProfileData({ ...profileData, ownerName: e.target.value })}
                                                    className="border-gray-200"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
                                                <Input
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                    className="border-gray-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-charcoal mb-2">Phone</label>
                                                <Input
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                    className="border-gray-200"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal mb-2">Bio</label>
                                            <Textarea
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                rows={4}
                                                className="border-gray-200"
                                            />
                                        </div>

                                        <Button type="submit" className="bg-burgundy hover:bg-burgundy-light text-white">
                                            Save Changes
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Business Tab */}
                        <TabsContent value="business">
                            <Card className="border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100">
                                    <CardTitle>Business Information</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleBusinessSave} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-charcoal mb-2">Category</label>
                                                <Input
                                                    value={businessData.category}
                                                    onChange={(e) => setBusinessData({ ...businessData, category: e.target.value })}
                                                    className="border-gray-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-charcoal mb-2">Location</label>
                                                <Input
                                                    value={businessData.location}
                                                    onChange={(e) => setBusinessData({ ...businessData, location: e.target.value })}
                                                    className="border-gray-200"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal mb-2">Address</label>
                                            <Input
                                                value={businessData.address}
                                                onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                                                className="border-gray-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal mb-2">Website</label>
                                            <Input
                                                value={businessData.website}
                                                onChange={(e) => setBusinessData({ ...businessData, website: e.target.value })}
                                                className="border-gray-200"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-charcoal mb-2">Tax ID</label>
                                                <Input
                                                    value={businessData.taxId}
                                                    onChange={(e) => setBusinessData({ ...businessData, taxId: e.target.value })}
                                                    className="border-gray-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-charcoal mb-2">Bank Account</label>
                                                <Input
                                                    value={businessData.bankAccount}
                                                    onChange={(e) => setBusinessData({ ...businessData, bankAccount: e.target.value })}
                                                    className="border-gray-200"
                                                />
                                            </div>
                                        </div>

                                        <Button type="submit" className="bg-burgundy hover:bg-burgundy-light text-white">
                                            Save Changes
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security">
                            <Card className="border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100">
                                    <CardTitle>Change Password</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal mb-2">Current Password</label>
                                            <Input
                                                type="password"
                                                value={securityData.currentPassword}
                                                onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                                                className="border-gray-200"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal mb-2">New Password</label>
                                            <Input
                                                type="password"
                                                value={securityData.newPassword}
                                                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                                                className="border-gray-200"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal mb-2">Confirm New Password</label>
                                            <Input
                                                type="password"
                                                value={securityData.confirmPassword}
                                                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                                className="border-gray-200"
                                                required
                                            />
                                        </div>

                                        <Button type="submit" className="bg-burgundy hover:bg-burgundy-light text-white">
                                            Update Password
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Notifications Tab */}
                        <TabsContent value="notifications">
                            <Card className="border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100">
                                    <CardTitle>Notification Preferences</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-charcoal mb-4">Email Notifications</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between p-3 bg-sand/20 rounded-lg cursor-pointer">
                                                <span className="text-sm text-charcoal">New booking requests</span>
                                                <input
                                                    type="checkbox"
                                                    checked={notifications.emailBookings}
                                                    onChange={(e) => setNotifications({ ...notifications, emailBookings: e.target.checked })}
                                                    className="w-4 h-4 text-burgundy rounded"
                                                />
                                            </label>
                                            <label className="flex items-center justify-between p-3 bg-sand/20 rounded-lg cursor-pointer">
                                                <span className="text-sm text-charcoal">New messages</span>
                                                <input
                                                    type="checkbox"
                                                    checked={notifications.emailMessages}
                                                    onChange={(e) => setNotifications({ ...notifications, emailMessages: e.target.checked })}
                                                    className="w-4 h-4 text-burgundy rounded"
                                                />
                                            </label>
                                            <label className="flex items-center justify-between p-3 bg-sand/20 rounded-lg cursor-pointer">
                                                <span className="text-sm text-charcoal">New reviews</span>
                                                <input
                                                    type="checkbox"
                                                    checked={notifications.emailReviews}
                                                    onChange={(e) => setNotifications({ ...notifications, emailReviews: e.target.checked })}
                                                    className="w-4 h-4 text-burgundy rounded"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-charcoal mb-4">Push Notifications</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between p-3 bg-sand/20 rounded-lg cursor-pointer">
                                                <span className="text-sm text-charcoal">New booking requests</span>
                                                <input
                                                    type="checkbox"
                                                    checked={notifications.pushBookings}
                                                    onChange={(e) => setNotifications({ ...notifications, pushBookings: e.target.checked })}
                                                    className="w-4 h-4 text-burgundy rounded"
                                                />
                                            </label>
                                            <label className="flex items-center justify-between p-3 bg-sand/20 rounded-lg cursor-pointer">
                                                <span className="text-sm text-charcoal">New messages</span>
                                                <input
                                                    type="checkbox"
                                                    checked={notifications.pushMessages}
                                                    onChange={(e) => setNotifications({ ...notifications, pushMessages: e.target.checked })}
                                                    className="w-4 h-4 text-burgundy rounded"
                                                />
                                            </label>
                                            <label className="flex items-center justify-between p-3 bg-sand/20 rounded-lg cursor-pointer">
                                                <span className="text-sm text-charcoal">New reviews</span>
                                                <input
                                                    type="checkbox"
                                                    checked={notifications.pushReviews}
                                                    onChange={(e) => setNotifications({ ...notifications, pushReviews: e.target.checked })}
                                                    className="w-4 h-4 text-burgundy rounded"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <Button onClick={handleNotificationsSave} className="bg-burgundy hover:bg-burgundy-light text-white">
                                        Save Preferences
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
        </VendorPageLayout>
    );
}
