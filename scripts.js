function gameBoard() {
    let board = [[Cell(), Cell(), Cell()],
                 [Cell(), Cell(), Cell()],
                 [Cell(), Cell(), Cell()]];

    
    
    const getBoard = () => board;

    const placeMarker = (x, y, player) => {
        if (board[x][y].getValue() === 0) {
            console.log("Space is free")
            board[x][y].addMarker(player);
        } else {console.log("space not free");}
    };

    const printBoard = () => {
        const boardCellValues = board.map((row) =>
            row.map((cell) => cell.getValue())
    );
    console.log(boardCellValues);
    };

    return { placeMarker, printBoard, getBoard, };
};

function Cell() {
    let value = 0;

    const addMarker = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addMarker, getValue, };
}


function Player(name, marker) {
    this.name = name;
    this.marker = marker;
}

const gameController = (() => {
    
    const players = [];
    let activePlayer = players[0];
    const board = gameBoard();

    const addPlayerOne = (name) => {
        players.push(new Player(name, 1))
        activePlayer = players[0];
    }; 
    const addPlayerTwo = (name) => {
        players.push(new Player(name, 2));
    };

    const getPlayerList = () => {
        console.log(players)
    }

    
    const switchPlayer = () => {
        if (activePlayer === players[0]) {
            activePlayer = players[1]
        } else { activePlayer = players[0]}
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (x, y) => {
        console.log(
            `placing ${getActivePlayer().name}'s marker`
        );
        console.log(getActivePlayer().marker)
    }



    return {addPlayerOne, addPlayerTwo, getPlayerList, switchPlayer, getActivePlayer, playRound }
})();