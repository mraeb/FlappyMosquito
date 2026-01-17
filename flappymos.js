//board
let board;
let boardwidth = window.innerWidth;
let boardheight = window.innerHeight;
let context;

//mosquito
let mosWidth = 48;
let mosHeight = 40;
// let mosX = boardwidth / 8;
let mosX = boardwidth-(boardwidth / 5);
let mosY = boardheight / 2;
// let mosImage;
let mosImgs = [];
let mosImgsIndex = 0;

let mosquito = {
    x: mosX,
    y: mosY,
    width: mosWidth,
    height: mosHeight
}


//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = -pipeWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = 1; //pipe moving speed
let velocityY = 0; //mosquito jump speed
let gravity = 0.05; //mosquito falling speed

let gameOver = false;
let score = 0;



window.onload = function() {
    board = document.getElementById("board");
    board.width = boardwidth;
    board.height = boardheight;
    context = board.getContext("2d"); // used for drawing on the board


    //draw mosquito
    // context.fillStyle = "green";
    // context.fillRect(mosquito.x, mosquito.y, mosquito.width, mosquito.height);

    //load images
    mosImage = new Image();
    // mosImage.src = "./Mos.png"; 
    mosImage.onload = function() {
        context.drawImage(mosImage, mosquito.x, mosquito.y, mosquito.width, mosquito.height);
    }

    for (let i = 1; i <= 3; i++) {
        let mosImg = new Image();
        mosImg.src = `./Assets/Player/Mosq${i}.png`;
        mosImgs.push(mosImg);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./Assets/Obstacles/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./Assets/Obstacles/bottompipe.png";

    this.requestAnimationFrame(update);
    this.setInterval(placePipes, 1500); //every 1.5 seconds
    setInterval(animateMosquito, 100); //every 0.2 seconds

    this.document.addEventListener("keydown", function(e) {
        if(
            e.code == "Space" || 
            e.code == "ArrowUp" || 
            e.code == "KeyX" 
        ) {
            jump();
        }
    });

    
    document.addEventListener("mousedown", jump);

    document.addEventListener("touchstart", jump); // mobile

    

}



function update() {
    requestAnimationFrame(update);
    if(gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //mosquito
    velocityY += gravity;
    mosquito.y = Math.max(mosquito.y + velocityY, 0);
    context.drawImage(mosImgs[mosImgsIndex], mosquito.x, mosquito.y, mosquito.width, mosquito.height);
    if(mosquito.y > board.height) {
        gameOver = true;
    }
    //pipes
    for(let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && mosquito.x < pipe.x + pipe.width) {
            score+= 0.5; //increase score by 0.5 for each pipe pair
            pipe.passed = true;
        }

        if(detectCollision(mosquito, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if(gameOver) {
        context.fillStyle = "white";
        context.font = "60px sans-serif";
        context.fillText("Game Over!", board.width / 3, board.height / 2);
    }
}

function animateMosquito() {
    mosImgsIndex++;
    mosImgsIndex = mosImgsIndex % mosImgs.length;
}

function placePipes() {
    if(gameOver) {
        return;
    }
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height/4; //space between top and bottom pipe

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function jump() {
    //jump mosquito
    
        velocityY = -3;

        if(gameOver) {
            //reset game
            mosquito.y = mosY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
}
function mouseJump() {
    jump();
}

function detectCollision(a,b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}