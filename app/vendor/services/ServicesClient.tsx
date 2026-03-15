"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff, DollarSign, Clock, CheckCircle, Upload, ImageIcon, Video, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ServiceCreationWizard from "./ServiceCreationWizard";

export default function ServicesClient({ initialServices, initialPortfolio }: any) {
    const [services, setServices] = useState(initialServices || []);
    const [showWizard, setShowWizard] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [portfolioItems, setPortfolioItems] = useState(initialPortfolio || []);
    const [uploadingForService, setUploadingForService] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pendingServiceId, setPendingServiceId] = useState<string | null>(null);

    const handleVenueFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, serviceId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        if (!isImage && !isVideo) { toast.error('Please select an image or video file'); return; }
        const maxSize = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
        if (file.size > maxSize) { toast.error(`File must be less than ${isImage ? '5MB' : '50MB'}`); return; }
        setUploadingForService(serviceId);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const res = await fetch('/api/vendor/portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file: reader.result, type: isImage ? 'image' : 'video', title: file.name.replace(/\.[^.]+$/, ''), category: 'Venue', serviceId }),
            });
            if (res.ok) {
                const data = await res.json();
                setPortfolioItems((prev: any[]) => [...prev, data.item]);
                toast.success('Photo uploaded successfully');
            } else {
                const err = await res.json();
                toast.error(err.error || 'Upload failed');
            }
            setUploadingForService(null);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleRemoveVenuePhoto = async (id: string) => {
        await fetch(`/api/vendor/portfolio?id=${id}`, { method: 'DELETE' });
        setPortfolioItems((prev: any[]) => prev.filter((i: any) => i.id !== id));
        toast.success('Photo removed');
    };

    const handleEdit = (service: any) => {
        setEditingService(service);
        setShowWizard(true);
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
            {showWizard ? (
                <ServiceCreationWizard 
                    editMode={!!editingService}
                    initialData={editingService}
                    onComplete={(service: any) => {
                        if (editingService) {
                            setServices(services.map((s: any) => s.id === service.id ? service : s));
                        } else {
                            setServices([...services, service]);
                        }
                        setShowWizard(false);
                        setEditingService(null);
                    }}
                    onCancel={() => {
                        setShowWizard(false);
                        setEditingService(null);
                    }}
                />
            ) : (
                <>
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-charcoal mb-2">Services & Packages</h1>
                            <p className="text-gray-600">Manage your service offerings and pricing</p>
                        </div>
                        <Button onClick={() => setShowWizard(true)} className="bg-burgundy hover:bg-burgundy-light text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Service
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                {services.map((service: any) => {
                    let features: any = { duration: '', items: [] };
                    try { features = service.features ? JSON.parse(service.features) : features; } catch { features = { duration: '', items: [] }; }
                    let metadata: any = {};
                    try { metadata = service.metadata ? JSON.parse(service.metadata) : {}; } catch { metadata = {}; }
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
                                            <Badge className="bg-purple-100 text-purple-800">
                                                {service.serviceType || "General"}
                                            </Badge>
                                            <Badge className={service.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                                {service.active ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                        <h3 className="text-xl font-semibold text-charcoal mb-2">{service.name}</h3>
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
                                
                                {service.serviceType === "Venue" && (metadata.minCapacity || metadata.maxCapacity) && (
                                    <div className="mb-4 p-3 bg-sand/30 rounded-lg">
                                        <p className="text-xs font-semibold text-gray-600 mb-2">Venue Details:</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {(metadata.minCapacity || metadata.maxCapacity) && (
                                                <div><span className="text-gray-500">Capacity:</span> <span className="font-medium">{metadata.minCapacity || 0} - {metadata.maxCapacity || 0}</span></div>
                                            )}
                                            {metadata.venueType && (
                                                <div><span className="text-gray-500">Type:</span> <span className="font-medium capitalize">{metadata.venueType}</span></div>
                                            )}
                                        </div>
                                        {metadata.amenities && metadata.amenities.length > 0 && (
                                            <div className="mt-2">
                                                <span className="text-gray-500">Amenities:</span> <span className="font-medium">{metadata.amenities}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {service.serviceType === "Venue" && (
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs font-semibold text-gray-600">Venue Portfolio</p>
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*,video/*"
                                                    className="hidden"
                                                    onChange={(e) => handleVenueFileSelect(e, service.id)}
                                                    disabled={uploadingForService === service.id}
                                                />
                                                <span className="flex items-center gap-1 text-xs text-[#8B3A3A] font-medium hover:underline">
                                                    {uploadingForService === service.id
                                                        ? <><Loader2 className="w-3 h-3 animate-spin" /> Uploading...</>
                                                        : <><Upload className="w-3 h-3" /> Add Photo/Video</>}
                                                </span>
                                            </label>
                                        </div>
                                        {portfolioItems.filter((i: any) => i.serviceId === service.id).length === 0 ? (
                                            <p className="text-xs text-gray-400 italic">No venue photos yet. Add some to showcase your space.</p>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2">
                                                {portfolioItems.filter((i: any) => i.serviceId === service.id).map((item: any) => (
                                                    <div key={item.id} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
                                                        {item.type === 'image' ? (
                                                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="relative w-full h-full">
                                                                <video src={item.url} className="w-full h-full object-cover" />
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                                    <Video className="w-5 h-5 text-white" />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => handleRemoveVenuePhoto(item.id)}
                                                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                
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
                                    <Button onClick={() => handleEdit(service)} variant="outline" size="sm">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button onClick={() => handleToggleActive(service.id)} variant="outline" size="sm">
                                        {service.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                </>
            )}
        </div>
    );
}
