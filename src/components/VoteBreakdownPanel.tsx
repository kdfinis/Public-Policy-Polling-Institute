import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { fetchVoterBreakdown, type VoterBreakdown } from '@/lib/users';
import { Skeleton } from '@/components/ui/skeleton';

interface VoteBreakdownPanelProps {
  voterId: string;
}

export function VoteBreakdownPanel({ voterId }: VoteBreakdownPanelProps) {
  const [loading, setLoading] = useState(true);
  const [breakdown, setBreakdown] = useState<VoterBreakdown | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchVoterBreakdown(voterId);
      if (mounted) {
        setBreakdown(data);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [voterId]);

  if (loading) {
    return (
      <section className="bg-card border border-border rounded-md p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Vote Breakdown</h2>
        <Skeleton className="h-64 w-full" />
      </section>
    );
  }

  if (!breakdown) return null;

  const renderBreakdown = (items: Array<{ label: string; count: number; percentage: number }>) => (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-medium">{item.label}</span>
            <span className="text-muted-foreground">{item.count} votes ({item.percentage}%)</span>
          </div>
          <Progress value={item.percentage} className="h-2" />
        </div>
      ))}
    </div>
  );

  return (
    <section className="bg-card border border-border rounded-md p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">Vote Breakdown</h2>
      <Tabs defaultValue="position" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="position">Position</TabsTrigger>
          <TabsTrigger value="category">Category</TabsTrigger>
          <TabsTrigger value="region">Region</TabsTrigger>
        </TabsList>
        
        <TabsContent value="position" className="space-y-4 mt-4">
          {renderBreakdown(breakdown.byPosition)}
        </TabsContent>
        
        <TabsContent value="category" className="space-y-4 mt-4">
          {renderBreakdown(breakdown.byCategory)}
        </TabsContent>
        
        <TabsContent value="region" className="space-y-4 mt-4">
          {renderBreakdown(breakdown.byRegion)}
        </TabsContent>
      </Tabs>
    </section>
  );
}
