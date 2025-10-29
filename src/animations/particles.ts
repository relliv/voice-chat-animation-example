export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  angle: number;
  distance: number;
  color: string;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private maxParticles: number;
  private centerX: number;
  private centerY: number;

  constructor(maxParticles = 80, centerX = 0, centerY = 0) {
    this.maxParticles = maxParticles;
    this.centerX = centerX;
    this.centerY = centerY;
  }

  initialize(): void {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 120;
    const x = this.centerX + Math.cos(angle) * distance;
    const y = this.centerY + Math.sin(angle) * distance;

    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.5,
      life: Math.random() * 100,
      maxLife: 100 + Math.random() * 100,
      angle,
      distance,
      color: this.getRandomColor()
    };
  }

  private getRandomColor(): string {
    const colors = [
      'rgba(59, 130, 246, 0.8)',   // blue
      'rgba(147, 51, 234, 0.8)',   // purple
      'rgba(236, 72, 153, 0.8)',   // pink
      'rgba(34, 211, 238, 0.8)',   // cyan
      'rgba(168, 85, 247, 0.8)'    // violet
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update(audioVolume: number, beatDetected: boolean): void {
    const volumeMultiplier = 1 + (audioVolume / 100) * 2;

    this.particles.forEach((particle, index) => {
      particle.life += 1;

      if (particle.life >= particle.maxLife) {
        this.particles[index] = this.createParticle();
        return;
      }

      const orbitSpeed = 0.002 * volumeMultiplier;
      particle.angle += orbitSpeed;

      const targetX = this.centerX + Math.cos(particle.angle) * particle.distance;
      const targetY = this.centerY + Math.sin(particle.angle) * particle.distance;

      particle.x += (targetX - particle.x) * 0.05;
      particle.y += (targetY - particle.y) * 0.05;

      particle.x += particle.vx * volumeMultiplier;
      particle.y += particle.vy * volumeMultiplier;

      if (beatDetected) {
        particle.size = Math.min(particle.size * 1.5, 8);
        particle.opacity = Math.min(particle.opacity * 1.3, 1);
      } else {
        particle.size = Math.max(particle.size * 0.98, 1);
        particle.opacity = Math.max(particle.opacity * 0.99, 0.3);
      }

      const lifeRatio = particle.life / particle.maxLife;
      particle.opacity *= (1 - lifeRatio * 0.5);
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;

      ctx.shadowBlur = 10;
      ctx.shadowColor = particle.color;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  setCenter(x: number, y: number): void {
    const dx = x - this.centerX;
    const dy = y - this.centerY;

    this.centerX = x;
    this.centerY = y;

    this.particles.forEach(particle => {
      particle.x += dx;
      particle.y += dy;
    });
  }

  setMaxParticles(count: number): void {
    this.maxParticles = count;
    while (this.particles.length < this.maxParticles) {
      this.particles.push(this.createParticle());
    }
    while (this.particles.length > this.maxParticles) {
      this.particles.pop();
    }
  }
}
