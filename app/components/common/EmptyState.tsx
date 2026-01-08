import React from 'react';
import { Button } from "@/app/components/ui/button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: any) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-br from-burgundy/10 to-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-burgundy" />
      </div>
      <h3 className="text-xl font-semibold text-charcoal mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-burgundy hover:bg-burgundy-light text-white"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}