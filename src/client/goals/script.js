document.getElementById('enterGoalButton').addEventListener('click', function() {
    let wpmGoal = document.getElementById('wpmGoal').value;
    let txtGoal = document.getElementById('nt').value;

    let newGoal = document.createElement('div');
    newGoal.classList.add('newCurrentGoal');
    newGoal.innerHTML = '<h3>Words Per Minute Goal: ' + wpmGoal + '</h3><h3>Number of Texts Goal: ' + txtGoal + '</h3>';
    document.querySelector('.current-goal').appendChild(newGoal);
});