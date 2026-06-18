"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import {
    ArrowLeft, ArrowRight, Check, MapPin, Music, Palette,
    Users, Sparkles, Shirt, Camera, Utensils, Car, Video
} from "lucide-react";
import { toast } from "sonner";

// Service type catalogue
const SERVICE_TYPES = [
    { value: "Photography",  label: "Photography",           icon: Camera,   border: "border-blue-200",   bg: "bg-blue-50",   iconCls: "bg-blue-100 text-blue-700",    desc: "Wedding & event photography packages" },
    { value: "Videography",  label: "Videography",           icon: Video,    border: "border-purple-200", bg: "bg-purple-50", iconCls: "bg-purple-100 text-purple-700", desc: "Cinematic films & highlight reels" },
    { value: "Catering",     label: "Catering",              icon: Utensils, border: "border-orange-200", bg: "bg-orange-50", iconCls: "bg-orange-100 text-orange-700", desc: "Menus, buffets & dining experiences" },
    { value: "Decoration",   label: "Decoration & Floral",   icon: Palette,  border: "border-pink-200",   bg: "bg-pink-50",   iconCls: "bg-pink-100 text-pink-700",    desc: "Decor, florals, lighting & styling" },
    { value: "Music",        label: "Music & Entertainment", icon: Music,    border: "border-indigo-200", bg: "bg-indigo-50", iconCls: "bg-indigo-100 text-indigo-700", desc: "DJs, live bands & MC services" },
    { value: "Planning",     label: "Wedding Planning",      icon: Users,    border: "border-yellow-200", bg: "bg-yellow-50", iconCls: "bg-yellow-100 text-yellow-700", desc: "Full, partial & day-of coordination" },
    { value: "Makeup",       label: "Hair & Makeup",         icon: Sparkles, border: "border-rose-200",   bg: "bg-rose-50",   iconCls: "bg-rose-100 text-rose-700",    desc: "Bridal beauty & grooming services" },
    { value: "Attire",       label: "Attire & Fashion",      icon: Shirt,    border: "border-teal-200",   bg: "bg-teal-50",   iconCls: "bg-teal-100 text-teal-700",    desc: "Bridal gowns, suits & accessories" },
    { value: "Transport",    label: "Transport",             icon: Car,      border: "border-slate-200",  bg: "bg-slate-50",  iconCls: "bg-slate-100 text-slate-700",  desc: "Wedding cars, buses & chauffeurs" },
    { value: "Other",        label: "Other Services",        icon: Sparkles, border: "border-gray-200",   bg: "bg-gray-50",   iconCls: "bg-gray-100 text-gray-700",    desc: "Custom or specialized services" },
];

// Shared image-upload hook
function useImageUpload(updateFormData: (f: string, v: any) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return; }
        const reader = new FileReader();
        reader.onloadend = () => updateFormData("image", reader.result as string);
        reader.readAsDataURL(file);
    };
}

// Shared wizard shell
function WizardShell({ title, badgeLabel, badgeCls = "bg-burgundy/10 text-burgundy", steps, currentStep, children, onBack, onNext, onSubmit, isSubmitting, isLastStep, submitLabel = "Create Service" }: {
    title: string; badgeLabel?: string; badgeCls?: string;
    steps: string[]; currentStep: number; children: React.ReactNode;
    onBack: () => void; onNext: () => void; onSubmit: () => void;
    isSubmitting: boolean; isLastStep: boolean; submitLabel?: string;
}) {
    return (
        <Card className="border-gray-100 shadow-sm">
            <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-xl">{title}</CardTitle>
                    {badgeLabel && <Badge className={badgeCls}>{badgeLabel}</Badge>}
                </div>
                <div className="flex items-center gap-1">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex items-center flex-1 min-w-0">
                            <div className="flex flex-col items-center gap-1">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0 transition-colors ${
                                    idx + 1 < currentStep  ? "bg-burgundy text-white" :
                                    idx + 1 === currentStep ? "bg-burgundy text-white ring-4 ring-burgundy/20" :
                                    "bg-gray-100 text-gray-400"
                                }`}>
                                    {idx + 1 < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
                                </div>
                                <span className={`text-[10px] font-medium hidden sm:block truncate max-w-[72px] text-center ${
                                    idx + 1 <= currentStep ? "text-burgundy" : "text-gray-400"
                                }`}>{step}</span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-1 mb-4 transition-colors ${
                                    idx + 1 < currentStep ? "bg-burgundy" : "bg-gray-200"
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {children}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                    <Button onClick={onBack} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    {isLastStep ? (
                        <Button onClick={onSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white min-w-[140px] justify-center">
                            {isSubmitting
                                ? <><div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
                                : <><Check className="w-4 h-4 mr-2" />{submitLabel}</>}
                        </Button>
                    ) : (
                        <Button onClick={onNext} className="bg-burgundy hover:bg-burgundy-light text-white">
                            Next <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Shared field wrappers
function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                {hint && <span className="text-gray-400 font-normal ml-1 text-xs">({hint})</span>}
            </label>
            {children}
        </div>
    );
}

function Sel({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
        >
            {children}
        </select>
    );
}

export default function ServiceCreationWizard({ onComplete, onCancel, editMode = false, initialData = null }: any) {
    const [selectedType, setSelectedType] = useState<string | null>(
        editMode ? (initialData?.serviceType || null) : null
    );
    const [currentStep, setCurrentStep] = useState(editMode ? 1 : 0);
    const [formData, setFormData] = useState<any>(editMode ? {
        ...initialData,
        ...(initialData?.metadata ? JSON.parse(initialData.metadata) : {}),
        features: initialData?.features ? JSON.parse(initialData.features).items.join(', ') : '',
        amenities: initialData?.metadata ? JSON.parse(initialData.metadata).amenities : '',
    } : {});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customServiceType, setCustomServiceType] = useState("");

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        setCurrentStep(1);
        if (type === "Other" && customServiceType) {
            setFormData({ serviceType: customServiceType });
        } else {
            setFormData({ serviceType: type });
        }
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
            console.error("Service creation error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to save service");
            setIsSubmitting(false);
        }
    };

    if (!selectedType) {
        return (
            <Card className="border-gray-100 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                    <CardTitle>{editMode ? "Change Service Type" : "What type of service are you adding?"}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Each type has its own tailored setup wizard so clients see exactly what they need.</p>
                </CardHeader>
                <CardContent className="p-6">
                    {/* Venue — dedicated wizard, highlighted */}
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Venue</p>
                    <button
                        onClick={() => handleTypeSelect("Venue")}
                        className="w-full mb-6 p-5 border-2 border-green-300 bg-green-50 rounded-xl hover:border-burgundy hover:shadow-md transition-all text-left group flex items-center gap-4"
                    >
                        <div className="p-3 rounded-xl bg-green-100 text-green-700 shrink-0">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="font-semibold text-charcoal group-hover:text-burgundy transition-colors">Venue</h3>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-100 px-2 py-0.5 rounded">Detailed wizard</span>
                            </div>
                            <p className="text-xs text-gray-500">Capacity, facilities, catering options, policies & portfolio gallery.</p>
                        </div>
                    </button>

                    {/* All other service types */}
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Other Services</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {SERVICE_TYPES.map((type) => {
                            const Icon = type.icon;
                            const isOther = type.value === "Other";
                            return (
                                <div key={type.value} className="relative">
                                    <button
                                        onClick={() => !isOther && handleTypeSelect(type.value)}
                                        disabled={isOther}
                                        className={`w-full p-4 border-2 ${type.border} ${type.bg} rounded-xl hover:border-burgundy hover:shadow-md transition-all text-left group ${isOther ? 'cursor-default' : ''}`}
                                    >
                                        <div className={`inline-flex p-2.5 rounded-lg ${type.iconCls} mb-3`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-semibold text-sm text-charcoal group-hover:text-burgundy transition-colors leading-tight">{type.label}</h3>
                                        <p className="text-[11px] text-gray-500 mt-1 leading-tight">{type.desc}</p>
                                    </button>
                                    {isOther && (
                                        <div className="mt-2 space-y-2">
                                            <Input
                                                value={customServiceType}
                                                onChange={(e) => setCustomServiceType(e.target.value)}
                                                placeholder="Enter service type"
                                                className="text-sm"
                                            />
                                            <Button
                                                onClick={() => customServiceType && handleTypeSelect("Other")}
                                                disabled={!customServiceType}
                                                className="w-full bg-burgundy hover:bg-burgundy/90 text-white text-sm h-9"
                                            >
                                                Continue
                                            </Button>
                                        </div>
                                    )}
                                </div>
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
            {selectedType !== "Venue" && selectedType !== null && (
                <GeneralServiceForm
                    serviceType={selectedType}
                    currentStep={currentStep}
                    formData={formData}
                    updateFormData={updateFormData}
                    onBack={handleBack}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    editMode={editMode}
                />
            )}
        </div>
    );
}

// GeneralServiceForm - dispatches to the right wizard per service type
function GeneralServiceForm({ serviceType, currentStep, formData, updateFormData, onBack, onNext, onSubmit, isSubmitting, editMode }: any) {
    const props = { currentStep, formData, updateFormData, onBack, onNext, onSubmit, isSubmitting, editMode };
    if (serviceType === "Photography" || serviceType === "Videography") return <PhotographyVideographyForm serviceType={serviceType} {...props} />;
    if (serviceType === "Catering") return <CateringForm {...props} />;
    if (serviceType === "Music") return <MusicForm {...props} />;
    if (serviceType === "Transport") return <TransportForm {...props} />;
    if (serviceType === "Planning") return <PlanningForm {...props} />;
    if (serviceType === "Makeup") return <MakeupForm {...props} />;
    if (serviceType === "Decoration") return <DecorationForm {...props} />;
    if (serviceType === "Attire") return <AttireForm {...props} />;
    if (serviceType === "Other") return <OtherServiceForm {...props} />;
    return (
        <Card className="border-gray-100 shadow-sm">
            <CardHeader className="border-b border-gray-100">
                <CardTitle>{editMode ? `Edit ${serviceType} Service` : `New ${serviceType} Service`}</CardTitle>
                <p className="text-sm text-gray-500">Detailed wizard coming soon.</p>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
                <Field label="Package Name" required>
                    <Input value={formData.name || ""} onChange={(e) => updateFormData("name", e.target.value)} placeholder="e.g., Premium Package" />
                </Field>
                <Field label="Description" required>
                    <Textarea value={formData.description || ""} onChange={(e) => updateFormData("description", e.target.value)} rows={4} placeholder="Describe your service..." />
                </Field>
                <Field label="Price (RWF)" required>
                    <Input type="number" value={formData.price || ""} onChange={(e) => updateFormData("price", e.target.value)} placeholder="e.g., 1500000" />
                </Field>
                <div className="flex justify-between pt-6 border-t border-gray-100">
                    <Button onClick={onBack} variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                    <Button onClick={onSubmit} disabled={isSubmitting || !formData.name || !formData.price} className="bg-green-600 hover:bg-green-700 text-white min-w-[140px] justify-center">
                        {isSubmitting ? <><div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : <><Check className="w-4 h-4 mr-2" />{editMode ? "Update" : "Create"} Service</>}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Photography & Videography wizard
function PhotographyVideographyForm({ serviceType, currentStep, formData, updateFormData, onBack, onNext, onSubmit, isSubmitting, editMode }: any) {
    const isPhoto = serviceType === "Photography";
    const steps = ["Basic Info", "Shoot Details", "Equipment & Style", "Pricing & Delivery"];
    const handleImage = useImageUpload(updateFormData);

    return (
        <WizardShell
            title={isPhoto ? "Photography Service Setup" : "Videography Service Setup"}
            badgeLabel={`Step ${currentStep} of ${steps.length}`}
            badgeCls={isPhoto ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}
            steps={steps}
            currentStep={currentStep}
            onBack={onBack}
            onNext={onNext}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isLastStep={currentStep === steps.length}
            submitLabel={editMode ? `Update ${serviceType}` : `Create ${serviceType} Package`}
        >
            {currentStep === 1 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Basic Information</h3>
                    <Field label="Package Name" required>
                        <Input value={formData.name || ""} onChange={(e) => updateFormData("name", e.target.value)}
                            placeholder={isPhoto ? "e.g., Premium Wedding Photography" : "e.g., Cinematic Wedding Film"} />
                    </Field>
                    <Field label="Package Description" required>
                        <Textarea value={formData.description || ""} onChange={(e) => updateFormData("description", e.target.value)} rows={4}
                            placeholder={isPhoto ? "Describe your photography style, experience, what makes you stand out..." : "Describe your filming style, editing approach, what makes your films unique..."} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Coverage Duration" required>
                            <Input value={formData.duration || ""} onChange={(e) => updateFormData("duration", e.target.value)}
                                placeholder="e.g., 10 hours, Full Day" />
                        </Field>
                        <Field label="Years of Experience">
                            <Input type="number" value={formData.yearsExperience || ""} onChange={(e) => updateFormData("yearsExperience", e.target.value)}
                                placeholder="e.g., 5" />
                        </Field>
                    </div>
                    <Field label="Service Area / Location">
                        <Input value={formData.serviceArea || ""} onChange={(e) => updateFormData("serviceArea", e.target.value)}
                            placeholder="e.g., Kigali & all Rwanda, available for destination weddings" />
                    </Field>
                    <Field label="Package Cover Image">
                        <Input type="file" accept="image/*" onChange={handleImage} />
                        {formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" />}
                    </Field>
                </div>
            )}

            {currentStep === 2 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Shoot Details</h3>
                    {isPhoto ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Number of Photographers" required>
                                    <Input type="number" value={formData.photographerCount || ""} onChange={(e) => updateFormData("photographerCount", e.target.value)} placeholder="e.g., 2" />
                                </Field>
                                <Field label="Edited Photos Delivered" required>
                                    <Input type="number" value={formData.photoCount || ""} onChange={(e) => updateFormData("photoCount", e.target.value)} placeholder="e.g., 500" />
                                </Field>
                            </div>
                            <Field label="Photo Album Included">
                                <Sel value={formData.albumIncluded || "none"} onChange={(v) => updateFormData("albumIncluded", v)}>
                                    <option value="none">No Album</option>
                                    <option value="digital">Digital Album Only</option>
                                    <option value="printed_20">Printed Album (20 pages)</option>
                                    <option value="printed_40">Premium Album (40 pages)</option>
                                    <option value="luxury">Luxury Album (60+ pages)</option>
                                </Sel>
                            </Field>
                            <Field label="Prints Included">
                                <Input value={formData.printsIncluded || ""} onChange={(e) => updateFormData("printsIncluded", e.target.value)}
                                    placeholder="e.g., 20 prints 8x10, 2 canvas prints" />
                            </Field>
                            <Field label="Engagement / Pre-Wedding Shoot">
                                <Sel value={formData.engagementShoot || "no"} onChange={(v) => updateFormData("engagementShoot", v)}>
                                    <option value="no">Not Included</option>
                                    <option value="yes">Included (1 session)</option>
                                    <option value="multiple">Multiple Sessions Included</option>
                                    <option value="addon">Available as Add-on</option>
                                </Sel>
                            </Field>
                            <Field label="Same-Day Preview / Slideshow">
                                <Sel value={formData.sameDayPreview || "no"} onChange={(v) => updateFormData("sameDayPreview", v)}>
                                    <option value="no">Not Included</option>
                                    <option value="yes">Included</option>
                                    <option value="addon">Available as Add-on</option>
                                </Sel>
                            </Field>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Number of Videographers" required>
                                    <Input type="number" value={formData.videographerCount || ""} onChange={(e) => updateFormData("videographerCount", e.target.value)} placeholder="e.g., 2" />
                                </Field>
                                <Field label="Final Video Length" required>
                                    <Input value={formData.videoLength || ""} onChange={(e) => updateFormData("videoLength", e.target.value)} placeholder="e.g., 3-5 min highlight + full ceremony" />
                                </Field>
                            </div>
                            <Field label="Highlight Film Included">
                                <Sel value={formData.highlightFilm || "yes"} onChange={(v) => updateFormData("highlightFilm", v)}>
                                    <option value="yes">Yes, Included</option>
                                    <option value="no">Not Included</option>
                                    <option value="addon">Available as Add-on</option>
                                </Sel>
                            </Field>
                            <Field label="Full Ceremony / Reception Recording">
                                <Sel value={formData.fullRecording || "yes"} onChange={(v) => updateFormData("fullRecording", v)}>
                                    <option value="yes">Yes, Included</option>
                                    <option value="no">Not Included</option>
                                    <option value="addon">Available as Add-on</option>
                                </Sel>
                            </Field>
                            <Field label="Same-Day Edit">
                                <Sel value={formData.sameDayEdit || "no"} onChange={(v) => updateFormData("sameDayEdit", v)}>
                                    <option value="no">Not Included</option>
                                    <option value="yes">Included</option>
                                    <option value="addon">Available as Add-on</option>
                                </Sel>
                            </Field>
                            <Field label="Drone Footage">
                                <Sel value={formData.droneCoverage || "no"} onChange={(v) => updateFormData("droneCoverage", v)}>
                                    <option value="no">Not Available</option>
                                    <option value="included">Included</option>
                                    <option value="addon">Available as Add-on</option>
                                </Sel>
                            </Field>
                        </>
                    )}
                    <Field label="Travel / Destination Coverage">
                        <Sel value={formData.travelCoverage || "local"} onChange={(v) => updateFormData("travelCoverage", v)}>
                            <option value="local">Local Only (Kigali)</option>
                            <option value="rwanda">All Rwanda</option>
                            <option value="destination">Destination (International)</option>
                            <option value="negotiable">Negotiable</option>
                        </Sel>
                    </Field>
                </div>
            )}

            {currentStep === 3 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">{isPhoto ? "Equipment & Style" : "Equipment & Editing Style"}</h3>
                    <Field label={isPhoto ? "Photography Style" : "Filming Style"} required>
                        <Sel value={formData.shootingStyle || ""} onChange={(v) => updateFormData("shootingStyle", v)}>
                            <option value="">Select style</option>
                            <option value="traditional">Traditional / Classic</option>
                            <option value="documentary">Documentary / Photojournalistic</option>
                            <option value="cinematic">Cinematic / Artistic</option>
                            <option value="editorial">Editorial / Fashion-forward</option>
                            <option value="vintage">Vintage / Film-inspired</option>
                            <option value="mixed">Mixed Styles</option>
                        </Sel>
                    </Field>
                    <Field label="Primary Equipment" required>
                        <Input value={formData.primaryEquipment || ""} onChange={(e) => updateFormData("primaryEquipment", e.target.value)}
                            placeholder={isPhoto ? "e.g., Canon EOS R5, Sony A7 IV, 24-70mm f/2.8" : "e.g., Sony FX3, DJI Ronin, Sigma Cine Lenses"} />
                    </Field>
                    <Field label="Backup Equipment">
                        <Sel value={formData.backupEquipment || "yes"} onChange={(v) => updateFormData("backupEquipment", v)}>
                            <option value="yes">Yes, Full Backup Available</option>
                            <option value="partial">Partial Backup</option>
                            <option value="no">No Backup</option>
                        </Sel>
                    </Field>
                    {isPhoto ? (
                        <>
                            <Field label="Drone Photography">
                                <Sel value={formData.dronePhoto || "no"} onChange={(v) => updateFormData("dronePhoto", v)}>
                                    <option value="no">Not Available</option>
                                    <option value="included">Included</option>
                                    <option value="addon">Available as Add-on</option>
                                </Sel>
                            </Field>
                            <Field label="Lighting Setup">
                                <Sel value={formData.lightingSetup || "natural"} onChange={(v) => updateFormData("lightingSetup", v)}>
                                    <option value="natural">Natural Light Only</option>
                                    <option value="studio">Studio Lighting Available</option>
                                    <option value="both">Both Natural & Studio</option>
                                </Sel>
                            </Field>
                        </>
                    ) : (
                        <>
                            <Field label="Color Grading Style">
                                <Sel value={formData.colorGrading || "cinematic"} onChange={(v) => updateFormData("colorGrading", v)}>
                                    <option value="cinematic">Cinematic (Warm & Rich)</option>
                                    <option value="natural">Natural / True-to-life</option>
                                    <option value="moody">Moody / Dark & Dramatic</option>
                                    <option value="bright">Bright & Airy</option>
                                    <option value="custom">Custom per Client</option>
                                </Sel>
                            </Field>
                            <Field label="Audio Recording">
                                <Sel value={formData.audioRecording || "yes"} onChange={(v) => updateFormData("audioRecording", v)}>
                                    <option value="yes">Professional Audio Included</option>
                                    <option value="basic">Basic On-Camera Audio</option>
                                    <option value="no">No Audio Recording</option>
                                </Sel>
                            </Field>
                        </>
                    )}
                    <Field label="Editing Turnaround">
                        <Input value={formData.editingTurnaround || ""} onChange={(e) => updateFormData("editingTurnaround", e.target.value)}
                            placeholder="e.g., 4-6 weeks for full gallery, 48h for sneak peek" />
                    </Field>
                </div>
            )}

            {currentStep === 4 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Pricing & Delivery</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Package Price (RWF)" required>
                            <Input type="number" value={formData.price || ""} onChange={(e) => updateFormData("price", e.target.value)} placeholder="e.g., 1500000" />
                        </Field>
                        <Field label="Deposit Required">
                            <Input value={formData.depositRequired || ""} onChange={(e) => updateFormData("depositRequired", e.target.value)} placeholder="e.g., 30% to confirm booking" />
                        </Field>
                    </div>
                    <Field label="Delivery Format" required>
                        <Input value={formData.deliveryFormat || ""} onChange={(e) => updateFormData("deliveryFormat", e.target.value)}
                            placeholder={isPhoto ? "e.g., Online gallery (Pixieset), USB drive, Google Drive" : "e.g., WeTransfer, USB drive, Private YouTube link"} />
                    </Field>
                    <Field label="Delivery Timeline" required>
                        <Input value={formData.deliveryTimeline || ""} onChange={(e) => updateFormData("deliveryTimeline", e.target.value)}
                            placeholder={isPhoto ? "e.g., Sneak peek in 48h, full gallery in 4-6 weeks" : "e.g., Highlight film in 3 weeks, full film in 6 weeks"} />
                    </Field>
                    <Field label="Payment Schedule">
                        <Input value={formData.paymentSchedule || ""} onChange={(e) => updateFormData("paymentSchedule", e.target.value)}
                            placeholder="e.g., 30% deposit, 70% on wedding day" />
                    </Field>
                    <Field label="Cancellation Policy" required>
                        <Textarea value={formData.cancellationPolicy || ""} onChange={(e) => updateFormData("cancellationPolicy", e.target.value)} rows={3}
                            placeholder="e.g., Deposit non-refundable. Full refund if cancelled 90+ days before event." />
                    </Field>
                    <Field label="What's Included" hint="comma-separated">
                        <Input value={formData.features || ""} onChange={(e) => updateFormData("features", e.target.value)}
                            placeholder={isPhoto ? "e.g., Online gallery, USB drive, 2 photographers, engagement shoot" : "e.g., Highlight film, full ceremony, drone footage, USB drive"} />
                    </Field>
                    <Field label="Add-ons Available">
                        <Input value={formData.addons || ""} onChange={(e) => updateFormData("addons", e.target.value)}
                            placeholder="e.g., Photo booth, extra hours, rush delivery, printed album" />
                    </Field>
                </div>
            )}
        </WizardShell>
    );
}
function CateringForm({ currentStep, formData, updateFormData, onBack, onNext, onSubmit, isSubmitting, editMode }: any) {
    const steps = ["Basic Info", "Menu & Service", "Logistics", "Pricing"];
    const handleImage = useImageUpload(updateFormData);
    return (
        <WizardShell title="Catering Service" badgeLabel={`Step ${currentStep} of ${steps.length}`} badgeCls="bg-orange-100 text-orange-700"
            steps={steps} currentStep={currentStep} onBack={onBack} onNext={onNext} onSubmit={onSubmit}
            isSubmitting={isSubmitting} isLastStep={currentStep === steps.length} submitLabel={editMode ? "Update Catering" : "Create Catering Package"}>
            {currentStep === 1 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Basic Information</h3>
                    <Field label="Package Name" required><Input value={formData.name || ""} onChange={(e) => updateFormData("name", e.target.value)} placeholder="e.g., Premium Wedding Buffet" /></Field>
                    <Field label="Description" required><Textarea value={formData.description || ""} onChange={(e) => updateFormData("description", e.target.value)} rows={4} placeholder="Describe your catering style, cuisine specialties..." /></Field>
                    <Field label="Cuisine Type" required>
                        <Sel value={formData.cuisineType || ""} onChange={(v) => updateFormData("cuisineType", v)}>
                            <option value="">Select cuisine</option>
                            <option value="rwandan">Rwandan / African</option>
                            <option value="international">International</option>
                            <option value="mixed">Mixed / Fusion</option>
                            <option value="continental">Continental</option>
                        </Sel>
                    </Field>
                    <Field label="Service Area"><Input value={formData.serviceArea || ""} onChange={(e) => updateFormData("serviceArea", e.target.value)} placeholder="e.g., Kigali & all Rwanda" /></Field>
                    <Field label="Package Image"><Input type="file" accept="image/*" onChange={handleImage} />{formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" />}</Field>
                </div>
            )}
            {currentStep === 2 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Menu & Service Style</h3>
                    <Field label="Service Style" required>
                        <Sel value={formData.serviceStyle || ""} onChange={(v) => updateFormData("serviceStyle", v)}>
                            <option value="">Select style</option>
                            <option value="buffet">Buffet</option>
                            <option value="plated">Plated / Sit-down</option>
                            <option value="cocktail">Cocktail / Stations</option>
                            <option value="family">Family Style</option>
                            <option value="mixed">Mixed</option>
                        </Sel>
                    </Field>
                    <Field label="Menu Customization">
                        <Sel value={formData.menuCustomization || "yes"} onChange={(v) => updateFormData("menuCustomization", v)}>
                            <option value="yes">Fully Customizable</option>
                            <option value="partial">Partially Customizable</option>
                            <option value="fixed">Fixed Menu</option>
                        </Sel>
                    </Field>
                    <Field label="Dietary Options">
                        <Input value={formData.dietaryOptions || ""} onChange={(e) => updateFormData("dietaryOptions", e.target.value)} placeholder="e.g., Vegetarian, Vegan, Halal, Gluten-free" />
                    </Field>
                    <Field label="Bar / Drinks Service">
                        <Sel value={formData.barService || "addon"} onChange={(v) => updateFormData("barService", v)}>
                            <option value="yes">Included</option>
                            <option value="addon">Available as Add-on</option>
                            <option value="no">Not Available</option>
                        </Sel>
                    </Field>
                    <Field label="Wedding Cake">
                        <Sel value={formData.weddingCake || "addon"} onChange={(v) => updateFormData("weddingCake", v)}>
                            <option value="yes">Included</option>
                            <option value="addon">Available as Add-on</option>
                            <option value="no">Not Available</option>
                        </Sel>
                    </Field>
                </div>
            )}
            {currentStep === 3 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Logistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Minimum Guests" required><Input type="number" value={formData.minGuests || ""} onChange={(e) => updateFormData("minGuests", e.target.value)} placeholder="e.g., 50" /></Field>
                        <Field label="Maximum Guests"><Input type="number" value={formData.maxGuests || ""} onChange={(e) => updateFormData("maxGuests", e.target.value)} placeholder="e.g., 500" /></Field>
                    </div>
                    <Field label="Staff Provided">
                        <Sel value={formData.staffProvided || "yes"} onChange={(v) => updateFormData("staffProvided", v)}>
                            <option value="yes">Yes, Full Service Staff</option>
                            <option value="partial">Partial Staff</option>
                            <option value="no">No Staff (Drop-off Only)</option>
                        </Sel>
                    </Field>
                    <Field label="Equipment & Rentals">
                        <Sel value={formData.equipmentProvided || "yes"} onChange={(v) => updateFormData("equipmentProvided", v)}>
                            <option value="yes">All Equipment Included</option>
                            <option value="partial">Partial Equipment</option>
                            <option value="no">Not Included</option>
                        </Sel>
                    </Field>
                    <Field label="Setup & Cleanup">
                        <Sel value={formData.setupCleanup || "yes"} onChange={(v) => updateFormData("setupCleanup", v)}>
                            <option value="yes">Included</option>
                            <option value="no">Not Included</option>
                        </Sel>
                    </Field>
                </div>
            )}
            {currentStep === 4 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Pricing</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Package Price (RWF)" required><Input type="number" value={formData.price || ""} onChange={(e) => updateFormData("price", e.target.value)} placeholder="e.g., 5000000" /></Field>
                        <Field label="Pricing Per Person">
                            <Sel value={formData.pricingType || "flat"} onChange={(v) => updateFormData("pricingType", v)}>
                                <option value="flat">Flat Rate</option>
                                <option value="perPerson">Per Person</option>
                            </Sel>
                        </Field>
                    </div>
                    <Field label="Deposit Required"><Input value={formData.depositRequired || ""} onChange={(e) => updateFormData("depositRequired", e.target.value)} placeholder="e.g., 30%" /></Field>
                    <Field label="Cancellation Policy" required><Textarea value={formData.cancellationPolicy || ""} onChange={(e) => updateFormData("cancellationPolicy", e.target.value)} rows={3} placeholder="e.g., Deposit non-refundable. Full refund if cancelled 60+ days before." /></Field>
                    <Field label="What's Included" hint="comma-separated"><Input value={formData.features || ""} onChange={(e) => updateFormData("features", e.target.value)} placeholder="e.g., Buffet, staff, equipment, setup & cleanup" /></Field>
                    <Field label="Add-ons Available"><Input value={formData.addons || ""} onChange={(e) => updateFormData("addons", e.target.value)} placeholder="e.g., Bar service, wedding cake, extra courses" /></Field>
                </div>
            )}
        </WizardShell>
    );
}

function MusicForm({ currentStep, formData, updateFormData, onBack, onNext, onSubmit, isSubmitting, editMode }: any) {
    const steps = ["Basic Info", "Performance Details", "Equipment", "Pricing"];
    const handleImage = useImageUpload(updateFormData);
    return (
        <WizardShell title="Music & Entertainment Service" badgeLabel={`Step ${currentStep} of ${steps.length}`} badgeCls="bg-indigo-100 text-indigo-700"
            steps={steps} currentStep={currentStep} onBack={onBack} onNext={onNext} onSubmit={onSubmit}
            isSubmitting={isSubmitting} isLastStep={currentStep === steps.length} submitLabel={editMode ? "Update Music" : "Create Music Package"}>
            {currentStep === 1 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Basic Information</h3>
                    <Field label="Package Name" required><Input value={formData.name || ""} onChange={(e) => updateFormData("name", e.target.value)} placeholder="e.g., Premium DJ & MC Package" /></Field>
                    <Field label="Description" required><Textarea value={formData.description || ""} onChange={(e) => updateFormData("description", e.target.value)} rows={4} placeholder="Describe your performance style, experience, and what you offer..." /></Field>
                    <Field label="Entertainment Type" required>
                        <Sel value={formData.entertainmentType || ""} onChange={(v) => updateFormData("entertainmentType", v)}>
                            <option value="">Select type</option>
                            <option value="dj">DJ Only</option>
                            <option value="mc">MC Only</option>
                            <option value="dj_mc">DJ + MC</option>
                            <option value="live_band">Live Band</option>
                            <option value="live_dj">Live Band + DJ</option>
                            <option value="other">Other Entertainment</option>
                        </Sel>
                    </Field>
                    <Field label="Years of Experience"><Input type="number" value={formData.yearsExperience || ""} onChange={(e) => updateFormData("yearsExperience", e.target.value)} placeholder="e.g., 8" /></Field>
                    <Field label="Package Image"><Input type="file" accept="image/*" onChange={handleImage} />{formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" />}</Field>
                </div>
            )}
            {currentStep === 2 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Performance Details</h3>
                    <Field label="Performance Duration" required><Input value={formData.duration || ""} onChange={(e) => updateFormData("duration", e.target.value)} placeholder="e.g., 6 hours, Full Day" /></Field>
                    <Field label="Music Genres">
                        <Input value={formData.musicGenres || ""} onChange={(e) => updateFormData("musicGenres", e.target.value)} placeholder="e.g., Afrobeats, R&B, Gospel, Kizomba, Top 40" />
                    </Field>
                    <Field label="Ceremony Music">
                        <Sel value={formData.ceremonyMusic || "addon"} onChange={(v) => updateFormData("ceremonyMusic", v)}>
                            <option value="yes">Included</option>
                            <option value="addon">Available as Add-on</option>
                            <option value="no">Not Available</option>
                        </Sel>
                    </Field>
                    <Field label="Cocktail Hour Music">
                        <Sel value={formData.cocktailMusic || "yes"} onChange={(v) => updateFormData("cocktailMusic", v)}>
                            <option value="yes">Included</option>
                            <option value="addon">Available as Add-on</option>
                            <option value="no">Not Available</option>
                        </Sel>
                    </Field>
                    <Field label="Custom Playlist / Song Requests">
                        <Sel value={formData.customPlaylist || "yes"} onChange={(v) => updateFormData("customPlaylist", v)}>
                            <option value="yes">Yes, Accepted</option>
                            <option value="partial">Limited Requests</option>
                            <option value="no">No Requests</option>
                        </Sel>
                    </Field>
                </div>
            )}
            {currentStep === 3 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Equipment</h3>
                    <Field label="Sound System" required>
                        <Sel value={formData.soundSystem || "yes"} onChange={(v) => updateFormData("soundSystem", v)}>
                            <option value="yes">Full PA System Provided</option>
                            <option value="basic">Basic System Provided</option>
                            <option value="no">Venue System Required</option>
                        </Sel>
                    </Field>
                    <Field label="Lighting / Effects">
                        <Sel value={formData.lightingEffects || "yes"} onChange={(v) => updateFormData("lightingEffects", v)}>
                            <option value="yes">Included</option>
                            <option value="basic">Basic Lighting Only</option>
                            <option value="addon">Available as Add-on</option>
                            <option value="no">Not Available</option>
                        </Sel>
                    </Field>
                    <Field label="Microphones Provided">
                        <Sel value={formData.microphonesProvided || "yes"} onChange={(v) => updateFormData("microphonesProvided", v)}>
                            <option value="yes">Yes, Included</option>
                            <option value="no">Not Included</option>
                        </Sel>
                    </Field>
                    <Field label="Setup & Soundcheck Time">
                        <Input value={formData.setupTime || ""} onChange={(e) => updateFormData("setupTime", e.target.value)} placeholder="e.g., 2 hours before event" />
                    </Field>
                </div>
            )}
            {currentStep === 4 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Pricing</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Package Price (RWF)" required><Input type="number" value={formData.price || ""} onChange={(e) => updateFormData("price", e.target.value)} placeholder="e.g., 600000" /></Field>
                        <Field label="Deposit Required"><Input value={formData.depositRequired || ""} onChange={(e) => updateFormData("depositRequired", e.target.value)} placeholder="e.g., 30%" /></Field>
                    </div>
                    <Field label="Overtime Rate"><Input value={formData.overtimeRate || ""} onChange={(e) => updateFormData("overtimeRate", e.target.value)} placeholder="e.g., 80,000 RWF per extra hour" /></Field>
                    <Field label="Cancellation Policy" required><Textarea value={formData.cancellationPolicy || ""} onChange={(e) => updateFormData("cancellationPolicy", e.target.value)} rows={3} placeholder="e.g., Deposit non-refundable. Full refund if cancelled 60+ days before." /></Field>
                    <Field label="What's Included" hint="comma-separated"><Input value={formData.features || ""} onChange={(e) => updateFormData("features", e.target.value)} placeholder="e.g., DJ, MC, sound system, lighting, 6 hours" /></Field>
                    <Field label="Add-ons Available"><Input value={formData.addons || ""} onChange={(e) => updateFormData("addons", e.target.value)} placeholder="e.g., Extra hours, photo booth, live band upgrade" /></Field>
                </div>
            )}
        </WizardShell>
    );
}

function TransportForm({ currentStep, formData, updateFormData, onBack, onNext, onSubmit, isSubmitting, editMode }: any) {
    const steps = ["Basic Info", "Fleet & Coverage", "Extras", "Pricing"];
    const handleImage = useImageUpload(updateFormData);
    return (
        <WizardShell title="Transport Service" badgeLabel={`Step ${currentStep} of ${steps.length}`} badgeCls="bg-slate-100 text-slate-700"
            steps={steps} currentStep={currentStep} onBack={onBack} onNext={onNext} onSubmit={onSubmit}
            isSubmitting={isSubmitting} isLastStep={currentStep === steps.length} submitLabel={editMode ? "Update Transport" : "Create Transport Package"}>
            {currentStep === 1 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Basic Information</h3>
                    <Field label="Package Name" required><Input value={formData.name || ""} onChange={(e) => updateFormData("name", e.target.value)} placeholder="e.g., Bridal Car & Guest Shuttle Package" /></Field>
                    <Field label="Description" required><Textarea value={formData.description || ""} onChange={(e) => updateFormData("description", e.target.value)} rows={4} placeholder="Describe your fleet, service quality, and what you offer..." /></Field>
                    <Field label="Service Type" required>
                        <Sel value={formData.transportType || ""} onChange={(v) => updateFormData("transportType", v)}>
                            <option value="">Select type</option>
                            <option value="bridal_car">Bridal Car Only</option>
                            <option value="shuttle">Guest Shuttle Only</option>
                            <option value="both">Bridal Car + Guest Shuttle</option>
                            <option value="full_fleet">Full Fleet Service</option>
                            <option value="chauffeur">Chauffeur Service</option>
                        </Sel>
                    </Field>
                    <Field label="Service Area"><Input value={formData.serviceArea || ""} onChange={(e) => updateFormData("serviceArea", e.target.value)} placeholder="e.g., Kigali & all Rwanda" /></Field>
                    <Field label="Package Image"><Input type="file" accept="image/*" onChange={handleImage} />{formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" />}</Field>
                </div>
            )}
            {currentStep === 2 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Fleet & Coverage</h3>
                    <Field label="Vehicle Types" required>
                        <Input value={formData.vehicleTypes || ""} onChange={(e) => updateFormData("vehicleTypes", e.target.value)} placeholder="e.g., Rolls Royce, Mercedes S-Class, Toyota Coaster bus" />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Number of Vehicles"><Input type="number" value={formData.vehicleCount || ""} onChange={(e) => updateFormData("vehicleCount", e.target.value)} placeholder="e.g., 3" /></Field>
                        <Field label="Total Passenger Capacity"><Input type="number" value={formData.passengerCapacity || ""} onChange={(e) => updateFormData("passengerCapacity", e.target.value)} placeholder="e.g., 60" /></Field>
                    </div>
                    <Field label="Hours of Service" required><Input value={formData.serviceHours || ""} onChange={(e) => updateFormData("serviceHours", e.target.value)} placeholder="e.g., 8 hours, Full Day" /></Field>
                    <Field label="Chauffeur Included">
                        <Sel value={formData.chauffeurIncluded || "yes"} onChange={(v) => updateFormData("chauffeurIncluded", v)}>
                            <option value="yes">Yes, Professional Chauffeur</option>
                            <option value="no">Self-Drive</option>
                        </Sel>
                    </Field>
                </div>
            )}
            {currentStep === 3 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Extras & Amenities</h3>
                    <Field label="Vehicle Decoration">
                        <Sel value={formData.vehicleDecoration || "yes"} onChange={(v) => updateFormData("vehicleDecoration", v)}>
                            <option value="yes">Included</option>
                            <option value="addon">Available as Add-on</option>
                            <option value="no">Not Available</option>
                        </Sel>
                    </Field>
                    <Field label="Red Carpet Service">
                        <Sel value={formData.redCarpet || "addon"} onChange={(v) => updateFormData("redCarpet", v)}>
                            <option value="yes">Included</option>
                            <option value="addon">Available as Add-on</option>
                            <option value="no">Not Available</option>
                        </Sel>
                    </Field>
                    <Field label="Refreshments Onboard">
                        <Sel value={formData.refreshments || "addon"} onChange={(v) => updateFormData("refreshments", v)}>
                            <option value="yes">Included</option>
                            <option value="addon">Available as Add-on</option>
                            <option value="no">Not Available</option>
                        </Sel>
                    </Field>
                    <Field label="Airport Transfers">
                        <Sel value={formData.airportTransfers || "addon"} onChange={(v) => updateFormData("airportTransfers", v)}>
                            <option value="yes">Included</option>
                            <option value="addon">Available as Add-on</option>
                            <option value="no">Not Available</option>
                        </Sel>
                    </Field>
                </div>
            )}
            {currentStep === 4 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Pricing</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Package Price (RWF)" required><Input type="number" value={formData.price || ""} onChange={(e) => updateFormData("price", e.target.value)} placeholder="e.g., 500000" /></Field>
                        <Field label="Deposit Required"><Input value={formData.depositRequired || ""} onChange={(e) => updateFormData("depositRequired", e.target.value)} placeholder="e.g., 30%" /></Field>
                    </div>
                    <Field label="Overtime Rate"><Input value={formData.overtimeRate || ""} onChange={(e) => updateFormData("overtimeRate", e.target.value)} placeholder="e.g., 50,000 RWF per extra hour" /></Field>
                    <Field label="Cancellation Policy" required><Textarea value={formData.cancellationPolicy || ""} onChange={(e) => updateFormData("cancellationPolicy", e.target.value)} rows={3} placeholder="e.g., Deposit non-refundable. Full refund if cancelled 30+ days before." /></Field>
                    <Field label="What's Included" hint="comma-separated"><Input value={formData.features || ""} onChange={(e) => updateFormData("features", e.target.value)} placeholder="e.g., Bridal car, 2 shuttles, chauffeur, decoration, 8 hours" /></Field>
                    <Field label="Add-ons Available"><Input value={formData.addons || ""} onChange={(e) => updateFormData("addons", e.target.value)} placeholder="e.g., Extra hours, airport transfers, red carpet" /></Field>
                </div>
            )}
        </WizardShell>
    );
}

function AttireForm({ currentStep, formData, updateFormData, onBack, onNext, onSubmit, isSubmitting, editMode }: any) {
    const steps = ["Basic Info", "Attire Options", "Fittings & Alterations", "Pricing"];
    const handleImage = useImageUpload(updateFormData);
    return (
        <WizardShell title="Attire & Fashion Service" badgeLabel={`Step ${currentStep} of ${steps.length}`} badgeCls="bg-teal-100 text-teal-700"
            steps={steps} currentStep={currentStep} onBack={onBack} onNext={onNext} onSubmit={onSubmit}
            isSubmitting={isSubmitting} isLastStep={currentStep === steps.length} submitLabel={editMode ? "Update Attire" : "Create Attire Package"}>
            {currentStep === 1 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Basic Information</h3>
                    <Field label="Package Name" required><Input value={formData.name || ""} onChange={(e) => updateFormData("name", e.target.value)} placeholder="e.g., Bridal Gown & Suit Package" /></Field>
                    <Field label="Description" required><Textarea value={formData.description || ""} onChange={(e) => updateFormData("description", e.target.value)} rows={4} placeholder="Describe your collection, design style, and what you offer..." /></Field>
                    <Field label="Attire Category" required>
                        <Sel value={formData.attireCategory || ""} onChange={(v) => updateFormData("attireCategory", v)}>
                            <option value="">Select category</option>
                            <option value="bridal">Bridal Gowns</option>
                            <option value="groom">Groom Suits & Attire</option>
                            <option value="both">Bride & Groom (Both)</option>
                            <option value="bridesmaids">Bridesmaids Dresses</option>
                            <option value="full_party">Full Wedding Party</option>
                            <option value="accessories">Accessories Only</option>
                        </Sel>
                    </Field>
                    <Field label="Service Area"><Input value={formData.serviceArea || ""} onChange={(e) => updateFormData("serviceArea", e.target.value)} placeholder="e.g., Kigali showroom, nationwide delivery" /></Field>
                    <Field label="Package Image"><Input type="file" accept="image/*" onChange={handleImage} />{formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" />}</Field>
                </div>
            )}
            {currentStep === 2 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Attire Options</h3>
                    <Field label="Design Type" required>
                        <Sel value={formData.designType || ""} onChange={(v) => updateFormData("designType", v)}>
                            <option value="">Select type</option>
                            <option value="custom">Custom / Made-to-Measure</option>
                            <option value="readymade">Ready-to-Wear</option>
                            <option value="rental">Rental</option>
                            <option value="both">Custom & Ready-to-Wear</option>
                        </Sel>
                    </Field>
                    <Field label="Style Options">
                        <Input value={formData.styleOptions || ""} onChange={(e) => updateFormData("styleOptions", e.target.value)} placeholder="e.g., A-line, Ball gown, Mermaid, Suit, Tuxedo" />
                    </Field>
                    <Field label="Fabric Options">
                        <Input value={formData.fabricOptions || ""} onChange={(e) => updateFormData("fabricOptions", e.target.value)} placeholder="e.g., Lace, Satin, Chiffon, Tulle, Wool" />
                    </Field>
                    <Field label="Accessories Included">
                        <Sel value={formData.accessoriesIncluded || "addon"} onChange={(v) => updateFormData("accessoriesIncluded", v)}>
                            <option value="yes">Yes, Included</option>
                            <option value="addon">Available as Add-on</option>
                            <option value="no">Not Available</option>
                        </Sel>
                    </Field>
                    <Field label="Traditional / Cultural Attire">
                        <Sel value={formData.traditionalAttire || "addon"} onChange={(v) => updateFormData("traditionalAttire", v)}>
                            <option value="yes">Yes, Offered</option>
                            <option value="addon">Available as Add-on</option>
                            <option value="no">Not Available</option>
                        </Sel>
                    </Field>
                </div>
            )}
            {currentStep === 3 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Fittings & Alterations</h3>
                    <Field label="Number of Fittings Included">
                        <Input value={formData.fittingsIncluded || ""} onChange={(e) => updateFormData("fittingsIncluded", e.target.value)} placeholder="e.g., 3 fittings included, unlimited until perfect" />
                    </Field>
                    <Field label="Alterations Included">
                        <Sel value={formData.alterationsIncluded || "yes"} onChange={(v) => updateFormData("alterationsIncluded", v)}>
                            <option value="yes">Yes, Included</option>
                            <option value="basic">Basic Alterations Only</option>
                            <option value="no">Not Included</option>
                            <option value="addon">Available as Add-on</option>
                        </Sel>
                    </Field>
                    <Field label="Lead Time Required">
                        <Input value={formData.leadTime || ""} onChange={(e) => updateFormData("leadTime", e.target.value)} placeholder="e.g., 3-4 months for custom, 2 weeks for ready-to-wear" />
                    </Field>
                    <Field label="Rush Orders Available">
                        <Sel value={formData.rushOrders || "addon"} onChange={(v) => updateFormData("rushOrders", v)}>
                            <option value="yes">Yes, Available</option>
                            <option value="addon">Available (Rush Fee Applies)</option>
                            <option value="no">Not Available</option>
                        </Sel>
                    </Field>
                    <Field label="Delivery / Shipping">
                        <Sel value={formData.delivery || "pickup"} onChange={(v) => updateFormData("delivery", v)}>
                            <option value="pickup">In-Store Pickup Only</option>
                            <option value="local">Local Delivery Available</option>
                            <option value="nationwide">Nationwide Delivery</option>
                            <option value="international">International Shipping</option>
                        </Sel>
                    </Field>
                </div>
            )}
            {currentStep === 4 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Pricing</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Package Price (RWF)" required><Input type="number" value={formData.price || ""} onChange={(e) => updateFormData("price", e.target.value)} placeholder="e.g., 800000" /></Field>
                        <Field label="Deposit Required"><Input value={formData.depositRequired || ""} onChange={(e) => updateFormData("depositRequired", e.target.value)} placeholder="e.g., 50%" /></Field>
                    </div>
                    <Field label="Payment Schedule"><Input value={formData.paymentSchedule || ""} onChange={(e) => updateFormData("paymentSchedule", e.target.value)} placeholder="e.g., 50% on order, 50% on final fitting" /></Field>
                    <Field label="Cancellation Policy" required><Textarea value={formData.cancellationPolicy || ""} onChange={(e) => updateFormData("cancellationPolicy", e.target.value)} rows={3} placeholder="e.g., Custom orders non-refundable once production begins." /></Field>
                    <Field label="What's Included" hint="comma-separated"><Input value={formData.features || ""} onChange={(e) => updateFormData("features", e.target.value)} placeholder="e.g., Custom gown, 3 fittings, alterations, garment bag" /></Field>
                    <Field label="Add-ons Available"><Input value={formData.addons || ""} onChange={(e) => updateFormData("addons", e.target.value)} placeholder="e.g., Veil, accessories, bridesmaid dresses, suit rental" /></Field>
                </div>
            )}
        </WizardShell>
    );
}

function DecorationForm({ currentStep, formData, updateFormData, onBack, onNext, onSubmit, isSubmitting, editMode }: any) {
    const steps = ["Basic Info", "Decor Services", "Style & Setup", "Pricing"];
    const handleImage = useImageUpload(updateFormData);
    return (
        <WizardShell title="Decoration & Floral Service" badgeLabel={`Step ${currentStep} of ${steps.length}`} badgeCls="bg-pink-100 text-pink-700"
            steps={steps} currentStep={currentStep} onBack={onBack} onNext={onNext} onSubmit={onSubmit}
            isSubmitting={isSubmitting} isLastStep={currentStep === steps.length} submitLabel={editMode ? "Update Decoration" : "Create Decoration Package"}>
            {currentStep === 1 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Basic Information</h3>
                    <Field label="Package Name" required><Input value={formData.name || ""} onChange={(e) => updateFormData("name", e.target.value)} placeholder="e.g., Luxury Floral & Decor Package" /></Field>
                    <Field label="Description" required><Textarea value={formData.description || ""} onChange={(e) => updateFormData("description", e.target.value)} rows={4} placeholder="Describe your decoration style, specialties, and what makes your work unique..." /></Field>
                    <Field label="Service Type" required>
                        <Sel value={formData.decorType || ""} onChange={(v) => updateFormData("decorType", v)}>
                            <option value="">Select type</option>
                            <option value="full">Full Decoration (Floral + Decor)</option>
                            <option value="floral">Floral Only</option>
                            <option value="decor">Decor & Styling Only</option>
                            <option value="lighting">Lighting & Ambiance</option>
                        </Sel>
                    </Field>
                    <Field label="Service Area"><Input value={formData.serviceArea || ""} onChange={(e) => updateFormData("serviceArea", e.target.value)} placeholder="e.g., Kigali & all Rwanda" /></Field>
                    <Field label="Package Image"><Input type="file" accept="image/*" onChange={handleImage} />{formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" />}</Field>
                </div>
            )}
            {currentStep === 2 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Decor Services</h3>
                    <Field label="Ceremony Decoration">
                        <Sel value={formData.ceremonyDecor || "yes"} onChange={(v) => updateFormData("ceremonyDecor", v)}>
                            <option value="yes">Included</option>
                            <option value="no">Not Included</option>
                            <option value="addon">Available as Add-on</option>
                        </Sel>
                    </Field>
                    <Field label="Reception Decoration">
                        <Sel value={formData.receptionDecor || "yes"} onChange={(v) => updateFormData("receptionDecor", v)}>
                            <option value="yes">Included</option>
                            <option value="no">Not Included</option>
                            <option value="addon">Available as Add-on</option>
                        </Sel>
                    </Field>
                    <Field label="Floral Arrangements">
                        <Sel value={formData.floralArrangements || "yes"} onChange={(v) => updateFormData("floralArrangements", v)}>
                            <option value="yes">Included</option>
                            <option value="no">Not Included</option>
                            <option value="addon">Available as Add-on</option>
                        </Sel>
                    </Field>
                    <Field label="Bridal Bouquet">
                        <Sel value={formData.bridalBouquet || "yes"} onChange={(v) => updateFormData("bridalBouquet", v)}>
                            <option value="yes">Included</option>
                            <option value="no">Not Included</option>
                            <option value="addon">Available as Add-on</option>
                        </Sel>
                    </Field>
                    <Field label="Lighting & Ambiance">
                        <Sel value={formData.lightingService || "addon"} onChange={(v) => updateFormData("lightingService", v)}>
                            <option value="yes">Included</option>
                            <option value="no">Not Available</option>
                            <option value="addon">Available as Add-on</option>
                        </Sel>
                    </Field>
                    <Field label="Setup & Teardown">
                        <Sel value={formData.setupTeardown || "yes"} onChange={(v) => updateFormData("setupTeardown", v)}>
                            <option value="yes">Included</option>
                            <option value="setup">Setup Only</option>
                            <option value="no">Not Included</option>
                        </Sel>
                    </Field>
                </div>
            )}
            {currentStep === 3 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Style & Setup</h3>
                    <Field label="Decoration Style" required>
                        <Sel value={formData.decorStyle || ""} onChange={(v) => updateFormData("decorStyle", v)}>
                            <option value="">Select style</option>
                            <option value="classic">Classic / Elegant</option>
                            <option value="rustic">Rustic / Bohemian</option>
                            <option value="modern">Modern / Minimalist</option>
                            <option value="romantic">Romantic / Garden</option>
                            <option value="luxury">Luxury / Opulent</option>
                            <option value="cultural">Traditional / Cultural</option>
                            <option value="mixed">Mixed / Custom</option>
                        </Sel>
                    </Field>
                    <Field label="Flower Types Used">
                        <Input value={formData.flowerTypes || ""} onChange={(e) => updateFormData("flowerTypes", e.target.value)} placeholder="e.g., Roses, Peonies, Orchids, local seasonal flowers" />
                    </Field>
                    <Field label="Consultation & Mood Board">
                        <Sel value={formData.moodBoard || "yes"} onChange={(v) => updateFormData("moodBoard", v)}>
                            <option value="yes">Included</option>
                            <option value="no">Not Included</option>
                        </Sel>
                    </Field>
                    <Field label="Years of Experience"><Input type="number" value={formData.yearsExperience || ""} onChange={(e) => updateFormData("yearsExperience", e.target.value)} placeholder="e.g., 8" /></Field>
                </div>
            )}
            {currentStep === 4 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Pricing</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Package Price (RWF)" required><Input type="number" value={formData.price || ""} onChange={(e) => updateFormData("price", e.target.value)} placeholder="e.g., 1200000" /></Field>
                        <Field label="Deposit Required"><Input value={formData.depositRequired || ""} onChange={(e) => updateFormData("depositRequired", e.target.value)} placeholder="e.g., 40%" /></Field>
                    </div>
                    <Field label="Payment Schedule"><Input value={formData.paymentSchedule || ""} onChange={(e) => updateFormData("paymentSchedule", e.target.value)} placeholder="e.g., 40% deposit, 60% one week before" /></Field>
                    <Field label="Cancellation Policy" required><Textarea value={formData.cancellationPolicy || ""} onChange={(e) => updateFormData("cancellationPolicy", e.target.value)} rows={3} placeholder="e.g., Deposit non-refundable. 50% refund if cancelled 60+ days before." /></Field>
                    <Field label="What's Included" hint="comma-separated"><Input value={formData.features || ""} onChange={(e) => updateFormData("features", e.target.value)} placeholder="e.g., Ceremony & reception decor, bridal bouquet, setup & teardown" /></Field>
                    <Field label="Add-ons Available"><Input value={formData.addons || ""} onChange={(e) => updateFormData("addons", e.target.value)} placeholder="e.g., Extra floral arrangements, lighting upgrade, cake flowers" /></Field>
                </div>
            )}
        </WizardShell>
    );
}

function MakeupForm({ currentStep, formData, updateFormData, onBack, onNext, onSubmit, isSubmitting, editMode }: any) {
    const steps = ["Basic Info", "Services & Coverage", "Products & Team", "Pricing"];
    const handleImage = useImageUpload(updateFormData);
    return (
        <WizardShell title="Hair & Makeup Service" badgeLabel={`Step ${currentStep} of ${steps.length}`} badgeCls="bg-rose-100 text-rose-700"
            steps={steps} currentStep={currentStep} onBack={onBack} onNext={onNext} onSubmit={onSubmit}
            isSubmitting={isSubmitting} isLastStep={currentStep === steps.length} submitLabel={editMode ? "Update Makeup" : "Create Makeup Package"}>
            {currentStep === 1 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Basic Information</h3>
                    <Field label="Package Name" required><Input value={formData.name || ""} onChange={(e) => updateFormData("name", e.target.value)} placeholder="e.g., Bridal Glam Package" /></Field>
                    <Field label="Description" required><Textarea value={formData.description || ""} onChange={(e) => updateFormData("description", e.target.value)} rows={4} placeholder="Describe your style, experience, and what makes your work unique..." /></Field>
                    <Field label="Service Type" required>
                        <Sel value={formData.makeupType || ""} onChange={(v) => updateFormData("makeupType", v)}>
                            <option value="">Select type</option>
                            <option value="both">Hair & Makeup (Both)</option>
                            <option value="makeup">Makeup Only</option>
                            <option value="hair">Hair Only</option>
                            <option value="grooming">Groom Grooming</option>
                        </Sel>
                    </Field>
                    <Field label="Years of Experience"><Input type="number" value={formData.yearsExperience || ""} onChange={(e) => updateFormData("yearsExperience", e.target.value)} placeholder="e.g., 6" /></Field>
                    <Field label="Package Image"><Input type="file" accept="image/*" onChange={handleImage} />{formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" />}</Field>
                </div>
            )}
            {currentStep === 2 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Services & Coverage</h3>
                    <Field label="Bridal Trial Included">
                        <Sel value={formData.trialIncluded || "yes"} onChange={(v) => updateFormData("trialIncluded", v)}>
                            <option value="yes">Yes, Included</option>
                            <option value="no">Not Included</option>
                            <option value="addon">Available as Add-on</option>
                        </Sel>
                    </Field>
                    <Field label="Number of People Covered" required>
                        <Input value={formData.peopleCovered || ""} onChange={(e) => updateFormData("peopleCovered", e.target.value)} placeholder="e.g., Bride only, Bride + 4 bridesmaids" />
                    </Field>
                    <Field label="On-Location Service">
                        <Sel value={formData.onLocation || "yes"} onChange={(v) => updateFormData("onLocation", v)}>
                            <option value="yes">Yes, Travel to Client</option>
                            <option value="studio">Studio Only</option>
                            <option value="both">Both Options</option>
                        </Sel>
                    </Field>
                    <Field label="Travel Coverage">
                        <Sel value={formData.travelCoverage || "local"} onChange={(v) => updateFormData("travelCoverage", v)}>
                            <option value="local">Local Only (Kigali)</option>
                            <option value="rwanda">All Rwanda</option>
                            <option value="destination">Destination (International)</option>
                        </Sel>
                    </Field>
                    <Field label="Touch-up Kit Provided">
                        <Sel value={formData.touchupKit || "yes"} onChange={(v) => updateFormData("touchupKit", v)}>
                            <option value="yes">Yes, Provided</option>
                            <option value="no">Not Provided</option>
                        </Sel>
                    </Field>
                </div>
            )}
            {currentStep === 3 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Products & Team</h3>
                    <Field label="Product Brands Used">
                        <Input value={formData.productBrands || ""} onChange={(e) => updateFormData("productBrands", e.target.value)} placeholder="e.g., MAC, Charlotte Tilbury, NARS, Fenty Beauty" />
                    </Field>
                    <Field label="Makeup Style" required>
                        <Sel value={formData.makeupStyle || ""} onChange={(v) => updateFormData("makeupStyle", v)}>
                            <option value="">Select style</option>
                            <option value="natural">Natural / Soft Glam</option>
                            <option value="glam">Full Glam</option>
                            <option value="editorial">Editorial / High Fashion</option>
                            <option value="traditional">Traditional / Cultural</option>
                            <option value="mixed">Mixed / Client Preference</option>
                        </Sel>
                    </Field>
                    <Field label="Airbrush Makeup Available">
                        <Sel value={formData.airbrush || "yes"} onChange={(v) => updateFormData("airbrush", v)}>
                            <option value="yes">Yes, Available</option>
                            <option value="no">Not Available</option>
                            <option value="addon">Available as Add-on</option>
                        </Sel>
                    </Field>
                    <Field label="Team Size"><Input value={formData.teamSize || ""} onChange={(e) => updateFormData("teamSize", e.target.value)} placeholder="e.g., Solo artist, 2 artists for large parties" /></Field>
                </div>
            )}
            {currentStep === 4 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Pricing</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Package Price (RWF)" required><Input type="number" value={formData.price || ""} onChange={(e) => updateFormData("price", e.target.value)} placeholder="e.g., 300000" /></Field>
                        <Field label="Deposit Required"><Input value={formData.depositRequired || ""} onChange={(e) => updateFormData("depositRequired", e.target.value)} placeholder="e.g., 50%" /></Field>
                    </div>
                    <Field label="Travel Fee"><Input value={formData.travelFee || ""} onChange={(e) => updateFormData("travelFee", e.target.value)} placeholder="e.g., Free within Kigali, 50,000 RWF outside" /></Field>
                    <Field label="Cancellation Policy" required><Textarea value={formData.cancellationPolicy || ""} onChange={(e) => updateFormData("cancellationPolicy", e.target.value)} rows={3} placeholder="e.g., 50% refund if cancelled 30+ days before." /></Field>
                    <Field label="What's Included" hint="comma-separated"><Input value={formData.features || ""} onChange={(e) => updateFormData("features", e.target.value)} placeholder="e.g., Bridal trial, on-location, touch-up kit, 5 people" /></Field>
                    <Field label="Add-ons Available"><Input value={formData.addons || ""} onChange={(e) => updateFormData("addons", e.target.value)} placeholder="e.g., Extra bridesmaids, lashes, airbrush upgrade" /></Field>
                </div>
            )}
        </WizardShell>
    );
}

function OtherServiceForm({ currentStep, formData, updateFormData, onBack, onNext, onSubmit, isSubmitting, editMode }: any) {
    const steps = ["Basic Info", "Details", "Pricing"];
    const handleImage = useImageUpload(updateFormData);

    return (
        <WizardShell
            title="Custom Service Setup"
            badgeLabel={`Step ${currentStep} of ${steps.length}`}
            badgeCls="bg-gray-100 text-gray-700"
            steps={steps}
            currentStep={currentStep}
            onBack={onBack}
            onNext={onNext}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isLastStep={currentStep === steps.length}
            submitLabel={editMode ? "Update Service" : "Create Service"}
        >
            {currentStep === 1 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Basic Information</h3>
                    <Field label="Service Type" required>
                        <Input value={formData.serviceType || ""} onChange={(e) => updateFormData("serviceType", e.target.value)} placeholder="e.g., Florist, Invitations, Honeymoon Planning" />
                    </Field>
                    <Field label="Package Name" required>
                        <Input value={formData.name || ""} onChange={(e) => updateFormData("name", e.target.value)} placeholder="e.g., Premium Floral Arrangement" />
                    </Field>
                    <Field label="Description" required>
                        <Textarea value={formData.description || ""} onChange={(e) => updateFormData("description", e.target.value)} rows={4} placeholder="Describe your service, what you offer, and what makes you unique..." />
                    </Field>
                    <Field label="Years of Experience">
                        <Input type="number" value={formData.yearsExperience || ""} onChange={(e) => updateFormData("yearsExperience", e.target.value)} placeholder="e.g., 5" />
                    </Field>
                    <Field label="Package Image">
                        <Input type="file" accept="image/*" onChange={handleImage} />
                        {formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" />}
                    </Field>
                </div>
            )}

            {currentStep === 2 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Service Details</h3>
                    <Field label="Service Area">
                        <Input value={formData.serviceArea || ""} onChange={(e) => updateFormData("serviceArea", e.target.value)} placeholder="e.g., Kigali & all Rwanda, nationwide delivery" />
                    </Field>
                    <Field label="What's Included" hint="comma-separated" required>
                        <Input value={formData.features || ""} onChange={(e) => updateFormData("features", e.target.value)} placeholder="e.g., Design consultation, custom arrangements, delivery & setup" />
                    </Field>
                    <Field label="Add-ons Available">
                        <Input value={formData.addons || ""} onChange={(e) => updateFormData("addons", e.target.value)} placeholder="e.g., Rush delivery, premium flowers, extended consultation" />
                    </Field>
                    <Field label="Delivery/Service Timeline">
                        <Input value={formData.deliveryTimeline || ""} onChange={(e) => updateFormData("deliveryTimeline", e.target.value)} placeholder="e.g., 2-3 weeks for custom orders, same-day delivery available" />
                    </Field>
                    <Field label="Cancellation Policy" required>
                        <Textarea value={formData.cancellationPolicy || ""} onChange={(e) => updateFormData("cancellationPolicy", e.target.value)} rows={3} placeholder="e.g., Deposit non-refundable. Full refund if cancelled 30+ days before." />
                    </Field>
                </div>
            )}

            {currentStep === 3 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Pricing</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Package Price (RWF)" required>
                            <Input type="number" value={formData.price || ""} onChange={(e) => updateFormData("price", e.target.value)} placeholder="e.g., 500000" />
                        </Field>
                        <Field label="Deposit Required">
                            <Input value={formData.depositRequired || ""} onChange={(e) => updateFormData("depositRequired", e.target.value)} placeholder="e.g., 30%, 150,000 RWF" />
                        </Field>
                    </div>
                    <Field label="Payment Schedule">
                        <Input value={formData.paymentSchedule || ""} onChange={(e) => updateFormData("paymentSchedule", e.target.value)} placeholder="e.g., 30% deposit, 70% on delivery" />
                    </Field>
                    <Field label="Overtime/Extra Charges">
                        <Input value={formData.extraCharges || ""} onChange={(e) => updateFormData("extraCharges", e.target.value)} placeholder="e.g., Rush fee: +20%, Extra items: +10,000 RWF each" />
                    </Field>
                </div>
            )}
        </WizardShell>
    );
}

function PlanningForm({ currentStep, formData, updateFormData, onBack, onNext, onSubmit, isSubmitting, editMode }: any) {
    const steps = ["Basic Info", "Services Offered", "Experience", "Pricing"];
    const handleImage = useImageUpload(updateFormData);
    return (
        <WizardShell title="Wedding Planning Service" badgeLabel={`Step ${currentStep} of ${steps.length}`} badgeCls="bg-yellow-100 text-yellow-700"
            steps={steps} currentStep={currentStep} onBack={onBack} onNext={onNext} onSubmit={onSubmit}
            isSubmitting={isSubmitting} isLastStep={currentStep === steps.length} submitLabel={editMode ? "Update Planning" : "Create Planning Package"}>
            {currentStep === 1 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Basic Information</h3>
                    <Field label="Package Name" required><Input value={formData.name || ""} onChange={(e) => updateFormData("name", e.target.value)} placeholder="e.g., Full Wedding Planning Package" /></Field>
                    <Field label="Description" required><Textarea value={formData.description || ""} onChange={(e) => updateFormData("description", e.target.value)} rows={4} placeholder="Describe your planning approach and what makes you stand out..." /></Field>
                    <Field label="Planning Type" required>
                        <Sel value={formData.planningType || ""} onChange={(v) => updateFormData("planningType", v)}>
                            <option value="">Select type</option>
                            <option value="full">Full Planning (Start to Finish)</option>
                            <option value="partial">Partial Planning</option>
                            <option value="dayof">Day-of Coordination Only</option>
                            <option value="destination">Destination Wedding Planning</option>
                        </Sel>
                    </Field>
                    <Field label="Service Area"><Input value={formData.serviceArea || ""} onChange={(e) => updateFormData("serviceArea", e.target.value)} placeholder="e.g., Kigali & all Rwanda, destination weddings" /></Field>
                    <Field label="Package Image"><Input type="file" accept="image/*" onChange={handleImage} />{formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" />}</Field>
                </div>
            )}
            {currentStep === 2 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Services Offered</h3>
                    <Field label="Vendor Management">
                        <Sel value={formData.vendorManagement || "yes"} onChange={(v) => updateFormData("vendorManagement", v)}>
                            <option value="yes">Included</option>
                            <option value="no">Not Included</option>
                            <option value="addon">Available as Add-on</option>
                        </Sel>
                    </Field>
                    <Field label="Budget Management">
                        <Sel value={formData.budgetManagement || "yes"} onChange={(v) => updateFormData("budgetManagement", v)}>
                            <option value="yes">Included</option>
                            <option value="no">Not Included</option>
                            <option value="addon">Available as Add-on</option>
                        </Sel>
                    </Field>
                    <Field label="Timeline & Schedule Creation">
                        <Sel value={formData.timelineCreation || "yes"} onChange={(v) => updateFormData("timelineCreation", v)}>
                            <option value="yes">Included</option>
                            <option value="no">Not Included</option>
                        </Sel>
                    </Field>
                    <Field label="Guest List & RSVP Management">
                        <Sel value={formData.guestManagement || "yes"} onChange={(v) => updateFormData("guestManagement", v)}>
                            <option value="yes">Included</option>
                            <option value="no">Not Included</option>
                            <option value="addon">Available as Add-on</option>
                        </Sel>
                    </Field>
                    <Field label="Rehearsal Coordination">
                        <Sel value={formData.rehearsalCoordination || "yes"} onChange={(v) => updateFormData("rehearsalCoordination", v)}>
                            <option value="yes">Included</option>
                            <option value="no">Not Included</option>
                            <option value="addon">Available as Add-on</option>
                        </Sel>
                    </Field>
                    <Field label="Number of Meetings / Consultations">
                        <Input value={formData.meetingsIncluded || ""} onChange={(e) => updateFormData("meetingsIncluded", e.target.value)} placeholder="e.g., Unlimited, 10 meetings, Monthly check-ins" />
                    </Field>
                </div>
            )}
            {currentStep === 3 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Experience & Team</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Years of Experience"><Input type="number" value={formData.yearsExperience || ""} onChange={(e) => updateFormData("yearsExperience", e.target.value)} placeholder="e.g., 7" /></Field>
                        <Field label="Weddings Planned"><Input type="number" value={formData.weddingsPlanned || ""} onChange={(e) => updateFormData("weddingsPlanned", e.target.value)} placeholder="e.g., 150" /></Field>
                    </div>
                    <Field label="Team Size"><Input value={formData.teamSize || ""} onChange={(e) => updateFormData("teamSize", e.target.value)} placeholder="e.g., Lead planner + 2 assistants" /></Field>
                    <Field label="Certifications / Awards">
                        <Input value={formData.certifications || ""} onChange={(e) => updateFormData("certifications", e.target.value)} placeholder="e.g., Certified Wedding Planner (CWP), WPIC" />
                    </Field>
                    <Field label="Languages Spoken">
                        <Input value={formData.languages || ""} onChange={(e) => updateFormData("languages", e.target.value)} placeholder="e.g., English, French, Kinyarwanda" />
                    </Field>
                </div>
            )}
            {currentStep === 4 && (
                <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-charcoal">Pricing</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Package Price (RWF)" required><Input type="number" value={formData.price || ""} onChange={(e) => updateFormData("price", e.target.value)} placeholder="e.g., 2000000" /></Field>
                        <Field label="Deposit Required"><Input value={formData.depositRequired || ""} onChange={(e) => updateFormData("depositRequired", e.target.value)} placeholder="e.g., 30%" /></Field>
                    </div>
                    <Field label="Payment Schedule"><Input value={formData.paymentSchedule || ""} onChange={(e) => updateFormData("paymentSchedule", e.target.value)} placeholder="e.g., 30% deposit, 70% one month before" /></Field>
                    <Field label="Cancellation Policy" required><Textarea value={formData.cancellationPolicy || ""} onChange={(e) => updateFormData("cancellationPolicy", e.target.value)} rows={3} placeholder="e.g., Deposit non-refundable. Full refund if cancelled 90+ days before." /></Field>
                    <Field label="What's Included" hint="comma-separated"><Input value={formData.features || ""} onChange={(e) => updateFormData("features", e.target.value)} placeholder="e.g., Vendor management, budget tracking, day-of coordination" /></Field>
                    <Field label="Add-ons Available"><Input value={formData.addons || ""} onChange={(e) => updateFormData("addons", e.target.value)} placeholder="e.g., Honeymoon planning, rehearsal dinner coordination" /></Field>
                </div>
            )}
        </WizardShell>
    );
}

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

