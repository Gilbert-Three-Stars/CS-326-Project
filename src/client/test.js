
let isLoggedIn = false;
let button = document.getElementById("login");


function checkLogin() {
    // Example: Check if user is logged in (replace with your authentication logic)
    if (isLoggedIn) {
        // Display a welcome message if logged in
        document.getElementById('content').innerHTML = "<p>Hello, you are logged in.</p>";
    } else {
        // Display a login message if not logged in
        document.getElementById('content').innerHTML = "<p>To look at data, please login.</p>";
    }
}


function logIn(){

}

button.addEventListener("click",()=>{
    isLoggedIn = true;
    checkLogin();
})

// Call the checkLogin function when the page is loaded
checkLogin();



  