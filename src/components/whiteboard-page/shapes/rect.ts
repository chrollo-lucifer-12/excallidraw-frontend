import { IShape, ShapeMode } from "../draw";

export class Rect implements IShape {
  type: ShapeMode = "rect";
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
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.strokeRect(
      this.startX,
      this.startY,
      this.endX - this.startX,
      this.endY - this.startY,
    );
  }
}
