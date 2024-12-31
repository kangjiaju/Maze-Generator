import { Cell, Point } from './types';

export class AStarPathfinder {
  private cells: Cell[][];
  private start: Point;
  private end: Point;

  constructor(cells: Cell[][], start: Point, end: Point) {
    this.cells = cells;
    this.start = start;
    this.end = end;
  }

  private heuristic(point: Point): number {
    return Math.abs(point.x - this.end.x) + Math.abs(point.y - this.end.y);
  }

  private getNeighbors(point: Point): Point[] {
    const neighbors: Point[] = [];
    const cell = this.cells[point.y][point.x];
    
    // Check each direction and add accessible neighbors
    if (!cell.walls.top && point.y > 0) {
      neighbors.push({ x: point.x, y: point.y - 1 });
    }
    if (!cell.walls.right && point.x < this.cells[0].length - 1) {
      neighbors.push({ x: point.x + 1, y: point.y });
    }
    if (!cell.walls.bottom && point.y < this.cells.length - 1) {
      neighbors.push({ x: point.x, y: point.y + 1 });
    }
    if (!cell.walls.left && point.x > 0) {
      neighbors.push({ x: point.x - 1, y: point.y });
    }
    
    return neighbors;
  }

  private reconstructPath(cameFrom: Map<string, Point>, current: Point): Point[] {
    const path: Point[] = [current];
    const pointToString = (p: Point) => `${p.x},${p.y}`;
    
    while (cameFrom.has(pointToString(current))) {
      current = cameFrom.get(pointToString(current))!;
      path.unshift(current);
    }
    
    return path;
  }

  findPath(): Point[] {
    const openSet: Point[] = [this.start];
    const closedSet: Set<string> = new Set();
    const cameFrom: Map<string, Point> = new Map();
    const gScore: Map<string, number> = new Map();
    const fScore: Map<string, number> = new Map();
    
    const pointToString = (p: Point) => `${p.x},${p.y}`;
    
    gScore.set(pointToString(this.start), 0);
    fScore.set(pointToString(this.start), this.heuristic(this.start));
    
    while (openSet.length > 0) {
      // Find the node with the lowest fScore
      let current = openSet.reduce((min, p) => 
        (fScore.get(pointToString(p)) || Infinity) < (fScore.get(pointToString(min)) || Infinity) ? p : min
      );
      
      if (current.x === this.end.x && current.y === this.end.y) {
        return this.reconstructPath(cameFrom, current);
      }
      
      openSet.splice(openSet.indexOf(current), 1);
      closedSet.add(pointToString(current));
      
      for (const neighbor of this.getNeighbors(current)) {
        if (closedSet.has(pointToString(neighbor))) {
          continue;
        }
        
        const tentativeGScore = (gScore.get(pointToString(current)) || Infinity) + 1;
        
        if (!openSet.some(p => p.x === neighbor.x && p.y === neighbor.y)) {
          openSet.push(neighbor);
        } else if (tentativeGScore >= (gScore.get(pointToString(neighbor)) || Infinity)) {
          continue;
        }
        
        cameFrom.set(pointToString(neighbor), current);
        gScore.set(pointToString(neighbor), tentativeGScore);
        fScore.set(pointToString(neighbor), tentativeGScore + this.heuristic(neighbor));
      }
    }
    
    return [];
  }
}