import { MazeData, Point } from './types';
import { MazeSet } from './BatchMazeGenerator';

export class MazeExporter {
  static async exportMazeAsImage(
    canvas: HTMLCanvasElement,
    filename: string = 'maze',
    withSolution: boolean = false
  ): Promise<void> {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filename}${withSolution ? '-solution' : ''}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        resolve();
      }, 'image/jpeg', 0.95);
    });
  }

  static exportMazeData(
    maze: MazeData,
    solution: Point[],
    filename: string = 'maze'
  ): void {
    const mazeData = {
      start: maze.start,
      end: maze.end,
      solution: solution,
      width: maze.cells[0].length,
      height: maze.cells.length,
    };

    const blob = new Blob([JSON.stringify(mazeData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async exportMazeSet(
    mazeSet: MazeSet,
    canvas: HTMLCanvasElement,
    index: number
  ): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseFilename = `maze-${timestamp}-${index + 1}`;

    // Draw and export maze without solution
    const ctx = canvas.getContext('2d')!;
    await this.exportMazeAsImage(canvas, baseFilename, false);

    // Draw and export maze with solution
    this.drawMaze(mazeSet.maze, ctx, true, mazeSet.solution);
    await this.exportMazeAsImage(canvas, baseFilename, true);

    // Export JSON data
    this.exportMazeData(mazeSet.maze, mazeSet.solution, baseFilename);
  }
  
// static async exportMazeSet(
//   mazeSet: MazeSet,
//   canvas: HTMLCanvasElement,
//   index: number
// ): Promise<void> {
//   const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//   const baseFilename = `maze-${timestamp}-${index + 1}`;

//   // 获取 canvas 上下文
//   const ctx = canvas.getContext('2d')!;

//   // 清空画布
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   // 绘制不带解决方案的迷宫
//   this.drawMaze(mazeSet.maze, ctx, false); // 绘制迷宫，不带解法
//   await this.exportMazeAsImage(canvas, baseFilename, false); // 导出不带解法的图像

//   // // 清空画布
//   // ctx.clearRect(0, 0, canvas.width, canvas.height);

//   // // 绘制带解决方案的迷宫
//   // console.log(mazeSet.solution);  // 检查 solution 是否存在且包含正确的数据
//   // this.drawMaze(mazeSet.maze, ctx, true, mazeSet.solution); // 绘制带解法的迷宫
//   // await this.exportMazeAsImage(canvas, baseFilename, true); // 导出带解法的图像

//   // 导出 JSON 数据
//   this.exportMazeData(mazeSet.maze, mazeSet.solution, baseFilename);
// }



  static async exportMazeSets(
    mazeSets: MazeSet[],
    canvas: HTMLCanvasElement,
    onProgress?: (current: number, total: number) => void
  ): Promise<void> {
    for (let i = 0; i < mazeSets.length; i++) {
      await this.exportMazeSet(mazeSets[i], canvas, i);
      if (onProgress) {
        onProgress(i + 1, mazeSets.length);
      }
    }
  }
}