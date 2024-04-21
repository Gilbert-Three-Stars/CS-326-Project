import {UserDB} from "../DBManager/UserDB.js";

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
function createChart(id,chartType, data, label, chartTime="all"){
    const ctx = document.getElementById(id);
    const chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: data.labels,
            datasets: [{
                label: label,
                data: data.data
            }],
        },
        options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
    });
    charts[id] = chart;
}

function parseData(data){
    return {labels: Object.keys(data), data:Object.values(data)};
}


let charts = {};

//if user is logged in
//if(loggedIn){code below}


/*
let runs = [
    {
        date:
        wpm:
        acc:
    },
]
*/

let db = new UserDB("TestUser");
loadStats()
createChart("wpm", "line", [], "No Data");
createChart("acc", "line", [], "No Data");
createChart("keys", "line", [], "No Data");

const dayButton = document.getElementById("day");
const weekButton = document.getElementById("week");
const monthButton = document.getElementById("month");
const sixMonthButton = document.getElementById("6month");
const allButton = document.getElementById("all");
const updateButton = document.getElementById("update");

dayButton.addEventListener("click",()=>{
    if(charts["wpm"]) charts["wpm"].destroy();
    if(charts["acc"]) charts["acc"].destroy();
    if(charts["keys"]) charts["keys"].destroy();
    createChart("wpm", "line", [], "No Data");
    createChart("acc", "line", [], "No Data");
    createChart("keys", "line", [], "No Data");
});
weekButton.addEventListener("click",()=>{
    if(charts["wpm"]) charts["wpm"].destroy();
    if(charts["acc"]) charts["acc"].destroy();
    if(charts["keys"]) charts["keys"].destroy();
    createChart("wpm", "line", [], "No Data");
    createChart("acc", "line", [], "No Data");
    createChart("keys", "line", [], "No Data");
});
monthButton.addEventListener("click",()=>{
    if(charts["wpm"]) charts["wpm"].destroy();
    if(charts["acc"]) charts["acc"].destroy();
    if(charts["keys"]) charts["keys"].destroy();
    createChart("wpm", "line", [], "No Data");
    createChart("acc", "line", [], "No Data");
    createChart("keys", "line", [], "No Data");
});
sixMonthButton.addEventListener("click",()=>{
    let wpm = {
        labels: ["March","April","May","June","July","August"],
        data: [74,83,89,95,96,101]
    };
    let acc = {
        labels: ["March","April","May","June","July","August"],
        data: [81,83,90,85,94,95],
    };
    let keysData = {
        a:10, b:4, c:14, d:7, e:15, f:9
    };
    if(charts["wpm"]) charts["wpm"].destroy();
    if(charts["acc"]) charts["acc"].destroy();
    if(charts["keys"]) charts["keys"].destroy();
    createChart("wpm","line",wpm,'Words Per Minute');
    createChart("acc","line",acc,'Accuracy %');
    createChart("keys","bar",parseData(keysData), "# of Key Miss");
});
allButton.addEventListener("click",()=>{
    let wpm = {
        labels: ["Jan","Feb","March","April","May","June","July","August"],
        data: [65,69,74,83,89,95,96,101]
    };
    let acc = {
        labels: ["Jan","Feb","March","April","May","June","July","August"],
        data: [75,80,81,83,90,85,94,95],
    };
    let keysData = {
        a:12, b:5, c:16, d:7, e:17, f:11
    };
    if(charts["wpm"]) charts["wpm"].destroy();
    if(charts["acc"]) charts["acc"].destroy();
    if(charts["keys"]) charts["keys"].destroy();
    createChart("wpm", "line", wpm, "Words Per Minute");
    createChart("acc", "line", acc, "Accuracy %");
    createChart("keys", "bar", parseData(keysData), "# of Key Miss");
});

//TODO temp remove later
updateButton.addEventListener("click",async()=>{
    try{
        const newKeys = await db.load("keys");
        const newWPM = await db.load("wpm");
        const newAcc = await db.load("acc");
        let newKeysData = newKeys.data;
        let newWPMData = newWPM.data;
        let newAccData = newAcc.data;
        if(charts["keys"])charts["keys"].destroy();
        if(charts["wpm"]) charts["wpm"].destroy();
        if(charts["acc"]) charts["acc"].destroy();
        createChart("wpm", "line", newWPMData, "Words Per Minute");
        createChart("acc", "line", newAccData, "Accuracy %");
        createChart("keys","bar",parseData(newKeysData), "# of Key Miss");
    }catch(error){
        console.log(error);
    }
})


