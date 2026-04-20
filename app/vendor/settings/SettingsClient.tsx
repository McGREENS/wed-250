"use client";

import { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  User, Lock, Camera, MapPin, CreditCard, Pencil, Check, X,
  Eye, EyeOff, Loader2, Shield, KeyRound, AlertCircle, CheckCircle2,
  Building2, Phone, Mail, Tag, BadgeDollarSign,
} from "lucide-react";
import { toast } from "sonner";

const PRICE_LABELS: Record<string, string> = {
  budget: "Budget (RWF 100K – 500K)",
  moderate: "Moderate (RWF 500K – 2M)",
  premium: "Premium (RWF 2M – 5M)",
  luxury: "Luxury (RWF 5M+)",
};

const CATEGORY_LABELS: Record<string, string> = {
  venue: "Venue",
  photography: "Photography",
  catering: "Catering",
  decoration: "Decoration",
  music: "Music / DJ",
  planning: "Wedding Planning",
};

// ── Password strength ──────────────────────────────────────────────────────
function passwordStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: "Too short", color: "bg-red-400" },
    { label: "Weak", color: "bg-red-400" },
    { label: "Fair", color: "bg-yellow-400" },
    { label: "Good", color: "bg-blue-400" },
    { label: "Strong", color: "bg-green-500" },
  ];
  return { score, ...map[score] };
}

// ── Inline editable field ──────────────────────────────────────────────────
function EditableField({
  label, icon: Icon, value, onSave, multiline = false, disabled = false,
  renderDisplay, children,
}: {
  label: string;
  icon?: React.ElementType;
  value: string;
  onSave: (v: string) => Promise<void>;
  multiline?: boolean;
  disabled?: boolean;
  renderDisplay?: (v: string) => React.ReactNode;
  children?: (val: string, setVal: (v: string) => void) => React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (draft === value) { setEditing(false); return; }
    setSaving(true);
    try {
      await onSave(draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => { setDraft(value); setEditing(false); };

  return (
    <div className="group flex items-start gap-4 py-4 border-b border-gray-50 last:border-0">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        {editing ? (
          <div className="mt-1">
            {children ? (
              children(draft, setDraft)
            ) : multiline ? (
              <Textarea value={draft} onChange={e => setDraft(e.target.value)} rows={3}
                className="text-sm resize-none" autoFocus />
            ) : (
              <Input type="text" value={draft} onChange={e => setDraft(e.target.value)}
                className="text-sm h-9" autoFocus disabled={disabled} />
            )}
          </div>
        ) : (
          <p className="text-sm text-charcoal leading-relaxed">
            {renderDisplay ? renderDisplay(value) : (value || <span className="text-gray-300 italic">Not set</span>)}
          </p>
        )}
      </div>

      {!disabled && (
        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
          {editing ? (
            <>
              <Button size="sm" onClick={save} disabled={saving}
                className="h-8 px-3 bg-burgundy hover:bg-burgundy/90 text-white text-xs gap-1.5">
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                {saving ? "Saving" : "Save"}
              </Button>
              <Button size="sm" variant="ghost" onClick={cancel} disabled={saving}
                className="h-8 px-2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </Button>
            </>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => { setDraft(value); setEditing(true); }}
              className="h-8 px-2 text-gray-400 hover:text-burgundy md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function VendorSettingsClient({ initialData }: any) {
  const u = initialData.user;
  const v = initialData.vendor;

  let initCategory = "";
  try { initCategory = JSON.parse(v?.categories || "[]")[0] || ""; } catch {}

  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  const [profile, setProfile] = useState({
    businessName: v?.businessName || "",
    email: u?.email || "",
    phone: u?.phone || "",
    bio: v?.description || "",
    image: u?.image || "",
    category: initCategory,
    location: v?.location || "",
    priceRange: v?.priceRange || "",
  });

  const saveField = async (field: string, value: string) => {
    const res = await fetch("/api/vendor/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "profile", field, value }),
    });
    if (res.ok) {
      setProfile(prev => ({ ...prev, [field]: value }));
      toast.success(`${fieldLabel(field)} updated`);
    } else {
      const d = await res.json();
      toast.error(d.error || "Failed to save");
      throw new Error(d.error);
    }
  };

  const fieldLabel = (f: string) => ({
    businessName: "Business name", email: "Email address", phone: "Phone number", bio: "Description",
    category: "Category", location: "Location", priceRange: "Price range", image: "Photo",
  }[f] || f);

  // Photo upload
  const [photoSaving, setPhotoSaving] = useState(false);
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be less than 2MB"); return; }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPhotoSaving(true);
      try { await saveField("image", base64); }
      finally { setPhotoSaving(false); }
    };
    reader.readAsDataURL(file);
  };

  // Password
  const [pwd, setPwd] = useState({ current: "", newPwd: "", confirm: "" });
  const [showPwd, setShowPwd] = useState({ current: false, newPwd: false, confirm: false });
  const [pwdSaving, setPwdSaving] = useState(false);
  const strength = passwordStrength(pwd.newPwd);
  const pwdMatch = pwd.confirm && pwd.newPwd === pwd.confirm;
  const pwdMismatch = pwd.confirm && pwd.newPwd !== pwd.confirm;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.newPwd !== pwd.confirm) { toast.error("Passwords don't match"); return; }
    if (pwd.newPwd.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setPwdSaving(true);
    try {
      const res = await fetch("/api/vendor/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "password", data: { currentPassword: pwd.current, newPassword: pwd.newPwd } }),
      });
      if (res.ok) {
        toast.success("Password changed successfully");
        setPwd({ current: "", newPwd: "", confirm: "" });
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to change password");
      }
    } finally { setPwdSaving(false); }
  };

  const initials = (profile.businessName || "V").substring(0, 2).toUpperCase();

  return (
    <div className="space-y-6">

      {/* ── Tab Bar ── */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {([
          { key: "profile", label: "Profile", Icon: User },
          { key: "security", label: "Security", Icon: Shield },
        ] as const).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === key
                ? "bg-white text-charcoal shadow-sm"
                : "text-gray-500 hover:text-charcoal"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          PROFILE TAB
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "profile" && (
        <div className="space-y-5">

          {/* Photo + name hero */}
          <Card className="border-gray-100 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-burgundy/10 via-burgundy/5 to-transparent" />
            <CardContent className="px-6 pb-6 -mt-10">
              <div className="flex items-end gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-white ring-4 ring-white shadow-md overflow-hidden flex items-center justify-center">
                    {profile.image ? (
                      <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-burgundy/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-burgundy">{initials}</span>
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="photo-upload"
                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-burgundy rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-burgundy/90 transition-colors"
                  >
                    {photoSaving
                      ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                      : <Camera className="w-3.5 h-3.5 text-white" />}
                  </label>
                  <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </div>

                {/* Name + hint */}
                <div className="pb-1">
                  <p className="text-lg font-bold text-charcoal leading-tight">{profile.businessName || "Your Business"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {CATEGORY_LABELS[profile.category] || "Vendor"}{profile.location ? ` · ${profile.location}` : ""}
                  </p>
                  <p className="text-[11px] text-gray-300 mt-2">Click the camera icon to change your photo · Max 2MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business info */}
          <Card className="border-gray-100 shadow-sm">
            <div className="px-6 pt-5 pb-1 border-b border-gray-50">
              <p className="text-sm font-semibold text-charcoal">Business Information</p>
              <p className="text-xs text-gray-400 mt-0.5">Hover any field and click the pencil to edit</p>
            </div>
            <CardContent className="px-6 py-0">

              <EditableField label="Business Name" icon={Building2} value={profile.businessName}
                onSave={v => saveField("businessName", v)} />

              <EditableField label="Email Address" icon={Mail} value={profile.email}
                onSave={v => saveField("email", v)} />

              <EditableField label="Phone Number" icon={Phone} value={profile.phone}
                onSave={v => saveField("phone", v)}
                renderDisplay={val => val || <span className="text-gray-300 italic">Not set</span>} />

              <EditableField label="Business Description" icon={User} value={profile.bio} multiline
                onSave={v => saveField("bio", v)}
                renderDisplay={val => val
                  ? <span className="text-sm text-gray-600 leading-relaxed">{val}</span>
                  : <span className="text-gray-300 italic">No description yet</span>} />

              <EditableField
                label="Service Category" icon={Tag} value={profile.category}
                onSave={v => saveField("category", v)}
                renderDisplay={val => val
                  ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-burgundy/8 text-burgundy text-xs font-medium rounded-full">{CATEGORY_LABELS[val] || val}</span>
                  : <span className="text-gray-300 italic">Not set</span>}
              >
                {(draft, setDraft) => (
                  <select value={draft} onChange={e => setDraft(e.target.value)} autoFocus
                    className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30">
                    <option value="">Select a category</option>
                    {Object.entries(CATEGORY_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                )}
              </EditableField>

              <EditableField
                label="Location" icon={MapPin} value={profile.location}
                onSave={v => saveField("location", v)}
                renderDisplay={val => val
                  ? <span className="flex items-center gap-1.5 text-sm text-charcoal"><MapPin className="w-3.5 h-3.5 text-gray-400" />{val}</span>
                  : <span className="text-gray-300 italic">Not set</span>}
              />

              <EditableField
                label="Price Range" icon={BadgeDollarSign} value={profile.priceRange}
                onSave={v => saveField("priceRange", v)}
                renderDisplay={val => val
                  ? <span className="flex items-center gap-1.5 text-sm text-charcoal"><CreditCard className="w-3.5 h-3.5 text-gray-400" />{PRICE_LABELS[val] || val}</span>
                  : <span className="text-gray-300 italic">Not set</span>}
              >
                {(draft, setDraft) => (
                  <select value={draft} onChange={e => setDraft(e.target.value)} autoFocus
                    className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30">
                    <option value="">Select price range</option>
                    {Object.entries(PRICE_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                )}
              </EditableField>

            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SECURITY TAB
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "security" && (
        <div className="grid lg:grid-cols-5 gap-5">

          {/* Password form — 3 cols */}
          <Card className="lg:col-span-3 border-gray-100 shadow-sm">
            <div className="px-6 pt-5 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-burgundy/10 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-burgundy" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">Change Password</p>
                  <p className="text-xs text-gray-400">Choose a strong password of at least 6 characters</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <form onSubmit={handlePasswordChange} className="space-y-5">

                {/* Current password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPwd.current ? "text" : "password"}
                      value={pwd.current}
                      onChange={e => setPwd({ ...pwd, current: e.target.value })}
                      placeholder="Enter your current password"
                      required className="pr-10 h-10"
                    />
                    <button type="button"
                      onClick={() => setShowPwd({ ...showPwd, current: !showPwd.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPwd.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New password + strength */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPwd.newPwd ? "text" : "password"}
                      value={pwd.newPwd}
                      onChange={e => setPwd({ ...pwd, newPwd: e.target.value })}
                      placeholder="Min. 8 characters recommended"
                      required className="pr-10 h-10"
                    />
                    <button type="button"
                      onClick={() => setShowPwd({ ...showPwd, newPwd: !showPwd.newPwd })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPwd.newPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {pwd.newPwd && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : "bg-gray-100"}`} />
                        ))}
                      </div>
                      <p className={`text-[11px] font-medium ${
                        strength.score <= 1 ? "text-red-400" : strength.score === 2 ? "text-yellow-500" : strength.score === 3 ? "text-blue-500" : "text-green-500"
                      }`}>{strength.label}</p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPwd.confirm ? "text" : "password"}
                      value={pwd.confirm}
                      onChange={e => setPwd({ ...pwd, confirm: e.target.value })}
                      placeholder="Re-enter your new password"
                      required
                      className={`pr-10 h-10 ${pwdMismatch ? "border-red-300 focus-visible:ring-red-200" : pwdMatch ? "border-green-300 focus-visible:ring-green-200" : ""}`}
                    />
                    <button type="button"
                      onClick={() => setShowPwd({ ...showPwd, confirm: !showPwd.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPwd.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {pwdMismatch && (
                    <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Passwords don't match
                    </p>
                  )}
                  {pwdMatch && (
                    <p className="text-[11px] text-green-500 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Passwords match
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={pwdSaving || !pwd.current || !pwd.newPwd || !pwd.confirm || !!pwdMismatch}
                  className="w-full bg-burgundy hover:bg-burgundy/90 text-white h-10 gap-2 disabled:opacity-50"
                >
                  {pwdSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : <><KeyRound className="w-4 h-4" /> Update Password</>}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security tips — 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-gray-100 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-charcoal">Security Tips</p>
                </div>
                <ul className="space-y-3">
                  {[
                    "Use at least 8 characters",
                    "Mix uppercase & lowercase letters",
                    "Include numbers and symbols",
                    "Don't reuse old passwords",
                    "Never share your password",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-500">
                      <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-green-500" />
                      </div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-50 shadow-sm bg-orange-50/50">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-orange-700 mb-1">Keep your account safe</p>
                    <p className="text-xs text-orange-600 leading-relaxed">
                      If you suspect unauthorized access, change your password immediately and contact support.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
