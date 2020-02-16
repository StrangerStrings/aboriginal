
// REALLY GOOD CODE

var numOfElements = 2000
var margin = 80
var divSize = 2.5
var tries = 20
var spaceBetween = 1

var main = document.getElementById("main")
var windowWidth = window.innerWidth
var windowHeight = window.innerHeight
var gridPositions = []
    
for (let i = 0; i < numOfElements; i++) {

    var divPosition = tryFindSpace()
    if (divPosition) {
        gridPositions.push(divPosition)
        var elem = document.createElement("div")
        elem.classList.add('myClass')
        elem.id = `circle${i}`
        var style = `top: ${divPosition.top}px;
            left: ${divPosition.left}px;
            width: ${divPosition.size}px;
            height: ${divPosition.size}px;
        `
        elem.style.cssText = style;
        main.appendChild(elem)
    }

}
console.log(gridPositions);


function tryFindSpace() {
    for (let i = tries; i > 0; i--) {
        var position = createRandomPosition(i/tries)
        var divfits = divFits(position)
        if (divfits){
            return position
        }
        // console.log(i)
    }
    return null
}

function createRandomPosition (sizeFactor) {
    var size = Math.random() * (sizeFactor * divSize * 25) + 10
    var top = Math.random() * (windowHeight - margin*2) + margin
    var left = Math.random() * (windowWidth - margin*2) + margin
    
    return {
        size: Math.round(size),
        top: Math.round(top),
        left: Math.round(left),
    }
}

function divFits (divPosition) {
    if (gridPositions.length == 0){
        return true
    }
    var itDoesntFit = gridPositions.some((position) => {
        return divsOverlap(divPosition, position) ||
        divTouchesEdge(divPosition)
    })
    return !itDoesntFit
}

function divsOverlap(pos1, pos2){
    var xDist = Math.abs(pos1.left - pos2.left)
    var yDist = Math.abs(pos1.top - pos2.top)
    var distance = Math.sqrt(xDist*xDist + yDist*yDist)

    if (distance - spaceBetween <= pos1.size/2 + pos2.size/2){
       return true
    }
}

function divTouchesEdge(pos){
    if(
        pos.top < pos.size/2 ||
        pos.top > windowHeight - pos.size/2 ||
        pos.left < pos.size/2 ||
        pos.left > windowWidth - pos.size/2
    ){return true}
}