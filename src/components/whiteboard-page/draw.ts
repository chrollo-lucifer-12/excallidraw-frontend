import { Text } from "./shapes/text";
import { Rect } from "./shapes/rect";
import { Polygon } from "./shapes/polygon";
import { Circle } from "./shapes/circle";
import { Ellipse } from "./shapes/ellipse";
import { Line } from "./shapes/line";
import { Arrow } from "./shapes/arrow";
import { FreeDraw } from "./shapes/freedraw";
import { Triangle } from "./shapes/triangle";
import { Parallelogram } from "./shapes/parallelogram";

export interface IShape {
  type: ShapeMode;
  strokeStyle: string;
  lineWidth: number;
  draw(ctx: CanvasRenderingContext2D): void;
  isInside(x: number, y: number): boolean;
}

export type ShapeMode =
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
  private zoomX = 1;
  private zoomY = 1;
  public selectShape: IShape | null = null;
  public onSelectShapeChanged?: (shape: IShape | null) => void;

  constructor(
    public canvas: HTMLCanvasElement,
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
    this.selectShape = null;

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

  public setSelectShape(shape: IShape | null) {
    this.selectShape = shape;
    if (this.onSelectShapeChanged) {
      this.onSelectShapeChanged(shape);
    }
  }

  public setLineWidth(w: number) {
    if (this.selectShape) {
      this.selectShape.lineWidth = w;
      this.saveShapes();
      this.drawShapes();
    }
  }

  public setStrokeStyle(color: string) {
    if (this.selectShape) {
      this.selectShape.strokeStyle = color;
      this.saveShapes();
      this.drawShapes();
    }
  }

  public setZoom(x: number, y: number) {
    this.zoomX = x;
    this.zoomY = y;
    this.drawShapes();
  }

  public setStyles(strokeStyle: string, lineWidth: number) {
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
  }

  public setMode(mode: ShapeMode) {
    this.currentMode = mode;
    this.shapesToEraser = [];
    this.setSelectShape(null);

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
    const x = (e.clientX - rect.left - this.panX) / this.zoomX;
    const y = (e.clientY - rect.top - this.panY) / this.zoomY;

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
          this.setSelectShape(shape);

          console.log(shape);
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
    const endX = (e.clientX - rect.left - this.panX) / this.zoomX;
    const endY = (e.clientY - rect.top - this.panY) / this.zoomY;

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
    const rawX = (e.clientX - rect.left - this.panX) / this.zoomX;
    const rawY = (e.clientY - rect.top - this.panY) / this.zoomY;

    if (this.isPanning) {
      this.panX = e.clientX - this.panStartX;
      this.panY = e.clientY - this.panStartY;
      this.drawShapes();
      return;
    }

    if (!this.clicked) return;

    if (this.draggingShape && this.currentMode !== "eraser") {
      const dx = rawX - this.dragOffsetX;
      const dy = rawY - this.dragOffsetY;

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
      }

      this.dragOffsetX = rawX;
      this.dragOffsetY = rawY;
      this.drawShapes();
      return;
    }

    if (this.currentMode === "freedraw" && this.currentFreeDraw) {
      this.currentFreeDraw.addPoint({ x: rawX, y: rawY });
      this.drawShapes();
      return;
    }

    if (this.currentMode !== "none" && this.currentMode !== "eraser") {
      this.drawShapes();

      this.ctx.save();
      this.ctx.translate(this.panX, this.panY);
      this.ctx.scale(this.zoomX, this.zoomY);

      const previewShape = new this.currentShapeClass(
        this.startX,
        this.startY,
        rawX,
        rawY,
        this.strokeStyle,
        this.lineWidth,
      );
      previewShape.draw(this.ctx);

      this.ctx.restore();
      return;
    }
    if (this.currentMode === "eraser") {
      for (let i = this.shapes.length - 1; i >= 0; i--) {
        const shape = this.shapes[i];

        const ex = rawX;
        const ey = rawY;

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

  public drawShapes() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.zoomX, this.zoomY);
    for (const shape of this.shapes) {
      shape.draw(this.ctx);
    }
    this.ctx.restore();
  }

  public saveShapes() {
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
    if (e.key === "+") {
      const centerX = this.canvas.width / 2 - this.panX;
      const centerY = this.canvas.height / 2 - this.panY;
      const zoomFactor = 1.2;

      this.zoomX *= zoomFactor;
      this.zoomY *= zoomFactor;

      this.panX -= centerX * (zoomFactor - 1);
      this.panY -= centerY * (zoomFactor - 1);

      this.drawShapes();
      return;
    }
    if (e.key === "-") {
      const centerX = this.canvas.width / 2 - this.panX;
      const centerY = this.canvas.height / 2 - this.panY;
      const zoomFactor = 1 / 1.2;

      this.zoomX *= zoomFactor;
      this.zoomY *= zoomFactor;

      this.panX -= centerX * (zoomFactor - 1);
      this.panY -= centerY * (zoomFactor - 1);
      this.drawShapes();
      return;
    }
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
