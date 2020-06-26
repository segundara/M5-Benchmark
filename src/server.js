const express = require("express")
const productsRoutes = require("../routes/products")
const reviewsRoutes = require("../routes/reviews")

const server = express()

server.use("/products", productsRoutes)
server.use("/reviews", reviewsRoutes)


server.listen(3001, () => {
    console.log("Server is running on PORT:3001")
})