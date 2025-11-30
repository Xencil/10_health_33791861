# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

Routes that need a login before using:
/users/list
/users/logout
/books/list
/books/bookadded

Routes without login:
/users/register
/users/login
/users/registered
/users/loggedin
/books/search
/books/search-result

Validation info:
user/register
- username - between 5-20 char
- pass - at least 8 char
- email - has to be in valid format
- first and last names cant be left empty and can only contain letters
This prevents invalid data being entered in

books/addBook
- name of the book cant be left empty
- the price of the book has to be in the range of 0.01 and 999.9
This prevents unrealistic/invalid inputs being entered that could effect future application logic

Where i added sanitation:
-user registration:
-first name
-last name
-email 
-books added:
-the book name
i didnt sanitize the book price due to it be a numerical field that cant contain executable scripts.
I also didnt sanitize the password due to it being hashed already. The other fields are shown to the user in their raw from so they dont require to be sanitized.