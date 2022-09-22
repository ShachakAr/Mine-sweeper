'use strict'

function getRandCell() {

    for (var k = 0; k < gLevel.MINES; k++) {

        var i = getRndInt(0, gLevel - 1)
        var j = getRndInt(0, gLevel - 1)
        if (!board[i][j]) continue
    }
    return board[i][j]
}



function getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// recives {i: ?, j: ?} and generates a str for the class rendering
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}
function startTimer() {
    gStartTime = Date.now()
    gTimeInterval = setInterval(updateTimer, 100)
}

function updateTimer() {
    var diff = Date.now() - gStartTime
    var inSeconds = (diff / 1000).toFixed(3)
    gGame.secsPassed = inSeconds
    document.querySelector('.h2 .game-timer .span').innerText = inSeconds
}


