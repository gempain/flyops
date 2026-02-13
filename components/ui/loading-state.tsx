import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  message?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export function LoadingState({ className, message, size = "md" }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}

interface InlineLoadingProps {
  className?: string;
}

export function InlineLoading({ className }: InlineLoadingProps) {
  return <Loader2 className={cn("w-4 h-4 animate-spin", className)} />;
}
