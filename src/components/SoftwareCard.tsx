import React, { useState } from 'react';
import { Download, Trash2, Info, AlertTriangle } from 'lucide-react';
import { Software } from '../types';

interface SoftwareCardProps {
  software: Software;
  onInstall: (software: Software) => void;
  onDelete: (id: string) => void;
  onEdit: (software: Software) => void;
  installProgress?: number;
}

const SoftwareCard: React.FC<SoftwareCardProps> = ({ 
  software, 
  onInstall, 
  onDelete,
  onEdit,
  installProgress 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCrackInstructions, setShowCrackInstructions] = useState(false);

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      browsers: 'bg-blue-600',
      utilities: 'bg-green-600',
      multimedia: 'bg-pink-600',
      development: 'bg-yellow-600',
      security: 'bg-red-600',
      office: 'bg-indigo-600',
      games: 'bg-orange-600',
      system: 'bg-teal-600',
      other: 'bg-gray-600'
    };
    return colors[category] || 'bg-gray-600';
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:translate-y-[-2px]">
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          <div className={`${getCategoryBadgeColor(software.category)} px-3 py-1 rounded-full text-sm text-white`}>
            {software.category}
          </div>
          <div className="bg-purple-600 px-3 py-1 rounded-full text-sm text-white">
            v{software.version}
          </div>
          <div className="bg-blue-600 px-3 py-1 rounded-full text-sm text-white">
            {software.size} {software.sizeUnit}
          </div>
          {software.isCracked && (
            <div className="bg-yellow-600 px-3 py-1 rounded-full text-sm text-white">
              Cracked
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">{software.name}</h3>
        
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <p className="text-gray-300">{software.description}</p>
        </div>
        
        {installProgress !== undefined && (
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
            <div 
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${installProgress}%` }}
            ></div>
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={() => onInstall(software)}
            className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors text-white py-2 px-4 rounded"
            disabled={installProgress !== undefined}
          >
            <Download size={18} />
            <span>{installProgress !== undefined ? 'Installing...' : 'Install'}</span>
          </button>
          
          <button
            onClick={() => onEdit(software)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 px-4 rounded"
          >
            <Info size={18} />
            <span>Edit</span>
          </button>
          
          {software.isCracked && (
            <button
              onClick={() => setShowCrackInstructions(!showCrackInstructions)}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 transition-colors text-white py-2 px-4 rounded"
            >
              <AlertTriangle size={18} />
              <span>Crack</span>
            </button>
          )}
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors text-white py-2 px-4 rounded"
          >
            <Trash2 size={18} />
            <span>Delete</span>
          </button>
        </div>
        
        {showCrackInstructions && software.crackInstructions && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg border-l-4 border-yellow-500">
            <h4 className="font-semibold text-yellow-400 mb-2">Crack Instructions:</h4>
            <p className="text-gray-300">{software.crackInstructions}</p>
          </div>
        )}
        
        {showDeleteConfirm && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <p className="text-white mb-3">Are you sure you want to delete {software.name}?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(software.id);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftwareCard;