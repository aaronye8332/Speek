import React, { useRef, useEffect, useState } from "react";

export default function CanvasEditor(props: { onCancel: () => void; onSave: (name: string, frames: string[]) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<"pencil" | "marker">("pencil");
  const [color, setColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [frames, setFrames] = useState<string[]>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const c = canvasRef.current!;
    c.width = 800;
    c.height = 450;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
  }, []);

  const start = (e: React.PointerEvent) => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.beginPath();
    const rect = c.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const rect = c.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = tool === "pencil" ? 2 : 12;
    ctx.globalAlpha = tool === "pencil" ? 1 : 0.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const end = (e: React.PointerEvent) => {
    setIsDrawing(false);
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const clearCanvas = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
  };

  const saveFrame = () => {
    const data = canvasRef.current!.toDataURL("image/png");
    setFrames((s) => [...s, data]);
  };

  const saveAll = () => {
    props.onSave(nameRef.current?.value || `Project ${Date.now()}`, frames);
  };

  return (
    <div className="canvas-editor">
      <div className="editor-header">
        <input ref={nameRef} placeholder="Project name (optional)" />
        <div className="tool-row">
          <label>Tool</label>
          <select value={tool} onChange={(e) => setTool(e.target.value as any)}>
            <option value="pencil">Pencil</option>
            <option value="marker">Marker</option>
          </select>
          <label>Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          <button className="btn" onClick={clearCanvas}>
            Clear
          </button>
          <button className="btn" onClick={saveFrame}>
            Save Frame
          </button>
        </div>
      </div>

      <div className="canvas-wrap">
        <canvas
          ref={canvasRef}
          className="drawing-canvas"
          onPointerDown={start}
          onPointerMove={draw}
          onPointerUp={end}
          onPointerLeave={end}
        />
      </div>

      <div className="gallery-preview">
        <h4>Frames ({frames.length})</h4>
        <div className="frames-row">
          {frames.map((f, i) => (
            <div key={i} className="frame-thumb">
              <img src={f} alt={`frame-${i}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="row">
        <button className="btn ghost" onClick={props.onCancel}>
          Cancel
        </button>
        <button className="btn" onClick={saveAll} disabled={frames.length === 0}>
          Save Project
        </button>
      </div>
    </div>
  );
}
