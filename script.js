
// REALLY GOOD CODE

// Options:
// --  1. canvas building 
const numOfElements = 2000
const placementAttempts = 20
const divSize = 2
const spaceBetween = 2
const margin = 40
const originalBandwidth = 100

// -- 2. onMouseMove
const repaintSlowness = 9
const brushRadius = 20
const brushTracking = 50

// working variables
const windowWidth = window.innerWidth
const windowHeight = window.innerHeight
let gridPositions = []
let bandwidth = originalBandwidth
let clickAllowed = true
let firstTime = true

MakeCanvasWithCircles();

document.addEventListener('mousemove', function(e){
    if(firstTime){
        repaintAtSlowness(1,0,e)
        firstTime = false
    }

    const rand = Math.floor(Math.random()*repaintSlowness)
    repaintAtSlowness(repaintSlowness, rand, e)

    if (e.buttons != 0) {
        if (clickAllowed){
            bandwidth = originalBandwidth*1.5
            clickAllowed = false
            setTimeout(() => clickAllowed = true, brushTracking)
            for (let i = 0; i < gridPositions.length; i ++) {
                const pos = gridPositions[i]
                const distance = findDistance({left: e.x, top: e.y}, pos)
                if (distance  <= brushRadius + pos.size/3){
                    const elem = document.getElementById(pos.id)
                    elem.classList.add('drawnOn')
                    if(e.shiftKey){
                        elem.classList.remove('drawnOn')
                    }
                }
            }
        }
    }
    else {bandwidth = originalBandwidth}
})

function repaintAtSlowness(slowness, startPoint, cursor){
    for (let i = startPoint; i < gridPositions.length; i += slowness) {
        var pos = gridPositions[i]
        var distance = findDistance({left: cursor.x, top: cursor.y}, pos) 
            + (Math.random()-0.5)*100
        var factor = Math.floor(distance / bandwidth) - 1
        document.getElementById(pos.id).setAttribute('band','band' + factor)
    }
}

function findDistance(pos1, pos2){
    var xDist = Math.abs(pos1.left - pos2.left)
    var yDist = Math.abs(pos1.top - pos2.top)
    return Math.sqrt(xDist*xDist + yDist*yDist)
}




// inital circles placement functions till end of file
function MakeCanvasWithCircles() {
    var main = document.getElementById("main")
    for (let i = 0; i < numOfElements; i++) {
    
        var divPosition = createCircleFindSpace()
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
}

function createCircleFindSpace() {
    for (let i = placementAttempts; i > 0; i--) {
        var position = createRandomPosition(i/placementAttempts)
        if (divFits(position) && !divTouchesEdge(position)){
            return position
        }
    }
    return null
}

function createRandomPosition (sizeFactor) {
    var size = Math.random() * (sizeFactor * divSize * 25) + 10
    var top = Math.random() * (windowHeight - margin*2) + margin
    top += (Math.random() - 0.5) * windowHeight / margin
    var left = Math.random() * (windowWidth - margin*2) + margin
    left += (Math.random() - 0.5) * windowWidth / margin
    
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
        var distance = findDistance(divPosition, position)
        if (distance - spaceBetween <= divPosition.size/2 + position.size/2){
            return true
        }
    })
    return !itDoesntFit
}

function divTouchesEdge(pos){
    var rand = (Math.random() - 0.5) * 5000
    if(
        pos.top < margin + pos.size/2 + rand ||
        pos.top > windowHeight - margin - pos.size/2 + rand ||
        pos.left < margin + pos.size/2 + rand ||
        pos.left > windowWidth - margin - pos.size/2 + rand
    ) {true}
}
