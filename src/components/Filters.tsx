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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-nudge-gray" />
        <h2 className="text-lg font-semibold text-nudge-slate">Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-nudge-slate mb-1">Age Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              min="35"
              max="75"
              value={filters.ageMin}
              onChange={(e) => handleChange('ageMin', parseInt(e.target.value))}
              className="w-20 px-3 py-2 border border-nudge-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-nudge-brown"
            />
            <span className="py-2">-</span>
            <input
              type="number"
              min="35"
              max="75"
              value={filters.ageMax}
              onChange={(e) => handleChange('ageMax', parseInt(e.target.value))}
              className="w-20 px-3 py-2 border border-nudge-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-nudge-brown"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-nudge-slate mb-1">City</label>
          <select
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-nudge-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-nudge-brown"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-nudge-slate mb-1">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-3 py-2 border border-nudge-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-nudge-brown"
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-nudge-slate mb-1">Occupation</label>
          <select
            value={filters.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
            className="w-full px-3 py-2 border border-nudge-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-nudge-brown"
          >
            {occupations.map(occ => (
              <option key={occ} value={occ === 'All' ? '' : occ}>{occ}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => onFilterChange({
              ageMin: 35,
              ageMax: 75,
              city: '',
              gender: '',
              occupation: ''
            })}
            className="w-full px-4 py-2 bg-nudge-background text-nudge-slate rounded-md hover:bg-nudge-cream transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;