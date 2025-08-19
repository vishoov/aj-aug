const mongoose = require('mongoose');

//create a user schema -
// A schema defines the structure of the documents in a collection
const userSchema = new mongoose.Schema({
    // Define the fields in the user schema
    //these are the fields that will be stored in the database
    //validate the fields using mongoose validators
    //name, email, password and role 
    name:{
        type:String, //this is the type of data that will be stored in this field 
        required:true, //this field is required
        trim:true,  //remove any whitespace from the beginning and end of the string
        minLength: [3, "Please enter a longer name"], //minimum length of the string
        maxLength: [50, "Please enter a smaller name"] //maximum length of the string
    }, 
    email:{
        type:String,
        required:true,
        unique:true, //only one user can have this email
        trim:true,
        lowercase:true, //convert the email to lowercase ABC@gmail.com -> abc@gmail.com
        //validate the email using a regex pattern 
        //name@provider.com or name@provider.org or name@provider.in
        //invalid email -> @gmail.com or abc@.com or abc@gmail or abc@gmail.c
        validate:{
            validator: function(v){
                //custom rules
                const length = v.length;
                if(length<5 || length>100){
                    return false; //invalid email
                }
                const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return regex.test(v); //returns true if the email matches the regex pattern
            },
            message: props => `${props.value} is not a valid email address!`
        },
        minLength: [5, "Please enter a longer email"],
        maxLength: [100, "Please enter a smaller email"]

    },
    password:{
        type:String,
        required:true,
        minLength: [6, "Please enter a longer password"],
        maxLength: [20, "Please enter a smaller password"]
    },
    age:{
        type:Number,
        min: [0, "Age cannot be negative"],
        max: [120, "Age cannot be more than 120"]
    },
    role:{
        type:String,
        //enum -> this field can only have these values
        //role can be either user or admin or superadmin or guest
        enum:["user", "admin", "superadmin", "guest"],
        default:"user" //default role is user
    }
},
{
    timestamps:true //this will add createdAt and updatedAt fields to the schema
});


//create a user model
//A model is a class that is used to create and read documents from the collection
//we are implementing a kind of object-oriented programming here

const User = mongoose.model("User", userSchema);

//export the user model
module.exports = User;