const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const numMolecules = 30; // Number of molecules
const moleculeRadius = 10; // Radius of each molecule
const maxSpeed = 2; // Maximum speed of the molecules

const molecules = [];

// Helper function to generate random numbers
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

// Van der Waals forces (simplified model)
function vanDerWaalsForce(distance) {
    const A = 0.5; // Attraction coefficient
    const B = 0.1; // Repulsion coefficient
    return A / (distance * distance) - B / (distance * distance * distance);
}

// Diatomic molecule object
class Molecule {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = moleculeRadius;
    }

    update() {
        // Update position based on velocity
        this.x += this.vx;
        this.y += this.vy;

        // Check for collision with walls
        if (this.x < this.radius || this.x > width - this.radius) {
            this.vx = -this.vx;
        }
        if (this.y < this.radius || this.y > height - this.radius) {
            this.vy = -this.vy;
        }

        // Apply Van der Waals force (simplified)
        for (let other of molecules) {
            if (other !== this) {
                const dx = other.x - this.x;
                const dy = other.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.radius * 4) { // Interaction within a certain range
                    const force = vanDerWaalsForce(distance);
                    this.vx -= force * (dx / distance);
                    this.vy -= force * (dy / distance);
                }
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    }
}

// Initialize molecules with random positions and velocities
for (let i = 0; i < numMolecules; i++) {
    const x = getRandom(moleculeRadius, width - moleculeRadius);
    const y = getRandom(moleculeRadius, height - moleculeRadius);
    const vx = getRandom(-maxSpeed, maxSpeed);
    const vy = getRandom(-maxSpeed, maxSpeed);
    molecules.push(new Molecule(x, y, vx, vy));
}

// Simulation loop
function update() {
    ctx.clearRect(0, 0, width, height);

    for (let molecule of molecules) {
        molecule.update();
        molecule.draw();
    }

    requestAnimationFrame(update);
}

update();
