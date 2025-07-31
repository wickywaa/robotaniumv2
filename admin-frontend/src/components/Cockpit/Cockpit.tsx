import React from 'react';
import { VideoViewer } from './VideoViewer';

interface CockpitProps {
  sessionId: string;
}

export const Cockpit: React.FC<CockpitProps> = ({ sessionId }) => {
  const API_KEY = 'your-api-key'; // You should get this from environment variables
  const TOKEN = 'your-token'; // This should be generated server-side

  return (
    <div className="cockpit">
      <VideoViewer 
        apiKey={API_KEY}
        sessionId={sessionId}
        token={TOKEN}
        
      />
    </div>
  );
};