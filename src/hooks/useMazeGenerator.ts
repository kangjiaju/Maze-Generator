import { useState, useCallback, useEffect } from 'react';
import { BacktrackingMazeGenerator } from '../utils/BacktrackingMazeGenerator';
import { AStarPathfinder } from '../utils/AStarPathfinder';
import { MazeData, Point } from '../utils/types';

export function useMazeGenerator() {
  const [width, setWidth] = useState(18);
  const [height, setHeight] = useState(18);
  const [maze, setMaze] = useState<MazeData>(() => {
    const generator = new BacktrackingMazeGenerator(18, 18);
    return generator.generateMaze();
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerPos, setPlayerPos] = useState<Point>(maze.start);
  const [solution, setSolution] = useState<Point[]>([]);
  const [showingSolution, setShowingSolution] = useState(false);

  const handleGenerate = useCallback(() => {
    const generator = new BacktrackingMazeGenerator(width, height);
    const newMaze = generator.generateMaze();
    setMaze(newMaze);
    setPlayerPos(newMaze.start);
    setIsPlaying(false);
    setSolution([]);
    setShowingSolution(false);
  }, [width, height]);

  const handlePlay = useCallback(() => {
    setPlayerPos(maze.start);
    setIsPlaying(true);
    setSolution([]);
    setShowingSolution(false);
  }, [maze]);

  const handleShowSolution = useCallback(() => {
    const pathfinder = new AStarPathfinder(maze.cells, maze.start, maze.end);
    const path = pathfinder.findPath();
    setSolution(path);
    setShowingSolution(true);
  }, [maze]);

  // Handle keyboard controls
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const cell = maze.cells[playerPos.y][playerPos.x];
      let newPos = { ...playerPos };

      switch (e.key) {
        case 'ArrowUp':
          if (!cell.walls.top) newPos.y--;
          break;
        case 'ArrowRight':
          if (!cell.walls.right) newPos.x++;
          break;
        case 'ArrowDown':
          if (!cell.walls.bottom) newPos.y++;
          break;
        case 'ArrowLeft':
          if (!cell.walls.left) newPos.x--;
          break;
      }

      setPlayerPos(newPos);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, playerPos, maze]);

  return {
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
  };
}