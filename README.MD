# Gym Tracking Application

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

Routes that need a login before using:
/users/list
/users/logout
/tracker/trackerLogger
/tracker/workoutResults/:sessionId
/tracker/chartData
/tracker/charts
/tracker/startSession
/tracker/addExercise
/tracker/endSession

Routes without login:
/users/register
/users/login
/users/registered
/users/loggedin

Validation info:
user/register
- username - between 5-20 char
- pass - at least 8 char
- email - has to be in valid format
- first and last names cant be left empty and can only contain letters
This prevents invalid data being entered in

Adding exercises
-name of exercise cant be empty
- weight cant be less than 0
- reps cant be less than 0

Where i added sanitation:
-user registration:
-first name
-last name
-email 
-exercise name
i didnt sanitize the book price due to it be a numerical field that cant contain executable scripts.
I also didnt sanitize the password due to it being hashed already. The other fields are shown to the user in their raw from so they dont require to be sanitized.