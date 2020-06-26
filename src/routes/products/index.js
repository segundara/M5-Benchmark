const express = require("express")
const fs = require("fs-extra")
const path = require("path")
const uniqid = require("uniqid")
const multer = require("multer")

const router = express.Router()
const upload = multer()
const port = process.env.PORT || 3003

const productsPath = path.join(__dirname, "products.json")
const imagePath = path.join(__dirname, "../../public/img/products")

const getProducts = () => {
    const buffer = fs.readFileSync(productsPath)
    const products = JSON.parse(buffer)
    return products
}
router.get("/", (req, res, next) => {
    const products = getProducts()
    if (products.length > 0) {
        res.status(200).send(products)
    } else {
        const err = new Error()
        err.message = "We dont have products yet!"
        err.httpStatusCode = 404
        next(err)
    }
})
router.get("/:id", (req, res, next) => {
    const products = getProducts()
    if (products.length > 0) {
        const specificProduct = products.filter(product => product.id === req.params.id)

        if (specificProduct.length > 0) {
            res.status(200).send(specificProduct)
        } else {
            const err = new Error()
            err.message = "We dont have any product with that ID!"
            err.httpStatusCode = 404
            next(err)
        }

    } else {
        const err = new Error()
        err.message = "We dont have products yet!"
        err.httpStatusCode = 404
        next(err)
    }

})
router.post("/", async (req, res, next) => {
    const newProduct = {
        id: uniqid(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    const products = getProducts()
    products.push(newProduct)

    await fs.writeJSON(productsPath, products)

    res.status(201).send(products)
})

router.post("/:id/upload", upload.single("product"), async (req, res, next) => {

    await fs.writeFile(path.join(imagePath, `${req.params.id}.png`), req.file.buffer)
    const products = getProducts()
    const specificProduct = products.filter(product => product.id === req.params.id)
    const productsWithoutSP = products.filter(product => product.id !== req.params.id)

    if (specificProduct.length > 0) {
        const addProductPhoto = specificProduct[0]
        addProductPhoto.imageUrl = `http://127.0.0.1:${port}/img/products/${req.params.id}.png`

        productsWithoutSP.push(addProductPhoto)

        await fs.writeJSON(productsPath, productsWithoutSP)

        res.status(200).send(productsWithoutSP)
    } else {
        const err = new Error()
        err.message = "We dont have any product with that ID!"
        err.httpStatusCode = 404
        next(err)
    }

})

router.put("/:id", async (req, res, next) => {
    const products = getProducts()
    if (products.length > 0) {
        const specificProduct = products.filter(product => product.id === req.params.id)
        const productsWithoutSP = products.filter(product => product.id !== req.params.id)

        if (specificProduct.length > 0) {

            const editedProduct = {
                id: req.params.id,
                ...req.body,
                createdAt: specificProduct[0].createdAt,
                updatedAt: new Date()
            }
            productsWithoutSP.push(editedProduct)
            console.log(productsWithoutSP)
            await fs.writeJSON(productsPath, productsWithoutSP)
            res.status(200).send(editedProduct)
        } else {
            const err = new Error()
            err.message = "We dont have any product with that ID!"
            err.httpStatusCode = 404
            next(err)
        }

    } else {
        const err = new Error()
        err.message = "We dont have products yet!"
        err.httpStatusCode = 404
        next(err)
    }

})
router.delete("/:id", async (req, res, next) => {
    const products = getProducts()
    if (products.length > 0) {
        const specificProduct = products.filter(product => product.id === req.params.id)
        const productsWithoutSP = products.filter(product => product.id !== req.params.id)

        if (specificProduct.length > 0) {
            await fs.writeJSON(productsPath, productsWithoutSP)
            res.status(200).send("The product got deleted from the server!")
        } else {
            const err = new Error()
            err.message = "We dont have any product with that ID!"
            err.httpStatusCode = 404
            next(err)
        }

    } else {
        const err = new Error()
        err.message = "We dont have products yet!"
        err.httpStatusCode = 404
        next(err)
    }

})

module.exports = router