import { BacktrackingMazeGenerator } from './BacktrackingMazeGenerator';
import { AStarPathfinder } from './AStarPathfinder';
import { MazeData, Point } from './types';

export interface BatchConfig {
  width: number;
  height: number;
  count: number;
  onProgress?: (current: number, total: number) => void;
}

export interface MazeSet {
  maze: MazeData;
  solution: Point[];
}

export class BatchMazeGenerator {
  static generateMazeSets({ width, height, count, onProgress }: BatchConfig): MazeSet[] {
    const mazeSets: MazeSet[] = [];

    for (let i = 0; i < count; i++) {
      // Generate maze
      const generator = new BacktrackingMazeGenerator(width, height);
      const maze = generator.generateMaze();

      // Find solution
      const pathfinder = new AStarPathfinder(maze.cells, maze.start, maze.end);
      const solution = pathfinder.findPath();

      mazeSets.push({ maze, solution });

      if (onProgress) {
        onProgress(i + 1, count);
      }
    }

    return mazeSets;
  }
}