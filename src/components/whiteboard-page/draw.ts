interface IShape {
  draw(ctx: CanvasRenderingContext2D): void;
}

type ShapeMode = "rect" | "circle" | "line" | "none";

class Rect implements IShape {
  constructor(
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    const width = this.endX - this.startX;
    const height = this.endY - this.startY;
    ctx.strokeRect(this.startX, this.startY, width, height);
  }
}

class Circle implements IShape {
  constructor(
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    const radius = Math.sqrt(
      (this.endX - this.startX) * (this.endX - this.startX) +
        (this.endY - this.startY) * (this.endY - this.startY),
    );
    ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

class Line implements IShape {
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

class NullShape implements IShape {
  constructor(_sx: number, _sy: number, _ex: number, _ey: number) {}
  draw(_ctx: CanvasRenderingContext2D) {}
}

export class CanvasDrawer {
  private shapes: IShape[] = [];
  private clicked = false;
  private startX = -1;
  private startY = -1;
  private currentShapeClass: new (
    sx: number,
    sy: number,
    ex: number,
    ey: number,
  ) => IShape = Rect;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not found");
    this.ctx = ctx;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    canvas.addEventListener("mousedown", this.handleMouseDown);
    canvas.addEventListener("mouseup", this.handleMouseUp);
    canvas.addEventListener("mousemove", this.handleMouseMove);
  }

  public setMode(mode: ShapeMode) {
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
      default:
        this.currentShapeClass = NullShape;
        break;
    }
  }

  private ctx: CanvasRenderingContext2D;

  public setShapeClass(
    shapeClass: new (sx: number, sy: number, ex: number, ey: number) => IShape,
  ) {
    this.currentShapeClass = shapeClass;
  }

  private handleMouseDown(e: MouseEvent) {
    this.clicked = true;
    const rect = this.canvas.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;
  }

  private handleMouseUp(e: MouseEvent) {
    if (!this.clicked) return;

    const rect = this.canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const shape = new this.currentShapeClass(
      this.startX,
      this.startY,
      endX,
      endY,
    );
    this.shapes.push(shape);

    this.clicked = false;
    this.startX = -1;
    this.startY = -1;

    this.drawShapes();
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.clicked) return;

    const rect = this.canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    this.drawShapes();

    const shape = new this.currentShapeClass(
      this.startX,
      this.startY,
      endX,
      endY,
    );
    shape.draw(this.ctx);
  }

  private drawShapes() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const shape of this.shapes) {
      shape.draw(this.ctx);
    }
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
  }
}
