import React, { useState } from 'react';
import { PlusCircle, Info, Pencil, Trash2 } from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onAddSoftwareClick: () => void;
}

const defaultCategories: { id: string, name: string }[] = [
  { id: 'all', name: 'All Software' },
  { id: 'browsers', name: 'Browsers' },
  { id: 'utilities', name: 'Utilities' },
  { id: 'multimedia', name: 'Multimedia' },
  { id: 'development', name: 'Development' },
  { id: 'security', name: 'Security' },
  { id: 'office', name: 'Office' },
  { id: 'games', name: 'Games' },
  { id: 'system', name: 'System' },
  { id: 'other', name: 'Other' }
];

const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategory, 
  onCategoryChange,
  onAddSoftwareClick
}) => {
  const [categories, setCategories] = useState(defaultCategories);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAbout, setShowAbout] = useState(false);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newId = newCategoryName.toLowerCase().replace(/\s+/g, '-');
      setCategories([...categories, { id: newId, name: newCategoryName }]);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (id === 'all') return;
    setCategories(categories.filter(cat => cat.id !== id));
    if (activeCategory === id) {
      onCategoryChange('all');
    }
  };

  const handleEditCategory = (id: string, newName: string) => {
    if (id === 'all') return;
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, name: newName } : cat
    ));
    setEditingCategory(null);
  };

  return (
    <div className="w-60 h-full bg-gray-900 flex flex-col">
      <div className="p-4">
        <button 
          onClick={onAddSoftwareClick}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors text-white py-2 px-4 rounded"
        >
          <PlusCircle size={18} />
          <span>Add Software</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {categories.map(category => (
          <div key={category.id} className="group relative">
            {editingCategory === category.id ? (
              <div className="flex items-center p-2">
                <input
                  type="text"
                  defaultValue={category.name}
                  onBlur={(e) => handleEditCategory(category.id, e.target.value)}
                  className="flex-1 bg-gray-800 text-white p-1 rounded"
                  autoFocus
                />
              </div>
            ) : (
              <div
                onClick={() => onCategoryChange(category.id)}
                className={`py-2 px-4 cursor-pointer flex items-center justify-between ${
                  activeCategory === category.id
                    ? 'bg-purple-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <span>{category.name}</span>
                {category.id !== 'all' && (
                  <div className="hidden group-hover:flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory(category.id);
                      }}
                      className="p-1 hover:text-purple-400"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      className="p-1 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={() => setShowAbout(true)}
          className="flex items-center text-gray-400 hover:text-purple-400 gap-2"
        >
          <Info size={18} />
          <span>About</span>
        </button>
      </div>

      {showAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">About ComfyInstaller</h2>
            <p className="text-gray-300 mb-4">Version 1.0.0</p>
            <div className="flex justify-between items-center">
              <a 
                href="#"
                className="text-purple-400 hover:text-purple-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Telegram
              </a>
              <button 
                onClick={() => setShowAbout(false)}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;