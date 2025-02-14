import React from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAudio } from "../context/AudioContext";

export function Footer() {
  const [darkMode, setDarkMode] = useDarkMode();
  const { audioEnabled, toggleAudio } = useAudio();

  console.log('Footer: Current audio state:', audioEnabled);

  const handleThemeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <footer className="card-footer">
      <div className="footer-controls">
        <button
          type="button"
          className="theme-toggle"
          onClick={handleThemeToggle}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
        <button
          type="button"
          className={`audio-toggle ${audioEnabled ? 'active' : ''}`}
          onClick={toggleAudio}
          aria-label="Toggle audio"
        >
          {audioEnabled ? "🔊" : "🔇"}
        </button>
      </div>
    </footer>
  );
}