var bg, bgImg, backGround, backGroundImg;
var bottomGround
var topGround
var balloon, balloonImg
var gameOver, gameOverImg;
var restart, restartImg;
var poste, building1, building2, ballonEnemy, bird, posteGroup, building1Group, building2Group, balloonEnemyGroup, birdGroup;
var gameState = 1;
var PLAY = 1;
var END = 0;
var BOSS = 2;
var WIN = 3;
var tempo = 0;
var coin, coinImg;
var score = 0;
var bossLife = 100;
var playerLife = 50; 
var playerAttack;
var bossAttack2;
var playMusic, bossMusic, winMusic, defeatMusic;


function preload(){
  bgImg = loadImage("assets/bg.png")
  backGroundImg = loadImage("assets/background.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  coinImg = loadImage ("assets/coin.png");

  //Obstáculos
  building1Img = loadImage("assets/obsBottom1.png");
  posteImg = loadImage("assets/obsBottom2.png");
  building2Img = loadImage("assets/obsBottom3.png");
  balloonEnemyImg = loadImage("assets/obsTop1.png");
  birdImg = loadImage("assets/obsTop2.png");
  bossImg = loadImage("assets/boss1.png");


  dieSound = loadSound("assets/die.mp3");
  coinSound = loadSound("assets/jump.mp3");

  winMusic = loadSound("assets/winMusic.mp3");
  defeatMusic = loadSound("assets/defeatMusic.mp3");
  bossMusic = loadSound("assets/bossMusic.mp3");
  playMusic = loadSound("assets/playMusic.mp3");
  


  balloonImg = loadAnimation("assets/balloon1.png","assets/balloon2.png","assets/balloon3.png")
}

function setup(){

//imagem de fundo

  bg = createSprite(165,485,1,1);
  bg.addImage(bgImg);
  bg.scale = 1.3
  bg.depth = -1;

 /* backGround = createSprite(200,200);
  backGround.addImage(backGroundImg);
  backGround.scale = 1;
  backGround.depth = 0;
  */
  //criar o solo superior e inferior
  bottomGround = createSprite(200,500,800,20);
  bottomGround.visible = false;

  topGround = createSprite(200,-100,800,20);
  topGround.visible = false;
        
  //criar o balão     
  balloon = createSprite(100,200,20,50);
  balloon.addAnimation("balloon",balloonImg);
  balloon.scale = 0.2;

  boss = createSprite (300,45);
  boss.addImage(bossImg);
  boss.scale = 0.1;
  boss.visible = false;

  
  posteGroup = createGroup();
  building1Group = createGroup();
  building2Group = createGroup();
  balloonEnemyGroup = createGroup();
  birdGroup = createGroup();
  coinGroup = createGroup();
  playerAttackGroup = createGroup();
  bossAttack2Group = createGroup();


}

function draw() {

  if (gameState == PLAY){  

    if (tempo == 1){
      playMusic.stop()
      bossMusic.stop();
      winMusic.stop();
      defeatMusic.stop();
      playMusic.play();
    }
    if(tempo == 1700){
      playMusic.stop();
      playMusic.play();
    }
  //backGround.visible = false;
  bg.visible = true;
  background(bgImg);    


          //faça o balão de ar quente pular
          bg.velocityX = -4;
          if(bg.x < -382){
            bg.x = bg.width/2;
          }

          tempo = tempo+1;

          gameOverFunction();
          restartFunction();
          gameOver.visible = false;
          restart.visible = false;

          createPoste();
          createBuilding1();
          createBuilding2();
          createBalloonEnemy();
          createBird();
          createCoin(); 
          

          if(balloon.isTouching(coinGroup)){
            coinGroup.destroyEach();
            score = score+1;
            coinSound.play();
          }
          
          if(keyDown("space")) {
            balloon.velocityY= -6 ;
            
          }

          if (balloon.x < 100) {
            balloon.velocityX = 2;
          }

          else

          if (balloon.x >= 100){
            balloon.velocityX = 0;
          }

          console.log(tempo);
          //Criar morte fora da tela
          if(balloon.x<-20 || balloon.y<-20 || balloon.y > 420){
            gameState = END;
            dieSound.play();
            playMusic.stop();
            playMusic.stop();
            defeatMusic.play();
          }

          //O jogo acaba no frame 2000

          //adicione gravidade
           balloon.velocityY = balloon.velocityY+0.5;

           balloon.collide(topGround);
           balloon.collide(bottomGround);
           balloon.collide(posteGroup);
           balloon.collide(building1Group);
           balloon.collide(building2Group);
           balloon.collide(balloonEnemyGroup);
           balloon.collide(birdGroup);

          if (tempo == 2000) {
            gameState = BOSS;
            window.alert ("CUIDADO! Você está prestes a entrar em uma batalha contra o Chefe Final!");
            posteGroup.destroyEach();
            building1Group.destroyEach();
            building2Group.destroyEach();
            balloonEnemyGroup.destroyEach();
            birdGroup.destroyEach();
            coinGroup.destroyEach();
            playMusic.stop();
            playMusic.stop();
            bossMusic.play();
          }
        }

        if (gameState == BOSS){
          
          playMusic.stop();

          background(backGroundImg); 
          
          if(playerLife <=0 || balloon.y > 450 || balloon.y < -50){
            gameState = END;
            dieSound.play();
            bossMusic.stop();
            defeatMusic.play();
          }
          
          bg.visible = false;

          boss.visible = true;

          balloon.x = 50;
          tempo = tempo+1;

          showLife();
          createPlayerAttack();

          

          if (balloon.overlap(birdGroup)){
            playerLife -= 10;
            birdGroup.destroyEach();
          }

          if (balloon.overlap(bossAttack2Group)){
            playerLife -=5;
            bossAttack2.destroy();
          }
          if(boss.overlap(playerAttackGroup)){
            bossLife -=5;
            playerAttackGroup.destroyEach();
          }
          console.log(playerLife);
          console.log(bossLife);
          
          if(keyDown("space")) {
            balloon.velocityY= -6 ;
            }

          balloon.velocityY = balloon.velocityY+0.5;
          
          createCoin(); 
          if(balloon.isTouching(coinGroup)){
            coinGroup.destroyEach();
            score = score+1;
            coinSound.play();
          }

          
          if(boss.y < 50){
            boss.velocityY = 5;
          }

          if(boss.y > 350){
            boss.velocityY = -5;
          }

          bossAttack1();
          createBossAttack2();
          showBossLife();

          if(bossLife == 0){
            gameState = WIN;
            bossMusic.stop();
            winMusic.play();
          }

          //adicionar música e efeitos sonoros para a fase

        }

        if (gameState == WIN){

          playMusic.stop();
          boss.destroy();
          playerAttackGroup.destroyEach();
          birdGroup.destroyEach();
          coinGroup.destroyEach();
          bossAttack2Group.destroyEach();
          balloon.velocityX = 0;
          balloon.velocityY = 0;

          push()
          textSize(30);
          fill("yellow");
          stroke("black");
          text ("Você venceu!", 115,210);
          pop()
        }

        //Criar o GameState = WIN


        if(gameState == END){

          playMusic.stop();
          gameOver.visible = true;
          restart.visible = true;

            balloon.velocityX = 0;
            balloon.velocityY = 0;

            bg.velocityX = 0;
            boss.velocityY = 0;
            posteGroup.setVelocityXEach(0);
            building1Group.setVelocityXEach(0);
            building2Group.setVelocityXEach(0);
            balloonEnemyGroup.setVelocityXEach(0);
            birdGroup.setVelocityXEach(0);
            coinGroup.setVelocityXEach(0);
            bossAttack2Group.setVelocityXEach(0);

            playerAttackGroup.destroyEach();

          if(mousePressedOver(restart)){
            gameState = PLAY;
            balloon.x = 100;
            balloon.y = 200;
            boss.y = 45;
            posteGroup.destroyEach();
            building1Group.destroyEach();
            building2Group.destroyEach();
            balloonEnemyGroup.destroyEach();
            birdGroup.destroyEach();
            coinGroup.destroyEach();
            gameOver.visible = false;
            restart.visible = false;
            tempo = 0;
            score = 0;
            playerLife = 50;
            bossLife = 100;
            boss.visible = false;
          }
      }
      
   
        drawSprites();
        push()
        textSize(18);
        fill ("red");
        stroke("black");
        text ("Pontuação: " + score, 20, 50);;
        pop()
        
}

//terminar de criar poste
function createPoste(){
  if (tempo % 80 == 0){
  poste = createSprite(400, 310);
  poste.addImage(posteImg);
  poste.scale = 0.10;
  poste.velocityX = -8
  poste.lifetime = 60;
  posteGroup.add(poste);
  }
}

function createBuilding1(){
  if (tempo % 100 == 0){
  building1 = createSprite(400, 310);
  building1.addImage(building1Img);
  building1.scale = 0.12;
  building1.velocityX = -8
  building1.lifetime = 100;
  building1Group.add(building1);
  }
}

function createBuilding2(){
  if (tempo % 120 == 0){
  building2 = createSprite(400, 320);
  building2.addImage(building2Img);
  building2.scale = 0.13;
  building2.velocityX = -5
  building2.lifetime = 100;
  building2Group.add(building2);
  }
}

function createBalloonEnemy(){
  if (tempo % 290 == 0){
  ballonEnemy = createSprite(400, 45);
  ballonEnemy.addImage(balloonEnemyImg);
  ballonEnemy.scale = 0.1;
  ballonEnemy.velocityX = -5;
  ballonEnemy.lifetime = 100;
  balloonEnemyGroup.add(ballonEnemy);
  }
}

function createBird(){
  if (tempo % 50 == 0){
  bird = createSprite(400, Math.round(random(190,380)));
  bird.addImage(birdImg);
  bird.scale = 0.09;
  bird.velocityX = -8
  bird.lifetime = 100;
  birdGroup.add(bird);
  }
}

function gameOverFunction(){
  gameOver = createSprite(200,150);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.8;
}

function restartFunction(){
  restart = createSprite(200,230);
  restart.addImage(restartImg);
  restart.scale = 0.8;
}

function createCoin(){
  if (tempo % 80 == 0){
  coin = createSprite (400, Math.round(random(50,380)));
  coin.addImage(coinImg);
  coin.scale = 0.07;
  coin.velocityX = -6;
  coin.lifetime = 80;
  coinGroup.add(coin);
}
}

function bossAttack1(){
  if (tempo % 30 == 0){
    bird = createSprite(400, Math.round(random(10,390)));
    bird.addImage(birdImg);
    bird.scale = 0.09;
    bird.velocityX = -8
    bird.lifetime = 50;
    birdGroup.add(bird);
    }
  }

function createBossAttack2(){
  if(tempo % 80 == 0){
    bossAttack2 = createSprite(295,boss.y + 20, 50, 10);
    bossAttack2.tint = ("red");
    bossAttack2.shapeColor = ("red");
    bossAttack2.velocityX = -9;
    bossAttack2.lifetime = 50;
    bossAttack2Group.add(bossAttack2);
  }
}

  function showLife(){
    fill("red");
    rect(25,balloon.y + 60,50,10);
    fill("blue");
    rect(25,balloon.y + 60,playerLife,10);
  }

  function createPlayerAttack(){
    if(tempo % 5 == 0){
    playerAttack = createSprite (60,balloon.y + 25,20,5);
    playerAttack.shapeColor = ("red");
    playerAttack.tint = ("blue");
    playerAttack.velocityX = 5;
    playerAttack.lifetime = 80;
    playerAttackGroup.add(playerAttack);
  }
}

function showBossLife(){
  fill("purple");
  rect(255,boss.y + 70,100,10);
  fill("yellow");
  rect(255,boss.y + 70,bossLife,10);
  }


