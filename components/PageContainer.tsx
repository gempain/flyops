import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
}

export function PageContainer({ children, className, fullWidth = false, noPadding = false }: PageContainerProps) {
  return (
    <div
      className={cn("min-h-screen pt-16", !noPadding && "pt-30 pb-16", !fullWidth && "px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}
