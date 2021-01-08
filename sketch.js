var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;
var namee;
function preload(){
sadDog=loadImage("images/Dog.png");
happyDog=loadImage("images/happy dog.png");
garden=loadImage("images/Garden.png");
washroom=loadImage("images/Wash Room.png");
bedroom=loadImage("images/Bed Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(400,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  nameref=database.ref("name");
  nameref.on("value", function(data){
  namee =data.val();
})

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

    input=createInput();
    input.position(690,140);

    button=createButton("SUBMIT");
    button.position(825,140);
    button.mousePressed(renameDog);

}

function draw() {
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
}
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
  
   }
 
  drawSprites();
  drawSprites();
    textSize(15);
    strokeWeight(3);
    textFont("TimeS new Roman");
    text("Your Pet Dog a Name--",30,75);
   
    text(namee,200,75);
    textSize(20);
    text("Remaining Food Stock = "+ foodS+".",80,120);
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
 if(foodS>0){
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
  dog.addImage(happyDog);
}
}

//function to add food in stock
function addFoods(){
  if(foodS<40){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}


function renameDog(){

  Name=input.value();
  button.hide();
  input.hide();
  database.ref('/').update({
  name:Name
  })

  }