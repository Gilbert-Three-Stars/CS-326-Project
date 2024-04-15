// import * as db from "../db.js";

/**loads the graphs on the stats page
*
* @param {Element} element - The DOM element to render the stats. 
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

function createChart(id, type, data, ){
    const ctx = document.getElementById(id);
    const chart = new Chart(ctx, {
        type: type,
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
let data1 = {
    labels: ["Jan","Feb","March","April","May","June"],
    datasets: [{
      label: 'Words Per Minute',
      data: [74,83,89,95,96,101],
      borderWidth: 1
    }]
};
let data2 = {
    labels: ["Jan","Feb","March","April","May","June"],
    datasets: [{
      label: 'Accuracy %',
      data: [81,83,90,85,94,95],
      borderWidth: 1
    }]
};
loadStats()
createChart("wpm","line",data1);
createChart("acc","line",data2);

const dayButton = document.getElementById("day");
const weekButton = document.getElementById("week");
const monthButton = document.getElementById("month");
const sixMonthButton = document.getElementById("6month");
const yearButton = document.getElementById("year");

dayButton.addEventListener("click",()=>{
    flip(dayButton);
});
weekButton.addEventListener("click",()=>{

});
monthButton.addEventListener("click",()=>{

});
sixMonthButton.addEventListener("click",()=>{

});
yearButton.addEventListener("click",()=>{

});