const User = require('../Model/user.model.js');

const signup = async (req, res)=>{
    try{
        const user = req.body;

        // const newUser = await User.create(user);
        //db.users.insertOne(user); -> create command 
        //this will insert the user into the database
        const newUser = new User(user); 

        await newUser.save(); //this will save the user to the database





    console.log("User created:", newUser);
    res.status(201).json({
        message: "User created successfully",
        data: newUser
    });
}
    catch(err){
        console.error("Error creating user:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}

const home = (req, res) => {
        res.json({
            message: "Welcome to the User Management System"
        })
    }



//get a specific user by id
const getUserByID = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.find(
            {
                _id:id
            }
        )
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "internal server error",
            error: err
        }
        )
    }
}


module.exports = {
    signup,
    home,
    getUserByID,
};