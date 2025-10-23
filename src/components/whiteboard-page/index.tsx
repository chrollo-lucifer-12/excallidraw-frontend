"use client";
import { useEffect, useRef } from "react";
import { CanvasDrawer } from "./draw";

const WhiteboardPage = ({ slug }: { slug: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawerRef = useRef<CanvasDrawer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drawer = new CanvasDrawer(canvas);
    drawerRef.current = drawer;
    drawer.setMode("circle");

    const handleResize = () => drawer.resizeCanvas();
    window.addEventListener("resize", handleResize);

    return () => {
      drawer.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="m-0 p-0">
      <canvas ref={canvasRef} className="block w-screen h-screen" />
    </div>
  );
};

export default WhiteboardPage;
