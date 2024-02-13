/**
 * Here we are trying to populate our existing
 * data people.js to our connected DB
 */

// 1 - Declare evn configuration
require('dotenv').config()

// 2 - Connect to DB
const connectDB = require('./db/connect')

// 3 - Get the product model
const Product = require('./models/Product')

// 4 - get the product json
const jsonProducts = require('./products.json')


// 5 - Upload product json to DB
const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI)
        await Product.deleteMany()
        await Product.create(jsonProducts)
        console.info(">>> Success!!!")
        process.exit(0)
    } catch (error) {
        console.log(error)
    }
}

start()