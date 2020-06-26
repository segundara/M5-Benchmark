const express = require("express")
const productsRoutes = require("./routes/products")
const reviewsRoutes = require("./routes/reviews")
const listEndpoints = require("express-list-endpoints")

const server = express()

server.use(express.json())

// Routes
server.use("/products", productsRoutes)
server.use("/reviews", reviewsRoutes)
console.log(listEndpoints(server))

server.listen(3001, () => {
    console.log("Server is running on PORT:3001")
})