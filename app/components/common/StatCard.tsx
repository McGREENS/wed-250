import React from 'react';
import { Card, CardContent } from "@/app/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'up',
  color = 'from-burgundy to-burgundy/60'
}: any) {
  return (
    <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
              {trendDirection === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {trend}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-charcoal">{value}</p>
      </CardContent>
    </Card>
  );
}