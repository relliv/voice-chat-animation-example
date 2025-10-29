import { AudioFeatures } from '../audio/audioAnalyzer';
import { ParticleSystem } from './particles';
import { ColorManager, ColorTheme } from '../utils/colorUtils';

export type AnimationState = 'idle' | 'listening' | 'speaking' | 'processing';

export interface VisualizerConfig {
  intensity: number;
  particleDensity: number;
  reducedMotion: boolean;
  theme: ColorTheme;
}

export class Visualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particleSystem: ParticleSystem;
  private colorManager: ColorManager;
  private config: VisualizerConfig;
  private state: AnimationState = 'idle';
  private centerX = 0;
  private centerY = 0;
  private baseRadius = 60;
  private currentRadius = 60;
  private targetRadius = 60;
  private rotation = 0;
  private rings: Array<{ radius: number; offset: number; speed: number }> = [];
  private idleTime = 0;

  constructor(canvas: HTMLCanvasElement, config: VisualizerConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.config = config;
    this.colorManager = new ColorManager(config.theme);
    this.particleSystem = new ParticleSystem(config.particleDensity, 0, 0);

    this.initializeRings();
    this.resize();
    this.particleSystem.initialize();
  }

  private initializeRings(): void {
    this.rings = [
      { radius: 80, offset: 0, speed: 0.01 },
      { radius: 110, offset: Math.PI / 3, speed: 0.008 },
      { radius: 145, offset: Math.PI / 2, speed: 0.012 },
      { radius: 185, offset: Math.PI, speed: 0.006 }
    ];
  }

  resize(): void {
    this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    this.centerX = this.canvas.offsetWidth / 2;
    this.centerY = this.canvas.offsetHeight / 2;
    this.particleSystem.setCenter(this.centerX, this.centerY);
  }

  setState(state: AnimationState): void {
    this.state = state;
  }

  setConfig(config: Partial<VisualizerConfig>): void {
    this.config = { ...this.config, ...config };

    if (config.theme) {
      this.colorManager.setTheme(config.theme);
    }

    if (config.particleDensity !== undefined) {
      this.particleSystem.setMaxParticles(config.particleDensity);
    }
  }

  render(audioFeatures: AudioFeatures): void {
    this.clear();

    const { volume, bass, mid, treble, beatDetected, isVoiceActive } = audioFeatures;
    const intensity = this.config.intensity / 100;

    this.updateIdleTime(isVoiceActive);
    this.updateTargetRadius(volume, intensity);
    this.updateRotation(intensity);

    this.drawBackground(audioFeatures);
    this.drawRings(audioFeatures, intensity);
    this.drawCentralOrb(audioFeatures, intensity);

    if (!this.config.reducedMotion) {
      this.particleSystem.update(volume * intensity, beatDetected);
      this.particleSystem.draw(this.ctx);
    }
  }

  private clear(): void {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }

  private updateIdleTime(isVoiceActive: boolean): void {
    if (isVoiceActive) {
      this.idleTime = 0;
    } else {
      this.idleTime += 0.016;
    }
  }

  private updateTargetRadius(volume: number, intensity: number): void {
    const volumeScale = this.config.reducedMotion ? 1 : (1 + (volume / 100) * 0.8 * intensity);

    switch (this.state) {
      case 'idle':
        const breathe = Math.sin(this.idleTime * 0.5) * 0.05;
        this.targetRadius = this.baseRadius * (1 + breathe);
        break;
      case 'listening':
        this.targetRadius = this.baseRadius * volumeScale * 1.1;
        break;
      case 'speaking':
        this.targetRadius = this.baseRadius * volumeScale * 1.3;
        break;
      case 'processing':
        this.targetRadius = this.baseRadius * 1.2;
        break;
    }

    this.currentRadius += (this.targetRadius - this.currentRadius) * 0.15;
  }

  private updateRotation(intensity: number): void {
    if (this.state === 'processing') {
      this.rotation += 0.03;
    } else if (this.state !== 'idle') {
      this.rotation += 0.005 * intensity;
    }
  }

  private drawBackground(audioFeatures: AudioFeatures): void {
    const maxDimension = Math.max(this.canvas.offsetWidth, this.canvas.offsetHeight);
    const gradient = this.ctx.createRadialGradient(
      this.centerX, this.centerY, 0,
      this.centerX, this.centerY, maxDimension
    );

    const colors = this.colorManager.getBackgroundGradient(audioFeatures, this.state);
    gradient.addColorStop(0, colors.start);
    gradient.addColorStop(1, colors.end);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
  }

  private drawRings(audioFeatures: AudioFeatures, intensity: number): void {
    const { bass, mid, treble } = audioFeatures;
    const frequencyValues = [bass, mid, treble, (bass + treble) / 2];

    this.rings.forEach((ring, index) => {
      ring.offset += ring.speed * intensity;

      const freqValue = frequencyValues[index] || 0;
      const radiusModifier = this.config.reducedMotion ? 1 : (1 + (freqValue / 255) * 0.3 * intensity);
      const radius = ring.radius * radiusModifier;

      this.ctx.save();
      this.ctx.translate(this.centerX, this.centerY);
      this.ctx.rotate(ring.offset);

      const color = this.colorManager.getRingColor(index, audioFeatures, this.state);
      const opacity = this.state === 'idle' ? 0.3 : 0.4 + (freqValue / 255) * 0.3 * intensity;

      this.drawWavyRing(radius, color, opacity, ring.offset);

      this.ctx.restore();
    });
  }

  private drawWavyRing(radius: number, color: string, opacity: number, offset: number): void {
    this.ctx.beginPath();
    const segments = 64;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const wave = Math.sin(angle * 6 + offset * 10) * 3;
      const r = radius + wave;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.closePath();
    this.ctx.strokeStyle = color.replace('1)', `${opacity})`);
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private drawCentralOrb(audioFeatures: AudioFeatures, intensity: number): void {
    const { volume } = audioFeatures;
    const color = this.colorManager.getOrbColor(audioFeatures, this.state);

    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    this.ctx.rotate(this.rotation);

    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.currentRadius);
    gradient.addColorStop(0, color.replace('1)', '0.9)'));
    gradient.addColorStop(0.7, color.replace('1)', '0.6)'));
    gradient.addColorStop(1, color.replace('1)', '0)'));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.currentRadius, 0, Math.PI * 2);
    this.ctx.fill();

    const glowIntensity = this.config.reducedMotion ? 20 : 20 + (volume / 100) * 30 * intensity;
    this.ctx.shadowBlur = glowIntensity;
    this.ctx.shadowColor = color;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.currentRadius * 0.8, 0, Math.PI * 2);
    this.ctx.fillStyle = color.replace('1)', '0.8)');
    this.ctx.fill();

    this.ctx.restore();
  }
}
