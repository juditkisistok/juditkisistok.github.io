// Combined gradient mesh and particle system for hero section
class HeroAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.blobs = [];
    this.colors = [
      { r: 90, g: 154, b: 154 },
      { r: 184, g: 88, b: 122 },
      { r: 168, g: 188, b: 181 }
    ];
    this.resize();
    this.init();

    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });
  }

  constrainToBounds(obj) {
    if (obj.x < 0 || obj.x > this.canvas.width) obj.vx *= -1;
    if (obj.y < 0 || obj.y > this.canvas.height) obj.vy *= -1;
    obj.x = Math.max(0, Math.min(this.canvas.width, obj.x));
    obj.y = Math.max(0, Math.min(this.canvas.height, obj.y));
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  init() {
    this.particles = [];
    this.blobs = [];

    const particleCount = 12;
    const blobCount = 3;

    for (let i = 0; i < particleCount; i++) {
      const color = this.colors[i % this.colors.length];
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 2 + Math.random() * 2,
        color: color
      });
    }

    for (let i = 0; i < blobCount; i++) {
      this.blobs.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 180 + Math.random() * 120,
        color: { ...this.colors[i], a: i === 2 ? 0.05 : 0.06 }
      });
    }

    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw gradient blobs first (background layer)
    this.blobs.forEach(blob => {
      blob.x += blob.vx;
      blob.y += blob.vy;
      this.constrainToBounds(blob);

      const gradient = this.ctx.createRadialGradient(
        blob.x, blob.y, 0,
        blob.x, blob.y, blob.radius
      );

      gradient.addColorStop(0, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, ${blob.color.a})`);
      gradient.addColorStop(1, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0)`);

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    });

    // Update and draw particles
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      this.constrainToBounds(particle);

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.4)`;
      this.ctx.fill();
    });

    // Draw connecting lines
    const maxDistance = 180;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.15;

          const gradient = this.ctx.createLinearGradient(
            this.particles[i].x, this.particles[i].y,
            this.particles[j].x, this.particles[j].y
          );
          gradient.addColorStop(0, `rgba(${this.particles[i].color.r}, ${this.particles[i].color.g}, ${this.particles[i].color.b}, ${opacity})`);
          gradient.addColorStop(1, `rgba(${this.particles[j].color.r}, ${this.particles[j].color.g}, ${this.particles[j].color.b}, ${opacity})`);

          this.ctx.beginPath();
          this.ctx.strokeStyle = gradient;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gradient-mesh');
  if (canvas) {
    new HeroAnimation(canvas);
  }
});
