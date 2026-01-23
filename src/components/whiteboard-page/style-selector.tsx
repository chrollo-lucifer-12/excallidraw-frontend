import { IShape } from "@/lib/types";
import { CanvasDrawer } from "./draw";

import { Card, CardContent } from "../ui/card";
import ColorPicker from "./color-picker";
import { fillColors, strokeColors } from "@/lib/utils";
import WidthSelector from "./width-selector";
import OpacitySelector from "./opacity-selector";
import { useEffect, useState } from "react";

const StyleSelector = ({ canvasObject }: { canvasObject: CanvasDrawer }) => {
  const [stroke, setStroke] = useState<string>("");
  const [fill, setFill] = useState<string>("");
  const [width, setWidth] = useState<number>(1);
  const [opacity, setOpacity] = useState<number>(1);
  useEffect(() => {
    if (!canvasObject) return;

    canvasObject.onStrokeChanged = setStroke;
    canvasObject.onFillChanged = setFill;
    canvasObject.onWidthChanged = setWidth;
    canvasObject.onOpacityChanged = setOpacity;

    return () => {
      canvasObject.onStrokeChanged = undefined;
      canvasObject.onFillChanged = undefined;
      canvasObject.onWidthChanged = undefined;
      canvasObject.onOpacityChanged = undefined;
    };
  }, [canvasObject]);

  const handleStrokeStyle = (color: string) => {
    canvasObject.setStrokeStyle(color);
    canvasObject.saveShapes();
    canvasObject.drawShapes();
  };

  const handleFillColor = (color: string) => {
    canvasObject.setfill(color);
    canvasObject.saveShapes();
    canvasObject.drawShapes();
  };

  const handleOpacity = (opacity: number) => {
    canvasObject.setOpacity(opacity);
    canvasObject.saveShapes();
    canvasObject.drawShapes();
  };

  const handleLineWidth = (width: number) => {
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
          defaultValue={stroke}
        />
        <ColorPicker
          title="Fill"
          onChangeColor={handleFillColor}
          defaultColors={fillColors}
          defaultValue={fill}
        />
        <WidthSelector onWidthChange={handleLineWidth} width={width} />
        <OpacitySelector onOpacityChange={handleOpacity} opacity={opacity} />
        {/*<ZoomControls />*/}
      </CardContent>
    </Card>
  );
};

export default StyleSelector;
