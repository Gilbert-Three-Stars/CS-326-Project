

const quoteText = document.getElementById('quote-text');
const textEntry = document.querySelector('.text-entry');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('acc');
const timeDisplay = document.getElementById("time");
const endTimeDisplay = document.getElementById("timer");
const creditsDisplay = document.getElementById("credits");
const newTextBtn = document.getElementById("new-text");
const restartBtn = document.getElementById('restart');

const url = "http://localhost:3000";

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
let keyMistakes = {
    "A": 0, "B": 0, "C": 0, "D": 0, "E": 0,
    "F": 0, "G": 0, "H": 0, "I": 0, "J": 0,
    "K": 0, "L": 0, "M": 0, "N": 0, "O": 0,
    "P": 0, "Q": 0, "R": 0, "S": 0, "T": 0,
    "U": 0, "V": 0, "W": 0, "X": 0, "Y": 0, "Z": 0
};
/**function that runs when the user is typing
@param {Event} event - user action
*/
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
/**get accuracy of user
@param {string} entry - text user is typing
@returns {float} the accuracy of the user
*/
function getAccuracy(entry){
    const accuracy = Math.max(0, ((entry.length - mistakeMade) / entry.length) * 100);
    return accuracy.toFixed(2);
}
/**get words per minute of user
@param {string} entry - text user is typing
@returns {int} the wpm of the user
*/
function getWPM(entry){
    const words = entry.split(/\s+/);
    wordCount = words.length;
    const timeElapsed = (Date.now() - startTime) / (1000 * 60);
    return Math.round(wordCount / timeElapsed);
}

// purpose of the startTime and stopTime functions are to track WPM
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
        if(sec===-1)endGame(false);
    },1000);
}
function stopTimer(){
    timeDisplay.style.display = 'none';
    clearInterval(timer);
    sec = 180;
    timerRunning = false;
}
/**function to handle when the game ends
@param {boolean} won - boolean of whether the user wins or not
*/
function endGame(won){
    //lock text box
    textEntry.contentEditable = false;
    textEntry.blur();
    //display end game stats: credits and time
    creditsDisplay.innerHTML = `By: ${textQuote["author"]}`;
    const minutes = Math.floor((180-sec) / 60);
    let remainingSeconds = (180-sec) % 60;
    if(remainingSeconds<10) remainingSeconds= "0"+remainingSeconds;
    if(remainingSeconds===0)remainingSeconds="00";
    endTimeDisplay.innerHTML = `Time: ${minutes}:${remainingSeconds}`;
    document.getElementById("endgame-stats-display").style.display = 'flex';
    if(won) winGame();
    stopTimer();
}
/**function to handle the user winning
 */
async function winGame(){
    const currentDate = new Date();
    const entry = textEntry.textContent.trim();
    const run = {
        "wpm": getWPM(entry),
        "acc": getAccuracy(entry),
        "keyMistakes": keyMistakes,
        "time": currentDate.toISOString(),
        "runTime": (180-sec) % 60,
        "quote": textQuote
    };
    const runJsonString = JSON.stringify(run)
    await fetch(`${url}/update?name=runs&value=${encodeURIComponent(runJsonString)}`,{method: "PUT"});
    checkGoals();
}

/**after completing a run, check whether any goals have been completed
 */
async function checkGoals(){
    let goals;
    try {
        goals = await fetch(`${url}/read?name=goals`,{method: "GET"});
        goals = JSON.parse(await goals.text());
        goals = goals.data
    }
    catch(e) {
        goals = []
    }
    let runs;
    try {
        runs = await fetch(`${url}/read?name=runs`,{method: "GET"});
        runs = JSON.parse(await runs.text())
        runs = runs.data
    }
    catch(e) {
        runs = []
    }
    for (let i = 0; i < goals.length; i++) {
        let curTotal = 0
        for (let j = 0; j < goals[i].numTexts; j++) {
            curTotal += runs[runs.length-1-j].wpm;
        }
        
        if((curTotal/parseInt(goals[i].numTexts)) >= parseInt(goals[i].wpm)) { // this means they achieved the goal.
            // need to update goals and send alert if user achieves a goal.
            alert(`You have succeeded in typing ${goals[i].wpm} wpm over ${goals[i].numTexts} texts`);
            await fetch(`http://localhost:3000/update?name=prevGoals&value=${encodeURIComponent(JSON.stringify(goals[i]))}`,{method: "PUT"});
            await fetch(`http://localhost:3000/deleteEntry?name=goals&index=${i}`, {method: "PUT"});
        }
    } 
}

let textQuote;
/**function to start the game,
 * generates a random text to type
 */
async function startRound(){
    try{
        const response = await fetch(`${url}/text`,{method: "GET"});
        textQuote = JSON.parse(await response.text());
        quoteText.innerText = textQuote["quote"];
    }catch(error){console.log(error)}
    restart();
}
/**function that resets the game
 * 
 */
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





