import React from 'react';
import { Filter } from 'lucide-react';

interface FiltersProps {
  filters: {
    ageMin: number;
    ageMax: number;
    city: string;
    gender: string;
    occupation: string;
  };
  onFilterChange: (filters: any) => void;
  cities: string[];
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, cities }) => {
  const occupations = [
    'All', 'Office Worker', 'Teacher', 'Farmer', 'Shop Owner', 'Driver',
    'Tailor', 'Construction Worker', 'Cook', 'Security Guard', 'Housewife',
    'Electrician', 'Carpenter', 'Plumber', 'Mechanic', 'Vendor',
    'Clerk', 'Accountant', 'Nurse', 'Police Officer', 'Retired'
  ];

  const handleChange = (field: string, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-4 sm:h-5 w-4 sm:w-5 text-nudge-gray" />
        <h2 className="text-base sm:text-lg font-semibold text-nudge-slate">Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="sm:col-span-2 md:col-span-1">
          <label className="block text-xs sm:text-sm font-medium text-nudge-slate mb-1">Age Range</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="35"
              max="75"
              value={filters.ageMin}
              onChange={(e) => handleChange('ageMin', parseInt(e.target.value))}
              className="w-full sm:w-20 px-2 sm:px-3 py-2 text-sm sm:text-base border border-nudge-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-nudge-brown touch-manipulation"
              inputMode="numeric"
            />
            <span className="text-nudge-gray flex-shrink-0">-</span>
            <input
              type="number"
              min="35"
              max="75"
              value={filters.ageMax}
              onChange={(e) => handleChange('ageMax', parseInt(e.target.value))}
              className="w-full sm:w-20 px-2 sm:px-3 py-2 text-sm sm:text-base border border-nudge-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-nudge-brown touch-manipulation"
              inputMode="numeric"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-nudge-slate mb-1">City</label>
          <select
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-nudge-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-nudge-brown touch-manipulation appearance-none bg-white"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-nudge-slate mb-1">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-nudge-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-nudge-brown touch-manipulation appearance-none bg-white"
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-nudge-slate mb-1">Occupation</label>
          <select
            value={filters.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
            className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-nudge-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-nudge-brown touch-manipulation appearance-none bg-white"
          >
            {occupations.map(occ => (
              <option key={occ} value={occ === 'All' ? '' : occ}>{occ}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end sm:col-span-2 md:col-span-1">
          <button
            onClick={() => onFilterChange({
              ageMin: 35,
              ageMax: 75,
              city: '',
              gender: '',
              occupation: ''
            })}
            className="w-full px-3 sm:px-4 py-2 bg-nudge-background text-nudge-slate text-sm sm:text-base rounded-md hover:bg-nudge-cream active:bg-nudge-cream transition-colors touch-manipulation font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;