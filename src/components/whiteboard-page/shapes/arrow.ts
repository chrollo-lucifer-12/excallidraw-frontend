import { IShape, ShapeMode } from "../draw";

export class Arrow implements IShape {
  type: ShapeMode = "arrow";
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
    ctx.save();

    const headLength = 10;

    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.globalAlpha = this.opacity;

    const angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);

    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.endX, this.endY);
    ctx.lineTo(
      this.endX - headLength * Math.cos(angle - Math.PI / 6),
      this.endY - headLength * Math.sin(angle - Math.PI / 6),
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.endX, this.endY);
    ctx.lineTo(
      this.endX - headLength * Math.cos(angle + Math.PI / 6),
      this.endY - headLength * Math.sin(angle + Math.PI / 6),
    );
    ctx.stroke();

    ctx.restore();
  }
}
