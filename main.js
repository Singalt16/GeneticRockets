const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const geneSize = 25;
const popSize = 100;
let count = 0;

function Target(x, y, w, h) {
    this.width = w;
    this.height = h;
    this.position = new Vector(x, y);

    this.draw = () => {
        context.globalAlpha = 0.6;
        context.fillStyle = 'blue';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

function Obstacle(x, y, w, h) {
    this.width = w;
    this.height = h;
    this.position = new Vector(x, y);

    this.draw = () => {
        context.globalAlpha = 0.4;
        context.fillStyle = 'black';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

let target = new Target(1200, 600, 100, 100);
let obstacles = [];
obstacles.push(new Obstacle(300, canvas.height/2 - 100, 50, 600));
obstacles.push(new Obstacle(700, 0, 50, 350));
obstacles.push(new Obstacle(900, 500, 50, 200));

function DNA() {
    this.genes = [];

    // sets the genes in the DNA to random vectors
    this.randomizeGenes = () => {
        if (this.genes.length > 0) this.genes = [];
        for (let i = 0; i < geneSize; i++) {
            this.genes.push(new Vector((Math.random() - 0.5) / 3, (Math.random() - 0.5)/3));
        }
    };

    this.setGenes = genes => this.genes = genes;
}

/**
 * Single rocket object
 * @param x
 * @param y
 */
function Rocket(x, y) {
    this.width = 20;
    this.height = 5;
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.force = new Vector(0, 0);
    this.dna = new DNA();
    this.dead = false;
    this.success = false;
    this.fitness = 0;

    this.initiate = () => this.dna.randomizeGenes();


    // breeds two parent rockets' DNAs to set the DNA for the rocket
    this.breed = (dna1, dna2) => {
        let genes = [];
        let firstParentFraction = Math.floor(Math.random() * 25);
        for (let i = 0; i < firstParentFraction; i++) {
            if (Math.random() < 0.5 / (Math.sqrt(i+20))) { // mutation
                genes[i] = new Vector((Math.random() - 0.5) / 3, (Math.random() - 0.5)/3);
            } else {
                genes[i] = dna1.genes[i];
            }
        }
        for (let i = firstParentFraction; i < geneSize; i++) {
            if (Math.random() < 0.5 / (Math.sqrt(i+20))) { // mutation
                genes[i] = new Vector((Math.random() - 0.5) / 3, (Math.random() - 0.5)/3);
            } else {
                genes[i] = dna2.genes[i];
            }
        }
        this.dna.setGenes(genes);
    };

    this.findFitness = () => {
        let fitness = 0;
        if (!this.dead) {
            fitness = Math.pow(1000 / Vector.difference(this.position, target.position).magnitude, 1.5);
        } else {
            fitness = 1000 / Vector.difference(this.position, target.position).magnitude;
        }
        if (this.success) fitness *= 3;
        if (fitness > this.fitness) this.fitness = fitness;
    };

    // updates rocket's physics
    this.update = () => {
        if (this.position.x + this.width > canvas.width     ||
            this.position.x < 0                             ||
            this.position.y + this.height > canvas.height   ||
            this.position.y < 0) {
            this.dead = true;
        }

        for (let obstacle of obstacles) {
            if (this.position.x + this.width > obstacle.position.x          &&
                this.position.x < obstacle.position.x + obstacle.width      &&
                this.position.y + this.height > obstacle.position.y         &&
                this.position.y < obstacle.position.y + obstacle.height) {
                this.dead = true;
            }
        }

        if (this.position.x + this.width > target.position.x          &&
            this.position.x < target.position.x + target.width      &&
            this.position.y + this.height > target.position.y         &&
            this.position.y < target.position.y + target.height) {
            this.success = true;
        }

        if (!this.dead && !this.success) {
            this.position.add(this.velocity);
            this.velocity.add(this.acceleration);
            this.acceleration.set(this.force);
            this.force.set(this.dna.genes[count]);
        }
    };

    this.draw = () => {
        let angle = this.velocity.angle;
        context.translate(this.position.x + this.width/2, this.position.y + this.height/2);
        context.rotate(-angle);
        context.globalAlpha = 0.4;
        context.fillStyle = 'black';
        if (this.success) context.fillStyle = 'green';
        else if (this.dead) context.fillStyle = 'red';
        context.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        context.rotate(angle);
        context.translate(-this.position.x  - this.width/2, -this.position.y - this.height/2);
    }
}

/**
 * Population containing multiple rockets
 */
function Population() {

    this.rockets = [];

    // creates initial rockets
    this.populate = () => {
        if (this.rockets.length > 0) this.rockets = [];
        for (let i = 0; i < popSize; i++) {
            this.rockets[i] = new Rocket(30, canvas.height/2);
            this.rockets[i].initiate();
        }
    };

    this.evaluate = () => {
        for (let rocket of this.rockets) {
            rocket.findFitness();
        }
    };

    // replaces rockets in current population with new bred rockets
    this.repopulate = () => {
        console.log('repopulating');
        let breedingPool = [];
        for (let rocket of this.rockets) {
            for (let i = 0; i < rocket.fitness; i++) {
                breedingPool.push(rocket);
            }
        }

        let newPop = [];
        for (let i = 0; i < popSize; i++) {
            let parent1 = breedingPool[Math.floor(Math.random() * breedingPool.length)];
            let parent2 = breedingPool[Math.floor(Math.random() * breedingPool.length)];
            let child = new Rocket(30, canvas.height/2);
            child.breed(parent1.dna, parent2.dna);
            newPop.push(child);
        }
        this.rockets = newPop;
    };

    // updates every rocket in the population
    this.update = () => {
        for (let rocket of this.rockets) {
            rocket.update();
        }
    };

    // draws every rocket in the population
    this.draw = () => {
        for (let rocket of this.rockets) {
            rocket.draw();
        }
    };
}

let pop = new Population();
pop.populate();

let frame = 0;
function animate() {
    requestAnimationFrame(animate);
    if (frame % 15 === 0) count++;
    if (count >= geneSize) {
        count = 0;
        pop.repopulate();
    }
    pop.update();
    pop.evaluate();
    context.clearRect(0, 0, canvas.width, canvas.height);
    pop.draw();
    target.draw();
    obstacles.forEach(o => o.draw());
    frame++;
}

animate();