
// REALLY GOOD CODE

// Options:
// --  1. canvas building 
const elementCreationAttempts = 2000
const placementAttempts = 20
const divSize = 2
const spaceBetween = 2
const margin = 40
const originalBandwidth = 100
const blankCanvas = false

// -- 2. onMouseMove
const repaintSlowness = 9
const brushRadius = 20
const brushTracking = 50

// operational variables
const windowWidth = window.innerWidth
const windowHeight = window.innerHeight
let GridPositions = []
let bandwidth = originalBandwidth
let clickAllowed = true
let firstTime = true

MakeCanvasWithCircles();

document.addEventListener('mousemove', function(e){
    if(firstTime){
        repaintRainbow(1,0,e)
        firstTime = false
    }
    
    const rand = Math.floor(Math.random()*repaintSlowness)
    const rand2 = Math.round(Math.random()-0.3 * 4) + repaintSlowness
    repaintRainbow(rand2, rand, e)

    if (e.buttons != 0) {
        if (clickAllowed){
            bandwidth = originalBandwidth*1.5
            clickAllowed = false
            setTimeout(() => clickAllowed = true, brushTracking)
            for (let i = 0; i < GridPositions.length; i ++) {
                const pos = GridPositions[i]
                const distance = findDistance({left: e.x, top: e.y}, pos)
                if (distance  <= brushRadius + pos.size/3){
                    const elem = document.getElementById(pos.id)
                    if (blankCanvas ? !e.shiftKey : e.shiftKey){
                        elem.classList.remove('drawnOn')
                    }else{
                        elem.classList.add('drawnOn')
                    }
                }
            }
        }
    }
    else {bandwidth = originalBandwidth}
})

function repaintRainbow(slowness, startPoint, cursor){
    for (let i = startPoint; i < GridPositions.length; i += slowness) {
        const pos = GridPositions[i]
        const distance = findDistance({left: cursor.x, top: cursor.y}, pos) 
            + (Math.random()-0.5)*100
        const factor = Math.floor(distance / bandwidth) - 1
        document.getElementById(pos.id).setAttribute('band','band' + factor)
    }
}

function findDistance(pos1, pos2){
    const xDist = Math.abs(pos1.left - pos2.left)
    const yDist = Math.abs(pos1.top - pos2.top)
    return Math.sqrt(xDist*xDist + yDist*yDist)
}




// inital circles placement functions till end of file
function MakeCanvasWithCircles() {
    const main = document.getElementById("main")
    for (let i = 0; i < elementCreationAttempts; i++) {
    
        const divPosition = createCircleFindSpace()
        if (divPosition) {
            id = `circle${i}`
            GridPositions.push({...divPosition, id})
            const elem = document.createElement("div")
            elem.classList.add('circle', blankCanvas && 'drawnOn')
            elem.id = id
            const style = `top: ${divPosition.top}px;
                left: ${divPosition.left}px;
                width: ${divPosition.size}px;
                height: ${divPosition.size}px;
            `
            elem.style.cssText = style;
            main.appendChild(elem)
        }
    }

    console.log(GridPositions);
}

function createCircleFindSpace() {
    for (let i = placementAttempts; i > 0; i--) {
        const position = createRandomPosition(i/placementAttempts)
        if (divFits(position) && !divTouchesEdge(position)){
            return position
        }
    }
    return null
}

function createRandomPosition (sizeFactor) {
    const size = Math.random() * (sizeFactor * divSize * 25) + 10
    let top = Math.random() * (windowHeight - margin*2) + margin
    top += (Math.random() - 0.5) * windowHeight / margin
    let left = Math.random() * (windowWidth - margin*2) + margin
    left += (Math.random() - 0.5) * windowWidth / margin
    
    return {
        size: Math.round(size),
        top: Math.round(top),
        left: Math.round(left),
    }
}

function divFits (divPosition) {
    return GridPositions.every((position) => {
        const distance = findDistance(divPosition, position)
        if (distance - spaceBetween >= divPosition.size/2 + position.size/2){
            return true
        }
    })
}

function divTouchesEdge(pos){
    const rand = (Math.random() - 0.5) * 5000
    if(
        pos.top < margin + pos.size/2 + rand ||
        pos.top > windowHeight - margin - pos.size/2 + rand ||
        pos.left < margin + pos.size/2 + rand ||
        pos.left > windowWidth - margin - pos.size/2 + rand
    ) {true}
}
