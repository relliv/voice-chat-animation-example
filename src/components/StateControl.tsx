import { Mic, MicOff, Radio, MessageSquare, Loader2 } from 'lucide-react';
import { AnimationState } from '../animations/visualizer';

interface StateControlProps {
  isActive: boolean;
  currentState: AnimationState;
  onToggle: () => void;
  onStateChange: (state: AnimationState) => void;
}

export function StateControl({ isActive, currentState, onToggle, onStateChange }: StateControlProps) {
  const stateButtons: { state: AnimationState; label: string; icon: React.ReactNode }[] = [
    { state: 'idle', label: 'Idle', icon: <Radio size={18} /> },
    { state: 'listening', label: 'Listening', icon: <Mic size={18} /> },
    { state: 'speaking', label: 'Speaking', icon: <MessageSquare size={18} /> },
    { state: 'processing', label: 'Processing', icon: <Loader2 size={18} className="animate-spin" /> }
  ];

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggle}
            className={`p-4 rounded-xl font-semibold transition-all shadow-lg ${
              isActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isActive ? (
              <div className="flex items-center gap-2">
                <MicOff size={20} />
                <span>Stop</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Mic size={20} />
                <span>Start</span>
              </div>
            )}
          </button>

          {isActive && (
            <>
              <div className="w-px h-12 bg-gray-700" />
              <div className="flex gap-2">
                {stateButtons.map(({ state, label, icon }) => (
                  <button
                    key={state}
                    onClick={() => onStateChange(state)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      currentState === state
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
