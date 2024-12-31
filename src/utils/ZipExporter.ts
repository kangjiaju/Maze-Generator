import JSZip from 'jszip';
import { MazeSet } from './BatchMazeGenerator';

export class ZipExporter {
  private static async canvasToBlob(
    canvas: HTMLCanvasElement,
    withSolution: boolean = false
  ): Promise<Blob> {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob!);
        },
        'image/jpeg',
        0.95
      );
    });
  }

  static async exportMazeSetsAsZip(
    mazeSets: MazeSet[],
    canvas: HTMLCanvasElement,
    onProgress?: (current: number, total: number) => void
  ): Promise<void> {
    const zip = new JSZip();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    for (let i = 0; i < mazeSets.length; i++) {
      const mazeSet = mazeSets[i];
      const folderName = `maze-${i + 1}`;
      const folder = zip.folder(folderName)!;

      // Generate maze image without solution
      const mazeBlob = await this.canvasToBlob(canvas, false);
      folder.file('maze.jpg', mazeBlob);

      // Generate maze image with solution
      // const solutionBlob = await this.canvasToBlob(canvas, true);
      // folder.file('maze-solution.jpg', solutionBlob);

      // Generate JSON data
      const mazeData = {
        start: mazeSet.maze.start,
        end: mazeSet.maze.end,
        solution: mazeSet.solution,
        width: mazeSet.maze.cells[0].length,
        height: mazeSet.maze.cells.length,
      };
      folder.file('data.json', JSON.stringify(mazeData, null, 2));

      if (onProgress) {
        onProgress(i + 1, mazeSets.length);
      }
    }

    // Generate and download zip file
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mazes-${timestamp}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}