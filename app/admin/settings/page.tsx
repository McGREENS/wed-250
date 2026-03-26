"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '../AdminLayout';
import {
    User,
    Mail,
    Lock,
    Phone,
    UserPlus,
    Trash2,
    Edit,
    Save,
    X,
    Eye,
    EyeOff,
    Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { toast } from 'sonner';

export default function AdminSettingsPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [creating, setCreating] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [showAddUser, setShowAddUser] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false,
        create: false,
    });

    // Profile form
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // New user form
    const [newUserForm, setNewUserForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'ADMIN',
        phone: '',
    });

    // Update form when session changes
    useEffect(() => {
        if (session?.user) {
            // Fetch user data from database to get phone number
            fetchCurrentUserData();
        }
    }, [session?.user?.id]);

    useEffect(() => {
        if (status === 'loading') return;
        
        if (!session?.user || session.user.role !== 'ADMIN') {
            router.push('/login');
            return;
        }

        // Fetch fresh user data from database
        fetchCurrentUserData();
        fetchUsers();
    }, [session, status, router]);

    const fetchCurrentUserData = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                const currentUser = data.users.find((u: any) => u.id === session?.user?.id);
                if (currentUser) {
                    setProfileForm(prev => ({
                        ...prev,
                        name: currentUser.name || '',
                        email: currentUser.email || '',
                        phone: currentUser.phone || '',
                    }));
                }
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users.filter((u: any) => u.role === 'ADMIN'));
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setSaving(true);
        try {
            const updateData: any = {
                userId: session?.user?.id,
                name: profileForm.name,
                email: profileForm.email,
                phone: profileForm.phone,
            };

            if (profileForm.newPassword) {
                updateData.password = profileForm.newPassword;
            }

            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Profile updated successfully');
                // Refresh user data from database
                await fetchCurrentUserData();
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: profileForm.name,
                        email: profileForm.email,
                    },
                });
                setProfileForm(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }));
            } else {
                toast.error(data.error || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();

        setCreating(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUserForm),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.emailWarning) {
                    toast.warning(data.emailWarning, { duration: 10000 });
                } else {
                    toast.success('User created successfully and onboarding email sent');
                }
                setShowAddUser(false);
                setNewUserForm({
                    name: '',
                    email: '',
                    password: '',
                    role: 'ADMIN',
                    phone: '',
                });
                await fetchUsers();
            } else {
                toast.error(data.error || 'Failed to create user');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await fetch(`/api/admin/users?userId=${userId}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('User deleted successfully');
                await fetchUsers();
            } else {
                toast.error(data.error || 'Failed to delete user');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading settings...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const roleColors: any = {
        ADMIN: 'bg-purple-100 text-purple-800',
        VENDOR: 'bg-blue-100 text-blue-800',
        COUPLE: 'bg-pink-100 text-pink-800',
    };

    return (
        <AdminLayout>
            <div className="p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-charcoal mb-2">
                        Settings
                    </h1>
                    <p className="text-gray-600">
                        Manage your profile and system users
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Profile Settings */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-lg">Profile Settings</CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative mt-1">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative mt-1">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileForm.email}
                                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <div className="relative mt-1">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="phone"
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                            className="pl-10"
                                            placeholder="+250 XXX XXX XXX"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-6">
                                    <h3 className="text-sm font-semibold text-charcoal mb-4">Change Password</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <div className="relative mt-1">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    id="newPassword"
                                                    type={showPassword.new ? "text" : "password"}
                                                    value={profileForm.newPassword}
                                                    onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                                                    className="pl-10 pr-10"
                                                    placeholder="Leave blank to keep current"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <div className="relative mt-1">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    id="confirmPassword"
                                                    type={showPassword.confirm ? "text" : "password"}
                                                    value={profileForm.confirmPassword}
                                                    onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                                                    className="pl-10 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" disabled={saving} className="w-full bg-burgundy hover:bg-burgundy-light text-white disabled:opacity-50">
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Add New User */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Add New User</CardTitle>
                                    <CardDescription>Create admin or other user accounts</CardDescription>
                                </div>
                                {!showAddUser && (
                                    <Button
                                        onClick={() => setShowAddUser(true)}
                                        className="bg-burgundy hover:bg-burgundy-light text-white"
                                        size="sm"
                                    >
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Add User
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {showAddUser ? (
                                <form onSubmit={handleAddUser} className="space-y-4">
                                    <div>
                                        <Label htmlFor="newName">Full Name</Label>
                                        <Input
                                            id="newName"
                                            value={newUserForm.name}
                                            onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="newEmail">Email</Label>
                                        <Input
                                            id="newEmail"
                                            type="email"
                                            value={newUserForm.email}
                                            onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="newPassword">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="newPassword"
                                                type={showPassword.create ? "text" : "password"}
                                                value={newUserForm.password}
                                                onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                                                className="pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword({ ...showPassword, create: !showPassword.create })}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword.create ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="newRole">Role</Label>
                                        <Select
                                            value={newUserForm.role}
                                            onValueChange={(value) => setNewUserForm({ ...newUserForm, role: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                <SelectItem value="VENDOR">Vendor</SelectItem>
                                                <SelectItem value="COUPLE">Couple</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="newPhone">Phone (Optional)</Label>
                                        <Input
                                            id="newPhone"
                                            value={newUserForm.phone}
                                            onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                                            placeholder="+250 XXX XXX XXX"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <Button type="submit" disabled={creating} className="flex-1 bg-burgundy hover:bg-burgundy-light text-white disabled:opacity-50">
                                            {creating ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                'Create User'
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={creating}
                                            onClick={() => {
                                                setShowAddUser(false);
                                                setNewUserForm({
                                                    name: '',
                                                    email: '',
                                                    password: '',
                                                    role: 'ADMIN',
                                                    phone: '',
                                                });
                                            }}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>Click "Add User" to create a new account</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* User Management */}
                <Card className="border-gray-100 shadow-sm mt-6">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-lg">Admin Users</CardTitle>
                        <CardDescription>Manage admin accounts</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-3">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="font-semibold text-charcoal">{user.name}</p>
                                            <Badge className={roleColors[user.role]}>
                                                {user.role}
                                            </Badge>
                                            {user.id === session?.user?.id && (
                                                <Badge variant="outline" className="text-xs">You</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                        {user.phone && (
                                            <p className="text-xs text-gray-500 mt-1">{user.phone}</p>
                                        )}
                                    </div>
                                    {user.id !== session?.user?.id && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
