import { Settings, Sliders, Minimize2 } from 'lucide-react';
import { useState } from 'react';
import { ColorTheme } from '../utils/colorUtils';

interface ControlPanelProps {
  intensity: number;
  particleDensity: number;
  reducedMotion: boolean;
  theme: ColorTheme;
  onIntensityChange: (value: number) => void;
  onParticleDensityChange: (value: number) => void;
  onReducedMotionChange: (value: boolean) => void;
  onThemeChange: (theme: ColorTheme) => void;
}


export function ControlPanel({
  intensity,
  particleDensity,
  reducedMotion,
  theme,
  onIntensityChange,
  onParticleDensityChange,
  onReducedMotionChange,
  onThemeChange
}: ControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute top-6 right-6 z-10">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-full hover:bg-gray-800/90 transition-colors shadow-lg"
        aria-label="Toggle settings"
      >
        {isExpanded ? <Minimize2 size={20} /> : <Settings size={20} />}
      </button>

      {isExpanded && (
        <div className="absolute top-14 right-0 bg-gray-900/95 backdrop-blur-md text-white p-6 rounded-2xl shadow-2xl w-80 border border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sliders size={18} />
            Controls
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Intensity: {intensity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={(e) => onIntensityChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Particle Density: {particleDensity}
              </label>
              <input
                type="range"
                min="20"
                max="150"
                step="10"
                value={particleDensity}
                onChange={(e) => onParticleDensityChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Reduced Motion</label>
              <button
                onClick={() => onReducedMotionChange(!reducedMotion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  reducedMotion ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reducedMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
