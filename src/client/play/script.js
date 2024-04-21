const quoteText = document.getElementById('quote-text');
const textEntry = document.querySelector('.text-entry');

const accuracyDisplay = document.getElementById('acc');
textEntry.addEventListener("input", () => {
    const quote = quoteText.textContent.trim();
    const entry = textEntry.textContent.trim();

    if(entry === quote) {
        textEntry.style.backgroundColor = 'rgba(115, 227, 84, 0.5)';
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

let mistakeMade = 0; 
textEntry.addEventListener('input', function(event) {
    const quote = quoteText.textContent.trim();
    const entry = textEntry.textContent.trim();
    if (event.inputType === 'deleteContentBackward') {
        return;
    }

    if (entry.charAt(entry.length - 1) !== quote.charAt(entry.length - 1)) {

        mistakeMade++;
    }

    const accuracy = ((entry.length - mistakeMade) / entry.length) * 100;
    accuracyDisplay.textContent = `Accuracy: ${accuracy.toFixed(2)}%`;
});


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


function generateText(){
    fetch("quotes.csv")
    .then(response => response.text())
    .then(csvText =>{
        // console.log(JSON.parse(csvText))
        console.log((csvText))
    })
    .catch(error => console.error('Error fetching the CSV file:', error));
}

function startRound(text){

}
fetch('quotes.csv')
  .then(response => response.text())
  .then(csvText => {
    const rows = csvText.split('\n');

    // Process CSV data here
    // rows.forEach(row => {
    //     const columns = row.split(',');
    //     console.log(columns); // Example: Log each row as an array of columns
    // });
    for(let i = 1; i < 20; ++i){
        let text = rows[i]
        console.log(text)
    }
    // console.log(rows)
  })
  .catch(error => console.error('Error fetching the CSV file:', error));


// generateText();
const newTextBtn = document.getElementById("new-text");

newTextBtn.addEventListener("click",()=>{
    generateText();
});
