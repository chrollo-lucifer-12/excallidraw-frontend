import { IShape, ShapeMode } from "../draw";

export class Text implements IShape {
  type: ShapeMode = "text";
  text: string = "";
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

    ctx.save();
    ctx.beginPath();
    ctx.rect(
      this.startX + 1,
      this.startY + 1,
      this.endX - this.startX - 2,
      this.endY - this.startY - 2,
    );
    ctx.clip();

    ctx.textBaseline = "top";
    ctx.fillStyle = this.strokeStyle;
    const lineHeight = 16;
    const words = this.text.split("\n");
    for (let i = 0; i < words.length; i++) {
      ctx.fillText(words[i], this.startX + 4, this.startY + 4 + i * lineHeight);
    }

    ctx.restore();
  }

  addChar(char: string) {
    this.text += char;
  }

  removeChar() {
    this.text = this.text.slice(0, -1);
  }
}
