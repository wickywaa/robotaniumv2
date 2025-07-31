import React, { useEffect, useRef, useState } from 'react';
import OT from '@opentok/client';

interface VideoViewerProps {
  apiKey: string;
  sessionId: string;
  token: string;
  maxRetries?: number;
  retryInterval?: number;
}

export const VideoViewer: React.FC<VideoViewerProps> = ({ 
  apiKey, 
  sessionId, 
  token,
  maxRetries = 3,
  retryInterval = 3000 
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<OT.Session | null>(null);
  const subscriberRef = useRef<OT.Subscriber | null>(null);
  const [connectionState, setConnectionState] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const retryCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const initializeSession = async () => {
    if (!apiKey || !sessionId || !token) return;

    try {
      const session = OT.initSession(apiKey, sessionId);
      sessionRef.current = session;

      // Handle stream creation
      session.on('streamCreated', (event) => {
        subscribeToStream(event.stream);
      });

      // Handle disconnection
      session.on('sessionDisconnected', handleDisconnection);

      // Handle connection dropped
      session.on('connectionDestroyed', handleDisconnection);

      // Connect to the session
      await new Promise<void>((resolve, reject) => {
        session.connect(token, (error) => {
          if (error) {
            reject(error);
          } else {
            setConnectionState('connected');
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Session initialization error:', error);
      handleError(error);
    }
  };

  const subscribeToStream = (stream: OT.Stream) => {
    if (!sessionRef.current || !videoRef.current) return;

    const subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      subscribeToAudio: true,
      subscribeToVideo: true,
    };

    const subscriber = sessionRef.current.subscribe(
      stream,
      videoRef.current,
      subscriberOptions,
      handleError
    );

    subscriberRef.current = subscriber;

    // Monitor video quality
    subscriber.on('videoDataReceived', () => {
      // Reset retry count when we're receiving data
      retryCountRef.current = 0;
    });

    subscriber.on('videoDisabled', () => {
      console.log('Video disabled - possible freeze');
      handleVideoFreeze();
    });
  };

  const handleVideoFreeze = () => {
    if (connectionState === 'reconnecting') return;

    setConnectionState('reconnecting');
    
    // Clear any existing timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        reconnect();
      } else {
        console.error('Max retry attempts reached');
        setConnectionState('disconnected');
      }
    }, retryInterval);
  };

  const reconnect = async () => {
    try {
      // Clean up existing session
      cleanup();
      
      // Reinitialize session
      await initializeSession();
    } catch (error) {
      console.error('Reconnection failed:', error);
      handleVideoFreeze(); // Try again if failed
    }
  };

  const handleDisconnection = (event: any) => {
    console.log('Session disconnected:', event);
    handleVideoFreeze();
  };

  const cleanup = () => {
    if (subscriberRef.current) {
      subscriberRef.current.destroy();
      subscriberRef.current = null;
    }

    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  };

  const handleError = (error: any) => {
    if (error) {
      console.error('OpenTok Error:', error);
      handleVideoFreeze();
    }
  };

  useEffect(() => {
    initializeSession();
    return cleanup;
  }, [apiKey, sessionId, token]);

  return (
    <div className="video-container">
      <div ref={videoRef} className="video-element" />
      {connectionState === 'reconnecting' && (
        <div className="reconnecting-overlay">
          Reconnecting... Attempt {retryCountRef.current} of {maxRetries}
        </div>
      )}
      {connectionState === 'disconnected' && (
        <div className="disconnected-overlay">
          Connection lost. Please refresh the page.
        </div>
      )}
    </div>
  );
}; 