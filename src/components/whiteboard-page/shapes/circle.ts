import { IShape, ShapeMode } from "../draw";

export class Circle implements IShape {
  type: ShapeMode = "circle";
  rotation: number = 0;
  constructor(
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
    public strokeStyle: string,
    public lineWidth: number,
    public fill: string,
    public opacity: number,
    public borderRadius: number,
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
    ctx.save();

    const radius = Math.sqrt(
      (this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2,
    );

    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;

    ctx.beginPath();
    ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);

    if (this.fill) {
      ctx.fillStyle = this.fill;
      ctx.fill();
    }

    ctx.stroke();

    ctx.restore();
  }
}
