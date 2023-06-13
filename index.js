const canvas = document.getElementById('Canvas_Juego');
const ctx = canvas.getContext('2d');

const personajeProporcion = 0.1;
let personajeTamanio = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    personajeTamanio = canvas.width * personajeProporcion;
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();

const gravedad = 0.1;

class Player {
    constructor(position) {
        this.position = position;
        this.velocidad = {
            x: 0,
            y: 1
        };
        this.height = personajeTamanio;
    }

    dibujar() {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.position.x, this.position.y, 10, this.height);
    }

    actualizar() {
        this.dibujar();
        this.position.x += this.velocidad.x;
        this.position.y += this.velocidad.y;

        if (this.position.y + this.height + this.velocidad.y < canvas.height) {
            this.velocidad.y += gravedad;
        } else {
            this.velocidad.y = 0;
        }
    }
}

const player = new Player({ x: 1, y: 1 });

class Sprite {
    constructor({ position, imagenSrc }) {
        this.position = position;
        this.image = new Image();
        this.image.src = imagenSrc;
    }

    dibujar() {
        if (!this.image) return;
        ctx.drawImage(this.image, this.position.x, this.position.y, canvas.width, canvas.height);
    }

    actualizar() {
        this.dibujar();
    }
}

const background = new Sprite({
    position: { x: 0, y: 0 },
    imagenSrc: './Imagenes/origbig2.png',
});

const keys = {
    d: { pressed: false },
    a: { pressed: false },
};

function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    background.actualizar();
    player.actualizar();
    player.velocidad.x = 0;

    if (keys.d.pressed) {
        player.velocidad.x = 3;
    } else if (keys.a.pressed) {
        player.velocidad.x = -3;
    }

    requestAnimationFrame(animar);
}

animar();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case 'w':
            player.velocidad.y = -4;
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
    }
});
