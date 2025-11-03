import { Wrench, Clock } from 'lucide-react';

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Wrench className="h-24 w-24 text-primary" />
            <Clock className="h-12 w-12 text-accent absolute -bottom-2 -right-2" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">System Maintenance</h1>
        <p className="text-lg text-muted-foreground mb-6">
          We're performing scheduled maintenance to improve your experience.
        </p>

        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="font-semibold mb-2">Expected Duration</h2>
          <p className="text-muted-foreground">2-4 hours</p>
        </div>

        <p className="text-sm text-muted-foreground">
          For urgent inquiries, contact us at{' '}
          <a href="mailto:support@publicpolling.app" className="text-primary hover:underline">
            support@publicpolling.app
          </a>
        </p>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Status updates: @publicpolling on social media
          </p>
        </div>
      </div>
    </div>
  );
}
