import {UserDB} from "../DBManager/UserDB.js";



// window.addEventListener('DOMContentLoaded', async function() {
//     const savedGoals = await userDB.loadAll();
//     savedGoals.forEach(function(goal) {
//         addGoalToDOM(goal);
//     });
// });

// document.getElementById('enterGoalButton').addEventListener('click', function() {
//     let wpmGoal = document.getElementById('wpmGoal').value;
//     let txtGoal = document.getElementById('nt').value;

//     let goal = {wpmGoal: wpmGoal, textsGoal: txtGoal};

//     addGoalToDOM(goal);
//     userDB.save('goal_' + Date.now(), goal);
// });

// function addGoalToDOM(goal) {
//     let newGoal = document.createElement('div');
//     newGoal.classList.add('newCurrentGoal');
//     newGoal.innerHTML = '<h3>Words Per Minute Goal: ' + goal.wpmGoal + '</h3><h3>Number of Texts Goal: ' + goal.textsGoal + '</h3>';
//     document.querySelector('.current-goal').appendChild(newGoal);
// }





//This is the code from stats. you can change it accordingly to fit this page.

//if you want to access any of the data you created. Go to website, then stats->admin

let db = new UserDB();

const wpmInput = document.getElementById("wpmGoal");
const textInput = document.getElementById("nt");
//const wpmBtn = document.getElementById("enterWPMButton");
//const textBtn = document.getElementById("enterTextButton");
const enterGoalButton = document.getElementById("enterGB");
const currentGoal = document.getElementById("current-goal");
const previousGoal = document.getElementById("previous-goal");
const processResButton = document.getElementById("processRes");

enterGoalButton.addEventListener("click",async()=>{
    await createData("wpmGoals", wpmInput.value);
    await createData("textGoals", textInput.value);
    viewAll();
});
/*textBtn.addEventListener("click",async()=>{
    await createData("textGoals",textInput.value);
})*/

//THIS IS CODE TO READ THE DATA

processResButton.addEventListener("click", async () => {
    const data = await db.load("runs");
    const runs = data.data;
    //processRun(runs);
    let runTime = 0;
    let topSpeed = 0;
    let totalSpeed = 0;
    let topAcc = 0;
    let totalAcc = 0;
    let numRuns = 0;
    runs.forEach(run =>{
        runTime+=run.runTime;
        totalSpeed+=run.wpm;
        totalAcc+=parseFloat(run.acc);
        numRuns++;
        if(run.wpm>topSpeed) topSpeed=run.wpm;
        if(run.acc>topAcc) topAcc=run.acc;
    });
    let avg = totalSpeed/numRuns;
    try{
        if((avg >= wpmInput.value) && (numRuns >= textInput.value)){
            //goal achieved
            let wpm = await db.load("wpmGoals");
            previousGoal.innerHTML = `WPM Goals: ${JSON.stringify(wpm.data)}`;
            let texts = await db.load("textGoals");
            previousGoal.innerHTML += `<br>Text Goals: ${JSON.stringify(texts.data)}`;
            db.delete("wpmGoals");
            db.delete("textGoals");
            // db.delete("run");
            currentGoal.innerHTML = "";
            currentGoal.innerHTML = "";
            numRuns = 0;
            avg = 0;
            alert("You did meet your goals");
        }
    }
    catch(error){
        alert("You did not meet your goals");
    }
});

/*async function checkAchievements(avg){
    if((avg >= wpmInput.value) && (numRuns >= textInput.value)){
        //goal achieved
        let wpm = await db.load("wpmGoals");
        previousGoal.innerHTML = `WPM Goals: ${JSON.stringify(wpm.data)}`;
        let texts = await db.load("textGoals");
        previousGoal.innerHTML += `<br>Text Goals: ${JSON.stringify(texts.data)}`;
        db.delete("wpmGoals");
        db.delete("textGoals");
        currentGoal.innerHTML = "";
        currentGoal.innerHTML = "";
        numRuns = 0;
        avg = 0;
    }
}

async function processRun(runs){
    let runTime = 0;
    let topSpeed = 0;
    let totalSpeed = 0;
    let topAcc = 0;
    let totalAcc = 0;
    let numRuns = 0;
    runs.forEach(run =>{
        runTime+=run.runTime;
        totalSpeed+=run.wpm;
        totalAcc+=parseFloat(run.acc);
        numRuns++;
        if(run.wpm>topSpeed) topSpeed=run.wpm;
        if(run.acc>topAcc) topAcc=run.acc;
    });
    let avg = totalSpeed/numRuns;
    //checkAchievements(avg);
}*/

async function createData(name,data) {
    if(!name || !data){
        alert("Name/Input is required!");
    }else{
        try{
            await db.save(name, [JSON.parse(data)]);
        }catch(error){
            alert("Either duplicate creation or not valid data");
            console.log(error)
        }
    }
    viewAll();
}


// async function readData(name) {
//     if(!name){
//         alert("Name is required!");
//     }else{
//         try{
//             const data = await db.load(name);
//             response.innerHTML = JSON.stringify(data);
//         }catch(error){console.log(error);}
//     }
// }


// async function updateData(name,data) {
//     if(!name || !data){
//         alert("Name/Input is required!");
//     }else{
//         try{
//         const data = await db.load(name);
//         data.data.append(JSON.parse(data))
//         await db.modify(data);
//         }catch(error){
//             alert("Not valid data");
//         }
//         viewAll();
//     }

// }

// async function deleteData(name) {
//     if(!name){
//         alert("Name is required!");
//     }else{
//         try{
//             await db.delete(name);
//         }catch(error){}
//         viewAll();
//     }
// }

async function viewAll() {
    try{
        // const all = await db.loadAll();
        // let responseText = "";
        // all.forEach((data) => {
        //   responseText += `${data._id} = ${JSON.stringify(data.data)}<br>`;
        // });
        // currentGoal.innerHTML = responseText;

        let wpm = await db.load("wpmGoals");
        currentGoal.innerHTML = `WPM Goals: ${JSON.stringify(wpm.data)}`;
        let texts = await db.load("textGoals");
        currentGoal.innerHTML += `<br>Text Goals: ${JSON.stringify(texts.data)}`;
        let prevWpm = await db.load("wpmGoals");
        previousGoal.innerHTML = `WPM Goals: ${JSON.stringify(prevWpm.data)}`;
        let prevTexts = await db.load("textGoals");
        previousGoal.innerHTML += `<br>Text Goals: ${JSON.stringify(prevTexts.data)}`;
    }catch(error){}
}

viewAll();
