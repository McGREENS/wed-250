"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Upload, Image as ImageIcon, Video, Eye, EyeOff, Trash2, Star, Grid3x3, List, Edit, X } from "lucide-react";
import { toast } from "sonner";

const MAX_PHOTOS = 30;
const MAX_VIDEOS = 20;

export default function PortfolioClient({ initialPortfolio }: any) {
    const [portfolioItems, setPortfolioItems] = useState(initialPortfolio || []);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [activeTab, setActiveTab] = useState("all");
    const [uploadOpen, setUploadOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadData, setUploadData] = useState({ title: "", category: "", type: "image", file: "" });
    const [editData, setEditData] = useState({ title: "", category: "" });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        
        if (!isImage && !isVideo) {
            toast.error("Please select an image or video file");
            return;
        }

        const maxSize = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error(`File must be less than ${isImage ? "5MB" : "50MB"}`);
            return;
        }

        const photoCount = portfolioItems.filter((item: any) => item.type === "image").length;
        const videoCount = portfolioItems.filter((item: any) => item.type === "video").length;

        if (isImage && photoCount >= MAX_PHOTOS) {
            toast.error(`Maximum ${MAX_PHOTOS} photos allowed`);
            return;
        }
        if (isVideo && videoCount >= MAX_VIDEOS) {
            toast.error(`Maximum ${MAX_VIDEOS} videos allowed`);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadData({ ...uploadData, file: reader.result as string, type: isImage ? "image" : "video" });
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!uploadData.title || !uploadData.category || !uploadData.file) {
            toast.error("Please fill all fields and select a file");
            return;
        }

        setUploading(true);
        const res = await fetch("/api/vendor/portfolio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(uploadData),
        });

        if (res.ok) {
            const data = await res.json();
            setPortfolioItems([...portfolioItems, data.item]);
            toast.success("Media uploaded successfully");
            setUploadOpen(false);
            setUploadData({ title: "", category: "", type: "image", file: "" });
        } else {
            const error = await res.json();
            toast.error(error.error || "Failed to upload");
        }
        setUploading(false);
    };

    const handleToggleActive = async (id: string) => {
        await fetch("/api/vendor/portfolio", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, action: "toggleActive" }),
        });
        setPortfolioItems(portfolioItems.map((item: any) => item.id === id ? { ...item, active: !item.active } : item));
    };

    const handleToggleFeatured = async (id: string) => {
        await fetch("/api/vendor/portfolio", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, action: "toggleFeatured" }),
        });
        setPortfolioItems(portfolioItems.map((item: any) => item.id === id ? { ...item, featured: !item.featured } : item));
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/vendor/portfolio?id=${id}`, { method: "DELETE" });
        setPortfolioItems(portfolioItems.filter((item: any) => item.id !== id));
        toast.success("Item deleted successfully");
    };

    const handleView = (item: any) => {
        setSelectedItem(item);
        setViewOpen(true);
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setEditData({ title: item.title, category: item.category });
        setEditOpen(true);
    };

    const handleSaveEdit = async () => {
        await fetch("/api/vendor/portfolio", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedItem.id, action: "edit", data: editData }),
        });
        setPortfolioItems(portfolioItems.map((item: any) => 
            item.id === selectedItem.id ? { ...item, ...editData } : item
        ));
        toast.success("Item updated successfully");
        setEditOpen(false);
    };

    const filteredItems = portfolioItems.filter((item: any) => {
        if (activeTab === "all") return true;
        if (activeTab === "images") return item.type === "image";
        if (activeTab === "videos") return item.type === "video";
        if (activeTab === "featured") return item.featured;
        return true;
    });

    const photoCount = portfolioItems.filter((item: any) => item.type === "image").length;
    const videoCount = portfolioItems.filter((item: any) => item.type === "video").length;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-charcoal mb-2">Portfolio</h1>
                    <p className="text-gray-600">Photos: {photoCount}/{MAX_PHOTOS} • Videos: {videoCount}/{MAX_VIDEOS}</p>
                </div>
                <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-burgundy hover:bg-burgundy-light text-white">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Media
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Portfolio Item</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <Input value={uploadData.title} onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })} placeholder="e.g., Sarah & John Wedding" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <Input value={uploadData.category} onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })} placeholder="e.g., Wedding, Reception" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">File (Max: 5MB for photos, 50MB for videos)</label>
                                <Input type="file" accept="image/*,video/*" onChange={handleFileSelect} />
                            </div>
                            <Button onClick={handleUpload} disabled={uploading} className="w-full bg-burgundy hover:bg-burgundy-light text-white">
                                {uploading ? "Uploading..." : "Upload"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-gray-100 shadow-sm mb-6">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="bg-white border border-gray-100">
                                <TabsTrigger value="all">All ({portfolioItems.length})</TabsTrigger>
                                <TabsTrigger value="images"><ImageIcon className="w-4 h-4 mr-2" />Images ({photoCount})</TabsTrigger>
                                <TabsTrigger value="videos"><Video className="w-4 h-4 mr-2" />Videos ({videoCount})</TabsTrigger>
                                <TabsTrigger value="featured"><Star className="w-4 h-4 mr-2" />Featured</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="flex gap-2">
                            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-burgundy text-white" : ""}>
                                <Grid3x3 className="w-4 h-4" />
                            </Button>
                            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-burgundy text-white" : ""}>
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item: any) => (
                        <Card key={item.id} className={`border-gray-100 shadow-sm overflow-hidden ${!item.active && 'opacity-60'}`}>
                            <div className="relative w-full h-64 bg-gray-100 cursor-pointer" onClick={() => handleView(item)}>
                                {item.type === "image" ? (
                                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <video src={item.url} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                                            <Video className="w-12 h-12 text-white" />
                                        </div>
                                    </>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2 pointer-events-none">
                                    {item.featured && <Badge className="bg-yellow-500 text-white"><Star className="w-3 h-3 mr-1 fill-white" />Featured</Badge>}
                                    <Badge className={item.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>{item.active ? "Active" : "Hidden"}</Badge>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-charcoal mb-1">{item.title}</h3>
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                    <span>{item.category}</span>
                                    <span>{item.views} views</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleEdit(item)} variant="outline" size="sm" className="flex-1">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button onClick={() => handleToggleFeatured(item.id)} variant="outline" size="sm" className="flex-1">
                                        <Star className={`w-4 h-4 ${item.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                                    </Button>
                                    <Button onClick={() => handleToggleActive(item.id)} variant="outline" size="sm" className="flex-1">
                                        {item.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </Button>
                                    <Button onClick={() => handleDelete(item.id)} variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredItems.map((item: any) => (
                        <Card key={item.id} className={`border-gray-100 shadow-sm ${!item.active && 'opacity-60'}`}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-32 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => handleView(item)}>
                                        {item.type === "image" ? (
                                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="relative w-full h-full">
                                                <video src={item.url} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <Video className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-charcoal">{item.title}</h3>
                                            {item.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>{item.category}</span>
                                            <span>•</span>
                                            <span>{item.views} views</span>
                                            <Badge className={item.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>{item.active ? "Active" : "Hidden"}</Badge>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={() => handleEdit(item)} variant="outline" size="sm">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button onClick={() => handleToggleFeatured(item.id)} variant="outline" size="sm">
                                            <Star className={`w-4 h-4 ${item.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                                        </Button>
                                        <Button onClick={() => handleToggleActive(item.id)} variant="outline" size="sm">
                                            {item.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                        <Button onClick={() => handleDelete(item.id)} variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* View Dialog */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedItem?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
                            {selectedItem?.type === "image" ? (
                                <img src={selectedItem?.url} alt={selectedItem?.title} className="w-full h-auto max-h-[70vh] object-contain" />
                            ) : (
                                <video src={selectedItem?.url} controls autoPlay className="w-full h-auto max-h-[70vh] object-contain">
                                    <source src={selectedItem?.url} />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Category: {selectedItem?.category}</p>
                                <p className="text-sm text-gray-600">Views: {selectedItem?.views}</p>
                            </div>
                            <div className="flex gap-2">
                                {selectedItem?.featured && <Badge className="bg-yellow-500 text-white">Featured</Badge>}
                                <Badge className={selectedItem?.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                    {selectedItem?.active ? "Active" : "Hidden"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Portfolio Item</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Title</label>
                            <Input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <Input value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} />
                        </div>
                        <Button onClick={handleSaveEdit} className="w-full bg-burgundy hover:bg-burgundy-light text-white">
                            Save Changes
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
