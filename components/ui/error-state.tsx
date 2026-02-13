import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message: string;
  className?: string;
}

export function ErrorState({ title, message, className }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className={cn("", className)}>
      <AlertCircle className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className }: InlineErrorProps) {
  return <p className={cn("text-sm text-destructive", className)}>{message}</p>;
}
