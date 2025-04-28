import { v4 as uuidv4 } from 'uuid';
import { Software } from '../types';

// Mock data for initial state
const initialSoftware: Software[] = [
  {
    id: uuidv4(),
    name: 'Chrome',
    version: 'v122.0.6261.69',
    size: '85',
    sizeUnit: 'MB',
    path: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    description: 'Google Chrome is a cross-platform web browser developed by Google.',
    category: 'browsers',
    isCracked: false,
    installMethod: 'normal'
  },
  {
    id: uuidv4(),
    name: 'Adobe Photoshop',
    version: 'v25.0',
    size: '2.4',
    sizeUnit: 'GB',
    path: 'C:\\Program Files\\Adobe\\Adobe Photoshop 2024\\Photoshop.exe',
    description: 'Professional photo editing software developed by Adobe Inc.',
    category: 'multimedia',
    isCracked: true,
    crackInstructions: 'Replace amtlib.dll in the installation directory with the provided crack file.',
    installMethod: 'normal'
  },
  {
    id: uuidv4(),
    name: 'WinRAR',
    version: 'v6.24',
    size: '3.5',
    sizeUnit: 'MB',
    path: 'C:\\Program Files\\WinRAR\\WinRAR.exe',
    description: 'File archiver utility for Windows that can create and view archives in RAR or ZIP file formats.',
    category: 'utilities',
    isCracked: true,
    crackInstructions: 'Copy rarreg.key to the installation directory.',
    installMethod: 'silent'
  }
];

// In a real application, this would be stored in Electron's storage or a database
let softwareList = [...initialSoftware];

export const getSoftware = () => {
  return [...softwareList];
};

export const getSoftwareById = (id: string) => {
  return softwareList.find(software => software.id === id);
};

export const getSoftwareByCategory = (category: string) => {
  if (category === 'all') {
    return [...softwareList];
  }
  return softwareList.filter(software => software.category === category);
};

export const addSoftware = (software: Omit<Software, 'id'>) => {
  const newSoftware = {
    ...software,
    id: uuidv4()
  };
  softwareList = [...softwareList, newSoftware];
  return newSoftware;
};

export const updateSoftware = (software: Software) => {
  softwareList = softwareList.map(s => 
    s.id === software.id ? software : s
  );
  return software;
};

export const deleteSoftware = (id: string) => {
  softwareList = softwareList.filter(s => s.id !== id);
  return id;
};

export const searchSoftware = (query: string) => {
  if (!query) return [...softwareList];
  
  const lowerQuery = query.toLowerCase();
  return softwareList.filter(software => 
    software.name.toLowerCase().includes(lowerQuery) || 
    software.description.toLowerCase().includes(lowerQuery)
  );
};