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
            checkInclineDiagnal(row, col, curPlayer) ||
            checkDeclineDiagnal(row, col, curPlayer)) {
            isWin = true;
        }
        return isWin;
    };

    const checkArrayIsWin = (arr, curP) => {
        let isWin = false;
        const pieceArr = arr.map(cell => cell.getState());
        for (let i = 0; i <= arr.length - 6; i++) { // at index 9 
            if (pieceArr.slice(i,i+5).join('') === curP.repeat(5)) {
                isWin = true;
            }
        }
        return isWin;
    }

    const checkRow = (rowNum, curPlayer) => {
        // check if row meets win condition
        // returns a boolean
        const row = board[rowNum]; // row of Cells
        let isWin = checkArrayIsWin(row, curPlayer); // returns true or false
        return isWin;
    };

    const checkCol = (colNum, curPlayer) => {
        // create col array
        const col = board.reduce((acc, curr)=>{
            acc.push(curr[colNum]);
            return acc;
        },[]);
        let isWin = checkArrayIsWin(col, curPlayer);
        return isWin;
    };
    const checkInclineDiagnal = (rowNum, colNum, curPlayer) => {
        let startingRowIdx;
        let startingColIdx;
        if (rowNum + colNum == 14) {
            startingRowIdx = 14;
            startingColIdx = 0;
        } else if (rowNum + colNum > 14) {
            startingRowIdx = 14;
            startingColIdx = rowNum + colNum - 14;
        } else if (rowNum + colNum < 14) {
            startingRowIdx = rowNum + colNum;
            startingColIdx = 0
        }
        const bottomLeft_topRight = [];
        while (startingRowIdx >= 0 && startingColIdx <= 14) {
            bottomLeft_topRight.push(board[startingRowIdx--][startingColIdx++]);
        }
        let isWin = checkArrayIsWin(bottomLeft_topRight, curPlayer)
        return isWin;
    };

    const checkDeclineDiagnal = (rowNum, colNum, curPlayer) => {
        // need to determine the starting cell of the dignal line
        // first traverse back until row or col hits index 0
        // row, col = (2,1)
        // prev = (1,0)

        const smallerIdx = Math.min(rowNum, colNum); // for determining where the
        // diagnal line starts
        let startingRowIdx = rowNum - smallerIdx;
        let startingColIdx = colNum - smallerIdx;

        // then traverse forward until either row or col hits index 14
        // push each cell into the new array
        const topLeft_bottomRight = [];
        while (startingRowIdx <= 14 && startingColIdx <= 14) {
            topLeft_bottomRight.push(board[startingRowIdx++][startingColIdx++]);
        }

        let isWin = checkArrayIsWin(topLeft_bottomRight, curPlayer)
        return isWin;
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
        // console.log(player, state)
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
        // console.log(cur);
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
        
        // checking if the space is available
        let {isAvailable, errorMessage} = checkSpaceIsEmpty(gameBoard, row, col);
        
        if (isAvailable) { // place a piece
            gameBoard[row][col].setState(curPlayer);
            console.log(`current player ${curPlayer} placed a piece at ${row}:${col}`);
        } else {
            console.log(errorMessage);
        }

        // check if current player wins
        if (gameBoardModule.checkBoardState(curPlayer, row, col)) {
            console.log(`${curPlayer} wins!`);
        } else {
            switchPlayer(curPlayer);
            console.log(`${curPlayer}'s turn!`);
        }
 
        gameBoardModule.printBoard();
    }

    const checkSpaceIsEmpty = (board, row, col) => {
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

