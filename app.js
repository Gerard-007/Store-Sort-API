// 01 - Setting env variables
require('dotenv').config()

require('express-async-errors')


// 02 - Create an app
const express = require('express');
const app = express();


// 03 - Connecting to DB here...
const connectDB = require('./db/connect')


// 04 - json middleware
app.use(express.json())


// 05 - routes
app.get('/', (req, res) => {
    res.send("<h1>Store Api</h1>")
})

const productRouter = require('./routes/product_route')
app.use('/api/v1/products', productRouter)


// 06 - Error middlewares
const notFoundMiddleware = require('./middleware/not-found')
app.use(notFoundMiddleware)

const errorHandlerMiddleware = require('./middleware/error-handler')
app.use(errorHandlerMiddleware)


// 07 - port number
const port = process.env.PORT || 3000


// 08 - checking for db connection and listening to connections
const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI)
        app.listen(port, console.log(`Server is listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()