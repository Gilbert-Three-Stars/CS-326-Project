import {UserDB} from "../UserDB.js";

/**loads the stats on the stats page
@param {Element} element - The DOM element to render the stats. 
*/
async function loadStats(){
    const stats = ["time","runs","top-speed","avg-speed","top-acc","avg-acc"];
    for(let i = 0; i < 6; ++i){
        const div = document.getElementById(stats[i]);
        /*when login is implemented
        try{
            const data = await db.load(username);
            div.innerText = div.innerText + data;
        }catch(error){
            div.innerText = div.innerText + "No data available";
        }
        */
        div.innerText = div.innerText + "No data available";
    }

}

/**loads the graphs on the stats page
@param {string} id - The id of the chart DOM element to render the charts
@param {string} chartType - the type of chart to make
@param {string} chartTime - the time range of the data
@param {object} data - the data of the charts
*/
function createChart(id,chartType, data, chartTime="all"){
    const ctx = document.getElementById(id);
    const chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: data.labels,
            datasets: data.datasets,
        },
        options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
    });
}

function parseData(data){

}
function flip(element){
    if(element.value.includes("Last")){
        element.value = "boo";
    }
    else{
        element.value = "Last Day";
    }
}

let isLoggedIn = false;

//if user is logged in
//if(loggedIn){code below}
let wpm = {
    labels: ["Jan","Feb","March","April","May","June"],
    datasets: [{
      label: 'Words Per Minute',
      data: [74,83,89,95,96,101],
      borderWidth: 1
    }]
};
let acc = {
    labels: ["Jan","Feb","March","April","May","June"],
    datasets: [{
      label: 'Accuracy %',
      data: [81,83,90,85,94,95],
      borderWidth: 1
    }]
};
let keys = {
    labels: ["a","b","c","d","e","f"],
    datasets: [{
      label: 'Keys Missed',
      data: [10,4,14,7,15,9]
    }]
};

/*
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
//
let db = new UserDB("TestUser");
loadStats()
createChart("wpm","line",wpm);
createChart("acc","line",acc);
createChart("keys","bar",keys);

const dayButton = document.getElementById("day");
const weekButton = document.getElementById("week");
const monthButton = document.getElementById("month");
const sixMonthButton = document.getElementById("6month");
const allButton = document.getElementById("all");

dayButton.addEventListener("click",()=>{
    flip(dayButton);
});
weekButton.addEventListener("click",()=>{

});
monthButton.addEventListener("click",()=>{

});
sixMonthButton.addEventListener("click",()=>{

});
allButton.addEventListener("click",()=>{

});



