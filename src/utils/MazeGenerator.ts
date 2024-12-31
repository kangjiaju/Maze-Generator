import { DisjointSet } from './DisjointSet';

interface Edge {
  from: number;
  to: number;
  weight: number;
}

export class MazeGenerator {
  private readonly size: number;
  private readonly totalCells: number;
  private edges: Edge[] = [];

  constructor(size: number) {
    this.size = size;
    this.totalCells = size * size;
    this.initializeEdges();
  }

  private initializeEdges(): void {
    // Create horizontal edges
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size - 1; col++) {
        const from = row * this.size + col;
        const to = from + 1;
        this.edges.push({
          from,
          to,
          weight: Math.random(),
        });
      }
    }

    // Create vertical edges
    for (let row = 0; row < this.size - 1; row++) {
      for (let col = 0; col < this.size; col++) {
        const from = row * this.size + col;
        const to = from + this.size;
        this.edges.push({
          from,
          to,
          weight: Math.random(),
        });
      }
    }
  }

  generateMaze(): Edge[] {
    const ds = new DisjointSet(this.totalCells);
    const mst: Edge[] = [];

    // Sort edges by weight
    this.edges.sort((a, b) => a.weight - b.weight);

    // Kruskal's algorithm
    for (const edge of this.edges) {
      if (ds.find(edge.from) !== ds.find(edge.to)) {
        mst.push(edge);
        ds.union(edge.from, edge.to);
      }
    }

    return mst;
  }
}