import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = 'medium', text = 'Loading...' }: { size?: 'small' | 'medium' | 'large'; text?: string }) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8',
  };

  const textClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  return (
    <div className="flex items-center justify-center p-6">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      <span className={`ml-2 text-muted-foreground ${textClasses[size]}`}>{text}</span>
    </div>
  );
}