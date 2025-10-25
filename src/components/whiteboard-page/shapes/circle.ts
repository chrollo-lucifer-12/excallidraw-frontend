import { IShape, ShapeMode } from "../draw";

export class Circle implements IShape {
  type: ShapeMode = "circle";
  constructor(
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
    public strokeStyle: string,
    public lineWidth: number,
  ) {}

  isInside(x: number, y: number) {
    const radius = Math.sqrt(
      (this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2,
    );
    const dx = x - this.startX;
    const dy = y - this.startY;
    return dx * dx + dy * dy <= radius * radius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const radius = Math.sqrt(
      (this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2,
    );
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
