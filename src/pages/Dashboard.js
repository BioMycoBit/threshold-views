import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GROUP_THRESHOLDS as BEACH_THRESHOLDS } from "../scenes/beach/config/thresholds";
import { GROUP_THRESHOLDS as MOUNTAIN_THRESHOLDS } from "../scenes/mountain/config/thresholds";
import { neurosity, useNeurosity } from "../services/neurosity";
import { Nav } from "../components/Nav";
import { SceneManager } from "../scenes/SceneManager";
import { SceneConfig } from "../components/SceneConfig";
import { useAudio } from "../context/AudioContext";
import { SceneAudio } from "../components/SceneAudio";
import { BEACH_COMPONENT_NAMES, MOUNTAIN_COMPONENT_NAMES } from "../components/SceneConfig";
import beachWaves from "../scenes/beach/sounds/beach_waves.mp3";
import mountainSound from "../scenes/mountain/sounds/mountain.mp3";
import { SceneDetails } from "../components/SceneDetails";

const SCENE_THRESHOLDS = {
  beach: BEACH_THRESHOLDS,
  mountain: MOUNTAIN_THRESHOLDS
};

const SCENE_COMPONENT_NAMES = {
  beach: BEACH_COMPONENT_NAMES,
  mountain: MOUNTAIN_COMPONENT_NAMES
};

const SCENE_AUDIO = {
  beach: beachWaves,
  mountain: mountainSound
};

// Constants for localStorage keys
const STORAGE_KEYS = {
  ACTIVE_SCENE: 'active-scene',
  SCENE_THRESHOLDS: 'scene-thresholds'
};

// Helper function to reset localStorage (can be called from console if needed)
window.resetSceneStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.SCENE_THRESHOLDS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_SCENE);
  console.log('Scene storage has been reset');
  window.location.reload();
};

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useNeurosity();
  
  // Initialize activeScene from localStorage or default to 'beach'
  const [activeScene, setActiveScene] = useState(() => {
    const savedScene = localStorage.getItem(STORAGE_KEYS.ACTIVE_SCENE);
    return savedScene || 'beach';
  });

  // Initialize thresholds from localStorage or default to scene defaults
  const [thresholds, setThresholds] = useState(() => {
    const savedThresholds = localStorage.getItem(STORAGE_KEYS.SCENE_THRESHOLDS);
    console.log('Initial savedThresholds:', savedThresholds);
    
    // Get the initial active scene
    const initialScene = localStorage.getItem(STORAGE_KEYS.ACTIVE_SCENE) || 'beach';
    console.log('Initial scene:', initialScene);
    
    if (savedThresholds) {
      const parsed = JSON.parse(savedThresholds);
      console.log('Parsed saved thresholds:', parsed);
      console.log('Default thresholds for scene:', SCENE_THRESHOLDS[initialScene]);
      return parsed[initialScene] || SCENE_THRESHOLDS[initialScene];
    }
    return SCENE_THRESHOLDS[initialScene];
  });

  const [activeMetric, setActiveMetric] = useState('calm');
  const [activePage, setActivePage] = useState(1);
  const [metrics, setMetrics] = useState({ calm: 0, focus: 0 });
  const rightColumnRef = useRef(null);
  const leftColumnRef = useRef(null);
  const deviceRef = useRef(null);
  const metricsRef = useRef(null);
  const sceneConfigRef = useRef(null);
  const { audioEnabled } = useAudio();
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [containerWidth, setContainerWidth] = useState(400);

  // Calculate max width from all tab contents
  useEffect(() => {
    const updateMaxWidth = () => {
      const deviceWidth = deviceRef.current?.scrollWidth || 0;
      const metricsWidth = metricsRef.current?.scrollWidth || 0;
      const sceneConfigWidth = sceneConfigRef.current?.scrollWidth || 0;
      
      const maxWidth = Math.max(deviceWidth, metricsWidth, sceneConfigWidth, 400);
      console.log('Widths:', { deviceWidth, metricsWidth, sceneConfigWidth, maxWidth });
      
      if (maxWidth > 0 && maxWidth !== containerWidth) {
        setContainerWidth(maxWidth + 40);
        if (rightColumnRef.current) {
          rightColumnRef.current.style.width = `${maxWidth + 40}px`;
          rightColumnRef.current.style.flex = `0 0 ${maxWidth + 40}px`;
        }
      }
    };

    updateMaxWidth();
    const timer = setTimeout(updateMaxWidth, 100);
    window.addEventListener('resize', updateMaxWidth);
    return () => {
      window.removeEventListener('resize', updateMaxWidth);
      clearTimeout(timer);
    };
  }, [activePage, containerWidth]);

  // Neurosity subscriptions
  useEffect(() => {
    if (!user) return;

    // Set isReceivingData to true immediately when subscriptions start
    setIsReceivingData(true);

    let dataTimeout;
    const resetDataTimeout = () => {
      setIsReceivingData(true);
      clearTimeout(dataTimeout);
      dataTimeout = setTimeout(() => {
        console.log('Setting isReceivingData to false (timeout)');
        setIsReceivingData(false);
      }, 2000);
    };

    console.log('Setting up Neurosity subscriptions');
    
    const calmSubscription = neurosity.calm().subscribe((calm) => {
      resetDataTimeout();
      const calmScore = Math.trunc(calm.probability * 100);
      console.log('Received calm update:', { calmScore, isReceivingData: true });
      setMetrics(prev => {
        const newMetrics = { ...prev, calm: calmScore };
        console.log('Updated metrics:', newMetrics);
        return newMetrics;
      });
    });

    const focusSubscription = neurosity.focus().subscribe((focus) => {
      resetDataTimeout();
      const focusScore = Math.trunc(focus.probability * 100);
      console.log('Received focus update:', { focusScore, isReceivingData: true });
      setMetrics(prev => {
        const newMetrics = { ...prev, focus: focusScore };
        console.log('Updated metrics:', newMetrics);
        return newMetrics;
      });
    });

    return () => {
      console.log('Cleaning up Neurosity subscriptions');
      calmSubscription.unsubscribe();
      focusSubscription.unsubscribe();
      clearTimeout(dataTimeout);
    };
  }, [user]);

  // Log state changes
  useEffect(() => {
    console.log('Dashboard state update:', {
      metrics,
      activeMetric,
      isReceivingData,
      audioThreshold: thresholds.audio
    });
  }, [metrics, activeMetric, isReceivingData, thresholds]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Save scene choice when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SCENE, activeScene);
  }, [activeScene]);

  // Save thresholds when they change
  useEffect(() => {
    const savedThresholds = localStorage.getItem(STORAGE_KEYS.SCENE_THRESHOLDS);
    const allThresholds = savedThresholds ? JSON.parse(savedThresholds) : {};
    allThresholds[activeScene] = thresholds;
    localStorage.setItem(STORAGE_KEYS.SCENE_THRESHOLDS, JSON.stringify(allThresholds));
  }, [thresholds, activeScene]);

  const handleMetricClick = (metric) => {
    console.log('Switching to metric:', metric);
    setActiveMetric(metric);
  };

  // Scene change handler - now also loads saved thresholds for the scene
  const handleSceneChange = (scene) => {
    if (scene === activeScene) return; // Don't do anything if we're already on this scene
    
    console.log('Switching to scene:', scene, 'Current scene:', activeScene);
    console.log('Current thresholds:', thresholds);
    console.log('Default thresholds for new scene:', SCENE_THRESHOLDS[scene]);
    
    // First update the scene
    setActiveScene(scene);
    
    // Then update thresholds in a separate effect to ensure proper timing
    const savedThresholds = localStorage.getItem(STORAGE_KEYS.SCENE_THRESHOLDS);
    const allThresholds = savedThresholds ? JSON.parse(savedThresholds) : {};
    
    // Always use a fresh copy of the scene thresholds
    const newThresholds = { ...SCENE_THRESHOLDS[scene] };
    
    // Update localStorage
    allThresholds[scene] = newThresholds;
    localStorage.setItem(STORAGE_KEYS.SCENE_THRESHOLDS, JSON.stringify(allThresholds));
    
    // Force a new threshold state
    console.log('Setting new thresholds:', newThresholds);
    setThresholds(newThresholds);
  };

  // Add an effect to monitor scene changes
  useEffect(() => {
    console.log('Scene changed to:', activeScene);
    console.log('Current thresholds:', thresholds);
    console.log('Default thresholds for scene:', SCENE_THRESHOLDS[activeScene]);
  }, [activeScene]);

  return (
    <main className="main-container">
      <SceneAudio 
        audioSource={SCENE_AUDIO[activeScene]}
        isReceivingData={isReceivingData}
        activeMetric={activeMetric}
        metrics={metrics}
        threshold={thresholds.audio}
      />
      <div className="left-column" ref={leftColumnRef}>
        <SceneManager
          activeScene={activeScene}
          calmScore={metrics.calm}
          focusScore={metrics.focus}
          activeMetric={activeMetric}
          isReceivingData={isReceivingData}
          thresholds={thresholds}
          onThresholdsChange={setThresholds}
          defaultThresholds={SCENE_THRESHOLDS[activeScene]}
          onSceneChange={handleSceneChange}
        />
      </div>
      <div className="right-column" ref={rightColumnRef} style={{ width: containerWidth, flex: `0 0 ${containerWidth}px` }}>
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activePage === 1 ? 'active' : ''}`}
              onClick={() => setActivePage(1)}
            >
              Device
            </button>
            <button 
              className={`tab ${activePage === 2 ? 'active' : ''}`}
              onClick={() => setActivePage(2)}
            >
              Metrics
            </button>
            <button 
              className={`tab ${activePage === 3 ? 'active' : ''}`}
              onClick={() => setActivePage(3)}
            >
              Scene Config
            </button>
            <button 
              className={`tab ${activePage === 4 ? 'active' : ''}`}
              onClick={() => setActivePage(4)}
            >
              Scene Details
            </button>
          </div>
          
          <div className="tab-content">
            {activePage === 1 ? (
              <div ref={deviceRef} className="device-info">
                {user ? <Nav /> : null}
              </div>
            ) : activePage === 2 ? (
              <div ref={metricsRef} className="metrics-container">
                <div className="metrics-content">
                  <div 
                    className={`calm-score ${activeMetric === 'calm' ? 'active' : ''}`}
                    onClick={() => handleMetricClick('calm')}
                    style={{ cursor: 'pointer' }}
                  >
                    &nbsp;{metrics.calm}%
                    <div className="calm-word">Calm</div>
                  </div>
                  <div 
                    className={`focus-score ${activeMetric === 'focus' ? 'active' : ''}`}
                    onClick={() => handleMetricClick('focus')}
                    style={{ cursor: 'pointer' }}
                  >
                    &nbsp;{metrics.focus}%
                    <div className="focus-word">Focus</div>
                  </div>
                </div>
              </div>
            ) : activePage === 3 ? (
              <div ref={sceneConfigRef} className="scene-config">
                <SceneConfig 
                  metrics={metrics}
                  activeMetric={activeMetric}
                  thresholds={thresholds}
                  onThresholdsChange={setThresholds}
                  defaultThresholds={SCENE_THRESHOLDS[activeScene]}
                  componentNames={SCENE_COMPONENT_NAMES[activeScene]}
                  activeScene={activeScene}
                  onSceneChange={handleSceneChange}
                />
              </div>
            ) : (
              <div ref={sceneConfigRef} className="scene-details-container">
                <SceneDetails activeScene={activeScene} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}