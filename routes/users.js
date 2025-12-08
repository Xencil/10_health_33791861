// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
const { check, validationResult } = require('express-validator')

const redirectLogin = (req, res, next) => {
    if (!req.session || !req.session.userId) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})

router.post('/registered',  [check('email').isEmail().withMessage("email not valid"),
    check("username").isLength({ min: 5, max: 20}).withMessage("username must be between 5 and 20 characters"),
    check('password').isLength({min:8}).withMessage("password must be at least 8 characters").matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter").matches(/[A-Z]/).withMessage("password must contain at least one uppercase letter").matches(/\d/).withMessage("password must contain at least one number").matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("password must contain at least one special character"),
    check("first").notEmpty().withMessage("first name is needed").isAlpha().withMessage("must contain only letters"),
    check('last').notEmpty().withMessage("last name is needed").isAlpha().withMessage("must contain only letters")], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('./register',{ errors: errors.array() })
    }
    else { 
        const plainPassword = req.body.password
        // saving data in database
        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            let sqlquery = "INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES (?,?,?,?,?)"
            // execute sql query
            let newrecord = [req.sanitize(req.body.username),req.sanitize(req.body.first),req.sanitize(req.body.last),req.sanitize(req.body.email),hashedPassword]
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    next(err)
                }
                else
                    res.render("./tracker", { username: req.session.username, sessionId: null })
                    // result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
                    // result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                    // res.send(result)
            })
    })         
    }                                                 
}); 


router.post('/loggedin', (req, res, next) => {
    const username = req.body.username;
    const plainPassword = req.body.password;

    let sqlquery ="SELECT * FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, results) => {
        if (err) return next(err);

        if (!results || results.length === 0) {
            return res.render("login", { 
                errors: [{ msg: "Login failed: username not found" }],
            });
        }

        const user = results[0];
        bcrypt.compare(plainPassword, user.hashedPassword, function(err, result) {
            if (err) return next(err);

            if (result === true) {
                req.session.userId = user.id;
                req.session.username = user.username;

                res.redirect("/tracker/trackerLogger"); 
            } else {

                return res.render("login", { 
                    errors: [{ msg: "Login failed: incorrect password" }],
                });
            }
        });
    });
});

router.get('/logout', redirectLogin, (req,res) => {
        req.session.destroy(err => {
        if (err) {
            return res.redirect('./')
        }
        res.render("about.ejs");
        })
    })


// Export the router object so index.js can access it
module.exports = router
