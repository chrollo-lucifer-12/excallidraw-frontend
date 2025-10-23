"use client";
import { useEffect, useRef } from "react";
import { CanvasDrawer } from "./draw";

const WhiteboardPage = ({ slug }: { slug: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawerRef = useRef<CanvasDrawer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const drawer = new CanvasDrawer(canvas);
    drawerRef.current = drawer;
    drawerRef.current.setMode("line");
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      drawer.destroy();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="m-0 p-0">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default WhiteboardPage;
