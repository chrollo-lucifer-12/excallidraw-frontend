interface IShape {
  type: ShapeMode;
  strokeStyle: string;
  lineWidth: number;
  draw(ctx: CanvasRenderingContext2D): void;
  isInside(x: number, y: number): boolean;
}

type ShapeMode = "freedraw" | "rect" | "circle" | "line" | "none";

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
  private strokeStyle: string = "black";
  private lineWidth: number = 3;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not found");
    this.ctx = ctx;
    this.resizeCanvas();
    this.loadShapes();

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleResize = this.handleResize.bind(this);

    canvas.addEventListener("mousedown", this.handleMouseDown);
    canvas.addEventListener("mouseup", this.handleMouseUp);
    canvas.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("resize", this.handleResize);
  }

  public setStyles(strokeStyle: string, lineWidth: number) {
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
  }

  public setMode(mode: ShapeMode) {
    this.currentMode = mode;
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
      default:
        this.currentShapeClass = NullShape;
        break;
    }
  }

  private handleMouseDown(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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
          break;
        }
      }
    }
  }

  private handleMouseUp(e: MouseEvent) {
    if (!this.clicked) return;
    const rect = this.canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

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
    if (!this.clicked) return;
    const rect = this.canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    if (this.draggingShape) {
      const dx = endX - this.dragOffsetX;
      const dy = endY - this.dragOffsetY;
      if (
        this.draggingShape.type === "rect" ||
        this.draggingShape.type === "circle" ||
        this.draggingShape.type === "line"
      ) {
        (this.draggingShape as any).startX += dx;
        (this.draggingShape as any).startY += dy;
        (this.draggingShape as any).endX += dx;
        (this.draggingShape as any).endY += dy;
      } else if (this.draggingShape.type === "freedraw") {
        const fd = this.draggingShape as FreeDraw;
        fd.points = fd.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
      }
      this.dragOffsetX = endX;
      this.dragOffsetY = endY;
      this.drawShapes();
    } else if (this.currentMode === "freedraw" && this.currentFreeDraw) {
      this.currentFreeDraw.addPoint({ x: endX, y: endY });
      this.drawShapes();
    } else if (this.currentMode !== "none") {
      this.drawShapes();
      const shape = new this.currentShapeClass(
        this.startX,
        this.startY,
        endX,
        endY,
        this.strokeStyle,
        this.lineWidth,
      );
      shape.draw(this.ctx);
    }
  }

  private drawShapes() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const shape of this.shapes) {
      shape.draw(this.ctx);
    }
  }

  private saveShapes() {
    const serializable = this.shapes.map((s) => ({
      ...s,
    }));
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

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("resize", this.handleResize);
  }
}
