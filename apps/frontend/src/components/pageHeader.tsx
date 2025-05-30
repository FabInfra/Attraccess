import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@heroui/button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  actions?: ReactNode;
  icon?: ReactNode;
}

export function PageHeader({ title, subtitle, backTo, actions, icon }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8 flex-wrap gap-y-8">
      <div className="flex items-center">
        {backTo && (
          <Button onPress={() => navigate(backTo)} variant="ghost" isIconOnly aria-label="Go back" className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}

        <div className="flex-shrink">
          <div className="flex items-center gap-2">
            {icon && icon}
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          {subtitle && <p className="mt-1 text-sm text-foreground-500">{subtitle}</p>}
        </div>
      </div>

      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
