import { Department } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_DEPARTMENTS: Omit<Department, 'id'>[] = [
  { name: 'Produce', icon: '🥬', color: '#10B981', sortOrder: 0, isDefault: true },
  { name: 'Meat & Seafood', icon: '🥩', color: '#EF4444', sortOrder: 1, isDefault: true },
  { name: 'Dairy & Eggs', icon: '🥛', color: '#F59E0B', sortOrder: 2, isDefault: true },
  { name: 'Bakery', icon: '🍞', color: '#D97706', sortOrder: 3, isDefault: true },
  { name: 'Frozen Foods', icon: '❄️', color: '#3B82F6', sortOrder: 4, isDefault: true },
  { name: 'Canned Goods', icon: '🥫', color: '#8B5CF6', sortOrder: 5, isDefault: true },
  { name: 'Snacks', icon: '🍿', color: '#EC4899', sortOrder: 6, isDefault: true },
  { name: 'Beverages', icon: '🥤', color: '#06B6D4', sortOrder: 7, isDefault: true },
  { name: 'Cleaning Supplies', icon: '🧹', color: '#84CC16', sortOrder: 8, isDefault: true },
  { name: 'Personal Care', icon: '🧴', color: '#A855F7', sortOrder: 9, isDefault: true },
  { name: 'Other', icon: '📦', color: '#6B7280', sortOrder: 10, isDefault: true },
];

export function createDefaultDepartments(): Department[] {
  return DEFAULT_DEPARTMENTS.map(dept => ({
    ...dept,
    id: uuidv4(),
  }));
}
