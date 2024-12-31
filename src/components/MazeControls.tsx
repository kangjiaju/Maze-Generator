import React from 'react';
import { RefreshCw, Play, Download, Map, Database } from 'lucide-react';

interface MazeControlsProps {
  onGenerate: () => void;
  onPlay: () => void;
  onShowSolution: () => void;
  onDownload: () => void;
  onBatchGenerate: () => void;
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  showingSolution: boolean;
  isGenerating?: boolean;
  progress?: { current: number; total: number };
}

export const MazeControls: React.FC<MazeControlsProps> = ({
  onGenerate,
  onPlay,
  onShowSolution,
  onDownload,
  onBatchGenerate,
  width,
  height,
  onWidthChange,
  onHeightChange,
  showingSolution,
  isGenerating,
  progress
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
          <input
            type="number"
            value={width}
            onChange={(e) => onWidthChange(parseInt(e.target.value))}
            min="5"
            max="50"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
          <input
            type="number"
            value={height}
            onChange={(e) => onHeightChange(parseInt(e.target.value))}
            min="5"
            max="50"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <button
          onClick={onGenerate}
          className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          disabled={isGenerating}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate
        </button>
        <button
          onClick={onPlay}
          className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          disabled={isGenerating}
        >
          <Play className="w-4 h-4 mr-2" />
          Play
        </button>
        <button
          onClick={onShowSolution}
          className={`inline-flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
            showingSolution 
              ? 'bg-yellow-500 hover:bg-yellow-600' 
              : 'bg-yellow-600 hover:bg-yellow-700'
          } text-white`}
          disabled={isGenerating}
        >
          <Map className="w-4 h-4 mr-2" />
          Solution
        </button>
        <button
          onClick={onDownload}
          className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          disabled={isGenerating}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
        <button
          onClick={onBatchGenerate}
          className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          disabled={isGenerating}
        >
          <Database className="w-4 h-4 mr-2" />
          Batch
        </button>
      </div>
      
      {isGenerating && progress && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1 text-center">
            Generating maze {progress.current} of {progress.total}
          </p>
        </div>
      )}
    </div>
  );
}