import React from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({ sprites }) {
  const [bubbles, setBubbles] = useState({});
useEffect(() => {
  if (!play) {
    setBubbles({});
    return;
  }

  const timeouts = [];

  sprites.forEach(sprite => {
    let currentTime = 0;
    sprite.animations.forEach(block => {
      if (block.type === "say" || block.type === "think") {
        const start = currentTime;
        const duration = (block.seconds || 2) * 1000;
        const end = start + duration;

        timeouts.push(
          setTimeout(() => {
            setBubbles(prev => ({
              ...prev,
              [sprite.id]: {
                type: block.type,
                message: block.message || "",
              },
            }));
          }, start)
        );

        timeouts.push(
          setTimeout(() => {
            setBubbles(prev => ({
              ...prev,
              [sprite.id]: null,
            }));
          }, end)
        );

        currentTime = end;
      }
    });
  });

  return () => {
    timeouts.forEach(clearTimeout);
  };
}, [play, sprites]);
  return (
    <div className="flex-none h-full overflow-y-auto p-2">
      {sprites.map((s) => (
        <CatSprite key={s.id} sprite={s} />
      ))}
      <div className="relative">
  <CatSprite />
  {bubbles[s.id] && bubbles[s.id]?.message && (
    <div
      className={`absolute -top-6 left-8 px-2 py-1 rounded-full text-[10px] whitespace-nowrap shadow ${
        bubbles[s.id].type === "think"
          ? "bg-white text-gray-800 border border-gray-300"
          : "bg-yellow-200 text-gray-900 border border-yellow-400"
      }`}
    >
      {bubbles[s.id].message}
    </div>
  )}
</div>
    </div>
  );
}