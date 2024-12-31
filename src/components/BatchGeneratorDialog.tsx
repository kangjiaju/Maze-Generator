import React, { useState } from 'react';
import { X } from 'lucide-react';

interface BatchGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (width: number, height: number, count: number) => void;
}

export const BatchGeneratorDialog: React.FC<BatchGeneratorDialogProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);
  const [count, setCount] = useState(10);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Batch Generate Mazes</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min="5"
              max="50"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min="5"
              max="50"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Mazes
            </label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              min="1"
              max="100"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <button
            onClick={() => onGenerate(width, height, count)}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Generate Mazes
          </button>
        </div>
      </div>
    </div>
  );
}