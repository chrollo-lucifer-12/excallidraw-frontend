// @ts-nocheck
import { IShape, ShapeMode } from "@/lib/types";
export class Text implements IShape {
  type: ShapeMode = "text";
  text: string = "type something...";
  showCursor = false;
  lastBlink = 0;
  blinkSpeed = 500;

  constructor(
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
    public strokeStyle: string,
    public lineWidth: number,
  ) {}

  getBounds() {
    return {
      x: Math.min(this.startX, this.endX),
      y: Math.min(this.startY, this.endY),
      w: Math.abs(this.endX - this.startX),
      h: Math.abs(this.endY - this.startY),
    };
  }

  isInside(x: number, y: number, ctx?: CanvasRenderingContext2D) {
    if (!ctx) return false;

    const fontSize = this.lineWidth * 10;
    const lineHeight = fontSize + 4;
    ctx.font = `${fontSize}px serif`;

    const lines = this.text.split("\n");

    const textWidth = Math.max(
      ...lines.map((line) => ctx.measureText(line).width),
    );
    const textHeight = lines.length * lineHeight;

    const minX = this.startX;
    const minY = this.startY;
    const maxX = this.startX + textWidth + 8;
    const maxY = this.startY + textHeight + 8;

    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }

  draw(ctx: CanvasRenderingContext2D, timestamp?: number) {
    ctx.save();
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.textBaseline = "top";
    ctx.fillStyle = this.strokeStyle;

    const fontSize = this.lineWidth * 10;
    const lineHeight = fontSize + 4;
    ctx.font = `${fontSize}px serif`;

    const lines = this.text.split("\n");
    let cursorX = this.startX + 4;
    let cursorY = this.startY + 4;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      ctx.fillText(line, this.startX + 4, this.startY + 4 + i * lineHeight);

      if (i === lines.length - 1) {
        const width = ctx.measureText(line).width;
        cursorX = this.startX + 4 + width;
        cursorY = this.startY + 4 + i * lineHeight;
      }
    }

    if (timestamp !== undefined) {
      if (timestamp - this.lastBlink >= this.blinkSpeed) {
        this.showCursor = !this.showCursor;
        this.lastBlink = timestamp;
      }
    }

    if (this.showCursor) {
      ctx.fillRect(cursorX, cursorY, 2, fontSize);
    }

    ctx.restore();
  }

  addChar(char: string) {
    this.text += char;
  }

  removeChar() {
    this.text = this.text.slice(0, -1);
    if (this.text.length === 0) {
      this.text = "type something...";
    }
  }
}
