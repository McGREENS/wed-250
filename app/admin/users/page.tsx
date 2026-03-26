"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '../AdminLayout';
import {
    User,
    Mail,
    Phone,
    Search,
    Filter,
    UserPlus,
    Trash2,
    Edit,
    X,
    Loader2,
    Eye,
    EyeOff,
    TrendingUp,
    Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { toast } from 'sonner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminUsersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [dailyData, setDailyData] = useState<any[]>([]);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);

    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'COUPLE',
        phone: '',
    });

    useEffect(() => {
        if (status === 'loading') return;
        
        if (!session?.user || session.user.role !== 'ADMIN') {
            router.push('/login');
            return;
        }

        fetchUsers();
    }, [session, status, router]);

    useEffect(() => {
        filterUsers();
        calculateChartData();
    }, [users, searchQuery, roleFilter]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = [...users];

        if (searchQuery) {
            filtered = filtered.filter(u => 
                u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (roleFilter !== 'ALL') {
            filtered = filtered.filter(u => u.role === roleFilter);
        }

        setFilteredUsers(filtered);
    };

    const calculateChartData = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Daily data for current month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daily = Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            count: 0,
        }));

        users.forEach(user => {
            const date = new Date(user.createdAt);
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                const day = date.getDate();
                daily[day - 1].count++;
            }
        });

        setDailyData(daily);

        // Monthly data for current year
        const monthly = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(currentYear, i).toLocaleString('default', { month: 'short' }),
            count: 0,
        }));

        users.forEach(user => {
            const date = new Date(user.createdAt);
            if (date.getFullYear() === currentYear) {
                const month = date.getMonth();
                monthly[month].count++;
            }
        });

        setMonthlyData(monthly);
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userForm),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.emailWarning) {
                    toast.warning(data.emailWarning, { duration: 10000 });
                } else {
                    toast.success('User created successfully');
                }
                setShowAddModal(false);
                resetForm();
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

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const updateData: any = {
                userId: editingUser.id,
                name: userForm.name,
                email: userForm.email,
                role: userForm.role,
                phone: userForm.phone,
            };

            if (userForm.password) {
                updateData.password = userForm.password;
            }

            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('User updated successfully');
                setEditingUser(null);
                resetForm();
                await fetchUsers();
            } else {
                toast.error(data.error || 'Failed to update user');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setUpdating(false);
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

    const openEditModal = (user: any) => {
        setEditingUser(user);
        setUserForm({
            name: user.name || '',
            email: user.email || '',
            password: '',
            role: user.role || 'COUPLE',
            phone: user.phone || '',
        });
    };

    const resetForm = () => {
        setUserForm({
            name: '',
            email: '',
            password: '',
            role: 'COUPLE',
            phone: '',
        });
        setShowPassword(false);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setEditingUser(null);
        resetForm();
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading users...</p>
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

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        vendors: users.filter(u => u.role === 'VENDOR').length,
        couples: users.filter(u => u.role === 'COUPLE').length,
    };

    return (
        <AdminLayout>
            <div className="p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-charcoal mb-2">Users Management</h1>
                        <p className="text-gray-600">Manage all platform users</p>
                    </div>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        className="bg-burgundy hover:bg-burgundy-light text-white"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Total Users</p>
                            <p className="text-2xl font-bold text-charcoal">{stats.total}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Admins</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Vendors</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.vendors}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Couples</p>
                            <p className="text-2xl font-bold text-pink-600">{stats.couples}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Registration Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Daily Registrations */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-burgundy" />
                                        Daily Registrations
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {dailyData.some(d => d.count > 0) ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dailyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis 
                                            dataKey="day" 
                                            tick={{ fontSize: 12 }}
                                            label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }}
                                        />
                                        <YAxis 
                                            tick={{ fontSize: 12 }}
                                            label={{ value: 'Users', angle: -90, position: 'insideLeft' }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#fff', 
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                            labelFormatter={(value) => `Day ${value}`}
                                        />
                                        <Bar 
                                            dataKey="count" 
                                            fill="#8B3A3A" 
                                            radius={[8, 8, 0, 0]}
                                            name="Registrations"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center py-16 text-gray-500">
                                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No registrations this month</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Monthly Registrations */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-burgundy" />
                                        Monthly Registrations
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {new Date().getFullYear()}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {monthlyData.some(d => d.count > 0) ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis 
                                            dataKey="month" 
                                            tick={{ fontSize: 12 }}
                                            label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                                        />
                                        <YAxis 
                                            tick={{ fontSize: 12 }}
                                            label={{ value: 'Users', angle: -90, position: 'insideLeft' }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#fff', 
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="count" 
                                            stroke="#2563eb" 
                                            strokeWidth={3}
                                            dot={{ fill: '#2563eb', r: 5 }}
                                            activeDot={{ r: 7 }}
                                            name="Registrations"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center py-16 text-gray-500">
                                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No registrations this year</p>
                                </div>
                            )}
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
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Roles</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="VENDOR">Vendor</SelectItem>
                                    <SelectItem value="COUPLE">Couple</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-lg">
                            All Users ({filteredUsers.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-semibold text-gray-700">User</th>
                                        <th className="text-left p-4 text-sm font-semibold text-gray-700">Email</th>
                                        <th className="text-left p-4 text-sm font-semibold text-gray-700">Phone</th>
                                        <th className="text-left p-4 text-sm font-semibold text-gray-700">Role</th>
                                        <th className="text-left p-4 text-sm font-semibold text-gray-700">Joined</th>
                                        <th className="text-right p-4 text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-burgundy" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-charcoal">{user.name}</p>
                                                        {user.id === session?.user?.id && (
                                                            <Badge variant="outline" className="text-xs mt-1">You</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">{user.email}</td>
                                            <td className="p-4 text-sm text-gray-600">{user.phone || '-'}</td>
                                            <td className="p-4">
                                                <Badge className={roleColors[user.role]}>{user.role}</Badge>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditModal(user)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-12">
                                    <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p className="text-gray-500">No users found</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Add/Edit Modal */}
                {(showAddModal || editingUser) && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-md border-gray-100 shadow-lg">
                            <CardHeader className="border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        {editingUser ? 'Edit User' : 'Add New User'}
                                    </CardTitle>
                                    <Button variant="ghost" size="sm" onClick={closeModal}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={editingUser ? handleEditUser : handleAddUser} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={userForm.name}
                                            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={userForm.email}
                                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="password">
                                            Password {editingUser && '(leave blank to keep current)'}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={userForm.password}
                                                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                                required={!editingUser}
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="role">Role</Label>
                                        <Select
                                            value={userForm.role}
                                            onValueChange={(value) => setUserForm({ ...userForm, role: value })}
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
                                        <Label htmlFor="phone">Phone (Optional)</Label>
                                        <Input
                                            id="phone"
                                            value={userForm.phone}
                                            onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                                            placeholder="+250 XXX XXX XXX"
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            type="submit"
                                            disabled={creating || updating}
                                            className="flex-1 bg-burgundy hover:bg-burgundy-light text-white disabled:opacity-50"
                                        >
                                            {(creating || updating) ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    {editingUser ? 'Updating...' : 'Creating...'}
                                                </>
                                            ) : (
                                                editingUser ? 'Update User' : 'Create User'
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={closeModal}
                                            disabled={creating || updating}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
