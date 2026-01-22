import { IShape, ShapeMode } from "../draw";

export class Code implements IShape {
  type: ShapeMode = "code";
  public pre: HTMLPreElement;
  public code: HTMLElement;
  public text: string;
  private isDragging = false;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private isResizing = false;
  private width: number;
  private height: number;
  private minWidth = 200;
  private minHeight = 100;

  constructor(
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number,
    public strokeStyle: string,
    public lineWidth: number,
    public fill: string,
    public opacity: number,
    public borderRadius: number,
    text: string,
  ) {
    this.text = text || "// Write your code here";
    this.width = Math.abs(endX - startX) || 300;
    this.height = Math.abs(endY - startY) || 150;
    this.pre = document.createElement("pre");
    this.code = document.createElement("code");
    this.setupElement();
    this.setupDragAndResize();
  }

  private setupElement() {
    this.code.contentEditable = "true";
    this.code.spellcheck = false;
    this.code.textContent = this.text;

    // Style the pre container
    this.pre.style.position = "absolute";
    this.pre.style.left = this.startX + "px";
    this.pre.style.top = this.startY + "px";
    this.pre.style.width = this.width + "px";
    this.pre.style.height = this.height + "px";
    this.pre.style.border = `2px solid ${this.strokeStyle}`;
    this.pre.style.borderRadius = "4px";
    this.pre.style.padding = "8px";
    this.pre.style.background = "#1e1e1e";
    this.pre.style.color = "#d4d4d4";
    this.pre.style.fontFamily = "'Fira Code', 'Consolas', 'Monaco', monospace";
    this.pre.style.fontSize = "14px";
    this.pre.style.overflow = "auto";
    this.pre.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
    this.pre.style.cursor = "move";
    this.pre.style.userSelect = "none";
    this.pre.style.resize = "both";

    // Style the code element
    this.code.style.outline = "none";
    this.code.style.display = "block";
    this.code.style.minHeight = "100%";
    this.code.style.whiteSpace = "pre";
    this.code.style.userSelect = "text";

    this.pre.appendChild(this.code);
  }

  private setupDragAndResize() {
    // Drag functionality
    this.pre.addEventListener("mousedown", (e: MouseEvent) => {
      // Only drag if clicking on the pre element, not the code
      if (e.target === this.pre) {
        this.isDragging = true;
        this.dragOffsetX = e.clientX - this.startX;
        this.dragOffsetY = e.clientY - this.startY;
        this.pre.style.cursor = "grabbing";
        e.preventDefault();
      }
    });

    document.addEventListener("mousemove", (e: MouseEvent) => {
      if (this.isDragging) {
        this.startX = e.clientX - this.dragOffsetX;
        this.startY = e.clientY - this.dragOffsetY;
        this.pre.style.left = this.startX + "px";
        this.pre.style.top = this.startY + "px";

        // Update end coordinates
        this.endX = this.startX + this.width;
        this.endY = this.startY + this.height;
      }
    });

    document.addEventListener("mouseup", () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.pre.style.cursor = "move";
      }
    });

    // Handle content changes
    this.code.addEventListener("input", () => {
      this.text = this.code.textContent || "";
    });

    // Prevent dragging when editing code
    this.code.addEventListener("mousedown", (e: MouseEvent) => {
      e.stopPropagation();
    });

    // Handle resize observer for manual resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.width = entry.contentRect.width;
        this.height = entry.contentRect.height;
        this.endX = this.startX + this.width;
        this.endY = this.startY + this.height;
      }
    });
    resizeObserver.observe(this.pre);
  }

  isInside(x: number, y: number) {
    if (!this.pre) return false;
    const rect = this.pre.getBoundingClientRect();
    const canvasRect = this.pre.parentElement!.getBoundingClientRect();
    const relX = x + canvasRect.left;
    const relY = y + canvasRect.top;
    return (
      relX >= rect.left &&
      relX <= rect.right &&
      relY >= rect.top &&
      relY <= rect.bottom
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Only append if not already in DOM
    if (!this.pre.parentElement) {
      ctx.canvas.parentElement!.appendChild(this.pre);
    }
  }

  // Cleanup method to remove element from DOM
  destroy() {
    if (this.pre && this.pre.parentElement) {
      this.pre.parentElement.removeChild(this.pre);
    }
  }

  // Update position
  updatePosition(x: number, y: number) {
    this.startX = x;
    this.startY = y;
    this.endX = x + this.width;
    this.endY = y + this.height;
    this.pre.style.left = x + "px";
    this.pre.style.top = y + "px";
  }

  // Update size
  updateSize(width: number, height: number) {
    this.width = Math.max(width, this.minWidth);
    this.height = Math.max(height, this.minHeight);
    this.pre.style.width = this.width + "px";
    this.pre.style.height = this.height + "px";
    this.endX = this.startX + this.width;
    this.endY = this.startY + this.height;
  }

  // Get text content
  getText() {
    return this.code.textContent || "";
  }

  // Set text content
  setText(text: string) {
    this.text = text;
    this.code.textContent = text;
  }

  // Focus on code editor
  focus() {
    this.code.focus();
  }
}
