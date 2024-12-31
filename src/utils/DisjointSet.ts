// Disjoint Set data structure for Kruskal's algorithm
export class DisjointSet {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = Array(size).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x: number, y: number): void {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX !== rootY) {
      if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;
      }
    }
  }
}