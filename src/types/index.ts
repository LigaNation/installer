export interface Software {
  id: string;
  name: string;
  version: string;
  size: string;
  sizeUnit: 'KB' | 'MB' | 'GB';
  path: string;
  description: string;
  category: Category;
  isCracked: boolean;
  crackInstructions?: string;
  installMethod?: 'silent' | 'normal';
}

export type Category = 
  | 'browsers'
  | 'utilities'
  | 'multimedia'
  | 'development'
  | 'security'
  | 'office'
  | 'games'
  | 'system'
  | 'other';

export interface InstallResult {
  success: boolean;
  error?: string;
  code?: number;
}