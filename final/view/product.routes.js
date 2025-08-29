const router = require("express").Router();
const Product = require("../model/product.model");

router.post("/products", async (req, res)=>{
    try{
        const productinfo = req.body;

        const newProduct = new Product(productinfo);

        await newProduct.save();

        res.status(201).json({
            success:true,
            data:newProduct
        })
    }
    catch(err){
        res.status(500).json(err);
    }
})

router.get('/products', async (req, res)=>{
    try{
        const products = await Product.find();
        res.status(200).json({
            success:true,
            data:products
        })
    }
    catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;