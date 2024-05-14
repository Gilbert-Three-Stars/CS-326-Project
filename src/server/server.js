import * as db from './db.js';
import express from "express";
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { fileURLToPath } from 'url';


const headerFields = {'Content-Type': 'text/html'}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

/**handles data creation in pouch DB
 * 
 * @param {Response} response 
 * @param {string} name name of data
 * @param {*} value data 
 */
async function create(response, name, value){
  try {
      await db.save(name,JSON.parse(value));
      response.writeHead(200,headerFields);
      response.end();
  }
  catch(e) {
      response.writeHead(404,headerFields);
      response.end();
  }
}
/**handles data update 
 * @param {Response} response 
 * @param {string} name naem of data
 * @param {*} value data 
 */
async function update(response, name, value) {
    try {
      let runs;
        try{
          runs = await db.load(name);
        }catch(e){
          await db.save(name,[]);
          runs = await db.load(name);
        }
        runs.data.push(JSON.parse(value));
        await db.modify(runs)
        response.writeHead(200,headerFields);
        response.end();
    }
    catch(e) {
        console.log(e);
        response.writeHead(404,headerFields);
        response.end();
    }
}
/**handles data reading. returns data 
 * @param {Response} response 
 * @param {string} name name of data
 */
async function read(response, name){
  try{
    const runs = await db.load(name);
    response.writeHead(200, headerFields);
    response.write(JSON.stringify(runs))
    response.end();
  }catch(e){
    response.writeHead(404,headerFields);
    response.end();
  }
}
/**handles deleting data.
 * @param {Response} response 
 * @param {string} name name of data
 */
async function del(response, name) {
  try {
      await db.del(name);
      response.writeHead(200, headerFields);
      response.end();
  }
  catch {
      response.writeHead(404, headerFields);
      response.end();
  }
}
/**gives string of all data values.
 * @param {Response} response 
 */
async function viewAll(response){
  try{
    const result = await db.loadAll()
    let responseText = "";
    result.forEach((data) => {
      responseText += `${data._id} = ${JSON.stringify(data.data)}<br>`;
    });
    response.writeHead(200, headerFields);
    response.write(responseText)
    response.end();
  }catch(e){
    console.log(e)
    response.writeHead(404,headerFields);
    response.end();
  }
}
/**deletes element of data value
 * @param {Response} response 
 * @param {string} name name of data
 * @param {int} index index to delete
 */
async function deleteEntry(response, name, index) {
  try {
    let data = await db.load(name);
    let i = JSON.parse(index);
    data.data.splice(i, 1);
    await db.modify(data);
    response.writeHead(200,headerFields);
    response.end();
  }
  catch(e){
    console.log(e)
    response.writeHead(404, headerFields);
    response.end();
  }
}
/**returns an entry in the database.
 * @param {Response} response 
 */
const text = await readCSVFile("../CS-326-Project/src/server/quotes.csv");
async function getText(response){
  try{
    let randomIndex = Math.floor(Math.random() * text.length);
    const quote = (text[randomIndex]);
    response.writeHead(200,headerFields);
    response.write(JSON.stringify(quote));
    response.end()
  }catch(e){
    response.writeHead(400,headerFields);
    response.end();
  }
}
/**loads database.
 * @param {string} filePath path to database
 */
function readCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

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


const methodNotAllowedHandler = async (request, response) => {
  response.status(405).type('text/plain').send('Method Not Allowed');
};

app
  .route('/create')
  .post(async (request, response) => {
    const options = request.query;
    await create(response, options.name, options.value);
  })
  .all(methodNotAllowedHandler);
app
  .route('/update')
  .put(async (request, response) => {
    const options = request.query;
    await update(response, options.name, options.value);
  })
  .all(methodNotAllowedHandler);
app
  .route('/read')
  .get(async (request, response) => {
    const options = request.query;
    await read(response, options.name);
  })
  .all(methodNotAllowedHandler);
app
  .route('/text')
  .get(async (request, response) => {
    await getText(response);
  })
  .all(methodNotAllowedHandler);
app
  .route("/delete")
  .delete(async (request, response) => {
    const options = request.query;
    await del(response, options.name);
  })
  .all(methodNotAllowedHandler);
app
  .route("/all")
  .get(async (request, response) => {
    viewAll(response);
  })
  .all(methodNotAllowedHandler);
app
  .route("/deleteEntry")
  .put(async (request, response) => {
    const options = request.query;
    await deleteEntry(response, options.name, options.index)
  })
  .all(methodNotAllowedHandler);


app.route("*")
.all(async (request, response) => {
      response.status(404).send(`Not found: ${request.path}`);  
})
.all(methodNotAllowedHandler);


  
app.listen(port, () => {
    console.log("listening on port " + port);
});
