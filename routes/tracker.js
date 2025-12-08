
const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")

const redirectLogin = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        res.redirect("/users/login") 
    } else { 
        next (); 
    } 
}

router.get('/trackerLogger',redirectLogin, (req, res,next)=> {
    const prMess = req.session.prMess ||[]
    const sessionId =req.session.currentSessionId ||null
    req.session.prMess = []
    if(!sessionId){
        return res.render("tracker.ejs",{username: req.session.username,sessionId: null, exercises: [], errors: [],prMess})
    }
    const dataBase = "SELECT * FROM exercises WHERE sessionId = ?"
    db.query(dataBase,[sessionId],(err, exercises)=> {
        if(err) return next(err)
        res.render("tracker.ejs", {username: req.session.username,sessionId,exercises,errors: [],prMess })
    });
});



router.get('/workoutResults/:sessionId', redirectLogin, (req, res,next)=> {
    const {sessionId} =req.params
    const dataBase = "SELECT * FROM exercises WHERE sessionId = ?"
    db.query(dataBase,[sessionId],(err, exercises)=> {
        if(err) return next(err)
        const prMess =exercises.filter(ex=>ex.isPR===1).map(ex=>"New PR: "+ex.exerciseName+"("+ex.weight+"kg)")
        res.render("workoutResults.ejs",{username: req.session.username,sessionId,exercises,prMess})
    });
});


router.get('/chartData',redirectLogin,(req, res, next)=> {
    const userId = req.session.userId;
    const dataBase =  "SELECT exerciseName, COUNT(*) AS timesDone "+
        "FROM exercises e "+
        "JOIN workout w ON e.sessionId = w.id "+
        "WHERE w.userId = ? "+
        "GROUP BY exerciseName "
    
    db.query(dataBase,[userId],(err, results)=> {
        if(err) return next(err)
        const sets = results.map(r => r.timesDone)
        const labels =results.map(r => r.exerciseName)
        res.json({labels,sets })
    })
})

router.get('/charts', redirectLogin, (req, res, next)=> {
    const userId = req.session.userId;
    const dataChart = "SELECT e.exerciseName, COUNT(*) AS timesDone " +
        "FROM exercises e "+
        "JOIN workout w ON e.sessionId = w.id "+
        "WHERE w.userId = ? "+
        "GROUP BY e.exerciseName "
    
    const sqlPR ="SELECT e.exerciseName, MAX(e.weight) AS maxWeight "+
        "FROM exercises e "+
        "JOIN workout w ON e.sessionId = w.id "+
        "WHERE w.userId = ? "+
        "GROUP BY e.exerciseName "+
        "ORDER BY e.exerciseName "
    
    db.query(dataChart,[userId],(err, chartResults)=> {
        if(err) return next(err);
        const labels =chartResults.map(r => r.exerciseName)
        const sets =chartResults.map(r=>r.timesDone)
        db.query(sqlPR, [userId],(err, prResults)=> {
            if(err) return next(err)
            res.render("charts", {labels,sets,prList: prResults,sessionId:req.query.sessionId})
        })
    })
})



router.post('/startSession', redirectLogin, (req, res, next) => {
    const dataBase = "INSERT INTO workout (userId, startTime) VALUES (?, NOW())"
    db.query(dataBase, [req.session.userId], (err, result) => {
        if (err) return next(err)
        const sessionId = result.insertId
        req.session.currentSessionId = sessionId
        res.redirect("/usr/230/tracker/trackerLogger")
    });
});

router.post('/addExercise',redirectLogin,[check("sessionId").isInt({min: 1}).withMessage("ID not vaild").trim().escape(),check("exercise").trim().escape().notEmpty().withMessage("Exercise name is required"),
    check("weight").isFloat({gt: 0}).withMessage("weight cannot be a negative number").trim().escape(),check("reps").isInt({gt: 0}).withMessage("reps cannot be a negative number").trim().escape()
],(req,res, next)=>{
    const errors =validationResult(req)
    if (!errors.isEmpty()) {
        return res.render("tracker.ejs", {username: req.session.username,sessionId: req.body.sessionId,exercises: [], prMess: req.session.prMess || [],errors: errors.array()})
    }
    const exerciseName =req.sanitize(req.body.exercise.trim().toLowerCase())
    const numWeight =parseFloat(req.sanitize(req.body.weight))
    const numReps =parseInt(req.sanitize(req.body.reps), 10)
    const sessionId= req.sanitize(req.body.sessionId)
    const sqlMax = "SELECT MAX(e.weight) AS maxWeight " +
        "FROM exercises e "+
        "JOIN workout w ON e.sessionId = w.id "+
        "WHERE w.userId = ? AND e.exerciseName = ? "
    
    db.query(sqlMax,[req.session.userId,exerciseName],(err,results)=> {
        if (err) return next(err)
        const oldMax =results[0].maxWeight|| 0
        const isNewPR= numWeight>oldMax
        if(isNewPR) {
            if(!req.session.prMess)req.session.prMess= []
            req.session.prMess.push("New PR:" + exerciseName)
        }
        const InstertData="INSERT INTO exercises (sessionId,exerciseName, weight, reps, isPR) "+
            "VALUES (?, ?, ?, ?, ?) "
        
        db.query(InstertData,[sessionId,exerciseName, numWeight,numReps,isNewPR ?1 : 0],(err)=>{
            if (err) return next(err)
            res.redirect("/usr/230/tracker/trackerLogger")
        });
    });
});

router.post('/endSession',redirectLogin,(req,res, next)=> {
    const {sessionId}= req.body;
    const dataBase = "UPDATE workout SET endTime = NOW() WHERE id = ? "
    db.query(dataBase,[sessionId], (err, result)=> {
        if(err) return next(err)
        req.session.currentSessionId = null
        res.redirect("/tracker/workoutResults/" + sessionId)


    });
});

// Export the router object so index.js can access it
module.exports = router
