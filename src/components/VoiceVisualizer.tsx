import { useRef, useEffect } from 'react';
import { useVoiceVisualizer } from '../hooks/useVoiceVisualizer';
import { VisualizerConfig } from '../animations/visualizer';

interface VoiceVisualizerProps {
  config: VisualizerConfig;
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  onError: (error: string) => void;
  onStateChange: (state: 'idle' | 'listening' | 'speaking' | 'processing') => void;
}

export function VoiceVisualizer({
  config,
  isActive: shouldBeActive,
  onStart,
  onStop,
  onError,
  onStateChange
}: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isActive, error, state, start, stop, updateState, updateConfig } = useVoiceVisualizer(
    canvasRef,
    config
  );

  useEffect(() => {
    if (shouldBeActive && !isActive) {
      start();
    } else if (!shouldBeActive && isActive) {
      stop();
    }
  }, [shouldBeActive, isActive, start, stop]);

  useEffect(() => {
    if (isActive) {
      onStart();
    } else {
      onStop();
    }
  }, [isActive, onStart, onStop]);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  useEffect(() => {
    updateConfig(config);
  }, [config, updateConfig]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
}
