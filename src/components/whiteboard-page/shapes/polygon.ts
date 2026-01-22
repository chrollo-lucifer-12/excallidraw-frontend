import { IShape, ShapeMode } from "../draw";

export class Polygon implements IShape {
  type: ShapeMode;
  sides: number;
  rotation: number = 0;

  constructor(
    sides: number,
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
    public strokeStyle: string,
    public lineWidth: number,
  ) {
    this.sides = sides;
    this.type = sides === 5 ? "pentagon" : sides === 6 ? "hexagon" : "polygon";
  }

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
    const radius = Math.sqrt(
      (this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2,
    );
    const angleStep = (2 * Math.PI) / this.sides;

    ctx.beginPath();
    for (let i = 0; i < this.sides; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = this.startX + radius * Math.cos(angle);
      const y = this.startY + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.stroke();
  }
}
