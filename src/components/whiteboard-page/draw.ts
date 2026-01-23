// @ts-nocheck

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
import { IShape, ShapeMode, SpatialItem, Whiteboard } from "@/lib/types";
import RBush from "rbush";

class NullShape implements IShape {
  type: ShapeMode = "none";
  strokeStyle = "black";
  lineWidth = 1;
  fill = "";
  opacity = 0;
  borderRadius = 0;
  constructor(_sx: number, _sy: number, _ex: number, _ey: number) {}
  isInside(_x: number, _y: number) {
    return false;
  }
  getBounds() {
    return { x: 0, y: 0, w: 0, h: 0 };
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
  public tree: RBush<SpatialItem> | null = null;
  private currentMode: ShapeMode = "none";
  private draggingShape: IShape | null = null;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private ctx: CanvasRenderingContext2D;
  public strokeStyle: string = "#000000";
  public lineWidth: number = 3;
  public fill: string = "black";
  public opacity: number = 0.3;
  public borderRadius: number = 1;
  private selectedTextBox: Text | null = null;
  private shapesToEraser: number[] = [];
  private eraserSize: number = 10;
  private panX = 0;
  private panY = 0;
  private panStartX = 0;
  private panStartY = 0;
  private isPanning: boolean = false;
  public zoomX = 1;
  public zoomY = 1;
  public selectShape: IShape | null = null;
  public onStrokeChanged?: (s: string) => void;
  public onFillChanged?: (s: string) => void;
  public onWidthChanged?: (w: number) => void;
  public onOpacityChanged?: (o: number) => void;
  public onCurrentModeChanged?: (shape: ShapeMode) => void;
  private awsIcon: string | null = null;
  private readonly handleSize = 8; // px
  private readonly handleColor = "#3b82f6";
  private redrawQueued = false;
  private previewShape: IShape | null = null;
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
  private clipboard: IShape | null = null;
  private lastSaveTime = 0;
  private SAVE_INTERVAL = 8000;
  private isSaving = false;

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
    this.tree = new RBush<SpatialItem>();
    this.selectShape = null;
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("wheel", this.handleWheel, { passive: false });
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keydown", this.handleKeyDown);
  }

  private queueDraw() {
    if (this.redrawQueued) return;

    this.redrawQueued = true;

    requestAnimationFrame(() => {
      this.drawShapes();
      this.redrawQueued = false;
    });
  }

  insertShape(shape: IShape) {
    if (shape.getBounds) {
      const b = shape.getBounds();

      const item: SpatialItem = {
        minX: b.x,
        minY: b.y,
        maxX: b.x + b.w,
        maxY: b.y + b.h,
        shape,
      };
      shape.rbushItem = item;
      this.tree?.insert(item);
    }
  }

  updateShapeInTree(shape: IShape) {
    if (!shape.rbushItem) return;

    this.tree?.remove(shape.rbushItem, (a, b) => a.shape === b.shape);

    const b = shape.getBounds();
    const item: SpatialItem = {
      minX: b.x,
      minY: b.y,
      maxX: b.x + b.w,
      maxY: b.y + b.h,
      shape,
    };
    shape.rbushItem = item;
    this.tree?.insert(item);
  }

  copySelectedShape() {
    if (!this.selectShape) return;

    this.clipboard = { ...this.selectShape };
  }

  pasteClipboardShape() {
    if (!this.clipboard) return;

    const s = this.clipboard;

    let shape: IShape | null = null;

    switch (s.type) {
      case "rect":
        shape = new Rect(
          s.startX + 20,
          s.startY + 20,
          s.endX + 20,
          s.endY + 20,
          s.strokeStyle,
          s.lineWidth,
          s.fill,
          s.opacity,
          s.borderRadius,
        );
        break;

      case "circle":
        shape = new Circle(
          s.startX + 20,
          s.startY + 20,
          s.endX + 20,
          s.endY + 20,
          s.strokeStyle,
          s.lineWidth,

          s.fill,
          s.opacity,
          s.borderRadius,
        );
        break;

      case "line":
        shape = new Line(
          s.startX + 20,
          s.startY + 20,
          s.endX + 20,
          s.endY + 20,
          s.strokeStyle,
          s.lineWidth,

          s.fill,
          s.opacity,
          s.borderRadius,
        );
        break;

      case "arrow":
        shape = new Arrow(
          s.startX + 20,
          s.startY + 20,
          s.endX + 20,
          s.endY + 20,
          s.strokeStyle,
          s.lineWidth,
          s.fill,
          s.opacity,
          s.borderRadius,
        );
        break;

      case "freedraw":
        const fd = new FreeDraw(
          s.points[0].x + 20,
          s.points[0].y + 20,
          s.strokeStyle,
          s.lineWidth,
          s.opacity,
        );
        s.points
          .slice(1)
          .forEach((p: any) => fd.addPoint({ x: p.x + 20, y: p.y + 20 }));
        shape = fd;
        break;

      case "text":
        const t = new Text(
          s.startX + 20,
          s.startY + 20,
          s.endX + 20,
          s.endY + 20,
          s.strokeStyle,
          s.lineWidth,
        );
        t.text = s.text;
        shape = t;
        break;

      case "ellipse":
        shape = new Ellipse(
          s.startX + 20,
          s.startY + 20,
          s.endX + 20,
          s.endY + 20,
          s.strokeStyle,
          s.lineWidth,
          s.fill,
          s.opacity,
          s.borderRadius,
        );
        break;

      case "triangle":
        shape = new Triangle(
          s.startX + 20,
          s.startY + 20,
          s.endX + 20,
          s.endY + 20,
          s.strokeStyle,
          s.lineWidth,

          s.fill,
          s.opacity,
          s.borderRadius,
        );
        break;

      case "pentagon":
        shape = new Polygon(
          5,
          s.startX + 20,
          s.startY + 20,
          s.endX + 20,
          s.endY + 20,
          s.strokeStyle,
          s.lineWidth,
          s.fill,
          s.opacity,
          s.borderRadius,
        );
        break;

      case "hexagon":
        shape = new Polygon(
          6,
          s.startX + 20,
          s.startY + 20,
          s.endX + 20,
          s.endY + 20,
          s.strokeStyle,
          s.lineWidth,
          s.fill,
          s.opacity,
          s.borderRadius,
        );
        break;

      case "parallelogram":
        shape = new Parallelogram(
          s.startX + 20,
          s.startY + 20,
          s.endX + 20,
          s.endY + 20,
          s.strokeStyle,
          s.lineWidth,
          s.fill,
          s.opacity,
          s.borderRadius,
        );
        break;

      case "icon":
        shape = new Icon(
          s.startX + 20,
          s.startY + 20,
          s.endX + 20,
          s.endY + 20,
          s.strokeStyle,
          s.lineWidth,
          s.path,
        );
        break;

      case "code":
        const c = new Code(
          s.startX + 20,
          s.startY + 20,
          s.endX + 20,
          s.endY + 20,
          s.strokeStyle,
          s.lineWidth,
          s.text,
        );
        shape = c;
        break;

      default:
        return;
    }

    this.shapes.push(shape);
    this.setSelectShape(shape);
    this.queueDraw();
    this.saveShapes();
  }

  public async saveCanvasImage() {
    const now = Date.now();

    if (now - this.lastSaveTime < this.SAVE_INTERVAL || this.isSaving) {
      return;
    }
    this.isSaving = true;
    this.lastSaveTime = now;
    const srcCanvas = this.canvas;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = srcCanvas.width;
    exportCanvas.height = srcCanvas.height;

    const exportCtx = exportCanvas.getContext("2d");
    if (!exportCtx) return;

    exportCtx.fillStyle = "#ffffff";
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    exportCtx.drawImage(srcCanvas, 0, 0);

    try {
      const blob: Blob | null = await new Promise((resolve) =>
        exportCanvas.toBlob(resolve, "image/webp", 0.95),
      );

      if (!blob) return;

      const formData = new FormData();
      formData.append("file", blob, "whiteboard.webp");
      formData.append("slug", this.getSlug());

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("Upload failed");
        return;
      }

      const data = await res.json();
      console.log("Whiteboard saved:", data.url);

      return data.url;
    } catch (err) {
      console.log(err);
    } finally {
      this.isSaving = false;
    }
  }

  private snapshot() {
    const serializable = this.shapes.map((s: any) => {
      if (s.type === "freedraw") {
        return { ...s, points: s.points };
      }
      if (s.type === "text" || s.type === "code") {
        return { ...s, text: s.text };
      }
      const { rbushItem, ...rest } = s;
      return rest;
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
            s.fill,
            s.opacity,
            s.borderRadius,
          );
        case "circle":
          return new Circle(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
            s.fill,
            s.opacity,
            s.borderRadius,
          );
        case "line":
          return new Line(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
            s.fill,
            s.opacity,
            s.borderRadius,
          );
        case "arrow":
          return new Arrow(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
            s.fill,
            s.opacity,
            s.borderRadius,
          );
        case "ellipse":
          return new Ellipse(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
            s.fill,
            s.opacity,
            s.borderRadius,
          );
        case "triangle":
          return new Triangle(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
            s.fill,
            s.opacity,
            s.borderRadius,
          );
        case "parallelogram":
          return new Parallelogram(
            s.startX,
            s.startY,
            s.endX,
            s.endY,
            s.strokeStyle,
            s.lineWidth,
            s.fill,
            s.opacity,
            s.borderRadius,
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
            s.fill,
            s.opacity,
            s.borderRadius,
          );
        case "freedraw":
          const fd = new FreeDraw(
            s.points[0].x,
            s.points[0].y,
            s.strokeStyle,
            s.lineWidth,
            s.opacity,
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

    this.tree?.clear();
    this.shapes.forEach((s) => this.insertShape(s));

    this.queueDraw();
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
  }
  public setLineWidth(w: number) {
    if (this.selectShape) {
      this.selectShape.lineWidth = w;
      this.saveShapes();
      this.queueDraw();
    }
    if (this.onWidthChanged) {
      this.onWidthChanged(w);
    }
    this.lineWidth = w;
  }
  public setStrokeStyle(color: string) {
    if (this.selectShape) {
      this.selectShape.strokeStyle = color;
      this.saveShapes();
      this.queueDraw();
    }
    if (this.onStrokeChanged) {
      this.onStrokeChanged(color);
    }
    this.strokeStyle = color;
  }
  public setfill(color: string) {
    if (this.selectShape) {
      this.selectShape.fill = color;
      this.saveShapes();
      this.queueDraw();
    }
    if (this.onFillChanged) {
      this.onFillChanged(color);
    }
    this.fill = color;
  }
  public setOpacity(opacity: number) {
    if (this.selectShape) {
      this.selectShape.opacity = opacity;
      this.saveShapes();
      this.queueDraw();
    }
    if (this.onOpacityChanged) {
      this.onOpacityChanged(opacity);
    }
    this.opacity = opacity;
  }
  public setBorderRadius(radius: number) {
    if (this.selectShape) {
      this.selectShape.borderRadius = radius;
      this.saveShapes();
      this.queueDraw();
    }
  }
  public setZoom(x: number, y: number) {
    this.zoomX = x;
    this.zoomY = y;
    this.queueDraw();
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
            fill: string,
            opacity: number,
            borderRadius: number,
          ) {
            super(5, sx, sy, ex, ey, stroke, lw, fill, opacity, borderRadius);
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
            fill: string,
            opacity: number,
            borderRadius: number,
          ) {
            super(6, sx, sy, ex, ey, stroke, lw, fill, opacity, borderRadius);
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
    if (this.onCurrentModeChanged) this.onCurrentModeChanged(mode);
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

    if (e.button === 2) {
      this.isPanning = true;
      this.panStartX = e.clientX - this.panX;
      this.panStartY = e.clientY - this.panY;
      this.canvas.style.cursor = "grabbing";
      return;
    }

    if (this.currentMode === "none") {
      console.log("mode is none");
      let foundShape = false;
      const candidates = this.tree?.search({
        minX: x,
        minY: y,
        maxX: x,
        maxY: y,
      });
      console.log(candidates);
      if (candidates) {
        for (let i = candidates.length - 1; i >= 0; i--) {
          const shape = candidates[i].shape;
          if (shape.isInside(x, y)) {
            this.draggingShape = shape;
            this.setSelectShape(shape);
            this.dragOffsetX = x;
            this.dragOffsetY = y;
            this.clicked = true;
            this.canvas.style.cursor = "move";

            if (shape.type === "text") {
              this.selectedTextBox = shape as Text;
              this.selectedTextBox.showCursor = true;
            }
            foundShape = true;
            break;
          }
        }
      }

      if (!foundShape) {
        this.setSelectShape(null);
        this.selectedTextBox = null;
        this.queueDraw();
      }
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

      if (this.selectShape.isInside(x, y, this.ctx)) {
        this.draggingShape = this.selectShape;
        this.dragOffsetX = x;
        this.dragOffsetY = y;
        this.clicked = true;
        this.canvas.style.cursor = "move";
        if (this.selectShape.type === "text") {
          this.selectedTextBox = this.selectShape as Text;
          this.selectedTextBox.showCursor = true;
        }
        return;
      }
    }

    if (this.currentMode === "text") {
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
      this.setSelectShape(textBox);
      this.snapshot();
      this.saveShapes();
      this.queueDraw();
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
          this.opacity,
        );
        this.shapes.push(this.currentFreeDraw);
      }
      return;
    }
  }

  private handleMouseUp(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const endX = (e.clientX - rect.left - this.panX) / this.zoomX;
    const endY = (e.clientY - rect.top - this.panY) / this.zoomY;
    this.previewShape = null;

    if (this.draggingShape) {
      this.snapshot();
      this.draggingShape = null;
      this.selectShape = null;
      this.canvas.style.cursor = "pointer";
    }
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
      this.canvas.style.cursor = "pointer";
      return;
    }
    if (!this.clicked) return;
    if (this.currentMode !== "freedraw" && this.currentMode !== "none") {
      let shape;

      if (this.currentMode === "icon") {
        shape = new this.currentShapeClass(
          this.startX,
          this.startY,
          endX,
          endY,
          this.strokeStyle,
          this.lineWidth,
          this.awsIcon,
        );
      } else {
        shape = new this.currentShapeClass(
          this.startX,
          this.startY,
          endX,
          endY,
          this.strokeStyle,
          this.lineWidth,
          this.fill,
          this.opacity,
          this.borderRadius,
        );
      }
      this.shapes.push(shape);
      this.snapshot();
      this.saveShapes();
    }
    this.saveShapes();

    this.clicked = false;
    this.currentFreeDraw = null;
    this.queueDraw();
  }

  private handleMouseMove(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.panX) / this.zoomX;
    const y = (e.clientY - rect.top - this.panY) / this.zoomY;

    if (!this.clicked && !this.isPanning && this.currentMode === "none") {
      let cursorSet = false;

      if (this.selectShape && "startX" in this.selectShape) {
        const s = this.selectShape as any;
        const cx = (s.startX + s.endX) / 2;
        const minY = Math.min(s.startY, s.endY);
        const handleY = minY - 30 / this.zoomX;
        const r = 6 / this.zoomX;
        const dx = x - cx;
        const dy = y - handleY;

        if (dx * dx + dy * dy <= r * r) {
          this.canvas.style.cursor = "grab";
          cursorSet = true;
        }
      }

      if (!cursorSet && this.selectShape) {
        const handles = this.getSelectionHandles(this.selectShape);
        for (const h of handles) {
          const size = h.size;
          if (
            x >= h.x - size / 2 &&
            x <= h.x + size / 2 &&
            y >= h.y - size / 2 &&
            y <= h.y + size / 2
          ) {
            this.canvas.style.cursor = h.cursor;
            cursorSet = true;
            break;
          }
        }
      }

      if (!cursorSet && this.selectShape?.isInside(x, y, this.ctx)) {
        this.canvas.style.cursor = "move";
        cursorSet = true;
      }

      if (!cursorSet) {
        for (let i = this.shapes.length - 1; i >= 0; i--) {
          if (this.shapes[i].isInside(x, y, this.ctx)) {
            this.canvas.style.cursor = "pointer";
            cursorSet = true;
            break;
          }
        }
      }

      if (!cursorSet) {
        this.canvas.style.cursor = "default";
      }
    }

    if (this.rotating) {
      const { shape, centerX, centerY, startAngle, initialRotation } =
        this.rotating;
      const angle = Math.atan2(y - centerY, x - centerX);
      (shape as any).rotation = initialRotation + (angle - startAngle);
      this.updateShapeInTree(shape);
      this.queueDraw();
      return;
    }

    if (this.resizing) {
      const { shape, corner, startX, startY, orig } = this.resizing;
      const dx = x - startX;
      const dy = y - startY;
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
      this.updateShapeInTree(shape);
      this.queueDraw();
      return;
    }

    if (this.isPanning) {
      this.panX = e.clientX - this.panStartX;
      this.panY = e.clientY - this.panStartY;
      this.queueDraw();
      return;
    }

    if (!this.clicked) return;

    if (this.draggingShape && this.currentMode !== "eraser") {
      const dx = x - this.dragOffsetX;
      const dy = y - this.dragOffsetY;

      if (this.draggingShape.type === "freedraw") {
        const fd = this.draggingShape as FreeDraw;
        fd.points = fd.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
      } else if ("startX" in this.draggingShape) {
        (this.draggingShape as any).startX += dx;
        (this.draggingShape as any).startY += dy;
        (this.draggingShape as any).endX += dx;
        (this.draggingShape as any).endY += dy;
      }

      this.dragOffsetX = x;
      this.dragOffsetY = y;
      this.updateShapeInTree(this.draggingShape);
      this.queueDraw();
      return;
    }

    if (this.currentMode === "freedraw" && this.currentFreeDraw) {
      this.currentFreeDraw.addPoint({ x, y });
      this.queueDraw();
      return;
    }

    if (this.currentMode !== "none" && this.currentMode !== "eraser") {
      const previewShape = new this.currentShapeClass(
        this.startX,
        this.startY,
        x,
        y,
        this.strokeStyle,
        this.lineWidth,
        this.currentMode === "icon" ? this.awsIcon : this.fill,
        this.opacity,
        this.borderRadius,
      );

      this.previewShape = previewShape;
      this.queueDraw();
      return;
    }

    if (this.currentMode === "eraser") {
      let erased = false;
      for (let i = this.shapes.length - 1; i >= 0; i--) {
        const shape = this.shapes[i];
        const inEraser =
          shape.isInside(x, y, this.ctx) ||
          (shape.type === "freedraw" &&
            (shape as FreeDraw).points.some(
              (p) =>
                Math.abs(p.x - x) <= this.eraserSize &&
                Math.abs(p.y - y) <= this.eraserSize,
            ));

        if (inEraser) {
          this.tree?.remove(shape.rbushItem!, (a, b) => a.shape === b.shape);
          this.shapes.splice(i, 1);
          erased = true;
        }
      }

      if (erased) {
        this.snapshot();
        this.saveShapes();
      }
      this.queueDraw();
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

    if (this.previewShape) {
      this.previewShape.draw(this.ctx);
    }

    if (this.selectShape) {
      this.drawSelectionBox(this.selectShape);
      this.drawResizeHandles(this.selectShape);
      this.drawRotationHandle(this.selectShape);
    }
    this.ctx.restore();
  }

  public getSlug(): string {
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
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
      const { rbushItem, ...rest } = s as any;
      return rest;
    });

    await fetch(`/api/boards/${this.getSlug()}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serializable),
    });

    this.saveCanvasImage();
  }
  private async loadShapes() {
    const slug = this.getSlug();

    try {
      const res = await fetch(`/api/boards/${slug}`);
      const parsed = await res.json();
      let shapesFromDB = JSON.parse(parsed);

      this.shapes = shapesFromDB.map((s: any) => {
        switch (s.type) {
          case "rect":
            return new Rect(
              s.startX,
              s.startY,
              s.endX,
              s.endY,
              s.strokeStyle,
              s.lineWidth,
              s.fill,
              s.opacity,
              s.borderRadius,
            );
          case "circle":
            return new Circle(
              s.startX,
              s.startY,
              s.endX,
              s.endY,
              s.strokeStyle,
              s.lineWidth,
              s.fill,
              s.opacity,
              s.borderRadius,
            );
          case "line":
            return new Line(
              s.startX,
              s.startY,
              s.endX,
              s.endY,
              s.strokeStyle,
              s.lineWidth,
              s.fill,
              s.opacity,
              s.borderRadius,
            );
          case "arrow":
            return new Arrow(
              s.startX,
              s.startY,
              s.endX,
              s.endY,
              s.strokeStyle,
              s.lineWidth,
              s.fill,
              s.opacity,
              s.borderRadius,
            );
          case "ellipse":
            return new Ellipse(
              s.startX,
              s.startY,
              s.endX,
              s.endY,
              s.strokeStyle,
              s.lineWidth,
              s.fill,
              s.opacity,
              s.borderRadius,
            );
          case "triangle":
            return new Triangle(
              s.startX,
              s.startY,
              s.endX,
              s.endY,
              s.strokeStyle,
              s.lineWidth,
              s.fill,
              s.opacity,
              s.borderRadius,
            );
          case "parallelogram":
            return new Parallelogram(
              s.startX,
              s.startY,
              s.endX,
              s.endY,
              s.strokeStyle,
              s.lineWidth,
              s.fill,
              s.opacity,
              s.borderRadius,
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
              s.fill,
              s.opacity,
              s.borderRadius,
            );
          case "freedraw":
            const fd = new FreeDraw(
              s.points[0].x,
              s.points[0].y,
              s.strokeStyle,
              s.lineWidth,

              s.opacity,
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

      this.tree?.clear();
      this.shapes.forEach((s) => this.insertShape(s));
      console.log("all shapes", this.tree?.all());
    } catch (err) {
      console.log(err);
    }

    this.queueDraw();
  }
  public resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth || window.innerWidth;
    this.canvas.height = this.canvas.offsetHeight || window.innerHeight;
    this.queueDraw();
  }
  private handleResize() {
    this.resizeCanvas();
  }
  private handleKeyDown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
      e.preventDefault();
      this.copySelectedShape();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
      e.preventDefault();
      this.pasteClipboardShape();
      return;
    }

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
      this.queueDraw();
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
      this.queueDraw();
      return;
    }
    if (!this.selectedTextBox) return;
    if (e.key === "Backspace") {
      this.selectedTextBox.removeChar();
    } else if (e.key.length === 1) {
      this.selectedTextBox.addChar(e.key);
    }
    this.queueDraw();
    this.snapshot();
    this.saveShapes();
  }
  private handleWheel(e: WheelEvent) {
    e.preventDefault();

    const zoomIntensity = 0.0015;
    const zoomFactor = 1 - e.deltaY * zoomIntensity;

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - this.panX) / this.zoomX;
    const worldY = (mouseY - this.panY) / this.zoomY;

    this.zoomX *= zoomFactor;
    this.zoomY *= zoomFactor;

    this.zoomX = Math.min(Math.max(this.zoomX, 0.1), 5);
    this.zoomY = Math.min(Math.max(this.zoomY, 0.1), 5);

    this.panX = mouseX - worldX * this.zoomX;
    this.panY = mouseY - worldY * this.zoomY;

    this.queueDraw();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("wheel", this.handleWheel);
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("keydown", this.handleKeyDown);
  }
}
