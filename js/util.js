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