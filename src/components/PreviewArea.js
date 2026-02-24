import React from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({ sprites }) {
  return (
    <div className="flex-none h-full overflow-y-auto p-2">
      {sprites.map((s) => (
        <CatSprite key={s.id} sprite={s} />
      ))}
    </div>
  );
}