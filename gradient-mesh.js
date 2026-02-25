// Combined gradient mesh and particle system for hero section
class HeroAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.blobs = [];
    this.resize();
    this.init();

    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });
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

    // Color palette
    const colors = [
      { r: 90, g: 154, b: 154 },   // teal
      { r: 184, g: 88, b: 122 },   // magenta
      { r: 168, g: 188, b: 181 }   // sage
    ];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const color = colors[i % colors.length];
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 2 + Math.random() * 2,
        color: color
      });
    }

    // Create subtle gradient blobs
    const blobColors = [
      { r: 90, g: 154, b: 154, a: 0.06 },   // teal
      { r: 184, g: 88, b: 122, a: 0.06 },   // magenta
      { r: 168, g: 188, b: 181, a: 0.05 }   // sage
    ];

    for (let i = 0; i < blobCount; i++) {
      this.blobs.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 180 + Math.random() * 120,
        color: blobColors[i]
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

      if (blob.x < 0 || blob.x > this.canvas.width) blob.vx *= -1;
      if (blob.y < 0 || blob.y > this.canvas.height) blob.vy *= -1;

      blob.x = Math.max(0, Math.min(this.canvas.width, blob.x));
      blob.y = Math.max(0, Math.min(this.canvas.height, blob.y));

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

      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

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
