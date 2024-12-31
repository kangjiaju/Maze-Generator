import { useCallback } from 'react';
import { MazeData, Point } from '../utils/types';
import { BatchMazeGenerator } from '../utils/BatchMazeGenerator';
import { ZipExporter } from '../utils/ZipExporter';
import { MazeExporter } from '../utils/MazeExporter';

interface UseMazeExporterProps {
  maze: MazeData;
  solution: Point[];
  canvasRef: React.RefObject<HTMLCanvasElement>;
  setIsGenerating: (value: boolean) => void;
  setProgress: (value: { current: number; total: number } | undefined) => void;
  setIsBatchDialogOpen: (value: boolean) => void;
}

export function useMazeExporter({
  maze,
  solution,
  canvasRef,
  setIsGenerating,
  setProgress,
  setIsBatchDialogOpen,
}: UseMazeExporterProps) {
  const handleDownload = useCallback(async () => {
    if (!canvasRef.current) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `maze-${timestamp}`;

    // Export maze image without solution
    await MazeExporter.exportMazeAsImage(canvasRef.current, filename, false);

    // Export maze image with solution
    await MazeExporter.exportMazeAsImage(canvasRef.current, filename, true);

    // Export JSON data
    MazeExporter.exportMazeData(maze, solution, filename);
  }, [maze, solution, canvasRef]);

  const handleBatchGenerate = useCallback(async (width: number, height: number, count: number) => {
    setIsGenerating(true);
    setProgress({ current: 0, total: count });

    const mazeSets = BatchMazeGenerator.generateMazeSets({
      width,
      height,
      count,
      onProgress: (current, total) => setProgress({ current, total }),
    });

    if (canvasRef.current) {
      await ZipExporter.exportMazeSetsAsZip(
        mazeSets,
        canvasRef.current,
        (current, total) => setProgress({ current, total })
      );
    }

    setIsGenerating(false);
    setIsBatchDialogOpen(false);
  }, [canvasRef, setIsGenerating, setProgress, setIsBatchDialogOpen]);

  return {
    handleDownload,
    handleBatchGenerate,
  };
}