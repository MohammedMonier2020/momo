
import { ExpiryStatus, ExpiryCalculation } from '../types';

export const calculateExpiry = (expiryDateStr: string): ExpiryCalculation => {
  const now = new Date();
  const expiry = new Date(expiryDateStr);
  
  // Reset hours to compare dates only
  now.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return {
      daysLeft: diffDays,
      status: ExpiryStatus.EXPIRED,
      color: '#ef4444',
      alarmLevel: 3
    };
  }
  
  if (diffDays === 0) {
    return {
      daysLeft: diffDays,
      status: ExpiryStatus.CRITICAL,
      color: '#f43f5e',
      alarmLevel: 3
    };
  }
  
  if (diffDays <= 6) {
    return {
      daysLeft: diffDays,
      status: ExpiryStatus.WARNING,
      color: '#f97316',
      alarmLevel: 2
    };
  }
  
  if (diffDays <= 14) {
    return {
      daysLeft: diffDays,
      status: ExpiryStatus.APPROACHING,
      color: '#eab308',
      alarmLevel: 1
    };
  }
  
  return {
    daysLeft: diffDays,
    status: ExpiryStatus.SAFE,
    color: '#10b981',
    alarmLevel: 0
  };
};

export const getStatusLabel = (status: ExpiryStatus): string => {
  switch (status) {
    case ExpiryStatus.EXPIRED: return 'System Error: Expired';
    case ExpiryStatus.CRITICAL: return 'Urgent: Expiry Imminent';
    case ExpiryStatus.WARNING: return 'Warning: Approaching Limit';
    case ExpiryStatus.APPROACHING: return 'Advisory: Expiring Soon';
    case ExpiryStatus.SAFE: return 'Status: Optimized';
    default: return 'Status: Unknown';
  }
};
