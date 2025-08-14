

const signup = (req, res)=>{
    try{
    const user = req.body;
    console.log("User created:", user);
    res.status(201).json({
        message: "User created successfully",
        data: user
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

const users = [
    { 
        id: 1, 
        name: "John Doe",
        email: "johndoe@gmail.com",
        password: "password123",
        version: "1.0"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@gmail.com",
        password: "password456",
        version: "1.0"
    }
]


//get a specific user by id
const getUserByID = (req, res) => {
    const id = req.params.id;
    try {
        const user = user.find(user => user.id === id);
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