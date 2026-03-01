"use client";

import { useState } from "react";
import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff, DollarSign, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function VendorServicesPage() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingService, setEditingService] = useState<number | null>(null);

    const [services, setServices] = useState([
        {
            id: 1,
            name: "Full Day Wedding Coverage",
            description: "Up to 10 hours of coverage, 500+ high-resolution photos, online gallery, and professional editing.",
            price: 2500,
            duration: "10 hours",
            features: ["500+ Photos", "Online Gallery", "Professional Editing", "USB Drive"],
            active: true,
            bookings: 24
        },
        {
            id: 2,
            name: "Essential Half Day",
            description: "Up to 5 hours of coverage, 250+ high-resolution photos, perfect for small ceremonies.",
            price: 1500,
            duration: "5 hours",
            features: ["250+ Photos", "Online Gallery", "Professional Editing"],
            active: true,
            bookings: 18
        },
        {
            id: 3,
            name: "Elopement Special",
            description: "Up to 3 hours of coverage, 100+ photos, focused on intimate couple portraiture.",
            price: 950,
            duration: "3 hours",
            features: ["100+ Photos", "Online Gallery", "Quick Turnaround"],
            active: true,
            bookings: 12
        },
        {
            id: 4,
            name: "Engagement Session",
            description: "2-hour photo session at location of your choice, 50+ edited photos.",
            price: 400,
            duration: "2 hours",
            features: ["50+ Photos", "Location Flexibility", "Outfit Changes"],
            active: false,
            bookings: 8
        }
    ]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        duration: "",
        features: ""
    });

    const handleToggleActive = (id: number) => {
        setServices(services.map(s => s.id === id ? { ...s, active: !s.active } : s));
        const service = services.find(s => s.id === id);
        toast.success(`${service?.name} ${service?.active ? 'deactivated' : 'activated'}`);
    };

    const handleDelete = (id: number) => {
        setServices(services.filter(s => s.id !== id));
        toast.success("Service deleted successfully");
    };

    const handleEdit = (id: number) => {
        const service = services.find(s => s.id === id);
        if (service) {
            setFormData({
                name: service.name,
                description: service.description,
                price: service.price.toString(),
                duration: service.duration,
                features: service.features.join(", ")
            });
            setEditingService(id);
            setShowAddForm(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingService) {
            setServices(services.map(s => s.id === editingService ? {
                ...s,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                duration: formData.duration,
                features: formData.features.split(",").map(f => f.trim())
            } : s));
            toast.success("Service updated successfully");
        } else {
            const newService = {
                id: services.length + 1,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                duration: formData.duration,
                features: formData.features.split(",").map(f => f.trim()),
                active: true,
                bookings: 0
            };
            setServices([...services, newService]);
            toast.success("Service added successfully");
        }
        setFormData({ name: "", description: "", price: "", duration: "", features: "" });
        setShowAddForm(false);
        setEditingService(null);
    };

    const handleCancel = () => {
        setFormData({ name: "", description: "", price: "", duration: "", features: "" });
        setShowAddForm(false);
        setEditingService(null);
    };

    return (
        <VendorPageLayout>
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
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g., Full Day Wedding Coverage"
                                                required
                                                className="border-gray-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal mb-2">Duration</label>
                                            <Input
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                placeholder="e.g., 10 hours"
                                                required
                                                className="border-gray-200"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal mb-2">Description</label>
                                        <Textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe what's included in this service..."
                                            rows={3}
                                            required
                                            className="border-gray-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal mb-2">Price (USD)</label>
                                        <Input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="2500"
                                            required
                                            className="border-gray-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal mb-2">Features (comma-separated)</label>
                                        <Input
                                            value={formData.features}
                                            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                            placeholder="500+ Photos, Online Gallery, Professional Editing"
                                            required
                                            className="border-gray-200"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button type="submit" className="bg-burgundy hover:bg-burgundy-light text-white">
                                            {editingService ? "Update Service" : "Add Service"}
                                        </Button>
                                        <Button type="button" onClick={handleCancel} variant="outline">
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        {services.map((service) => (
                            <Card key={service.id} className={`border-gray-100 shadow-sm ${!service.active && 'opacity-60'}`}>
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
                                                <p className="font-semibold text-charcoal">${service.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4 text-burgundy" />
                                            <div>
                                                <p className="text-gray-500 text-xs">Duration</p>
                                                <p className="font-semibold text-charcoal">{service.duration}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-xs font-semibold text-gray-600 mb-2">Included Features:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {service.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-1 text-xs bg-sand/30 px-2 py-1 rounded">
                                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                                    <span className="text-gray-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold text-burgundy">{service.bookings}</span> bookings
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleToggleActive(service.id)}
                                                variant="outline"
                                                size="sm"
                                                className="border-gray-200"
                                            >
                                                {service.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                onClick={() => handleEdit(service.id)}
                                                variant="outline"
                                                size="sm"
                                                className="border-gray-200"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(service.id)}
                                                variant="outline"
                                                size="sm"
                                                className="border-red-300 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
        </VendorPageLayout>
    );
}
