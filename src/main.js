let canvas = document.querySelector('#canvas'); 
let c = canvas.getContext('2d'); 
let numberOfParticles = 90; 
let density = 2;
let fireworkGravity = .2;
let particlesGravity = .08;
let explosionRadiusRange = { max:5 ,  min:-5  };
let fireworkRandomXPathRange = { max: 2 ,  min:-2  };
let fireworkRadius = 4; 
let particlesLifespan = 10; 
let fireworksArrayLength = 50;
let particleRadiusRange = { max: 3,  min: 1  };
let fireworkOnXaxis = 2; 

init();
class Particle {
    constructor(x,y,firework,color){
        this.x = x; 
        this.y = y; 
        this.lifeSpan = random(1000,50); 
        this.firework = firework;
        this.radius = random(particleRadiusRange.max,particleRadiusRange.min);
        this.color = color; 
				this.history= []; 
				this.tail = 5;
			
        if(this.firework){
            this.vx =random(fireworkOnXaxis,-fireworkOnXaxis); 
            this.vy = random(-9,-15);
            this.gravity = fireworkGravity;
        }else {
            this.vy = random(explosionRadiusRange.max,explosionRadiusRange.min);
            this.vx = random(explosionRadiusRange.max,explosionRadiusRange.min); 
            this.vy = this.vy * random(3,2);
            this.vx = this.vx * random(3,2);
            this.gravity = particlesGravity;
            if(random(600,1) < 200){
                this.vx *= random(2,1);
                this.vy *= random(2,1);
            }          
        } 
    }

    done(){
        if(this.lifeSpan < 0){
            return true; 
        }else {
            return false; 
        }
    }

    draw(){

            circle(this.x, this.y,this.radius, `rgba(${this.color.red},${this.color.green},${this.color.blue},${this.lifeSpan/random(1000,10)})` ); 
			
			 for(let i = 0; i < this.history.length - 1; i++) {
        c.beginPath();
        c.moveTo(this.history[i].x, this.history[i].y);
        c.lineTo(this.history[i + 1].x, this.history[i + 1].y);
        c.strokeStyle = `rgba(${this.color.red},${this.color.green},${this.color.blue},${1})`;
        c.lineWidth = this.radius ;
        c.stroke();
        c.closePath();
    }
    }

    update(){
        this.y += this.vy;
        this.x += this.vx;
        this.vy += this.gravity;
        if(this.firework){
            this.x += random(fireworkRandomXPathRange.max,fireworkRandomXPathRange.min);
            this.radius = random(fireworkRadius,fireworkRadius - fireworkRadius/2);

        }
        if (!this.firework) {
            this.vy *= .9;
            this.vx *= .9;
            this.lifeSpan -= particlesLifespan;

            if (this.lifeSpan < 0) {
                this.done();
            }
        }

         this.history.push({
            x: this.x,
            y: this.y
        });

        if(this.history.length > this.tail){
            this.history.shift();
        }        
    }
}

class Firework {
    constructor(){
        this.color = {
            red: random(255,0),
            green: random(255,0),
            blue:random(250,0)
           }; 

        if(this.color.red <= 150 && this.color.green <= 150 && this.color.blue <= 150 ){
            this.rgb = {
                red:255, 
                green: this.color.green,
                blue: this.color.blue
            }
        } else {

            this.rgb = {
                red:this.color.red, 
                green: 255,
                blue: this.color.blue
            }
        }    
        
        this.firework = new Particle(random((canvas.width/2 ) - 50,canvas.width/2) , canvas.height,true,{
            red: 255, green: 255, blue:255
       }) ;
       this.exploded = false;
       this.particles = [];
    }
    done(){
        if(this.exploded && this.particles.length === 0){
            return true; 

        }else {
            return false; 
        }
    }

    explode(){
        for(let i =0; i < numberOfParticles; i++){
            this.particles.push(new Particle(this.firework.x, this.firework.y,false,this.rgb)); 
        }    
    }
  
    update(){
        if(!this.exploded){
            this.firework.draw();
            this.firework.update();
            
            
            if(this.firework.vy > 0){
                this.firework.vy = 0;
                this.exploded = true;
                this.explode();

            }
        }

       for(let i = this.particles.length - 1; i >= 0 ; i--){
            this.particles[i].draw();
            this.particles[i].update();
            if(this.particles[i].done()){
                this.particles.splice(i, 1);
            }
       }
    }
}

let fireworks = [];

function loop() {
		requestAnimationFrame(loop);
    c.fillStyle = "rgba(0,0,0,.3)";
    c.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.round(random(0, 100)) < density) {
        fireworks.push(new Firework());
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {

        fireworks[i].update();
        if (fireworks[i].done()) {
        }
    }

    if (fireworks.length >= fireworksArrayLength) {
        fireworks.splice(0, 1);
			
    }	
}

window.addEventListener('resize', ()=> {
    init();
});

loop();

function random(max, min){
    this.max = max ; 
    this.min = min ; 
    let x = Math.random()* (this.max -this.min) + this.min; 
    return x ; 
}
function circle(x,y,radius,color){
    this.radius = radius; 
    this.x = x; 
    this.y = y; 
    this.color = color;
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x, this.y,this.radius, 0, Math.PI * 2  ); 
        c.fill();
}
function init(){

    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 

}
