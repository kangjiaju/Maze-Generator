export interface MazeConfig {
  width: number;
  height: number;
  algorithm: 'kruskal' | 'backtracking';
  seed?: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface Cell {
  x: number;
  y: number;
  visited: boolean;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  distance?: number;
}

export interface MazeData {
  cells: Cell[][];
  start: Point;
  end: Point;
}