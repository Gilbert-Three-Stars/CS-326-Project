document.getElementById('enterGoalButton').addEventListener('click', function() {
    let wpmGoal = document.getElementById('wpmGoal').value;
    let txtGoal = document.getElementById('nt').value;

    let newGoal = document.createElement('div');
    newGoal.classList.add('goal');
    newGoal.innerHTML = '<h3>WPM Goal: ' + wpmGoal + '</h3><p>Number of Texts Goal: ' + textsGoal + '</p>';
    document.querySelector('.current-goal').appendChild(newGoal);
});