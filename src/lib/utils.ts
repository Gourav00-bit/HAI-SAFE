import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getSimilarityColor(score: number): string {
  if (score >= 90) return '#059669';
  if (score >= 75) return '#0EA898';
  if (score >= 60) return '#D97706';
  return '#94A3B8';
}

export function getRiskLevelColor(level: string): { bg: string; text: string; border: string } {
  switch (level) {
    case 'HIGH':
      return { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' };
    case 'MODERATE':
      return { bg: '#FFFBEB', text: '#78350F', border: '#FDE68A' };
    case 'LOW':
      return { bg: '#F0F9FF', text: '#0C4A6E', border: '#BAE6FD' };
    case 'INFORMATIONAL':
      return { bg: '#F8FAFC', text: '#334155', border: '#E2E8F0' };
    default:
      return { bg: '#F8FAFC', text: '#334155', border: '#E2E8F0' };
  }
}

export function getConfidenceColor(level: number): string {
  if (level >= 85) return '#059669';
  if (level >= 65) return '#0EA898';
  if (level >= 45) return '#D97706';
  return '#DC2626';
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getOutcomeColor(outcome: string): { bg: string; text: string } {
  switch (outcome) {
    case 'Complete Response':
      return { bg: '#ECFDF5', text: '#065F46' };
    case 'Partial Response':
      return { bg: '#F0F9FF', text: '#0C4A6E' };
    case 'Stable Disease':
      return { bg: '#F8FAFC', text: '#334155' };
    case 'Progressive Disease':
      return { bg: '#FEF2F2', text: '#991B1B' };
    case 'Recurrence':
      return { bg: '#FFFBEB', text: '#78350F' };
    case 'Ongoing':
      return { bg: '#F5F3FF', text: '#3730A3' };
    default:
      return { bg: '#F8FAFC', text: '#334155' };
  }
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
