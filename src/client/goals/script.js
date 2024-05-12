

//if you want to access any of the data you created. Go to website, then stats->admin

const wpmInput = document.getElementById("wpmGoal");
const textInput = document.getElementById("nt");
const enterGoalButton = document.getElementById("enterGB");
const currentGoals = document.getElementById("current-goals");
const previousGoal = document.getElementById("previous-goal");
const processResButton = document.getElementById("processRes");

//uploads user inputted goal to current goal upon clicking enter goal button
enterGoalButton.addEventListener("click",async()=>{
    // await createData("wpmGoals", wpmInput.value);
    // need to specify both the words per minute and number of texts to create a valid goal
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

//This button clears all of the current goals.
processResButton.addEventListener("click", async () => {
    await fetch(`http://localhost:3000/delete?name=goals`, {method: "DELETE"});
    loadGoals();
});

/**
 * This function displays both the current goals and the previous goals in their respective areas.
 */
async function loadGoals() {
    try { // this block is for loading current goals
        currentGoals.textContent = ''; // clear the text content of the current goals
        // then fetch the goals again after you clear it.
        let goals = await fetch(`http://localhost:3000/read?name=goals`,{method: "GET"});
        goals = JSON.parse(await goals.text())
        goals = goals.data;
        for(let i= 0; i < goals.length; i++) {
            let curGoal = document.createElement('div');
            curGoal.textContent = `Type ${goals[i].wpm} words per minute over a span of ${goals[i].numTexts} text(s)`;
            currentGoals.appendChild(curGoal);
        }
    }
    catch{ // we want empty goals section if there is no entry for goals.
        console.log('error loading goals')
        currentGoals.textContent = '';

    }
    try { // this block is for loading previous goals.
        previousGoal.textContent = '';
        let prevGoals = await fetch(`http://localhost:3000/read?name=prevGoals`, {method: "GET"});
        prevGoals = JSON.parse(await prevGoals.text());
        prevGoals = prevGoals.data;
        for(let i = 0; i < prevGoals.length; i++) {
            let curPrevGoal = document.createElement('div');
            curPrevGoal.textContent = `You succeeded in typing ${prevGoals[i].wpm} words per minute over a span of ${prevGoals[i].numTexts} text(s)`
            previousGoal.appendChild(curPrevGoal)
        }
    }
    catch {
        console.log('error loading previous goals')
        previousGoal.textContent = ''
    }
}

loadGoals();

