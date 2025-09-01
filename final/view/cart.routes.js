const Cart = require("../model/cart.model");
const router = require('express').Router();
const Product = require('../model/product.model')


router.post('/addtocart', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate quantity is a positive number
        if (quantity <= 0) {
            return res.status(400).json({ error: "Quantity must be greater than 0" });
        }

        // Check if the cart already exists for the user
        let cart = await Cart.findOne({ userId });

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const price = product.sellingprice;

        // Validate price is a valid number
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ error: "Invalid product price" });
        }

        if (!cart) {
            // If the cart doesn't exist, create a new cart
            cart = new Cart({
                userID:userId,
                products: [{
                    productId,
                    price,
                    quantity
                }],
                totalAmount: price * quantity
            });

            await cart.save();
        } else {
            // If the cart exists, check if the product already exists in the cart
            const existingProduct = cart.products.find(item => 
                item.productId.toString() === productId
            );

            if (existingProduct) {
                // Update existing product quantity
                existingProduct.quantity += quantity;
                cart.totalAmount += price * quantity;
            } else {
                // Add new product to cart
                cart.products.push({
                    productId,
                    price,
                    quantity
                });
                cart.totalAmount += price * quantity;
            }

            await cart.save();
        }

        res.status(200).json({
            message: "Product added to cart successfully",
            cart: cart
        });

    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).json({ 
            error: err.message || "Internal Server Error" 
        });
    }
})

// Delete From Cart
router.delete("/delete", async (req, res) => {
    try {
        const { userID, productId } = req.body; // Changed from cartId to userID to match schema

        // Input validation
        if (!userID) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        // Find the cart by userID (matching your schema)
        const cart = await Cart.findOne({ userID }); // Fixed: use findOne with userID
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Find product in cart
        const productIndex = cart.products.findIndex(
            item => item.productId.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        // Get the product details from cart (not from Product collection)
        const cartProduct = cart.products[productIndex];

        // Remove product from cart
        cart.products.splice(productIndex, 1);

        // Recalculate total amount
        cart.totalAmount = cart.products.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        // Save cart
        await cart.save();

        // Populate product details for response
        await cart.populate({
            path: 'products.productId',
            select: 'name price image category'
        });

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            cart: cart,
            deletedProduct: {
                productId: cartProduct.productId,
                quantity: cartProduct.quantity,
                price: cartProduct.price
            }
        });

    } catch (err) {
        console.error('Delete from cart error:', err);
        res.status(500).json({
            success: false,
            message: "Error deleting product from cart",
            error: err.message
        });
    }
});


router.get("/cart", async (req, res)=>{
    try{
        const carts = await Cart.find();

        res.status(200).json({
                sucess:true,
                data:{
                    carts
                }
        })
    }
    catch(err){
        res.send("err");
    }
})

module.exports = router;