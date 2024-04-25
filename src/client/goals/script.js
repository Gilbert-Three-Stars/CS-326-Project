import {UserDB} from "../DBManager/UserDB.js";

//This is the code from stats. you can change it accordingly to fit this page.

//if you want to access any of the data you created. Go to website, then stats->admin

let db = new UserDB();

const wpmInput = document.getElementById("wpmGoal");
const textInput = document.getElementById("nt");
const enterGoalButton = document.getElementById("enterGB");
const currentGoal = document.getElementById("current-goal");
const previousGoal = document.getElementById("previous-goal");
const processResButton = document.getElementById("processRes");

//uploads user inputted goal to current goal upon clicking enter goal button
enterGoalButton.addEventListener("click",async()=>{
    await createData("wpmGoals", wpmInput.value);
    await createData("textGoals", textInput.value);
});

//This is code to process data, checks to see if current data matches goal. Uploads current goal data to previous goal if goals are met
processResButton.addEventListener("click", async () => {
    const data = await db.load("runs");
    const runs = data.data;
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
    //calculates average speed (words per minute over number of texts)
    let avg = totalSpeed/numRuns;

    const wpmGoalData = await db.load("wpmGoals");
    const textGoalData = await db.load("textGoals");

    const wpmGoal = wpmGoalData.data;
    const textGoal = textGoalData.data;
        if((avg >= wpmGoal) && (numRuns >= textGoal)){
            //current goal has been achieved
            try{
                try{
                    await db.save("prevWpmGoals", wpmGoal);
                    await db.save("prevTextGoals", textGoal);
                }
                catch(err){
                    await updateData("prevWpmGoals", wpmGoal);
                    await updateData("prevTextGoals", textGoal);
                }
                await db.delete("wpmGoals");
                await db.delete("textGoals");
                currentGoal.innerHTML = "";
                //currentGoal.innerHTML = "You have no current goals, enter one!"; 
            }
            catch(error){
                alert("something is wrong");
            }
        }
        else{
            alert("goal not met");
        }
    viewAll();
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
        catch(err){}
        let prevWpm = await db.load("prevWpmGoals");
        let prevTexts = await db.load("prevTextGoals");
        if(currentGoal.innerHTML === ""){
            currentGoal.innerHTML = "Enter a goal!";
        }
        previousGoal.innerHTML = `Here are your goals you passed:`;
        for (let index = 0; index < prevWpm.data.length; index++) {
            previousGoal.innerHTML += `<br>You achieved ${JSON.stringify(prevWpm.data[index])} words per minute average over ${JSON.stringify(prevTexts.data[index])} texts!`;
        }
    }catch(error){}
}

viewAll();
