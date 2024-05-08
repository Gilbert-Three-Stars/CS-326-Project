
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/home', express.static(path.join(__dirname, '..client', 'home')));
app.use('/play', express.static(path.join(__dirname, '../client', 'play')));
app.use('/stats', express.static(path.join(__dirname, '../client', 'stats')));
app.use('/goals', express.static(path.join(__dirname, '../client', 'goals')));
// Define route handlers
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client','home','index.html'));
});
  
app.listen(port, () => {
    console.log("listening on port " + port);
})
