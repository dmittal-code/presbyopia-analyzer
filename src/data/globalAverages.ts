export interface GlobalAverage {
  ageGroup: string;
  ageMin: number;
  ageMax: number;
  incidenceRate: number;
  averageDiopter: number;
}

export const globalAverages: GlobalAverage[] = [
  {
    ageGroup: '35-39',
    ageMin: 35,
    ageMax: 39,
    incidenceRate: 35,
    averageDiopter: 1.00
  },
  {
    ageGroup: '40-44',
    ageMin: 40,
    ageMax: 44,
    incidenceRate: 50,
    averageDiopter: 1.25
  },
  {
    ageGroup: '45-49',
    ageMin: 45,
    ageMax: 49,
    incidenceRate: 65,
    averageDiopter: 1.50
  },
  {
    ageGroup: '50-54',
    ageMin: 50,
    ageMax: 54,
    incidenceRate: 80,
    averageDiopter: 2.00
  },
  {
    ageGroup: '55-59',
    ageMin: 55,
    ageMax: 59,
    incidenceRate: 90,
    averageDiopter: 2.25
  },
  {
    ageGroup: '60-64',
    ageMin: 60,
    ageMax: 64,
    incidenceRate: 95,
    averageDiopter: 2.50
  },
  {
    ageGroup: '65-69',
    ageMin: 65,
    ageMax: 69,
    incidenceRate: 98,
    averageDiopter: 2.75
  },
  {
    ageGroup: '70-75',
    ageMin: 70,
    ageMax: 75,
    incidenceRate: 99,
    averageDiopter: 3.00
  }
];

export function getGlobalAverageForAge(age: number): GlobalAverage | undefined {
  return globalAverages.find(avg => age >= avg.ageMin && age <= avg.ageMax);
}