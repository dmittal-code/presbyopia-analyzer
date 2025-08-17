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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-nudge-h5 font-heading font-montserrat text-nudge-slate mb-4">Age-wise Patient Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ageGroup" />
          <YAxis yAxisId="left" orientation="left" stroke="#693d30" />
          <YAxis yAxisId="right" orientation="right" stroke="#8B5A47" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="patients" fill="#693d30" name="Number of Patients" />
          <Bar yAxisId="right" dataKey="avgDiopter" fill="#8B5A47" name="Avg Diopter (D)" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-nudge-gray font-montserrat">
        <p>Total patients analyzed across different age groups with their average diopter strength.</p>
      </div>
    </div>
  );
};

export default AgeWiseIncidenceChart;