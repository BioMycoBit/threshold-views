import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { neurosity, useNeurosity } from "../services/neurosity";
import { Nav } from "../components/Nav";
import { SceneManager } from "../scenes/SceneManager";

export function Focus() {
  const navigate = useNavigate();
  const { user } = useNeurosity();
  const [focus, setFocus] = useState(0);
  const rightColumnRef = useRef(null);
  const leftColumnRef = useRef(null);
  const [isReceivingData, setIsReceivingData] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let dataTimeout;
    const resetDataTimeout = () => {
      setIsReceivingData(true);
      clearTimeout(dataTimeout);
      dataTimeout = setTimeout(() => {
        setIsReceivingData(false);
      }, 2000); // Consider no data after 2 seconds of no updates
    };

    const subscription = neurosity.focus().subscribe((focus) => {
      resetDataTimeout();
      const focusScore = Math.trunc(focus.probability * 100);
      setFocus(focusScore);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(dataTimeout);
    };
  }, [user]);

  // Match heights
  useEffect(() => {
    const matchHeight = () => {
      if (rightColumnRef.current && leftColumnRef.current) {
        const rightHeight = rightColumnRef.current.offsetHeight;
        leftColumnRef.current.style.height = `${rightHeight}px`;
      }
    };

    matchHeight();
    window.addEventListener('resize', matchHeight);
    return () => window.removeEventListener('resize', matchHeight);
  }, []);

  return (
    <main className="main-container">
      <div className="left-column" ref={leftColumnRef}>
        <SceneManager 
          calmScore={focus} 
          focusScore={focus} 
          activeMetric="focus"
          isReceivingData={isReceivingData}
        />
      </div>
      <div className="right-column" ref={rightColumnRef}>
        {user ? <Nav /> : null}
        <div className="focus-score">
          &nbsp;{focus}%
          <div className="focus-word">Focus</div>
        </div>
      </div>
    </main>
  );
} 