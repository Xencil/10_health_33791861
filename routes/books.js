// Create a new router
const express = require("express")
const router = express.Router()
const { check, validationResult } = require('express-validator')


const redirectLogin = (req, res, next) => {
    if (!req.session || !req.session.userId) {
      res.redirect('/users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    //searching in the database
    res.send("You searched for: " + req.query.keyword)
});

router.get('/list', redirectLogin,function(req, res, next) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                next(err)
            }
            res.render("list.ejs", {availableBooks:result})
        });
    });

router.get('/addbook', redirectLogin, (req, res) => {
    res.render('addbook.ejs', { errors: [] })
})

router.post('/bookadded', redirectLogin,[check('name').notEmpty().withMessage('book title is needed'),check('price').notEmpty().isFloat({ min: 0.01, max: 999.99 }).withMessage('price must be between 0.01-999.99')],function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('./addbook', { errors: errors.array() })
    }
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.sanitize(req.body.name), req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price)
    })
}) 


// Export the router object so index.js can access it
module.exports = router
