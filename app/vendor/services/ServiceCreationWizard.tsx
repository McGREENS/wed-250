"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Plus, ArrowLeft, ArrowRight, Check, Camera, Utensils, MapPin, Music, Palette, Users, Sparkles, Shirt } from "lucide-react";
import { toast } from "sonner";

const SERVICE_TYPES = [
    { value: "Photography", label: "Photography", icon: Camera, color: "bg-blue-100 text-blue-800" },
    { value: "Videography", label: "Videography", icon: Camera, color: "bg-purple-100 text-purple-800" },
    { value: "Catering", label: "Catering", icon: Utensils, color: "bg-orange-100 text-orange-800" },
    { value: "Venue", label: "Venue", icon: MapPin, color: "bg-green-100 text-green-800" },
    { value: "Decoration", label: "Decoration & Lighting", icon: Palette, color: "bg-pink-100 text-pink-800" },
    { value: "Music", label: "Music & Entertainment", icon: Music, color: "bg-indigo-100 text-indigo-800" },
    { value: "Planning", label: "Wedding Planning", icon: Users, color: "bg-yellow-100 text-yellow-800" },
    { value: "Makeup", label: "Hair & Makeup", icon: Sparkles, color: "bg-rose-100 text-rose-800" },
    { value: "Attire", label: "Attire & Fashion", icon: Shirt, color: "bg-teal-100 text-teal-800" },
];

export default function ServiceCreationWizard({ onComplete, onCancel, editMode = false, initialData = null }: any) {
    const [selectedType, setSelectedType] = useState<string | null>(editMode ? initialData?.serviceType : null);
    const [currentStep, setCurrentStep] = useState(editMode ? 1 : 0);
    const [formData, setFormData] = useState<any>(editMode ? {
        ...initialData,
        ...(initialData?.metadata ? JSON.parse(initialData.metadata) : {}),
        features: initialData?.features ? JSON.parse(initialData.features).items.join(', ') : '',
        amenities: initialData?.metadata ? JSON.parse(initialData.metadata).amenities : '',
    } : {});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        setCurrentStep(1);
        setFormData({ serviceType: type });
    };

    const handleBack = () => {
        if (currentStep === 1) {
            setSelectedType(null);
            setCurrentStep(0);
        } else {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const updateFormData = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const url = editMode ? "/api/vendor/services" : "/api/vendor/services";
            const method = editMode ? "PUT" : "POST";
            const body = editMode ? {
                id: initialData.id,
                action: "edit",
                data: formData
            } : formData;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success || res.ok) {
                toast.success(editMode ? "Service updated successfully!" : "Service created successfully!");
                onComplete(editMode ? { ...initialData, ...formData } : data.service);
            } else {
                toast.error(data.error || "Failed to save service");
                setIsSubmitting(false);
            }
        } catch (error) {
            toast.error("Failed to save service");
            setIsSubmitting(false);
        }
    };

    if (!selectedType) {
        return (
            <Card className="border-gray-100 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                    <CardTitle>{editMode ? "Edit Service Type" : "Select Service Type"}</CardTitle>
                    <p className="text-sm text-gray-600">{editMode ? "Change the type of service" : "Choose the type of service you want to offer"}</p>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        {SERVICE_TYPES.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.value}
                                    onClick={() => handleTypeSelect(type.value)}
                                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-burgundy hover:shadow-md transition-all text-left group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`p-3 rounded-lg ${type.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-charcoal group-hover:text-burgundy transition-colors">
                                        {type.label}
                                    </h3>
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button onClick={onCancel} variant="outline">Cancel</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {selectedType === "Photography" && (
                <PhotographyForm 
                    currentStep={currentStep}
                    formData={formData}
                    updateFormData={updateFormData}
                    onBack={handleBack}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            )}
            {selectedType === "Videography" && (
                <VideographyForm 
                    currentStep={currentStep}
                    formData={formData}
                    updateFormData={updateFormData}
                    onBack={handleBack}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            )}
            {selectedType === "Catering" && (
                <CateringForm 
                    currentStep={currentStep}
                    formData={formData}
                    updateFormData={updateFormData}
                    onBack={handleBack}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            )}
            {selectedType === "Venue" && (
                <VenueForm 
                    currentStep={currentStep}
                    formData={formData}
                    updateFormData={updateFormData}
                    onBack={handleBack}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            )}
            {selectedType === "Decoration" && (
                <DecorationForm 
                    currentStep={currentStep}
                    formData={formData}
                    updateFormData={updateFormData}
                    onBack={handleBack}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            )}
            {selectedType === "Music" && (
                <MusicForm 
                    currentStep={currentStep}
                    formData={formData}
                    updateFormData={updateFormData}
                    onBack={handleBack}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            )}
            {selectedType === "Planning" && (
                <PlanningForm 
                    currentStep={currentStep}
                    formData={formData}
                    updateFormData={updateFormData}
                    onBack={handleBack}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            )}
            {selectedType === "Makeup" && (
                <MakeupForm 
                    currentStep={currentStep}
                    formData={formData}
                    updateFormData={updateFormData}
                    onBack={handleBack}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            )}
            {selectedType === "Attire" && (
                <AttireForm 
                    currentStep={currentStep}
                    formData={formData}
                    updateFormData={updateFormData}
                    onBack={handleBack}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}

// Photography Form Component
function PhotographyForm({ currentStep, formData, updateFormData, onBack, onNext, onSubmit, isSubmitting }: any) {
    const steps = ["Basic Info", "Package Details", "Equipment & Style", "Pricing & Delivery"];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image must be less than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                updateFormData("image", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card className="border-gray-100 shadow-sm">
            <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <CardTitle>Photography Service Setup</CardTitle>
                    <Badge className="bg-blue-100 text-blue-800">Step {currentStep} of {steps.length}</Badge>
                </div>
                <div className="flex items-center gap-2">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex items-center flex-1">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${idx + 1 <= currentStep ? 'bg-burgundy text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {idx + 1 < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
                            </div>
                            {idx < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${idx + 1 < currentStep ? 'bg-burgundy' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-charcoal mb-4">Basic Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Package Name *</label>
                            <Input 
                                value={formData.name || ""} 
                                onChange={(e) => updateFormData("name", e.target.value)} 
                                placeholder="e.g., Premium Wedding Photography Package" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Package Description *</label>
                            <Textarea 
                                value={formData.description || ""} 
                                onChange={(e) => updateFormData("description", e.target.value)} 
                                placeholder="Describe what makes your photography service special..." 
                                rows={4} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Coverage Duration *</label>
                            <Input 
                                value={formData.duration || ""} 
                                onChange={(e) => updateFormData("duration", e.target.value)} 
                                placeholder="e.g., 10 hours, Full Day, 8-12 hours" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Package Image</label>
                            <Input type="file" accept="image/*" onChange={handleImageUpload} />
                            {formData.image && (
                                <div className="mt-2">
                                    <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-charcoal mb-4">Package Details</h3>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Number of Photographers *</label>
                            <Input 
                                type="number" 
                                value={formData.photographerCount || ""} 
                                onChange={(e) => updateFormData("photographerCount", e.target.value)} 
                                placeholder="e.g., 2" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Number of Edited Photos *</label>
                            <Input 
                                type="number" 
                                value={formData.photoCount || ""} 
                                onChange={(e) => updateFormData("photoCount", e.target.value)} 
                                placeholder="e.g., 500" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Photo Album Included?</label>
                            <select 
                                value={formData.albumIncluded || "no"} 
                                onChange={(e) => updateFormData("albumIncluded", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="no">No Album</option>
                                <option value="digital">Digital Album Only</option>
                                <option value="printed">Printed Album (20 pages)</option>
                                <option value="premium">Premium Album (40 pages)</option>
                                <option value="luxury">Luxury Album (60+ pages)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Prints Included?</label>
                            <Input 
                                value={formData.printsIncluded || ""} 
                                onChange={(e) => updateFormData("printsIncluded", e.target.value)} 
                                placeholder="e.g., 20 prints 8x10, 2 canvas prints" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Engagement/Pre-Wedding Shoot?</label>
                            <select 
                                value={formData.engagementShoot || "no"} 
                                onChange={(e) => updateFormData("engagementShoot", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="no">Not Included</option>
                                <option value="yes">Included (1 session)</option>
                                <option value="multiple">Multiple Sessions</option>
                            </select>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-charcoal mb-4">Equipment & Style</h3>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Photography Style *</label>
                            <select 
                                value={formData.photographyStyle || ""} 
                                onChange={(e) => updateFormData("photographyStyle", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select style</option>
                                <option value="traditional">Traditional/Classic</option>
                                <option value="photojournalistic">Photojournalistic/Documentary</option>
                                <option value="artistic">Artistic/Creative</option>
                                <option value="vintage">Vintage/Retro</option>
                                <option value="modern">Modern/Contemporary</option>
                                <option value="mixed">Mixed Style</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Camera Equipment *</label>
                            <Input 
                                value={formData.cameraEquipment || ""} 
                                onChange={(e) => updateFormData("cameraEquipment", e.target.value)} 
                                placeholder="e.g., Canon EOS R5, Sony A7IV, Professional Lenses" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Backup Equipment Available?</label>
                            <select 
                                value={formData.backupEquipment || "yes"} 
                                onChange={(e) => updateFormData("backupEquipment", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="yes">Yes, Full Backup</option>
                                <option value="partial">Partial Backup</option>
                                <option value="no">No Backup</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Drone Photography?</label>
                            <select 
                                value={formData.dronePhotography || "no"} 
                                onChange={(e) => updateFormData("dronePhotography", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="no">Not Available</option>
                                <option value="included">Included</option>
                                <option value="additional">Available (Additional Cost)</option>
                            </select>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-charcoal mb-4">Pricing & Delivery</h3>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Package Price (RWF) *</label>
                            <Input 
                                type="number" 
                                value={formData.price || ""} 
                                onChange={(e) => updateFormData("price", e.target.value)} 
                                placeholder="e.g., 1500000" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Delivery Timeline *</label>
                            <Input 
                                value={formData.deliveryTime || ""} 
                                onChange={(e) => updateFormData("deliveryTime", e.target.value)} 
                                placeholder="e.g., 4-6 weeks, 30 days" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Delivery Format *</label>
                            <Input 
                                value={formData.deliveryFormat || ""} 
                                onChange={(e) => updateFormData("deliveryFormat", e.target.value)} 
                                placeholder="e.g., Online Gallery, USB Drive, Cloud Storage" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Deposit Required? *</label>
                            <Input 
                                value={formData.depositRequired || ""} 
                                onChange={(e) => updateFormData("depositRequired", e.target.value)} 
                                placeholder="e.g., 30% deposit, 500,000 RWF" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Cancellation Policy *</label>
                            <Textarea 
                                value={formData.cancellationPolicy || ""} 
                                onChange={(e) => updateFormData("cancellationPolicy", e.target.value)} 
                                placeholder="Describe your cancellation and refund policy..." 
                                rows={3} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Additional Features (comma-separated)</label>
                            <Input 
                                value={formData.features || ""} 
                                onChange={(e) => updateFormData("features", e.target.value)} 
                                placeholder="e.g., Online Gallery, Professional Editing, Same-Day Highlights" 
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-6 pt-6 border-t border-gray-100">
                    <Button onClick={onBack} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    {currentStep < steps.length ? (
                        <Button onClick={onNext} className="bg-burgundy hover:bg-burgundy-light text-white">
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={onSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Create Service
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Placeholder components for other service types (to be implemented similarly)
function VideographyForm(props: any) { return <div>Videography Form - Coming Soon</div>; }
function CateringForm(props: any) { return <div>Catering Form - Coming Soon</div>; }
function VenueForm({ currentStep, formData, updateFormData, onBack, onNext, onSubmit, isSubmitting }: any) {
    const steps = ["Basic Info", "Capacity & Facilities", "Services & Amenities", "Pricing & Policies"];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image must be less than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                updateFormData("image", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card className="border-gray-100 shadow-sm">
            <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <CardTitle>Venue Service Setup</CardTitle>
                    <Badge className="bg-green-100 text-green-800">Step {currentStep} of {steps.length}</Badge>
                </div>
                <div className="flex items-center gap-2">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex items-center flex-1">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${idx + 1 <= currentStep ? 'bg-burgundy text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {idx + 1 < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
                            </div>
                            {idx < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${idx + 1 < currentStep ? 'bg-burgundy' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-charcoal mb-4">Basic Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Venue Name *</label>
                            <Input 
                                value={formData.name || ""} 
                                onChange={(e) => updateFormData("name", e.target.value)} 
                                placeholder="e.g., Grand Ballroom at Serena Hotel" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Venue Description *</label>
                            <Textarea 
                                value={formData.description || ""} 
                                onChange={(e) => updateFormData("description", e.target.value)} 
                                placeholder="Describe your venue, its ambiance, unique features..." 
                                rows={4} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Venue Type *</label>
                            <select 
                                value={formData.venueType || ""} 
                                onChange={(e) => updateFormData("venueType", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select venue type</option>
                                <option value="hotel">Hotel/Resort</option>
                                <option value="banquet">Banquet Hall</option>
                                <option value="garden">Garden/Outdoor</option>
                                <option value="restaurant">Restaurant</option>
                                <option value="beach">Beach/Waterfront</option>
                                <option value="historic">Historic Building</option>
                                <option value="barn">Barn/Rustic</option>
                                <option value="rooftop">Rooftop</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Location/Address *</label>
                            <Input 
                                value={formData.location || ""} 
                                onChange={(e) => updateFormData("location", e.target.value)} 
                                placeholder="e.g., KN 3 Ave, Kigali" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Venue Image</label>
                            <Input type="file" accept="image/*" onChange={handleImageUpload} />
                            {formData.image && (
                                <div className="mt-2">
                                    <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-charcoal mb-4">Capacity & Facilities</h3>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Maximum Guest Capacity *</label>
                            <Input 
                                type="number" 
                                value={formData.maxCapacity || ""} 
                                onChange={(e) => updateFormData("maxCapacity", e.target.value)} 
                                placeholder="e.g., 300" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Minimum Guest Capacity</label>
                            <Input 
                                type="number" 
                                value={formData.minCapacity || ""} 
                                onChange={(e) => updateFormData("minCapacity", e.target.value)} 
                                placeholder="e.g., 50" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Indoor/Outdoor? *</label>
                            <select 
                                value={formData.indoorOutdoor || ""} 
                                onChange={(e) => updateFormData("indoorOutdoor", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select option</option>
                                <option value="indoor">Indoor Only</option>
                                <option value="outdoor">Outdoor Only</option>
                                <option value="both">Both Indoor & Outdoor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Total Space Size</label>
                            <Input 
                                value={formData.spaceSize || ""} 
                                onChange={(e) => updateFormData("spaceSize", e.target.value)} 
                                placeholder="e.g., 500 sqm, 5000 sq ft" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Parking Capacity *</label>
                            <Input 
                                value={formData.parkingCapacity || ""} 
                                onChange={(e) => updateFormData("parkingCapacity", e.target.value)} 
                                placeholder="e.g., 100 cars, Valet available, Street parking" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Accessibility Features</label>
                            <Input 
                                value={formData.accessibility || ""} 
                                onChange={(e) => updateFormData("accessibility", e.target.value)} 
                                placeholder="e.g., Wheelchair accessible, Elevator, Ramps" 
                            />
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-charcoal mb-4">Services & Amenities</h3>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Catering Options *</label>
                            <select 
                                value={formData.cateringOptions || ""} 
                                onChange={(e) => updateFormData("cateringOptions", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select option</option>
                                <option value="inhouse">In-House Catering Only</option>
                                <option value="external">External Caterers Allowed</option>
                                <option value="both">Both Options Available</option>
                                <option value="none">No Catering (Venue Only)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Bar/Alcohol Service *</label>
                            <select 
                                value={formData.barService || ""} 
                                onChange={(e) => updateFormData("barService", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select option</option>
                                <option value="full">Full Bar Service Available</option>
                                <option value="limited">Limited Bar Service</option>
                                <option value="byob">BYOB Allowed</option>
                                <option value="none">No Alcohol Allowed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Audio/Visual Equipment *</label>
                            <Input 
                                value={formData.avEquipment || ""} 
                                onChange={(e) => updateFormData("avEquipment", e.target.value)} 
                                placeholder="e.g., Projector, Sound System, Microphones, LED Screens" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Lighting Options</label>
                            <Input 
                                value={formData.lightingOptions || ""} 
                                onChange={(e) => updateFormData("lightingOptions", e.target.value)} 
                                placeholder="e.g., Chandeliers, Uplighting, String Lights, Customizable" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Tables & Chairs Included? *</label>
                            <select 
                                value={formData.furnitureIncluded || ""} 
                                onChange={(e) => updateFormData("furnitureIncluded", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select option</option>
                                <option value="yes">Yes, Included</option>
                                <option value="additional">Available (Additional Cost)</option>
                                <option value="no">Not Provided</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Bridal Suite/Dressing Rooms?</label>
                            <select 
                                value={formData.bridalSuite || "no"} 
                                onChange={(e) => updateFormData("bridalSuite", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="no">Not Available</option>
                                <option value="yes">Yes, Included</option>
                                <option value="additional">Available (Additional Cost)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Accommodation Available?</label>
                            <Input 
                                value={formData.accommodation || ""} 
                                onChange={(e) => updateFormData("accommodation", e.target.value)} 
                                placeholder="e.g., 50 rooms available, Discounted rates for guests" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Additional Amenities (comma-separated)</label>
                            <Input 
                                value={formData.amenities || ""} 
                                onChange={(e) => updateFormData("amenities", e.target.value)} 
                                placeholder="e.g., WiFi, Air Conditioning, Generator Backup, Dance Floor" 
                            />
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-charcoal mb-4">Pricing & Policies</h3>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Venue Rental Price (RWF) *</label>
                            <Input 
                                type="number" 
                                value={formData.price || ""} 
                                onChange={(e) => updateFormData("price", e.target.value)} 
                                placeholder="e.g., 2000000" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Pricing Structure *</label>
                            <select 
                                value={formData.pricingStructure || ""} 
                                onChange={(e) => updateFormData("pricingStructure", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select option</option>
                                <option value="flat">Flat Rate (All-Inclusive)</option>
                                <option value="perPerson">Per Person</option>
                                <option value="hourly">Hourly Rate</option>
                                <option value="package">Package-Based</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Rental Duration Included *</label>
                            <Input 
                                value={formData.rentalDuration || ""} 
                                onChange={(e) => updateFormData("rentalDuration", e.target.value)} 
                                placeholder="e.g., 8 hours, Full Day, 12 hours" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Setup/Cleanup Time</label>
                            <Input 
                                value={formData.setupTime || ""} 
                                onChange={(e) => updateFormData("setupTime", e.target.value)} 
                                placeholder="e.g., 2 hours before, 1 hour after" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Deposit Required *</label>
                            <Input 
                                value={formData.depositRequired || ""} 
                                onChange={(e) => updateFormData("depositRequired", e.target.value)} 
                                placeholder="e.g., 50% deposit, 1,000,000 RWF" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Payment Schedule</label>
                            <Input 
                                value={formData.paymentSchedule || ""} 
                                onChange={(e) => updateFormData("paymentSchedule", e.target.value)} 
                                placeholder="e.g., 50% deposit, 50% 1 week before event" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Cancellation Policy *</label>
                            <Textarea 
                                value={formData.cancellationPolicy || ""} 
                                onChange={(e) => updateFormData("cancellationPolicy", e.target.value)} 
                                placeholder="Describe your cancellation and refund policy..." 
                                rows={3} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Venue Restrictions/Rules</label>
                            <Textarea 
                                value={formData.restrictions || ""} 
                                onChange={(e) => updateFormData("restrictions", e.target.value)} 
                                placeholder="e.g., No smoking indoors, Music curfew at 11pm, No confetti" 
                                rows={3} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Insurance Required?</label>
                            <select 
                                value={formData.insuranceRequired || "no"} 
                                onChange={(e) => updateFormData("insuranceRequired", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="no">Not Required</option>
                                <option value="yes">Event Insurance Required</option>
                                <option value="recommended">Recommended</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-6 pt-6 border-t border-gray-100">
                    <Button onClick={onBack} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    {currentStep < steps.length ? (
                        <Button onClick={onNext} className="bg-burgundy hover:bg-burgundy-light text-white">
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={onSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating Venue...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Create Venue
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
function DecorationForm(props: any) { return <div>Decoration Form - Coming Soon</div>; }
function MusicForm(props: any) { return <div>Music Form - Coming Soon</div>; }
function PlanningForm(props: any) { return <div>Planning Form - Coming Soon</div>; }
function MakeupForm(props: any) { return <div>Makeup Form - Coming Soon</div>; }
function AttireForm(props: any) { return <div>Attire Form - Coming Soon</div>; }
