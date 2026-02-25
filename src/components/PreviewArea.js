import React, { useEffect, useRef, useState } from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({
  sprites,
  play,
  swapAnimations,
  instantEffect,
}) {
  const [positions, setPositions] = useState({});
  const [angles, setAngles] = useState({});
  const [bubbles, setBubbles] = useState({});
  const [visual, setVisual] = useState({});
  const [collidingIds, setCollidingIds] = useState([]);
  const [lastSwap, setLastSwap] = useState(null);

  const hasSwappedRef = useRef(false);
  const hasRunOnceRef = useRef({});
  const collisionTimeoutRef = useRef(null);
  const stageRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  // Measure the stage so we can clamp sprites near the edges symmetrically
  useEffect(() => {
    const updateSize = () => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const clampPosition = (pos) => {
    // If we don't yet know the stage size, just return the original position
    if (!stageSize.width || !stageSize.height) {
      return pos;
    }

    // Approximate sprite size and how much should stay visible at the edge
    const SPRITE_WIDTH = 100;
    const SPRITE_HEIGHT = 100;
    const VISIBLE_MARGIN = 20; // pixels that always stay visible

    const MIN_X = -SPRITE_WIDTH + VISIBLE_MARGIN;
    const MAX_X = stageSize.width - VISIBLE_MARGIN;
    const MIN_Y = -SPRITE_HEIGHT + VISIBLE_MARGIN;
    const MAX_Y = stageSize.height - VISIBLE_MARGIN;
    return {
      x: Math.min(MAX_X, Math.max(MIN_X, pos.x)),
      y: Math.min(MAX_Y, Math.max(MIN_Y, pos.y)),
    };
  };

  // Initialise positions, angles and visual state when sprites change
  useEffect(() => {
    const pos = {};
    sprites.forEach((s) => {
      pos[s.id] = { x: s.x, y: s.y };
    });
    setPositions(pos);

    setAngles((prev) => {
      const next = { ...prev };
      sprites.forEach((s) => {
        if (next[s.id] == null) {
          next[s.id] = 0;
        }
      });
      return next;
    });

    setVisual((prev) => {
      const next = { ...prev };
      sprites.forEach((s) => {
        if (!next[s.id]) {
          next[s.id] = { visible: true, size: 100, color: 0 };
        }
      });
      return next;
    });
  }, [sprites]);

  // Reset collision and one-shot execution flags when play toggles
  useEffect(() => {
    hasSwappedRef.current = false;
    if (play) {
      hasRunOnceRef.current = {};
    }
  }, [play]);

  // Handle say / think timed bubbles
  useEffect(() => {
    if (!play) {
      setBubbles({});
      return;
    }

    const timeouts = [];

    sprites.forEach((sprite) => {
      let currentTime = 0;
      sprite.animations.forEach((block) => {
        if (block.type === "say" || block.type === "think") {
          const start = currentTime;
          const duration = (block.seconds || 2) * 1000;
          const end = start + duration;

          timeouts.push(
            setTimeout(() => {
              setBubbles((prev) => ({
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
              setBubbles((prev) => ({
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

  // Motion, looks effects and collision / hero feature
  useEffect(() => {
    if (!play) return;

    const interval = setInterval(() => {
      const angleUpdates = {};

      setPositions((prev) => {
        const newPos = { ...prev };

        sprites.forEach((s) => {
          if (!newPos[s.id]) {
            newPos[s.id] = { x: s.x, y: s.y };
          }

          const hasRepeat = s.animations.some(
            (block) => block.type === "repeat"
          );

          // For scripts without a repeat block, run motion only once
          if (!hasRepeat && hasRunOnceRef.current[s.id]) {
            return;
          }

          let angleDelta = 0;

          s.animations.forEach((block) => {
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

          // Prevent sprites from disappearing completely off-screen
          newPos[s.id] = clampPosition(newPos[s.id]);

          if (angleDelta !== 0) {
            angleUpdates[s.id] = (angleUpdates[s.id] || 0) + angleDelta;
          }

          if (!hasRepeat) {
            hasRunOnceRef.current[s.id] = true;
          }
        });

        // Collision check (hero feature)
        const keys = Object.keys(newPos);
        if (!hasSwappedRef.current && keys.length >= 2) {
          for (let i = 0; i < keys.length; i++) {
            for (let j = i + 1; j < keys.length; j++) {
              const id1 = parseInt(keys[i], 10);
              const id2 = parseInt(keys[j], 10);
              const p1 = newPos[id1];
              const p2 = newPos[id2];
              if (
                Math.abs(p1.x - p2.x) < 40 &&
                Math.abs(p1.y - p2.y) < 40
              ) {
                swapAnimations(id1, id2);
                hasSwappedRef.current = true;
                // Highlight colliding sprites briefly so the swap is visible
                if (collisionTimeoutRef.current) {
                  clearTimeout(collisionTimeoutRef.current);
                }
                setCollidingIds([id1, id2]);
                const leftName =
                  sprites.find((sp) => sp.id === id1)?.name || `Sprite ${id1}`;
                const rightName =
                  sprites.find((sp) => sp.id === id2)?.name || `Sprite ${id2}`;
                setLastSwap({
                  leftName,
                  rightName,
                  ts: Date.now(),
                });
                collisionTimeoutRef.current = setTimeout(() => {
                  setCollidingIds([]);
                }, 600);
                break;
              }
            }
            if (hasSwappedRef.current) break;
          }
        }

        return newPos;
      });

      if (Object.keys(angleUpdates).length > 0) {
        setAngles((prevAngles) => {
          const next = { ...prevAngles };
          Object.entries(angleUpdates).forEach(([idStr, delta]) => {
            const id = Number(idStr);
            const current = next[id] ?? 0;
            next[id] = current + delta;
          });
          return next;
        });
      }

      // Looks effects: show/hide, color, size
      setVisual((prevVisual) => {
        const next = { ...prevVisual };

        sprites.forEach((s) => {
          const hasRepeat = s.animations.some(
            (block) => block.type === "repeat"
          );
          if (!hasRepeat && hasRunOnceRef.current[s.id]) {
            return;
          }

          const current =
            next[s.id] || {
              visible: true,
              size: 100,
              color: 0,
            };
          let v = { ...current };

          s.animations.forEach((block) => {
            if (block.type === "show") {
              v.visible = true;
            }
            if (block.type === "hide") {
              v.visible = false;
            }
            if (block.type === "changeColor") {
              const by = block.amount ?? 0;
              v.color = (v.color || 0) + by;
            }
            if (block.type === "setColor") {
              v.color = block.value ?? 0;
            }
            if (block.type === "clearEffects") {
              v.color = 0;
              v.size = 100;
            }
            if (block.type === "changeSizeBy") {
              const by = block.amount ?? 0;
              v.size = (v.size || 100) + by;
            }
            if (block.type === "setSizeTo") {
              v.size = block.value ?? 100;
            }
          });

          next[s.id] = v;
        });

        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [play, sprites, swapAnimations]);

  // Apply instant effects coming from sidebar clicks (works even when not playing)
  useEffect(() => {
    if (!instantEffect) return;
    const { spriteId, block } = instantEffect;
    if (!spriteId || !block) return;

    // Instant motion: move / turn / goto apply once immediately
    if (block.type === "move" || block.type === "turn" || block.type === "goto") {
      setPositions((prev) => {
        const current = prev[spriteId] || { x: 0, y: 0 };
        const next = { ...prev };
        let pos = { ...current };

        if (block.type === "move") {
          const steps = block.steps ?? 0;
          pos.x += steps;
        }

        if (block.type === "turn") {
          const degrees = block.degrees ?? 0;
          // only rotation is handled by angles below
          setAngles((prevAngles) => {
            const copy = { ...prevAngles };
            const currentAngle = copy[spriteId] ?? 0;
            copy[spriteId] = currentAngle + degrees;
            return copy;
          });
        }

        if (block.type === "goto") {
          if (typeof block.x === "number") pos.x = block.x;
          if (typeof block.y === "number") pos.y = block.y;
        }

        next[spriteId] = clampPosition(pos);
        return next;
      });
    }

    // Instant looks: color, size, show/hide, clear
    if (
      [
        "show",
        "hide",
        "changeColor",
        "setColor",
        "clearEffects",
        "changeSizeBy",
        "setSizeTo",
      ].includes(block.type)
    ) {
      setVisual((prev) => {
        const current =
          prev[spriteId] || { visible: true, size: 100, color: 0 };
        let v = { ...current };

        if (block.type === "show") {
          v.visible = true;
        }
        if (block.type === "hide") {
          v.visible = false;
        }
        if (block.type === "changeColor") {
          // each click gives a new random color "25% effect" style
          const randomHue = Math.floor(Math.random() * 360);
          v.color = randomHue;
        }
        if (block.type === "setColor") {
          v.color = 0;
        }
        if (block.type === "clearEffects") {
          v.color = 0;
          v.size = 100;
        }
        if (block.type === "changeSizeBy") {
          const by = block.amount ?? 10;
          v.size = (v.size || 100) + by;
        }
        if (block.type === "setSizeTo") {
          v.size = block.value ?? 100;
        }

        return {
          ...prev,
          [spriteId]: v,
        };
      });
    }
  }, [instantEffect]);

  return (
    <div
      ref={stageRef}
      className="flex-1 relative h-full overflow-hidden bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200"
    >
      {lastSwap && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-white/90 text-[11px] font-semibold text-pink-700 shadow-sm border border-pink-200">
          <span className="mr-1">Swap:</span>
          <span className="font-bold">{lastSwap.leftName}</span>
          <span className="mx-1 text-gray-400">↔</span>
          <span className="font-bold">{lastSwap.rightName}</span>
        </div>
      )}
      {sprites.map((s) => {
        const v = visual[s.id] || { visible: true, size: 100, color: 0 };
        const scale = (v.size || 100) / 100;
        const rotation = angles[s.id] || 0;

        return (
          <div
            key={s.id}
            className={`transition-all ${
              collidingIds.includes(s.id)
                ? "ring-4 ring-pink-400 shadow-xl rounded-full"
                : ""
            }`}
            style={{
              position: "absolute",
              left: positions[s.id]?.x || 0,
              top: positions[s.id]?.y || 0,
              transform: `rotate(${rotation}deg) scale(${scale})`,
              transformOrigin: "center center",
              transition:
                "transform 0.35s ease-out, left 0.35s ease-out, top 0.35s ease-out, filter 0.35s ease-out, opacity 0.35s ease-out",
              filter: `hue-rotate(${v.color || 0}deg)`,
              opacity: v.visible === false ? 0 : 1,
            }}
          >
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
      })}
    </div>
  );
}