const canvas = document.getElementById('Canvas_Juego');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    /*ancho = canvas.width
    largo = canvas.height*/
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
const gravedad = 0.19;

class Player {
    constructor(position) {
        this.position = position;
        this.velocidad = {
            x: 0,
            y: 1
        };
        this.width = canvas.width * 0.07;
        this.height = canvas.height * 0.3;
        this.contadorSalto = 0;
    }

    dibujar() {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    actualizar() {
        this.width = canvas.width * 0.07;
        this.height = canvas.height * 0.28;
        //this.position.x = canvas.width * 0.07;
        //this.position.y = canvas.height * 0.3;
        this.dibujar();

        //Validacion de bordes
        if (this.position.x + this.velocidad.x < 0) {
            this.velocidad.x = 0;
        } else if (this.position.x + this.velocidad.x + this.width > canvas.width){
            this.velocidad.x = 0;
        }
        
        this.position.x += this.velocidad.x;
        this.position.y += this.velocidad.y;

        if(this.position.y+this.height+this.velocidad.y< canvas.height)
            this.velocidad.y+=gravedad;
        else{
            this.velocidad.y=0;
            this.contadorSalto=0;
        }

        if (this.position.y + this.height + this.velocidad.y < canvas.height) {
            this.velocidad.y += gravedad;
        } else {
            this.velocidad.y = 0;
        }
    
    }

    saltar() {
        if (this.contadorSalto < 2) {  
            this.velocidad.y = -10;
            this.contadorSalto++;  
        }
    }
}

class Enemy {
    constructor(position) {
        this.position = position;
        this.velocidad = {
            x: 0,
            y: 1
        };
        this.width = canvas.width * 0.07;
        this.height = canvas.height * 0.3;
        this.contadorSalto = 0;
        this.enSuelo = false;
        this.probabilidadSaltoDoble = 0.5;
        this.tiempoSiguienteSalto = 0;
    }

    dibujar() {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    actualizar() {
        this.width = canvas.width * 0.07;
        this.height = canvas.height * 0.28;
        //this.position.x = canvas.width * 0.07;
        //this.position.y = canvas.height * 0.3;

        const distanciaX = player.position.x - this.position.x;
        const distanciaY = player.position.y - this.position.y;
        const distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);

        if (this.position.y + this.height >= canvas.height) {
            this.enSuelo = true; 
            this.contadorSalto = 0; 
            this.velocidad.y = 0;
        } else {
            this.enSuelo = false; 
            this.velocidad.y += gravedad;
        }

        if (distancia > (canvas.width*0.07 + player.width*0.5)) {
            const velocidadX = (distanciaX / distancia) * 3.8; 
            const velocidadY = (distanciaY / distancia) * 2; 
            this.velocidad.x = velocidadX;
        } else {
            this.velocidad.x = 0;
        }

        if (this.tiempoSiguienteSalto <= 0) {
            if (Math.random() * 1 < this.probabilidadSaltoDoble) {
                this.saltar();
                this.saltar();
            } else {
                this.saltar();
            }
            this.tiempoSiguienteSalto = Math.random() * 7000 + 2000;
        } else {
            this.tiempoSiguienteSalto -= 16;
        }

        this.dibujar();

        //Validacion de bordes
        if (this.position.x + this.velocidad.x < 0) {
            this.velocidad.x = 0;
        } else if (this.position.x + this.velocidad.x + this.width > canvas.width){
            this.velocidad.x = 0;
        }
        
        this.position.x += this.velocidad.x;
        this.position.y += this.velocidad.y;

        if(this.position.y+this.height+this.velocidad.y< canvas.height)
            this.velocidad.y+=gravedad;
        else{
            this.velocidad.y=0;
            this.contadorSalto=0;
        }

        if (this.position.y + this.height + this.velocidad.y < canvas.height) {
            this.velocidad.y += gravedad;
        } else {
            this.velocidad.y = 0;
        }

        
    }

    saltar() {
        if (this.contadorSalto < 2 && this.enSuelo) {  
            this.velocidad.y = -15;
            this.contadorSalto++;
            this.enSuelo = false; 
        }
    }
}

const player = new Player({ x: 1, y: (canvas.height - canvas.height * 0.72)});
const enemy = new Enemy({ x: window.innerWidth - (window.innerWidth * 0.07), y: (canvas.height - canvas.height * 0.72)});

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
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.actualizar();
    player.actualizar();
    enemy.actualizar();
    player.velocidad.x = 0;
    enemy.velocidad.x = 0;

    if (keys.d.pressed) {
        player.velocidad.x = 5;
    } else if (keys.a.pressed) {
        player.velocidad.x = -5;
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
            player.saltar();
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
