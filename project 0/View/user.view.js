
const express = require("express");
const router = express.Router();
//Router is used to create modular, mountable route handlers
//modular-> it can be used in different parts of the application
//mountable -> it can be mounted on a specific path
const { signup, home, getUserByID } = require("../Controller/user.controller.js"); //importing the signup function from the controller

router.post("/create-user", signup); //this imports the signup function from the controller and mounts it on the /create-user path
router.get("/home", home); //this imports the home function from the controller and mounts it on the /home path
router.get("/users/:id", getUserByID); 


router.get("/", home)

module.exports = router;