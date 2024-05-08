import * as db from './db.js'
import express from "express"
import path from "path"
import { fileURLToPath } from 'url';


const headerFields = {'Content-Type': 'text/html'}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

async function create(response, name, value){
  try {
      await db.save(name,value);
      response.writeHead(200,headerFields);
      response.end();
  }
  catch(e) {
      response.writeHead(404,headerFields);
      response.end();
  }
}

async function update(response, name, value) {
    try {
      let runs;
        try{
          runs = await db.load(name);
        }catch(e){
          await db.save(name,[]);
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

async function read(response, name){
  try{
    const runs = await db.load(name);
    response.writeHead(200, headerFields);
    response.write(JSON.stringify(runs.data))
    response.end();
  }catch(e){
    response.writeHead(404,headerFields);
    response.end();
  }
}
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

app
  .route('/create')
  .post(async (request, response) => {
    const options = request.query;
    await create(response, options.name, options.value);
  })
app
  .route('/update')
  .put(async (request, response) => {
    const options = request.query;
    await update(response, options.name, options.value);
  })
app
  .route('/read')
  .get(async (request, response) => {
    const options = request.query;
    await read(response, options.name);
  })
app
  .route("/delete")
  .delete(async (request, response) => {
    const options = request.query;
    del(response, options.name);
  })
  // .all(methodNotAllowedHandler);
app
  .route("/all")
  .get(async (request, response) => {
    viewAll(response);
  })


app.route("*").all(async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);  
});


  
app.listen(port, () => {
    console.log("listening on port " + port);
});
