import {UserDB} from "../DBManager/UserDB.js";

//This is the code from stats. you can change it accordingly to fit this page.

//if you want to access any of the data you created. Go to website, then stats->admin

let db = new UserDB();

const wpmInput = document.getElementById("wpmGoal");
const textInput = document.getElementById("nt");
const enterGoalButton = document.getElementById("enterGB");
const currentGoals = document.getElementById("current-goals");
const previousGoal = document.getElementById("previous-goal");
const clearGoalsButton = document.getElementById("processRes");

//uploads user inputted goal to current goal upon clicking enter goal button
enterGoalButton.addEventListener("click",async()=>{
    // await createData("wpmGoals", wpmInput.value);
    if(!wpmInput.value) {
        alert("Please specify the desired words per minute")
        return;
    }
    if(!textInput.value) {
        alert("Please specify the number of texts");
        return;
    }

    let curGoal = JSON.stringify({'wpm': wpmInput.value, 'numTexts': textInput.value});
    await fetch(`http://localhost:3000/update?name=goals&value=${encodeURIComponent(curGoal)}`,{method: "PUT"}); // add it to the goals in database
    let newGoal = document.createElement('div');
    newGoal.textContent = `Type ${wpmInput.value} words per minute over a span of ${textInput.value} text(s)`;
    currentGoals.appendChild(newGoal);
});

//This is code to process data, checks to see if current data matches goal. Uploads current goal data to previous goal if goals are met
clearGoalsButton.addEventListener("click", async () => {
    // first, delete goals from the storage
    await fetch(`http://localhost:3000/delete?name=goals`, {method: 'DELETE'});
    // create an empty goals array
    let goals = [];
    await fetch(`http://localhost:3000/create?name=goals&value=${goals}`, {method: 'POST'});
    // then, clear all the elements from index.html
    await loadGoals();
});


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


async function updateData(name,newData) {
    if(!name || !newData){
        alert("Name/Input is required!");
    }else{
        try{
            const data = await db.load(name);
            data.data.push(JSON.parse(newData));
            await db.modify(data);
        }catch(error){
            console.log(error.message);
            alert("Not valid data");
        }
        viewAll();
    }

}

async function viewAll() {
    try{
        try{
            let wpm = await db.load("wpmGoals");
            currentGoal.innerHTML = `WPM Goals: ${JSON.stringify(wpm.data)}`;
            let texts = await db.load("textGoals");
            currentGoal.innerHTML += `<br>Text Goals: ${JSON.stringify(texts.data)}`;
        }
        catch(err){
            currentGoal.innerHTML = "You have no current goals, enter a goal!";
        }
        let prevWpm = await db.load("prevWpmGoals");
        let prevTexts = await db.load("prevTextGoals");
        previousGoal.innerHTML = `Here are your goals you passed:`;
        for (let index = 0; index < prevWpm.data.length; index++) {
            previousGoal.innerHTML += `<br>You achieved ${JSON.stringify(prevWpm.data[index])} words per minute average over ${JSON.stringify(prevTexts.data[index])} texts!`;
        }
    }catch(error){}
}

async function loadGoals() {
    try {
        let goals = await fetch(`http://localhost:3000/read?name=goals`,{method: "GET"});
        goals = JSON.parse(await goals.text())
        goals = goals.data;
        for(let i= 0; i < goals.length; i++) {
            let curGoal = document.createElement('div');
            curGoal.textContent = `Type ${goals[i].wpm} words per minute over a span of ${goals[i].numTexts} text(s)`;
            currentGoals.appendChild(curGoal);
        }
    }
    catch(e){
        console.log(e)
        console.log('error loading goals')
    }
}

loadGoals();
viewAll();
