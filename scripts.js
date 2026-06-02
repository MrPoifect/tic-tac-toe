const gameBoard = (() => {
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
    return boardCellValues;
    };

    return { placeMarker, printBoard, getBoard, };
})();

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
    const board = gameBoard;
    const playArea = gameBoard.getBoard();

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
        console.log(`${getActivePlayer().name}'s turn.`);
    }


    const playRound = (x, y) => {
 
        if (playArea[x][y].getValue() === 0) {
            console.log(
            `Placing ${getActivePlayer().name}'s marker`);
            board.placeMarker(x,y, getActivePlayer().marker);

            
            if ((playArea[0][0].getValue() && playArea[0][1].getValue() && playArea[0][2].getValue() === getActivePlayer().marker) || 
                (playArea[1][0].getValue() && playArea[1][1].getValue() && playArea[1][2].getValue() === getActivePlayer().marker) ||
                (playArea[2][0].getValue() && playArea[2][1].getValue() && playArea[2][2].getValue() === getActivePlayer().marker) ||
                (playArea[0][0].getValue() && playArea[1][1].getValue() && playArea[2][2].getValue() === getActivePlayer().marker) ||
                (playArea[2][0].getValue() && playArea[1][1].getValue() && playArea[0][2].getValue() === getActivePlayer().marker)) {
                console.log("WIN")
                printNewRound();
            } else {

            /*switchPlayer();*/
            printNewRound()};
        } else {} {console.log("space not free");};

    };



    return {addPlayerOne, addPlayerTwo, getActivePlayer, playRound,}
})();