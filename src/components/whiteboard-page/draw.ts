interface IShape {
  type: ShapeMode;
  strokeStyle: string;
  lineWidth: number;
  draw(ctx: CanvasRenderingContext2D): void;
  isInside(x: number, y: number): boolean;
}

type ShapeMode =
  | "eraser"
  | "parallelogram"
  | "polygon"
  | "hexagon"
  | "pentagon"
  | "triangle"
  | "ellipse"
  | "text"
  | "arrow"
  | "freedraw"
  | "rect"
  | "circle"
  | "line"
  | "none";

class Text implements IShape {
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

class Rect implements IShape {
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

class Polygon implements IShape {
  type: ShapeMode;
  sides: number;

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

class Circle implements IShape {
  type: ShapeMode = "circle";
  constructor(
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
    public strokeStyle: string,
    public lineWidth: number,
  ) {}

  isInside(x: number, y: number) {
    const radius = Math.sqrt(
      (this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2,
    );
    const dx = x - this.startX;
    const dy = y - this.startY;
    return dx * dx + dy * dy <= radius * radius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const radius = Math.sqrt(
      (this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2,
    );
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

class Ellipse implements IShape {
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

class Line implements IShape {
  type: ShapeMode = "line";
  constructor(
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
    public strokeStyle: string,
    public lineWidth: number,
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
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();
  }
}

class Arrow implements IShape {
  type: ShapeMode = "arrow";
  constructor(
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
    public strokeStyle: string,
    public lineWidth: number,
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
    const headLength = 10;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    const angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);

    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();

    const arrowLeftX = this.endX - headLength * Math.cos(angle - Math.PI / 6);
    const arrowLeftY = this.endY - headLength * Math.sin(angle - Math.PI / 6);

    ctx.beginPath();
    ctx.moveTo(this.endX, this.endY);
    ctx.lineTo(arrowLeftX, arrowLeftY);
    ctx.stroke();

    const arrowRightX = this.endX - headLength * Math.cos(angle + Math.PI / 6);
    const arrowRightY = this.endY - headLength * Math.sin(angle + Math.PI / 6);

    ctx.beginPath();
    ctx.moveTo(this.endX, this.endY);
    ctx.lineTo(arrowRightX, arrowRightY);
    ctx.stroke();
  }
}

class FreeDraw implements IShape {
  type: ShapeMode = "freedraw";
  points: { x: number; y: number }[] = [];

  constructor(
    sx: number,
    sy: number,
    public strokeStyle: string,
    public lineWidth: number,
  ) {
    this.points.push({ x: sx, y: sy });
  }

  addPoint(point: { x: number; y: number }) {
    this.points.push(point);
  }

  isInside(x: number, y: number) {
    const buffer = 3;
    for (let i = 0; i < this.points.length - 1; i++) {
      const p1 = this.points[i];
      const p2 = this.points[i + 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const dot = ((x - p1.x) * dx + (y - p1.y) * dy) / (length * length);
      if (dot < 0 || dot > 1) continue;
      const closestX = p1.x + dot * dx;
      const closestY = p1.y + dot * dy;
      const dist = Math.sqrt((x - closestX) ** 2 + (y - closestY) ** 2);
      if (dist <= buffer) return true;
    }
    return false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.points.length === 0) return;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke();
  }
}

class Triangle implements IShape {
  type: ShapeMode = "triangle";

  constructor(
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
    public strokeStyle: string,
    public lineWidth: number,
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
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
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
    ctx.stroke();
  }
}

class NullShape implements IShape {
  type: ShapeMode = "none";
  strokeStyle = "black";
  lineWidth = 1;
  constructor(_sx: number, _sy: number, _ex: number, _ey: number) {}
  isInside(_x: number, _y: number) {
    return false;
  }
  draw(_ctx: CanvasRenderingContext2D) {}
}

class Parallelogram implements IShape {
  type: ShapeMode = "parallelogram";
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

export class CanvasDrawer {
  private shapes: IShape[] = [];
  private clicked = false;
  private startX = 0;
  private startY = 0;
  private currentShapeClass:
    | (new (
        sx: number,
        sy: number,
        ex: number,
        ey: number,
        strokeStyle: string,
        lineWidth: number,
      ) => IShape)
    | any = Rect;
  private currentFreeDraw: FreeDraw | null = null;
  private currentMode: ShapeMode = "none";
  private draggingShape: IShape | null = null;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private ctx: CanvasRenderingContext2D;
  public strokeStyle: string = "black";
  public lineWidth: number = 3;
  private selectedTextBox: Text | null = null;
  private shapesToEraser: number[] = [];
  private eraserSize: number = 10;
  private panX = 0;
  private panY = 0;
  private panStartX = 0;
  private panStartY = 0;
  private isPanning: boolean = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private ws: WebSocket | null,
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not found");
    this.ctx = ctx;
    this.resizeCanvas();
    this.loadShapes();
    this.canvas.style.cursor = "pointer";
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    canvas.addEventListener("mousedown", this.handleMouseDown);
    canvas.addEventListener("mouseup", this.handleMouseUp);
    canvas.addEventListener("mousemove", this.handleMouseMove);
    canvas.addEventListener("wheel", this.handleWheel);
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keydown", this.handleKeyDown);

    const serializable = this.shapes.map((s) => ({
      ...s,
    }));

    if (this.ws) {
      this.ws.onopen = (e) => {
        this.ws?.send(
          JSON.stringify({
            type: "shapes",
            shapes: serializable,
          }),
        );
      };

      this.ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === "shapes") {
          this.shapes = data.shapes.map((s: any) => {
            switch (s.type) {
              case "rect":
                return new Rect(
                  s.startX,
                  s.startY,
                  s.endX,
                  s.endY,
                  s.strokeStyle,
                  s.lineWidth,
                );
              case "circle":
                return new Circle(
                  s.startX,
                  s.startY,
                  s.endX,
                  s.endY,
                  s.strokeStyle,
                  s.lineWidth,
                );
              case "line":
                return new Line(
                  s.startX,
                  s.startY,
                  s.endX,
                  s.endY,
                  s.strokeStyle,
                  s.lineWidth,
                );
              case "freedraw":
                const fd = new FreeDraw(
                  s.points[0].x,
                  s.points[0].y,
                  s.strokeStyle,
                  s.lineWidth,
                );
                s.points.slice(1).forEach((p: any) => fd.addPoint(p));
                return fd;
              default:
                return new NullShape(0, 0, 0, 0);
            }
          });
          this.drawShapes();
        }
      };
    }
  }

  public setStyles(strokeStyle: string, lineWidth: number) {
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
  }

  public setMode(mode: ShapeMode) {
    this.currentMode = mode;
    this.shapesToEraser = [];
    if (this.currentMode === "none") {
      this.canvas.style.cursor = "pointer";
    } else if (this.currentMode === "eraser") {
      this.canvas.style.cursor = "url(/eraser-cursor.png), auto";
    } else {
      this.canvas.style.cursor = "crosshair";
    }
    this.draggingShape = null;
    switch (mode) {
      case "rect":
        this.currentShapeClass = Rect;
        break;
      case "circle":
        this.currentShapeClass = Circle;
        break;
      case "line":
        this.currentShapeClass = Line;
        break;
      case "freedraw":
        this.currentShapeClass = FreeDraw;
        break;
      case "arrow":
        this.currentShapeClass = Arrow;
        break;
      case "text":
        this.currentShapeClass = Text;
        break;
      case "ellipse":
        this.currentShapeClass = Ellipse;
        break;
      case "triangle":
        this.currentShapeClass = Triangle;
        break;
      case "pentagon":
        this.currentShapeClass = class extends Polygon {
          constructor(
            sx: number,
            sy: number,
            ex: number,
            ey: number,
            stroke: string,
            lw: number,
          ) {
            super(5, sx, sy, ex, ey, stroke, lw);
          }
        };
        break;
      case "hexagon":
        this.currentShapeClass = class extends Polygon {
          constructor(
            sx: number,
            sy: number,
            ex: number,
            ey: number,
            stroke: string,
            lw: number,
          ) {
            super(6, sx, sy, ex, ey, stroke, lw);
          }
        };
        break;
      case "parallelogram":
        this.currentShapeClass = Parallelogram;
        break;

      default:
        this.currentShapeClass = NullShape;
        break;
    }
  }

  private handleMouseDown(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - this.panX;
    const y = e.clientY - rect.top - this.panY;

    if (e.button == 1) {
      this.isPanning = true;

      this.panStartX = e.clientX - this.panX;
      this.panStartY = e.clientY - this.panY;
      return;
    }

    if (this.currentMode == "text") {
      const textBox = new Text(
        x,
        y,
        x + 150,
        y + 30,
        this.strokeStyle,
        this.lineWidth,
      );
      this.shapes.push(textBox);
      this.selectedTextBox = textBox;
      this.currentMode = "none";
      this.drawShapes();
      this.saveShapes();
      return;
    }

    if (this.currentMode !== "none") {
      this.clicked = true;
      this.startX = x;
      this.startY = y;

      if (this.currentMode === "freedraw") {
        this.currentFreeDraw = new FreeDraw(
          x,
          y,
          this.strokeStyle,
          this.lineWidth,
        );
        this.shapes.push(this.currentFreeDraw);
      }
    } else {
      for (let i = this.shapes.length - 1; i >= 0; i--) {
        const shape = this.shapes[i];
        if (shape.isInside(x, y)) {
          this.draggingShape = shape;
          this.dragOffsetX = x;
          this.dragOffsetY = y;
          this.clicked = true;
          if (shape.type === "text") {
            this.selectedTextBox = shape as Text;
          }
          break;
        }
      }
    }
  }

  private handleMouseUp(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left - this.panX;
    const endY = e.clientY - rect.top - this.panY;

    if (this.isPanning) {
      this.isPanning = false;
      return;
    }
    if (!this.clicked) return;

    if (this.currentMode !== "freedraw" && this.currentMode !== "none") {
      const shape = new this.currentShapeClass(
        this.startX,
        this.startY,
        endX,
        endY,
        this.strokeStyle,
        this.lineWidth,
      );
      this.shapes.push(shape);
    }

    this.saveShapes();
    this.clicked = false;
    this.currentFreeDraw = null;
    this.drawShapes();
  }

  private handleMouseMove(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left - this.panX;
    const endY = e.clientY - rect.top - this.panY;

    if (this.isPanning) {
      this.panX = e.clientX - this.panStartX;
      this.panY = e.clientY - this.panStartY;
      this.drawShapes();
      return;
    }

    if (!this.clicked) return;

    if (this.draggingShape && this.currentMode != "eraser") {
      const dx = endX - this.dragOffsetX;
      const dy = endY - this.dragOffsetY;
      if (
        this.draggingShape.type === "rect" ||
        this.draggingShape.type === "circle" ||
        this.draggingShape.type === "line" ||
        this.draggingShape.type === "arrow" ||
        this.draggingShape.type === "text" ||
        this.draggingShape.type === "ellipse" ||
        this.draggingShape.type === "triangle" ||
        this.draggingShape.type === "pentagon" ||
        this.draggingShape.type === "hexagon" ||
        this.draggingShape.type === "parallelogram"
      ) {
        (this.draggingShape as any).startX += dx;
        (this.draggingShape as any).startY += dy;
        (this.draggingShape as any).endX += dx;
        (this.draggingShape as any).endY += dy;
      } else if (this.draggingShape.type === "freedraw") {
        const fd = this.draggingShape as FreeDraw;
        fd.points = fd.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
      } else if (this.selectedTextBox) {
        (this.selectedTextBox as any).startX += dx;
        (this.selectedTextBox as any).startY += dy;
        (this.selectedTextBox as any).endX += dx;
        (this.selectedTextBox as any).endY += dy;
      }
      this.dragOffsetX = endX;
      this.dragOffsetY = endY;
      this.drawShapes();
    } else if (this.currentMode === "freedraw" && this.currentFreeDraw) {
      this.currentFreeDraw.addPoint({ x: endX, y: endY });
      this.drawShapes();
    } else if (this.currentMode !== "none" && this.currentMode !== "eraser") {
      this.drawShapes();
      this.ctx.save();
      this.ctx.translate(this.panX, this.panY);
      const shape = new this.currentShapeClass(
        this.startX,
        this.startY,
        endX,
        endY,
        this.strokeStyle,
        this.lineWidth,
      );
      shape.draw(this.ctx);
      this.ctx.restore();
    } else if (this.currentMode === "eraser") {
      for (let i = this.shapes.length - 1; i >= 0; i--) {
        const shape = this.shapes[i];
        const ex =
          e.clientX - this.canvas.getBoundingClientRect().left - this.panX;
        const ey =
          e.clientY - this.canvas.getBoundingClientRect().top - this.panY;

        const inEraser =
          shape.isInside(ex, ey) ||
          (shape.type === "freedraw" &&
            (shape as FreeDraw).points.some(
              (p) =>
                Math.abs(p.x - ex) <= this.eraserSize &&
                Math.abs(p.y - ey) <= this.eraserSize,
            ));

        if (inEraser) {
          this.shapes.splice(i, 1);
        }
      }
      this.drawShapes();
      this.saveShapes();
    }
  }

  private drawShapes() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    for (const shape of this.shapes) {
      shape.draw(this.ctx);
    }
    this.ctx.restore();
  }

  private saveShapes() {
    const serializable = this.shapes.map((s) => {
      if (s.type === "text") {
        const t = s as Text;
        return { ...t, text: t.text };
      } else if (s.type === "freedraw") {
        const fd = s as FreeDraw;
        return { ...fd, points: fd.points };
      }
      return { ...s };
    });

    localStorage.setItem("shapes", JSON.stringify(serializable));
  }

  private loadShapes() {
    const data = localStorage.getItem("shapes");
    if (!data) return;

    const parsed = JSON.parse(data);
    this.shapes = parsed.map((s: any) => {
      switch (s.type) {
        case "rect":
          return new Rect(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
          );
        case "circle":
          return new Circle(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
          );
        case "line":
          return new Line(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
          );
        case "freedraw":
          const fd = new FreeDraw(
            s.points[0].x,
            s.points[0].y,
            s.strokeStyle,
            s.lineWidth,
          );
          s.points.slice(1).forEach((p: any) => fd.addPoint(p));
          return fd;
        case "arrow":
          return new Arrow(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
          );
        case "text":
          const t = new Text(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
          );
          t.text = s.text;
          return t;
        case "ellipse":
          return new Ellipse(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
          );
        case "triangle":
          return new Triangle(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
          );
        case "pentagon":
          return new Polygon(
            5,
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
          );
        case "hexagon":
          return new Polygon(
            6,
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
          );
        case "parallelogram":
          return new Parallelogram(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
          );
        default:
          return new NullShape(0, 0, 0, 0);
      }
    });

    this.drawShapes();
  }

  public resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth || window.innerWidth;
    this.canvas.height = this.canvas.offsetHeight || window.innerHeight;
    this.drawShapes();
  }

  private handleResize() {
    this.resizeCanvas();
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.selectedTextBox) return;
    if (e.key === "Backspace") {
      this.selectedTextBox.removeChar();
      this.drawShapes();
    } else if (e.key.length === 1) {
      this.selectedTextBox.addChar(e.key);
      this.drawShapes();
    }
    this.saveShapes();
  }

  private handleWheel(e: WheelEvent) {
    this.panX -= e.deltaX;
    this.panY -= e.deltaY;
    this.drawShapes();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("wheel", this.handleWheel);
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("keydown", this.handleKeyDown);
  }
}
