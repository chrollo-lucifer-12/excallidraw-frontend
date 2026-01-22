import { IShape, ShapeMode } from "@/lib/types";

export class Icon implements IShape {
  type: ShapeMode = "icon";
  constructor(
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
    public strokeStyle: string,
    public lineWidth: number,
    public path: string,
  ) {}

  getBounds() {
    return {
      x: Math.min(this.startX, this.endX),
      y: Math.min(this.startY, this.endY),
      w: Math.abs(this.endX - this.startX),
      h: Math.abs(this.endY - this.startY),
    };
  }

  isInside(x: number, y: number) {
    const minX = Math.min(this.startX, this.endX);
    const maxX = Math.max(this.startX, this.endX);
    const minY = Math.min(this.startY, this.endY);
    const maxY = Math.max(this.startY, this.endY);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const img = new Image();
    img.src = this.path;

    img.onload = () => {
      ctx.drawImage(
        img,
        this.startX,
        this.startY,
        this.endX - this.startX,
        this.endY - this.startY,
      );
    };
  }
}
