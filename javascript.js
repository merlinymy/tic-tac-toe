// project gomoku
// Oct/11/2024

// brainstorm
// 15 x 15 board
// connect 5 to win (verticle, horizontal, diagonal)

const gameBoardModule = (function gameBoard() {
    const board = [];
    const previousMoves = [];
    const cols = 15;
    const rows = 15;
    const boardDiv = document.querySelector(".board");

    const initBoard = (difficulty) => {
        boardDiv.innerHTML = "";
        document.documentElement.style.setProperty("--piece-url", "url(assets/black-sphere.png)");
        console.log("in initBoard")
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < cols; j++) {
                board[i].push(unit());
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
                    gameLogicModule.playRound(i,j,event.target, difficulty);
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
        const pieceArr = arr.map(cell => cell.getState().state);
        for (let i = 0; i <= arr.length; i++) { // at index 9 
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
        console.log(bottomLeft_topRight.map((ele)=>ele.getState().state));
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
        const prettyBoard = board.map((row) => row.map((cell) => cell.getState().state));
        console.log(prettyBoard);
    }

    return {board, previousMoves, checkBoardState, printBoard, initBoard};
})();

const unit = function unit(){
    // player piece
    let state = null;
    let div = null;
    let row, col;

    const setState = (player, targetDiv) => {
        state = player;
        if (targetDiv) {
            div = targetDiv;
            row = targetDiv.getAttribute("row");
            col = targetDiv.getAttribute("col");
            // console.log(row, col)
            const nextPieceStyle = state === 'x' ? "url(assets/white-sphere.png)" : "url(assets/black-sphere.png)"
            document.documentElement.style.setProperty("--piece-url", nextPieceStyle);
            const pieceDiv = document.createElement("div"); 
            if (state === 'x') {//black piece
                pieceDiv.classList.add("black-piece");
            } else {
                pieceDiv.classList.add("white-piece");
            }
            targetDiv.append(pieceDiv);
        }
    }

    const clearState = () => {
        state = null;
        if (div) {
            div.innerHTML = "";
        }
        // cell.div.removeChild(divChild);
    }
    const getState = () => {
        return {state, row, col, div};
    }

    const checkCellState = (player) => {
        // console.log(player, state)
        return state === player;
    }

    return {setState, getState, checkCellState, clearState};
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

// chatGPT o1 generated
const aiFactory = function aiPlayer(turn, label) {
    const ai = playerFactory(turn, label);
    const aiTurn = turn; // 'x' or 'o'
    const opponentTurn = aiTurn === 'x' ? 'o' : 'x';
    const gameBoard = gameBoardModule.board;

    // Level 1 Logic: Random Move
    const level1Logic = () => {
        let aiRow, aiCol;
        do {
            aiRow = utilFunctionModule.getRandomBetween(0, 14);
            aiCol = utilFunctionModule.getRandomBetween(0, 14);
        } while (gameBoard[aiRow][aiCol].getState().state !== null);
        return { aiRow, aiCol };
    };

    // Level 2 Logic: Rule-Based AI
    const level2Logic = () => {
        // Scan the entire board and evaluate each possible move
        let bestMove = null;
        let highestPriority = -1;

        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if (gameBoard[row][col].getState().state === null) {
                    // For each empty cell, simulate placing the AI's stone
                    gameBoard[row][col].setState(aiTurn);

                    // Evaluate the move according to the rules
                    const priority = evaluateMove(row, col);

                    // Keep track of the move with the highest priority
                    if (priority > highestPriority) {
                        highestPriority = priority;
                        bestMove = { aiRow: row, aiCol: col };
                    }

                    // Undo the move
                    gameBoard[row][col].clearState();
                }
            }
        }

        // If no move found (shouldn't happen), fallback to random move
        if (bestMove) {
            return bestMove;
        } else {
            return level1Logic();
        }
    };

    // Evaluation function
    const evaluateMove = (row, col) => {
        // Priorities are assigned based on the rules
        // Higher number means higher priority
        let priority = 0;

        // Rule 1: If opponent can win next turn, block it immediately
        if (opponentCanWinNextTurn(row, col)) {
            return 10000; // Highest priority
        }

        // Rule 2: If you can win this turn, do it
        if (canWinThisTurn(aiTurn, row, col)) {
            return 9000;
        }

        // Rule 3: If you can create an open-ended connect 4, do it
        if (createsOpenFour(aiTurn, row, col)) {
            return 8500;
        }

        // Rule 4: If opponent can create an open three, block it
        if (createsOpenThree(opponentTurn, row, col)) {
            return 8000;
        }

        // Rule 5: If you can create an open three, do it
        if (createsOpenThree(aiTurn, row, col)) {
            return 7000;
        }

        // Rule 6: Extend your own lines
        let maxLineLength = getMaxLineLength(aiTurn, row, col);
        if (maxLineLength >= 2) {
            priority = 6000 + maxLineLength * 10;
        }

        // Rule 7: Block opponent's potential lines
        let opponentLineLength = getMaxLineLength(opponentTurn, row, col);
        if (opponentLineLength >= 3) {
            priority = Math.max(priority, 5000 + opponentLineLength * 10);
        }

        // Rule 8: Control the center
        const centerDistance = Math.abs(row - 7) + Math.abs(col - 7);
        priority += (7 - centerDistance); // Closer to center gets higher priority

        return priority;
    };

    // Helper functions to detect immediate threats
    const opponentCanWinNextTurn = (row, col) => {
        // Check if placing at (row, col) blocks opponent's win
        // Temporarily place opponent's stone to see if they can win
        gameBoard[row][col].setState(opponentTurn);
        const canWin = canWinThisTurn(opponentTurn, row, col);
        gameBoard[row][col].clearState();
        return canWin;
    };

    const canWinThisTurn = (player, row, col) => {
        // Place the stone temporarily
        gameBoard[row][col].setState(player);

        // Check if this move leads to a win
        const isWinningMove = gameBoardModule.checkBoardState(player, row, col);

        // Remove the temporary stone
        gameBoard[row][col].clearState();

        return isWinningMove;
    };

    const createsOpenFour = (player, row, col) => {
        return hasPattern(player, row, col, 4, 2);
    };

    const createsOpenThree = (player, row, col) => {
        return hasPattern(player, row, col, 3, 2);
    };

    const hasPattern = (player, row, col, length, openEndsRequired) => {
        for (let dir of directions) {
            let count = countConsecutiveStones(player, row, col, dir.dr, dir.dc);
            let openEnds = countOpenEnds(player, row, col, dir.dr, dir.dc);
            if (count >= length && openEnds >= openEndsRequired) {
                return true;
            }
        }
        return false;
    };

    const countConsecutiveStones = (player, row, col, dr, dc) => {
        let count = 1;
        let r, c;

        // Forward direction
        r = row + dr;
        c = col + dc;
        while (isValidCell(r, c) && gameBoard[r][c].getState().state === player) {
            count++;
            r += dr;
            c += dc;
        }

        // Backward direction
        r = row - dr;
        c = col - dc;
        while (isValidCell(r, c) && gameBoard[r][c].getState().state === player) {
            count++;
            r -= dr;
            c -= dc;
        }

        return count;
    };

    const countOpenEnds = (player, row, col, dr, dc) => {
        let openEnds = 0;
        let r, c;

        // Forward direction
        r = row + dr;
        c = col + dc;
        while (isValidCell(r, c) && gameBoard[r][c].getState().state === player) {
            r += dr;
            c += dc;
        }
        if (isValidCell(r, c) && gameBoard[r][c].getState().state === null) {
            openEnds++;
        }

        // Backward direction
        r = row - dr;
        c = col - dc;
        while (isValidCell(r, c) && gameBoard[r][c].getState().state === player) {
            r -= dr;
            c -= dc;
        }
        if (isValidCell(r, c) && gameBoard[r][c].getState().state === null) {
            openEnds++;
        }

        return openEnds;
    };

    const getMaxLineLength = (player, row, col) => {
        let maxLength = 0;
        for (let dir of directions) {
            let length = countConsecutiveStones(player, row, col, dir.dr, dir.dc);
            if (length > maxLength) {
                maxLength = length;
            }
        }
        return maxLength;
    };

    const directions = [
        { dr: -1, dc: 0 },  // Vertical
        { dr: 0, dc: -1 },  // Horizontal
        { dr: -1, dc: -1 }, // Diagonal \
        { dr: -1, dc: 1 },  // Diagonal /
    ];

    const isValidCell = (row, col) => {
        return row >= 0 && row < 15 && col >= 0 && col < 15;
    };

    return Object.assign({}, ai, { level1Logic, level2Logic });
};

// generated code ends


const gameLogicModule = (function gameLogic() {
    let gameBoard;
    let previousMoves = gameBoardModule.previousMoves;
    let isWin;
    let player1;
    let player2;
    let curPlayer;
    const gameInfoText = document.querySelector(".game-info>p");
    const gameInfoIcon = document.querySelector(".game-info>div");

    const startNewGame = () => {
        // local two players
        isWin = false;
        gameBoardModule.initBoard();
        console.log("game initiated");
        gameInfoText.textContent = "Your Turn";
        gameBoard = gameBoardModule.board;
        previousMoves = gameBoardModule.previousMoves;
        gameBoardModule.printBoard();
        player1 = playerFactory("x", 1);
        player2 = playerFactory("o", 1);
        curPlayer = player1;
        // gameInfoText.textContent = "turn";
    }

    const startNewGameWithBot = (turn, difficulty) => {
        // one player vs bot
        // x goes first
        let aiTurn = turn === "x" ? "o" : "x";
        isWin = false;
        isBotGame = true;
        gameBoardModule.initBoard(difficulty);
        previousMoves = gameBoardModule.previousMoves;
        console.log("vs cpu game initiated");
        gameInfoText.textContent = "Your Turn";

        gameBoard = gameBoardModule.board;
        gameBoardModule.printBoard();

        player1 = playerFactory(turn, 1);
        player2 = aiFactory(aiTurn, 2);
        // player1 = turn; // x or o   
        curPlayer = player1.turn === "x" ? player1 : player2;
        if (player1.turn === "o") {
            const botMoveDiv = document.querySelector("div[row='7'][col='7']");
            playRound(7,7,botMoveDiv,difficulty);
        }
    }
    const switchPlayer = (cur) => {
        // console.log(cur);
        curPlayer = cur === player1 ? player2 : player1;
    };

    const playRound = (row, col, targetDiv, difficulty) => {
        let pieceColor;
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

        // main logic
        if (isAvailable) { // place a piece
            gameBoard[row][col].setState(curPlayer.turn, targetDiv);

            previousMoves.push(gameBoard[row][col]) // Unit cell

            // console.log(gameBoardModule.checkBoardState(curPlayer.turn, row, col));
                        
            // check if current player wins
            if (gameBoardModule.checkBoardState(curPlayer.turn, row, col)) {
                pieceColor = curPlayer.turn === 'x' ? 'black' : 'white'; 
                gameInfoText.textContent = `WINS!`;
                console.log(`${curPlayer.turn} wins!`);
                isWin = true;
                gameInfoIcon.className = `${pieceColor}-piece-info`;
                gameBoardModule.printBoard();
            } else {
                gameBoardModule.printBoard();
                switchPlayer(curPlayer);
                pieceColor = curPlayer.turn === 'x' ? 'black' : 'white'; 
                console.log(`${curPlayer.turn}'s turn!`);
                // console.log(curPlayer.label);
                gameInfoIcon.className = `${pieceColor}-piece-info`;
                if (curPlayer.label == 2) {
                    console.log(difficulty);
                    if (difficulty.toLowerCase() === 'easy') {
                        // console.log("in playAround difficulty 2/easy")
                       const {aiRow, aiCol} = aiFactory().level1Logic();
                       const botDiv = document.querySelector(`div[row="${aiRow}"][col="${aiCol}"]`);
                       playRound(aiRow,aiCol,botDiv,difficulty);
                    } else if (difficulty.toLowerCase() === 'medium') {
                        const {aiRow, aiCol} = player2.level2Logic();
                        console.log(aiRow, aiCol)
                        const botDiv = document.querySelector(`div[row="${aiRow}"][col="${aiCol}"]`)
                        playRound(aiRow,aiCol,botDiv,difficulty);
                    } else if (difficulty.toLowerCase() === 'hard') {
                        // const {aiRow, aiCol} = aiFactory().level6Logic(); 
                    }
                }
            }

        } else {
            console.log(errorMessage);
            console.log(`${curPlayer.turn}'s turn!`);
            pieceColor = curPlayer.turn === 'x' ? 'black' : 'white'; 
            gameInfoIcon.className = `${pieceColor}-piece-info`;
        }
 
    }

    const checkSpaceIsEmpty = (board, row, col) => {
        let isAvailable = true;
        let errorMessage = "";
        // console.log(board[row][col].getState().state);
        if (!!board[row][col].getState().state) {
            
            isAvailable = false;
            errorMessage = "can't place piece, a piece exist";
        }
        return {isAvailable, errorMessage};
    }

    const undo = () => {
        if (previousMoves.length <= 0) return null;
        if (player2.label == 1) {//human player
            previousMoves.pop().clearState();
            switchPlayer(curPlayer);

            pieceColor = curPlayer.turn === 'x' ? 'black' : 'white'; 
            gameInfoIcon.className = `${pieceColor}-piece-info`;
            const nextPieceStyle = curPlayer.turn === 'o' ? "url(assets/white-sphere.png)" : "url(assets/black-sphere.png)"
            document.documentElement.style.setProperty("--piece-url", nextPieceStyle);
        } else {
            previousMoves.pop().clearState();
            previousMoves.pop().clearState();
        }
    }
    
    return {playRound, startNewGame, startNewGameWithBot, undo};
})();

const UIModule = (() => {

    const aboutDialog = document.querySelector("#about-dialog");
    const aboutBtn = document.querySelector(".rules");
    const dialogCloseBtn = document.querySelector(".material-symbols-outlined.close-icon");
    const newGameBtn = document.querySelector(".new-game");
    const gameOptionDialog = document.querySelector("#game-option-dialog");
    const undoBtn = document.querySelector(".undo");


    const humanPlayerBtn = document.querySelector(".human-player");
    const cpuPlayerBtn = document.querySelector(".ai-player");

    const asBlackBtn = document.querySelector(".play-as-black");
    const asWhiteBtn = document.querySelector(".play-as-white");

    const easyBtn = document.querySelector(".easy");
    const mediumBtn = document.querySelector(".medium");
    const hardBtn = document.querySelector(".hard");

    const gameOptionConfirm = document.querySelector(".buttons>.confirm");
    const gameOptionCancel = document.querySelector(".buttons>.cancel");

    const addListeners = (...args) => {
        for (const arg of args) {
            arg.addEventListener("click", (event)=>{
                const targetParent = event.target.parentElement;
                // console.log(targetParent.children);
                for (const child of targetParent.children) {
                    child.id = "";
                }
                arg.id = "is-selected";
                if (arg.className === "confirm" || arg.className === "cancel") {
                    arg.id = "";
                }

                if (arg.className === "human-player") {
                    const [playAgainst, ...otherDivs] = document.querySelectorAll(".options");
                    for (const option of otherDivs) {
                       for (const child of option.children) {
                        child.id = "disabled-btns";
                       }
                    }
                }

                if (arg.className === "ai-player") {
                    const [playAgainst, ...otherDivs] = document.querySelectorAll(".options");
                    console.log(otherDivs);
                    for (const option of otherDivs) {
                       for (const child of option.children) {
                        child.id = "";
                        if (child.className === "play-as-black" ||
                            child.className === "medium"
                        ) {
                            child.id = "is-selected";
                        }
                       }
                    }
                }
            });
            // if (arg === humanPlayerBtn)
        }
    }

    addListeners(humanPlayerBtn, cpuPlayerBtn, asBlackBtn, asWhiteBtn, easyBtn,
        mediumBtn, gameOptionConfirm, gameOptionCancel);

    undoBtn.addEventListener("click", (event) => {
        const row = event.target.getAttribute("row");
        const col = event.target.getAttribute("col");
        gameLogicModule.undo(row, col);
    });
    
    gameOptionConfirm.addEventListener("click", () => {
        const optionDivs = document.querySelectorAll(".options");
        let humanOrAI;
        let blackOrWhite;
        let difficulty;
        for (const optionDiv of optionDivs) { 
            for (const option of optionDiv.children) {
                if (option.id === "is-selected") {
                    console.log(option);

                    if (option.className === "human-player" ||
                        option.className === "ai-player"
                    ) {
                        humanOrAI = option.textContent;
                        console.log(humanOrAI);
                    }

                    if (option.className === "play-as-black" ||
                        option.className === "play-as-white"
                    ) {
                        blackOrWhite = option.textContent;
                        console.log(blackOrWhite);
                    }
                    if (option.className === "easy" ||
                        option.className === "medium" ||
                        option.className === "hard"
                    ) {
                        difficulty = option.textContent;
                        console.log(difficulty);
                    }
                }
            }
        }

        if (humanOrAI && blackOrWhite && difficulty) {
            const turn = blackOrWhite.toLowerCase() === "black" ? "x" : "o";
            console.log(turn);
            gameLogicModule.startNewGameWithBot(turn, difficulty);
        } else {
            gameLogicModule.startNewGame();
        }
        gameOptionDialog.close();
    });

    aboutBtn.addEventListener("click", () => {
        aboutDialog.showModal();
    });
    
    dialogCloseBtn.addEventListener("click", ()=>{
        aboutDialog.close();
    });
    
    newGameBtn.addEventListener("click", () => {
        gameOptionDialog.showModal();
    })
    
    gameOptionCancel.addEventListener("click", () => {
        gameOptionDialog.close();
    });
    // testing
    document.documentElement.classList.add("theme-light-wood")
    // document.root
    
})();

// UIModule.addListeners();
gameLogicModule.startNewGameWithBot('x','medium');


// .classList.add("theme-light-wood");