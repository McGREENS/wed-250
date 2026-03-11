"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff, DollarSign, Clock, CheckCircle, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function ServicesClient({ initialServices }: any) {
    const [services, setServices] = useState(initialServices || []);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingService, setEditingService] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "", price: "", duration: "", features: "", image: "" });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image must be less than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const featuresArray = formData.features.split(",").map(f => f.trim());
        
        if (editingService) {
            await fetch("/api/vendor/services", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingService, action: "edit", data: { ...formData, features: featuresArray } }),
            });
            setServices(services.map((s: any) => s.id === editingService ? {
                ...s,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                image: formData.image,
                features: JSON.stringify({ duration: formData.duration, items: featuresArray })
            } : s));
            toast.success("Service updated successfully");
        } else {
            const res = await fetch("/api/vendor/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, features: featuresArray }),
            });
            const data = await res.json();
            setServices([...services, data.service]);
            toast.success("Service added successfully");
        }
        setFormData({ name: "", description: "", price: "", duration: "", features: "", image: "" });
        setShowAddForm(false);
        setEditingService(null);
    };

    const handleEdit = (service: any) => {
        const features = JSON.parse(service.features);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price.toString(),
            duration: features.duration,
            features: features.items.join(", "),
            image: service.image || ""
        });
        setEditingService(service.id);
        setShowAddForm(true);
    };

    const handleToggleActive = async (id: string) => {
        await fetch("/api/vendor/services", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, action: "toggleActive" }),
        });
        setServices(services.map((s: any) => s.id === id ? { ...s, active: !s.active } : s));
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/vendor/services?id=${id}`, { method: "DELETE" });
        setServices(services.filter((s: any) => s.id !== id));
        toast.success("Service deleted successfully");
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-charcoal mb-2">Services & Packages</h1>
                    <p className="text-gray-600">Manage your service offerings and pricing</p>
                </div>
                {!showAddForm && (
                    <Button onClick={() => setShowAddForm(true)} className="bg-burgundy hover:bg-burgundy-light text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Service
                    </Button>
                )}
            </div>

            {showAddForm && (
                <Card className="border-gray-100 shadow-sm mb-6">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle>{editingService ? "Edit Service" : "Add New Service"}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Service Name</label>
                                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Full Day Wedding Coverage" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">Duration</label>
                                    <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g., 10 hours" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Service Image</label>
                                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                                {formData.image && (
                                    <div className="mt-2">
                                        <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Description</label>
                                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe what's included..." rows={3} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Price (RWF)</label>
                                <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="2500000" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Features (comma-separated)</label>
                                <Input value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="500+ Photos, Online Gallery, Professional Editing" required />
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit" className="bg-burgundy hover:bg-burgundy-light text-white">
                                    {editingService ? "Update Service" : "Add Service"}
                                </Button>
                                <Button type="button" onClick={() => { setShowAddForm(false); setEditingService(null); setFormData({ name: "", description: "", price: "", duration: "", features: "", image: "" }); }} variant="outline">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {services.map((service: any) => {
                    const features = JSON.parse(service.features);
                    return (
                        <Card key={service.id} className={`border-gray-100 shadow-sm overflow-hidden ${!service.active && 'opacity-60'}`}>
                            {service.image && (
                                <div className="w-full h-48 overflow-hidden">
                                    <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-semibold text-charcoal">{service.name}</h3>
                                            <Badge className={service.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                                {service.active ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <DollarSign className="w-4 h-4 text-burgundy" />
                                        <div>
                                            <p className="text-gray-500 text-xs">Price</p>
                                            <p className="font-semibold text-charcoal">RWF {service.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-burgundy" />
                                        <div>
                                            <p className="text-gray-500 text-xs">Duration</p>
                                            <p className="font-semibold text-charcoal">{features.duration}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <p className="text-xs font-semibold text-gray-600 mb-2">Included Features:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {features.items.map((feature: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-1 text-xs bg-sand/30 px-2 py-1 rounded">
                                                <CheckCircle className="w-3 h-3 text-green-600" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                                    <Button onClick={() => handleToggleActive(service.id)} variant="outline" size="sm">
                                        {service.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </Button>
                                    <Button onClick={() => handleEdit(service)} variant="outline" size="sm">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button onClick={() => handleDelete(service.id)} variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
