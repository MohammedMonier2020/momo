
import React from 'react';

export const THEME = {
  colors: {
    primary: '#00f3ff', // Cyan
    secondary: '#bc13fe', // Purple
    accent: '#3b82f6', // Blue
    safe: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    danger: '#ef4444', // Red
    bg: '#020617',
  }
};

export const CATEGORIES = [
  'Food & Beverage',
  'Medicine',
  'Cosmetics',
  'Electronics',
  'Industrial',
  'Other'
];

export const FRAMER_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 }
  },
  panel: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};
