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
import { Icon } from "./shapes/icons";
import { Code } from "./shapes/code";

export interface IShape {
  type: ShapeMode;
  strokeStyle: string;
  lineWidth: number;
  draw(ctx: CanvasRenderingContext2D): void;
  isInside(x: number, y: number): boolean;
}

export type ShapeMode =
  | "code"
  | "icon"
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
  private awsIcon: string | null = null;
  private readonly handleSize = 8; // px
  private readonly handleColor = "#3b82f6";
  private resizing: {
    shape: IShape;
    corner: string;
    startX: number;
    startY: number;
    orig: any;
  } | null = null;
  private rotating: {
    shape: IShape;
    centerX: number;
    centerY: number;
    startAngle: number;
    initialRotation: number;
  } | null = null;
  private history: string[] = [];
  private historyIndex: number = -1;
  private readonly MAX_HISTORY = 100;

  constructor(public canvas: HTMLCanvasElement) {
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
  }

  public download() {
    let imageDataUrl = this.canvas.toDataURL("image/png");
    // upload to s3
    let imageUrl = "";
    // prisma.whiteBoard.update({
    //   where: {
    //     slug: this.getSlug(),
    //   },
    //   data: {
    //     image: imageUrl,
    //   },
    // });
  }

  private snapshot() {
    const serializable = this.shapes.map((s: any) => {
      if (s.type === "freedraw") {
        return { ...s, points: s.points };
      }
      if (s.type === "text" || s.type === "code") {
        return { ...s, text: s.text };
      }
      return { ...s };
    });

    const snapshot = JSON.stringify(serializable);

    this.history = this.history.slice(0, this.historyIndex + 1);

    this.history.push(snapshot);

    if (this.history.length > this.MAX_HISTORY) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  private restore(snapshot: string) {
    const parsed = JSON.parse(snapshot);

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
        case "arrow":
          return new Arrow(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
          );
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
        case "parallelogram":
          return new Parallelogram(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
          );
        case "polygon":
          return new Polygon(
            s.sides,
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
        case "icon":
          return new Icon(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
            s.path,
          );
        case "code":
          const c = new Code(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
          );
          c.text = s.text;
          return c;
        default:
          return new NullShape(0, 0, 0, 0);
      }
    });

    this.drawShapes();
  }

  public undo() {
    if (this.historyIndex <= 0) return;
    this.historyIndex--;
    this.restore(this.history[this.historyIndex]);
  }

  public redo() {
    if (this.historyIndex >= this.history.length - 1) return;
    this.historyIndex++;
    this.restore(this.history[this.historyIndex]);
  }

  public setIconPath(path: string) {
    this.awsIcon = path;
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
      case "icon":
        this.currentShapeClass = Icon;
        break;
      case "code":
        this.currentShapeClass = Code;
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

  private drawRotationHandle(shape: IShape) {
    if (!("startX" in shape)) return;

    const s = shape as any;
    const ctx = this.ctx;

    const minX = Math.min(s.startX, s.endX);
    const minY = Math.min(s.startY, s.endY);
    const maxX = Math.max(s.startX, s.endX);

    const cx = (s.startX + s.endX) / 2;
    const handleY = minY - 30 / this.zoomX;

    ctx.save();
    ctx.fillStyle = "#3b82f6";
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 1 / this.zoomX;

    ctx.beginPath();
    ctx.moveTo(cx, minY);
    ctx.lineTo(cx, handleY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, handleY, 6 / this.zoomX, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawSelectionBox(shape: IShape) {
    const ctx = this.ctx;

    if (
      "startX" in shape &&
      "startY" in shape &&
      "endX" in shape &&
      "endY" in shape
    ) {
      const minX = Math.min(shape.startX, shape.endX);
      const minY = Math.min(shape.startY, shape.endY);
      const maxX = Math.max(shape.startX, shape.endX);
      const maxY = Math.max(shape.startY, shape.endY);

      const w = maxX - minX,
        h = maxY - minY;

      const ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1 / this.zoomX;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(shape.startX, shape.startY, w, h);
      ctx.restore();

      return;
    }

    if (shape.type === "freedraw") {
      const fd = shape as any;
      const xs = fd.points.map((p: any) => p.x);
      const ys = fd.points.map((p: any) => p.y);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const w = Math.max(...xs) - minX;
      const h = Math.max(...ys) - minY;

      ctx.save();
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1 / this.zoomX;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(minX, minY, w, h);
      ctx.restore();
    }
  }

  private getSelectionHandles(shape: IShape) {
    const PAD = 6 / this.zoomX;
    const size = this.handleSize / this.zoomX;

    let minX, minY, width, height;

    if ("startX" in shape) {
      minX = Math.min(shape.startX, shape.endX) - PAD;
      minY = Math.min(shape.startY, shape.endY) - PAD;
      width = Math.abs(shape.endX - shape.startX) + PAD * 2;
      height = Math.abs(shape.endY - shape.startY) + PAD * 2;
    } else {
      return [];
    }

    const x2 = minX + width;
    const y2 = minY + height;
    const cx = minX + width / 2;
    const cy = minY + height / 2;

    return [
      { x: minX, y: minY, cursor: "nwse-resize", corner: "tl" },
      { x: cx, y: minY, cursor: "ns-resize", corner: "tm" },
      { x: x2, y: minY, cursor: "nesw-resize", corner: "tr" },
      { x: minX, y: cy, cursor: "ew-resize", corner: "ml" },
      { x: x2, y: cy, cursor: "ew-resize", corner: "mr" },
      { x: minX, y: y2, cursor: "nesw-resize", corner: "bl" },
      { x: cx, y: y2, cursor: "ns-resize", corner: "bm" },
      { x: x2, y: y2, cursor: "nwse-resize", corner: "br" },
    ].map((h) => ({ ...h, size }));
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
    if (this.selectShape && "startX" in this.selectShape) {
      const s = this.selectShape as any;

      const cx = (s.startX + s.endX) / 2;
      const minY = Math.min(s.startY, s.endY);
      const handleY = minY - 30 / this.zoomX;
      const r = 6 / this.zoomX;

      const dx = x - cx;
      const dy = y - handleY;

      if (dx * dx + dy * dy <= r * r) {
        const centerX = cx;
        const centerY = (s.startY + s.endY) / 2;

        this.rotating = {
          shape: this.selectShape,
          centerX,
          centerY,
          startAngle: Math.atan2(y - centerY, x - centerX),
          initialRotation: s.rotation || 0,
        };

        this.draggingShape = null;
        this.resizing = null;
        this.clicked = true;
        this.canvas.style.cursor = "grabbing";
        return;
      }
    }

    if (this.selectShape) {
      const handles = this.getSelectionHandles(this.selectShape);
      for (const h of handles) {
        const size = h.size;
        if (
          x >= h.x - size / 2 &&
          x <= h.x + size / 2 &&
          y >= h.y - size / 2 &&
          y <= h.y + size / 2
        ) {
          this.resizing = {
            shape: this.selectShape,
            corner: h.corner,
            startX: x,
            startY: y,
            orig: { ...(this.selectShape as any) },
          };
          this.draggingShape = null;
          this.clicked = true;
          this.canvas.style.cursor = h.cursor;
          return;
        }
      }
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
        if (shape.isInside(x, y, this.ctx)) {
          this.draggingShape = shape;
          this.setSelectShape(shape);
          this.dragOffsetX = x;
          this.dragOffsetY = y;
          this.clicked = true;
          if (shape.type === "text") {
            this.selectedTextBox = shape as Text;
            this.selectedTextBox.showCursor = true;
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
    if (this.rotating) {
      this.snapshot();
      this.rotating = null;
      this.clicked = false;
      this.saveShapes();
      this.canvas.style.cursor = "pointer";
      return;
    }

    if (this.resizing) {
      this.snapshot();
      this.resizing = null;
      this.saveShapes();
      this.canvas.style.cursor = "pointer";
      return;
    }

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
        this.awsIcon,
      );
      this.shapes.push(shape);
      this.snapshot();
      this.saveShapes();
    }
    this.saveShapes();
    if (this.draggingShape) {
      this.snapshot();
      this.draggingShape = null;
    }
    this.clicked = false;
    this.currentFreeDraw = null;
    this.drawShapes();
  }

  private handleMouseMove(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const rawX = (e.clientX - rect.left - this.panX) / this.zoomX;
    const rawY = (e.clientY - rect.top - this.panY) / this.zoomY;
    if (this.rotating) {
      const { shape, centerX, centerY, startAngle, initialRotation } =
        this.rotating;

      const angle = Math.atan2(rawY - centerY, rawX - centerX);
      (shape as any).rotation = initialRotation + (angle - startAngle);

      this.drawShapes();
      return;
    }

    if (this.resizing) {
      const { shape, corner, startX, startY, orig } = this.resizing;
      const dx = rawX - startX;
      const dy = rawY - startY;

      const s = shape as any;

      switch (corner) {
        case "tl":
          s.startX = orig.startX + dx;
          s.startY = orig.startY + dy;
          break;
        case "tr":
          s.endX = orig.endX + dx;
          s.startY = orig.startY + dy;
          break;
        case "bl":
          s.startX = orig.startX + dx;
          s.endY = orig.endY + dy;
          break;
        case "br":
          s.endX = orig.endX + dx;
          s.endY = orig.endY + dy;
          break;
        case "tm":
          s.startY = orig.startY + dy;
          break;
        case "bm":
          s.endY = orig.endY + dy;
          break;
        case "ml":
          s.startX = orig.startX + dx;
          break;
        case "mr":
          s.endX = orig.endX + dx;
          break;
      }

      this.drawShapes();
      return;
    }
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
        this.draggingShape.type === "parallelogram" ||
        this.draggingShape.type == "icon"
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
        this.awsIcon,
      );
      previewShape.draw(this.ctx);
      this.ctx.restore();
      return;
    }
    if (this.currentMode === "eraser") {
      let erased = false;
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
          erased = true;
        }
      }
      if (erased) {
        this.snapshot();
        this.saveShapes();
      }
      this.drawShapes();
    }
  }

  private drawResizeHandles(shape: IShape) {
    const ctx = this.ctx;
    const handles = this.getSelectionHandles(shape);

    ctx.save();
    ctx.fillStyle = this.handleColor;

    handles.forEach((h) => {
      ctx.fillRect(h.x - h.size / 2, h.y - h.size / 2, h.size, h.size);
    });

    ctx.restore();
  }

  public drawShapes() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.zoomX, this.zoomY);
    for (const shape of this.shapes) {
      shape.draw(this.ctx);
    }
    if (this.selectShape) {
      this.drawSelectionBox(this.selectShape);
      this.drawResizeHandles(this.selectShape);
      this.drawRotationHandle(this.selectShape);
    }
    this.ctx.restore();
  }

  public getSlug(): string {
    return "";
  }

  public async saveShapes() {
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
    const serializableStr = JSON.stringify(serializable);
    this.download();
    // await prisma.whiteBoard.update({
    //   where: { slug: this.getSlug() },
    //   data: serializableStr,
    // });
  }
  private async loadShapes() {
    // const data = await prisma.whiteBoard.findUnique({
    //   where: { slug: this.getSlug() },
    //   select: { data: true },
    // });
    // if (!data) return;
    // const parsed = JSON.parse(data);
    // this.shapes = parsed.map((s: any) => {
    //   switch (s.type) {
    //     case "rect":
    //       return new Rect(
    //         s.startX,
    //         s.startY,
    //         s.endX,
    //         s.endY,
    //         s.strokeStyle,
    //         s.lineWidth,
    //       );
    //     case "circle":
    //       return new Circle(
    //         s.startX,
    //         s.startY,
    //         s.endX,
    //         s.endY,
    //         s.strokeStyle,
    //         s.lineWidth,
    //       );
    //     case "line":
    //       return new Line(
    //         s.startX,
    //         s.startY,
    //         s.endX,
    //         s.endY,
    //         s.strokeStyle,
    //         s.lineWidth,
    //       );
    //     case "freedraw":
    //       const fd = new FreeDraw(
    //         s.points[0].x,
    //         s.points[0].y,
    //         s.strokeStyle,
    //         s.lineWidth,
    //       );
    //       s.points.slice(1).forEach((p: any) => fd.addPoint(p));
    //       return fd;
    //     case "arrow":
    //       return new Arrow(
    //         s.startX,
    //         s.startY,
    //         s.endX,
    //         s.endY,
    //         s.strokeStyle,
    //         s.lineWidth,
    //       );
    //     case "text":
    //       const t = new Text(
    //         s.startX,
    //         s.startY,
    //         s.endX,
    //         s.endY,
    //         s.strokeStyle,
    //         s.lineWidth,
    //       );
    //       t.text = s.text;
    //       return t;
    //     case "ellipse":
    //       return new Ellipse(
    //         s.startX,
    //         s.startY,
    //         s.endX,
    //         s.endY,
    //         s.strokeStyle,
    //         s.lineWidth,
    //       );
    //     case "triangle":
    //       return new Triangle(
    //         s.startX,
    //         s.startY,
    //         s.endX,
    //         s.endY,
    //         s.strokeStyle,
    //         s.lineWidth,
    //       );
    //     case "pentagon":
    //       return new Polygon(
    //         5,
    //         s.startX,
    //         s.startY,
    //         s.endX,
    //         s.endY,
    //         s.strokeStyle,
    //         s.lineWidth,
    //       );
    //     case "hexagon":
    //       return new Polygon(
    //         6,
    //         s.startX,
    //         s.startY,
    //         s.endX,
    //         s.endY,
    //         s.strokeStyle,
    //         s.lineWidth,
    //       );
    //     case "parallelogram":
    //       return new Parallelogram(
    //         s.startX,
    //         s.startY,
    //         s.endX,
    //         s.endY,
    //         s.strokeStyle,
    //         s.lineWidth,
    //       );
    //     case "icon":
    //       return new Icon(
    //         s.startX,
    //         s.startY,
    //         s.endX,
    //         s.endY,
    //         s.strokeStyle,
    //         s.lineWidth,
    //         s.path,
    //       );
    //     case "code":
    //       return new Code(
    //         s.startX,
    //         s.startY,
    //         s.endX,
    //         s.endY,
    //         s.strokeStyle,
    //         s.lineWidth,
    //         s.text,
    //       );
    //     default:
    //       return new NullShape(0, 0, 0, 0);
    //   }
    // });
    // this.drawShapes();
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
    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        this.undo();
        return;
      }

      if (e.key.toLowerCase() === "y") {
        e.preventDefault();
        this.redo();
        return;
      }
    }

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
    } else if (e.key.length === 1) {
      this.selectedTextBox.addChar(e.key);
    }
    this.drawShapes();
    this.snapshot();
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
