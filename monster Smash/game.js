var stage = document.querySelector('#stage');
var output = document.querySelector('#output')
//Make monster Object;
var monster = 
{
    currentFrame: 0,
    forward: true,
    state: 'hiding',
    hitState: false,
    waitTime: 0,
    position: {i:0, j:0},
    hitTime : 0,
    sourceX: 0,
    sourceY:0,
    size: 128,
    numberOfFrames: 5,
    numberOfHit: 0,
    upDateAnimation: function()
    {
        this.monsterChangeState()
        this.position.i = Math.floor(this.currentFrame / 3);
        this.position.j = this.currentFrame % 3;
        this.sourceY = this.position.i * this.size;
        this.sourceX = this.position.j * this.size;
    },
    moveFrames: function()
    {
        if((this.currentFrame < this.numberOfFrames) && this.forward)
        {
            this.currentFrame++;
        }
        else if((0 < this.currentFrame) && !this.forward)
        {
            this.currentFrame--;
        }
        else if((this.currentFrame == 0) && !this.forward)
        {
            this.forward = true;
        }
        else
        {
            this.forward = false;
        }
    },
    monsterChangeState: function()
    {
        if(this.hitState && this.hitTime > 0)
        {
            this.hitTime -= 300;
            this.currentFrame = 6;
        }
        else if(this.hitState && this.hitTime == 0)
        {
            this.hitState = false;
            this.state = 'hiding';
            this.waitTime = Math.ceil(Math.random() * 50) * 300;
        }
        else if(this.state == 'hiding' && this.waitTime > 0)
        {
            this.waitTime -= 300;
            this.currentFrame = 0;
        }
        else if(this.state == 'hiding' && this.waitTime == 0)
        {
            this.state = 'comeout';
            this.currentFrame = 0;
            this.forward = true;
        }
        else if((this.state == 'comeout') && (this.currentFrame == 0) && (!this.forward))
        {
            this.waitTime = Math.ceil(Math.random() * 20) * 300 + 300;
            this.state = 'hiding';
        }
        else
        {
            this.moveFrames();
        }
    },
};
monster.image = new Image();
monster.image.addEventListener('load', loadHandler, false);
monster.image.src = './image/monsterTileSheet.png';
var Totalhit = 0;
var TotalChance = 36;
// We are going to make 12 copies
var monsterObjects = [];
var monsterCanvases = [];
var monsterDrawingSurfaces = []; 
var ROWS = 3;
var COLUMNS = 4;
var SIZE = monster.size;
var SPACE = 10; 
//The timer
var gameTimer = 
{
    time: 30,
    interval: undefined,
    start: function()
    {
        this.interval = setInterval(this.tick, 1000 );
    },
    tick: function()
    {
        gameTimer.time--;
        if(gameTimer.time == 0)
        {
            gameTimer.stop();
        }
    },
    stop: function()
    {
        clearInterval(this.interval);
    }
}
//The load handler function
function loadHandler()
{
    buildMap(); 
    upDate();
    gameTimer.start();
}
var timer = setInterval(upDate, 150);
//The mouseDownHandler function
function mouseDownHandler(event)
{
    var whichClicked = event.target;
    for(i=0; i< monsterCanvases.length; i++)
    {
        if(monsterCanvases[i] === whichClicked)
        {
            var monster = monsterObjects[i];
            if(monster.state == 'comeout')
            {
                monster.hitState = true;
                monster.hitTime = 900;
                monster.numberOfHit ++;
            }
            TotalChance --;
        }
    }
    
}
function upDate()
{
    if(gameTimer.time == 0 || TotalChance == 0)
    {
        clearInterval(timer);
        output.innerHTML = 'Game Over';
    }
    else
    {
        Totalhit = 0;
        for(i=0; i<monsterObjects.length; i++)
        {
            var drawingSurface = monsterDrawingSurfaces[i];
            var monster = monsterObjects[i]
            render(drawingSurface, monster);
            monsterObjects[i].upDateAnimation();
            Totalhit += monster.numberOfHit;
        }
    }
}
//The render function
function render(drawingSurface, monster)
{
    drawingSurface.clearRect(0,0,monster.size, monster.size);
    drawingSurface.drawImage
    (
        monster.image,
        monster.sourceX, monster.sourceY, monster.size, monster.size,
        0, 0, monster.size, monster.size
    );
    output.innerHTML = `Total hit: ${Totalhit}<br>
    Chance left: ${TotalChance}<br>
    Time left: ${gameTimer.time}`
}
//The buildmap function
function buildMap()
{
    for(var row = 0; row < ROWS; row++)
    {
        for(var column = 0; column < COLUMNS; column++)
        { 
            var newMonsterObject = Object.create(monster);
            newMonsterObject.waitTime = Math.ceil(Math.random() * 50) * 300 + 300;
            monsterObjects.push(newMonsterObject);
            var canvas = document.createElement('canvas');
            canvas.setAttribute('width', SIZE);
            canvas.setAttribute('height', SIZE);
            canvas.style.top = row * (SIZE + SPACE) + "px";
            canvas.style.left = column * (SIZE + SPACE) + "px";
            canvas.addEventListener('mousedown', mouseDownHandler, false); 
            stage.appendChild(canvas);
            monsterCanvases.push(canvas);
            var drawingSurface = canvas.getContext('2d');
            monsterDrawingSurfaces.push(drawingSurface);
        }
    }
}
