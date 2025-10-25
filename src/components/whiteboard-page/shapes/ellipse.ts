import { IShape, ShapeMode } from "../draw";

export class Ellipse implements IShape {
  type: ShapeMode = "ellipse";
  constructor(
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
    public strokeStyle: string,
    public lineWidth: number,
  ) {}

  isInside(x: number, y: number) {
    const rx = (this.endX - this.startX) / 2;
    const ry = (this.endY - this.startY) / 2;
    const cx = this.startX + rx;
    const cy = this.startY + ry;
    return (x - cx) ** 2 / rx ** 2 + (y - cy) ** 2 / ry ** 2 <= 1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const rx = (this.endX - this.startX) / 2;
    const ry = (this.endY - this.startY) / 2;
    const cx = this.startX + rx;
    const cy = this.startY + ry;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
