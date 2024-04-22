const quoteText = document.getElementById('quote-text');
const textEntry = document.querySelector('.text-entry');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('acc');
const timeDisplay = document.getElementById("time");
const endTimeDisplay = document.getElementById("timer");
const creditsDisplay = document.getElementById("credits");
const newTextBtn = document.getElementById("new-text");
const restartBtn = document.getElementById('restart');


//disables pasting
textEntry.addEventListener('paste', (event) => {
    event.preventDefault();
});
textEntry.addEventListener("input",(event)=>{
    gameRunning(event);
});
newTextBtn.addEventListener("click",async()=>{
    await startRound()
});

restartBtn.addEventListener('click', async() => {
    restart()
});
let mistakeMade = 0
let startTime;
let wordCount = 0; 
let keyMistakes = {A:0,B:0,C:0,D:0,E:0,F:0,G:0,H:0,I:0,J:0,K:0,L:0,M:0,N:0,O:0,P:0,Q:0,R:0,S:0,T:0,U:0,V:0,W:0,X:0,Y:0,Z:0};
function gameRunning(event){
    //tracks mistakes
    if(!timerRunning){
        startTimer();
    }
    const quote = quoteText.textContent.trim();
    const entry = textEntry.textContent.trim();

    if(entry === quote) {
        textEntry.style.backgroundColor = 'rgba(115, 227, 84, 0.5)';
        quoteText.innerHTML = `<span class="green">${quote}</span>${quote.substring(entry.length)}`;
        endGame();
    }
    else { // check if user is on the right track
        let shavedQuote = quote.substring(0, entry.length);
        if(entry === shavedQuote) {
            textEntry.style.backgroundColor = 'rgb(33, 33, 33)';
            quoteText.innerHTML = `<span class="green">${shavedQuote}</span>${quote.substring(entry.length)}`;
        } // if user is not on right track display in red
        else {
            textEntry.style.backgroundColor = 'rgba(204, 71, 61, 0.5)';
        }
    }

    ////tracks wpms, time, and accuracy
    if (event.inputType === 'deleteContentBackward') {
        // Ignore backspace input
        return;
    }
    if (entry.charAt(entry.length - 1) !== quote.charAt(entry.length - 1)) {
        mistakeMade++;
    }
    // Calculate accuracy: (total characters typed - mistakes) / total characters typed
    const accuracy = Math.max(0, ((entry.length - mistakeMade) / entry.length) * 100);
    if (!startTime) {
        startTime = Date.now();
    }
    const words = entry.split(/\s+/);
    wordCount = words.length;
    const timeElapsed = (Date.now() - startTime) / (1000 * 60);
    const wpm = Math.round(wordCount / timeElapsed);
    accuracyDisplay.textContent = `Accuracy: ${accuracy.toFixed(2)}%`;
    wpmDisplay.textContent = `WPM: ${wpm}`;
}
let timer;
let sec = 180;
let timerRunning = false;
function startTimer(){
    timerRunning = true;
    timeDisplay.style.display = 'block';
    timer = setInterval(()=>{
        const minutes = Math.floor(sec / 60);
        let remainingSeconds = sec % 60;
        if(remainingSeconds<10) remainingSeconds= "0"+remainingSeconds;
        if(remainingSeconds===0)remainingSeconds="00";
        timeDisplay.innerHTML = `Time: ${minutes}:${remainingSeconds}`;
        --sec;
        if(sec===-1)endGame();
    },1000);
}
function stopTimer(){
    timeDisplay.style.display = 'none';
    clearInterval(timer);
    sec = 180;
    timerRunning = false;
}
function endGame(){
    //lock text box
    textEntry.contentEditable = false;
    textEntry.blur();
    //display end game stats: credits and time
    creditsDisplay.innerHTML = `By: ${credits}`;
    const minutes = Math.floor((180-sec) / 60);
    let remainingSeconds = (180-sec) % 60;
    if(remainingSeconds<10) remainingSeconds= "0"+remainingSeconds;
    if(remainingSeconds===0)remainingSeconds="00";
    endTimeDisplay.innerHTML = `Time: ${minutes}:${remainingSeconds}`;
    document.getElementById("endgame-stats-display").style.display = 'flex';
    stopTimer();
}

const response = await fetch("quotes.csv");
const csvText = await response.text();
const parsedText = Papa.parse(csvText).data;
let credits;
async function startRound(){
    try{
        let randomIndex = Math.floor(Math.random() * parsedText.length);
        let quote = parsedText[randomIndex];
        quoteText.innerText = quote[0];
        credits = quote[1];
    }catch(error){console.log(error)}
    restart();
}

function restart(){
    stopTimer();
    document.getElementById("endgame-stats-display").style.display = 'none';
    textEntry.innerHTML = "";
    textEntry.style.backgroundColor = 'rgb(33, 33, 33)';
    textEntry.contentEditable = true;
    mistakeMade = 0
    startTime = null;
    wordCount = 0; 
}


startRound();
/*
things to track:
runs and key mistakes
should look like this:
let keysData = {
    a:10, b:4, c:14, d:7, e:15, f:9
};

let runs = [
    {
        date:
        wpm:
        acc:
    },
]
*/


