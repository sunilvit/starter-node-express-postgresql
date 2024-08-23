const productService = require("./products.service");
const e = require("express");

async function productExists(req, res, next) {
    const {productId} = req.params
    const product = await productService.read(productId)
    if (product) {
        res.locals.product = product;
        next();
    } else {
        next({
            status: 404,
            message: `Product id: ${productId} not Found!!`
        })
    }
}

async function list(req, res, next) {
    const data = await productService.list();
    res.json({data})
}

function read(req, res, next) {
    const {product: data} = res.locals;
    res.json({data});
}

async function listOutOfStockCount(req, res, next) {
    const data = await productService.listOutOfStockCount();
    res.json({data});
}

async function listPriceSummary(req, res, next) {
    const data = await productService.listPriceSummary();
    res.json({data});
}

async function listTotalWeightByProduct(req, res, next) {
    const data = await productService.listTotalWeightByProduct()

    res.json({data})
}

module.exports = {
    list,
    read: [
        productExists,
        read],
    listOutOfStockCount,
    listPriceSummary,
    listTotalWeightByProduct
}