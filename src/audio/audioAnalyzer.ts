export interface AudioFeatures {
  volume: number;
  frequencies: Uint8Array;
  bass: number;
  mid: number;
  treble: number;
  beatDetected: boolean;
  pitch: number;
  isVoiceActive: boolean;
}

export class AudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private volumeHistory: number[] = [];
  private beatThreshold = 1.3;
  private voiceThreshold = 30;
  private smoothingFactor = 0.8;

  constructor() {
    this.volumeHistory = new Array(10).fill(0);
  }

  async initialize(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = this.smoothingFactor;

      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);

      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    } catch (error) {
      console.error('Error initializing audio:', error);
      throw new Error('Failed to access microphone');
    }
  }

  getAudioFeatures(): AudioFeatures {
    if (!this.analyser || !this.dataArray) {
      return this.getEmptyFeatures();
    }

    this.analyser.getByteFrequencyData(this.dataArray);

    const volume = this.calculateVolume(this.dataArray);
    const bass = this.calculateFrequencyRange(this.dataArray, 0, 0.15);
    const mid = this.calculateFrequencyRange(this.dataArray, 0.15, 0.5);
    const treble = this.calculateFrequencyRange(this.dataArray, 0.5, 1);

    const beatDetected = this.detectBeat(volume);
    const pitch = this.estimatePitch(this.dataArray);
    const isVoiceActive = volume > this.voiceThreshold;

    this.volumeHistory.push(volume);
    if (this.volumeHistory.length > 10) {
      this.volumeHistory.shift();
    }

    return {
      volume,
      frequencies: new Uint8Array(this.dataArray),
      bass,
      mid,
      treble,
      beatDetected,
      pitch,
      isVoiceActive
    };
  }

  private calculateVolume(data: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return sum / data.length;
  }

  private calculateFrequencyRange(data: Uint8Array, startRatio: number, endRatio: number): number {
    const startIndex = Math.floor(data.length * startRatio);
    const endIndex = Math.floor(data.length * endRatio);
    let sum = 0;
    let count = 0;

    for (let i = startIndex; i < endIndex; i++) {
      sum += data[i];
      count++;
    }

    return count > 0 ? sum / count : 0;
  }

  private detectBeat(currentVolume: number): boolean {
    if (this.volumeHistory.length === 0) return false;

    const average = this.volumeHistory.reduce((a, b) => a + b, 0) / this.volumeHistory.length;
    return currentVolume > average * this.beatThreshold;
  }

  private estimatePitch(data: Uint8Array): number {
    let maxIndex = 0;
    let maxValue = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i] > maxValue) {
        maxValue = data[i];
        maxIndex = i;
      }
    }

    const nyquist = (this.audioContext?.sampleRate || 44100) / 2;
    const frequency = (maxIndex / data.length) * nyquist;
    return frequency;
  }

  private getEmptyFeatures(): AudioFeatures {
    return {
      volume: 0,
      frequencies: new Uint8Array(256),
      bass: 0,
      mid: 0,
      treble: 0,
      beatDetected: false,
      pitch: 0,
      isVoiceActive: false
    };
  }

  setVoiceThreshold(threshold: number): void {
    this.voiceThreshold = threshold;
  }

  dispose(): void {
    if (this.microphone) {
      this.microphone.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
