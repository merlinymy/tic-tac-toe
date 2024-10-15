// project gomoku
// Oct/11/2024

// brainstorm
// 15 x 15 board
// connect 5 to win (verticle, horizontal, diagonal)

const gameBoardModule = (function gameBoard() {
    const board = [];
    const cols = 15;
    const rows = 15;
    const boardDiv = document.querySelector(".board");

    const initBoard = () => {
        console.log("in initBoard")
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < cols; j++) {
                board[i].push(Unit());
                const cell = document.createElement("div");
                cell.setAttribute("row",i);
                cell.setAttribute("col",j);
                cell.classList.add("cell");
                if (j == 0) {
                    cell.classList.add("col-0");
                } 
                if (j == 14) {
                    cell.classList.add("col-14");
                }
                cell.addEventListener("click", (event) => {
                    gameLogicModule.playRound(i,j, event.target);
                });
                boardDiv.append(cell);
            }
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
        let isWin = checkArrayIsWin(bottomLeft_topRight, curPlayer);
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

    return {board, checkBoardState, printBoard, initBoard};
})();

function Unit(){
    // player piece
    let state = null;

    const setState = (player, targetDiv) => {
        state = player;
        const nextPieceStyle = state === 'x' ? "url(assets/white-sphere.png)" : "url(assets/black-sphere.png)"
        document.documentElement.style.setProperty("--piece-url", nextPieceStyle);
        const pieceDiv = document.createElement("div"); 
        if (state === 'x') {//black piece
            pieceDiv.classList.add("black-piece");
        } else {
            pieceDiv.classList.add("white-piece");
        }
        console.log("in set state");
        console.log(targetDiv);
        targetDiv.append(pieceDiv);
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

const utilFunctionModule = (() => {
    const getRandomBetween = (min, max) => {
        // code from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
    }
    
    return {getRandomBetween};
})()

const playerFactory = function player(turn, label) {
    // value of turn is either x (goes first) or o (sec)
    // label: 1(human), 2(bot)
    return {turn, label};
}

const aiFactory = function aiPlayer(turn, label) {
    const ai = playerFactory(turn, label);
    let aiRow;
    let aiCol;

    // level 0 logic, choose row and col randomly
    const level0Logic = () => {
        aiRow = utilFunctionModule.getRandomBetween(0,14);
        aiCol = utilFunctionModule.getRandomBetween(0,14);
        return {aiRow, aiCol};
    }

    // level 1 logic, rule based
    // 1. check for immediate win (4 in a row)
    // 2. block three or four in a row
    // 3. place to form 2,3,4 in a row
    // 4. place near center
    const level1Logic = (gameBoard) => {
        if (checkWin(gameBoard)) {
            
        }
        return {aiRow, aiCol};
    }





    return Object.assign({},ai, {level0Logic, level1Logic});
}

const gameLogicModule = (function gameLogic() {
    let gameBoard;
    let isWin;
    let player1;
    let player2;
    let curPlayer;

    const startNewGame = () => {
        // local two players
        isWin = false;
        gameBoardModule.initBoard();
        console.log("game initiated");
        gameBoard = gameBoardModule.board;
        gameBoardModule.printBoard();
        player1 = playerFactory("x", 1);
        player2 = playerFactory("o", 1);
        curPlayer = player1;
    }

    const startNewGameWithBot = (turn) => {
        // one player vs bot
        // x goes first
        let aiTurn = turn === "x" ? "o" : "x";
        isWin = false;
        isBotGame = true;
        gameBoardModule.initBoard();
        console.log("vs cpu game initiated");
        gameBoard = gameBoardModule.board;
        gameBoardModule.printBoard();

        player1 = playerFactory(turn, 1);
        player2 = aiFactory(aiTurn, 2);
        // player1 = turn; // x or o   
        curPlayer = player1.turn === "x" ? player1 : player2;
        if (player1.turn === "o") {
            playRound(7,7);
        }
    }

    const startNewGameTwoBots = () => {
        // bot vs bot
        // x goes first
        isWin = false;
        isBotGame = true;
        gameBoardModule.initBoard();
        console.log("vs cpu game initiated");
        gameBoard = gameBoardModule.board;
        gameBoardModule.printBoard();

        player1 = aiFactory("x", 2);
        player2 = aiFactory("o", 2);
        // player1 = turn; // x or o   
        curPlayer = player1.turn === "x" ? player1 : player2;
        playRound(8,8);
    }

    const switchPlayer = (cur) => {
        // console.log(cur);
        curPlayer = cur === player1 ? player2 : player1;
    };

    const playRound = (row, col, targetDiv) => {
        // check if winner exist, if true, can't place any pieces
        if (isWin) {
            console.log(`winner is ${curPlayer}, start a new game`);
            return;
        }
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
            gameBoard[row][col].setState(curPlayer.turn, targetDiv);
            console.log(`current player ${curPlayer.turn} placed a piece at ${row}:${col}`);

            // check if current player wins
            if (gameBoardModule.checkBoardState(curPlayer.turn, row, col)) {
                console.log(`${curPlayer.turn} wins!`);
                isWin = true;
                gameBoardModule.printBoard();

            } else {
                gameBoardModule.printBoard();
                switchPlayer(curPlayer);
                console.log(`${curPlayer.turn}'s turn!`);
                if (curPlayer.label == 2) {
                    const {aiRow, aiCol} = aiFactory().level0Logic();
                    playRound(aiRow,aiCol);
                }
            }

        } else {
            console.log(errorMessage);
            console.log(`${curPlayer.turn}'s turn!`);
        }
 
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
    
    return {playRound, startNewGame, startNewGameWithBot, startNewGameTwoBots};
})();

const local2Player = document.querySelector(".local2Player");
local2Player.addEventListener("click", gameLogicModule.startNewGame);