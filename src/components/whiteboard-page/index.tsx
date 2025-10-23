"use client";
import { useEffect, useRef, useState } from "react";
import { CanvasDrawer } from "./draw";

const WhiteboardPage = ({ slug, userId }: { slug: string; userId: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawerRef = useRef<CanvasDrawer | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:8000/ws?roomId=${slug}&userId=${userId}`,
    );
    setWs(ws);

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drawer = new CanvasDrawer(canvas);
    drawerRef.current = drawer;
    drawer.setMode("freedraw");
    drawer.setStyles("green", 2);

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
