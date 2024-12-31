import { Point } from './types';

export class PointGenerator {
  static generatePoints(width: number, height: number, minDistance: number = 10): { start: Point; end: Point } {
    const getRandomPoint = (): Point => ({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    });

    const calculateDistance = (p1: Point, p2: Point): number => {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };

    let start: Point, end: Point;
    do {
      start = getRandomPoint();
      end = getRandomPoint();
    } while (calculateDistance(start, end) < minDistance);

    return { start, end };
  }
}