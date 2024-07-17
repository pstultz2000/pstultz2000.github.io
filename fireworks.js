const canvas = document.createElement('canvas');
canvas.id = 'fireworksCanvas';
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Circle {
    constructor(x, y, radius, color, vx, vy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.vx = vx || Math.random() * 3 - 2;
        this.vy = vy || Math.random() * 3 - 2;
        this.alpha = 1; // Starting alpha value (fully opaque)
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha; // Use globalAlpha for transparency
        ctx.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.01; // Decrease alpha (fade out)
        if (this.alpha > 0) { // Only draw if alpha is positive
            this.draw();
        }
    }
}

let circles = [];

function addRandomFirework() {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    for (let i = 0; i < 10; i++) {
        let radius = Math.random() * 6 + 10;
        let color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        circles.push(new Circle(x, y, radius, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.022) { // Random chance to add a new firework
        addRandomFirework();
    }

    // Remove circles that have fully faded out
    circles = circles.filter(circle => circle.alpha > 0);

    circles.forEach(circle => {
        circle.update();
    });
}

animate();



