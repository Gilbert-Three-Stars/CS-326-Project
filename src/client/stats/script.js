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
    const ctx = document.getElementById('chart');
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

let isLoggedIn = false;

//if user is logged in
//if(loggedIn){code below}
let data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
};
loadStats()
createChart("chart","bar",data);