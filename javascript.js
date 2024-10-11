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
    

    const checkState = () => {
        console.table(board);
    };

    const printBoard = () => {
        const prettyBoard = board.map((row) => row.map((cell) => cell.getState()));
        console.log(prettyBoard);
    }
    return {board, checkState, printBoard};
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

    return {setState, getState};
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
        // check if row, col num legal
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
        // gameBoardModule.printBoard();
        
        // current player place a tokken with logic checking if
        // space is available
        let {isAvailable, errorMessage} = checkSpace(gameBoard, row, col);
        
        if (isAvailable) {
            gameBoard[row][col].setState(curPlayer);
            console.log("place piece success")
            switchPlayer(curPlayer);
            // gameBoardModule.printBoard();
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

