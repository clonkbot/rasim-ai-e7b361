import { useRef, useEffect } from "react";

const SCALE = 25; // 1 meter = 25 pixels

interface Room {
  id: string;
  roomType: string;
  label: string;
  x: number;
  y: number;
  width: number;
  depth: number;
  area: number;
  color: string;
}

interface FloorPlanCanvasProps {
  rooms: Room[];
  width: number;
  depth: number;
}

export function FloorPlanCanvas({ rooms, width, depth }: FloorPlanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const padding = 40;
    const canvasWidth = width * SCALE + padding * 2;
    const canvasHeight = depth * SCALE + padding * 2;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Background
    ctx.fillStyle = "#FAFAFA";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Grid
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 0.5;
    for (let x = padding; x <= canvasWidth - padding; x += SCALE) {
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvasHeight - padding);
      ctx.stroke();
    }
    for (let y = padding; y <= canvasHeight - padding; y += SCALE) {
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvasWidth - padding, y);
      ctx.stroke();
    }

    // Building outline
    ctx.strokeStyle = "#1F2937";
    ctx.lineWidth = 3;
    ctx.strokeRect(padding, padding, width * SCALE, depth * SCALE);

    // Draw rooms
    rooms.forEach((room) => {
      const x = room.x * SCALE + padding;
      const y = room.y * SCALE + padding;
      const roomWidth = room.width * SCALE;
      const roomHeight = room.depth * SCALE;

      // Room fill
      ctx.fillStyle = room.color;
      ctx.fillRect(x, y, roomWidth, roomHeight);

      // Room border
      ctx.strokeStyle = "#6B7280";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, roomWidth, roomHeight);

      // Room label
      ctx.fillStyle = "#374151";
      ctx.font = `bold ${Math.min(12, roomWidth / 6)}px "IBM Plex Sans Arabic", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(room.label, x + roomWidth / 2, y + roomHeight / 2 - 8);

      // Area text
      ctx.fillStyle = "#6B7280";
      ctx.font = `${Math.min(10, roomWidth / 7)}px "IBM Plex Sans Arabic", sans-serif`;
      ctx.fillText(`${room.area.toFixed(0)} م²`, x + roomWidth / 2, y + roomHeight / 2 + 8);
    });

    // Dimension labels
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${width.toFixed(1)} م`, canvasWidth / 2, canvasHeight - 10);

    ctx.save();
    ctx.translate(15, canvasHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${depth.toFixed(1)} م`, 0, 0);
    ctx.restore();

  }, [rooms, width, depth]);

  return (
    <div className="flex justify-center overflow-auto">
      <canvas
        ref={canvasRef}
        className="max-w-full"
        style={{ direction: "ltr" }}
      />
    </div>
  );
}
