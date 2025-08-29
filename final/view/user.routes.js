const router = require('express').Router();
const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const { createToken, authenticateToken } = require('../auth/jwt.auth');

router.get("/users", authenticateToken, async (req, res)=>{
    try{
        const users = await User.find();
        res.status(200).json({
            sucess:true,
            data:users
        })
    }catch(err){
        res.status(500).json(err);
    }
});

//signup
router.post("/signup", async (req, res) => {
    try {
        const userinfo = req.body;
    // checking if the user is already exsisting 
        const { email } = userinfo;
      const existingUser = await User.findOne({ email });  
      if (existingUser) {
  
        return res.status(400).json({ success: false, message: "User already exists" });

      }
         // createing new user
      const newUser = new User(userinfo);
      await newUser.save();
     
      res.status(201).json({ success: true, data: newUser });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });  
    }
  });



//login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await user.isPasswordMatch(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    //update the loggedinDevices array
    user.loggedInDevices.push(req.ip);
    await user.save();


    const token = await createToken({ userId: user._id, email: user.email });
    res.status(200).json({
      success: true,
      message: "Login successful",
    token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/logoutfromAll", async (req, res)=>{
    try{
        const { email }=req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({success:false, message:"User not found"});
        }

        user.loggedInDevices = [];
        await user.save();
        
        res.status(200).json({success:true, message:"Logged out from all devices"});
    }
    catch(err){
        res.status(500).json(err);
    }
})



//update password
//new old password as well
router.put("/update-password",async(req,res)=>{
    const {email,password, new_password}=req.body;
    try{

        

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        const isMatch = await user.isPasswordMatch(password);
        if(!isMatch){
            return res.status(401).json({success:false, message:"Invalid credentials"});
        }

        user.password = new_password;
        const updatedUser = await user.save();

          res.status(200).json({
                message: "User updated successfully",

              data: updatedUser  
        })
        }

      catch(err){  
        console.error("Error updating user:", err);
            res.status(500).json({

              message: "Internal server error",  
            error: err.message
            });

      }
  })

  router.get("/profile/:id", authenticateToken, async (req, res)=>{
    try{
        const userId = req.params.id;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({success:false, message:"User not found"});
        }

        res.status(200).json({success:true, data:user} );
    }
    catch(err){
        res.status(500).json(err);
    }
  })


module.exports = router;