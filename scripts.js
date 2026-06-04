const gameBoard = (() => {
    const boardSize = 3
    let board = [];
    let gameActive = false;
    const playAreaDiv = document.querySelector('#play-area')

    const generateBoard = () => {
    board = [];
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];

        for (let j = 0; j < boardSize; j++) {
            board[i].push(Cell(i, j));
        }
    }}

    const getGameActive = () => {
        return gameActive;
    }
    const setGameActive = (state) => {
    gameActive = state;
    }

    const getBoard = () => board;

    const placeMarker = (x, y, player) => {
        if (board[x][y].getValue() === 0) {
            board[x][y].addMarker(player);
        }
    };

    const printBoard = () => {
        const boardCellValues = board.map((row) =>
            row.map((cell) => cell.getValue())
    );
    console.log(boardCellValues);
    return boardCellValues;
    };

    generateBoard();

    return { placeMarker, printBoard, getBoard, generateBoard, getGameActive, setGameActive, };
})();

function Cell(x, y) {
    let value = 0;
    const xLoc = x;
    const yLoc = y;
    const cellDiv = document.createElement("div");
    const icon = document.createElement("img");

    const container = document.querySelector('#play-area')

    const addMarker = (player) => {
        value = player;
        icon.classList.add("icon");
        switch(player) {
            case 1: cellDiv.classList.add("x");
                    icon.classList.add("x");
                    icon.src="./icons/close.svg"
                break;
            case 2: cellDiv.classList.add("o");
                    icon.classList.add("o");
                    icon.src="./icons/circle-outline.svg"
                break;
        }
        ;
    };

    const getValue = () => value;

    const clickDiv = () => {
        pressMarker(xLoc, yLoc);
    }

    const generateDiv = () => {
        cellDiv.classList.add("marker-spot");
        container.appendChild(cellDiv);  
        cellDiv.appendChild(icon);      
        cellDiv.addEventListener("click", clickDiv);

        
    }

    generateDiv();



    

    return { addMarker, getValue, };
}


function Player(name, marker) {
    this.name = name;
    this.marker = marker;
}

const gameController = (() => {
    
    const players = [];
    let activePlayer = players[0];
    const board = gameBoard;
    const playArea = gameBoard.getBoard();
    let roundsPlayed = 0;

    const addPlayerOne = (name) => {
        players.push(new Player(name, 1))
        activePlayer = players[0];
    }; 
    const addPlayerTwo = (name) => {
        players.push(new Player(name, 2));
    };

    
    const switchPlayer = () => {
        if (activePlayer === players[0]) {
            activePlayer = players[1]
        } else { activePlayer = players[0]}
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        /*console.log(`${getActivePlayer().name}'s turn.`);*/
    }


    const playRound = (x, y) => {
        if (board.getGameActive() === true) {
        if (playArea[x][y].getValue() === 0) {
            roundsPlayed++
            /*console.log(
            `Placing ${getActivePlayer().name}'s marker`);*/
            board.placeMarker(x,y, getActivePlayer().marker);
            if (checkWin(x, y, getActivePlayer().marker)) {
                console.log("WIN");
                gameBoard.printBoard();
            } else if (roundsPlayed >= 9){
                console.log("Tie");
            } else
            switchPlayer();
            printNewRound();
            }
        }}

    const checkWin = (x,y, player) => {
        let rowCheck = 0
        let columnCheck = 0
        for (let i = 0; i < playArea.length; i++) {
           
            if (playArea[x][i].getValue() === player) {
                rowCheck++;
            }
            if (playArea[i][y].getValue() === player) {
                columnCheck++;
            }
        }
        if ((rowCheck === playArea.length) || (columnCheck === playArea.length)) {
            console.log("Row or column win");
            return true;
            
        }
        if ((playArea[0][0].getValue() === player && playArea[1][1].getValue() === player 
        && playArea[2][2].getValue() === player) ||
        (playArea[0][2].getValue() === player && playArea[1][1].getValue() === player
        && playArea[2][0].getValue() === player)) {
            console.log("Diag win");
            return true;
        }
    }

    const resetGame = () => {
        activePlayer = players[0];
        gameBoard.generateBoard();
        console.log("resetgame");
    }
    
    const startGame = () => {
        gameBoard.setGameActive(true);
        console.log("start game")
    }



    return {addPlayerOne, addPlayerTwo, getActivePlayer, playRound, resetGame, startGame, }
})();

function pressMarker(x, y) {
    gameController.playRound(x, y);
}



const form = document.getElementById("move");


form.addEventListener("submit", tempPlayMove);

form.addEventListener("p1", gameController.addPlayerOne("Player1"));
form.addEventListener("p2", gameController.addPlayerTwo("Player2"));

function tempPlayMove (e) {
    e.preventDefault();

    const x = document.getElementById("move").elements['x'].value;
    const y = document.getElementById("move").elements['y'].value;
    gameController.playRound(x,y);
}

const startbtn = document.getElementById("start");

startbtn.addEventListener("click", gameController.startGame);

const resetbtn = document.getElementById("restart");

resetbtn.addEventListener("click", gameController.resetGame);