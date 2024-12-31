import React, { useState, useCallback, useRef } from 'react';
import { MazeVisualizer } from './components/MazeVisualizer';
import { MazeControls } from './components/MazeControls';
import { BatchGeneratorDialog } from './components/BatchGeneratorDialog';
import { useMazeGenerator } from './hooks/useMazeGenerator';
import { useMazeExporter } from './hooks/useMazeExporter';
import { MazeData } from './utils/types';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>();

  const {
    maze,
    isPlaying,
    playerPos,
    solution,
    showingSolution,
    width,
    height,
    setWidth,
    setHeight,
    handleGenerate,
    handlePlay,
    handleShowSolution,
  } = useMazeGenerator();

  const { handleDownload, handleBatchGenerate } = useMazeExporter({
    maze,
    solution,
    canvasRef,
    setIsGenerating,
    setProgress,
    setIsBatchDialogOpen,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <div className="w-full max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Maze Generator
          </h1>
          <p className="text-gray-600 mb-4">
            Designed for Embodied Intelligent Visual Navigation Tasks
          </p>
          <p className="text-gray-500 mb-4">
            Developed by <span className="font-bold">Jiaju Kang</span> of BNU AIFN
          </p>
        </div>
        
        <MazeControls
          onGenerate={handleGenerate}
          onPlay={handlePlay}
          onShowSolution={handleShowSolution}
          onDownload={handleDownload}
          onBatchGenerate={() => setIsBatchDialogOpen(true)}
          width={width}
          height={height}
          onWidthChange={setWidth}
          onHeightChange={setHeight}
          showingSolution={showingSolution}
          isGenerating={isGenerating}
          progress={progress}
        />

        <div className="flex justify-center">
          <MazeVisualizer
            maze={maze}
            isPlaying={isPlaying}
            solution={solution}
            playerPos={playerPos}
            canvasRef={canvasRef}
          />
        </div>
      </div>

      <BatchGeneratorDialog
        isOpen={isBatchDialogOpen}
        onClose={() => setIsBatchDialogOpen(false)}
        onGenerate={handleBatchGenerate}
      />
    </div>
  );
}