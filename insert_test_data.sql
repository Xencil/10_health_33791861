# Insert data into the tables

USE health;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99),('Thinking Fast and Slow', 10.00), ('Beyond Order', 9.99) ;

INSERT INTO users (username, firstName, lastName, email,hashedPassword)VALUES('gold', 'Gold', 'Smith', 'gold@.com', '$2b$10$VWSldDiIyYNWSGwkZfA73.ryzeyKkiGaXdPr2PRRCOw/ZcMn8oVRe')