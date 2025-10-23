interface IShape {
  type: ShapeMode;
  draw(ctx: CanvasRenderingContext2D): void;
}

type ShapeMode = "freedraw" | "rect" | "circle" | "line" | "none";

class Rect implements IShape {
  type: ShapeMode = "rect";
  constructor(
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
  ) {}
  draw(ctx: CanvasRenderingContext2D) {
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
  ) {}
  draw(ctx: CanvasRenderingContext2D) {
    const radius = Math.sqrt(
      (this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2,
    );
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
  ) {}
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();
  }
}

class FreeDraw implements IShape {
  type: ShapeMode = "freedraw";
  points: { x: number; y: number }[] = [];

  constructor(sx: number, sy: number) {
    this.points.push({ x: sx, y: sy });
  }

  addPoint(point: { x: number; y: number }) {
    this.points.push(point);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.points.length === 0) return;

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
  constructor(_sx: number, _sy: number, _ex: number, _ey: number) {}
  draw(_ctx: CanvasRenderingContext2D) {}
}

export class CanvasDrawer {
  private shapes: IShape[] = [];
  private clicked = false;
  private startX = 0;
  private startY = 0;
  private currentShapeClass: new (
    sx: number,
    sy: number,
    ex: number,
    ey: number,
  ) => IShape = Rect;
  private currentFreeDraw: FreeDraw | null = null;
  private currentMode: ShapeMode = "rect";
  private ctx: CanvasRenderingContext2D;

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

  public setMode(mode: ShapeMode) {
    this.currentMode = mode;
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
        this.currentShapeClass = FreeDraw as any;
        break;
      default:
        this.currentShapeClass = NullShape;
        break;
    }
  }

  private handleMouseDown(e: MouseEvent) {
    this.clicked = true;
    const rect = this.canvas.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;

    if (this.currentMode === "freedraw") {
      this.currentFreeDraw = new FreeDraw(this.startX, this.startY);
      this.shapes.push(this.currentFreeDraw);
    }
  }

  private handleMouseUp(e: MouseEvent) {
    if (!this.clicked) return;

    const rect = this.canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    if (this.currentMode !== "freedraw") {
      const shape = new this.currentShapeClass(
        this.startX,
        this.startY,
        endX,
        endY,
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

    if (this.currentMode === "freedraw" && this.currentFreeDraw) {
      this.currentFreeDraw.addPoint({ x: endX, y: endY });
      this.drawShapes();
      this.currentFreeDraw.draw(this.ctx);
    } else {
      this.drawShapes();
      const shape = new this.currentShapeClass(
        this.startX,
        this.startY,
        endX,
        endY,
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
    localStorage.setItem("shapes", JSON.stringify(this.shapes));
  }

  private loadShapes() {
    const shapesStr = localStorage.getItem("shapes");
    if (!shapesStr) return;

    const parsed: any[] = JSON.parse(shapesStr);
    this.shapes = parsed.map((s) => {
      switch (s.type) {
        case "rect":
          return new Rect(s.startX, s.startY, s.endX, s.endY);
        case "circle":
          return new Circle(s.startX, s.startY, s.endX, s.endY);
        case "line":
          return new Line(s.startX, s.startY, s.endX, s.endY);
        case "freedraw":
          const fd = new FreeDraw(s.points[0].x, s.points[0].y);
          s.points.slice(1).forEach((p: any) => fd.addPoint(p));
          return fd;
        default:
          return new NullShape(0, 0, 0, 0);
      }
    });

    this.drawShapes();
  }

  private resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
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
