import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DiopterDistribution } from '../../data/database';

interface DiopterDistributionChartProps {
  data: DiopterDistribution[];
}

const DiopterDistributionChart: React.FC<DiopterDistributionChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    diopter: `+${item.diopter}`,
    count: item.count
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-nudge-h5 font-heading font-montserrat text-nudge-slate mb-4">Diopter Strength Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="diopter" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#693d30" fill="#693d30" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-nudge-gray font-montserrat">
        <p>Distribution of prescribed diopter strengths across all patients.</p>
      </div>
    </div>
  );
};

export default DiopterDistributionChart;