const router = require('express').Router();
const User = require('../model/users.model');
const xss = require('xss');


// GET /users: Retrieve a list of all users.
router.get("/users", async (req, res)=>{
    console.log("GET /users route invoked");
    const users = await User.find();
    res.json(users);
})

// GET /users/:id: Retrieve a specific user by ID.
router.get("/users/:id", async (req, res)=>{
    console.log("GET /users/:id route invoked");
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({error:"User not found"});
    }
    res.json(user);
})

// POST /users: Create a new user. Requires a JSON body with user data
router.post("/users", async (req, res)=>{
    console.log("POST /users route invoked");

    const {name, email, password, age, role} = req.body;

    const newUser = new User({name, email, password, age, role});
    await newUser.save();
    res.status(201).json(newUser);
})

//LOGIN user
router.post("/users/login", async (req, res)=>{
    console.log("POST /users/login route invoked");
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({error:"Email and password are required"});
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(404).json({error:"User not found"});
    }

    // if(user.password !== password){
    //     return res.status(401).json({error:"Invalid password"});
    // }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({error:"Invalid password"});
    }

    res.json({message:"Login successful", user});
}
)
// PUT /users/:id: Update an existing user by ID. Requires a JSON body with "name" and/or "email".
router.put("/users/:id", async (req, res)=>{
    console.log("put /users/:id route invoked");

    const {
        name, email, password, age, role
    } = req.body;

    const updatedUser  = await User.findByIdAndUpdate(
        req.params.id,
        {
            name,
            email,
            password,
            age,
            role
        },
        {
            new:true,
            runValidators:true
        }
    );

    if(!updatedUser){
        return res.status(404).json({error:"User not found"});
    }

    res.json(updatedUser);
})


// DELETE /users/:id: Delete a user by ID.
router.delete("/users/:id", async (req, res)=>{
    console.log("DELETE  /users/:id route invoked");

    const userId = req.params.id;

    // Validate userId format
    if(typeof userId === 'undefined' || userId.length !== 24){
        return res.status(400).json({error:"Invalid user ID format"});
    }


    const deletedUser = await User.findByIdAndDelete(userId);

    if(!deletedUser){
        return res.status(404).json({error:"User not found"});
    }

    res.json({message:"User deleted successfully"});
})


router.get("/weakRoute", async (req, res)=>{
    const userName = req.query.name;

    userName = xss(userName); // Sanitize user input to prevent XSS
    res.send(`Hello, ${userName}`); // Potential XSS vulnerability if userName is not sanitized
})


module.exports = router;
