import { IShape } from "@/lib/types";
import { CanvasDrawer } from "./draw";

import { Card, CardContent } from "../ui/card";
import ColorPicker from "./color-picker";
import { fillColors, strokeColors } from "@/lib/utils";
import WidthSelector from "./width-selector";
import OpacitySelector from "./opacity-selector";
import ZoomControls from "./zoom-controls";

const StyleSelector = ({
  canvasObject,
  selectedShape,
}: {
  canvasObject: CanvasDrawer;
  selectedShape: IShape | null;
}) => {
  const handleStrokeStyle = (color: string) => {
    canvasObject.setStrokeStyle(color);
    canvasObject.saveShapes();
    canvasObject.drawShapes();
  };

  const handleFillColor = (color: string) => {
    if (selectedShape) selectedShape.fill = color;
    canvasObject.setfill(color);
    canvasObject.saveShapes();
    canvasObject.drawShapes();
  };

  const handleOpacity = (opacity: number) => {
    if (selectedShape) selectedShape.opacity = opacity;
    canvasObject.setOpacity(opacity);
    canvasObject.saveShapes();
    canvasObject.drawShapes();
  };

  const handleLineWidth = (width: number) => {
    if (selectedShape) selectedShape.lineWidth = width;
    canvasObject.setLineWidth(width);
    canvasObject.saveShapes();
    canvasObject.drawShapes();
  };

  return (
    <Card className="">
      <CardContent className="flex flex-col gap-2">
        <ColorPicker
          title="Stroke"
          onChangeColor={handleStrokeStyle}
          defaultColors={strokeColors}
        />
        <ColorPicker
          title="Fill"
          onChangeColor={handleFillColor}
          defaultColors={fillColors}
        />
        <WidthSelector onWidthChange={handleLineWidth} />
        <OpacitySelector onOpacityChange={handleOpacity} />
        {/*<ZoomControls />*/}
      </CardContent>
    </Card>
  );
};

export default StyleSelector;
