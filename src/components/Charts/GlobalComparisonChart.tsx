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
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-base sm:text-nudge-h5 font-heading font-montserrat text-nudge-slate mb-3 sm:mb-4">Local vs Global Comparison</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <h3 className="text-sm sm:text-base font-montserrat font-button text-nudge-slate mb-2 sm:mb-3">Presbyopia Incidence Rate (%)</h3>
          <div className="-mx-2 sm:mx-0">
            <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="ageGroup" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ fontSize: '11px' }}
                  wrapperStyle={{ zIndex: 1000 }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px' }}
                  iconSize={10}
                />
                <Line type="monotone" dataKey="globalIncidence" stroke="#160601" name="Global" strokeWidth={2} />
                <Line type="monotone" dataKey="localIncidence" stroke="#693d30" name="Local" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-sm sm:text-base font-montserrat font-button text-nudge-slate mb-2 sm:mb-3">Average Diopter Strength</h3>
          <div className="-mx-2 sm:mx-0">
            <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="ageGroup" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ fontSize: '11px' }}
                  wrapperStyle={{ zIndex: 1000 }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px' }}
                  iconSize={10}
                />
                <Line type="monotone" dataKey="globalDiopter" stroke="#160601" name="Global (D)" strokeWidth={2} />
                <Line type="monotone" dataKey="localDiopter" stroke="#8B5A47" name="Local (D)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-nudge-cream rounded-lg">
        <h3 className="text-xs sm:text-sm font-montserrat font-heading text-nudge-brown mb-2">Key Insights</h3>
        <ul className="text-xs sm:text-sm text-nudge-slate space-y-1 font-montserrat">
          <li className="flex items-start">
            <span className="mr-1 flex-shrink-0">•</span>
            <span>Local population shows 100% incidence as all screened patients have presbyopia</span>
          </li>
          <li className="flex items-start">
            <span className="mr-1 flex-shrink-0">•</span>
            <span>Diopter strength progression aligns closely with global averages</span>
          </li>
          <li className="flex items-start">
            <span className="mr-1 flex-shrink-0">•</span>
            <span>Age-related increase in diopter strength follows expected patterns</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GlobalComparisonChart;