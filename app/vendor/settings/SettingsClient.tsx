"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { User, Building2, Lock, Bell, Camera, Globe, CreditCard, MapPin, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import bcrypt from "bcryptjs";

export default function VendorSettingsClient({ initialData }: any) {
    const [profileData, setProfileData] = useState({
        businessName: initialData.vendor?.businessName || "",
        email: initialData.user?.email || "",
        phone: initialData.user?.phone || "",
        bio: initialData.vendor?.description || "",
        image: initialData.user?.image || "",
        category: initialData.vendor?.category || "",
        location: initialData.vendor?.location || "",
        priceRange: initialData.vendor?.priceRange || "",
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be less than 2MB");
            return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileData({ ...profileData, image: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/vendor/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "profile", data: profileData }),
        });
        if (res.ok) toast.success("Profile updated successfully");
        else toast.error("Failed to update profile");
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (securityData.newPassword !== securityData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        if (securityData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        const res = await fetch("/api/vendor/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "password", data: securityData }),
        });
        if (res.ok) {
            toast.success("Password changed successfully");
            setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } else {
            const error = await res.json();
            toast.error(error.error || "Failed to change password");
        }
    };

    return (
        <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-white border border-gray-100">
                <TabsTrigger value="profile"><User className="w-4 h-4 mr-2" />Profile</TabsTrigger>
                <TabsTrigger value="security"><Lock className="w-4 h-4 mr-2" />Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleProfileSave} className="space-y-6">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="w-24 h-24 bg-burgundy/10 rounded-full flex items-center justify-center overflow-hidden">
                                    {profileData.image ? (
                                        <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-burgundy">{profileData.businessName.substring(0, 2).toUpperCase()}</span>
                                    )}
                                </div>
                                <div>
                                    <input type="file" id="photo-upload" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    <Button type="button" variant="outline" className="mb-2" onClick={() => document.getElementById('photo-upload')?.click()}>
                                        <Camera className="w-4 h-4 mr-2" />
                                        Change Photo
                                    </Button>
                                    <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Business Name</label>
                                    <Input value={profileData.businessName} onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
                                    <Input type="email" value={profileData.email} disabled className="bg-gray-50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Phone Number</label>
                                <Input value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} placeholder="+250 788 123 456" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Business Description</label>
                                <Textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} rows={4} placeholder="Tell couples about your services..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Service Category</label>
                                <select value={profileData.category} onChange={(e) => setProfileData({ ...profileData, category: e.target.value })} className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white" required>
                                    <option value="">Select a category</option>
                                    <option value="venue">Venue</option>
                                    <option value="photography">Photography</option>
                                    <option value="catering">Catering</option>
                                    <option value="decoration">Decoration</option>
                                    <option value="music">Music/DJ</option>
                                    <option value="planning">Wedding Planning</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2"><MapPin className="w-4 h-4 inline mr-1" />Location</label>
                                <Input value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} placeholder="Kigali, Rwanda" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2"><CreditCard className="w-4 h-4 inline mr-1" />Price Range</label>
                                <select value={profileData.priceRange} onChange={(e) => setProfileData({ ...profileData, priceRange: e.target.value })} className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white">
                                    <option value="">Select price range</option>
                                    <option value="budget">Budget (RWF 100K - 500K)</option>
                                    <option value="moderate">Moderate (RWF 500K - 2M)</option>
                                    <option value="premium">Premium (RWF 2M - 5M)</option>
                                    <option value="luxury">Luxury (RWF 5M+)</option>
                                </select>
                            </div>
                            <Button type="submit" className="bg-burgundy hover:bg-burgundy-light text-white">Save Changes</Button>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="security">
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle>Change Password</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Current Password</label>
                                <div className="relative">
                                    <Input type={showPasswords.current ? "text" : "password"} value={securityData.currentPassword} onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })} required className="pr-10" />
                                    <button type="button" onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">New Password</label>
                                <div className="relative">
                                    <Input type={showPasswords.new ? "text" : "password"} value={securityData.newPassword} onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })} placeholder="Min. 6 characters" required className="pr-10" />
                                    <button type="button" onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <Input type={showPasswords.confirm ? "text" : "password"} value={securityData.confirmPassword} onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })} required className="pr-10" />
                                    <button type="button" onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <Button type="submit" className="bg-burgundy hover:bg-burgundy-light text-white">Update Password</Button>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
