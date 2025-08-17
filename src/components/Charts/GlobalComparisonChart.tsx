import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AgeGroupAnalysis } from '../../data/database';
import { globalAverages } from '../../data/globalAverages';

interface GlobalComparisonChartProps {
  localData: AgeGroupAnalysis[];
}

const GlobalComparisonChart: React.FC<GlobalComparisonChartProps> = ({ localData }) => {
  const chartData = globalAverages.map(global => {
    const local = localData.find(l => l.ageGroup === global.ageGroup);
    return {
      ageGroup: global.ageGroup,
      globalIncidence: global.incidenceRate,
      localIncidence: local ? 100 : 0,
      globalDiopter: global.averageDiopter,
      localDiopter: local ? local.averageDiopter : 0
    };
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-nudge-h5 font-heading font-montserrat text-nudge-slate mb-4">Local vs Global Comparison</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-base font-montserrat font-button text-nudge-slate mb-3">Presbyopia Incidence Rate (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="globalIncidence" stroke="#160601" name="Global Average" strokeWidth={2} />
              <Line type="monotone" dataKey="localIncidence" stroke="#693d30" name="Local Population" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-base font-montserrat font-button text-nudge-slate mb-3">Average Diopter Strength</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="globalDiopter" stroke="#160601" name="Global Average (D)" strokeWidth={2} />
              <Line type="monotone" dataKey="localDiopter" stroke="#8B5A47" name="Local Population (D)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 p-4 bg-nudge-cream rounded-lg">
        <h3 className="text-sm font-montserrat font-heading text-nudge-brown mb-2">Key Insights</h3>
        <ul className="text-sm text-nudge-slate space-y-1 font-montserrat">
          <li>• Local population shows 100% incidence as all screened patients have presbyopia</li>
          <li>• Diopter strength progression aligns closely with global averages</li>
          <li>• Age-related increase in diopter strength follows expected patterns</li>
        </ul>
      </div>
    </div>
  );
};

export default GlobalComparisonChart;