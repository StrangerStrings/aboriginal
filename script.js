
// REALLY GOOD CODE

var numOfElements = 2000
var margin = 40
var fuzzyEdge1 = 1
var fuzzyEdge2 = 10
var divSize = 2
var tries = 20
var spaceBetween = 1

var bandwidth = 100

var main = document.getElementById("main")
var windowWidth = window.innerWidth
var windowHeight = window.innerHeight
var gridPositions = []
    
for (let i = 0; i < numOfElements; i++) {

    var divPosition = tryFindSpace()
    if (divPosition) {
        id = `circle${i}`
        gridPositions.push({...divPosition, id})
        var elem = document.createElement("div")
        elem.classList.add('myClass')
        elem.id = id
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
        if (divFits(position) && !divTouchesEdge(position)){
            return position
        }
    }
    return null
}

function createRandomPosition (sizeFactor) {
    var size = Math.random() * (sizeFactor * divSize * 25) + 10
    var top = Math.random() * (windowHeight - margin*2) + margin
    top += (Math.random() - 0.5) * windowHeight * fuzzyEdge1 / 50
    var left = Math.random() * (windowWidth - margin*2) + margin
    left += (Math.random() - 0.5) * windowWidth * fuzzyEdge1 / 50
    
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
        return divsOverlap(divPosition, position)
    })
    return !itDoesntFit
}

function divsOverlap(pos1, pos2){
    var distance = findDistance(pos1, pos2)
    if (distance - spaceBetween <= pos1.size/2 + pos2.size/2){
        return true
    }
}

function divTouchesEdge(pos){
    var rand = (Math.random() - 0.5) * fuzzyEdge2 * 50
    if(
        pos.top < margin + pos.size/2 + rand ||
        pos.top > windowHeight - margin - pos.size/2 + rand ||
        pos.left < margin + pos.size/2 + rand ||
        pos.left > windowWidth - margin - pos.size/2 + rand
    ) {true}
}

function findDistance(pos1, pos2){
    var xDist = Math.abs(pos1.left - pos2.left)
    var yDist = Math.abs(pos1.top - pos2.top)
    return Math.sqrt(xDist*xDist + yDist*yDist)
}

let repaintSlower = 9
let clickAllowed = true
let firstTime = true
let brushRadius = 20
let brushTracking = 50
document.addEventListener('mousemove', function(e){
    if(firstTime){
        repaintAtSlowness(1,0)
        firstTime = false
    }

    let rand = Math.floor(Math.random()*repaintSlower)
    repaintAtSlowness(repaintSlower, rand)

    function repaintAtSlowness(slowness, startPoint){
        for (let i = startPoint; i < gridPositions.length; i += slowness) {
            var pos = gridPositions[i]
            var distance = findDistance({left: e.x, top: e.y}, pos) 
                + (Math.random()-0.5)*100
            var factor = Math.floor(distance / bandwidth) - 1
            document.getElementById(pos.id).setAttribute('band','band' + factor)
        }
    }

    if (e.buttons != 0) {
        if (clickAllowed){
            clickAllowed = false
            setTimeout(() => clickAllowed = true, brushTracking)
            for (let i = 0; i < gridPositions.length; i ++) {
                var pos = gridPositions[i]
                var distance = findDistance({left: e.x, top: e.y}, pos)
                if (distance  <= brushRadius + pos.size/3){
                    var elem = document.getElementById(pos.id)
                    console.log(e)
                    elem.classList.add('drawnOn')
                    if(e.shiftKey){
                        elem.classList.remove('drawnOn')
                    }
                }
            }
        }
    }
})





// im gonna learn to type with my left hand
// tho that ^ was typed with two