"use client";
import { useLayoutEffect, useRef } from "react";

const WhiteboardPage = ({ slug }: { slug: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="m-0 p-0">
      <canvas ref={ref} className="block" />
    </div>
  );
};

export default WhiteboardPage;
