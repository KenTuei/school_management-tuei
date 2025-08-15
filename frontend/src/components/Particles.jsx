import React from "react";

const Particles = ({ count = 50 }) => {
  const particlesArray = Array.from({ length: count });

  return (
    <>
      {particlesArray.map((_, idx) => {
        const size = Math.random() * 10 + 6; // 6px - 16px
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 15 + 5;
        const colors = ["#3b82f6", "#6366f1", "#2563eb", "#1e40af"]; // blue-indigo shades
        const color = colors[Math.floor(Math.random() * colors.length)];

        return (
          <div
            key={idx}
            className="absolute rounded-full opacity-30 animate-floatUp"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              bottom: `-10px`,
              backgroundColor: color,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </>
  );
};

export default Particles;
