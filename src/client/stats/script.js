
const url = 'http://localhost:3000'

//loads the stats on the stats page
async function loadStats(){
    const statsLabel = ["time","runs","top-speed","avg-speed","top-acc","avg-acc"];
    const response = await fetch(`${url}/read?name=runs`,{method: "GET"});
    let runs = JSON.parse(await response.text());
    runs = runs.data;

    //look through the data
    let runTime = 0;
    let topSpeed = 0;
    let totalSpeed = 0;
    let topAcc = 0;
    let totalAcc = 0;
    runs.forEach(run =>{
        runTime+=run.runTime;
        totalSpeed+=run.wpm;
        totalAcc+=parseFloat(run.acc);
        if(run.wpm>topSpeed) topSpeed=run.wpm;
        if(parseFloat(run.acc) >topAcc) topAcc=parseFloat(run.acc);
    });

    //display the data
    const minutes = Math.floor(runTime / 60);
    let remainingSeconds = runTime % 60;
    if(remainingSeconds<10) remainingSeconds= "0"+remainingSeconds;
    if(remainingSeconds===0)remainingSeconds="00";
    const stats = [`${minutes}:${remainingSeconds}`,runs.length,topSpeed,(totalSpeed/runs.length).toFixed(2),topAcc,(totalAcc/runs.length).toFixed(2)];
    for(let i = 0; i < 6; ++i){
        const div = document.getElementById(statsLabel[i]);
        div.innerText = div.innerText + stats[i];
    }
}

/**loads the graphs on the stats page
@param {string} id - The id of the chart DOM element to render the charts
@param {string} chartType - the type of chart to make
@param {object} data - the data of the charts
*/
function createChart(id,chartType, data, label){
    let options = {
        scales: {
            x: {
              display: false, 
            },
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            tooltip: {
              enabled: true 
            }
          }
    }
    if(id === "keys") options.scales.x.display = true;
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
        options: options
    });
    charts[id] = chart;
}

/**loads the graphs on the stats page
@param {string} timePeriod - The type of data the chart should sho
day, week, month, year, all
*/
async function reloadCharts(timePeriod){
    const response = await fetch(`${url}/read?name=runs`,{method: "GET"});
    let runs = JSON.parse(await response.text());
    runs = runs.data;
    const data = parseData(runs,timePeriod);
    if(charts["wpm"]) charts["wpm"].destroy();
    if(charts["acc"]) charts["acc"].destroy();
    if(charts["keys"]) charts["keys"].destroy();
    createChart("wpm", "line", data[0], "Words Per Minute");
    createChart("acc", "line", data[1], "Accuracy %");
    createChart("keys", "bar", data[2], "# of Key Miss");
}

const dateToMonth = {0:"Jan",1:"Feb",2:"Mar",3:"Apr",4:"May",5:"Jun",6:"Jul",7:"Aug",8:"Sep",9:"Oct",10:"Nov",11:"Dec"}
/**turns runs into an array that can be read by Chart JS
@param {Array<object>} runs - an array containing all the runs the user has done
@param {string} timePeriod - The type of data the chart should show
day, week, month, year, all
@returns {Array<object>} an array that can be read by Chart JS. [wpm,acc,label]
*/
function parseData(runs, timePeriod){
    let endDate = calculateDate(timePeriod);
    let labels = []
    let wpmData = []
    let accData = []
    let keyMistakesData = {A:0,B:0,C:0,D:0,E:0,F:0,G:0,H:0,I:0,J:0,K:0,L:0,M:0,N:0,O:0,P:0,Q:0,R:0,S:0,T:0,U:0,V:0,W:0,X:0,Y:0,Z:0};
    for(let i = runs.length-1; i >= 0 && endDate <= new Date(runs[i].time); --i){
        let run = runs[i];
        let date = new Date(run.time);
        labels.unshift(`${dateToMonth[date.getMonth()]} ${date.getDate()},${date.getFullYear()}`);
        wpmData.unshift(run.wpm);
        accData.unshift(run.acc);
        let keyMistakes = run.keyMistakes;
        for(let [key, value] of Object.entries(keyMistakes)){
            keyMistakesData[key] = keyMistakesData[key] + value;
        }
    }
    const wpm = {
        labels: labels,
        data: wpmData
    };
    const acc = {
        labels: labels,
        data: accData
    };
    let keys = Object.keys(keyMistakesData).map(key => keyMistakesData[key]);
    let abc = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
      ];
    return [wpm, acc, {labels:abc,data:keys}];
}
/**calculates the time range of the chart
@param {string} time - the type of data the chart should show
day, week, month, year, all 
@returns {Data} represents the first time index of the chart
*/
function calculateDate(time){
    let currentDate = new Date();
    if(time === "day")
            currentDate.setDate(currentDate.getDate() - 1);
    else if(time === "week")
            currentDate.setDate(currentDate.getDate() - 7);
    else if(time ==="month")
            currentDate.setMonth(currentDate.getMonth() - 1);
    else if(time === "year")
            -currentDate.setFullYear(currentDate.getFullYear() - 1);
    else
        currentDate = new Date('2020-01-01');
    return currentDate;
}

/*
let runs = [
    {
        wpm: #
        acc: #
        keyMistakes: {A:# ... Z:#}
        time:[#,#,#,#]
        runTime: #
        quote: ["","",""]
    },
]
*/


let charts = {};
loadStats();
reloadCharts("all");

const dayButton = document.getElementById("day");
const weekButton = document.getElementById("week");
const monthButton = document.getElementById("month");
const yearButton = document.getElementById("year");
const allButton = document.getElementById("all");

dayButton.addEventListener("click",()=>{
    reloadCharts("day");
});
weekButton.addEventListener("click",()=>{
    reloadCharts("week");
});
monthButton.addEventListener("click",()=>{
    reloadCharts("month");
});
yearButton.addEventListener("click",()=>{
    reloadCharts("year");
});
allButton.addEventListener("click",()=>{
    reloadCharts("all");
});




