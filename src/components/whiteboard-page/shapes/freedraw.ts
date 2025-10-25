import { IShape, ShapeMode } from "../draw";

export class FreeDraw implements IShape {
  type: ShapeMode = "freedraw";
  points: { x: number; y: number }[] = [];

  constructor(
    sx: number,
    sy: number,
    public strokeStyle: string,
    public lineWidth: number,
  ) {
    this.points.push({ x: sx, y: sy });
  }

  addPoint(point: { x: number; y: number }) {
    this.points.push(point);
  }

  isInside(x: number, y: number) {
    const buffer = 3;
    for (let i = 0; i < this.points.length - 1; i++) {
      const p1 = this.points[i];
      const p2 = this.points[i + 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const dot = ((x - p1.x) * dx + (y - p1.y) * dy) / (length * length);
      if (dot < 0 || dot > 1) continue;
      const closestX = p1.x + dot * dx;
      const closestY = p1.y + dot * dy;
      const dist = Math.sqrt((x - closestX) ** 2 + (y - closestY) ** 2);
      if (dist <= buffer) return true;
    }
    return false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.points.length === 0) return;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke();
  }
}
