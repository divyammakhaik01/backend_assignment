require("dotenv").config();

const express = require('express')
const app = express();

// database path

const db = require('./config/db')

// routes path

const auth = require('./routes/auth');
const theater = require('./routes/theater');

app.use(express.json());



const PORT = 8080 || process.env.PORT;


app.use('/api' ,  auth) ;
app.use('/api' , theater) ;






app.get('/' , (req , res) =>{
    return res.json({
        "result" : "true",
    })
})





app.listen(PORT , () =>{
    console.log(`server is running at port ${PORT}`) ;
    db() ;
})
