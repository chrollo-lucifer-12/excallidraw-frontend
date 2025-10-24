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
import { CanvasDrawer } from "./draw";
import { Input } from "../ui/input";

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
  { title: "Rectangle", url: "#", icon: Square, name: "rectangle" },
  { title: "Circle", url: "#", icon: Circle, name: "circle" },
  { title: "Line", url: "#", icon: ArrowRight, name: "line" },
  { title: "None", url: "#", icon: Edit, name: "none" },
];

export function AppSidebar({ canvasObject }: { canvasObject: CanvasDrawer }) {
  return (
    <Sidebar variant="floating" className="h-auto">
      <SidebarContent className="h-auto p-2">
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
                      onClick={() => canvasObject?.setMode(item.name)}
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
      </SidebarContent>
      <SidebarFooter>
        <Input
          type="color"
          onChange={(e) => {
            canvasObject.setStyles(e.target.value, canvasObject.lineWidth);
          }}
        />
        <Input
          type="range"
          min={1}
          max={5}
          onChange={(e) => {
            canvasObject.setStyles(canvasObject.strokeStyle, e.target.value);
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
