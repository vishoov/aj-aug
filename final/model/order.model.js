const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Id:string,
    // userID:string,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
                // required:true
            },
            quantity:{
                type:Number,
                // required:true,
                min:1
            },
            price:{
                type:Number,
                // required:true,
                min:0
            }
        }
    ],
    // Items:[{
    // 	productID:string,
    // 	Quantity:number,
    // 	Price:number
    // }]
    totalAmount:{
        type:Number,
        // required:true,
        min:0
    },
    // 	totalAmount:Number,
    shippingAddress:{
        type:String,
        // required:true,
        trim:true
    },
    status:{
        type:String,
        enum:['Pending','Shipped','Delivered','Cancelled'],
        default:'Pending'
    }
    // 	shippingAddress:String,
    // 	Status:string,

})


const Order = mongoose.model("Order", orderSchema);


module.exports = Order;
