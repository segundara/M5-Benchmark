const express = require("express")
const productsRoutes = require("./routes/products")
const reviewsRoutes = require("./routes/reviews")
const listEndpoints = require("express-list-endpoints")
const {checkReviewError} = require("./errorHandler")

const server = express()

const port = process.env.PORT || 3002

server.use(express.json())

// Routes
server.use("/products", productsRoutes)
server.use("/reviews", reviewsRoutes)
console.log(listEndpoints(server))
server.use(checkReviewError)

server.listen(port, () => {
    console.log(`Server is running on PORT:${port}`)
})