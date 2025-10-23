interface Shape {
  type: "rect";
  startX: number;
  startY: number;
  width: number;
  height: number;
}

export function initDraw(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let shapes: Shape[] = [];
  let clicked = false;
  let startX = -1;
  let startY = -1;

  const handleMouseDown = (e: MouseEvent) => {
    clicked = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (clicked) {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const width = currentX - startX;
      const height = currentY - startY;
      shapes.push({
        startX: startX,
        startY: startY,
        width,
        height,
        type: "rect",
      });
      clicked = false;
      startX = -1;
      startY = -1;
    }
  };

  const drawShapes = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const shape of shapes) {
      ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (clicked && startX != -1 && startY != -1) {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const width = currentX - startX;
      const height = currentY - startY;
      drawShapes();
      ctx.strokeRect(startX, startY, width, height);
    }
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);

  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mousemove", handleMouseMove);
  };
}
