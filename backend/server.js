const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDb = require('./config/db')
const cors = require("cors");
const path = require('path')
const PORT = process.env.PORT || 8000

connectDb()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.use(cors());

app.use('/api/goals' , require('./routes/goalRoutes'))
app.use('/api/users' , require('./routes/userRoutes'))

app.use(errorHandler);

app.listen(PORT , () => {
    console.log(`Server running on Port : ${PORT}`)
})