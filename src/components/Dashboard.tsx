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
      <header className="bg-white shadow-sm border-b border-nudge-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/nudge_logo.svg" alt="The Nudge" className="h-8 w-auto" />
              <div>
                <h1 className="text-nudge-h2 font-heading text-nudge-slate">Presbyopia Analysis Dashboard</h1>
                <p className="text-sm text-nudge-gray font-montserrat">Vision Screening Program</p>
              </div>
            </div>
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-4 py-2 bg-nudge-brown text-white rounded-lg hover:bg-nudge-brown-dark transition-colors font-montserrat font-button"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-3 px-6 flex items-center space-x-2 border-b-2 font-montserrat font-button text-sm transition-colors ${
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
                className={`py-3 px-6 flex items-center space-x-2 border-b-2 font-montserrat font-button text-sm transition-colors ${
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-montserrat font-medium text-nudge-gray">
                  {(filters.city || filters.gender || filters.occupation) ? 'Filtered Patients' : 'Total Patients'}
                </p>
                <p className="text-3xl font-montserrat font-heading text-nudge-slate">
                  {(filters.city || filters.gender || filters.occupation) ? filteredCount.toLocaleString() : patients.length.toLocaleString()}
                </p>
                {(filters.city || filters.gender || filters.occupation) && (
                  <p className="text-xs text-nudge-gray-light mt-1">of {patients.length.toLocaleString()} total</p>
                )}
              </div>
              <Users className="h-12 w-12 text-nudge-brown opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-montserrat font-medium text-nudge-gray">Cities Covered</p>
                <p className="text-3xl font-montserrat font-heading text-nudge-slate">{cityAnalysis.length}</p>
              </div>
              <ChartBar className="h-12 w-12 text-nudge-brown-light opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-montserrat font-medium text-nudge-gray">Avg Diopter</p>
                <p className="text-3xl font-montserrat font-heading text-nudge-slate">
                  +{(patients.reduce((acc, p) => acc + p.diopterStrength, 0) / patients.length).toFixed(2)}
                </p>
              </div>
              <Eye className="h-12 w-12 text-nudge-brown opacity-20" />
            </div>
          </div>
        </div>

        <Filters filters={filters} onFilterChange={setFilters} cities={cityAnalysis.map(c => c.city)} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <AgeWiseIncidenceChart data={ageAnalysis} />
          <DiopterDistributionChart data={diopterDistribution} />
        </div>

        <div className="mt-6">
          <GlobalComparisonChart localData={ageAnalysis} />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-nudge-h5 font-heading text-nudge-slate mb-4">City-wise Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cityAnalysis.slice(0, 10).map(city => (
              <div key={city.city} className="text-center">
                <p className="text-sm text-nudge-gray">{city.city}</p>
                <p className="text-xl font-semibold text-nudge-slate">{city.count}</p>
                <p className="text-xs text-nudge-gray-light">Avg: +{city.averageDiopter}</p>
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