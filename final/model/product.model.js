const mongoose = require("mongoose");

const productSchema=new mongoose.Schema({
    name:{  
      type:String,
      minlength:3,
      maxlength:100,
  
      trim:true,
  
      required:true
  
    },
  
    description:{
  
      type:String,
  
      minlength:3,
  
      maxlength:1000,
  
      trim:true,
  
      required:true
  
    },
  
    costprice:{
  
      type:Number,  
      required:true,
      min:0,
      max:1000000
    },
  
    sellingprice:{
  
      type:Number,
        min:0,
        max:1000000,
  
      required:true
  
    },
  
    category:{
    type:String,
      enum:['electronics','fashion','clothes','sports', 'home', 'beauty', 'miscellaneous'],
      required:true,
      default:'miscellaneous'
  
    },
  
    stock:{
  
      type:Number,
  
        min:0,
  
        max:1000,
  
      required:true
  
    },
    images:{
        type:[String],
        required:false

    }
  }, {
    timestamps:true
  })

const Product = mongoose.model("Product", productSchema);

module.exports = Product;