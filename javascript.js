// project gomoku
// Oct/11/2024

// brainstorm
// 15 x 15 board
// connect 5 to win (verticle, horizontal, diagonal)


const gameBoardModule = (function gameBoard() {
    const board = [];
    const cols = 15;
    const rows = 15;

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i].push(Unit());
        }
    }
    

    const checkBoardState = (curPlayer, row, col) => {
        // logic to check if winning state exist
        // connect 5 vertically, horizontally or diagonally
        // casual rule, no restriction

        // check board state for current player, after placed a piece
        // check if connect 5 exist in horizontal line, vertical line and two
        // diagonal lines
        let isWin = false;
        if (checkRow(row, curPlayer) || checkCol(col, curPlayer) ||
            checkDiagnal(row, col, curPlayer)) {
            isWin = true;
        }
        return isWin;
    };

    const checkRow = (rowNum, curPlayer) => {
        // check if row meets win condition
        // returns a boolean
        console.log(rowNum);
        const row = board[rowNum]; // row of Cells
        printBoard();
        console.log(row);
        let isWin = false;
        outerloop: for (let i = 0; i <= row.length - 6; i++) { // at index 9 
            // check if current cell has curPlayer piece, return true or false
            if (row[i].checkCellState(curPlayer)) {// if true, check next 4 pieces
                for (let j = i + 1; j < i + 4; j++) {
                    if (!row[j].checkCellState(curPlayer)) {
                        // if j has no curPlayer piece, back to outer loop
                        i = j;
                        continue outerloop;
                    }
                    isWin = true;
                    console.log(`${curPlayer} wins!`)
                    return isWin;
                }
            }
        }
        console.log("no winners yet")
        return isWin;
    };

    const checkCol = (colNum, curPlayer) => {

    };

    const checkDiagnal = (rowNum, colNum, curPlayer) => {

    };

    const printBoard = () => {
        const prettyBoard = board.map((row) => row.map((cell) => cell.getState()));
        console.log(prettyBoard);
    }
    return {board, checkBoardState, printBoard};
})();

function Unit(){
    // player piece
    let state = null;

    const setState = (player) => {
        state = player;
    }

    const getState = () => {
        return state;
    }

    const checkCellState = (player) => {
        console.log(player, state)
        return state === player;
    }

    return {setState, getState, checkCellState};
}

const playerFactory = function player() {
    const player1 = "x";
    const player2 = "o";
    return {player1, player2};
}

const gameLogicModule = (function gameLogic() {
    const {player1, player2} = playerFactory();
    const gameBoard = gameBoardModule.board;
    let curPlayer = player1;

    const switchPlayer = (cur) => {
        console.log(cur);
        curPlayer = cur === player1 ? player2 : player1;
    };

    const playRound = (row, col) => {
        // check if row, col num is legal
        if (row == null || col == null) {
            console.log("illegal inputs, please provide row and col between 0 and 2");
            return;
        }
        if (row < 0 || row > 15 || col < 0 || col > 15) {
            console.log("illegal inputs, please provide row and col between 0 and 15");
            return;
        }

        console.log(`current player is ${curPlayer}`);
        console.log(`current player ${curPlayer} placed a piece at row: ${row},
                    col: ${col}`);
        console.log(`current board looks like:`);

        
        // checking if the space is available
        let {isAvailable, errorMessage} = checkSpace(gameBoard, row, col);
        
        if (isAvailable) {
            gameBoard[row][col].setState(curPlayer);
            gameBoardModule.checkBoardState(curPlayer, row, col);
            
            switchPlayer(curPlayer);
            console.log("place piece success")
            console.log(`current player is ${curPlayer}`);
        } else {
            console.log(errorMessage);
        }
 
        gameBoardModule.printBoard();
    }

    const checkSpace = (board, row, col) => {
        let isAvailable = true;
        let errorMessage = "";
        if (!!board[row][col].getState()) {
            isAvailable = false;
            errorMessage = "can't place piece, a piece exist";
        }
        return {isAvailable, errorMessage};
    }
    
    return {playRound};
})();

