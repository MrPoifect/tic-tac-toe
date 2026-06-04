const gameBoard = (() => {
    const boardSize = 3
    let board = [];
    let gameActive = false;
    const playAreaDiv = document.querySelector('#play-area')

    const generateBoard = () => {
    board.length = 0
    playAreaDiv.innerHTML = "";
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
    let p1Score = 0;
    let p2Score = 0;
    let tieScore = 0;

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
                gameOver(true);
            } else if (roundsPlayed >= 9){
                gameOver(false);
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
        gameBoard.setGameActive(true);
        console.log("resetgame");
        document.getElementById("game-over-modal").close();
    }
    
    const startGame = () => {
        updateScores();
        gameBoard.setGameActive(true);
        console.log("start game")
    }

    const gameOver = (isWon) => {
        roundsPlayed = 0;
        const winnerText = document.getElementById("winner");
        if (isWon === true){
            winnerText.textContent = `${getActivePlayer().name} wins!`
            switch(getActivePlayer().marker) {
                case 1: p1Score++;
                    break;
                case 2: p2Score++;
                    break;
            }

        } else {
            winnerText.textContent = "It's a tie!"
            tieScore++;
        }
        updateScores();
        document.getElementById("game-over-modal").showModal();
    }

    const updateScores = () => {
        document.getElementById("p1-score").textContent = p1Score
        document.getElementById("p2-score").textContent = p2Score;
        document.getElementById("tie-score").textContent = tieScore;
        console.log("Update scores")

    }


    return {addPlayerOne, addPlayerTwo, getActivePlayer, playRound, resetGame, startGame,}
})();

function pressMarker(x, y) {
    gameController.playRound(x, y);
}



const form = document.getElementById("players");


form.addEventListener("submit", beginGame);

function beginGame (e) {
    e.preventDefault();
    let playerOneName = "Player One"
    let playerTwoName = "Player Two"

    if (document.getElementById("players").elements['p1'].value != "") {
        playerOneName = document.getElementById("players").elements['p1'].value;  
    }
    if (document.getElementById("players").elements['p2'].value != "") {
        playerTwoName = document.getElementById("players").elements['p2'].value;
    }

    document.getElementById("p1-name").textContent = (playerOneName + ":");
    document.getElementById("p2-name").textContent = (playerTwoName + ":");

    gameController.addPlayerOne(playerOneName);
    gameController.addPlayerTwo(playerTwoName);
    gameController.startGame;
    document.getElementById("players").innerHTML = "";
    document.getElementById("scores").style.display = 'flex';

    gameController.startGame();

}


const resetbtn = document.getElementById("restart");

resetbtn.addEventListener("click", gameController.resetGame);