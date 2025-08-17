import React, { useEffect, useState } from 'react';
import { Eye, Download, Users, ChartBar, BarChart3, Lightbulb } from 'lucide-react';
import { generatePatientData, exportToCSV } from '../data/dataGenerator';
import type { PatientRecord } from '../data/dataGenerator';
import { initializeDatabase, insertPatients, getAgeWiseAnalysis, getCityWiseAnalysis, getDiopterDistribution } from '../data/database';
import type { AgeGroupAnalysis, CityAnalysis, DiopterDistribution } from '../data/database';
import AgeWiseIncidenceChart from './Charts/AgeWiseIncidenceChart';
import DiopterDistributionChart from './Charts/DiopterDistributionChart';
import GlobalComparisonChart from './Charts/GlobalComparisonChart';
import Filters from './Filters';
import Insights from './Insights';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'insights'>('dashboard');
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [filteredCount, setFilteredCount] = useState(0);
  const [ageAnalysis, setAgeAnalysis] = useState<AgeGroupAnalysis[]>([]);
  const [cityAnalysis, setCityAnalysis] = useState<CityAnalysis[]>([]);
  const [diopterDistribution, setDiopterDistribution] = useState<DiopterDistribution[]>([]);
  const [filters, setFilters] = useState({
    ageMin: 35,
    ageMax: 75,
    city: '',
    gender: '',
    occupation: ''
  });

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (patients.length > 0) {
      loadAnalysis();
    }
  }, [filters]);

  const initializeData = async () => {
    try {
      setLoading(true);
      await initializeDatabase();
      const generatedPatients = generatePatientData(5000);
      setPatients(generatedPatients);
      await insertPatients(generatedPatients);
      await loadAnalysis();
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalysis = async () => {
    try {
      const filterParams = {
        ageMin: filters.ageMin,
        ageMax: filters.ageMax,
        city: filters.city || undefined,
        gender: filters.gender || undefined,
        occupation: filters.occupation || undefined
      };
      
      const [ageData, cityData, diopterData] = await Promise.all([
        getAgeWiseAnalysis(filterParams),
        getCityWiseAnalysis(),
        getDiopterDistribution(filterParams)
      ]);
      setAgeAnalysis(ageData);
      setCityAnalysis(cityData);
      setDiopterDistribution(diopterData);
      
      // Calculate total filtered count
      const totalFiltered = ageData.reduce((sum, group) => sum + group.totalCount, 0);
      setFilteredCount(totalFiltered);
    } catch (error) {
      console.error('Error loading analysis:', error);
    }
  };

  const handleExportData = () => {
    const csv = exportToCSV(patients);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presbyopia_patients_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nudge-background">
      <header className="bg-white shadow-sm border-b border-nudge-gray-light sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <img src="/nudge_logo.svg" alt="The Nudge" className="h-6 sm:h-8 w-auto flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-nudge-h2 font-heading text-nudge-slate truncate">Presbyopia Analysis</h1>
                <p className="text-xs sm:text-sm text-nudge-gray font-montserrat hidden sm:block">Vision Screening Program</p>
              </div>
            </div>
            <button
              onClick={handleExportData}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-nudge-brown text-white rounded-lg hover:bg-nudge-brown-dark transition-colors font-montserrat font-button text-sm sm:text-base"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export Data</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 flex items-center justify-center sm:justify-start space-x-2 border-b-2 font-montserrat font-button text-sm transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-nudge-brown text-nudge-brown'
                    : 'border-transparent text-nudge-gray hover:text-nudge-slate hover:border-nudge-gray-light'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 flex items-center justify-center sm:justify-start space-x-2 border-b-2 font-montserrat font-button text-sm transition-colors ${
                  activeTab === 'insights'
                    ? 'border-nudge-brown text-nudge-brown'
                    : 'border-transparent text-nudge-gray hover:text-nudge-slate hover:border-nudge-gray-light'
                }`}
              >
                <Lightbulb className="h-4 w-4" />
                <span>Insights</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-montserrat font-medium text-nudge-gray">
                  {(filters.city || filters.gender || filters.occupation || filters.ageMin !== 35 || filters.ageMax !== 75) ? 'Filtered Patients' : 'Total Patients'}
                </p>
                <p className="text-2xl sm:text-3xl font-montserrat font-heading text-nudge-slate mt-1">
                  {(filters.city || filters.gender || filters.occupation || filters.ageMin !== 35 || filters.ageMax !== 75) ? filteredCount.toLocaleString() : patients.length.toLocaleString()}
                </p>
                {(filters.city || filters.gender || filters.occupation || filters.ageMin !== 35 || filters.ageMax !== 75) && (
                  <p className="text-xs text-nudge-gray-light mt-1">of {patients.length.toLocaleString()} total</p>
                )}
              </div>
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-nudge-brown opacity-20 flex-shrink-0 ml-3" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-montserrat font-medium text-nudge-gray">Cities Covered</p>
                <p className="text-2xl sm:text-3xl font-montserrat font-heading text-nudge-slate mt-1">{cityAnalysis.length}</p>
              </div>
              <ChartBar className="h-10 w-10 sm:h-12 sm:w-12 text-nudge-brown-light opacity-20 flex-shrink-0 ml-3" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-montserrat font-medium text-nudge-gray">Avg Diopter</p>
                <p className="text-2xl sm:text-3xl font-montserrat font-heading text-nudge-slate mt-1">
                  +{(patients.reduce((acc, p) => acc + p.diopterStrength, 0) / patients.length).toFixed(2)}
                </p>
              </div>
              <Eye className="h-10 w-10 sm:h-12 sm:w-12 text-nudge-brown opacity-20 flex-shrink-0 ml-3" />
            </div>
          </div>
        </div>

        <Filters filters={filters} onFilterChange={setFilters} cities={cityAnalysis.map(c => c.city)} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <AgeWiseIncidenceChart data={ageAnalysis} />
          <DiopterDistributionChart data={diopterDistribution} />
        </div>

        <div className="mt-4 sm:mt-6">
          <GlobalComparisonChart localData={ageAnalysis} />
        </div>

        <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-nudge-h5 font-heading text-nudge-slate mb-4">City-wise Distribution</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {cityAnalysis.slice(0, 10).map(city => (
              <div key={city.city} className="text-center p-2 sm:p-3 bg-nudge-background rounded-lg hover:bg-gray-50 transition-colors">
                <p className="text-xs sm:text-sm text-nudge-gray font-medium truncate">{city.city}</p>
                <p className="text-lg sm:text-xl font-semibold text-nudge-slate mt-1">{city.count}</p>
                <p className="text-xs text-nudge-gray-light mt-1">Avg: +{city.averageDiopter}</p>
              </div>
            ))}
          </div>
        </div>
          </>
        )}

        {/* Insights Tab Content */}
        {activeTab === 'insights' && (
          <Insights localData={ageAnalysis} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;