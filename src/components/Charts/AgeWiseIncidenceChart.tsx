import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AgeGroupAnalysis } from '../../data/database';

interface AgeWiseIncidenceChartProps {
  data: AgeGroupAnalysis[];
}

const AgeWiseIncidenceChart: React.FC<AgeWiseIncidenceChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    ageGroup: item.ageGroup,
    patients: item.totalCount,
    avgDiopter: item.averageDiopter
  }));

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-base sm:text-nudge-h5 font-heading font-montserrat text-nudge-slate mb-3 sm:mb-4">Age-wise Patient Distribution</h2>
      <div className="-mx-2 sm:mx-0">
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="ageGroup" 
              tick={{ fontSize: 11 }} 
              angle={-45} 
              textAnchor="end" 
              height={60}
            />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              stroke="#693d30" 
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#8B5A47" 
              tick={{ fontSize: 11 }}
            />
            <Tooltip 
              contentStyle={{ fontSize: '12px' }}
              wrapperStyle={{ zIndex: 1000 }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconSize={12}
            />
            <Bar yAxisId="left" dataKey="patients" fill="#693d30" name="Patients" />
            <Bar yAxisId="right" dataKey="avgDiopter" fill="#8B5A47" name="Avg Diopter" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-nudge-gray font-montserrat">
        <p>Total patients analyzed across different age groups with their average diopter strength.</p>
      </div>
    </div>
  );
};

export default AgeWiseIncidenceChart;