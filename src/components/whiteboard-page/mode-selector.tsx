import {
  Circle,
  Square,
  Triangle,
  Hexagon,
  Star,
  ArrowRight,
  Edit,
  Code,
  MousePointer,
  Eraser,
  Text,
  Cable,
} from "lucide-react";

import { Card } from "../ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import Image from "next/image";
import { ShapeMode } from "@/lib/types";

const shapeItems = [
  { title: "Eraser", icon: Eraser, name: "eraser" },
  { title: "Parallelogram", icon: Square, name: "parallelogram" },
  { title: "Polygon", icon: Star, name: "polygon" },
  { title: "Hexagon", icon: Hexagon, name: "hexagon" },
  { title: "Pentagon", icon: Star, name: "pentagon" },
  { title: "Triangle", icon: Triangle, name: "triangle" },
  { title: "Ellipse", icon: Circle, name: "ellipse" },
  { title: "Text", icon: Text, name: "text" },
  { title: "Arrow", icon: ArrowRight, name: "arrow" },
  { title: "Free Draw", icon: Edit, name: "freedraw" },
  { title: "Rectangle", icon: Square, name: "rect" },
  { title: "Circle", icon: Circle, name: "circle" },
  { title: "Line", icon: ArrowRight, name: "line" },
  { title: "None", icon: MousePointer, name: "none" },
];

const icons = [
  { name: "/icons/api-gateway.svg" },
  { name: "/icons/cloudfront.svg" },
  { name: "/icons/dee-learning-containers.svg" },
  { name: "/icons/documentdb.svg" },
  { name: "/icons/dynamodb.svg" },
  { name: "/icons/ec2.svg" },
  { name: "/icons/elastic-transcoder.svg" },
  { name: "/icons/lambda.svg" },
  { name: "/icons/s3.svg" },
  { name: "/icons/sns.svg" },
  { name: "/icons/sqs.svg" },
];

interface Props {
  canvasObject: any;
}

const ModeSelector = ({ canvasObject }: Props) => {
  return (
    <Card className="p-2">
      <div className="space-y-2">
        <div className="flex ">
          {shapeItems.map((item) => (
            <button
              key={item.name}
              className="flex items-center justify-center gap-2 rounded p-2 hover:bg-gray-100"
              onClick={() => canvasObject?.setMode(item.name as ShapeMode)}
            >
              <item.icon className="w-4 h-4" />
            </button>
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Cable className="w-4 h-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent side="top" className="w-64">
              <div className="grid grid-cols-4 gap-2">
                {icons.map((icon) => (
                  <Button
                    key={icon.name}
                    variant="ghost"
                    className="p-1"
                    onClick={() => {
                      canvasObject?.setMode("icon");
                      canvasObject?.setIconPath(icon.name);
                    }}
                  >
                    <Image
                      src={icon.name}
                      alt={icon.name}
                      width={24}
                      height={24}
                    />
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Card>
  );
};

export default ModeSelector;
