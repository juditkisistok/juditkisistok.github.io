// Elegant animated gradient mesh for hero section
class GradientMesh {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.blobs = [];
    this.resize();
    this.init();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  init() {
    // Create gradient blob points with your color palette
    const colors = [
      { r: 90, g: 154, b: 154, a: 0.12 },   // teal
      { r: 184, g: 88, b: 122, a: 0.12 },   // magenta
      { r: 168, g: 188, b: 181, a: 0.1 },  // sage
      { r: 90, g: 154, b: 154, a: 0.12 },    // teal variant
      { r: 184, g: 88, b: 122, a: 0.12 }    // magenta variant
    ];

    for (let i = 0; i < 5; i++) {
      this.blobs.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: 200 + Math.random() * 150,
        color: colors[i]
      });
    }

    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw blobs
    this.blobs.forEach(blob => {
      // Move blob
      blob.x += blob.vx;
      blob.y += blob.vy;

      // Bounce off edges
      if (blob.x < 0 || blob.x > this.canvas.width) blob.vx *= -1;
      if (blob.y < 0 || blob.y > this.canvas.height) blob.vy *= -1;

      // Keep within bounds
      blob.x = Math.max(0, Math.min(this.canvas.width, blob.x));
      blob.y = Math.max(0, Math.min(this.canvas.height, blob.y));

      // Draw blob with radial gradient
      const gradient = this.ctx.createRadialGradient(
        blob.x, blob.y, 0,
        blob.x, blob.y, blob.radius
      );

      gradient.addColorStop(0, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, ${blob.color.a})`);
      gradient.addColorStop(1, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0)`);

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gradient-mesh');
  if (canvas) {
    new GradientMesh(canvas);
  }
});
