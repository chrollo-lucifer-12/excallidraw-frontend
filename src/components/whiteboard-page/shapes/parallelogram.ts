import { IShape, ShapeMode } from "@/lib/types";

export class Parallelogram implements IShape {
  type: ShapeMode = "parallelogram";
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

    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.globalAlpha = this.opacity;

    const width = this.endX - this.startX;
    const height = this.endY - this.startY;
    const skew = width * 0.3;

    const topLeftX = this.startX;
    const topLeftY = this.startY;
    const topRightX = this.startX + width + skew;
    const topRightY = this.startY;
    const bottomRightX = this.startX + width;
    const bottomRightY = this.startY + height;
    const bottomLeftX = this.startX - skew;
    const bottomLeftY = this.startY + height;

    ctx.beginPath();
    ctx.moveTo(topLeftX, topLeftY);
    ctx.lineTo(topRightX, topRightY);
    ctx.lineTo(bottomRightX, bottomRightY);
    ctx.lineTo(bottomLeftX, bottomLeftY);
    ctx.closePath();

    if (this.fill) {
      ctx.fillStyle = this.fill;
      ctx.fill();
    }

    ctx.stroke();

    ctx.restore();
  }
}
