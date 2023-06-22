const canvas = document.getElementById('Canvas_Juego');
const ctx = canvas.getContext('2d');

class CollisionBlock{
    constructor({position, width, height}){
        this.position = position
        this.width = width
        this.height = height
    }
    
    draw(){
        ctx.fillStyle = 'rgba(255, 0, 0, 0)'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    actualizar() {
        this.draw();
    }
}

const colisiones = [];
const collisionblocks = [];

for(let i = 0; i < plataformas.length; i+=30){
    colisiones.push(plataformas.slice(i, i + 30))
}

colisiones.forEach((fila, y)=>{
    fila.forEach((simbolo, x)=>{
        width = window.innerWidth/30
        height = window.innerHeight/20
        if(simbolo != 0){
            collisionblocks.push(
                new CollisionBlock({position:{
                    x: x * width,
                    y: y * height
                }, width, height})
            )
        }
    })
})

function resizeCanvas() {
    /*ancho = canvas.width
    largo = canvas.height*/
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    collisionblocks.length = 0;
    colisiones.forEach((fila, y)=>{
        fila.forEach((simbolo, x)=>{
            width = window.innerWidth/30
            height = window.innerHeight/20
            if(simbolo != 0){
                collisionblocks.push(
                    new CollisionBlock({position:{
                        x: x * width,
                        y: y * height
                    }, width, height})
                )
            }
        })
    })
    
}

window.addEventListener('resize', resizeCanvas);
const gravedad = 0.15;

class Player {
    constructor(position, collisionblocks,scale=1,imagenSrc,framesMax=1,offset={x:0,y:0},sprites) {
        this.position = position;
        this.velocidad = {
            x: 0,
            y: 1
        };
        this.width = canvas.width * 0.07;
        this.height = canvas.height * 0.28;
        this.contadorSalto = 0;
        this.collisionblocks = collisionblocks;
        this.image = new Image();
        this.image.src = imagenSrc;
        this.scale=scale;
        this.framesMax= framesMax;
        this.frameCurrent=0;
        this.framesTiempo=0;
        this.framesTiempoMax=10;
        this.offset=offset;
        this.sprites=sprites;
        this.isAttacking
        this.attackBox = {
            position: this.position,
            width: this.width*6,
            height: this.height*0.8
        }
        for(const sprite in sprites){
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imagenSrc;
        }
    }

    dibujar() {
        if (this.isAttacking){
            ctx.fillStyle = 'red'
            ctx.fillRect(this.attackBox.position.x+this.width*0.55, this.attackBox.position.y+this.height/1.5, this.attackBox.width-this.height*0.1, this.attackBox.height)
        }
        ctx.drawImage(
            this.image,
            this.frameCurrent * (this.image.width/this.framesMax) ,
            0,
            this.image.width/this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width/this.framesMax) * this.scale,
            this.image.height * this.scale,
       );
        

    }
    AnimarFrames(){
        this.framesTiempo++

        if(this.framesTiempo % this.framesTiempoMax === 0){
        if(this.frameCurrent<this.framesMax-1){
         this.frameCurrent++   
        }
        else{
            this.frameCurrent=0
        }
    }
    }
    actualizar() {
        this.width = canvas.width * 0.07;
        this.height = canvas.height * 0.28;
        //this.position.x = canvas.width * 0.07;
        //this.position.y = canvas.height * 0.3;
        this.dibujar();
        this.AnimarFrames();

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
        this.revisarCollisionVertical();
    }

    saltar() {
        if (this.contadorSalto < 2) {  
            this.velocidad.y = -10;
            this.contadorSalto++;  
        }
    }

    revisarCollisionVertical(){
        for(let i = 0; i < this.collisionblocks.length; i++){
            const bloque = this.collisionblocks[i];
            if (this.position.y + this.height >= bloque.position.y &&
                this.position.y  + this.height <= bloque.position.y + bloque.height &&
                this.position.x <= bloque.position.x + bloque.width &&
                this.position.x + this.width >= bloque.position.x 
                ){
                    if (this.velocidad.y > 0){
                        this.velocidad.y = 0
                        this.position.y = bloque.position.y - this.height - 0.1
                        this.contadorSalto = 0;
                        break
                    }
                }
        }
    }
    cambiarSprite(sprite){
        switch(sprite){
            case 'normal':
                if(this.image!==this.sprites.normal.image){
                    this.image = this.sprites.normal.image;
                    this.framesMax = this.sprites.normal.framesMax;
                    this.framesTiempoMax=10;
                }
                
                break;
            case 'correr':
                if(this.image!==this.sprites.correr.image){
                    this.image = this.sprites.correr.image;
                    this.framesMax = this.sprites.correr.framesMax;
                    this.framesTiempoMax=5
                }
                
                break;
            case 'ataca':
                if (this.image !== this.sprites.ataca.image){
                    this.image = this.sprites.ataca.image;
                    this.framesMax = this.sprites.ataca.framesMax;
                }
                break;
        
        }
    }

    attack(){
        this.isAttacking=true
        setTimeout(() => {
            this.isAttacking=false
        }, 100)
    }
}

class Enemy {
    constructor(position,collisionblocks, scale=1,imagenSrc,framesMax=1,offset={x:0,y:0},sprites) {
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
        this.collisionblocks=collisionblocks
        this.tiempoSiguienteSalto = 0;
        this.image = new Image();
        this.image.src = imagenSrc;
        this.scale=scale;
        this.framesMax= framesMax;
        this.frameCurrent=0;
        this.framesTiempo=0;
        this.framesTiempoMax=10;
        this.offset=offset;
        this.sprites=sprites;
        this.isAttacking
        this.attackBox = {
            position: this.position,
            width: this.width*6,
            height: this.height*0.8 
        }
        for(const sprite in sprites){
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imagenSrc;
        }

    }

    dibujar() {
        if (this.isAttacking){
            ctx.fillStyle = 'red'
            ctx.fillRect(this.attackBox.position.x-this.width*0.55, this.attackBox.position.y+this.height/1.5, this.attackBox.width-this.height*0.1, this.attackBox.height)
        }
       ctx.drawImage(
            this.image,
            this.frameCurrent * (this.image.width/this.framesMax) ,
            0,
            this.image.width/this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width/this.framesMax) * this.scale,
            this.image.height * this.scale,
       );

    }
    AnimarFrames(){
        this.framesTiempo++

        if(this.framesTiempo % this.framesTiempoMax === 0){
        if(this.frameCurrent<this.framesMax-1){
         this.frameCurrent++   
        }
        else{
            this.frameCurrent=0
        }
    }
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
            const probabilidadSaltoDoble = Math.random();
            if (probabilidadSaltoDoble <= this.probabilidadSaltoDoble) {
                this.saltar();
                this.saltar();
            } else {
                this.saltar();
            }
            this.tiempoSiguienteSalto = Math.random() * 7000 + 2000;
        } else {
            this.tiempoSiguienteSalto -= 16;
        }

        const distanciaAtaqueX = player.position.x - this.position.x;
        const distanciaAtaqueY = player.position.y - this.position.y;
        const distanciaAtaque = Math.sqrt(
            distanciaAtaqueX * distanciaAtaqueX + distanciaAtaqueY * distanciaAtaqueY
        );

        if (distanciaAtaque <= this.attackBox.width && enemy.position.x+enemy.width*0.15 >= player.position.x+player.width*0.4) {
            const probabilidadAtaque = Math.random();
            if (probabilidadAtaque <= 1.0) {
                this.attack(); 
            }
        }

        this.dibujar();
        this.AnimarFrames();

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
        this.revisarCollisionVertical()
        
    }

    saltar() {
        if (this.contadorSalto < 2 && this.enSuelo) {  
            this.velocidad.y = -10;
            this.contadorSalto++;
            this.enSuelo = false; 
        }
    }

    revisarCollisionVertical(){
        for(let i = 0; i < this.collisionblocks.length; i++){
            const bloque = this.collisionblocks[i];
            if (this.position.y + this.height >= bloque.position.y &&
                this.position.y  + this.height <= bloque.position.y + bloque.height &&
                this.position.x <= bloque.position.x + bloque.width &&
                this.position.x + this.width >= bloque.position.x 
                ){
                    if (this.velocidad.y > 0){
                        this.velocidad.y = 0
                        this.position.y = bloque.position.y - this.height - 0.1
                        this.contadorSalto = 0;
                        break
                    }
                }
        }
    }

    cambiarSprite(sprite){
        switch(sprite){
            case 'normal':
                if(this.image!==this.sprites.normal.image){
                    this.image = this.sprites.normal.image;
                    this.framesMax = this.sprites.normal.framesMax;
                    this.framesTiempoMax=10;
                }
                
                break;
            case 'correr':
                if(this.image!==this.sprites.correr.image){
                    this.image = this.sprites.correr.image;
                    this.framesMax = this.sprites.correr.framesMax;
                    this.framesTiempoMax=5
                }
                
                break;
            case 'ataca':
                if (this.image !== this.sprites.ataca.image){
                    this.image = this.sprites.ataca.image;
                    this.framesMax = this.sprites.ataca.framesMax;
                }
                break;
        
        }
    }

    attack(){
        this.isAttacking=true
        setTimeout(() => {
            this.isAttacking=false
        }, 100)
    }
}


class PowerUp {
    constructor(position, duration, effect,imageSrc,) {
      this.position = position;
      this.width = canvas.width * 0.03;
      this.height = canvas.width * 0.03;
      this.duration = duration;
      this.effect = effect;
      this.image = new Image();
      this.image.src = imageSrc;
    }
  
    draw() {
        ctx.drawImage(
            this.image,
            this.image.width/this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width/this.framesMax) * this.scale,
            this.image.height * this.scale,
       );
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

    }
    actualizar() {
        this.draw();
        setInterval(this.draw(), 200000);
    }
  }
  
  const powerUp = new PowerUp({
    x: 5, y: (canvas.height - canvas.height * 0.72),
    duration: 10000,
    effect: 'correrRapido',
    imageSrc: './Imagenes/apple.png',
});
const player = new Player({
     x: 1, y: (canvas.height - canvas.height * 0.72)}, 
     collisionblocks, 
     scale=6, 
     './Imagenes/LempiraNormal.png',
     framesMax=6,
     offset={x:90,y:-25},
     sprites= {
        normal:{
            imagenSrc:'./Imagenes/LempiraNormal.png',
            framesMax:6,
        },
        correr:{
            imagenSrc:'./Imagenes/LempiraCorriendo.png',
            framesMax:8,
            framesTiempoMax:8
        },
        ataca:{
            imagenSrc:'./Imagenes/Ataque_lempira.png',
            framesMax:7,
        }
     }
     );
const enemy = new Enemy({
    x: window.innerWidth - (window.innerWidth * 0.07), y: (canvas.height - canvas.height * 0.72)}, 
    collisionblocks
    ,scale=6, 
    './Imagenes/EspanolNormal.png',
    framesMax=5,
    offset={x:90,y:-25},
    sprites= {
       normal:{
           imagenSrc:'./Imagenes/EspanolNormal.png',
           framesMax:5,
       },
       correr:{
           imagenSrc:'./Imagenes/EspanolCorriendo.png',
           framesMax:6,
           framesTiempoMax:8
       },
       ataca:{
           imagenSrc:'./Imagenes/ataque_Espanol.png',
           framesMax:5,
       }
    }
    );
    
  


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
    imagenSrc: './Imagenes/mapa.png',
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

    collisionblocks.forEach(collisionblock =>{
        collisionblock.actualizar()
    })

    player.cambiarSprite('normal');
    if (keys.d.pressed) {
        player.velocidad.x = 5;
        player.cambiarSprite('correr');
    } else if (keys.a.pressed) {
        player.velocidad.x = -5;
        player. cambiarSprite('correr');
    }
    if (player.attackBox.position.x + player.attackBox.width >= enemy.position.x 
        && player.attackBox.position.x <= enemy.position.x + enemy.width
        && player.attackBox.position.y + player.attackBox.height >= enemy.position.y
        && player.attackBox.position.y <= enemy.position.y + enemy.height 
        && player.isAttacking){
        player.isAttacking = false
        console.log('GG')
    }

    if (enemy.attackBox.position.x <= player.position.x + player.width*1.5
        && enemy.attackBox.position.x + enemy.attackBox.width >= player.position.x
        && enemy.attackBox.position.y + enemy.attackBox.height >= player.position.y
        && enemy.attackBox.position.y <= player.position.y + player.height 
        && enemy.isAttacking){
        enemy.isAttacking = false
        console.log('GG2')
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
        case ' ':
            player.attack()
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
