import * as db from './db.js'
import express from "express"
import path from "path"
import { fileURLToPath } from 'url';


const headerFields = {'Content-Type': 'text/html'}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

async function update(response, name, value) {
    try {
      let runs;
        try{
          runs = await db.load(name);
        }catch(e){
          await db.save("runs",[]);
        }
        runs.data.push(value);
        await db.modify(runs)
        console.log(runs.data)
        response.writeHead(200,headerFields);
        response.end();
    }
    catch(e) {
        response.writeHead(404,headerFields);
        console.log("here")
        console.log(e)
        response.end();
    }
}

// async function 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/home', express.static(path.join(__dirname, '../client', 'home')));
app.use('/play', express.static(path.join(__dirname, '../client', 'play')));
app.use('/stats', express.static(path.join(__dirname, '../client', 'stats')));
app.use('/goals', express.static(path.join(__dirname, '../client', 'goals')));
// Define route handlers
app.get('/', (req, res) => {
    res.redirect('/home');
    res.sendFile(path.join(__dirname, '../client','home', 'index.html'));
});

app.route('/update').put(async (request, response) => {
  const options = request.query;
  await update(response, options.name, options.value);
})

app.route("*").all(async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);  
});


  
app.listen(port, () => {
    console.log("listening on port " + port);
});
