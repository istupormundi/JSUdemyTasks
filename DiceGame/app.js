/**************** INITIALIZATIONS **********************/
let scores, roundScore, activePlayer, dice, diceExt, gamePlaying; 

const diceDOM = document.querySelector('#dice-0');
const diceDOMExt = document.querySelector('#dice-1');

initialize();

/********************* ACTIONS *****************************/
document.querySelector('.btn-roll').addEventListener('click', function(){
    const previousDice = dice;
    const previousDiceExt = diceExt;

    if (!gamePlaying) return;
    -
    disableWinnerScore();
    //1. Roll the dice == random number 
    dice = Math.floor(Math.random()*6) + 1;
    diceExt = Math.floor(Math.random()*6) + 1;
    
    const total = dice + diceExt;

    //2.Display the result
    diceDOM.style.display = 'block';
    diceDOMExt.style.display = 'block';
    diceDOM.src = 'dice-' +  dice + '.png';
    diceDOMExt.src = 'dice-' +  diceExt + '.png';

    //3. update the round score IF the rolled number is not 1
    if (dice !== 1 && diceExt !== 1 && (!checkIfSixAppearedTwice(dice, diceExt, previousDice, previousDiceExt))){
        roundScore += total;
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
    }
    else{
        loseScores(activePlayer);
        nextPlayer();
    }   
});

document.querySelector('.btn-hold').addEventListener('click', function(){
    if (!gamePlaying) return;

    //Add current score to global score
    scores[activePlayer] += roundScore;

    //update UI
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
    
    let input = document.querySelector('.final-score').value;
    
    //if input = 0, play till 100
    if (input == "" || input == 0){
        input = 100;
    }

    //check if playe won the game
    if (scores[activePlayer] >= input){
        document.querySelector('#name-' + activePlayer).textContent = "WINNER!";
        diceDOM.style.display = 'none';
        diceDOMExt.style.display = 'none';
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
    
        //disable 'ROLL DICE' and 'HOLD' buttons via STATE VARIABLE
        gamePlaying = false;
    }
    else{
        disableWinnerScore();
        nextPlayer();   
    }   
});

document.querySelector('.btn-new').addEventListener('click', initialize);


/******************* FUNCTIONS ****************************/

function loseScores(activePlayer){
    scores[activePlayer] = 0;
    document.querySelector('#current-' + activePlayer).textContent = 0;
}

function disableWinnerScore(){
    document.querySelector('.final-score').disabled = true;
}

function checkIfSixAppearedTwice(dice, diceExt, previousDice, previousDiceExt){
    return ([dice, diceExt].includes(6) && [previousDice, previousDiceExt].includes(6));
}

function nextPlayer(){
    activePlayer = activePlayer === 0 ? 1 : 0;
    roundScore = 0;
    
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    
    diceDOM.style.display = 'none';
    diceDOMExt.style.display = 'none';
}

function initialize(){
    scores = [0,0];
    roundScore = 0;
    activePlayer = 0;
    gamePlaying = true;
    
    //TODO: beautify
    //hide dice picture by default
    diceDOM.style.display = 'none';
    diceDOMExt.style.display = 'none';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.querySelector('#name-0').textContent = "PLAYER 1";
    document.querySelector('#name-1').textContent = "PLAYER 2";
    document.querySelector('.player-0-panel').classList.add('winner');
    document.querySelector('.player-1-panel').classList.add('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.final-score').disabled = false;
    document.querySelector('.final-score').value = 0;
}