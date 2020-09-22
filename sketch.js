 //Create variables here
var dog;
var dogImg, happyDogImg;
var database, foodS, foodStock;
var backgroundImg;
var lastFed, fedTime;
var foodObj;


function preload(){
  //load images here
  dogImg = loadImage("virtual pet images/Dog.png");
  happyDogImg = loadImage("virtual pet images/Happy.png");
  bedroomImg = loadImage("virtual pet images/Bed Room.png");
  gardenImg = loadImage("virtual pet images/Garden.png");
  washroomImg = loadImage("virtual pet images/Wash Room.png");
  sadDog = loadImage("virtual pet images/deadDog.png");
}

function setup() {
  createCanvas(850, 400);
 
  database = firebase.database();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  foodObj = new Food();
  form = new Form();
  dog = createSprite(700,280,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.3;
  
  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  //read gameState from database
  readState = database.ref('gameState');
  readState.on("value",function(data){
  gameState = data.val();
  });
}


function draw() { 
    background(0,128,128);
    foodObj.display();
    fedTime=database.ref('FeedTime');
    fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(20);
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%12 + " pm", 350,30);
  }
  else if(lastFed==0){
     text("Last Fed : 12 am",350,30);
  }
  else{
     text("Last Fed : "+ lastFed + " am", 350,30);
  }
    
    currentTime = hour();
    if(currentTime === (lastFed+1)){
      update("Playing");
      foodObj.garden();
    }else if(currentTime === (lastFed+2)){
      update("Sleeping");
      foodObj.bedroom();
    }else if(currentTime === (lastFed+2) && currentTime<=(lastFed+4)){
      update("Bathing");
      foodObj.washroom();
    }else{
      update("Hungary");
      foodObj.display();
    }
  
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
    }else{
      feed.show();
      addFood.show();
      dog.addImage(sadDog);
    }

  drawSprites();  
 }


//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

 //function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}
 

//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDogImg);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  });  
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  });
  dog.addImage(dogImg);
}

function update(state){
    database.ref('/').update({
      gameState: state
    });
  }
  
 

