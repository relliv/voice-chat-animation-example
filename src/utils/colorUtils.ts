import { AudioFeatures } from '../audio/audioAnalyzer';
import { AnimationState } from '../animations/visualizer';

export type ColorTheme = 'cyberpunk' | 'ocean' | 'sunset' | 'matrix' | 'neon' | 'aurora' | 'fire' | 'midnight' | 'synthwave' | 'cosmic';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

const themes: Record<ColorTheme, ThemeColors> = {
  cyberpunk: {
    primary: 'rgba(236, 72, 153, 1)',    // hot pink
    secondary: 'rgba(59, 130, 246, 1)',  // blue
    accent: 'rgba(168, 85, 247, 1)',     // purple
    background: 'rgba(15, 23, 42, 1)'    // dark slate
  },
  ocean: {
    primary: 'rgba(34, 211, 238, 1)',    // cyan
    secondary: 'rgba(59, 130, 246, 1)',  // blue
    accent: 'rgba(147, 51, 234, 1)',     // deep purple
    background: 'rgba(3, 7, 18, 1)'      // deep blue-black
  },
  sunset: {
    primary: 'rgba(251, 146, 60, 1)',    // orange
    secondary: 'rgba(239, 68, 68, 1)',   // red
    accent: 'rgba(236, 72, 153, 1)',     // pink
    background: 'rgba(30, 27, 75, 1)'    // deep purple
  },
  matrix: {
    primary: 'rgba(34, 197, 94, 1)',     // green
    secondary: 'rgba(20, 184, 166, 1)',  // teal
    accent: 'rgba(163, 230, 53, 1)',     // lime
    background: 'rgba(0, 0, 0, 1)'       // black
  },
  neon: {
    primary: 'rgba(217, 70, 239, 1)',    // magenta
    secondary: 'rgba(20, 184, 166, 1)',  // teal
    accent: 'rgba(253, 224, 71, 1)',     // yellow
    background: 'rgba(17, 24, 39, 1)'    // dark gray
  },
  aurora: {
    primary: 'rgba(167, 139, 250, 1)',   // violet
    secondary: 'rgba(34, 211, 238, 1)',  // cyan
    accent: 'rgba(134, 239, 172, 1)',    // green
    background: 'rgba(15, 23, 42, 1)'    // slate
  },
  fire: {
    primary: 'rgba(239, 68, 68, 1)',     // red
    secondary: 'rgba(251, 146, 60, 1)',  // orange
    accent: 'rgba(253, 224, 71, 1)',     // yellow
    background: 'rgba(23, 23, 23, 1)'    // near black
  },
  midnight: {
    primary: 'rgba(96, 165, 250, 1)',    // light blue
    secondary: 'rgba(30, 64, 175, 1)',   // dark blue
    accent: 'rgba(191, 219, 254, 1)',    // sky blue
    background: 'rgba(12, 10, 25, 1)'    // deep midnight
  },
  synthwave: {
    primary: 'rgba(255, 0, 128, 1)',     // hot pink
    secondary: 'rgba(0, 255, 255, 1)',   // cyan
    accent: 'rgba(255, 255, 0, 1)',      // yellow
    background: 'rgba(20, 0, 40, 1)'     // deep purple-black
  },
  cosmic: {
    primary: 'rgba(139, 92, 246, 1)',    // violet
    secondary: 'rgba(236, 72, 153, 1)',  // pink
    accent: 'rgba(59, 130, 246, 1)',     // blue
    background: 'rgba(5, 5, 20, 1)'      // space black
  }
};

export class ColorManager {
  private theme: ColorTheme;
  private colors: ThemeColors;

  constructor(theme: ColorTheme = 'cyberpunk') {
    this.theme = theme;
    this.colors = themes[theme];
  }

  setTheme(theme: ColorTheme): void {
    this.theme = theme;
    this.colors = themes[theme];
  }

  getOrbColor(audioFeatures: AudioFeatures, state: AnimationState): string {
    const { bass, mid, treble } = audioFeatures;
    const total = bass + mid + treble;

    if (state === 'idle') {
      return this.colors.primary;
    }

    if (state === 'processing') {
      return this.colors.accent;
    }

    if (total === 0) {
      return this.colors.primary;
    }

    const bassRatio = bass / total;
    const midRatio = mid / total;
    const trebleRatio = treble / total;

    if (bassRatio > 0.5) {
      return this.colors.secondary;
    } else if (trebleRatio > 0.4) {
      return this.colors.accent;
    } else if (midRatio > 0.4) {
      return this.interpolateColors(this.colors.primary, this.colors.secondary, 0.5);
    }

    return this.colors.primary;
  }

  getRingColor(index: number, audioFeatures: AudioFeatures, state: AnimationState): string {
    const colorArray = [
      this.colors.primary,
      this.colors.secondary,
      this.colors.accent,
      this.interpolateColors(this.colors.primary, this.colors.accent, 0.5)
    ];

    return colorArray[index] || this.colors.primary;
  }

  getBackgroundGradient(audioFeatures: AudioFeatures, state: AnimationState): { start: string; end: string } {
    const baseAlpha = state === 'idle' ? 0.3 : 0.5 + (audioFeatures.volume / 255) * 0.3;

    return {
      start: this.addAlpha(this.colors.primary, baseAlpha * 0.1),
      end: this.colors.background
    };
  }

  private interpolateColors(color1: string, color2: string, ratio: number): string {
    const c1 = this.parseRgba(color1);
    const c2 = this.parseRgba(color2);

    const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
    const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
    const b = Math.round(c1.b + (c2.b - c1.b) * ratio);
    const a = c1.a + (c2.a - c1.a) * ratio;

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  private parseRgba(color: string): { r: number; g: number; b: number; a: number } {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
    if (!match) {
      return { r: 0, g: 0, b: 0, a: 1 };
    }

    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: match[4] ? parseFloat(match[4]) : 1
    };
  }

  private addAlpha(color: string, alpha: number): string {
    const rgba = this.parseRgba(color);
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
  }

  getThemeColors(): ThemeColors {
    return { ...this.colors };
  }
}
