
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title?: string;
  description?: string;
  heading?: string;
  subheading?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  heading,
  subheading,
  children,
  action,
  className,
}: PageHeaderProps) {
  // Support for both naming conventions
  const displayTitle = title || heading || '';
  const displayDescription = description || subheading || '';

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{displayTitle}</h2>
        {displayDescription && (
          <p className="text-sm text-muted-foreground">{displayDescription}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {action || children}
      </div>
    </div>
  );
}
