"use client";

import { useState, useEffect } from "react";
import { Copy, Mail, Check, UserPlus, Users, Clock, CheckCircle, XCircle, Loader2, MessageCircle, Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface Referral {
  id: string;
  referralCode: string;
  referredEmail: string;
  referredName: string | null;
  referredRole: "COUPLE" | "VENDOR";
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELLED";
  emailSent: boolean;
  emailSentAt: string | null;
  acceptedAt: string | null;
  expiresAt: string;
  createdAt: string;
  referredUserName: string | null;
}

interface PublicReferralLink {
  id: string;
  referralCode: string;
  referralRole: "COUPLE" | "VENDOR";
  title: string;
  description: string | null;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function ReferralsClient({ userRole }: { userRole: string }) {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [publicLinks, setPublicLinks] = useState<PublicReferralLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPublicLinkModal, setShowPublicLinkModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingEmail, setEditingEmail] = useState("");
  const [formData, setFormData] = useState({
    referredEmail: "",
    referredName: "",
    referredRole: "COUPLE" as "COUPLE" | "VENDOR",
  });
  const [publicLinkForm, setPublicLinkForm] = useState({
    title: "",
    description: "",
    referralRole: "COUPLE" as "COUPLE" | "VENDOR",
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

  useEffect(() => {
    fetchReferrals();
    fetchPublicLinks();
    
    // Auto-refresh referrals every 10 seconds to catch status changes
    const interval = setInterval(fetchReferrals, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchReferrals = async () => {
    try {
      const res = await fetch("/api/referrals");
      if (res.ok) {
        const data = await res.json();
        setReferrals(data.referrals || []);
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
      toast.error("Failed to load referrals");
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicLinks = async () => {
    try {
      const res = await fetch("/api/referrals/public");
      if (res.ok) {
        const data = await res.json();
        setPublicLinks(data.links || []);
      }
    } catch (error) {
      console.error("Error fetching public links:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Invitation sent successfully!");
        setShowModal(false);
        setFormData({ referredEmail: "", referredName: "", referredRole: "COUPLE" });
        await fetchReferrals();
      } else {
        toast.error(data.error || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  const handleCreatePublicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch("/api/referrals/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publicLinkForm),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Public referral link created successfully!");
        setShowPublicLinkModal(false);
        setPublicLinkForm({ title: "", description: "", referralRole: "COUPLE" });
        await fetchPublicLinks();
      } else {
        toast.error(data.error || "Failed to create public link");
      }
    } catch (error) {
      console.error("Error creating public link:", error);
      toast.error("Failed to create public link");
    } finally {
      setSending(false);
    }
  };

  const togglePublicLink = async (linkId: string, isActive: boolean) => {
    try {
      const res = await fetch("/api/referrals/public", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: linkId, isActive: !isActive }),
      });

      if (res.ok) {
        toast.success(isActive ? "Link deactivated" : "Link activated");
        await fetchPublicLinks();
      } else {
        toast.error("Failed to update link");
      }
    } catch (error) {
      console.error("Error updating link:", error);
      toast.error("Failed to update link");
    }
  };

  const deletePublicLink = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this public link?")) return;

    try {
      const res = await fetch("/api/referrals/public", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: linkId }),
      });

      if (res.ok) {
        toast.success("Public link deleted");
        await fetchPublicLinks();
      } else {
        toast.error("Failed to delete link");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Failed to delete link");
    }
  };

  const copyReferralLink = (code: string) => {
    const link = `${baseUrl}/signup?ref=${code}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied to clipboard!");
  };

  const copyPublicLink = (code: string) => {
    const link = `${baseUrl}/signup?ref=${code}`;
    navigator.clipboard.writeText(link);
    toast.success("Public referral link copied to clipboard!");
  };

  const shareOnWhatsApp = (code: string) => {
    const link = `${baseUrl}/signup?ref=${code}`;
    const message = `Hey, Take a look at this platform, you can sign up through my referral link: ${link}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const startEditing = (referral: Referral) => {
    setEditingId(referral.id);
    setEditingEmail(referral.referredEmail);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingEmail("");
  };

  const saveEmail = async (referralId: string) => {
    if (!editingEmail.trim()) {
      toast.error("Email cannot be empty");
      return;
    }

    try {
      const res = await fetch(`/api/referrals/${referralId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referredEmail: editingEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Email updated successfully");
        setEditingId(null);
        setEditingEmail("");
        await fetchReferrals();
      } else {
        toast.error(data.error || "Failed to update email");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email");
    }
  };

  const resendEmail = async (referralId: string, email: string) => {
    try {
      const res = await fetch(`/api/referrals/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Invitation resent to ${email}`);
        await fetchReferrals();
      } else {
        toast.error(data.error || "Failed to resend invitation");
      }
    } catch (error) {
      console.error("Error resending email:", error);
      toast.error("Failed to resend invitation");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-sand text-charcoal",
      ACCEPTED: "bg-gold text-charcoal",
      EXPIRED: "bg-charcoal/70 text-cream",
      CANCELLED: "bg-burgundy-light text-cream",
    };
    return styles[status as keyof typeof styles] || styles.PENDING;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "ACCEPTED":
        return <CheckCircle className="w-4 h-4" />;
      case "EXPIRED":
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const stats = {
    total: referrals.length,
    pending: referrals.filter((r) => r.status === "PENDING").length,
    accepted: referrals.filter((r) => r.status === "ACCEPTED").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Referrals</h1>
          <p className="text-gray-600 mt-1">Invite others to join the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              fetchReferrals();
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh referrals"
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Send Invitation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-cream p-6 rounded-lg shadow-sm border border-burgundy/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-burgundy/15 rounded-lg">
              <Users className="w-6 h-6 text-burgundy" />
            </div>
            <div>
              <p className="text-sm text-charcoal/60">Total Referrals</p>
              <p className="text-2xl font-bold text-burgundy">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-cream p-6 rounded-lg shadow-sm border border-sand">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sand rounded-lg">
              <Clock className="w-6 h-6 text-charcoal/70" />
            </div>
            <div>
              <p className="text-sm text-charcoal/60">Pending</p>
              <p className="text-2xl font-bold text-charcoal">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-gold p-6 rounded-lg shadow-sm border border-gold">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-charcoal" />
            </div>
            <div>
              <p className="text-sm text-charcoal/70">Accepted</p>
              <p className="text-2xl font-bold text-charcoal">{stats.accepted}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-charcoal">Public Referral Links</h2>
        <button
          onClick={() => setShowPublicLinkModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Create Link
        </button>
      </div>

      <div className="bg-cream rounded-lg shadow-sm border border-burgundy/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand/50 border-b border-burgundy/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publicLinks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <p>No public referral links yet</p>
                    <p className="text-sm mt-1">Create a reusable link to share with multiple people</p>
                  </td>
                </tr>
              ) : (
                publicLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-charcoal">{link.title}</div>
                        {link.description && (
                          <div className="text-sm text-gray-500 mt-1">{link.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-burgundy/10 text-burgundy">
                        {link.referralRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {link.usageCount} {link.usageCount === 1 ? "use" : "uses"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          link.isActive
                            ? "bg-gold text-charcoal"
                            : "bg-charcoal/70 text-cream"
                        }`}
                      >
                        {link.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => copyPublicLink(link.referralCode)}
                          className="text-burgundy hover:text-burgundy/80 flex items-center gap-1"
                          title="Copy link"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </button>
                        <button
                          onClick={() => togglePublicLink(link.id, link.isActive)}
                          className={`flex items-center gap-1 ${
                            link.isActive
                              ? "text-charcoal/70 hover:text-charcoal"
                              : "text-gold hover:text-gold/80"
                          }`}
                          title={link.isActive ? "Deactivate" : "Activate"}
                        >
                          {link.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => deletePublicLink(link.id)}
                          className="text-burgundy-light hover:text-burgundy flex items-center gap-1"
                          title="Delete link"
                        >
                          <X className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-cream rounded-lg shadow-sm border border-burgundy/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand/50 border-b border-burgundy/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invitee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No referrals yet</p>
                    <p className="text-sm mt-1">Start inviting people to join the platform</p>
                  </td>
                </tr>
              ) : (
                referrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-charcoal">
                          {referral.referredName || "N/A"}
                        </div>
                        {editingId === referral.id ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="email"
                              value={editingEmail}
                              onChange={(e) => setEditingEmail(e.target.value)}
                              className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-burgundy focus:border-transparent"
                            />
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">{referral.referredEmail}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-burgundy/10 text-burgundy">
                        {referral.referredRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                          referral.status
                        )}`}
                      >
                        {getStatusIcon(referral.status)}
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {referral.emailSent ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <Check className="w-4 h-4" />
                          Sent
                        </span>
                      ) : (
                        <span className="text-gray-400">Not sent</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(referral.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        {editingId === referral.id ? (
                          <>
                            <button
                              onClick={() => saveEmail(referral.id)}
                              className="text-green-600 hover:text-green-800 flex items-center gap-1"
                              title="Save email"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => copyReferralLink(referral.referralCode)}
                              className="text-burgundy hover:text-burgundy/80 flex items-center gap-1"
                              title="Copy referral link"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Link
                            </button>
                            <button
                              onClick={() => shareOnWhatsApp(referral.referralCode)}
                              className="text-green-600 hover:text-green-800 flex items-center gap-1"
                              title="Share on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                              WhatsApp
                            </button>
                            <button
                              onClick={() => startEditing(referral)}
                              className="text-orange-600 hover:text-orange-800 flex items-center gap-1"
                              title="Edit email"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            {referral.status === "PENDING" && (
                              <button
                                onClick={() => resendEmail(referral.id, referral.referredEmail)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                title="Resend invitation email"
                              >
                                <Mail className="w-4 h-4" />
                                Resend
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Send Invitation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.referredEmail}
                  onChange={(e) => setFormData({ ...formData, referredEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  placeholder="invitee@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.referredName}
                  onChange={(e) => setFormData({ ...formData, referredName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invite as *
                </label>
                <select
                  value={formData.referredRole}
                  onChange={(e) =>
                    setFormData({ ...formData, referredRole: e.target.value as "COUPLE" | "VENDOR" })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                >
                  <option value="COUPLE">Couple</option>
                  <option value="VENDOR">Vendor</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={sending}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPublicLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Create Public Referral Link</h2>
            <form onSubmit={handleCreatePublicLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Title *
                </label>
                <input
                  type="text"
                  required
                  value={publicLinkForm.title}
                  onChange={(e) => setPublicLinkForm({ ...publicLinkForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  placeholder="e.g., Wedding Planning Referral"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={publicLinkForm.description || ""}
                  onChange={(e) => setPublicLinkForm({ ...publicLinkForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  placeholder="Add a description for this link"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invite as *
                </label>
                <select
                  value={publicLinkForm.referralRole}
                  onChange={(e) =>
                    setPublicLinkForm({ ...publicLinkForm, referralRole: e.target.value as "COUPLE" | "VENDOR" })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                >
                  <option value="COUPLE">Couple</option>
                  <option value="VENDOR">Vendor</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPublicLinkModal(false)}
                  disabled={sending}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create Link
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}