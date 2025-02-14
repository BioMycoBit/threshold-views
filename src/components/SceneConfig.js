import React, { useState } from 'react';

// Scene-specific component name mappings
export const BEACH_COMPONENT_NAMES = {
  palm: 'Palm',
  beach: 'Beach',
  ocean: 'Ocean',
  clouds: 'Clouds',
  sky: 'Sky',
  sun: 'Sun',
  audio: 'Audio'
};

export const MOUNTAIN_COMPONENT_NAMES = {
  accents: 'Accents',
  treesfront: 'Trees (Front)',
  treesback: 'Trees (Back)',
  sun: 'Sun',
  sky: 'Sky',
  mountains: 'Mountains',
  birds: 'Birds',
  audio: 'Audio'
};

const SCENE_OPTIONS = [
  { value: 'beach', label: 'Beach Scene' },
  { value: 'mountain', label: 'Mountain Scene' }
];

export function SceneConfig({ 
  metrics, 
  activeMetric, 
  thresholds, 
  onThresholdsChange,
  defaultThresholds,
  componentNames = BEACH_COMPONENT_NAMES,
  activeScene = 'beach',
  onSceneChange
}) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Sort groups but ensure audio is at the bottom
  const groups = Object.entries(thresholds)
    .sort((a, b) => {
      // If one of the items is audio, handle specially
      if (a[0] === 'audio') return 1;  // Audio goes to the end
      if (b[0] === 'audio') return -1; // Audio goes to the end
      // Otherwise sort by threshold value
      return a[1] - b[1];
    });

  const handleEdit = (group, value) => {
    setEditingId(group);
    setEditValue(value);
  };

  const handleSave = (group) => {
    const newValue = parseInt(editValue);
    if (isNaN(newValue) || newValue < 0 || newValue > 100) {
      alert('Please enter a valid number between 0 and 100');
      // Reset to the previous value
      setEditValue(thresholds[group]);
      return;
    }

    onThresholdsChange({
      ...thresholds,
      [group]: newValue
    });
    setEditingId(null);
  };

  const handleReset = () => {
    onThresholdsChange(defaultThresholds);
  };

  const handleKeyPress = (e, group) => {
    if (e.key === 'Enter') {
      handleSave(group);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      // Reset to the previous value when canceling
      setEditValue(thresholds[group]);
    }
  };

  const handleSceneChange = (e) => {
    if (onSceneChange) {
      onSceneChange(e.target.value);
    }
  };

  return (
    <div className="scene-config">
      <div className="scene-config-header">
        <select 
          value={activeScene}
          onChange={handleSceneChange}
          className="scene-selector"
        >
          {SCENE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button onClick={handleReset} className="reset-button">
          Restore Defaults
        </button>
      </div>
      <div className="config-table-container">
        <table className="config-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Component</th>
              <th>Threshold</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(([group, threshold], index) => (
              <tr 
                key={group} 
                className={`${metrics[activeMetric] >= threshold ? 'met' : 'not-met'} ${group === 'audio' ? 'audio-row' : ''}`}
              >
                <td>{index + 1}</td>
                <td className="component-name">{componentNames[group] || group}</td>
                <td 
                  className="threshold-cell"
                  onClick={() => handleEdit(group, threshold)}
                >
                  {editingId === group ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleSave(group)}
                      onKeyDown={(e) => handleKeyPress(e, group)}
                      min="0"
                      max="100"
                      className="threshold-input"
                      autoFocus
                    />
                  ) : (
                    <span className="editable-value">{threshold}%</span>
                  )}
                </td>
                <td>{metrics[activeMetric] >= threshold ? '✓' : '×'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="config-help">
        Click on a threshold value to edit it. Changes are saved automatically.
      </div>
    </div>
  );
} 