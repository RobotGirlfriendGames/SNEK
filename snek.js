let UNIT;
let theSnake;
let tst;

function preload(){
  tst = loadImage("assets/sprite.png");
  theSnake = new Snake();
  theSnake.preload();
}

function setup(){
  createCanvas(windowHeight-10,windowHeight-10);
  frameRate(12);
  angleMode(DEGREES);
  imageMode(CENTER);

  UNIT = height/10;
  noStroke();
}

function draw(){
  background(0);
  theSnake.draw();
}

function keyPressed(){
  //tell the snake head to turn on the next tick
}

var Snake = function Snake(){
  //an array of xy coords for where all our body tiles are right now
  this.bodyPositions = [new Coord(5,4),new Coord(4,4),new Coord(3,4)];

  //starting location
  this.headPosition = new Coord(5,5);
  this.tailPosition = new Coord(2,4);
  //draw
  //move
  //
  //turnLeft
  //turnRight
  //turnUp
  //turnDown
}

Snake.prototype.preload = function preload(){
  this.head   = loadImage("assets/snek_head.png");
  this.corner = loadImage("assets/snek_corner.png");
  this.body   = loadImage("assets/snek_body.png");
  this.tail   = loadImage("assets/snek_tail.png");
}

Snake.prototype.draw = function draw(){
  //draw head
  push();
  translate(this.headPosition.x*UNIT+UNIT/2,this.headPosition.y*UNIT+UNIT/2);

  let connetedCoord = this.bodyPositions.length>0 ? this.bodyPositions[0] : this.tailPosition;
  if(connetedCoord.x > this.headPosition.x){      //right
    rotate(-90);
  }
  else if(connetedCoord.x < this.headPosition.x){ //left
    rotate(90);
  }
  else if(connetedCoord.y > this.headPosition.y){ //down
    //leave it
  }
  else if(connetedCoord.y < this.headPosition.y){ //up
    rotate(180);
  }
  else{
    console.log("we're boned.....");
  }
  image(this.head,0,0,UNIT,UNIT);
  pop();
  
  //loop over body
  this.bodyPositions.forEach(this.bodyHelper.bind(this));

  //draw tail
  push();
  translate(this.tailPosition.x*UNIT+UNIT/2,this.tailPosition.y*UNIT+UNIT/2);
  connetedCoord = this.bodyPositions.length>0 ? this.bodyPositions[this.bodyPositions.length-1] : this.headPosition;
  if     (connetedCoord.x > this.tailPosition.x){      //right
    rotate(90);
  }
  else if(connetedCoord.x < this.tailPosition.x){ //left
    rotate(-90);
  }
  else if(connetedCoord.y > this.tailPosition.y){ //down
    rotate(180);
  }
  else if(connetedCoord.y < this.tailPosition.y){ //up
    //leave it
  }
  else{
    console.log("we're boned.....");
  }
  image(this.tail,0,0,UNIT,UNIT);
  pop();


};

Snake.prototype.bodyHelper = function bodyHelper(target, index){
  let frontNeighbor = index==0 ? this.headPosition : this.bodyPositions[index-1];
  let backNeighbor  = index==this.bodyPositions.length-1 ? this.tailPosition : this.bodyPositions[index+1];
  push();
  translate(target.x*UNIT+UNIT/2,target.y*UNIT+UNIT/2);

  if(target.x === frontNeighbor.x && target.x === backNeighbor.x){
    image(this.body,0,0,UNIT,UNIT);
  }
  else if(target.y === frontNeighbor.y && target.y === backNeighbor.y){
    rotate(90);
    image(this.body,0,0,UNIT,UNIT);
  }
  //we're in a corner
  else if(backNeighbor.x !== frontNeighbor.x && backNeighbor.y !== frontNeighbor.y){
    let x = (backNeighbor.x-target.x)+(frontNeighbor.x-target.x);
    let y = (backNeighbor.y-target.y)+(frontNeighbor.y-target.y);

    if(x === 1 && y === 1){//right down
      //nochange
    }
    else if(x == -1 && y == 1){ //left down
      rotate(90);
    }
    else if(x == -1 && y == -1){ //left up
      rotate(180);
    }
    else if(x == 1 && y == -1){ //right up
      rotate(-90);
    }
    else{
      console.log("corner is messed up");
    }
    image(this.corner,0,0,UNIT,UNIT);
  }
  else{
    console.log("this snek got twisted");
  }

  pop();
};

var Coord = function Coord(x,y){
  if(typeof x === "undefined" ||
      typeof y === "undefined"){
    console.log("x and y MUST be defined");
    return;
  }
  this.x = x;
  this.y = y;
}
