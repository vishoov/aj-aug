const router = require("express").Router();
const Product = require("../model/product.model");
const User = require("../model/user.model");
// Create product /createproduct


router.post("/createproduct", async (req, res)=>{
    try{
        const productinfo = req.body;
        const seller = productinfo.seller;
        //seller is the _id from user collection 

        const user = await User.findById({_id:seller});

        const userinfo = {
            name:user.name,
            contact:user.contact
        }

        const role = user.role;
        // 68b5b73f319ddc4abc1424f1
        if(role!=="seller"){
            return res.send("This user is not applicable to be used as a seller ")
        }

        const newProduct = new Product(productinfo);

        await newProduct.save();

        res.status(201).json({
            success:true,
            data:newProduct,
            seller:userinfo
        })
    }
    catch(err){
        res.status(500).json(err);
    }
})
// Fetch Product /product
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


// Update Product /updateProduct nithish
router.put('/updateproduct/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const updates = req.body;

      //validating that only seller can update the product
      if (updates.seller) {
        const user = await User.findById(updates.seller);
        if (!user || user.role !== 'seller') {
          return res.status(400).json({ message: 'Invalid seller' });
        }
      }
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updates,
        { new: true, runValidators: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }  
  });


// Delete Product /deleteProduct
router.delete('/deleteproduct/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(409).json({ success: false, message: "No Product Found" });
        }
        const deletedProduct = await Product.findByIdAndDelete(productId);
        res.status(200).json({success:true, message:"Product deleted Successfully", data:deletedProduct})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error:" + error });
    }
})

// Search /searchProduct
router.get("/searchproduct", async (req, res) => {

    try {

        const { search } = req.query;

        const product = await Product.find({

            $or: [
                //spelling mistakes can happen 
                { name: {
                    $regex:search, $options:'i'
                }

                 },
                 {
                    description:{
                        $regex:search, $options:'i'
                    }
                 },

                { category: {
                    $regex:search, $options:'i'
                } }

            ]

        })

        if (product.length === 0) {

            return res.status(409).json({ success: false, message: "No Products Found" });

        }

        res.status(200).json({ success: true, message: "Product Fetched Successfully", data: product })

    } catch (error) {

        console.log(error);

        res.status(500).json({ success: false, message: "Internal Server Error:" + error });

    }

})


module.exports = router;