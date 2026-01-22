import { IShape, ShapeMode } from "../draw";

export class Rect implements IShape {
  type: ShapeMode = "rect";
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
    const minX = Math.min(this.startX, this.endX);
    const maxX = Math.max(this.startX, this.endX);
    const minY = Math.min(this.startY, this.endY);
    const maxY = Math.max(this.startY, this.endY);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;

    const w = this.endX - this.startX;
    const h = this.endY - this.startY;

    ctx.fillRect(this.startX, this.startY, w, h);
    ctx.strokeRect(this.startX, this.startY, w, h);

    ctx.restore();
  }
}
