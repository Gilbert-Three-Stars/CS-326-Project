import { UserDB } from "../DBManager/UserDB";

const userDB = new UserDB('goals');

window.addEventListener('DOMContentLoaded', async function() {
    const savedGoals = await userDB.loadAll();
    savedGoals.forEach(function(goal) {
        addGoalToDOM(goal);
    });
});

document.getElementById('enterGoalButton').addEventListener('click', function() {
    let wpmGoal = document.getElementById('wpmGoal').value;
    let txtGoal = document.getElementById('nt').value;

    let goal = {wpmGoal: wpmGoal, textsGoal: txtGoal};

    addGoalToDOM(goal);
    userDB.save('goal_' + Date.now(), goal);
});

function addGoalToDOM(goal) {
    let newGoal = document.createElement('div');
    newGoal.classList.add('newCurrentGoal');
    newGoal.innerHTML = '<h3>Words Per Minute Goal: ' + goal.wpmGoal + '</h3><h3>Number of Texts Goal: ' + goal.textsGoal + '</h3>';
    document.querySelector('.current-goal').appendChild(newGoal);
}