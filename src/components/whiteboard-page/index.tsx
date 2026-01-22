"use client";
import { useEffect, useRef, useState } from "react";
import { CanvasDrawer } from "./draw";
import { AppSidebar } from "./app-sidebar";
import { Button } from "../ui/button";
import { IShape } from "@/lib/types";

const WhiteboardPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawerRef = useRef<CanvasDrawer | null>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const [selectedShape, setSelectedShape] = useState<IShape | null>(null);

  const [drawerReady, setDrawerReady] = useState<CanvasDrawer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const drawer = new CanvasDrawer(canvas);
    drawerRef.current = drawer;
    setDrawerReady(drawer);

    drawer.setMode("icon");
    drawer.setStyles("green", 2);

    const handleResize = () => drawer.resizeCanvas();
    window.addEventListener("resize", handleResize);

    const drawMinimap = () => {
      if (!minimapRef.current || !canvasRef.current || !drawerRef.current)
        return;
      const ctx = minimapRef.current.getContext("2d");
      if (!ctx) return;

      const canvas = canvasRef.current;
      const minimap = minimapRef.current;

      ctx.clearRect(0, 0, minimap.width, minimap.height);
      ctx.drawImage(
        canvas,
        0,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        minimap.width,
        minimap.height,
      );
    };

    const interval = setInterval(drawMinimap, 50);

    return () => {
      drawer.destroy();
      window.removeEventListener("resize", handleResize);

      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!drawerReady) return;

    drawerReady.onSelectShapeChanged = setSelectedShape;

    return () => {
      drawerReady.onSelectShapeChanged = undefined;
    };
  }, [drawerReady]);

  return (
    <div className="relative m-0 p-0">
      <div className="absolute bottom-4 right-4 border border-gray-300 z-2  rounded-md bg-white/90">
        <canvas ref={minimapRef} width={200} height={150} className="block" />
      </div>

      <div className="absolute top-4 left-4 z-50">
        <AppSidebar canvasObject={drawerReady!} selectedShape={selectedShape} />
      </div>
      <canvas ref={canvasRef} className="block w-screen h-screen" />
    </div>
  );
};

export default WhiteboardPage;
