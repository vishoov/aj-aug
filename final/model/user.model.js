const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    // Id:string,
    //default id will be created by mongoDB

    name:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    },
    // Name:string,
    age:{
        type:Number,
        required:true,
        min:10,
        max:100
    },
    
    // Age:number,
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate:{
            validator:function(v){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message:props=>`${props.value} is not a valid email`
        }
    },
    // Email:string,
    address:{
        firstLine:{
            type:String,
            required:false,
            trim:true,
            maxLength:100
        },
        city:{
            type:String,
            required:false,
            trim:true,
            maxLength:50
        },
        state:{
            type:String,
            required:false,

        },
        pinCode:{
            type:Number,
            required:false,
            min:100000,
            max:999999
        }
    },
    // Address:string,
    contact:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:function(v){
                return /^\d{10}$/.test(v);
            },
            message:props=>`${props.value} is not a valid contact number`
        }
    },
    // Contact:number,
    role:{
        type:String,
        enum:["user", "admin", "super-admin", "guest", "seller"],
        default:"user",
        required:true,
        trim:true,
        lowercase:true
    },
    // Role:”user”, “admin”, -> role based authentication 
    password:{
        type:String,
        required:true,
        minLength:6,
        validate:{
            validator:function(v){
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(v);
            }
        }
    },
    loggedInDevices:{
        type:[String],
        default:[]
    }
    // Password:string

}, {
    timestamps:true
})

//password encryption service
userSchema.pre("save", async function(next){
    try{
        const user = this;
        //this refers to the current document being saved

        if(!user.isModified("password")){
            return next();
        }
        //genSalt -> generate a Salt -> salt + password and it will be mixed 10 times and then hashed
        // const salt = await bcrypt.genSalt(10);
        const salt = "$2b$10$CwTycUXWue0Thq9StjUM0u"; //default salt

        const encryptedPassword = await bcrypt.hash(user.password, salt);
        user.password= encryptedPassword;
        next();
    }
    catch(err){
        next(err);
    }
});

//password checking method in the model
userSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password, this.password);
}


const User= mongoose.model("User", userSchema);

module.exports= User;

