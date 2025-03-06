const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`Mongodb connected: ${conn.connection.host}`.cyan)
    } catch (error) {
        console.log("mongodb connection error : " + error.red)
        process.exit(1)
    }
}

module.exports = connectDb