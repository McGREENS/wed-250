"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

export default function BudgetPage() {
    const [categories] = useState([
        { id: 1, name: 'Venue', estimated: 5000000, actual: 5000000, paid: true },
        { id: 2, name: 'Catering', estimated: 3000000, actual: 2500000, paid: true },
        { id: 3, name: 'Photography', estimated: 1000000, actual: 800000, paid: false },
        { id: 4, name: 'Decoration', estimated: 1500000, actual: 1200000, paid: true },
        { id: 5, name: 'Music/DJ', estimated: 600000, actual: 0, paid: false },
        { id: 6, name: 'Wedding Dress', estimated: 1200000, actual: 0, paid: false },
        { id: 7, name: 'Flowers', estimated: 800000, actual: 0, paid: false },
        { id: 8, name: 'Transportation', estimated: 400000, actual: 0, paid: false },
    ]);

    const totalEstimated = categories.reduce((sum, cat) => sum + cat.estimated, 0);
    const totalActual = categories.reduce((sum, cat) => sum + cat.actual, 0);
    const remaining = totalEstimated - totalActual;
    const percentUsed = Math.round((totalActual / totalEstimated) * 100);

    return (
        <UserPageLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif text-charcoal mb-2">Wedding Budget</h1>
                    <p className="text-gray-600">Track your wedding expenses and stay on budget</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-600">Total Budget</p>
                                <DollarSign className="w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-2xl font-bold text-charcoal">RWF {(totalEstimated / 1000000).toFixed(1)}M</p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-600">Spent</p>
                                <TrendingUp className="w-5 h-5 text-red-500" />
                            </div>
                            <p className="text-2xl font-bold text-red-600">RWF {(totalActual / 1000000).toFixed(1)}M</p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-600">Remaining</p>
                                <TrendingDown className="w-5 h-5 text-green-500" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">RWF {(remaining / 1000000).toFixed(1)}M</p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-600">Budget Used</p>
                            </div>
                            <p className="text-2xl font-bold text-burgundy">{percentUsed}%</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-gray-100 shadow-sm mb-8">
                    <CardContent className="p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-charcoal">Budget Overview</h3>
                            <p className="text-sm text-gray-600">RWF {(totalActual / 1000000).toFixed(1)}M of RWF {(totalEstimated / 1000000).toFixed(1)}M spent</p>
                        </div>
                        <Progress value={percentUsed} className="h-3" />
                    </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-sm">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-charcoal mb-6">Budget Breakdown</h3>
                        <div className="space-y-4">
                            {categories.map(category => {
                                const categoryPercent = category.estimated > 0 ? Math.round((category.actual / category.estimated) * 100) : 0;

                                return (
                                    <div key={category.id} className="p-4 border border-gray-100 rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-charcoal">{category.name}</h4>
                                                    {category.paid && <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Paid</span>}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="text-gray-600">Estimated: <span className="font-medium text-charcoal">RWF {category.estimated.toLocaleString()}</span></span>
                                                    <span className="text-gray-600">Actual: <span className="font-medium">RWF {category.actual.toLocaleString()}</span></span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-burgundy">{categoryPercent}%</p>
                                            </div>
                                        </div>
                                        <Progress value={categoryPercent} className="h-2" />
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </UserPageLayout>
    );
}
