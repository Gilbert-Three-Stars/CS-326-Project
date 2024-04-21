const quoteText = document.getElementById('quote-text');
const textEntry = document.querySelector('.text-entry');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('acc');
const newTextBtn = document.getElementById("new-text");
const restartBtn = document.getElementById('restart');

textEntry.addEventListener("input", () => {
    const quote = quoteText.textContent.trim();
    const entry = textEntry.textContent.trim();

    if(entry === quote) {
        textEntry.style.backgroundColor = 'rgba(115, 227, 84, 0.5)';
        textEntry.contentEditable = false;
        textEntry.blur();
    }
    else { // check if user is on the right track
        let shavedQuote = quote.substring(0, entry.length);
        if(entry === shavedQuote) {
            textEntry.style.backgroundColor = 'rgb(33, 33, 33)';
        } // if user is not on right track display in red
        else {
            textEntry.style.backgroundColor = 'rgba(204, 71, 61, 0.5)';
        }
    }
})

//tracks wpms, time, and accuracy
let mistakeMade = 0
let startTime;
let wordCount = 0; 
textEntry.addEventListener('input', function(event) {
    const quote = quoteText.textContent.trim();
    const entry = textEntry.textContent.trim();
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
});

const response = await fetch("quotes.csv");
const csvText = await response.text();
const text = Papa.parse(csvText).data;

// console.log(text[236719])

async function generateText(){
    let randomIndex = Math.floor(Math.random() * text.length);
    return new Promise((resolve, reject) => { resolve(text[randomIndex])});
}

async function startRound(){
    restart();
    generateText().then(text=>{
        quoteText.textContent = text[0].replace("’","'");
    })
}

function restart(){
    textEntry.innerHTML = "";
    textEntry.style.backgroundColor = 'rgb(33, 33, 33)';
    textEntry.contentEditable = true;
    mistakeMade = 0
    startTime = null;
    wordCount = 0; 
}

newTextBtn.addEventListener("click",async()=>{
    await startRound()
});

restartBtn.addEventListener('click', async() => {
    restart()
});

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

save the data into UserDB
ideally there should be a DOM element that we can extract the username from
which means,
let db = new UserDB(username)

usernames are unique. need to figure out a way to make duplicate names unique
calling new UserName(username) in another file will share 
the same data. 

all the functions are async

data can be added like
await db.save(name, data) //db.save("keys",keysData);

getting data
await db.load(name)

updating data
let data = await db.load(name)
data[property] = something
await db.modify(data)
*/


