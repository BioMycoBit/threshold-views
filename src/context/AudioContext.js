import React, { createContext, useContext, useState, useEffect } from 'react';

const AUDIO_STORAGE_KEY = 'beach-scene-audio-enabled';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  // Always start with audio disabled on page load
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Only save the state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(audioEnabled));
  }, [audioEnabled]);

  const toggleAudio = () => {
    console.log('Toggling audio from:', audioEnabled, 'to:', !audioEnabled);
    setAudioEnabled(prev => !prev);
  };

  return (
    <AudioContext.Provider value={{ audioEnabled, toggleAudio }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === null) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}