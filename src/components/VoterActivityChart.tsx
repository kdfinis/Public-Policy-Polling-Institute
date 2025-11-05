import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchVoterActivity, type VoterActivityPoint } from '@/lib/users';
import { Skeleton } from '@/components/ui/skeleton';

type TimeRange = '1W' | '1M' | '3M' | '1Y' | 'ALL';

interface VoterActivityChartProps {
  voterId: string;
}

export function VoterActivityChart({ voterId }: VoterActivityChartProps) {
  const [range, setRange] = useState<TimeRange>('1M');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VoterActivityPoint[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      const activity = await fetchVoterActivity(voterId, range);
      if (mounted) {
        setData(activity);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [voterId, range]);

  if (loading) {
    return (
      <section className="bg-card border border-border rounded-md p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Voting Activity</h2>
        <Skeleton className="h-80 w-full" />
      </section>
    );
  }

  return (
    <section className="bg-card border border-border rounded-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Voting Activity</h2>
        <div className="flex gap-1">
          {(['1W', '1M', '3M', '1Y', 'ALL'] as TimeRange[]).map((r) => (
            <Button
              key={r}
              variant={range === r ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRange(r)}
              className="text-xs px-2"
            >
              {r}
            </Button>
          ))}
        </div>
      </div>
      {data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          No voting activity in this period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="votes" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
              name="Votes Cast"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
