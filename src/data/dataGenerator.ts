export interface PatientRecord {
  id: number;
  name: string;
  age: number;
  aadhaarId: string;
  occupation: string;
  gender: 'Male' | 'Female';
  city: string;
  previousGlasses: boolean;
  diopterStrength: number;
}

const indianFirstNames = {
  male: [
    'Raj', 'Amit', 'Suresh', 'Ramesh', 'Vijay', 'Arun', 'Ravi', 'Sanjay', 'Deepak', 'Manoj',
    'Ashok', 'Anil', 'Rakesh', 'Mohit', 'Rahul', 'Pradeep', 'Vinod', 'Sunil', 'Ajay', 'Ganesh',
    'Kiran', 'Naveen', 'Prasad', 'Santosh', 'Harish', 'Rajesh', 'Dinesh', 'Mukesh', 'Pankaj', 'Anand'
  ],
  female: [
    'Priya', 'Anita', 'Kavita', 'Sunita', 'Rekha', 'Meera', 'Radha', 'Lakshmi', 'Pooja', 'Neha',
    'Asha', 'Geeta', 'Sita', 'Nisha', 'Anjali', 'Deepa', 'Rani', 'Shanti', 'Kamala', 'Sarita',
    'Divya', 'Swati', 'Preeti', 'Ritu', 'Sneha', 'Vandana', 'Usha', 'Jyoti', 'Kalpana', 'Madhuri'
  ]
};

const indianLastNames = [
  'Kumar', 'Sharma', 'Patel', 'Singh', 'Verma', 'Gupta', 'Shah', 'Reddy', 'Rao', 'Nair',
  'Mehta', 'Joshi', 'Agarwal', 'Mishra', 'Pandey', 'Desai', 'Yadav', 'Tiwari', 'Bhatt', 'Pillai',
  'Iyer', 'Menon', 'Das', 'Banerjee', 'Chakraborty', 'Jain', 'Malhotra', 'Kapoor', 'Chaudhary', 'Thakur'
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Surat', 'Kanpur', 'Nagpur', 'Indore', 'Patna'
];

const occupations = [
  'Office Worker', 'Teacher', 'Farmer', 'Shop Owner', 'Driver',
  'Tailor', 'Construction Worker', 'Cook', 'Security Guard', 'Housewife',
  'Electrician', 'Carpenter', 'Plumber', 'Mechanic', 'Vendor',
  'Clerk', 'Accountant', 'Nurse', 'Police Officer', 'Retired'
];

function generateAadhaar(): string {
  const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
  return digits.join('').replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
}

function getDiopterForAge(age: number): number {
  const baseValues = {
    35: { min: 1.00, max: 1.50 },
    45: { min: 1.50, max: 2.25 },
    55: { min: 2.00, max: 2.75 },
    65: { min: 2.50, max: 3.50 }
  };

  let range = baseValues[35];
  if (age >= 65) range = baseValues[65];
  else if (age >= 55) range = baseValues[55];
  else if (age >= 45) range = baseValues[45];

  const diopter = range.min + Math.random() * (range.max - range.min);
  return Math.round(diopter * 4) / 4;
}

function getRandomName(gender: 'Male' | 'Female'): string {
  const firstNames = gender === 'Male' ? indianFirstNames.male : indianFirstNames.female;
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = indianLastNames[Math.floor(Math.random() * indianLastNames.length)];
  return `${firstName} ${lastName}`;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateAge(): number {
  const rand = Math.random();
  if (rand < 0.20) return Math.floor(35 + Math.random() * 10); // 35-44: 20%
  if (rand < 0.55) return Math.floor(45 + Math.random() * 10); // 45-54: 35%
  if (rand < 0.85) return Math.floor(55 + Math.random() * 10); // 55-64: 30%
  return Math.floor(65 + Math.random() * 11); // 65-75: 15%
}

export function generatePatientData(count: number = 5000): PatientRecord[] {
  const records: PatientRecord[] = [];
  
  for (let i = 0; i < count; i++) {
    const gender: 'Male' | 'Female' = Math.random() < 0.55 ? 'Male' : 'Female';
    const age = generateAge();
    
    records.push({
      id: i + 1,
      name: getRandomName(gender),
      age,
      aadhaarId: generateAadhaar(),
      occupation: getRandomElement(occupations),
      gender,
      city: getRandomElement(cities),
      previousGlasses: Math.random() < 0.30,
      diopterStrength: getDiopterForAge(age)
    });
  }
  
  return records;
}

export function exportToCSV(data: PatientRecord[]): string {
  const headers = ['ID', 'Name', 'Age', 'Aadhaar ID', 'Occupation', 'Gender', 'City', 'Previous Glasses', 'Diopter Strength'];
  const rows = data.map(record => [
    record.id,
    record.name,
    record.age,
    record.aadhaarId,
    record.occupation,
    record.gender,
    record.city,
    record.previousGlasses ? 'Yes' : 'No',
    `+${record.diopterStrength}`
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}