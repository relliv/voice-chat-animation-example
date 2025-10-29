import { X, Check } from 'lucide-react';
import { ColorTheme } from '../utils/colorUtils';

interface ThemeSelectorProps {
  currentTheme: ColorTheme;
  onThemeChange: (theme: ColorTheme) => void;
  onClose: () => void;
}

interface ThemeOption {
  value: ColorTheme;
  label: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
}

const themeOptions: ThemeOption[] = [
  {
    value: 'cyberpunk',
    label: 'Cyberpunk',
    description: 'Neon-lit dystopian future',
    primaryColor: '#ec4899',
    secondaryColor: '#3b82f6',
    accentColor: '#a855f7',
    bgColor: '#0f172a'
  },
  {
    value: 'ocean',
    label: 'Ocean',
    description: 'Deep sea tranquility',
    primaryColor: '#22d3ee',
    secondaryColor: '#3b82f6',
    accentColor: '#9333ea',
    bgColor: '#030712'
  },
  {
    value: 'sunset',
    label: 'Sunset',
    description: 'Warm evening horizon',
    primaryColor: '#fb923c',
    secondaryColor: '#ef4444',
    accentColor: '#ec4899',
    bgColor: '#1e1b4b'
  },
  {
    value: 'matrix',
    label: 'Matrix',
    description: 'Digital green code',
    primaryColor: '#22c55e',
    secondaryColor: '#14b8a6',
    accentColor: '#a3e635',
    bgColor: '#000000'
  },
  {
    value: 'neon',
    label: 'Neon',
    description: 'Electric city lights',
    primaryColor: '#d946ef',
    secondaryColor: '#14b8a6',
    accentColor: '#fde047',
    bgColor: '#111827'
  },
  {
    value: 'aurora',
    label: 'Aurora',
    description: 'Northern lights magic',
    primaryColor: '#a78bfa',
    secondaryColor: '#22d3ee',
    accentColor: '#86efac',
    bgColor: '#0f172a'
  },
  {
    value: 'fire',
    label: 'Fire',
    description: 'Blazing hot flames',
    primaryColor: '#ef4444',
    secondaryColor: '#fb923c',
    accentColor: '#fde047',
    bgColor: '#171717'
  },
  {
    value: 'midnight',
    label: 'Midnight',
    description: 'Quiet night sky',
    primaryColor: '#60a5fa',
    secondaryColor: '#1e40af',
    accentColor: '#bfdbfe',
    bgColor: '#0c0a19'
  },
  {
    value: 'synthwave',
    label: 'Synthwave',
    description: 'Retro 80s vibes',
    primaryColor: '#ff0080',
    secondaryColor: '#00ffff',
    accentColor: '#ffff00',
    bgColor: '#140028'
  },
  {
    value: 'cosmic',
    label: 'Cosmic',
    description: 'Deep space mystery',
    primaryColor: '#8b5cf6',
    secondaryColor: '#ec4899',
    accentColor: '#3b82f6',
    bgColor: '#050514'
  }
];

export function ThemeSelector({ currentTheme, onThemeChange, onClose }: ThemeSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gray-900/98 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700/50">
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h2 className="text-2xl font-bold text-white">Color Themes</h2>
            <p className="text-sm text-gray-400 mt-1">Choose your visual experience</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            aria-label="Close theme selector"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themeOptions.map((theme) => (
              <button
                key={theme.value}
                onClick={() => {
                  onThemeChange(theme.value);
                  onClose();
                }}
                className={`relative group p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                  currentTheme === theme.value
                    ? 'border-white bg-gray-800/50 shadow-lg'
                    : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/40'
                }`}
              >
                {currentTheme === theme.value && (
                  <div className="absolute top-3 right-3 bg-white text-gray-900 rounded-full p-1">
                    <Check size={16} />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg">
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 50%, ${theme.accentColor} 100%)`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
                    </div>
                    <div className="flex gap-1 mt-2">
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: theme.secondaryColor }}
                      />
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {theme.label}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {theme.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: `${theme.primaryColor}20`,
                          color: theme.primaryColor
                        }}
                      >
                        Primary
                      </span>
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: `${theme.secondaryColor}20`,
                          color: theme.secondaryColor
                        }}
                      >
                        Secondary
                      </span>
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: `${theme.accentColor}20`,
                          color: theme.accentColor
                        }}
                      >
                        Accent
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}10 0%, ${theme.secondaryColor}10 50%, ${theme.accentColor}10 100%)`
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
