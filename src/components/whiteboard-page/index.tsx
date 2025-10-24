"use client";
import { useEffect, useRef, useState } from "react";
import { CanvasDrawer } from "./draw";
import { AppSidebar } from "./app-sidebar";

const WhiteboardPage = ({ slug, userId }: { slug: string; userId: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawerRef = useRef<CanvasDrawer | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Track when drawer is ready
  const [drawerReady, setDrawerReady] = useState<CanvasDrawer | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ws?roomId=${slug}&userId=${userId}`,
    );
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify({ type: "test", message: "hello" }));
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = (event) =>
      console.log("Connection closed:", event.code, event.reason);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const drawer = new CanvasDrawer(canvas, ws);
    drawerRef.current = drawer;
    setDrawerReady(drawer); // mark drawer ready

    drawer.setMode("none");
    drawer.setStyles("green", 2);

    const handleResize = () => drawer.resizeCanvas();
    window.addEventListener("resize", handleResize);

    return () => {
      drawer.destroy();
      window.removeEventListener("resize", handleResize);
      ws.close();
    };
  }, [slug, userId]);

  return (
    <div className="relative m-0 p-0">
      {/* Sidebar floating over canvas */}
      <div className="absolute top-4 left-4 z-50">
        <AppSidebar canvasObject={drawerReady!} />
      </div>

      <canvas ref={canvasRef} className="block w-screen h-screen" />
    </div>
  );
};

export default WhiteboardPage;
