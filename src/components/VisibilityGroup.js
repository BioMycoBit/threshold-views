import React from 'react';

export const VisibilityGroup = ({ 
  id,
  activeMetric,
  metrics,
  threshold,
  children,
  style = {},
  className = '',
  visibilityStyle = {
    visible: { display: 'inline' },
    hidden: { display: 'none' }
  }
}) => {
  const getGroupVisibility = () => {
    if (!activeMetric || !metrics) return false;
    const score = metrics[activeMetric];
    return score >= threshold;
  };

  const isVisible = getGroupVisibility();
  const visibilityStyles = isVisible ? visibilityStyle.visible : visibilityStyle.hidden;

  return (
    <g
      id={id}
      className={className}
      style={{
        ...style,
        ...visibilityStyles
      }}
    >
      {children}
    </g>
  );
}; 