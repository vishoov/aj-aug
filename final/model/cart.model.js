
// Id:string,
// userID:string,
// Products:[{
// productId: string,
// Price:number,
// quantity:number	
// }],
// totalAmount:number
const mongoose = require('mongoose');

 

const cartSchema = new mongoose.Schema({

  userID: {

    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true

  },
  products: [

    {

      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },

      price: {
        type: Number,
        required: true,
        min: 0
      },

      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],

  totalAmount: {
    type: Number,
    required: true,
    min: 0
  }

}, {
  timestamps: true

});

 

const Cart = mongoose.model('Cart', cartSchema);

 

module.exports = Cart;