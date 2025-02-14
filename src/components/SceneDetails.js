import React from 'react';
import beachMetadata from '../scenes/beach/metadata.yaml';
import mountainMetadata from '../scenes/mountain/metadata.yaml';

const SCENE_METADATA = {
  beach: beachMetadata,
  mountain: mountainMetadata
};

export function SceneDetails({ activeScene }) {
  const metadata = SCENE_METADATA[activeScene];

  if (!metadata) {
    return <div className="scene-details error">No metadata available for this scene</div>;
  }

  return (
    <div className="scene-details-container">
      <section className="scene-description">
        <h1>Scene Description</h1>
        <p>{metadata.prompt || 'No description available'}</p>
      </section>

      {metadata.audio && (
        <section className="scene-audio">
          <h2>Audio</h2>
          <dl className="audio-details">
            <dt>Name:</dt>
            <dd>{metadata.audio.file || 'Not specified'}</dd>
            
            <dt>Author:</dt>
            <dd>{metadata.audio.credits || 'Not specified'}</dd>
            
            <dt>Source:</dt>
            <dd>
              {metadata.audio.source ? (
                <a 
                  href={metadata.audio.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link"
                >
                  {new URL(metadata.audio.source).hostname}
                </a>
              ) : (
                'Not specified'
              )}
            </dd>
          </dl>
        </section>
      )}
    </div>
  );
} 