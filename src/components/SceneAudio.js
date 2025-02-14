import React, { useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';

export const SceneAudio = ({ 
  audioSource,
  isReceivingData, 
  activeMetric, 
  metrics, 
  threshold,
  volume = 0.5 
}) => {
  const { audioEnabled } = useAudio();
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);

  // Initialize audio on mount or when audioSource changes
  useEffect(() => {
    // Clean up previous audio if it exists
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    // Only create new audio if we have a source
    if (audioSource) {
      const audio = new Audio(audioSource);
      audio.loop = true;
      audio.volume = volume;
      audioRef.current = audio;
    } else {
      audioRef.current = null;
    }

    // Reset playing state
    isPlayingRef.current = false;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, [audioSource, volume]);

  // Handle audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSource) return;  // Added audioSource check

    // Ensure we have valid metrics and a valid metric value
    if (!metrics || !activeMetric || !(activeMetric in metrics)) {
      if (isPlayingRef.current) {
        audio.pause();
        isPlayingRef.current = false;
      }
      return;
    }

    const currentMetricValue = metrics[activeMetric];
    const shouldPlay = audioEnabled && isReceivingData && Number(currentMetricValue) >= Number(threshold);

    // Only take action if the playback state needs to change
    if (shouldPlay && !isPlayingRef.current) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      isPlayingRef.current = true;
    } else if (!shouldPlay && isPlayingRef.current) {
      audio.pause();
      isPlayingRef.current = false;
    }
  }, [audioEnabled, audioSource, metrics, activeMetric, isReceivingData, threshold]);

  return null;
}; 