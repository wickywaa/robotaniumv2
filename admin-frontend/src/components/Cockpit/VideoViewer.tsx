import OT from "@opentok/client";
import { useRef } from "react";

import { useEffect,useState } from "react";

interface VideoViewerProps {
  apiKey: string;
  sessionId: string;
  token: string;
  onLoaded?: () => void;
  onError?: (error: any) => void;
}

export const VideoViewer: React.FC<VideoViewerProps> = ({ 
  apiKey, 
  sessionId, 
  token,
  onLoaded,
  onError 
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<OT.Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    console.log('video viewer props')
    console.log('apiKey', apiKey)
    console.log('sessionId', sessionId)
    console.log('token', token)
    console.log('videoRef.current', videoRef.current)
    if (!apiKey || !sessionId || !token || !videoRef.current) return;
    console.log('now in the video viewer')

    console.log('apiKey', apiKey)
    console.log('sessionId', sessionId)
    console.log('token', token)

    // Initialize session
    const session = OT.initSession(apiKey, sessionId);

    console.log('session', session)
    sessionRef.current = session;

    // Handle connection
    session.on('streamCreated', (event) => {
      const subscriberOptions: OT.SubscriberProperties = {
        insertMode: '',
        width: '100%',
        height: '100%',
        style: {
          buttonDisplayMode: 'off',
          nameDisplayMode: 'off'
        },
        showControls: false
      };

      if (videoRef.current) {
        const subscriber = session.subscribe(
          event.stream,
          videoRef.current,
          subscriberOptions,
          (error) => {
            if (error) {
              console.error('Error subscribing to stream:', error);
              onError?.(error);
            } else {
              onLoaded?.();
            }
          }
        );

        // Handle subscriber events
        subscriber.on('videoDisabled', () => {
          console.log('Video disabled');
        });

        subscriber.on('videoEnabled', () => {
          console.log('Video enabled');
        });
      }
    });

    // Connect to the session
    session.connect(token, (error) => {
      if (error) {
        console.error('Error connecting to session:', error);
        onError?.(error);
      }
    });

    // Cleanup
    return () => {
      if (sessionRef.current) {
        sessionRef.current.disconnect();
        sessionRef.current = null;
      }
    };
  }, [apiKey, sessionId, token, onLoaded, onError]);

  return (
    <div className="video-container">
      <div ref={videoRef} className="video-element" />
    </div>
  );
};