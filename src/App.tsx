import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import SoftwareCard from './components/SoftwareCard';
import SoftwareForm from './components/SoftwareForm';
import { Software } from './types';
import { 
  getSoftware, 
  getSoftwareByCategory,
  addSoftware,
  updateSoftware,
  deleteSoftware,
  searchSoftware
} from './store';

function App() {
  const [software, setSoftware] = useState<Software[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSoftware, setEditingSoftware] = useState<Software | null>(null);
  const [installProgress, setInstallProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    loadSoftware();
    
    if (window.electronAPI) {
      window.electronAPI.onInstallationProgress((progress) => {
        if (installingId) {
          setInstallProgress(prev => ({
            ...prev,
            [installingId]: progress
          }));
        }
      });
    }
  }, []);

  const [installingId, setInstallingId] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery) {
      setSoftware(searchSoftware(searchQuery));
    } else if (activeCategory === 'all') {
      setSoftware(getSoftware());
    } else {
      setSoftware(getSoftwareByCategory(activeCategory));
    }
  }, [activeCategory, searchQuery]);

  const loadSoftware = () => {
    setSoftware(getSoftware());
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery('');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddSoftwareClick = () => {
    setEditingSoftware(null);
    setShowAddForm(true);
  };

  const handleSaveSoftware = (softwareData: Omit<Software, 'id'> | Software) => {
    if ('id' in softwareData) {
      updateSoftware(softwareData);
    } else {
      addSoftware(softwareData);
    }
    
    setShowAddForm(false);
    setEditingSoftware(null);
    loadSoftware();
  };

  const handleEditSoftware = (software: Software) => {
    setEditingSoftware(software);
    setShowAddForm(true);
  };

  const handleDeleteSoftware = (id: string) => {
    deleteSoftware(id);
    loadSoftware();
  };

  const handleInstallSoftware = async (software: Software) => {
    if (!window.electronAPI) {
      console.error('Electron API not available');
      return;
    }

    setInstallingId(software.id);
    setInstallProgress(prev => ({
      ...prev,
      [software.id]: 0
    }));

    try {
      const result = await window.electronAPI.installSoftware({
        path: software.path,
        silent: software.installMethod === 'silent'
      });

      if (result.success) {
        console.log(`${software.name} installed successfully`);
      } else {
        console.error(`Failed to install ${software.name}:`, result.error);
      }
    } catch (error) {
      console.error('Installation error:', error);
    } finally {
      setTimeout(() => {
        setInstallProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[software.id];
          return newProgress;
        });
        setInstallingId(null);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onAddSoftwareClick={handleAddSoftwareClick}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <SearchBar 
            searchQuery={searchQuery} 
            onSearchChange={handleSearchChange} 
          />
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-auto grid-flow-row-dense">
            {software.map(item => (
              <div key={item.id} className="h-fit">
                <SoftwareCard
                  software={item}
                  onInstall={handleInstallSoftware}
                  onDelete={handleDeleteSoftware}
                  onEdit={handleEditSoftware}
                  installProgress={installProgress[item.id]}
                />
              </div>
            ))}
          </div>
          
          {software.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              <p className="text-xl">No software found</p>
              <p className="mt-2">Try a different category or search term</p>
            </div>
          )}
        </div>
      </div>
      
      {showAddForm && (
        <SoftwareForm
          software={editingSoftware || undefined}
          onSave={handleSaveSoftware}
          onCancel={() => {
            setShowAddForm(false);
            setEditingSoftware(null);
          }}
        />
      )}
    </div>
  );
}

export default App;