import React from 'react';
import BeachScene from './beach/BeachScene';
import MountainScene from './mountain/MountainScene';

// In the future, we can add more scenes here
const SCENES = {
  beach: BeachScene,
  mountain: MountainScene,
  // forest: ForestScene,  // future scene
  // space: SpaceScene,    // future scene
};

export function SceneManager({ 
  activeScene,
  calmScore, 
  focusScore, 
  activeMetric,
  isReceivingData,
  thresholds,
  onThresholdsChange,
  defaultThresholds,
  onSceneChange
}) {
  const Scene = SCENES[activeScene];
  
  if (!Scene) {
    console.warn(`Scene "${activeScene}" not found`);
    return null;
  }

  console.log('SceneManager rendering:', {
    activeScene,
    thresholds,
    defaultThresholds
  });

  return (
    <Scene
      calmScore={calmScore}
      focusScore={focusScore}
      activeMetric={activeMetric}
      isReceivingData={isReceivingData}
      thresholds={thresholds}
      onThresholdsChange={onThresholdsChange}
      defaultThresholds={defaultThresholds}
    />
  );
} 