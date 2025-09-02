const router = require('express').Router();
const Order= require('../model/order.model');
const Cart = require('../model/cart.model');
const Product = require('../model/product.model');
const User = require('../model/user.model');

// Place Order
router.post("/placeOrder", async (req, res) => {
    try {
      
        const { userId, products, shippingAddress } = req.body;
        if (!userId || !products || products.length === 0 || !shippingAddress) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findById(userId);
        console.log(user)

        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const order = new Order({
            userId,
            items: products,
            totalAmount: products.reduce((total, item) => total + (item.price * item.quantity), 0),
            shippingAddress
        })

        console.log(order)


        await order.save();

        res.status(201).json({
            success:true,
            data:order
        })

    
    } catch (err) {
        console.error("Error placing order:", err);
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
});


// Cancel Order
//put route 
router.put("/cancelOrder/:id", async (req, res)=>{
    try{
        const orderId = req.params.id;

        const order = await Order.findById(orderId);

        if(!order){
            return res.status(404).json({success:false, message:"Order not found"});
        }

        if(order.status==='Cancelled'){
            return res.status(400).json({
                success:false,
                message:"Order is already cancelled"

            })
        }
        
        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({success:true, message:"Order cancelled successfully", data:order} );
    }
    catch(err){
        console.error("Error cancelling order:", err);  
        res.status(500).json({success:false, message:"Internal server error", error:err.message});
    }
})

// Track
//get route 
router.get("/trackOrder/:id", async (req, res)=>{
    try{
        const id = req.params.id;

        const order= await Order.findOne({_id:id});

        console.log(order);

        const status = order.status;

        res.send(status)

    }
    catch(err){
        res.send(err.message);
    }
})



module.exports = router;
