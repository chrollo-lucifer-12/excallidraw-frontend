import { IShape, ShapeMode } from "../draw";

export class Line implements IShape {
  type: ShapeMode = "line";
  constructor(
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
    public strokeStyle: string,
    public lineWidth: number,
  ) {}

  isInside(x: number, y: number) {
    const buffer = 3;
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const dot =
      ((x - this.startX) * dx + (y - this.startY) * dy) / (length * length);
    if (dot < 0 || dot > 1) return false;
    const closestX = this.startX + dot * dx;
    const closestY = this.startY + dot * dy;
    const dist = Math.sqrt((x - closestX) ** 2 + (y - closestY) ** 2);
    return dist <= buffer;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();
  }
}
