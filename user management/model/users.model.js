const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) { // Fixed typo here
                // Regex for email validation
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128
        // select: false // Uncommented this to exclude password from queries
    },
    age: {
        type: Number,
        min: 18,
        max: 120,
        default: 18
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user'
    }
});

//middleware to hash or encrypt password before saving to db
//middleware between schema and db
userSchema.pre('save', async function (next) {
    //middleware logic to hash password
    //object oriented programming 
    const user = this; //refers to the current user document being saved

    if (!user.isModified('password')) return next(); //only hash if password is modified or new

    const hashedPassword = await bcrypt.hash(user.password, 10); //salt rounds = 10
    //salt rounds-> number of times that the password is processed through the hashing algorithm
    //hashing algorithm-> mathematical function that converts input data into a fixed-size string of characters, which is typically a sequence of numbers and letters
    //password + salt -> hashing algorithm -> hashed password
    //hashed password is a long string of characters that is not human-readable

    user.password = hashedPassword;
    next();
})


userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;
