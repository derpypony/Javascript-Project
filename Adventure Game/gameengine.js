//create a gallary
var images = [];
for(i=0;i<3;i++) images[i] = ['', '', ''];
images[0][0] = "keep.png";
images[0][1] = "well.png";
images[0][2] = "glade.png";
images[1][0] = "dragon.png";
images[1][1] = "path.png";
images[1][2] = "gate.png";
images[2][0] = "river.png";
images[2][1] = "bench.png";
images[2][2] = "cottage.png";
//Create a map
var map = [];
for(i=0;i<3;i++) map[i] = ['', '', ''];
map[0][0] = "You are in an old stone keep.";
map[0][1] = "You are in a deep well.";
map[0][2] = "You are in a sunny glade.";
map[1][0] = "You find a dragon.";
map[1][1] = "You are in a narrow pathway.";
map[1][2] = "You are in an ancient gate.";
map[2][0] = "You are in a the edge of a river.";
map[2][1] = "You are in a lonely wooden bench.";
map[2][2] = "You are in an isolated cottage. Faint music comes from inside.";
//Display block meassage
var blockedPathMessages = [];
for(i=0;i<3;i++) blockedPathMessages[i] = ['', '', ''];
blockedPathMessages[0][0] = "It's too dangerous to move that way.";
blockedPathMessages[0][1] = "A mysterious force holds you back.";
blockedPathMessages[0][2] = "A tangle of thorns blocks your way.";
blockedPathMessages[1][0] = "You can't step over the dragon.";
blockedPathMessages[1][1] = "";
blockedPathMessages[1][2] = "The gate locks shut.";
blockedPathMessages[2][0] = "The river is too deep to cross.";
blockedPathMessages[2][1] = "The trees are too thick to pass.";
blockedPathMessages[2][2] = "You're too scared to go that way."; 
//Create displaying items, a bag and mapLocation
var itemsInfo = [{i:2, j:0, item:'gold'}, {i:1, j:2, item:'sword'}];
var bag = [];
var mapLocation = {i:1,j:1};
var GameMessage = document.getElementById('GameMessage');
var GameDescription = document.getElementById('GameDescription');
var HelpMessage = document.getElementById('HelpMessage');
var image = document.querySelector('img');
var dragonSleep = false;
var dragonKill = false;
//The ToWhereFunction
function ToWhereFunction()
{
    input = document.querySelector('input[name = "toLocation"]:checked');
    if(input == undefined) GameMessage.innerHTML = 'Please choose an option';
    else
    {
        if(testLocation(input.value))
        {
            moveFunction(input.value);
            GameMessage.innerHTML = '';
        } 
        else 
        {
            GameMessage.innerHTML =
            blockedPathMessages[mapLocation.i][mapLocation.j];
        }
        ItemDisplayFunction(itemsInfo, mapLocation);
        displayHelpFunction(mapLocation);
    } 
}
//The displayHelpFunction
function displayHelpFunction(mapLocation)
{
    if(_.isEqual(mapLocation, {i:2, j:0})) HelpMessage.innerHTML = "You can use the gold to exchange for someting";
    else if(_.isEqual(mapLocation, {i:2, j:2})) HelpMessage.innerHTML = "You can use gold to exchange for flute";
    else if(_.isEqual(mapLocation, {i:1, j:0})) HelpMessage.innerHTML = "You need to kill the dragon";
    else if(_.isEqual(mapLocation, {i:1, j:2})) HelpMessage.innerHTML = "You need a key to open it, the dragon has the key";
}


//The ItemDisplayFunction
function ItemDisplayFunction(itemsInfo, mapLocation)
{
    var itemIndex = _.findIndex(itemsInfo, mapLocation);
    document.querySelectorAll('.GameItemFind')[0].style.display = 'none';
    document.querySelectorAll('.GameItemFind')[1].style.display = 'none';
    document.querySelectorAll('.GameItemFind')[2].style.display = 'none';
    if(itemIndex >= 0)
    {
        document.querySelector(`li[id$=${itemsInfo[itemIndex].item}]`).style.display = 'block';
    }
    image.src = images[mapLocation.i][mapLocation.j];
    GameDescription.innerHTML =  map[mapLocation.i][mapLocation.j];
}
//The PickUpFunction(it worked fine)
function PickUpFunction()
{
    if(bag.length < 2)
    {
        var itemIndex = _.findIndex(itemsInfo, mapLocation);
        var item = itemsInfo[itemIndex].item;
        document.querySelector(`li[id$=${item}]`).style.display = 'none';
        document.querySelector(`li[id^=${item}]`).style.display = 'block';
        itemsInfo.splice(itemIndex, 1);
        bag.push(item);
    }
    else alert('Bag is full!');
}

//The DropFunction
function DropFunction(item)
{
    if(_.findIndex(itemsInfo, mapLocation) >= 0) alert('Can\'t drop in here');
    else
    {
        document.querySelector(`li[id$=${item}]`).style.display = 'block';
        document.querySelector(`li[id^=${item}]`).style.display = 'none';
        var newElement = _.clone(mapLocation);
        newElement.item = item;
        itemsInfo.push(newElement);
        var itemIndex  = bag.indexOf(item);
        bag.splice(itemIndex, 1);
    }
}
//The moveFunction (it is fine)
function moveFunction(input)
{
    switch(input)
    {
        case 'north': mapLocation.i --; break;
        case 'east': mapLocation.j ++; break;
        case 'west': mapLocation.j --; break;
        case 'south': mapLocation.i ++; break;
    }
}

//return true if it can keep going, 
//return false if can't keep going(it is fine)
function testLocation(input)
{
    if(input == 'north' && mapLocation.i <= 0) return false;
    else if(input == 'west' && mapLocation.j <= 0) return false;
    else if(input == 'east' && mapLocation.j >= 2) return false;
    else if(input == 'south' && mapLocation.i >= 2) return false;
    else return true;
}
//The UseFunction
function UseFunction(item)
{
    var element = document.querySelector(`li[id^=${item}]`);
    var itemIndex  = bag.indexOf(item);
    if(item == 'gold' && _.isEqual(mapLocation, {i:2, j:2}))
    {
        element.style.display = 'none';
        bag.splice(itemIndex, 1);
        itemsInfo.push({i:2, j:2, item:'flute'});
        document.getElementById('findflute').style.display = 'block';
    }
    if(item == 'flute' && _.isEqual(mapLocation, {i:1, j:0}))
    {
        element.style.display = 'none';
        bag.splice(itemIndex, 1);
        dragonSleep = true;
        HelpMessage.innerHTML = 'The dragon is asleep now';
    }
    if(item == 'sword' && _.isEqual(mapLocation, {i:1, j:0}))
    {
        if(dragonSleep == true)
        {
            element.style.display = 'none';
            bag.splice(itemIndex, 1);
            HelpMessage.innerHTML = 'You kill the dragon!';
            dragonKill = true;
            itemsInfo.push({i:1, j:0, item:'key'});
            document.getElementById('findkey').style.display = 'block';
        }
        else
        {
            HelpMessage.innerHTML = 'You need the dragon to fall asleep, or it is too dangerous to attack!';
        }
    }
    if(item == 'key' && _.isEqual(mapLocation, {i:1, j:2}))
    {
        element.style.display = 'none';
        bag.splice(itemIndex, 1);
        GameMessage.innerHTML = '<b>You escape the forest!</b>';
        document.getElementById("selecttowhere").style.display = 'none';
        HelpMessage.style.display = 'none';
        document.getElementById("mybag").style.display = 'none';
    }
}
