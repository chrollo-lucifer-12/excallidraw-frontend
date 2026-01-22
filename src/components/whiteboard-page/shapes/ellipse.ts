import { IShape, ShapeMode } from "@/lib/types";

export class Ellipse implements IShape {
  type: ShapeMode = "ellipse";
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
    const rx = (this.endX - this.startX) / 2;
    const ry = (this.endY - this.startY) / 2;
    const cx = this.startX + rx;
    const cy = this.startY + ry;
    return (x - cx) ** 2 / rx ** 2 + (y - cy) ** 2 / ry ** 2 <= 1;
  }

  getBounds() {
    return {
      x: Math.min(this.startX, this.endX),
      y: Math.min(this.startY, this.endY),
      w: Math.abs(this.endX - this.startX),
      h: Math.abs(this.endY - this.startY),
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    const rx = (this.endX - this.startX) / 2;
    const ry = (this.endY - this.startY) / 2;
    const cx = this.startX + rx;
    const cy = this.startY + ry;

    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;

    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);

    if (this.fill) {
      ctx.fillStyle = this.fill;
      ctx.fill();
    }

    ctx.stroke();

    ctx.restore();
  }
}
