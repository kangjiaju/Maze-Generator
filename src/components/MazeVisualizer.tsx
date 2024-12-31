import React, { useEffect, useRef } from 'react';
import { MazeData, Point } from '../utils/types';

interface MazeVisualizerProps {
  maze: MazeData;
  isPlaying: boolean;
  solution?: Point[];
  playerPos?: Point;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const MazeVisualizer: React.FC<MazeVisualizerProps> = ({ 
  maze, 
  isPlaying, 
  solution,
  playerPos,
  canvasRef: externalCanvasRef 
}) => {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = Math.floor(canvas.width / maze.cells[0].length);
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw solution path if available
    if (solution && solution.length > 0) {
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = cellSize / 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      solution.forEach((point, index) => {
        const x = point.x * cellSize + cellSize / 2;
        const y = point.y * cellSize + cellSize / 2;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      ctx.fillStyle = '#81C784';
      solution.forEach((point, index) => {
        if (index !== 0 && index !== solution.length - 1) {
          ctx.beginPath();
          ctx.arc(
            point.x * cellSize + cellSize / 2,
            point.y * cellSize + cellSize / 2,
            cellSize / 4,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      });
    }

    // Draw maze walls
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    maze.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        const startX = x * cellSize;
        const startY = y * cellSize;

        ctx.beginPath();
        if (cell.walls.top) {
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX + cellSize, startY);
        }
        if (cell.walls.right) {
          ctx.moveTo(startX + cellSize, startY);
          ctx.lineTo(startX + cellSize, startY + cellSize);
        }
        if (cell.walls.bottom) {
          ctx.moveTo(startX, startY + cellSize);
          ctx.lineTo(startX + cellSize, startY + cellSize);
        }
        if (cell.walls.left) {
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX, startY + cellSize);
        }
        ctx.stroke();
      });
    });

    // Draw start point
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(
      maze.start.x * cellSize + cellSize / 2,
      maze.start.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw end point
    ctx.fillStyle = '#F44336';
    ctx.beginPath();
    ctx.arc(
      maze.end.x * cellSize + cellSize / 2,
      maze.end.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw player if playing
    if (isPlaying && playerPos) {
      ctx.fillStyle = '#2196F3';
      ctx.beginPath();
      ctx.arc(
        playerPos.x * cellSize + cellSize / 2,
        playerPos.y * cellSize + cellSize / 2,
        cellSize / 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }, [maze, isPlaying, solution, playerPos]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      className="border border-gray-200 rounded-lg shadow-lg"
    />
  );
}