// brainstorm
// a factory for game board
// a factory for player
// a factory for game logic


const gameBoardModule = (function gameBoard() {
    const board = [[null, null, null],
                   [null, null, null],
                   [null, null, null]];

    const checkState = () => {
        console.table(board);
    };
    return {board, checkState};
})();

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
        if (row < 0 || row > 2 || col < 0 || col > 2) {
            console.log("illegal inputs, please provide row and col between 0 and 2");
            return;
        }

        console.log(`current player is ${curPlayer}`);
        console.log(`current player ${curPlayer} placed a piece at row: ${row},
                    col: ${col}`);
        console.log(`current board looks like:`);
        // console.table(gameBoard);
        
        // current player place a tokken with logic checking if
        // space is available
        let {isAvailable, errorMessage} = checkSpace(gameBoard, row, col);
        
        if (isAvailable) {
            gameBoard[row][col] = curPlayer;
            console.log("place piece success")
            switchPlayer(curPlayer);

            console.log(`current board looks like:`);
            // console.table(gameBoard);
            console.log(`current player is ${curPlayer}`);
        } else {
            console.log(errorMessage);
        }
        gameBoardModule.checkState();
    }

    const checkSpace = (board, row, col) => {
        let isAvailable = true;
        let errorMessage = "";
        if (!!board[row][col]) {
            isAvailable = false;
            errorMessage = "can't place piece, a piece exist";
        }
        return {isAvailable, errorMessage};
    }
    
    return {playRound};
})();

