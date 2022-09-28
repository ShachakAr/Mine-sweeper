'use strict'


const FLAG = '🚩'
const MINE = '💩'
const EMPTY = ''
const LOST = '💥'
const NORMAL = "😀"
const DEAD = "🤯"
const WIN = "😎"

// modael
var gBoard = []
var gStartTime
var gTimeInterval
var isFristClick
var gLevel = {
    SIZE: 0,
    MINES: 0
}
var gGame = {
    isOn: false,
    shownCount: 0, // how many cells are shown
    markedCount: 0, // how many flags the player placed
    secsPassed: 0,
    markedCorrectlyCount: 0,
    isFristClick
}
const mineLocations = []

function onInitGame(num) {
    gGame.isFristClick = true
    gGame.isOn = true
    document.querySelector('.game-timer span').innerText = ''
    gGame.shownCount = 0

    gLevel.SIZE = num
    if (num === 4) gLevel.MINES = 2
    if (num === 8) gLevel.MINES = 12
    if (num === 12) gLevel.MINES = 32

    document.querySelector('.reset-btn').innerText = NORMAL

    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)

}

function buildBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
            row.push({
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            })
        } board.push(row)
    }

    setRndMines(board)
    setMinesNegsCount(board)
    console.table('board :>> ', board);

    return board
}

function setRndMines(board) {
    for (var l = 0; l < gLevel.MINES; l++) {
        const i = getRndInt(0, gLevel.SIZE - 1)
        const j = getRndInt(0, gLevel.SIZE - 1)
        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            board[i][j].minesAroundCount = EMPTY
            const mineRndLocation = { i: i, j: j }
            mineLocations.push(mineRndLocation)
        } else {
            l--
        }
    }
}

// raise the minesAroundCount for every cell around a mine.
function setMinesNegsCount(board) {

    while (mineLocations.length > 0) {
        const mineLocation = mineLocations[0]
        for (var l = mineLocation.i - 1; l <= mineLocation.i + 1; l++) {
            if (l < 0 || l >= gLevel.SIZE) continue

            for (var m = mineLocation.j - 1; m <= mineLocation.j + 1; m++) {
                if (m < 0 || m >= gLevel.SIZE) continue
                if (l === mineLocation.i && m === mineLocation.j) continue
                if (board[l][m].isMine) continue

                board[l][m].minesAroundCount++

            }
        } mineLocations.splice(0, 1)
    } return board

}

function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j]
            var cellClassName = getClassName(i, j) // cell-0-0


            strHTML += `<td class="cell ' + ' ${cellClassName} '"
            onclick="onClick(this,${i},${j} )"
            oncontextmenu="cellMarked(this, ${i}, ${j})">`

            if (!currCell.isShown) strHTML += `</td>`

            else strHTML += `${getCellContent(currCell)}</td>`

        }
        strHTML += '</tr>'

    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

    var diff = gLevel.MINES - gGame.markedCount
    document.querySelector('.mines-left span').innerHTML = diff

    var elCount = document.querySelector('.shown-count span')
    var shownCount = gGame.shownCount
    elCount.innerHTML = shownCount

    // var minesLeft = (gGame.SIZE)**2 - (gGame.markedCount)
    // document.querySelector('.reveled-places span').innerHTML = minesLeft



}

function getCellContent(currCell) {
    if (currCell.isMarked) return FLAG
    if (currCell.isMine) return MINE
    else return `${currCell.minesAroundCount}`
}

// TODO: start timer function
// showncount is not correct -> negsCount
function onClick(elCell, i, j) {
    var currCell = gBoard[i][j]

    if (!gGame.isOn) return
    if (currCell.isShown) return

    if (gGame.isFristClick) {
        startTimer()
        gGame.isFristClick = false
    }

    currCell.isShown = true
    gGame.shownCount++
    if (currCell.isMine) return Gameover()
    else if (currCell.minesAroundCount === 0) showNegs(i, j)

    renderBoard(gBoard)

}

function cellMarked(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (!gGame.isOn) return


    if (currCell.isMarked) {
        currCell.isMarked = false
        currCell.isShown = false
        gGame.markedCount--
        // gGame.markedCorrectlyCount--
        gGame.shownCount--
        renderBoard(gBoard)
    } else if (currCell.isShown) return
    else {
        currCell.isShown = true
        currCell.isMarked = true
        gGame.markedCount++
        gGame.shownCount++
        renderBoard(gBoard)
        checkVictory(i, j)
    }

}

function checkVictory(i, j) {

    if (!gBoard[i][j].isMine) return

    gGame.markedCorrectlyCount++

    if (gGame.markedCorrectlyCount === gLevel.MINES) {
        console.log('victory!')
        clearInterval(gTimeInterval)
        gGame.isOn = false
        document.querySelector('.reset-btn').innerText = WIN
        gGame.markedCount = 0
        gGame.markedCorrectlyCount = 0

    }
}

// TODO: stop timer 
function Gameover() {
    console.log('game over')

    gGame.isOn = false
    clearInterval(gTimeInterval)
    document.querySelector('.reset-btn').innerText = DEAD
    gGame.markedCount = 0

    renderBoard(gBoard)
}

function onResetGame() {
    onInitGame(gLevel.SIZE)
    document.querySelector('.reset-btn').innerText = NORMAL
}

// TODO: correct the recurseion
function showNegs(i, j) {

    for (var l = i - 1; l <= i + 1; l++) {
        if (l < 0 || l >= gLevel.SIZE) continue

        for (var m = j - 1; m <= j + 1; m++) {
            var currCell = gBoard[l][m]
            if (m < 0 || m >= gLevel.SIZE) continue
            else if (l === i && m === j) continue
            else if (currCell.isMine) continue
            else if (currCell.isShown) continue

            currCell.isShown = true
            gGame.shownCount++
            if (currCell.minesAroundCount === 0) showNegs(l, m)


        }
    }

}

function getClassName(i, j) {
    var cellClass = 'cell-' + i + '-' + j
    return cellClass
}

// function renderCell(i, j, currCellContent) {
//         var cellSelector = '.' + getClassName(i, j) // .cell-3-5
//         var elCell = document.querySelector(cellSelector) // <td></td>
//         elCell.innerHTML = currCellContent
// }

// function renderTheResetBtn(i, j){
//         if (gGame.isOn) renderCell(i, j, NORMAL)
//         else if (!gGame.isOn) renderCell(i, j, DEAD)
//         else if (checkVictory) renderCell(i, j, WIN)
// }    