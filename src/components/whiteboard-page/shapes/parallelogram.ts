import { IShape, ShapeMode } from "../draw";

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
  ) {}

  isInside(x: number, y: number) {
    const minX = Math.min(this.startX, this.endX);
    const maxX = Math.max(this.startX, this.endX);
    const minY = Math.min(this.startY, this.endY);
    const maxY = Math.max(this.startY, this.endY);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const cx = (this.startX + this.endX) / 2;
    const cy = (this.startY + this.endY) / 2;

    ctx.save();

    ctx.translate(cx, cy);
    ctx.rotate(this.rotation);
    ctx.translate(-cx, -cy);

    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;

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
    ctx.stroke();
  }
}
