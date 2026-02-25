import React from "react";

export default function MidArea() {
  const selectedSprite =
  sprites.find(s => s.id === selectedSpriteId) || sprites[0];
  const handleChangeField = (block, field, value) => {
  if (!selectedSprite) return;
  const numericFields = ["steps", "degrees", "x", "y"];
  const newValue = numericFields.includes(field) ? Number(value) || 0 : value;
  updateBlockOnSprite(selectedSprite.id, block.id, { [field]: newValue });
};
useEffect(() => {
  if (!play) return;

  const interval = setInterval(() => {
    const angleUpdates = {};

    setPositions(prev => {
      const newPos = { ...prev };

      sprites.forEach(s => {
        if (!newPos[s.id]) {
          newPos[s.id] = { x: s.x, y: s.y };
        }

        const hasRepeat = s.animations.some(b => b.type === "repeat");

        // If there is no repeat block, run only once per Play click
        if (!hasRepeat && hasRunOnceRef.current[s.id]) {
          return;
        }

        let angleDelta = 0;

        s.animations.forEach(block => {
          if (block.type === "move") {
            const steps = block.steps ?? 0;
            newPos[s.id].x += steps;
          }
          if (block.type === "turn") {
            const degrees = block.degrees ?? 0;
            angleDelta += degrees;
          }
          if (block.type === "goto") {
            newPos[s.id].x = block.x ?? newPos[s.id].x;
            newPos[s.id].y = block.y ?? newPos[s.id].y;
          }
        });

        // store rotation to apply in render
        if (angleDelta !== 0) {
          angleUpdates[s.id] = (angleUpdates[s.id] || 0) + angleDelta;
        }

        if (!hasRepeat) {
          hasRunOnceRef.current[s.id] = true;
        }
      });

      return newPos;
    });

    if (Object.keys(angleUpdates).length > 0) {
      setAngles(prevAngles => {
        const next = { ...prevAngles };
        Object.entries(angleUpdates).forEach(([idStr, delta]) => {
          const id = Number(idStr);
          const current = next[id] ?? 0;
          next[id] = current + delta;
        });
        return next;
      });
    }
  }, 500);

  return () => clearInterval(interval);
}, [play, sprites]);
  return <div className="flex-1 h-full overflow-auto">{"mid area"} 
    <div
  className="flex-1 overflow-auto rounded-lg border border-dashed border-blue-300 bg-blue-50/40 p-2"
  onDrop={handleDrop}
  onDragOver={handleDragOver}
>
  {/* inside here we render blocks */}
  {selectedSprite.animations.map(block => {
  if (block.type === "move") {
    return (
      <div
        key={block.id}
        className="flex items-center space-x-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-sm"
      >
        <span>Move</span>
        <input
          type="number"
          className="w-16 px-1 py-0.5 rounded text-gray-800 text-xs"
          value={block.steps ?? 0}
          onChange={e =>
            handleChangeField(block, "steps", e.target.value)
          }
        />
        <span>steps</span>
        <button
          className="ml-2 text-[10px] bg-blue-700 hover:bg-blue-800 px-1 py-0.5 rounded"
          onClick={() =>
            removeBlockFromSprite(selectedSprite.id, block.id)
          }
        >
          ✕
        </button>
      </div>
    );
  }

  if (block.type === "turn") {
    return (
      <div
        key={block.id}
        className="flex items-center space-x-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-sm"
      >
        <span>Turn</span>
        <input
          type="number"
          className="w-16 px-1 py-0.5 rounded text-gray-800 text-xs"
          value={block.degrees ?? 0}
          onChange={e =>
            handleChangeField(block, "degrees", e.target.value)
          }
        />
        <span>degrees</span>
        <button
          className="ml-2 text-[10px] bg-blue-700 hover:bg-blue-800 px-1 py-0.5 rounded"
          onClick={() =>
            removeBlockFromSprite(selectedSprite.id, block.id)
          }
        >
          ✕
        </button>
      </div>
    );
  }

  if (block.type === "goto") {
    return (
      <div
        key={block.id}
        className="flex items-center space-x-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-sm"
      >
        <span>Go to x:</span>
        <input
          type="number"
          className="w-16 px-1 py-0.5 rounded text-gray-800 text-xs"
          value={block.x ?? 0}
          onChange={e => handleChangeField(block, "x", e.target.value)}
        />
        <span>y:</span>
        <input
          type="number"
          className="w-16 px-1 py-0.5 rounded text-gray-800 text-xs"
          value={block.y ?? 0}
          onChange={e => handleChangeField(block, "y", e.target.value)}
        />
        <button
          className="ml-2 text-[10px] bg-blue-700 hover:bg-blue-800 px-1 py-0.5 rounded"
          onClick={() =>
            removeBlockFromSprite(selectedSprite.id, block.id)
          }
        >
          ✕
        </button>
      </div>
    );
  }
<div
  style={{
    position: "absolute",
    left: positions[s.id]?.x || 0,
    top: positions[s.id]?.y || 0,
    transform: `rotate(${angles[s.id] || 0}deg)`,
    transformOrigin: "center center",
    transition:
      "transform 0.35s ease-out, left 0.35s ease-out, top 0.35s ease-out",
  }}
>
  <CatSprite />
</div>
  if (block.type === "repeat") {
    return (
      <div
        key={block.id}
        className="flex items-center space-x-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded shadow-sm"
      >
        <span>Repeat animation</span>
        <span className="text-[10px] opacity-90">
          (loops motion while playing)
        </span>
        <button
          className="ml-2 text-[10px] bg-yellow-700 hover:bg-yellow-800 px-1 py-0.5 rounded"
          onClick={() =>
            removeBlockFromSprite(selectedSprite.id, block.id)
          }
        >
          ✕
        </button>
      </div>
    );
  }

  return null;
})}
</div>
  </div>;
}
