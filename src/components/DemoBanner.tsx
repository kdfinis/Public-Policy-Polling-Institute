import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export function DemoBanner() {
  return (
    <Alert className="mb-4 border-yellow-500/50 bg-yellow-500/10">
      <Info className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800 dark:text-yellow-200">
        <strong>Demo Data:</strong> This site contains demonstration data only. All profiles, votes, and statistics are for illustrative purposes and do not represent real information.
      </AlertDescription>
    </Alert>
  );
}

