import React, { useState, useEffect } from 'react';
import { X, FolderSearch } from 'lucide-react';
import { Software, Category } from '../types';

interface SoftwareFormProps {
  software?: Software;
  onSave: (software: Omit<Software, 'id'> | Software) => void;
  onCancel: () => void;
}

const categories: Category[] = [
  'browsers',
  'utilities',
  'multimedia',
  'development',
  'security',
  'office',
  'games',
  'system',
  'other'
];

const defaultSoftware: Omit<Software, 'id'> = {
  name: '',
  version: '',
  size: '',
  sizeUnit: 'MB',
  path: '',
  description: '',
  category: 'other',
  isCracked: false,
  installMethod: 'normal'
};

const SoftwareForm: React.FC<SoftwareFormProps> = ({ 
  software, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Omit<Software, 'id'> | Software>(
    software || defaultSoftware
  );

  useEffect(() => {
    setFormData(software || defaultSoftware);
  }, [software]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleBrowse = async () => {
    try {
      const path = await window.electronAPI.selectSoftwarePath();
      if (path) {
        setFormData({
          ...formData,
          path
        });
      }
    } catch (error) {
      console.error('Failed to select file:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {software ? 'Edit Software' : 'Add New Software'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block text-gray-300 mb-1">Software Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Version</label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-gray-300 mb-1">Size</label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="w-24">
                <label className="block text-gray-300 mb-1">Unit</label>
                <select
                  name="sizeUnit"
                  value={formData.sizeUnit}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                </select>
              </div>
            </div>
            
            <div className="col-span-2">
              <label className="block text-gray-300 mb-1">File Path</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="path"
                  value={formData.path}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={handleBrowse}
                  className="bg-gray-600 text-white p-2 rounded hover:bg-gray-500"
                >
                  <FolderSearch size={20} />
                </button>
              </div>
            </div>
            
            <div className="col-span-2">
              <label className="block text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-purple-500"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Installation Method</label>
              <select
                name="installMethod"
                value={formData.installMethod}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="normal">Normal</option>
                <option value="silent">Silent</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="isCracked"
                  name="isCracked"
                  checked={formData.isCracked}
                  onChange={(e) => handleChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: 'isCracked',
                      value: e.target.checked ? 'true' : 'false'
                    }
                  })}
                  className="h-4 w-4 text-purple-600 rounded border-gray-600 focus:ring-purple-500 bg-gray-700"
                />
                <label htmlFor="isCracked" className="ml-2 text-gray-300">
                  Cracked Software
                </label>
              </div>
            </div>
            
            {formData.isCracked && (
              <div className="col-span-2">
                <label className="block text-gray-300 mb-1">Crack Instructions</label>
                <textarea
                  name="crackInstructions"
                  value={formData.crackInstructions || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-purple-500"
                ></textarea>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              {software ? 'Update' : 'Add'} Software
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoftwareForm;