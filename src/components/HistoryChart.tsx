import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Button } from '@/components/ui/button';

type TimeRange = '1D' | '1W' | '1M' | '1Y' | '5Y';

export interface HistoryDataPoint {
  timestamp: string;
  yes: number;
  no: number;
  total: number;
}

interface HistoryChartProps {
  data: HistoryDataPoint[];
  language: 'en' | 'hr';
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  const yesValue = payload.find(p => p.dataKey === 'yesPercent')?.value ?? 0;
  const noValue = payload.find(p => p.dataKey === 'noPercent')?.value ?? 0;
  const total = payload[0].payload.total;

  return (
    <div className="bg-card border border-border rounded-md p-3 shadow-lg">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <div className="space-y-1 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-blue-600">Yes:</span>
          <span className="font-mono font-medium">{yesValue.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-red-600">No:</span>
          <span className="font-mono font-medium">{noValue.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-border">
          <span className="text-muted-foreground">Total:</span>
          <span className="font-mono">{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export function HistoryChart({ data, language }: HistoryChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1W');

  const ranges: TimeRange[] = ['1D', '1W', '1M', '1Y', '5Y'];

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        title: 'Vote Trend Over Time',
        agree: 'Agree %',
        disagree: 'Disagree %',
      },
      hr: {
        title: 'Trend Glasanja Tijekom Vremena',
        agree: 'Slaže se %',
        disagree: 'Ne slaže se %',
      },
    };
    return translations[language][key] || key;
  };

  // Transform data to include percentages
  const chartData = data.map(point => {
    const total = Math.max(1, point.yes + point.no);
    return {
      timestamp: point.timestamp,
      yesPercent: (point.yes / total) * 100,
      noPercent: (point.no / total) * 100,
      total: point.total,
    };
  });

  return (
    <section className="bg-card border border-border rounded-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">{t('title')}</h2>
        <div className="flex gap-1">
          {ranges.map(range => (
            <Button
              key={range}
              variant={selectedRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRange(range)}
              className="h-8 px-3 text-xs"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="timestamp"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="yesPercent"
            stroke="hsl(210, 70%, 50%)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="noPercent"
            stroke="hsl(4, 65%, 55%)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
