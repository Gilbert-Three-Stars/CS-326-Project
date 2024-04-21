const quoteText = document.getElementById('quote-text');
const textEntry = document.querySelector('.text-entry');

textEntry.addEventListener("input", () => {
    const quote = quoteText.textContent.trim();
    const entry = textEntry.textContent.trim();

    if(entry === quote) {
        textEntry.style.backgroundColor = rgb(115, 227, 84);
    }
    else { // check if user is on the right track
        let shavedQuote = quote.substring(0, entry.length);
        if(entry === shavedQuote) {
            textEntry.style.backgroundColor = rgb(33, 33, 33);
        } // if user is not on right track display in red
        else {
            textEntry.style.backgroundColor = rgb(204, 71, 61);
        }
    }
})


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
function parseCsv(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].trim().split(',');
    const data = [];
  
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const values = line.split(',');
        const entry = {};
        for (let j = 0; j < headers.length; j++) {
          entry[headers[j]] = values[j];
        }
        data.push(entry);
      }
    }
  
    return data;
}

const csvFilePath = 'quotes.csv'; // Change this to the path of your CSV file
fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSV file:', err);
      return;
    }

    const parsedData = parseCsv(data);
  
    console.log(parsedData);
});