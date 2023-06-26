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

for(let i = 0; i < plataformas2.length; i+=30){
    colisiones.push(plataformas2.slice(i, i + 30))
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
        this.width = 64;
        this.height = 64;
        this.contadorSalto = 0;
        this.health=100;
        this.collisionblocks = collisionblocks;
        this.image = new Image();
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
        };
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
        this.lastDireccion='derecha'
    }
    restart(){
        this.position = position;
        this.velocidad = {
            x: 0,
            y: 1
        };
        this.health=100;

        this.frameCurrent=0;
        this.framesTiempo=0;
        this.framesTiempoMax=10;
    }

  
    dibujar() {
       
        if(this.lastDireccion==='derecha'){
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
        else if(this.lastDireccion==='izquierda'){
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image,
                this.frameCurrent * (this.image.width/this.framesMax) ,
                0,
                this.image.width/this.framesMax,
                this.image.height,
                -this.position.x - this.offset.x-this.width,
                this.position.y,
                (this.image.width/this.framesMax) * this.scale,
                this.image.height * this.scale,
           );
           ctx.scale(-1, 1);
        }
        

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
        this.width = canvas.width * 0.07;;
        this.height =  (this.image.height * this.scale)-20;
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
        if(this.image===this.sprites.ataca.image && this.frameCurrent<this.sprites.ataca.framesMax-1 )return
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
                    this.framesTiempoMax=10
                }
                break;
        
        }
    }

    attack(){
        this.cambiarSprite('ataca');
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
        this.health=100;
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
        
        if(this.velocidad.x<=0){

            
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
        else if (this.velocidad.x>=0){
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image,
                this.frameCurrent * (this.image.width/this.framesMax) ,
                0,
                this.image.width/this.framesMax,
                this.image.height,
                -this.position.x - this.offset.x-this.width,
                this.position.y,
                (this.image.width/this.framesMax) * this.scale,
                this.image.height * this.scale,
           );
           ctx.scale(-1, 1);
        }

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
        this.height = (this.image.height * this.scale) -20;
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
    if(this.image===this.sprites.ataca.image && this.frameCurrent<this.sprites.ataca.framesMax-1 )return
        switch(sprite){
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
                    this.framesTiempoMax=8
                    this.offset.x=this.sprites.ataca.offset.x
                    this.offset.y=this.sprites.ataca.offset.y
                }
                break;
        
        }
    }

    attack(){
        
        this.cambiarSprite('ataca');
        this.isAttacking=true
        setTimeout(() => {
            this.cambiarSprite('normal')
            this.isAttacking=false
        }, 100)
    }
}


class PowerUp {
    constructor({position, imagenSrc,duration, effect }) {
      this.position = position;
      this.width =50;
      this.height = 50;
      this.duration = duration;
      this.image = new Image();
      this.image.src = imagenSrc;
      this.effect = effect;
      this.colisionada = false;
      this.existe=true;
      this.activado = false;

    }
  
    dibujar() {
        
      if (this.image.complete) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
      }
    }
    
    actualizar() {
        const distanciaX = this.position.x - player.position.x;
        const distanciaY = this.position.y - player.position.y;
        const distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);
      
        if (this.existe) {
          if (distancia < power_up.width / 2 + this.width / 2) {
            console.log('colision');
            this.colisionada = true;
            this.activado = true;
            this.existe=false;
          }
        }
      
        if (this.activado) {
          if (player.velocidad.x < 0) {
            player.velocidad.x = -15;
            setTimeout(() => {
              player.velocidad.x = 1;
              this.activado = false;
            }, 3000);
          } else if (player.velocidad.x > 0) {
            player.velocidad.x = 15;
            setTimeout(() => {
              player.velocidad.x = 1;
              this.activado = false;
            }, 3000);
          }
        }
      
        if (!this.colisionada) {
          this.dibujar();
        }
      }
      
    
    
  }

  const power_up = new PowerUp({
    position: { x: 1000, y: 680},
    imagenSrc: './Imagenes/apple.png',
    duration: 10000,
    effect: 'correrRapido',
});

var off = 0;

if (canvas.height <= 150) {
  off = -1*((canvas.height - canvas.height * 0.72) * 0.58) + 10;
} else {
  off = ((canvas.height - canvas.height * 0.72) * 0.58) + 10;
}

var off = 0;

if (canvas.height <= 150) {
  off = -1*((canvas.height - canvas.height * 0.72) * 0.58) + 10;
} else {
  off = ((canvas.height - canvas.height * 0.72) * 0.58) + 10;
}

const player = new Player({
     x: 1, y: (canvas.height - canvas.height * 0.72)}, 
     
     collisionblocks, 
     scale=6, 
     './Imagenes/LempiraNormal.png',
     framesMax=6,
     
     offset={x:90,y:off},
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
    './Imagenes/Espanol2_Corriendo.png',
    framesMax=6,
    offset={x:90,y:off},
    sprites= {
       correr:{
           imagenSrc:'./Imagenes/Espanol2_Corriendo.png',
           framesMax:6,
           framesTiempoMax:8
       },
       ataca:{
           imagenSrc:'./Imagenes/ataque_Espanol2.png',
           framesMax:5,
           offset:{x:90,y:20},

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
    imagenSrc: './Imagenes/mapa2.png',
});

const keys = {
    d: { pressed: false },
    a: { pressed: false },
};
let isAnimationPaused = false; 

function pausarAnimacion() {
    isAnimationPaused = true;
}


function reanudarAnimacion() {
    isAnimationPaused = false;
    requestAnimationFrame(animar);
}





function animar() {
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.actualizar();
    power_up.actualizar();
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
        player.lastDireccion='derecha'
    } else if (keys.a.pressed) {
        player.velocidad.x = -5;


        player. cambiarSprite('correr');
        player.lastDireccion='izquierda'

    }
    if (player.attackBox.position.x + player.attackBox.width >= enemy.position.x 
        && player.attackBox.position.x <= enemy.position.x + enemy.width
        && player.attackBox.position.y + player.attackBox.height >= enemy.position.y
        && player.attackBox.position.y <= enemy.position.y + enemy.height 
        && player.isAttacking){
        player.isAttacking = false
        enemy.health -= '10'
        document.querySelector('#barraEnemigo').style.width = enemy.health + '%'
        console.log('GG')
    }

    if (enemy.attackBox.position.x <= player.position.x + player.width*1.5
        && enemy.attackBox.position.x + enemy.attackBox.width >= player.position.x
        && enemy.attackBox.position.y + enemy.attackBox.height >= player.position.y
        && enemy.attackBox.position.y <= player.position.y + player.height 
        && enemy.isAttacking){
        enemy.isAttacking = false
        player.health -= '1'
        document.querySelector('#barraJugador').style.width = player.health + '%'

        console.log('GG2')
    }
    if (player.health <= 0) {
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.font = '50px Helvetica';
        ctx.fillText('PERDISTE, Presiona Enter para reiniciar', canvas.width / 2, 200);
        ctx.fillStyle = 'white';
        ctx.fillText('PERDISTE, Presiona Enter para reiniciar', canvas.width / 2 + 2, 202);
        pausarAnimacion()
      
    }
    if(enemy.health <= 0){
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.font = '50px Helvetica';
        ctx.fillText('GANASTE, Presiona Enter para reiniciar', canvas.width / 2, 200);
        ctx.fillStyle = 'white';
        ctx.fillText('GANASTE, Presiona Enter para reiniciar', canvas.width / 2 + 2, 202);
        pausarAnimacion()
    }
    if (!isAnimationPaused) {
        requestAnimationFrame(animar);
    }
}

animar();

function Pierde(){
    player.restart();
    enemy.restart();
    animar();

}
console.log(player.position.x, player.position.y),

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

window.addEventListener('keydown', (event) => {
    if(event.key === "Enter"){
        location.reload();
    }
}
);  

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case ' ':
            player.attack()
        break;
    }
});
