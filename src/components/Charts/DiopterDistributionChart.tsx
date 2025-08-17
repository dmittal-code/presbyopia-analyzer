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
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-base sm:text-nudge-h5 font-heading font-montserrat text-nudge-slate mb-3 sm:mb-4">Diopter Strength Distribution</h2>
      <div className="-mx-2 sm:mx-0">
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="diopter" 
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ fontSize: '12px' }}
              wrapperStyle={{ zIndex: 1000 }}
            />
            <Area type="monotone" dataKey="count" stroke="#693d30" fill="#693d30" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-nudge-gray font-montserrat">
        <p>Distribution of prescribed diopter strengths across all patients.</p>
      </div>
    </div>
  );
};

export default DiopterDistributionChart;