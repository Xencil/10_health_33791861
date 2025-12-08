# Create database script for health

# Create the database
CREATE DATABASE IF NOT EXISTS health;
USE health;

# Create the tables
CREATE TABLE IF NOT EXISTS books (
    id     INT AUTO_INCREMENT,
    name   VARCHAR(50),
    price  DECIMAL(5, 2),
    PRIMARY KEY(id));

CREATE TABLE IF NOT EXISTS users (
    id     INT AUTO_INCREMENT,
    username   VARCHAR(50),
    firstName  VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    hashedPassword VARCHAR(255),
    PRIMARY KEY(id));


CREATE TABLE workout (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME,
    duration INT,
    FOREIGN KEY (userId) REFERENCES users(id)
);


CREATE TABLE exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sessionId INT NOT NULL,
    exerciseName VARCHAR(255) NOT NULL,
    weight FLOAT,
    reps INT NOT NULL,
    isPR BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (sessionId) REFERENCES workout(id)
);



# Create the application user
CREATE USER IF NOT EXISTS 'health_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON health.* TO 'health_app'@'localhost';
