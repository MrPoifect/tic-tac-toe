const gameBoard = (() => {
    const boardSize = 3;
    let board = [];
    let gameActive = false;
    const playAreaDiv = document.querySelector('#play-area')

    const generateBoard = () => {
    board.length = 0;
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

    generateBoard();

    return { placeMarker, getBoard, generateBoard, getGameActive, setGameActive, };
})();

function Cell(x, y) {
    let value = 0;
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
        gameController.playRound(x, y);
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

    const playRound = (x, y) => {
        if (board.getGameActive() === true) {
        if (playArea[x][y].getValue() === 0) {
            roundsPlayed++
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
            switchModalIcon(true);
            return true;
            
        }
        if ((playArea[0][0].getValue() === player && playArea[1][1].getValue() === player 
        && playArea[2][2].getValue() === player) ||
        (playArea[0][2].getValue() === player && playArea[1][1].getValue() === player
        && playArea[2][0].getValue() === player)) {
            switchModalIcon(true);
            return true;
        }
    }

    const resetGame = () => {
        activePlayer = players[0];
        gameBoard.generateBoard();
        gameBoard.setGameActive(true);
        document.getElementById("game-over-modal").close();
    }
    
    const startGame = () => {
        updateScores();
        gameBoard.setGameActive(true);
    }

    const gameOver = (isWon) => {
        roundsPlayed = 0;
        const winnerText = document.getElementById("winner");
        if (isWon === true){
            winnerText.textContent = `${getActivePlayer().name} wins!`
            switch(getActivePlayer().marker) {
                case 1: p1Score++;
                        switchModalIcon(isWon);
                    break;
                case 2: p2Score++;
                        switchModalIcon(isWon);
                    break;
            }

        } else {
            winnerText.textContent = "It's a tie!"
            switchModalIcon(isWon);
            tieScore++;
        }
        updateScores();
        document.getElementById("game-over-modal").showModal();
    }

    const updateScores = () => {
        document.getElementById("p1-score").textContent = p1Score
        document.getElementById("p2-score").textContent = p2Score;
        document.getElementById("tie-score").textContent = tieScore;
    }


    return {addPlayerOne, addPlayerTwo, getActivePlayer, playRound, resetGame, startGame, gameOver,}
})();


function beginGame (e) {
    e.preventDefault();
    let playerOneName = "Player One"
    let playerTwoName = "Player Two"

    const assignPlayerNames = () => {
        const p1Name = document.getElementById("players").elements['p1'].value;
        const p2Name = document.getElementById("players").elements['p2'].value
        if (p1Name !== "") {
            playerOneName = p1Name;
        }
        if (p2Name !== "") {
            playerTwoName = p2Name;
        }
    }

    const appendDuplicateName = () => {
        if (playerTwoName == playerOneName) {
            playerTwoName = (playerTwoName + "#2");
        }
    }

    const runGameStart = () => {
        document.getElementById("p1-name").textContent = (playerOneName + ":");
        document.getElementById("p2-name").textContent = (playerTwoName + ":");

        gameController.addPlayerOne(playerOneName);
        gameController.addPlayerTwo(playerTwoName);
        gameController.startGame;
        document.getElementById("players").innerHTML = "";
        document.getElementById("scores").style.display = 'flex';

        gameController.startGame();
    }

    assignPlayerNames();
    appendDuplicateName();
    runGameStart();
}


function preLoadIcon(url) {
    const img = new Image();
    img.src = url;
}


function switchModalIcon(gameWon) {
    const marker = document.querySelector('#winner-marker');
    const icon = document.querySelector('#winner-icon');
    if (gameWon === true){
        switch(gameController.getActivePlayer().marker) {
            case 1: 
                marker.className = "x";
                icon.src = "./icons/close.svg";
                break;
            case 2:
                marker.className = "o";
                icon.src = "./icons/circle-outline.svg";
                break;} 
    } else {
        marker.className = "T";
        icon.src = "";
    }
}

const resetbtn = document.getElementById("restart");
resetbtn.addEventListener("click", gameController.resetGame);

const form = document.getElementById("players");
form.addEventListener("submit", beginGame);

preLoadIcon("./icons/close.svg");
preLoadIcon("./icons/circle-outline.svg");