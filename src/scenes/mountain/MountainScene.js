import React from 'react';
import { VisibilityGroup } from '../../components/VisibilityGroup';
import { Accents } from './groups/Accents';
import { TreesFront } from './groups/TreesFront';
import { TreesBack } from './groups/TreesBack';
import { Sun } from './groups/Sun';
import { Sky } from './groups/Sky';
import { Mountains } from './groups/Mountains';
import { Birds } from './groups/Birds';

const MountainScene = ({ calmScore, focusScore, activeMetric, isReceivingData, thresholds, ...props }) => {
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
        id="mountains"
        activeMetric={activeMetric}
        metrics={metrics}
        threshold={thresholds.mountains}
      >
        <Mountains />
      </VisibilityGroup>

      <VisibilityGroup 
        id="treesback"
        activeMetric={activeMetric}
        metrics={metrics}
        threshold={thresholds.treesback}
      >
        <TreesBack />
      </VisibilityGroup>

      <VisibilityGroup 
        id="treesfront"
        activeMetric={activeMetric}
        metrics={metrics}
        threshold={thresholds.treesfront}
      >
        <TreesFront />
      </VisibilityGroup>

      <VisibilityGroup 
        id="birds"
        activeMetric={activeMetric}
        metrics={metrics}
        threshold={thresholds.birds}
      >
        <Birds />
      </VisibilityGroup>

      <VisibilityGroup 
        id="accents"
        activeMetric={activeMetric}
        metrics={metrics}
        threshold={thresholds.accents}
      >
        <Accents />
      </VisibilityGroup>
    </svg>
  );
};

export default MountainScene;
