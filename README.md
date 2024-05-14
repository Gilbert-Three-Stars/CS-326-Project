## Cultivating Fingers


## Project Description

We aim to develop a typing game that is focused on improvement of the user. We have developed
an interface in which the user can practice their typing skills on a large body of quotes.
This is achieved through the use of a tracking system where the user can view their past stats
and see their progression visualized. We have also included a goals page where the user can
set goals for themselves in the pursuit of improved typing.

## Navigation Details

The frontend of our project is housed inside of src/client. For each webpage, we have a separate folder that is titled with the main purpose of that webpage. Our four main pages are the home page, in the folder titled 'home', the page where you type the text, in the folder titled 'play', the page in which you view your stats, in the folder titled 'stats', and the page in which you set and view goals, in the folder titled 'goals'. Within each folder, we have the JavaScript, HTML, and CSS files for that specific page.

The backend of our project is inside of src/server. We have two separate JavaScript files - one for the functions that connect to the server, titled 'server.js', and one for the database operation functions, titled 'db.js'. Additionally, the quotes that we're using for our project are stored in a csv file inside of the src/server directory.