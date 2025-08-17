import React from 'react';
import { AlertTriangle, TrendingUp, CheckCircle, Info } from 'lucide-react';
import type { AgeGroupAnalysis } from '../data/database';
import { globalAverages } from '../data/globalAverages';

interface InsightsProps {
  localData: AgeGroupAnalysis[];
}

interface Deviation {
  ageGroup: string;
  type: 'incidence' | 'diopter';
  localValue: number;
  globalValue: number;
  difference: number;
  percentageDiff?: number;
}

const Insights: React.FC<InsightsProps> = ({ localData }) => {
  const calculateDeviations = (): { incidenceDeviations: Deviation[], diopterDeviations: Deviation[] } => {
    const incidenceDeviations: Deviation[] = [];
    const diopterDeviations: Deviation[] = [];

    globalAverages.forEach(global => {
      const local = localData.find(l => l.ageGroup === global.ageGroup);
      if (!local) return;

      // Check incidence rate deviation (>10 percentage points)
      const incidenceDiff = local.incidenceRate - global.incidenceRate;
      if (Math.abs(incidenceDiff) > 10) {
        incidenceDeviations.push({
          ageGroup: global.ageGroup,
          type: 'incidence',
          localValue: local.incidenceRate,
          globalValue: global.incidenceRate,
          difference: incidenceDiff,
          percentageDiff: ((local.incidenceRate - global.incidenceRate) / global.incidenceRate) * 100
        });
      }

      // Check diopter deviation (>0.5 diopter)
      const diopterDiff = local.averageDiopter - global.averageDiopter;
      if (Math.abs(diopterDiff) > 0.5) {
        diopterDeviations.push({
          ageGroup: global.ageGroup,
          type: 'diopter',
          localValue: local.averageDiopter,
          globalValue: global.averageDiopter,
          difference: diopterDiff
        });
      }
    });

    return { incidenceDeviations, diopterDeviations };
  };

  const { incidenceDeviations, diopterDeviations } = calculateDeviations();
  const hasDeviations = incidenceDeviations.length > 0 || diopterDeviations.length > 0;

  const getDeviationColor = (difference: number) => {
    return difference > 0 ? 'text-nudge-brown' : 'text-nudge-brown-light';
  };

  const getDeviationBgColor = (difference: number) => {
    return difference > 0 ? 'bg-red-50 border-red-200' : 'bg-nudge-cream border-nudge-brown-light';
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className={`p-6 rounded-lg border-2 ${hasDeviations ? 'bg-amber-50 border-amber-200' : 'bg-nudge-cream border-nudge-brown-light'}`}>
        <div className="flex items-start space-x-3">
          {hasDeviations ? (
            <AlertTriangle className="h-6 w-6 text-nudge-brown mt-1" />
          ) : (
            <CheckCircle className="h-6 w-6 text-nudge-brown-light mt-1" />
          )}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-nudge-slate">
              {hasDeviations ? 'Deviations Detected' : 'No Significant Deviations'}
            </h2>
            <p className="mt-1 text-sm text-nudge-gray">
              {hasDeviations 
                ? `Found ${incidenceDeviations.length + diopterDeviations.length} deviation(s) from global averages that require attention.`
                : 'All metrics are within acceptable ranges compared to global averages.'}
            </p>
          </div>
        </div>
      </div>

      {/* Thresholds Info */}
      <div className="bg-nudge-background rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Info className="h-5 w-5 text-nudge-gray" />
          <h3 className="text-sm font-semibold text-nudge-slate">Deviation Thresholds</h3>
        </div>
        <div className="space-y-2 text-sm text-nudge-gray">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-nudge-brown rounded-full"></div>
            <span><strong>Incidence Rate:</strong> Deviation {'>'} 10 percentage points from global average</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-nudge-brown-light rounded-full"></div>
            <span><strong>Diopter Strength:</strong> Deviation {'>'} 0.5 diopter from global average</span>
          </div>
        </div>
      </div>

      {/* Incidence Rate Deviations */}
      {incidenceDeviations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-nudge-brown" />
            <h3 className="text-lg font-semibold text-gray-900">Incidence Rate Aberrations</h3>
          </div>
          <div className="space-y-3">
            {incidenceDeviations.map(dev => (
              <div key={dev.ageGroup} className={`p-4 rounded-lg border ${getDeviationBgColor(dev.difference)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">Age Group {dev.ageGroup}</h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>
                        <span className="text-nudge-gray">Local Rate:</span>{' '}
                        <span className="font-semibold">{dev.localValue.toFixed(1)}%</span>
                      </p>
                      <p>
                        <span className="text-nudge-gray">Global Average:</span>{' '}
                        <span className="font-semibold">{dev.globalValue.toFixed(1)}%</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getDeviationColor(dev.difference)}`}>
                      {dev.difference > 0 ? '+' : ''}{dev.difference.toFixed(1)}%
                    </p>
                    <p className="text-xs text-nudge-gray-light mt-1">percentage points</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-nudge-slate">
                    {dev.difference > 0 
                      ? `Incidence rate is ${Math.abs(dev.difference).toFixed(1)} percentage points higher than the global average, indicating a potential local health concern.`
                      : `Incidence rate is ${Math.abs(dev.difference).toFixed(1)} percentage points lower than the global average, which may indicate better eye health or underdiagnosis.`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diopter Deviations */}
      {diopterDeviations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-nudge-brown-light" />
            <h3 className="text-lg font-semibold text-gray-900">Diopter Strength Deviations</h3>
          </div>
          <div className="space-y-3">
            {diopterDeviations.map(dev => (
              <div key={dev.ageGroup} className={`p-4 rounded-lg border ${getDeviationBgColor(dev.difference)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">Age Group {dev.ageGroup}</h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>
                        <span className="text-nudge-gray">Local Average:</span>{' '}
                        <span className="font-semibold">+{dev.localValue.toFixed(2)}D</span>
                      </p>
                      <p>
                        <span className="text-nudge-gray">Global Average:</span>{' '}
                        <span className="font-semibold">+{dev.globalValue.toFixed(2)}D</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getDeviationColor(dev.difference)}`}>
                      {dev.difference > 0 ? '+' : ''}{dev.difference.toFixed(2)}D
                    </p>
                    <p className="text-xs text-nudge-gray-light mt-1">diopter difference</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-nudge-slate">
                    {dev.difference > 0 
                      ? `Average diopter strength is ${Math.abs(dev.difference).toFixed(2)}D higher than global average, suggesting more severe presbyopia progression.`
                      : `Average diopter strength is ${Math.abs(dev.difference).toFixed(2)}D lower than global average, indicating milder presbyopia cases.`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Deviations Message */}
      {!hasDeviations && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <CheckCircle className="h-12 w-12 text-nudge-brown-light mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Metrics Within Normal Range</h3>
          <p className="text-nudge-gray max-w-2xl mx-auto">
            The local population's presbyopia metrics align well with global averages. 
            No age groups show significant deviations in either incidence rates or diopter strengths.
          </p>
        </div>
      )}

      {/* Recommendations */}
      {hasDeviations && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            {incidenceDeviations.length > 0 && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-nudge-slate">
                    <strong>Incidence Rate Aberrations:</strong> Investigate environmental factors, 
                    occupational hazards, or screening methodology differences that might explain 
                    the deviation from global averages.
                  </p>
                </div>
              </div>
            )}
            {diopterDeviations.length > 0 && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-nudge-slate">
                    <strong>Diopter Strength Deviations:</strong> Review prescription practices, 
                    consider genetic factors, and evaluate if lifestyle or dietary factors 
                    contribute to the variation in presbyopia severity.
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  <strong>Next Steps:</strong> Consider conducting follow-up studies in affected 
                  age groups and consult with ophthalmology specialists for clinical validation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;