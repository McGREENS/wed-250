import { Search, Filter } from 'lucide-react';

export default function VendorsLoading() {
    return (
        <div className="min-h-screen bg-cream bg-noise">
            {/* Hero Section Skeleton */}
            <section className="bg-cream py-16 px-4 sm:px-6 lg:px-8 text-center">
                <div className="h-4 w-48 bg-gray-200 animate-pulse mx-auto rounded" />
                <div className="mt-4 h-12 w-96 bg-gray-200 animate-pulse mx-auto rounded" />
                <div className="mx-auto mt-6 h-6 max-w-2xl bg-gray-200 animate-pulse rounded" />
                
                <div className="mt-10 flex justify-center">
                    <div className="flex items-center p-2 bg-white rounded-full shadow-lg max-w-2xl w-full">
                        <Search className="h-5 w-5 text-gray-300 ml-3" />
                        <div className="flex-grow h-10 bg-gray-100 animate-pulse mx-3 rounded" />
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <div key={i} className="h-8 w-24 bg-gray-200 animate-pulse rounded-full" />
                    ))}
                </div>
            </section>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar Skeleton */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <div className="flex items-center gap-2 mb-6">
                                <Filter className="w-5 h-5 text-gray-300" />
                                <div className="h-5 w-20 bg-gray-200 animate-pulse rounded" />
                            </div>
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="border-b border-gray-100 pb-4">
                                        <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-3" />
                                        <div className="space-y-2">
                                            {[1, 2, 3, 4].map((j) => (
                                                <div key={j} className="h-4 bg-gray-100 animate-pulse rounded" />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Services Grid Skeleton */}
                    <div className="lg:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <div className="h-5 w-32 bg-gray-200 animate-pulse rounded" />
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-36 bg-gray-200 animate-pulse rounded" />
                                <div className="h-10 w-20 bg-gray-200 animate-pulse rounded" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="h-64 bg-gray-200 animate-pulse" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
                                        <div className="h-6 bg-gray-200 animate-pulse rounded" />
                                        <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
                                        <div className="flex justify-between items-center pt-2">
                                            <div className="h-5 w-24 bg-gray-200 animate-pulse rounded" />
                                            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
