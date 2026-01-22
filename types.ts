
export enum ExpiryStatus {
  SAFE = 'SAFE',
  APPROACHING = 'APPROACHING',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  EXPIRED = 'EXPIRED'
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  expiryDate: string; // ISO format
  category: string;
  notes: string;
  createdAt: number;
}

export interface ExpiryCalculation {
  daysLeft: number;
  status: ExpiryStatus;
  color: string;
  alarmLevel: number; // 0: None, 1: Light, 2: Medium, 3: Loud
}
