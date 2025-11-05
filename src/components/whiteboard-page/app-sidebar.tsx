import {
  Circle,
  Square,
  Triangle,
  Hexagon,
  Star,
  ArrowRight,
  Edit,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CanvasDrawer, IShape, ShapeMode } from "./draw";
import { Input } from "../ui/input";
import { useState } from "react";
const shapeItems = [
  { title: "Eraser", url: "#", icon: Edit, name: "eraser" },
  { title: "Parallelogram", url: "#", icon: Square, name: "parallelogram" },
  { title: "Polygon", url: "#", icon: Star, name: "polygon" },
  { title: "Hexagon", url: "#", icon: Hexagon, name: "hexagon" },
  { title: "Pentagon", url: "#", icon: Star, name: "pentagon" },
  { title: "Triangle", url: "#", icon: Triangle, name: "triangle" },
  { title: "Ellipse", url: "#", icon: Circle, name: "ellipse" },
  { title: "Text", url: "#", icon: Edit, name: "text" },
  { title: "Arrow", url: "#", icon: ArrowRight, name: "arrow" },
  { title: "Free Draw", url: "#", icon: Edit, name: "freedraw" },
  { title: "Rectangle", url: "#", icon: Square, name: "rect" },
  { title: "Circle", url: "#", icon: Circle, name: "circle" },
  { title: "Line", url: "#", icon: ArrowRight, name: "line" },
  { title: "None", url: "#", icon: Edit, name: "none" },
];

export function AppSidebar({
  canvasObject,
  selectedShape,
}: {
  canvasObject: CanvasDrawer;
  selectedShape: IShape | null;
}) {
  const [selectedShapeColor, setSelectedShapeColor] = useState<string>(
    selectedShape?.strokeStyle!,
  );
  const [selectedShapeWidth, setSelectedShapeWidth] = useState<number>(
    selectedShape?.lineWidth!,
  );
  const [globalShapeColor, setGlobalShapeColor] = useState<string>(
    canvasObject?.strokeStyle,
  );
  const [globalShapeWidth, setGlobalShapeWidth] = useState<number>(
    canvasObject?.lineWidth,
  );

  return (
    <Sidebar variant="floating" className="h-auto">
      <SidebarContent className="h-auto p-2">
        {!selectedShape ? (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm">Shapes</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {shapeItems.map((item) => (
                  <SidebarMenuItem key={item.title} className="p-1">
                    <SidebarMenuButton asChild>
                      <button
                        key={item.name}
                        className="flex items-center gap-2 text-sm w-full text-left hover:bg-gray-100 rounded px-1 py-1"
                        onClick={() =>
                          canvasObject?.setMode(item.name as ShapeMode)
                        }
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <Input
              type="color"
              value={selectedShapeColor}
              onChange={(e) => {
                console.log(e.target.value);
                setSelectedShapeColor(e.target.value);
                selectedShape.strokeStyle = e.target.value;
                canvasObject.saveShapes();
                canvasObject.drawShapes();
              }}
            />
            <Input
              type="range"
              min={1}
              max={5}
              value={selectedShapeWidth}
              onChange={(e) => {
                setSelectedShapeWidth(parseInt(e.target.value));
                selectedShape.lineWidth = parseInt(e.target.value);
                canvasObject.saveShapes();
                canvasObject.drawShapes();
              }}
            />
          </SidebarGroup>
        )}
      </SidebarContent>
      {canvasObject && !selectedShape && (
        <SidebarFooter>
          <Input
            type="color"
            value={globalShapeColor}
            onChange={(e) => {
              setGlobalShapeColor(e.target.value);
              canvasObject.setStyles(e.target.value, canvasObject.lineWidth);
            }}
          />
          <Input
            type="range"
            min={1}
            max={5}
            value={globalShapeWidth}
            onChange={(e) => {
              setGlobalShapeWidth(parseInt(e.target.value));
              canvasObject.setStyles(
                canvasObject.strokeStyle,
                parseInt(e.target.value),
              );
            }}
          />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
