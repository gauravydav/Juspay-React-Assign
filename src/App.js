import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {
  const [sprites, setSprites] = useState([
    { id: 1, name: "Cat 1", x: 50, y: 50, animations: [] },
    { id: 2, name: "Cat 2", x: 220, y: 80, animations: [] },
  ]);
  const [selectedSpriteId, setSelectedSpriteId] = useState(1);
  const [play, setPlay] = useState(false);
  const [instantEffect, setInstantEffect] = useState(null);

  const addSprite = () => {
    setSprites((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((s) => s.id)) + 1 : 1;
      const offset = 80 * prev.length;
      const newSprite = {
        id: nextId,
        name: `Cat ${nextId}`,
        x: 50 + offset,
        y: 50 + offset / 2,
        animations: [],
      };
      return [...prev, newSprite];
    });
  };

  const addBlockToSprite = (spriteId, block) => {
    if (!spriteId) return;
    setSprites((prev) =>
      prev.map((s) =>
        s.id === spriteId
          ? {
              ...s,
              animations: [
                ...s.animations,
                {
                  id: Date.now() + Math.random(),
                  ...block,
                },
              ],
            }
          : s,
      ),
    );
  };

  const updateBlockOnSprite = (spriteId, blockId, newProps) => {
    setSprites((prev) =>
      prev.map((s) =>
        s.id === spriteId
          ? {
              ...s,
              animations: s.animations.map((b) =>
                b.id === blockId ? { ...b, ...newProps } : b,
              ),
            }
          : s,
      ),
    );
  };

  const removeBlockFromSprite = (spriteId, blockId) => {
    setSprites((prev) =>
      prev.map((s) =>
        s.id === spriteId
          ? {
              ...s,
              animations: s.animations.filter((b) => b.id !== blockId),
            }
          : s,
      ),
    );
  };

  const swapAnimations = (id1, id2) => {
    setSprites((prev) => {
      const s1 = prev.find((s) => s.id === id1);
      const s2 = prev.find((s) => s.id === id2);
      return prev.map((s) => {
        if (s.id === id1)
          return {
            ...s,
            animations: s2 ? s2.animations.map((b) => ({ ...b })) : [],
          };
        if (s.id === id2)
          return {
            ...s,
            animations: s1 ? s1.animations.map((b) => ({ ...b })) : [],
          };
        return s;
      });
    });
  };

  const handleBlockClick = (block) => {
    const targetId =
      selectedSpriteId || (sprites.length > 0 ? sprites[0].id : null);
    if (!targetId) return;

    // Add the block to the current sprite's script for later playback
    addBlockToSprite(targetId, block);

    // Trigger an instant visual/motion effect for looks-related blocks
    setInstantEffect({
      spriteId: targetId,
      block,
      ts: Date.now(),
    });
  };

  return (
    <div className="bg-gradient-to-br from-sky-100 via-indigo-100 to-purple-100 pt-6 font-sans h-screen">
      <div className="max-w-6xl mx-auto h-full overflow-hidden flex flex-row gap-4 px-4 pb-4">
        <div className="flex-1 h-full overflow-hidden flex flex-row bg-white/90 backdrop-blur border border-gray-200 rounded-2xl shadow-md">
          <Sidebar
            sprites={sprites}
            selectedSpriteId={selectedSpriteId}
            setSelectedSpriteId={setSelectedSpriteId}
            addSprite={addSprite}
            onBlockClick={handleBlockClick}
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
        <div className="w-1/3 h-full overflow-hidden flex flex-col bg-white/90 backdrop-blur border border-gray-200 rounded-2xl shadow-md">
          <div className="flex items-center justify-between px-3 pt-3">
            <div className="flex items-center space-x-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Stage
              </span>
            </div>
            <button
              onClick={() => setPlay((prev) => !prev)}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-colors ${
                play
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              <span
                className={`mr-1 h-2 w-2 rounded-full ${
                  play ? "bg-white" : "bg-white"
                }`}
              />
              {play ? "Stop" : "Play"}
            </button>
          </div>
          <div className="flex-1 mt-2">
            <PreviewArea
              sprites={sprites}
              play={play}
              swapAnimations={swapAnimations}
              instantEffect={instantEffect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
