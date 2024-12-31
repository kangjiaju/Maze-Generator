import { MazeData, Cell } from './types';
import { PointGenerator } from './PointGenerator';

export class BacktrackingMazeGenerator {
  private cells: Cell[][];
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = this.initializeCells();
  }

  private initializeCells(): Cell[][] {
    const cells: Cell[][] = [];
    for (let y = 0; y < this.height; y++) {
      cells[y] = [];
      for (let x = 0; x < this.width; x++) {
        cells[y][x] = {
          x,
          y,
          visited: false,
          walls: { top: true, right: true, bottom: true, left: true }
        };
      }
    }
    return cells;
  }

  private getNeighbors(x: number, y: number): { cell: Cell; direction: string }[] {
    const neighbors: { cell: Cell; direction: string }[] = [];
    const directions = [
      { dx: 0, dy: -1, dir: 'top' },
      { dx: 1, dy: 0, dir: 'right' },
      { dx: 0, dy: 1, dir: 'bottom' },
      { dx: -1, dy: 0, dir: 'left' }
    ];

    for (const { dx, dy, dir } of directions) {
      const newX = x + dx;
      const newY = y + dy;
      if (
        newX >= 0 && newX < this.width &&
        newY >= 0 && newY < this.height &&
        !this.cells[newY][newX].visited
      ) {
        neighbors.push({ cell: this.cells[newY][newX], direction: dir });
      }
    }

    return neighbors;
  }

  private removeWall(current: Cell, next: Cell, direction: string): void {
    const opposites: { [key: string]: string } = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right'
    };

    current.walls[direction as keyof typeof current.walls] = false;
    next.walls[opposites[direction] as keyof typeof next.walls] = false;
  }

  generateMaze(): MazeData {
    const stack: Cell[] = [];
    const startCell = this.cells[0][0];
    startCell.visited = true;
    stack.push(startCell);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = this.getNeighbors(current.x, current.y);

      if (neighbors.length === 0) {
        stack.pop();
      } else {
        const { cell: next, direction } = neighbors[Math.floor(Math.random() * neighbors.length)];
        this.removeWall(current, next, direction);
        next.visited = true;
        stack.push(next);
      }
    }

    // Generate random start and end points with minimum distance
    const minDistance = Math.floor(Math.min(this.width, this.height) * 0.75);
    const { start, end } = PointGenerator.generatePoints(this.width, this.height, minDistance);

    return {
      cells: this.cells,
      start,
      end
    };
  }
}