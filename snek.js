//UNIT is the const 
let UNIT;
let theSnake;
let theEgg;
let gameOverState = false;

//loading assets
function preload(){
  theSnake = new Snake().preload();
  theEgg = new Egg().preload();
}

//setup p5 stuff
function setup(){
  createCanvas(windowHeight-10,windowHeight-10);
  frameRate(7);
  angleMode(DEGREES);
  imageMode(CENTER);
  noStroke();

  UNIT = height/10;
}

function draw(){
  background(202,220,159);
  theSnake.move().draw();
  theEgg.draw();
}

function keyPressed(){
  theSnake.key = keyCode;
  if(gameOverState && keyCode === ENTER){
    gameRestart();
  }
}

/********************************************************************
 * Snake Object - manages everything with the player's snake
 * *****************************************************************/
var Snake = function Snake(){
  this.reset();
  return this;
}

Snake.prototype.reset = function reset(){
  //an array of xy coords for where all our body tiles are right now
  this.bodyPositions = [new Coord(1,1)];

  //starting location
  this.headPosition = new Coord(2,1);
  this.tailPosition = new Coord(0,1);

  this.key    = undefined;
  return this;
}

//preload function which loads the images
Snake.prototype.preload = function preload(){
  this.head   = loadImage("assets/snek_head.png");
  this.corner = loadImage("assets/snek_corner.png");
  this.body   = loadImage("assets/snek_body.png");
  this.tail   = loadImage("assets/snek_tail.png");
  return this;
}

//draw the player snake
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

  //loop over body segments and draw each one
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

  return this;
};

// a helper draw method that does each body part based on the ones before and after it
Snake.prototype.bodyHelper = function bodyHelper(target, index){
  let frontNeighbor = index==0 ? this.headPosition : this.bodyPositions[index-1];
  let backNeighbor  = index==this.bodyPositions.length-1 ? this.tailPosition : this.bodyPositions[index+1];
  push();
  translate(target.x*UNIT+UNIT/2,target.y*UNIT+UNIT/2);
  //case if we're straight (as if) horizontally
  if(target.x === frontNeighbor.x && target.x === backNeighbor.x){
    image(this.body,0,0,UNIT,UNIT);
  }
  //case if we're straight vertically (kinky)
  else if(target.y === frontNeighbor.y && target.y === backNeighbor.y){
    rotate(90);
    image(this.body,0,0,UNIT,UNIT);
  }
  //case if we're ~gay~ in a corner
  else if(backNeighbor.x !== frontNeighbor.x && backNeighbor.y !== frontNeighbor.y){
    //we find where our horizontal neighbor is. we  dont care if it's the front or back
    let x = (backNeighbor.x-target.x)+(frontNeighbor.x-target.x);
    //we find where our vertical neighbor is. we  dont care if it's the front or back
    let y = (backNeighbor.y-target.y)+(frontNeighbor.y-target.y);

    if     (x === 1 && y === 1){ //right down
      //no change. this is how the sprite was drawn
    }
    else if(x == -1 && y == 1){  //left down
      rotate(90);
    }
    else if(x == -1 && y == -1){ //left up
      rotate(180);
    }
    else if(x == 1 && y == -1){  //right up
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

  return this;
};

Snake.prototype.move = function move(){
  //hang onto the headPosition
  let hp = this.headPosition.copy();

  let connetedCoord = this.bodyPositions.length>0 ? this.bodyPositions[0] : this.tailPosition;
  if(connetedCoord.x > this.headPosition.x){      //left
    if(this.key === UP_ARROW){
      this.headPosition.y -= 1;
    }
    else if(this.key === DOWN_ARROW){
      this.headPosition.y += 1;
    }
    else{
      this.headPosition.x -= 1;
    }
  }
  else if(connetedCoord.x < this.headPosition.x){ //right
    if(this.key === UP_ARROW){
      this.headPosition.y -= 1;
    }
    else if(this.key === DOWN_ARROW){
      this.headPosition.y += 1;
    }
    else{
      this.headPosition.x += 1;
    }
  }
  else if(connetedCoord.y > this.headPosition.y){ //up
    if(this.key === LEFT_ARROW){
      this.headPosition.x -= 1;
    }
    else if(this.key === RIGHT_ARROW){
      this.headPosition.x += 1;
    }
    else{
      this.headPosition.y -= 1;
    }
  }
  else if(connetedCoord.y < this.headPosition.y){ //down
    if(this.key === LEFT_ARROW){
      this.headPosition.x -= 1;
    }
    else if(this.key === RIGHT_ARROW){
      this.headPosition.x += 1;
    }
    else{
      this.headPosition.y += 1;
    }
  }
  else{
    console.log("we're boned.....");
  }

  //see if we ran over the edge of the world
  if( this.headPosition.y*UNIT >= height  ||
      this.headPosition.y*UNIT <  0       ||
      this.headPosition.x*UNIT >= width   ||
      this.headPosition.x*UNIT <  0
    ){
    gameOver();
  }

  //if the new headPosition is on top of a bodyPosition then were doomed
  this.bodyPositions.forEach( (bp) => {
    if(bp.x === this.headPosition.x && bp.y === this.headPosition.y){
      gameOver();
    }
  });


  //the old headPosition is now the first bodyPosition
  this.bodyPositions.unshift(hp);

  //the old last bodyPosition is not the tailPosition (unless we eat an egg)
  if( this.headPosition.x !== theEgg.position.x ||
      this.headPosition.y !== theEgg.position.y){
    this.tailPosition = this.bodyPositions.pop();
  }
  else{
    theEgg.move();
  }

  return this;
}

/********************************************************************
 * Egg object - has all the details about the egg
 * *****************************************************************/
var Egg = function Egg(){
  this.position = new Coord(Math.floor(Math.random()*10),Math.floor(Math.random()*10));
  return this;
};
Egg.prototype.reset = function reset(){
  this.position = new Coord(Math.floor(Math.random()*10),Math.floor(Math.random()*10));
  return this;
};
Egg.prototype.preload = function preload(){
  this.sprite = loadImage("assets/snek_egg.png");
  return this;
};
Egg.prototype.move = function move(){
  this.position.x = Math.floor(Math.random()*10);
  this.position.y = Math.floor(Math.random()*10);
}
Egg.prototype.draw = function draw(){
  push();
  translate(this.position.x*UNIT+UNIT/2,this.position.y*UNIT+UNIT/2);
  image(this.sprite,0,0,UNIT,UNIT);
  pop();
  return this;
};

/********************************************************************
 * Coord Object - just a nice x,y pair is all
 * *****************************************************************/
var Coord = function Coord(x,y){
  if(typeof x === "undefined" ||
      typeof y === "undefined"){
    console.log("x and y MUST be defined");
    return;
  }
  this.x = x;
  this.y = y;
  return this;
};
Coord.prototype.copy = function copy(){
  return new Coord(this.x,this.y);
};

/********************************************************************
 * gameOver
 * *****************************************************************/
function gameOver(){
  gameOverState = true;
  noLoop();
  noStroke();
  fill(255);
  text("game over brew",50,50);
}

function gameRestart(){
  background(0);
  theSnake.reset();
  //theEgg.reset();
  gameOverState = false;
  loop();
}
