import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';
import type { PatientRecord } from './dataGenerator';

let db: Database | null = null;

export async function initializeDatabase(): Promise<Database> {
  if (db) return db;
  
  const SQL = await initSqlJs({
    locateFile: (file: string) => `https://sql.js.org/dist/${file}`
  });
  
  db = new SQL.Database();
  
  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      aadhaar_id TEXT NOT NULL,
      occupation TEXT NOT NULL,
      gender TEXT NOT NULL,
      city TEXT NOT NULL,
      previous_glasses INTEGER NOT NULL,
      diopter_strength REAL NOT NULL
    )
  `);
  
  return db;
}

export async function insertPatients(patients: PatientRecord[]): Promise<void> {
  if (!db) await initializeDatabase();
  
  const stmt = db!.prepare(`
    INSERT INTO patients (id, name, age, aadhaar_id, occupation, gender, city, previous_glasses, diopter_strength)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  patients.forEach(patient => {
    stmt.run([
      patient.id,
      patient.name,
      patient.age,
      patient.aadhaarId,
      patient.occupation,
      patient.gender,
      patient.city,
      patient.previousGlasses ? 1 : 0,
      patient.diopterStrength
    ]);
  });
  
  stmt.free();
}

export interface AgeGroupAnalysis {
  ageGroup: string;
  totalCount: number;
  averageDiopter: number;
  incidenceRate: number;
}

export async function getAgeWiseAnalysis(filters?: {
  ageMin?: number;
  ageMax?: number;
  city?: string;
  gender?: string;
  occupation?: string;
}): Promise<AgeGroupAnalysis[]> {
  if (!db) await initializeDatabase();
  
  let whereConditions: string[] = [];
  let params: any[] = [];
  
  if (filters?.ageMin !== undefined && filters?.ageMax !== undefined) {
    whereConditions.push('age >= ? AND age <= ?');
    params.push(filters.ageMin, filters.ageMax);
  }
  
  if (filters?.city) {
    whereConditions.push('city = ?');
    params.push(filters.city);
  }
  
  if (filters?.gender) {
    whereConditions.push('gender = ?');
    params.push(filters.gender);
  }
  
  if (filters?.occupation) {
    whereConditions.push('occupation = ?');
    params.push(filters.occupation);
  }
  
  const whereClause = whereConditions.length > 0 
    ? `WHERE ${whereConditions.join(' AND ')}`
    : '';
  
  const stmt = db!.prepare(`
    SELECT 
      CASE 
        WHEN age >= 35 AND age < 40 THEN '35-39'
        WHEN age >= 40 AND age < 45 THEN '40-44'
        WHEN age >= 45 AND age < 50 THEN '45-49'
        WHEN age >= 50 AND age < 55 THEN '50-54'
        WHEN age >= 55 AND age < 60 THEN '55-59'
        WHEN age >= 60 AND age < 65 THEN '60-64'
        WHEN age >= 65 AND age < 70 THEN '65-69'
        WHEN age >= 70 AND age <= 75 THEN '70-75'
      END as age_group,
      COUNT(*) as total_count,
      AVG(diopter_strength) as avg_diopter
    FROM patients
    ${whereClause}
    GROUP BY age_group
    ORDER BY age_group
  `);
  
  stmt.bind(params);
  const results: any[] = [];
  
  while (stmt.step()) {
    const row = stmt.getAsObject();
    if (row.age_group !== null) {
      results.push({
        ageGroup: row.age_group as string,
        totalCount: row.total_count as number,
        averageDiopter: Math.round((row.avg_diopter as number) * 100) / 100,
        incidenceRate: 100
      });
    }
  }
  
  stmt.free();
  return results;
}

export interface CityAnalysis {
  city: string;
  count: number;
  averageDiopter: number;
}

export async function getCityWiseAnalysis(): Promise<CityAnalysis[]> {
  if (!db) await initializeDatabase();
  
  const results = db!.exec(`
    SELECT 
      city,
      COUNT(*) as count,
      AVG(diopter_strength) as avg_diopter
    FROM patients
    GROUP BY city
    ORDER BY count DESC
  `);
  
  if (results.length === 0) return [];
  
  return results[0].values.map((row: any[]) => ({
    city: row[0] as string,
    count: row[1] as number,
    averageDiopter: Math.round((row[2] as number) * 100) / 100
  }));
}

export interface DiopterDistribution {
  diopter: number;
  count: number;
}

export async function getDiopterDistribution(filters?: {
  ageMin?: number;
  ageMax?: number;
  city?: string;
  gender?: string;
  occupation?: string;
}): Promise<DiopterDistribution[]> {
  if (!db) await initializeDatabase();
  
  let whereConditions: string[] = [];
  let params: any[] = [];
  
  if (filters?.ageMin !== undefined && filters?.ageMax !== undefined) {
    whereConditions.push('age >= ? AND age <= ?');
    params.push(filters.ageMin, filters.ageMax);
  }
  
  if (filters?.city) {
    whereConditions.push('city = ?');
    params.push(filters.city);
  }
  
  if (filters?.gender) {
    whereConditions.push('gender = ?');
    params.push(filters.gender);
  }
  
  if (filters?.occupation) {
    whereConditions.push('occupation = ?');
    params.push(filters.occupation);
  }
  
  const whereClause = whereConditions.length > 0 
    ? `WHERE ${whereConditions.join(' AND ')}`
    : '';
  
  const stmt = db!.prepare(`
    SELECT 
      diopter_strength,
      COUNT(*) as count
    FROM patients
    ${whereClause}
    GROUP BY diopter_strength
    ORDER BY diopter_strength
  `);
  
  stmt.bind(params);
  const results: DiopterDistribution[] = [];
  
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push({
      diopter: row.diopter_strength as number,
      count: row.count as number
    });
  }
  
  stmt.free();
  return results;
}

export async function getFilteredPatients(filters: {
  ageMin?: number;
  ageMax?: number;
  city?: string;
  gender?: string;
  occupation?: string;
}): Promise<PatientRecord[]> {
  if (!db) await initializeDatabase();
  
  let whereConditions: string[] = [];
  let params: any[] = [];
  
  if (filters.ageMin !== undefined && filters.ageMax !== undefined) {
    whereConditions.push('age >= ? AND age <= ?');
    params.push(filters.ageMin, filters.ageMax);
  }
  
  if (filters.city) {
    whereConditions.push('city = ?');
    params.push(filters.city);
  }
  
  if (filters.gender) {
    whereConditions.push('gender = ?');
    params.push(filters.gender);
  }
  
  if (filters.occupation) {
    whereConditions.push('occupation = ?');
    params.push(filters.occupation);
  }
  
  const whereClause = whereConditions.length > 0 
    ? `WHERE ${whereConditions.join(' AND ')}`
    : '';
  
  const stmt = db!.prepare(`
    SELECT * FROM patients ${whereClause}
    ORDER BY id
  `);
  
  const results: PatientRecord[] = [];
  stmt.bind(params);
  
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push({
      id: row.id as number,
      name: row.name as string,
      age: row.age as number,
      aadhaarId: row.aadhaar_id as string,
      occupation: row.occupation as string,
      gender: row.gender as 'Male' | 'Female',
      city: row.city as string,
      previousGlasses: row.previous_glasses === 1,
      diopterStrength: row.diopter_strength as number
    });
  }
  
  stmt.free();
  return results;
}

export function getDatabase(): Database | null {
  return db;
}