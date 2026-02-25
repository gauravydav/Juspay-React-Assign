# 🎮 Scratch-Like Visual Code Editor (React)

A Scratch-inspired visual programming editor built using **React** that allows users to create animations using drag-and-drop blocks — similar to MIT Scratch.

This project implements Motion, Looks, Controls, Multiple Sprite support, and a custom **Hero Feature (Collision-Based Animation Swap)**.

---

## 🚀 Live Demo

🔗 Deployment Link:  
> (I will add the deployed link here)

---

## 📌 About The Project

This project is a simplified visual JavaScript editor inspired by:

👉 https://scratch.mit.edu/projects/editor/

It allows users to:

- Drag and drop blocks  
- Create animations visually  
- Control multiple sprites  
- Run animations using a Play button  
- Experience collision-based dynamic animation swapping (Hero Feature)  

---

# ✨ Features Implemented

---

## 1️⃣ Motion Animations

Under the **Motion** category:

### ✅ Move _X_ Steps
- Moves the sprite forward or backward.
- Supports negative movement.

### ✅ Turn _X_ Degrees
- Rotates sprite clockwise.

### ✅ Go To X: _value_ Y: _value_
- Instantly moves sprite to given coordinates.

### ✅ Repeat Animation (Control Block)
- Repeats nested animation blocks N times.
- Supports loop chaining.

---

## 2️⃣ Looks Animations

Under the **Looks** category:

### ✅ Say _Message_ for _Seconds_
- Displays speech bubble above sprite.
- Automatically hides after duration.

### ✅ Think _Message_ for _Seconds_
- Displays thinking bubble.
- Automatically hides after duration.

---

## 3️⃣ Drag & Drop System

- Fully draggable blocks  
- Blocks can be:
  - Added  
  - Removed  
  - Reordered  
  - Nested inside repeat block  
- Each sprite has an independent block stack  

---

## 4️⃣ Multiple Sprites Support

- Create multiple sprites dynamically  
- Each sprite:
  - Has independent position  
  - Has independent animation sequence  
  - Executes independently  
- All sprites animate when **Play button** is clicked  

---

## 5️⃣ 🎯 Hero Feature (Collision-Based Animation Swap)

### 🔥 Custom Mandatory Feature

When two sprites collide:

- Their animation sequences swap dynamically.

### Example:

Before collision:

- Character 1 → Move 10 steps (repeat)
- Character 2 → Move -10 steps (repeat)

After collision:

- Character 1 executes Character 2's animation
- Character 2 executes Character 1's animation

This creates dynamic interaction between characters in the playground.

---

# 🛠 Tech Stack

- React  
- JavaScript  
- TailwindCSS  
- HTML5 / CSS3  

---

# 📂 Project Setup

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
```
```bash
cd your-repo-name
npm install
npm start
```

