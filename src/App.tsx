import { useState, useCallback } from 'react';
import { VoiceVisualizer } from './components/VoiceVisualizer';
import { ControlPanel } from './components/ControlPanel';
import { StateControl } from './components/StateControl';
import { ThemeSelector } from './components/ThemeSelector';
import { VisualizerConfig, AnimationState } from './animations/visualizer';
import { ColorTheme } from './utils/colorUtils';
import { AlertCircle, Palette } from 'lucide-react';

function App() {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState<AnimationState>('idle');
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const [config, setConfig] = useState<VisualizerConfig>({
    intensity: 80,
    particleDensity: 80,
    reducedMotion: false,
    theme: 'cyberpunk' as ColorTheme
  });

  const handleStart = useCallback(() => {
    setError(null);
  }, []);

  const handleStop = useCallback(() => {
    setCurrentState('idle');
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsActive(false);
  }, []);

  const handleToggle = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  const handleIntensityChange = useCallback((value: number) => {
    setConfig(prev => ({ ...prev, intensity: value }));
  }, []);

  const handleParticleDensityChange = useCallback((value: number) => {
    setConfig(prev => ({ ...prev, particleDensity: value }));
  }, []);

  const handleReducedMotionChange = useCallback((value: boolean) => {
    setConfig(prev => ({ ...prev, reducedMotion: value }));
  }, []);

  const handleThemeChange = useCallback((theme: ColorTheme) => {
    setConfig(prev => ({ ...prev, theme }));
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-950">
      <div className="absolute inset-0">
        <VoiceVisualizer
          config={config}
          isActive={isActive}
          onStart={handleStart}
          onStop={handleStop}
          onError={handleError}
          onStateChange={setCurrentState}
        />
      </div>

      {!isActive && !error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Voice AI Visualizer
            </h1>
            <p className="text-xl text-gray-400">
              Click start to begin the audio experience
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-red-900/90 backdrop-blur-md text-white p-6 rounded-2xl shadow-2xl max-w-md border border-red-700/50">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Microphone Access Required</h3>
                <p className="text-sm text-red-200">{error}</p>
                <p className="text-sm text-red-200 mt-2">
                  Please allow microphone access in your browser settings and try again.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ControlPanel
        intensity={config.intensity}
        particleDensity={config.particleDensity}
        reducedMotion={config.reducedMotion}
        theme={config.theme}
        onIntensityChange={handleIntensityChange}
        onParticleDensityChange={handleParticleDensityChange}
        onReducedMotionChange={handleReducedMotionChange}
        onThemeChange={handleThemeChange}
      />

      <button
        onClick={() => setShowThemeSelector(true)}
        className="absolute top-6 left-6 z-10 bg-gray-900/80 backdrop-blur-sm text-white px-4 py-3 rounded-full hover:bg-gray-800/90 transition-colors shadow-lg flex items-center gap-2 font-medium"
      >
        <Palette size={20} />
        <span>Themes</span>
      </button>

      {showThemeSelector && (
        <ThemeSelector
          currentTheme={config.theme}
          onThemeChange={handleThemeChange}
          onClose={() => setShowThemeSelector(false)}
        />
      )}

      <StateControl
        isActive={isActive}
        currentState={currentState}
        onToggle={handleToggle}
        onStateChange={setCurrentState}
      />
    </div>
  );
}

export default App;
