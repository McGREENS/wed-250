"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: '', phone: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user-settings');
        if (res.ok) {
          const data = await res.json();
          setProfile({ name: data.name || '', phone: data.phone || '' });
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchUser();
  }, []);

  const handleSaveProfile = async () => {
    if (!profile.name) return toast.error('Name is required');
    setSavingProfile(true);
    try {
      const res = await fetch('/api/user-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'profile', ...profile }),
      });
      if (res.ok) {
        toast.success('Profile updated successfully');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return toast.error('All password fields are required');
    }
    if (passwords.new !== passwords.confirm) {
      return toast.error('New passwords do not match');
    }
    if (passwords.new.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    setSavingPassword(true);
    try {
      const res = await fetch('/api/user-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'password', currentPassword: passwords.current, newPassword: passwords.new }),
      });
      if (res.ok) {
        toast.success('Password changed successfully');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loadingProfile) {
    return (
      <UserPageLayout>
        <div className="max-w-2xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </UserPageLayout>
    );
  }

  return (
    <UserPageLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-charcoal mb-2">Account Settings</h1>
          <p className="text-charcoal/70">Manage your profile and security</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="border-gold/20 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-gold/8 via-cream to-sand/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-burgundy/15 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-burgundy" />
                </div>
                <div>
                  <h2 className="font-semibold text-charcoal">Profile</h2>
                  <p className="text-sm text-charcoal/70">Update your name and phone number</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-charcoal/80">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Your full name"
                    className="border-sand bg-white focus:border-burgundy"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-charcoal/80">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+250 7XX XXX XXX"
                    className="border-sand bg-white focus:border-burgundy"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="bg-burgundy text-white hover:bg-burgundy/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {savingProfile ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card className="border-burgundy/20 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-burgundy/12 via-burgundy/5 to-cream">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-burgundy/15 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-burgundy" />
                </div>
                <div>
                  <h2 className="font-semibold text-charcoal">Password</h2>
                  <p className="text-sm text-charcoal/70">Change your account password</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="currentPassword" className="text-charcoal/80">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      placeholder="Enter current password"
                      className="border-sand bg-white focus:border-burgundy pr-10"
                    />
                    <button type="button" onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-burgundy">
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="newPassword" className="text-charcoal/80">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      placeholder="Min. 8 characters"
                      className="border-sand bg-white focus:border-burgundy pr-10"
                    />
                    <button type="button" onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-burgundy">
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword" className="text-charcoal/80">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="Repeat new password"
                      className="border-sand bg-white focus:border-burgundy pr-10"
                    />
                    <button type="button" onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-burgundy">
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleChangePassword}
                    disabled={savingPassword}
                    className="bg-burgundy text-white hover:bg-burgundy/90"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {savingPassword ? 'Updating...' : 'Change Password'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserPageLayout>
  );
}
