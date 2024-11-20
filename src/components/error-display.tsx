import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorDisplayProps {
  error: Error | unknown;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  
  return (
    <div className="container mx-auto p-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
} 