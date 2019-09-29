const express = require('express')
const log = require('morgan')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const port = 3001

app.use(cors())
app.use(log('dev'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: false
}))

mongoose.connect('mongodb://localhost:27017/olshop',{ useNewUrlParser: true, useUnifiedTopology: true },(err,db) => {
    if(err){
        return err
    }else{
        console.log('Connected')
    }
})

app.use('/',require('./routes/routes'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))