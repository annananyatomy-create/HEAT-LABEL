export type UserRole = 'ADMIN' | 'OPERATOR' | 'SUSTAINABILITY_AUDITOR';

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export type TreatmentType = 
  | 'ANNEALING' 
  | 'HARDENING' 
  | 'TEMPERING' 
  | 'NORMALIZING' 
  | 'CARBURIZING'
  | 'STRESS_RELIEVING';

export type CoolingMethod = 
  | 'WATER_QUENCH' 
  | 'OIL_QUENCH' 
  | 'FORCED_AIR_COOL' 
  | 'STILL_AIR_COOL' 
  | 'FURNACE_COOL' 
  | 'POLYMER_QUENCH';

export type BatchStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED' | 'UNDER_INSPECTION';

export interface Material {
  id: number;
  materialCode: string;
  name: string;
  grade: string;
  standardSpec: string;
  batchNumber: string;
  initialWeightKg: number;
  componentDescription: string;
  supplierName: string;
  createdAt: string;
}

export interface TreatmentBatch {
  id: number;
  batchCode: string;
  materialId: number;
  materialName?: string;
  materialGrade?: string;
  materialWeightKg?: number;
  treatmentType: TreatmentType;
  furnaceId: string;
  furnaceTemperatureC: number;
  holdingTimeMinutes: number;
  coolingMethod: CoolingMethod;
  startDate: string;
  completionDate?: string | null;
  operatorId: number;
  operatorName?: string;
  batchStatus: BatchStatus;
  targetHardnessHrc?: number | null;
  actualHardnessHrc?: number | null;
  processNotes?: string;
}

export type EnergySource = 
  | 'ELECTRICITY_GRID' 
  | 'ELECTRICITY_RENEWABLE' 
  | 'NATURAL_GAS' 
  | 'DIESEL_FUEL' 
  | 'LPG';

export interface EmissionFactor {
  id: number;
  energySource: EnergySource;
  emissionFactorValue: number; // e.g., 0.716 kg CO2e / unit
  unitNumerator: string;
  unitDenominator: string;
  geographicRegion: string;
  sourceDocumentation: string;
  isActive: boolean;
  validFrom: string;
  notes?: string;
}

export interface EnergyRecord {
  id: number;
  batchId: number;
  batchCode?: string;
  energySource: EnergySource;
  consumptionValue: number;
  unit: 'KWH' | 'M3' | 'LITERS' | 'MJ';
  emissionFactorId: number;
  calculatedEmissionsKgCO2e: number;
  energyPerKgMaterial: number;
  recordedBy: number;
  recordedByName?: string;
  recordedAt: string;
}

export type WasteCategory = 
  | 'SCALE_OXIDATION' 
  | 'THERMAL_CRACKING' 
  | 'QUENCH_DISTORTION' 
  | 'OVERHEATING_BURNING' 
  | 'DECARBURIZATION' 
  | 'HARDNESS_NONCONFORMANCE';

export type RecyclingStatus = 
  | 'RECYCLED_SCRAP_DEALER' 
  | 'IN_HOUSE_REMELT' 
  | 'RE_HEAT_TREATED' 
  | 'LANDFILL_DISPOSAL';

export interface WasteRecord {
  id: number;
  batchId: number;
  batchCode?: string;
  rejectedPartsCount: number;
  totalScrapWeightKg: number;
  wasteCategory: WasteCategory;
  recyclingStatus: RecyclingStatus;
  recoveredWeightKg: number;
  dispositionNotes: string;
  recordedBy: number;
  recordedByName?: string;
  recordedAt: string;
}

export interface AuditLog {
  id: number;
  userId?: number;
  userName?: string;
  actionType: 'LOGIN' | 'LOGOUT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CALCULATION' | 'CONFIG_CHANGE' | 'REPORT_EXPORT';
  entityName: string;
  entityId?: string;
  details: string;
  ipAddress: string;
  loggedAt: string;
}
