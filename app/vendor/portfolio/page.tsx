"use client";

import { useState } from "react";
import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Upload, Image as ImageIcon, Video, Eye, EyeOff, Trash2, Star, Grid3x3, List } from "lucide-react";
import { toast } from "sonner";

export default function VendorPortfolioPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [activeTab, setActiveTab] = useState("all");

    const [portfolioItems, setPortfolioItems] = useState([
        {
            id: 1,
            type: "image",
            url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop",
            title: "Sarah & John Wedding",
            category: "Wedding",
            date: "2024-09-15",
            active: true,
            featured: true,
            views: 342
        },
        {
            id: 2,
            type: "image",
            url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
            title: "Emma & David Reception",
            category: "Reception",
            date: "2024-08-20",
            active: true,
            featured: false,
            views: 256
        },
        {
            id: 3,
            type: "video",
            url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop",
            title: "Jessica & Robert Highlights",
            category: "Video",
            date: "2024-07-10",
            active: true,
            featured: true,
            views: 489
        },
        {
            id: 4,
            type: "image",
            url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop",
            title: "Linda & James Ceremony",
            category: "Ceremony",
            date: "2024-06-05",
            active: true,
            featured: false,
            views: 198
        },
        {
            id: 5,
            type: "image",
            url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop",
            title: "Amanda & Chris Portraits",
            category: "Portraits",
            date: "2024-05-18",
            active: false,
            featured: false,
            views: 145
        },
        {
            id: 6,
            type: "image",
            url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
            title: "Michael & Sophie Engagement",
            category: "Engagement",
            date: "2024-04-22",
            active: true,
            featured: false,
            views: 287
        },
        {
            id: 7,
            type: "video",
            url: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&h=600&fit=crop",
            title: "Rachel & Tom Full Day",
            category: "Video",
            date: "2024-03-30",
            active: true,
            featured: false,
            views: 412
        },
        {
            id: 8,
            type: "image",
            url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop",
            title: "Grace & Daniel Details",
            category: "Details",
            date: "2024-02-14",
            active: false,
            featured: false,
            views: 167
        }
    ]);

    const handleToggleActive = (id: number) => {
        setPortfolioItems(items => items.map(item => 
            item.id === id ? { ...item, active: !item.active } : item
        ));
        const item = portfolioItems.find(i => i.id === id);
        toast.success(`${item?.title} ${item?.active ? 'hidden' : 'published'}`);
    };

    const handleToggleFeatured = (id: number) => {
        setPortfolioItems(items => items.map(item => 
            item.id === id ? { ...item, featured: !item.featured } : item
        ));
        const item = portfolioItems.find(i => i.id === id);
        toast.success(`${item?.title} ${item?.featured ? 'removed from' : 'added to'} featured`);
    };

    const handleDelete = (id: number) => {
        setPortfolioItems(items => items.filter(item => item.id !== id));
        toast.success("Item deleted successfully");
    };

    const handleUpload = () => {
        toast.success("Upload functionality coming soon");
    };

    const filteredItems = portfolioItems.filter(item => {
        if (activeTab === "all") return true;
        if (activeTab === "images") return item.type === "image";
        if (activeTab === "videos") return item.type === "video";
        if (activeTab === "featured") return item.featured;
        return true;
    });

    return (
        <VendorPageLayout>
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-charcoal mb-2">Portfolio</h1>
                            <p className="text-gray-600">Showcase your best work to potential clients</p>
                        </div>
                        <Button onClick={handleUpload} className="bg-burgundy hover:bg-burgundy-light text-white">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Media
                        </Button>
                    </div>

                    <Card className="border-gray-100 shadow-sm mb-6">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="bg-white border border-gray-100">
                                        <TabsTrigger value="all">
                                            All ({portfolioItems.length})
                                        </TabsTrigger>
                                        <TabsTrigger value="images">
                                            <ImageIcon className="w-4 h-4 mr-2" />
                                            Images ({portfolioItems.filter(i => i.type === "image").length})
                                        </TabsTrigger>
                                        <TabsTrigger value="videos">
                                            <Video className="w-4 h-4 mr-2" />
                                            Videos ({portfolioItems.filter(i => i.type === "video").length})
                                        </TabsTrigger>
                                        <TabsTrigger value="featured">
                                            <Star className="w-4 h-4 mr-2" />
                                            Featured ({portfolioItems.filter(i => i.featured).length})
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                <div className="flex gap-2">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                        className={viewMode === "grid" ? "bg-burgundy text-white" : ""}
                                    >
                                        <Grid3x3 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                        className={viewMode === "list" ? "bg-burgundy text-white" : ""}
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {viewMode === "grid" ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map((item) => (
                                <Card key={item.id} className={`border-gray-100 shadow-sm overflow-hidden ${!item.active && 'opacity-60'}`}>
                                    <div className="relative aspect-video bg-gray-100">
                                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                        {item.type === "video" && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <Video className="w-12 h-12 text-white" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            {item.featured && (
                                                <Badge className="bg-yellow-500 text-white">
                                                    <Star className="w-3 h-3 mr-1 fill-white" />
                                                    Featured
                                                </Badge>
                                            )}
                                            <Badge className={item.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                                {item.active ? "Active" : "Hidden"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-charcoal mb-1">{item.title}</h3>
                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                            <span>{item.category}</span>
                                            <span>{item.views} views</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleToggleFeatured(item.id)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                            >
                                                <Star className={`w-4 h-4 ${item.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                                            </Button>
                                            <Button
                                                onClick={() => handleToggleActive(item.id)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                            >
                                                {item.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(item.id)}
                                                variant="outline"
                                                size="sm"
                                                className="border-red-300 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredItems.map((item) => (
                                <Card key={item.id} className={`border-gray-100 shadow-sm ${!item.active && 'opacity-60'}`}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-32 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                                {item.type === "video" && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                        <Video className="w-6 h-6 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-charcoal">{item.title}</h3>
                                                    {item.featured && (
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>{item.category}</span>
                                                    <span>•</span>
                                                    <span>{new Date(item.date).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{item.views} views</span>
                                                    <Badge className={item.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                                        {item.active ? "Active" : "Hidden"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => handleToggleFeatured(item.id)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Star className={`w-4 h-4 ${item.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                                                </Button>
                                                <Button
                                                    onClick={() => handleToggleActive(item.id)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    {item.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(item.id)}
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
                    )}
                </div>
        </VendorPageLayout>
    );
}
