// apps/web/app/[locale]/admin/pnl/components/charts/TrendChart.tsx
// Description: Revenue/Expenses/Profit trend line chart
// Last modified: 2025-12-19

'use client';

import { BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../../_shared/utils/formatters';

type ChartDataPoint = {
  name: string;
  revenue: number;
  expenses: number;
  netProfit: number;
};

type TrendChartProps = {
  data: ChartDataPoint[];
  year: number;
};

export function TrendChart({ data, year }: TrendChartProps) {
  return (
    <div className="bg-zinc-900/20 border border-zinc-900 p-5">
      <h3 className="font-medium text-white flex items-center gap-2 mb-4">
        <BarChart3 className="h-4 w-4 text-violet-500" /> Tendances {year}
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Dépenses"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="netProfit"
              name="Profit Net"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
