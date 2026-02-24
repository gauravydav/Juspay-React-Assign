import React from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {
  // top-level state
const [sprites, setSprites] = useState([
  { id: 1, name: "Cat 1", x: 50, y: 50, animations: [] },
  { id: 2, name: "Cat 2", x: 220, y: 80, animations: [] },
]);
const [selectedSpriteId, setSelectedSpriteId] = useState(1);
const [play, setPlay] = useState(false);
const addBlockToSprite = (spriteId, block) => {
  if (!spriteId) return;
  setSprites(prev =>
    prev.map(s =>
      s.id === spriteId
        ? {
            ...s,
            animations: [
              ...s.animations,
              { id: Date.now() + Math.random(), ...block },
            ],
          }
        : s
    )
  );
};

const updateBlockOnSprite = (spriteId, blockId, newProps) => {
  setSprites(prev =>
    prev.map(s =>
      s.id === spriteId
        ? {
            ...s,
            animations: s.animations.map(b =>
              b.id === blockId ? { ...b, ...newProps } : b
            ),
          }
        : s
    )
  );
};

const removeBlockFromSprite = (spriteId, blockId) => {
  setSprites(prev =>
    prev.map(s =>
      s.id === spriteId
        ? {
            ...s,
            animations: s.animations.filter(b => b.id !== blockId),
          }
        : s
    )
  );
};
  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row  ">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar
  sprites={sprites}
  selectedSpriteId={selectedSpriteId}
  setSelectedSpriteId={setSelectedSpriteId}
  addSprite={addSprite /* if you have it */}
  onBlockClick={handleBlockClick /* optional, not required for motion */}
/>
<MidArea
  sprites={sprites}
  selectedSpriteId={selectedSpriteId}
  setSelectedSpriteId={setSelectedSpriteId}
  addBlockToSprite={addBlockToSprite}
  updateBlockOnSprite={updateBlockOnSprite}
  removeBlockFromSprite={removeBlockFromSprite}
/>
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
     <PreviewArea
  sprites={sprites}
  play={play}
  swapAnimations={swapAnimations}
/>
        </div>
        <button
  onClick={() => setPlay(prev => !prev)}
  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm bg-green-500 hover:bg-green-600 text-white"
>
  {play ? "Stop" : "Play"}
</button>
      </div>
    </div>
  );
}
