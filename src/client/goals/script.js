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

let db = new UserDB();

const wpmInput = document.getElementById("wpmGoal");
const textInput = document.getElementById("nt");
const wpmBtn = document.getElementById("enterWPMButton");
const textBtn = document.getElementById("enterTextButton");
const currentGoal = document.getElementById("current-goal");

wpmBtn.addEventListener("click",async()=>{
    await createData("wpmGoals",wpmInput.value);
})
textBtn.addEventListener("click",async()=>{
    await createData("textGoals",textInput.value);
})

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


async function readData(name) {
    if(!name){
        alert("Name is required!");
    }else{
        try{
            const data = await db.load(name);
            response.innerHTML = JSON.stringify(data);
        }catch(error){console.log(error);}
    }
}


async function updateData(name,data) {
    if(!name || !data){
        alert("Name/Input is required!");
    }else{
        try{
        const data = await db.load(name);
        data.data.append(JSON.parse(data))
        await db.modify(data);
        }catch(error){
            alert("Not valid data");
        }
        viewAll();
    }

}

async function deleteData(name) {
    if(!name){
        alert("Name is required!");
    }else{
        try{
            await db.delete(name);
        }catch(error){}
        viewAll();
    }
}

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
    }catch(error){}
}

viewAll();
