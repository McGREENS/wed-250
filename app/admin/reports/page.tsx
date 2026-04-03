"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '../AdminLayout';
import {
    FileText,
    Download,
    Calendar,
    TrendingUp,
    Users,
    DollarSign,
    ShoppingBag,
    Star,
    Filter,
    RefreshCw,
    BarChart3,
    PieChart,
    LineChart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

type ReportType = 'revenue' | 'bookings' | 'vendors' | 'users' | 'performance';
type DateRange = '7days' | '30days' | '90days' | '1year' | 'all';

export default function AdminReportsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<any>(null);
    const [selectedReport, setSelectedReport] = useState<ReportType>('revenue');
    const [dateRange, setDateRange] = useState<DateRange>('30days');
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;
        
        if (!session?.user || session.user.role !== 'ADMIN') {
            router.push('/login');
            return;
        }

        fetchReportData();
    }, [session, status, router, selectedReport, dateRange]);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/reports?type=${selectedReport}&range=${dateRange}`);
            if (res.ok) {
                const data = await res.json();
                setReportData(data);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportReport = async (format: 'csv' | 'pdf') => {
        setExporting(true);
        try {
            const res = await fetch(`/api/admin/reports/export?type=${selectedReport}&range=${dateRange}&format=${format}`);
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedReport}-report-${dateRange}.${format}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Error exporting report:', error);
        } finally {
            setExporting(false);
        }
    };

    const reportTypes = [
        { id: 'revenue', label: 'Revenue Report', icon: DollarSign, color: 'from-green-500 to-green-600' },
        { id: 'bookings', label: 'Bookings Report', icon: Calendar, color: 'from-blue-500 to-blue-600' },
        { id: 'vendors', label: 'Vendors Report', icon: ShoppingBag, color: 'from-purple-500 to-purple-600' },
        { id: 'users', label: 'Users Report', icon: Users, color: 'from-orange-500 to-orange-600' },
        { id: 'performance', label: 'Performance Report', icon: TrendingUp, color: 'from-pink-500 to-pink-600' },
    ];

    const dateRanges = [
        { id: '7days', label: 'Last 7 Days' },
        { id: '30days', label: 'Last 30 Days' },
        { id: '90days', label: 'Last 90 Days' },
        { id: '1year', label: 'Last Year' },
        { id: 'all', label: 'All Time' },
    ];

    if (loading && !reportData) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading reports...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-2">
                                Reports & Analytics
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600">
                                Generate comprehensive reports and insights
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <Button
                                onClick={fetchReportData}
                                variant="outline"
                                disabled={loading}
                                className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white text-sm"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">Refresh</span>
                            </Button>
                            <Button
                                onClick={() => exportReport('csv')}
                                disabled={exporting}
                                className="bg-green-600 hover:bg-green-700 text-white text-sm"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Export </span>CSV
                            </Button>
                            <Button
                                onClick={() => exportReport('pdf')}
                                disabled={exporting}
                                className="bg-burgundy hover:bg-burgundy/90 text-white text-sm"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Export </span>PDF
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Report Type Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {reportTypes.map((report) => {
                        const Icon = report.icon;
                        return (
                            <Card
                                key={report.id}
                                className={`cursor-pointer transition-all ${
                                    selectedReport === report.id
                                        ? 'ring-2 ring-burgundy shadow-lg'
                                        : 'hover:shadow-md'
                                }`}
                                onClick={() => setSelectedReport(report.id as ReportType)}
                            >
                                <CardContent className="p-3 sm:p-4">
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${report.color} rounded-xl flex items-center justify-center mb-3`}>
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <p className="text-sm font-semibold text-charcoal">{report.label}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Date Range Filter */}
                <Card className="mb-6 sm:mb-8">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <Filter className="w-5 h-5 text-gray-600 hidden sm:block" />
                            <span className="text-sm font-semibold text-charcoal">Date Range:</span>
                            <div className="flex flex-wrap gap-2">
                                {dateRanges.map((range) => (
                                    <Button
                                        key={range.id}
                                        onClick={() => setDateRange(range.id as DateRange)}
                                        variant={dateRange === range.id ? 'default' : 'outline'}
                                        size="sm"
                                        className={dateRange === range.id ? 'bg-burgundy hover:bg-burgundy/90' : ''}
                                    >
                                        {range.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Report Content */}
                {reportData && (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                            {reportData.summary?.map((item: any, index: number) => (
                                <Card key={index} className="border-gray-100 shadow-sm">
                                    <CardContent className="p-6">
                                        <p className="text-sm text-gray-600 mb-2">{item.label}</p>
                                        <p className="text-3xl font-bold text-charcoal mb-2">{item.value}</p>
                                        {item.change && (
                                            <div className={`flex items-center gap-1 text-sm ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                <TrendingUp className="w-4 h-4" />
                                                <span>{item.change > 0 ? '+' : ''}{item.change}%</span>
                                                <span className="text-gray-500">vs previous period</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Charts Section */}
                        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                            {/* Trend Chart */}
                            <Card>
                                <CardHeader className="border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <LineChart className="w-5 h-5" />
                                        Trend Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {reportData.trendData && reportData.trendData.length > 0 ? (
                                        <div className="space-y-4">
                                            {reportData.trendData.map((item: any, index: number) => (
                                                <div key={index}>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-sm text-gray-600">{item.label}</span>
                                                        <span className="text-sm font-semibold text-charcoal">{item.value}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                                        <div
                                                            className="bg-gradient-to-r from-burgundy to-burgundy/60 h-3 rounded-full transition-all"
                                                            style={{ width: `${item.percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-gray-500">
                                            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p>No trend data available</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Distribution Chart */}
                            <Card>
                                <CardHeader className="border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <PieChart className="w-5 h-5" />
                                        Distribution
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {reportData.distributionData && reportData.distributionData.length > 0 ? (
                                        <div className="space-y-3">
                                            {reportData.distributionData.map((item: any, index: number) => (
                                                <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-4 h-4 rounded-full"
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                        <span className="text-sm font-medium text-charcoal">{item.label}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm text-gray-600">{item.percentage}%</span>
                                                        <span className="text-sm font-semibold text-charcoal">{item.value}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-gray-500">
                                            <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p>No distribution data available</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Data Table */}
                        <Card>
                            <CardHeader className="border-b px-4 sm:px-6">
                                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                                    <FileText className="w-5 h-5" />
                                    Detailed Report Data
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                {reportData.detailedData && reportData.detailedData.length > 0 ? (
                                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    {reportData.columns?.map((col: string, index: number) => (
                                                        <th key={index} className="text-left py-3 px-4 text-sm font-semibold text-charcoal">
                                                            {col}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData.detailedData.map((row: any, rowIndex: number) => (
                                                    <tr key={rowIndex} className="border-b border-gray-100 hover:bg-gray-50">
                                                        {Object.values(row).map((cell: any, cellIndex: number) => (
                                                            <td key={cellIndex} className="py-3 px-4 text-sm text-gray-700">
                                                                {typeof cell === 'object' && cell !== null ? (
                                                                    <Badge className={cell.className}>{cell.value}</Badge>
                                                                ) : (
                                                                    cell
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No detailed data available</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
