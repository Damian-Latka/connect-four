const playerIndicator = document.querySelector("#currentPlayerIndicator");

if(!gamePlayed){
    playerIndicator.innerHTML = "Waiting for a new game to start..";
}

function changeIndicator(){
    if(!gameEnded){
        playerIndicator.innerHTML = `Your Move: <span class="player-${current_player_number}">Player ${current_player_number}</span>`;
    }else{
        playerIndicator.innerHTML = `<span class="player-${winner}">Player ${winner}</span> has won!`;
    }
}