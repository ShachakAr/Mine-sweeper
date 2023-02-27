'use strict'

const FLAG = '🚩'
const MINE = '💩'
const LOST = '💥'
const NORMAL = "😀"
const DEAD = "🤯"
const WIN = "😎"


var gBoard = []
var gStartTime
var gTimeInterval
var isFristClick

const gLevel = {
    boardSize: 0,
    minesCount: 0
}

const gGame = {
    isOn: false,
    shownCount: 0, // how many cells are shown on the players board
    markedCount: 0, // how many flags the player placed
    secsPassed: 0,
    markedCorrectlyCount: 0,
    isFristClick
}

const gMineLocations = []

function onInitGame(num) {

    gGame.isFristClick = true
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.markedCorrectlyCount = 0
    document.querySelector('.game-timer span').innerText = 0

    gLevel.boardSize = num
    if (num === 4) gLevel.minesCount = 2
    else if (num === 8) gLevel.minesCount = 12
    else if (num === 12) gLevel.minesCount = 32

    document.querySelector('.reset-btn').innerText = 'Restart ' + NORMAL

    gBoard = buildBoard(gLevel.boardSize)
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
                isMarked: false,
            })
        } board.push(row)
    }

    setRndMines(board)
    swtMinesAroundCount(board)

    console.table('board :>> ', board);

    return board
}

function setRndMines(board) {
    console.log('setting mines')

    for (var l = 0; l < gLevel.minesCount; l++) {
        var i = getRndInt(0, gLevel.boardSize - 1)
        var j = getRndInt(0, gLevel.boardSize - 1)
        console.log('mines locations', i, j)
        if (board[i][j].isMine) {
            l--
            continue
        }
        board[i][j].isMine = true
        var mineRndLocation = { i: i, j: j }
        gMineLocations.push(mineRndLocation)
    }
}

function swtMinesAroundCount(board) {

    while (gMineLocations.length > 0) {
        const mineLocation = gMineLocations[0]
        for (var i = mineLocation.i - 1; i <= mineLocation.i + 1; i++) {
            if (i < 0 || i >= gLevel.boardSize) continue

            for (var j = mineLocation.j - 1; j <= mineLocation.j + 1; j++) {
                if (j < 0 || j >= gLevel.boardSize) continue
                if (i === mineLocation.i && j === mineLocation.j) continue
                if (board[i][j].isMine) continue

                board[i][j].minesAroundCount++
            }
        }
        gMineLocations.splice(0, 1)
    }
}

function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j]
            var cellClassName = getClassName(i, j) // cell-0-0

            strHTML += `<td class="cell ' + ' ${cellClassName} '"
            onclick="onClick(this, ${i}, ${j} )"
            oncontextmenu="cellMarked(this, ${i}, ${j})">`

            if (!currCell.isShown) strHTML += `</td>`
            else strHTML += `${getCellContent(currCell)}</td>`

        }
        strHTML += '</tr>'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

    const minesLeft = gLevel.minesCount - gGame.markedCount
    document.querySelector('.mines-left span').innerHTML = minesLeft

    const elCount = document.querySelector('.shown-count span')
    elCount.innerHTML = gGame.shownCount

}


function onClick(elCell, i, j) {
    var currCell = gBoard[i][j]

    if (!gGame.isOn || currCell.isShown) return

    if (gGame.isFristClick) {
        startTimer()
        // TODO: first click cant be 'mine' - build board here, and than start play.
       
        gGame.isFristClick = false
    }

    currCell.isShown = true
    gGame.shownCount++

    // TODO: add support for lives
    if (currCell.isMine) return Gameover()

    else if (currCell.minesAroundCount === 0) showNegs(i, j)
    renderBoard(gBoard)

}

function cellMarked(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (!gGame.isOn || (currCell.isShown && !currCell.isMarked)) return

    if (currCell.isMarked) {
        currCell.isMarked = false
        currCell.isShown = false
        gGame.markedCount--
        gGame.shownCount--
        if (currCell.isMine) gGame.markedCorrectlyCount--
        renderBoard(gBoard)
    } else {
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

    console.log('Mine marked correctly')
    gGame.markedCorrectlyCount++

    if (gGame.markedCorrectlyCount === gLevel.minesCount) {
        console.log('victory!')
        clearInterval(gTimeInterval)
        gGame.isOn = false
        document.querySelector('.reset-btn').innerText = 'Restart ' + WIN
    }
}

function Gameover() {
    console.log('game over')

    gGame.isOn = false
    clearInterval(gTimeInterval)
    document.querySelector('.reset-btn').innerText = 'Restart ' + DEAD

    renderBoard(gBoard)
}

function onResetGame() {
    onInitGame(gLevel.boardSize)
    // document.querySelector('.reset-btn').innerText = NORMAL
}

function showNegs(cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gLevel.boardSize) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            var currCell = gBoard[i][j]
            if (j < 0 || j >= gLevel.boardSize ||
                (i === cellI && j === cellJ) ||
                (currCell.isShown)) continue

            currCell.isShown = true
            gGame.shownCount++
            if (currCell.minesAroundCount === 0) showNegs(i, j)
        }
    }
}

function getCellContent(currCell) {
    if (currCell.isMarked) return FLAG
    else if (currCell.isMine) return MINE
    else return `${currCell.minesAroundCount}`
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