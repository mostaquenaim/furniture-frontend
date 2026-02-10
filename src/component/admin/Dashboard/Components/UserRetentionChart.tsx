// components/dashboard/UserRetentionChart.tsx
'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RetentionData {
  week: string;
  newUsers: number;
  returningUsers: number;
  retentionRate: number;
}

interface UserRetentionChartProps {
  data: RetentionData[];
}

const UserRetentionChart: React.FC<UserRetentionChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-900">Week {label}</p>
          <p className="text-sm text-blue-600">
            New Users: {payload[0]?.value}
          </p>
          <p className="text-sm text-green-600">
            Returning: {payload[1]?.value}
          </p>
          <p className="text-sm font-medium text-gray-900">
            Retention: {payload[2]?.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="week"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="newUsers"
            fill="#3b82f6"
            name="New Users"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="returningUsers"
            fill="#10b981"
            name="Returning Users"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserRetentionChart;