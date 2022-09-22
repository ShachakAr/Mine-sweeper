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
var isFristClick = true
var gLevel = {
    SIZE: 0,
    MINES: 0
}
var gGame = {
    isOn: false,
    shownCount: 0, // how many numbers the player reveled
    markedCount: 0, // how many flags the player placed
    secsPassed: 0,
    markedCorrectlycount: 0
}
const mineLocations = []

function onInitGame(num) {
    isFristClick = true
    gGame.isOn = true
    gLevel.SIZE = num
    if (num === 4) gLevel.MINES = 2
    if (num === 8) gLevel.MINES = 12
    if (num === 12) gLevel.MINES = 32
    gBoard = buildBoard(gLevel.SIZE);
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
    console.table('board :>> ', board);

    setRndMines(board)
    setMinesNegsCount(board) //create a negs loop and updates the "minesAroundCount"

    return board
}

function setRndMines(board) {
    for (var k = 0; k < gLevel.MINES; k++) {
        const i = getRndInt(0, gLevel.SIZE - 1)
        const j = getRndInt(0, gLevel.SIZE - 1)
        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            board[i][j].minesAroundCount = EMPTY
            const mineRndLocation = { i: i, j: j }
            mineLocations.push(mineRndLocation)
        } else {
            k--
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


            strHTML += `<td class="cell ' + ' ${cellClassName} ' + ' hide '"
            onclick="onClick(this,${i},${j} )"
            oncontextmenu="cellMarked(this, ${i}, ${j})">`

            if (!currCell.isShown) strHTML += `</td>`

            else strHTML += `${getCellContent(currCell)}`

        }
        strHTML += '</tr>'

    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

    var diff = gLevel.MINES - gGame.markedCount
    document.querySelector('.mines-left span').innerHTML = diff
    // var minesLeft = (gGame.SIZE)**2 - (gGame.markedCount)
    // document.querySelector('.reveled-places span').innerHTML = minesLeft

    
    
}

function getCellContent(currCell) {
    if (currCell.isMarked) return FLAG
    if (currCell.isMine) return MINE
    else return `${currCell.minesAroundCount}`
}

function onClick(elCell, i, j) {
    var currCell = gBoard[i][j]
    // if(isFristClick) startTimer()
    if (!gGame.isOn) return
    if (currCell.isShown) return

    currCell.isShown = true
    // if (isFristClick && currCell.isMine) return
    // if (isFristClick){
    //     // startTimer()
    //     isFristClick = false
    // }    
    
    if (currCell.isMine && isFristClick) return
    else if (currCell.isMine) return  Gameover()
    else if (currCell.minesAroundCount > 0) {
        gGame.shownCount++
        isFristClick = false
        
    } else if (currCell.minesAroundCount === 0){ 
        showNegs(i, j)
    }
    
    renderBoard (gBoard)

        
}

function cellMarked(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (!gGame.isOn) return

    if (currCell.isMarked) {
        currCell.isMarked = false
        currCell.isShown = false
        renderBoard(gBoard)
    } else if (currCell.isShown) return
    else {
        currCell.isShown = true
        currCell.isMarked = true
        gGame.markedCount++
        checkVictory(i, j)
        renderBoard(gBoard)
    }
}

function checkVictory(i, j) {

    if (!gBoard[i][j].isMine) return

    gGame.markedCorrectlycount++
    var emptycells = gGame.SIZE**2 - gGame.markedCount
    if (gGame.markedCorrectlycount === gLevel.MINES){
        console.log('victory!')
        clearInterval(gTimeInterval)
        gGame.isOn = false
        document.querySelector('.reset-btn').innerText = WIN
        // stop time, change picure
    }
}

function Gameover(i, j) {
    gGame.isOn = false
    clearInterval(gTimeInterval) 
    console.log('game over')
    document.querySelector('.reset-btn').innerText = DEAD
    renderBoard(gBoard)
    // TODO: stop timer change picture
}
function onResetGame(){
    onInitGame(gLevel.SIZE)
    document.querySelector('.reset-btn').innerText = NORMAL
}

function showNegs(i, j) {
    // const extraCheck = []
    for (var l = i - 1; l <= i + 1; l++) {
        if (l < 0 || l >= gLevel.SIZE) continue

        for (var m = j - 1; m <= j + 1; m++) {
            if (m < 0 || m >= gLevel.SIZE) continue
            if (l === i && m === j) continue
            // if (gBoard[l][m].isMine) continue
            gBoard[l][m].isShown = true
            gGame.shownCount++
            isFristClick = false
            // if (gBoard[l][m].minesAroundCount === 0) extraCheck.push({i: l, j: m})

        }
    }
    // if (!extraCheck) showNegs(extraCheck.i, extraCheck.j)
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