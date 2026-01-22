import { IShape, ShapeMode } from "../draw";

export class Triangle implements IShape {
  type: ShapeMode = "triangle";
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
    const topX = this.startX;
    const topY = this.startY;
    const bottomRightX = this.endX;
    const bottomRightY = this.endY;
    const bottomLeftX = this.startX - (bottomRightX - this.startX);
    const bottomLeftY = bottomRightY;
    const area = (
      p1x: number,
      p1y: number,
      p2x: number,
      p2y: number,
      p3x: number,
      p3y: number,
    ) =>
      Math.abs((p1x * (p2y - p3y) + p2x * (p3y - p1y) + p3x * (p1y - p2y)) / 2);

    const A = area(
      topX,
      topY,
      bottomRightX,
      bottomRightY,
      bottomLeftX,
      bottomLeftY,
    );
    const A1 = area(x, y, bottomRightX, bottomRightY, bottomLeftX, bottomLeftY);
    const A2 = area(topX, topY, x, y, bottomLeftX, bottomLeftY);
    const A3 = area(topX, topY, bottomRightX, bottomRightY, x, y);

    return Math.abs(A - (A1 + A2 + A3)) < 0.1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.fill;

    const topX = this.startX;
    const topY = this.startY;
    const bottomRightX = this.endX;
    const bottomRightY = this.endY;
    const bottomLeftX = this.startX - (bottomRightX - this.startX);
    const bottomLeftY = bottomRightY;

    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(bottomRightX, bottomRightY);
    ctx.lineTo(bottomLeftX, bottomLeftY);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
