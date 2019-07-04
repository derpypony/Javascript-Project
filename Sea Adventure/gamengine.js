//Create the map moving object and query elements
var map =
[
 [0, 2, 0, 0, 0, 3],
 [0, 0, 0, 1, 0, 0],
 [0, 1, 0, 0, 0, 0],
 [0, 0, 0, 0, 2, 0],
 [0, 2, 0, 1, 0, 0],
 [0, 0, 0, 0, 0, 0]
]; 
var SIZE = 64;
var ROWS = map.length;
var COLUMNS = map[0].length;
var stage = document.querySelector('#stage');
var gameMessage = document.querySelector('#gameMessage');
var gameInfo = document.querySelector('#gameInfo');
//code for different objects
objectCode = {water:0, island:1, pirate:2, home:3};
//Ship and monster Info
var shipInfo = {i:5, j:0, gold:10, food:10, experience:0, alive:true};
var monsterInfo = {i:1, j:2, alive:true};
var message = 'Use the arrow keys to find your way home.<br>';
//Get eventlistenlier
window.addEventListener('keydown', keydownHandler, false);
var clickInfo = {up:38, down:40, right:39, left:37};
//First render()
render();
//The keydownHandler function
function keydownHandler(event)
{
    shipInfo.food--;
    switch(event.keyCode)
    {
        case clickInfo.up:
            if(shipInfo.i > 0)
            {
                shipInfo.i--;
            }
            break;

        case clickInfo.down:
            if(shipInfo.i < ROWS - 1)
            {
                shipInfo.i++;
            }
            break;

        case clickInfo.right:
            if(shipInfo.j < COLUMNS - 1)
            {
                shipInfo.j++;
            }
            break;
        
        case clickInfo.left:
            if(shipInfo.j > 0)
            {
                shipInfo.j--;
            }
        break;
    }
    switch(map[shipInfo.i][shipInfo.j])
    {
        case objectCode.water:
            message = 'You sail the open seas.';
            break;
        
        case objectCode.pirate:
            fight();
            break;

        case objectCode.island:
            trade();
            break;
    }
    moveMonster()
    anylysis()
    render();
}
//The function trade()
function trade()
{
    var islandsFood = shipInfo.gold;
    var cost = Math.ceil(Math.random() * islandsFood);
    if(shipInfo.gold > cost)
    {
        shipInfo.food += islandsFood;
        shipInfo.gold -= cost;
        message = 'Good Deal!'
    }
    else
    {
        message = "You don't have enough gold";
    }
}
//The fight function
function fight()
{
    var shipStrength = Math.ceil((shipInfo.food + shipInfo.gold)/2);
    var pirateStrength = Math.ceil(shipStrength * 2 * Math.random());
    if(pirateStrength > shipStrength)
    {
        var stolenGold = Math.round(pirateStrength / 2);
        shipInfo.gold -= stolenGold;
        shipInfo.experience ++;
        message = 'You lost the fight';
    }
    else
    {
        var pirateGold = Math.round(pirateStrength / 2);
        shipInfo.gold += pirateGold;
        shipInfo.experience += 2;
        message = 'You win the fight!';
    }
}
//The anylysis function
function anylysis()
{  //shipInfo.i == monsterInfo.i && shipInfo.j == monsterInfo.j && monsterInfo.alive == true
    if(_.isMatch(shipInfo, monsterInfo))
    {
        if(shipInfo.experience > 4)
        {
            message = 'You kill the monster!';
            monsterInfo.alive = false;
            shipInfo.experience -= 4;
            shipInfo.food += 15;
        }
        else
        {
            message = 'You are killed by the monster!';
            shipInfo.alive = false;
            window.removeEventListener('keydown', keydownHandler, false);
        }
    }
    if(_.isMatch(shipInfo, {i:0, j:5, alive:true}))
    {
        message = 'You are home!';
        window.removeEventListener('keydown', keydownHandler, false);
    }
    if(shipInfo.food <= 0 || shipInfo.gold <= 0)
    {
        shipInfo.alive = false;
        message = 'You are ousted by your crew!';
        window.removeEventListener('keydown', keydownHandler, false);
    }
}
//The movemonster function
function moveMonster()
{
    var newMonstePosition = 
    {
        i: monsterInfo.i + Math.floor(Math.random() * 3 - 1), 
        j: monsterInfo.j + Math.floor(Math.random() * 3 - 1)
    };
    try
    {
        isWater = map[newMonstePosition.i][newMonstePosition.j];
        if(isWater == objectCode.water)
        {
            monsterInfo.i = newMonstePosition.i;
            monsterInfo.j = newMonstePosition.j;
        }
    }
    catch
    {

    }
}
//The function render()
function render()
{
    //Clear the whole map
    while(stage.hasChildNodes()) {stage.removeChild(stage.firstChild);}
    //Populate the whole map
    for(row=0; row<ROWS; row++)
    {
        for(column=0; column<COLUMNS; column++)
        {
            var cell = document.createElement('img');
            cell.setAttribute('class', 'cell');
            stage.appendChild(cell);
            switch(map[row][column])
            {
                case objectCode.water:
                    cell.src = './water.png';
                    break;
                
                case objectCode.island:
                    cell.src = 'island.png';
                    break;

                case objectCode.pirate:
                    cell.src = 'pirate.png';
                    break;

                case objectCode.home:
                    cell.src = 'home.png';
                    break;
            }
            if(_.isMatch(shipInfo, {i:row, j:column}))
            {
                if(shipInfo.alive)
                {
                    cell.src = 'ship.png';
                }
                else
                {
                    if(_.isMatch(monsterInfo, {i:row, j:column, alive:true}))
                    {
                        cell.src = 'monster.png';
                    } 
                    else cell.src = './water.png';
                }
            }
            if(_.isMatch(monsterInfo, {i:row, j:column}))
            {
                if(monsterInfo.alive)
                {
                    cell.src = 'monster.png';
                }
                else
                {
                    if(_.isMatch(shipInfo, {i:row, j:column, alive:true}))
                    {
                        cell.src = 'ship.png';
                    }
                    else cell.src = './water.png';
                }
            }
            cell.style.top = row * SIZE + 'px';
            cell.style.left = column * SIZE + 'px';
        }
    }
    gameMessage.innerHTML = message;
    gameInfo.innerHTML = `
    Gold: ${shipInfo.gold}<br>
    Food: ${shipInfo.food}<br>
    Experience: ${shipInfo.experience}`;
}
