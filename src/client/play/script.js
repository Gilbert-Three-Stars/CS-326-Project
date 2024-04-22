import {UserDB} from "../DBManager/UserDB.js";
const db = new UserDB();

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
    if (!startTime) {
        startTime = Date.now();
    }
    const quote = quoteText.textContent.trim();
    const entry = textEntry.textContent.trim();

    if(entry === quote) { // if the user has completed typing the text.
        textEntry.style.backgroundColor = 'rgba(115, 227, 84, 0.5)';
        quoteText.innerHTML = `<span class="green">${quote}</span>${quote.substring(entry.length)}`;
        endGame(true);
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
        const regex = /[A-Z]/;
        mistakeMade++;
        let char = quote[entry.length-1].toUpperCase()
        if(regex.test(char))
            keyMistakes[char] = keyMistakes[char]+1;
    }
    // Calculate accuracy: (total characters typed - mistakes) / total characters typed
    accuracyDisplay.textContent = `Accuracy: ${getAccuracy(entry)}%`;
    wpmDisplay.textContent = `WPM: ${getWPM(entry)}`;
}
function getAccuracy(entry){
    const accuracy = Math.max(0, ((entry.length - mistakeMade) / entry.length) * 100);
    return accuracy.toFixed(2);
}
function getWPM(entry){
    const words = entry.split(/\s+/);
    wordCount = words.length;
    const timeElapsed = (Date.now() - startTime) / (1000 * 60);
    return Math.round(wordCount / timeElapsed);
}
let timer;
let sec = 180;
let timerRunning = false;
function startTimer(){ // purpose of the startTime and stopTime functions are to track WPM
    timerRunning = true;
    timeDisplay.style.display = 'block';
    timer = setInterval(()=>{
        const minutes = Math.floor(sec / 60);
        let remainingSeconds = sec % 60;
        if(remainingSeconds<10) remainingSeconds= "0"+remainingSeconds;
        if(remainingSeconds===0)remainingSeconds="00";
        timeDisplay.innerHTML = `Time: ${minutes}:${remainingSeconds}`;
        --sec;
        if(sec===-1)endGame(false);
    },1000);
}
function stopTimer(){
    timeDisplay.style.display = 'none';
    clearInterval(timer);
    sec = 180;
    timerRunning = false;
}
function endGame(won){
    //lock text box
    textEntry.contentEditable = false;
    textEntry.blur();
    //display end game stats: credits and time
    creditsDisplay.innerHTML = `By: ${quote[1]}`;
    const minutes = Math.floor((180-sec) / 60);
    let remainingSeconds = (180-sec) % 60;
    if(remainingSeconds<10) remainingSeconds= "0"+remainingSeconds;
    if(remainingSeconds===0)remainingSeconds="00";
    endTimeDisplay.innerHTML = `Time: ${minutes}:${remainingSeconds}`;
    document.getElementById("endgame-stats-display").style.display = 'flex';
    stopTimer();
    // save keyMistakes to db
    if(won) winGame();
}
async function winGame(){
    const currentDate = new Date();

    // Get the current year
    const currentYear = currentDate.getFullYear();

    // Get the current month (0-indexed, so January is 0)
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 to convert to 1-based index

    // Get the current day of the month
    const currentDay = currentDate.getDate();
    const time = Date.now();

    const entry = textEntry.textContent.trim();

    const run = {
        wpm: getWPM(entry),
        acc: getAccuracy(entry),
        keyMistakes: keyMistakes,
        time: [currentYear,currentMonth,currentDay,time],
        quote: quote,
    };
    let runs = await db.load("runs"); // adding the data of the typing run to the database.
    runs["data"].push(run);
    db.modify(runs);
}
const response = await fetch("quotes.csv");
const csvText = await response.text();
const parsedText = Papa.parse(csvText).data;
let quote;
async function startRound(){
    try{
        let randomIndex = Math.floor(Math.random() * parsedText.length);
        quote = parsedText[randomIndex];
        quoteText.innerText = quote[0];

        credits = quote[1]; // this is the author of the quote
    }catch(error){console.log(error)}
    restart();
}

function restart(){
    stopTimer();
    document.getElementById("endgame-stats-display").style.display = 'none';
    textEntry.innerHTML = "";
    textEntry.style.backgroundColor = 'rgb(33, 33, 33)';
    textEntry.contentEditable = true;
    quoteText.innerText = quoteText.innerText;
    mistakeMade = 0
    startTime = null;
    wordCount = 0; 
    keyMistakes = {A:0,B:0,C:0,D:0,E:0,F:0,G:0,H:0,I:0,J:0,K:0,L:0,M:0,N:0,O:0,P:0,Q:0,R:0,S:0,T:0,U:0,V:0,W:0,X:0,Y:0,Z:0};
}


startRound();
db.load("runs").catch(err=>db.save("runs",[]));




