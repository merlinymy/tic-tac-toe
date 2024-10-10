// brainstorm
// a factory for game board
// a factory for player
// a factory for game logic


const gameBoardModule = (function gameBoard() {
    const board = [[null, null, null],
                   [null, null, null],
                   [null, null, null]];

    return {board};
})();

const playerFactory = function player() {
    const player1 = "x";
    const player2 = "o";
    return {player1, player2};
}

const gameLogicModule = (function gameLogic() {
    const {player1, player2} = playerFactory();
    const gameBoard = gameBoardModule;
    let curPlayer = player1;

    const switchPlayer = (cur) => {
        console.log(cur);
        curPlayer = cur === player1 ? player2 : player1;
    };

    const playRound = (row, col) => {
        console.log(`current player is ${curPlayer}`);
        console.log(`current player ${curPlayer} placed a piece at row: ${row},
                    col: ${col}`);
        console.log(`current board looks like:`);
        console.table(gameBoard);
        gameBoard.board[row][col] = curPlayer;
        console.log(`current board looks like:`);
        console.table(gameBoard);
        switchPlayer(curPlayer);
        console.log(`current player is ${curPlayer}`);
    }
    
    return {playRound};
})();

