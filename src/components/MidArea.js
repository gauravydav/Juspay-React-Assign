import React from "react";

export default function MidArea({
  sprites,
  selectedSpriteId,
  setSelectedSpriteId,
  addBlockToSprite,
  updateBlockOnSprite,
  removeBlockFromSprite,
}) {
  const selectedSprite =
    sprites.find((s) => s.id === selectedSpriteId) || sprites[0];

  const handleDrop = (event) => {
    event.preventDefault();
    let data;
    try {
      const raw = event.dataTransfer.getData("application/json");
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = null;
    }
    if (!data || !selectedSprite) return;
    addBlockToSprite(selectedSprite.id, data);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleChangeField = (block, field, value) => {
    if (!selectedSprite) return;
    const numericFields = [
      "steps",
      "degrees",
      "x",
      "y",
      "seconds",
      "amount",
      "value",
    ];
    const newValue = numericFields.includes(field) ? Number(value) || 0 : value;
    updateBlockOnSprite(selectedSprite.id, block.id, { [field]: newValue });
  };

  return (
    <div className="flex-1 h-full overflow-hidden p-3 flex flex-col bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Script
          </span>
          {selectedSprite && (
            <select
              value={selectedSprite.id}
              onChange={(e) => setSelectedSpriteId(Number(e.target.value))}
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
            >
              {sprites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="text-[11px] text-gray-500">
          Drag blocks from the left into this area.
        </div>
      </div>

      <div
        className="flex-1 overflow-auto rounded-lg border border-dashed border-blue-300 bg-blue-50/40 p-2"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!selectedSprite || selectedSprite.animations.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-400 text-center px-4">
            Drop motion / looks / control blocks here to build a visual program
            for the selected sprite.
          </div>
        ) : (
          <div className="space-y-2">
            {selectedSprite.animations.map((block) => {
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
                      onChange={(e) =>
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
                      onChange={(e) =>
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
                      onChange={(e) =>
                        handleChangeField(block, "x", e.target.value)
                      }
                    />
                    <span>y:</span>
                    <input
                      type="number"
                      className="w-16 px-1 py-0.5 rounded text-gray-800 text-xs"
                      value={block.y ?? 0}
                      onChange={(e) =>
                        handleChangeField(block, "y", e.target.value)
                      }
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

              if (block.type === "say") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center space-x-2 bg-purple-500 text-white text-xs px-2 py-1 rounded shadow-sm"
                  >
                    <span>Say</span>
                    <input
                      type="text"
                      className="w-32 px-1 py-0.5 rounded text-gray-800 text-xs"
                      value={block.message ?? ""}
                      onChange={(e) =>
                        handleChangeField(block, "message", e.target.value)
                      }
                    />
                    <span>for</span>
                    <input
                      type="number"
                      className="w-16 px-1 py-0.5 rounded text-gray-800 text-xs"
                      value={block.seconds ?? 2}
                      onChange={(e) =>
                        handleChangeField(block, "seconds", e.target.value)
                      }
                    />
                    <span>seconds</span>
                    <button
                      className="ml-2 text-[10px] bg-purple-700 hover:bg-purple-800 px-1 py-0.5 rounded"
                      onClick={() =>
                        removeBlockFromSprite(selectedSprite.id, block.id)
                      }
                    >
                      ✕
                    </button>
                  </div>
                );
              }

              if (block.type === "think") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center space-x-2 bg-purple-500 text-white text-xs px-2 py-1 rounded shadow-sm"
                  >
                    <span>Think</span>
                    <input
                      type="text"
                      className="w-32 px-1 py-0.5 rounded text-gray-800 text-xs"
                      value={block.message ?? ""}
                      onChange={(e) =>
                        handleChangeField(block, "message", e.target.value)
                      }
                    />
                    <span>for</span>
                    <input
                      type="number"
                      className="w-16 px-1 py-0.5 rounded text-gray-800 text-xs"
                      value={block.seconds ?? 2}
                      onChange={(e) =>
                        handleChangeField(block, "seconds", e.target.value)
                      }
                    />
                    <span>seconds</span>
                    <button
                      className="ml-2 text-[10px] bg-purple-700 hover:bg-purple-800 px-1 py-0.5 rounded"
                      onClick={() =>
                        removeBlockFromSprite(selectedSprite.id, block.id)
                      }
                    >
                      ✕
                    </button>
                  </div>
                );
              }

              if (block.type === "show" || block.type === "hide") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center space-x-2 bg-purple-500 text-white text-xs px-2 py-1 rounded shadow-sm"
                  >
                    <span>{block.type === "show" ? "Show" : "Hide"}</span>
                    <button
                      className="ml-2 text-[10px] bg-purple-700 hover:bg-purple-800 px-1 py-0.5 rounded"
                      onClick={() =>
                        removeBlockFromSprite(selectedSprite.id, block.id)
                      }
                    >
                      ✕
                    </button>
                  </div>
                );
              }

              if (block.type === "changeColor") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center space-x-2 bg-purple-500 text-white text-xs px-2 py-1 rounded shadow-sm"
                  >
                    <span>Change color effect by</span>
                    <input
                      type="number"
                      className="w-16 px-1 py-0.5 rounded text-gray-800 text-xs"
                      value={block.amount ?? 25}
                      onChange={(e) =>
                        handleChangeField(block, "amount", e.target.value)
                      }
                    />
                    <button
                      className="ml-2 text-[10px] bg-purple-700 hover:bg-purple-800 px-1 py-0.5 rounded"
                      onClick={() =>
                        removeBlockFromSprite(selectedSprite.id, block.id)
                      }
                    >
                      ✕
                    </button>
                  </div>
                );
              }

              if (block.type === "setColor") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center space-x-2 bg-purple-500 text-white text-xs px-2 py-1 rounded shadow-sm"
                  >
                    <span>Set color effect to</span>
                    <input
                      type="number"
                      className="w-16 px-1 py-0.5 rounded text-gray-800 text-xs"
                      value={block.value ?? 0}
                      onChange={(e) =>
                        handleChangeField(block, "value", e.target.value)
                      }
                    />
                    <button
                      className="ml-2 text-[10px] bg-purple-700 hover:bg-purple-800 px-1 py-0.5 rounded"
                      onClick={() =>
                        removeBlockFromSprite(selectedSprite.id, block.id)
                      }
                    >
                      ✕
                    </button>
                  </div>
                );
              }

              if (block.type === "clearEffects") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center space-x-2 bg-purple-500 text-white text-xs px-2 py-1 rounded shadow-sm"
                  >
                    <span>Clear graphic effects</span>
                    <button
                      className="ml-2 text-[10px] bg-purple-700 hover:bg-purple-800 px-1 py-0.5 rounded"
                      onClick={() =>
                        removeBlockFromSprite(selectedSprite.id, block.id)
                      }
                    >
                      ✕
                    </button>
                  </div>
                );
              }

              if (block.type === "changeSizeBy") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center space-x-2 bg-purple-500 text-white text-xs px-2 py-1 rounded shadow-sm"
                  >
                    <span>Change size by</span>
                    <input
                      type="number"
                      className="w-16 px-1 py-0.5 rounded text-gray-800 text-xs"
                      value={block.amount ?? 10}
                      onChange={(e) =>
                        handleChangeField(block, "amount", e.target.value)
                      }
                    />
                    <span>%</span>
                    <button
                      className="ml-2 text-[10px] bg-purple-700 hover:bg-purple-800 px-1 py-0.5 rounded"
                      onClick={() =>
                        removeBlockFromSprite(selectedSprite.id, block.id)
                      }
                    >
                      ✕
                    </button>
                  </div>
                );
              }

              if (block.type === "setSizeTo") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center space-x-2 bg-purple-500 text-white text-xs px-2 py-1 rounded shadow-sm"
                  >
                    <span>Set size to</span>
                    <input
                      type="number"
                      className="w-16 px-1 py-0.5 rounded text-gray-800 text-xs"
                      value={block.value ?? 100}
                      onChange={(e) =>
                        handleChangeField(block, "value", e.target.value)
                      }
                    />
                    <span>%</span>
                    <button
                      className="ml-2 text-[10px] bg-purple-700 hover:bg-purple-800 px-1 py-0.5 rounded"
                      onClick={() =>
                        removeBlockFromSprite(selectedSprite.id, block.id)
                      }
                    >
                      ✕
                    </button>
                  </div>
                );
              }

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
        )}
      </div>
    </div>
  );
}
