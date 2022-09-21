// 'use strict'


const FLAG = '🚩'
const MINE = '💩'
const EMPTY = ''

// modael
var gBoard = []

var gLevel = {
    SIZE: 0,
    MINES: 0
}
var gGame = {
    isOn: false,
    shownCount: 0, // how many numbers the player reveled
    markedCount: 0, // how many flags the player placed
    secsPassed: 0
}
const mineLocations = []

function onInitGame() {
    
    gGame.isOn = true
    gLevel.SIZE = 4
    gLevel.MINES = 2
    gBoard = buildBoard(gLevel.SIZE); //board size by btn clicked
    console.table(gBoard)
    

    renderBoard(gBoard)

}

function buildBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
            row.push({
                minesAroundCount: 0,
                isShown: true,
                isMine: false,
                isMarked: false
            })
        } board.push(row)
    }
    console.log('board :>> ', board);

    // createmines
    setRndMines(board)
    console.log('mineLocations :>> ', mineLocations);
    // board[1][1].isMine = true
    // board[1][1].isShown = true
    // board[3][3].isMine = true
    // board[3][3].isShown = true
    setMinesNegsCount(mineLocations) //create a negs loop and updates the "minesAroundCount"

    return board
}

function setRndMines(board) {
    for (var k = 0; k < gLevel.MINES; k++) {
        const i = getRndInt(0, gLevel.SIZE - 1)
        const j = getRndInt(0, gLevel.SIZE - 1)
        board[i][j].isMine = true
        const mineRndLocation = { i: i, j: j }
        mineLocations.push(mineRndLocation)
    }
    
}
// raise the minesAroundCount for every cell around a mine.
function setMinesNegsCount(board) {

    for (var k = 0; k < mineLocations.length; k++) {
        const mineLocation = mineLocations[k]
        for (var i = mineLocation.i - 1; i <= mineLocation.i + 1; i++) {
            if (i < 0 || i >= gLevel.SIZE) continue
            for (var j = mineLocation.j - 1; j <= mineLocation.j + 1; j++) {
                if (j < 0 || j >= gLevel.SIZE) continue
                if (i === mineLocation.i && j === mineLocation.j) continue
                // if (currCell.isMine === true) continue
                board[i][j].minesAroundCount += 1
               
            }
        } return board
    }
}

function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j]
            var cellClassName = getClassName({ i: i, j: j }) // cell-0-0


            strHTML += `<td class="cell ' + ${cellClassName} + ' + hide + '"
            onclick="onClick(this,${i},${j} )"
            oncontextmenu="cellMarked(this, ${i}, ${j})">`

            strHTML += (currCell.isMine) ? MINE : '${currCell.minesAroundCount}'

            strHTML += '</td></tr>'
            console.log('strHTML :>> ', strHTML);
        }
    }
    var elBoard = document.querySelector('.board tbody')
    elBoard.innerHTML = strHTML
}


// function onClick(elCell, i, j) {

// }



// function findNegs() {

// }

function Gameover() {
    // if we click a mine
    gGame.isOn = false

}