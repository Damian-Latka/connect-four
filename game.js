const board = document.querySelector("#board");
const newGameBtn = document.querySelector("#newGameBtn");
const HEIGHT = 6;
const WIDTH = 7;
const EMPTY_COLOR = "#353535";
const PLAYER_ONE_COLOR = "rgb(211, 198, 21)";
const PLAYER_TWO_COLOR = "rgb(107, 23, 23)";
const HIGHLIGHT_COLOR = "rgb(89, 154, 230)";
let gameEnded = true; //status of the game
let gamePlayed = false;
let gameBoard;
let winner;
let current_player_color = PLAYER_ONE_COLOR;
let current_player_number = 1;
let cells = document.querySelectorAll(".cell");
let columns = document.querySelectorAll(".column");

//adding event listeners to all columns
//after clicking the disc is dropped in the column that was clicked
columns.forEach(function (item, idx) {
    item.addEventListener('click', function() {
        dropDisc(idx + 1);
    });
});

function createGrid(){
    if(!gamePlayed) gamePlayed = true;
    //creating a 2d array full of 0's / clearing current board for a new game
    gameBoard = Array(WIDTH).fill(0).map(x => Array(HEIGHT).fill(0));
    //clearing the board visually
    cells.forEach((cell) => {
        cell.children[0].style.background = EMPTY_COLOR;
    });
}

function changePlayer(){
    current_player_color == PLAYER_ONE_COLOR ? current_player_color = PLAYER_TWO_COLOR : current_player_color = PLAYER_ONE_COLOR;
    current_player_number == 1 ? current_player_number = 2 : current_player_number = 1;
}

function dropDisc(column){
    if(!gameEnded){
        //if the first row in the column isnt empty it wont do anything
        if(!gameBoard[column-1][0]){
            //if there is nothing at the bottom of a column place the disc there straight away
            if(!gameBoard[column-1][HEIGHT-1]){
                gameBoard[column-1][HEIGHT-1] = current_player_number;
                // console.log("disc dropped in (" + column + ", " + (HEIGHT) + ")");
                board.children[column-1].children[HEIGHT-1].children[0].style.background=current_player_color;
                checkWin((column-1), (HEIGHT-1));
                changePlayer();
                changeIndicator();
            }else{
                for(i = 0; i < HEIGHT; i++){
                    //if the cell isn't empty put a disc in a cell above
                    if(gameBoard[column-1][i]){
                        gameBoard[column-1][i-1] = current_player_number;
                        //change the background of a circle
                        board.children[column-1].children[i-1].children[0].style.background=current_player_color;
                        checkWin((column-1), (i-1));
                        changePlayer();
                        changeIndicator();
                        break;
                    }
                }
            }
            // console.log(gameBoard);
        }else{
            //A COLUMN IS FULL CANT DROP IT HERE
            console.log("you can't drop a disc here");
        }
    }
}

/*
    DIRECTIONS OF CHECKING AND LATER HIGHLIGHTING
    tb -> TOP TO BOTTOM
    lr -> LEFT TO RIGHT
    trbl -> TOP-RIGHT TO BOTTOM-LEFT
    brtl -> BOTTOM-RIGHT TO TOP-LEFT
*/

function checkWin(x, y){
    let checkString = "";

    // console.log(`--------- checking for: ${x}, ${y}`);
    //vertical
    for(i = -3; i <= 3; i++){
        if((y + i) < HEIGHT && (y + i) >= 0){
            // console.log(`Vertical: ${gameBoard[x][y+i]}`);
            checkString += gameBoard[x][y+i];
        }
    }
    // console.log("TOP -> BOTTOM ==================");
    // console.log(checkString);
    if(checkString.includes("1111")){
        return endGame(1, x, y, "tb");
    }else if(checkString.includes("2222")){
        return endGame(2, x, y, "tb");
    }else{
        checkString = "";
    }

    //horizontal
    for(i = -3; i <= 3; i++){
        if((x + i) < WIDTH && (x + i) >= 0){
            // console.log(`Horizontal: ${gameBoard[x+i][y]}`);
            checkString += gameBoard[x+i][y];
        }
    }
    // console.log("LEFT -> RIGHT ==================");
    // console.log(checkString);
    if(checkString.includes("1111")){
        return endGame(1, x, y, "lr");
    }else if(checkString.includes("2222")){
        return endGame(2, x, y, "lr");
    }else{
        checkString = "";
    }

    //Top Right -> Bottom Left
    for(i = -3; i <= 3; i++){
        if((x - i) < WIDTH && (x - i) >= 0 && (y + i) < HEIGHT && (y + i) >= 0){
            // console.log(`TR -> BL: ${gameBoard[x-i][y+i]}`);
            checkString += gameBoard[x-i][y+i];
        }
    }
    // console.log("Top Right -> Bottom Left ==================");
    // console.log(checkString);
    if(checkString.includes("1111")){
        return endGame(1, x, y, "trbl");
    }else if(checkString.includes("2222")){
        return endGame(2, x, y, "trbl");
    }else{
        checkString = "";
    }

    //Bottom Right -> Top Left
    for(i = -3; i <= 3; i++){
        if((x - i) < WIDTH && (x - i) >= 0 && (y - i) < HEIGHT && (y - i) >= 0){
            // console.log(`BL -> TR: ${gameBoard[x-i][y-i]}`);
            checkString += gameBoard[x-i][y-i];
        }
    }
    // console.log("Bottom Right -> Top Left ==================");
    // console.log(checkString);
    if(checkString.includes("1111")){
        return endGame(1, x, y, "brtl");
    }else if(checkString.includes("2222")){
        return endGame(2, x, y, "brtl");
    }else{
        checkString = "";
    }
}

function resetGame(){
    gameEnded = false;
    changeIndicator();
    cells.forEach((cell) => {
        cell.classList.remove('cell-winning');
    });
    columns.forEach((column) => {
        column.classList.add('column-active');
    });
    board.classList.add('board-active');
    newGameBtn.classList.add('button-disabled');
    newGameBtn.setAttribute("disabled", "");
    createGrid();
}

function endGame(player, x, y, direction){
    winner = player;
    console.log(`Player ${player} won!`);
    gameEnded = true;
    columns.forEach((column) => {
        column.classList.remove('column-active');
    });
    board.classList.remove('board-active');
    newGameBtn.classList.remove('button-disabled');
    newGameBtn.removeAttribute("disabled");
    highlightWinner(player, x, y, direction);
}

function highlightWinner(player, x, y, direction){
    let winningDiscs = [];
    switch(direction) {
    //highlight a win from left to right
        case 'lr':
            for(i = 0; i <= 4; i++){
                if((x + i) < WIDTH){
                    if(gameBoard[x + i][y] == player){
                        winningDiscs.push(board.children[x + i].children[y]);
                    }else{
                        break;
                    }
                }
            }
            for(i = 1; i <= 4; i++){
                if((x - i) >= 0){
                    if(gameBoard[x - i][y] == player){
                        winningDiscs.push(board.children[x - i].children[y]);
                    }else{
                        break;
                    }
                }
            }
            break;
    //highlight a win from top to bottom
        case 'tb':
            for(i = 0; i <= 4; i++){
                if((y + i) < HEIGHT){
                    if(gameBoard[x][y + i] == player){
                        winningDiscs.push(board.children[x].children[y + i]);
                    }else{
                        break;
                    }
                }
            }
            for(i = 1; i <= 4; i++){
                if((y - i) >= 0){
                    if(gameBoard[x][y - i] == player){
                        winningDiscs.push(board.children[x].children[y - i]);
                    }else{
                        break;
                    }
                }
            }
            break;
    //highlight a win from top-right to bot-left
        case 'trbl':
            for(i = 0; i <= 4; i++){
                if((x + i) < WIDTH && (y - i) >= 0){
                    if(gameBoard[x + i][y - i] == player){
                        winningDiscs.push(board.children[x + i].children[y - i]);
                    }else{
                        break;
                    }
                }
            }
            for(i = 1; i <= 4; i++){
                if((x - i) >= 0 && (y + i) < HEIGHT){
                    if(gameBoard[x - i][y + i] == player){
                        winningDiscs.push(board.children[x - i].children[y + i]);
                    }else{
                        break;
                    }
                }
            }
            break;
    //highlight a win from bot-right to top-left
        case 'brtl':
            for(i = 0; i <= 4; i++){
                if((x + i) < WIDTH && (y + i) < HEIGHT){
                    if(gameBoard[x + i][y + i] == player){
                        winningDiscs.push(board.children[x + i].children[y + i]);
                    }else{
                        break;
                    }
                }
            }
            for(i = 1; i <= 4; i++){
                if((x - i) >= 0 && (y - i) >= 0){
                    if(gameBoard[x - i][y - i] == player){
                        winningDiscs.push(board.children[x - i].children[y - i]);
                    }else{
                        break;
                    }
                }
            }
            break;
    }
    


    //change the background of cells with winning discs
    winningDiscs.forEach((disc) =>{
        // disc.style.background = HIGHLIGHT_COLOR;
        disc.classList.add('cell-winning');
    });
}

newGameBtn.addEventListener('click', resetGame);