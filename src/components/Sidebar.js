import React from "react";
import Icon from "./Icon";

export default function Sidebar() {
const looksBlocks = [
  {
    label: 'Say "Hello!" for 2 seconds',
    block: { type: "say", message: "Hello!", seconds: 2 },
  },
  {
    label: 'Think "Hmm..." for 2 seconds',
    block: { type: "think", message: "Hmm...", seconds: 2 },
  },
  // keep your other looks blocks if you have them
];
const controlBlocks = [
  {
    label: "Repeat animation",
    block: { type: "repeat" },
  },
];
  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="mb-4 space-y-1">
  {sprites.map(sprite => (
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
      <div className="font-bold"> {"Events"} </div>
      <div className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"When "}
        <Icon name="flag" size={15} className="text-green-600 mx-2" />
        {"clicked"}
      </div>
      <div className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"When this sprite clicked"}
      </div>
      <div className="font-bold"> {"Motion"} </div>
      <div className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"Move 10 steps"}
      </div>
      <div className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"Turn "}
        <Icon name="undo" size={15} className="text-white mx-2" />
        {"15 degrees"}
      </div>
      <div className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"Turn "}
        <Icon name="redo" size={15} className="text-white mx-2" />
        {"15 degrees"}
      </div>
      <div className="mt-1">
  <div className="flex items-center space-x-2 mb-1">
    <span className="font-semibold text-gray-800 text-xs uppercase tracking-wide">
      Motion
    </span>
  </div>
  {motionBlocks.map(({ label, block }) => (
    <div
      key={label}
      draggable
      onDragStart={e => handleDragStart(e, block)}
      className="flex flex-row flex-wrap bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 my-1 text-xs cursor-move rounded shadow-sm select-none"
    >
      {label}
    </div>
  ))}
</div>
<div className="mt-3">
  <div className="flex items-center space-x-2 mb-1">
    <span className="font-semibold text-gray-800 text-xs uppercase tracking-wide">
      Looks
    </span>
  </div>
  {looksBlocks.map(({ label, block }) => (
    <div
      key={label}
      draggable
      onDragStart={e => handleDragStart(e, block)}
      className="flex flex-row flex-wrap bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 my-1 text-xs cursor-move rounded shadow-sm select-none"
    >
      {label}
    </div>
  ))}
  <button
  className="flex items-center space-x-1 text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-sm"
  onClick={addSprite}
>
  <span>+</span>
  <span>Add</span>
</button>
</div>
    </div>
  );
}
