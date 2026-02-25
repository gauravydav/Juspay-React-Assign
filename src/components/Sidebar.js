import React from "react";
import Icon from "./Icon";

export default function Sidebar({
  sprites,
  selectedSpriteId,
  setSelectedSpriteId,
  addSprite,
  onBlockClick,
}) {
  const handleDragStart = (e, block) => {
    e.dataTransfer.setData("application/json", JSON.stringify(block));
  };

  const motionBlocks = [
    { label: "Move 10 steps", block: { type: "move", steps: 10 } },
    { label: "Turn 15 degrees", block: { type: "turn", degrees: 15 } },
    {
      label: "Go to x: 0 y: 0",
      block: { type: "goto", x: 0, y: 0 },
    },
  ];

  const looksBlocks = [
    {
      label: 'Say "Hello!" for 2 seconds',
      block: { type: "say", message: "Hello!", seconds: 2 },
    },
    {
      label: 'Think "Hmm..." for 2 seconds',
      block: { type: "think", message: "Hmm...", seconds: 2 },
    },
    {
      label: "Show",
      block: { type: "show" },
    },
    {
      label: "Hide",
      block: { type: "hide" },
    },
    {
      label: "Change color effect by 25",
      block: { type: "changeColor", amount: 25 },
    },
    {
      label: "Set color effect to 0",
      block: { type: "setColor", value: 0 },
    },
    {
      label: "Clear graphic effects",
      block: { type: "clearEffects" },
    },
    {
      label: "Change size by 10",
      block: { type: "changeSizeBy", amount: 10 },
    },
    {
      label: "Set size to 100 %",
      block: { type: "setSizeTo", value: 100 },
    },
  ];

  const controlBlocks = [
    {
      label: "Repeat animation",
      block: { type: "repeat" },
    },
  ];

  return (
    <div className="w-64 flex-none h-full overflow-y-auto flex flex-col p-3 border-r border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="collection" size={18} className="text-blue-600" />
          <span className="font-semibold text-gray-800 text-sm">Sprites</span>
        </div>
        <button
          className="flex items-center space-x-1 text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-sm"
          onClick={addSprite}
        >
          <Icon name="plus" size={14} />
          <span>Add</span>
        </button>
      </div>

      <div className="mb-4 space-y-1">
        {sprites.map((sprite) => (
          <button
            key={sprite.id}
            onClick={() => setSelectedSpriteId(sprite.id)}
            className={`w-full text-left px-2 py-1 rounded text-xs font-medium border ${
              sprite.id === selectedSpriteId
                ? "bg-blue-100 border-blue-400 text-blue-800"
                : "bg-white border-gray-200 hover:bg-gray-100 text-gray-800"
            }`}
          >
            {sprite.name}
          </button>
        ))}
      </div>

      <div className="mt-1">
        <div className="flex items-center space-x-2 mb-1">
          <Icon name="location-marker" size={16} className="text-blue-600" />
          <span className="font-semibold text-gray-800 text-xs uppercase tracking-wide">
            Motion
          </span>
        </div>
        {motionBlocks.map(({ label, block }) => (
          <div
            key={label}
            draggable
            onDragStart={(e) => handleDragStart(e, block)}
            onClick={() => onBlockClick && onBlockClick(block)}
            className="flex flex-row flex-wrap bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 my-1 text-xs cursor-pointer rounded shadow-sm select-none active:scale-[0.97] transition-transform"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="mt-3">
        <div className="flex items-center space-x-2 mb-1">
          <Icon name="chat-alt-2" size={16} className="text-purple-600" />
          <span className="font-semibold text-gray-800 text-xs uppercase tracking-wide">
            Looks
          </span>
        </div>
        {looksBlocks.map(({ label, block }) => (
          <div
            key={label}
            draggable
            onDragStart={(e) => handleDragStart(e, block)}
            onClick={() => onBlockClick && onBlockClick(block)}
            className="flex flex-row flex-wrap bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 my-1 text-xs cursor-pointer rounded shadow-sm select-none active:scale-[0.97] transition-transform"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="mt-3">
        <div className="flex items-center space-x-2 mb-1">
          <Icon name="refresh" size={16} className="text-yellow-600" />
          <span className="font-semibold text-gray-800 text-xs uppercase tracking-wide">
            Control
          </span>
        </div>
        {controlBlocks.map(({ label, block }) => (
          <div
            key={label}
            draggable
            onDragStart={(e) => handleDragStart(e, block)}
            onClick={() => onBlockClick && onBlockClick(block)}
            className="flex flex-row flex-wrap bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 my-1 text-xs cursor-pointer rounded shadow-sm select-none active:scale-[0.97] transition-transform"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
