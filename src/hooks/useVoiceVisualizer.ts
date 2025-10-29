import { useEffect, useRef, useState, useCallback } from 'react';
import { AudioAnalyzer } from '../audio/audioAnalyzer';
import { Visualizer, AnimationState, VisualizerConfig } from '../animations/visualizer';

export function useVoiceVisualizer(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  config: VisualizerConfig
) {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<AnimationState>('idle');

  const audioAnalyzerRef = useRef<AudioAnalyzer | null>(null);
  const visualizerRef = useRef<Visualizer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    if (!audioAnalyzerRef.current || !visualizerRef.current) return;

    const audioFeatures = audioAnalyzerRef.current.getAudioFeatures();
    visualizerRef.current.render(audioFeatures);

    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const start = useCallback(async () => {
    try {
      setError(null);

      if (!audioAnalyzerRef.current) {
        audioAnalyzerRef.current = new AudioAnalyzer();
      }

      await audioAnalyzerRef.current.initialize();

      if (canvasRef.current && !visualizerRef.current) {
        visualizerRef.current = new Visualizer(canvasRef.current, config);
      }

      setIsActive(true);
      animate();
    } catch (err) {
      console.error('Failed to start visualizer:', err);
      setError(err instanceof Error ? err.message : 'Failed to access microphone');
    }
  }, [canvasRef, config, animate]);

  const stop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (audioAnalyzerRef.current) {
      audioAnalyzerRef.current.dispose();
      audioAnalyzerRef.current = null;
    }

    setIsActive(false);
  }, []);

  const updateState = useCallback((newState: AnimationState) => {
    setState(newState);
    if (visualizerRef.current) {
      visualizerRef.current.setState(newState);
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<VisualizerConfig>) => {
    if (visualizerRef.current) {
      visualizerRef.current.setConfig(newConfig);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (visualizerRef.current) {
        visualizerRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isActive,
    error,
    state,
    start,
    stop,
    updateState,
    updateConfig
  };
}
