import React from 'react';
import { VisibilityGroup } from '../../components/VisibilityGroup';
import { Sky } from './groups/Sky';
import { Sun } from './groups/Sun';
import { Clouds } from './groups/Clouds';
import { Ocean } from './groups/Ocean';
import { Beach } from './groups/Beach';
import { Palm } from './groups/Palm';

const BeachScene = ({ calmScore, focusScore, activeMetric, isReceivingData, thresholds, ...props }) => {
  const metrics = {
    calm: calmScore,
    focus: focusScore
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={1024}
      height={1024}
      viewBox="0 0 1024 1024"
      {...props}
    >
      <VisibilityGroup 
        id="sky" 
        activeMetric={activeMetric} 
        metrics={metrics}
        threshold={thresholds.sky}
      >
        <Sky />
      </VisibilityGroup>

      <VisibilityGroup 
        id="sun" 
        activeMetric={activeMetric} 
        metrics={metrics}
        threshold={thresholds.sun}
      >
        <Sun />
      </VisibilityGroup>

      <VisibilityGroup 
        id="clouds" 
        activeMetric={activeMetric} 
        metrics={metrics}
        threshold={thresholds.clouds}
      >
        <Clouds />
      </VisibilityGroup>

      <VisibilityGroup 
        id="ocean" 
        activeMetric={activeMetric} 
        metrics={metrics}
        threshold={thresholds.ocean}
      >
        <Ocean />
      </VisibilityGroup>

      <VisibilityGroup 
        id="beach" 
        activeMetric={activeMetric} 
        metrics={metrics}
        threshold={thresholds.beach}
      >
        <Beach />
      </VisibilityGroup>

      <VisibilityGroup 
        id="palm" 
        activeMetric={activeMetric} 
        metrics={metrics}
        threshold={thresholds.palm}
      >
        <Palm />
      </VisibilityGroup>
    </svg>
  );
};

export default BeachScene; 