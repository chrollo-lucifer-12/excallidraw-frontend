export type Whiteboard = {
  name: string;
  slug: string;
  image: string | null;
};

export type SpatialItem = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  shape: IShape;
};

export interface IShape {
  type: ShapeMode;
  strokeStyle: string;
  lineWidth: number;
  draw(ctx: CanvasRenderingContext2D): void;
  isInside(x: number, y: number): boolean;
  fill: string;
  opacity: number;
  borderRadius: number;
  getBounds(): { x: number; y: number; w: number; h: number };
  rbushItem?: SpatialItem;
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
