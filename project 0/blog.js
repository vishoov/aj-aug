//Blog Management Api
//Static Data on the server only 

//blog management api 
//Routes ->
//Create a blog 
//Read a blog
//Update a blog
//Delete a blog

//CRUD operations 
//Create, Read, Update, Delete

const express = require("express");
const app = express();

app.use(express.json()); //middleware to parse JSON bodies

//Root Route -> like home page of a website
//localhost:3000/
app.get("/", (req, res)=>{
    res.sendFile(__dirname+ "/blog.html");
})

//Dummy Data for the blogs for alternative to database
//This data will be used to simulate a blog management system
const blogs = [
    {
        id:1,
        title:"Blog 1",
        content:"This is the content of blog 1",
        date:"2023-10-01",
        author:"Author 1",
        version:"1",
        tags:["technology", "news"]
    },
    {
        id:2,
        title:"Blog 2",
        content:"This is the content of blog 2",
        date:"2023-10-02",
        author:"Author 2",
        version:"1",
        tags:["lifestyle", "health"]
    },
    {
        id:3,
        title:"Blog 3",
        content:"This is the content of blog 3",
        date:"2023-10-03",
        author:"Author 3",
        version:"1",
        tags:["travel", "adventure"]
    },
    {
        id:4,
        title:"Blog 4",
        content:"This is the content of blog 4",
        date:"2023-10-04",
        author:"Author 4",
        version:"1",
        tags:["food", "cooking"]
    }
]
//middleware 
app.use((req, res, next)=>{
    console.log("Recieved a request")
    next(); //next keyword -> it tells the server to move to the next middleware or route handler
})

app.use((req, res, next)=>{
    console.log('2nd middleware executed');
    next();
})

//Custom middleware 
//Logging middleware -> to log the request method and URL
app.use((req, res, next)=>{
    const method = req.method;
    const url = req.url;
    const time = new Date().toLocaleString();

    console.log(`[${time}]: ${method} request to ${url}`);

    next();
})



//-----------Routes for blog management-------------------

// GET /blogs - Retrieve all blogs
// app.method(Path, handlerfunction)
app.get("/blogs", (req, res)=>{
    console.log("Fetching all blogs");
    //res
    res.status(200).json({
        message:"All blogs retrieved successfully",
        data:blogs
    })
})

// GET /blogs/:id - Retrieve a blog by ID
//:id is a route parameter
//find in the blogs array by id 
app.get("/blogs/:id", (req, res)=>{

    const id = parseInt(req.params.id);

    const blog = blogs.find(b=>b.id===id);

    if(!blog){
        return res.status(404).json({
            message:"Blog not found"
        })
    }

    res.status(200).json({
        message:"Blog retrieved successfully",
        data:blog
    })

})


const createmiddleware = (req, res, next)=>{
    console.log("Create middleware executed");

    console.log("Request body:", req.body);

    next()
}

// POST /create - Create a new blog
//create a blog
//add the blog to the blogs array 
//id will be auto incremented
//id=blogs.length+1
app.post("/create", createmiddleware, (req, res)=>{
    const blog = req.body;
   
    const newBlog = {
        id: blogs.length + 1,
        title: blog.title || "Untitled",
        content: blog.content || "No content provided",
        date: new Date().toISOString().split('T')[0], // current date in YYYY-MM-DD format
        author: blog.author || "Anonymous",
        version: "1.0",// default version
        tags: blog.tags || [] // default empty tags
    }

    blogs.push(newBlog);

    res.status(201).json({
        message:"Blog created successfully",
        data:newBlog
    })
})



// PUT /blogs/:id - Update a blog by ID
app.put("/blogs/:id", (req, res)=>{
    const id = parseInt(req.params.id);

    // Find the blog to update
    const blogIndex = blogs.findIndex(b => b.id === id);

    //handle the error if blog not found
    if(blogIndex===-1){
        return res.status(404).json({
            message:"Blog not found"
        })
    }

    // Update the blog
    let version = blogs[blogIndex].version;
    version = parseInt(version)+1;
    const updatedBlog = {
        ...blogs[blogIndex],
        ...req.body, // merge the existing blog with the new data
        version: version.toString() // update the version
    }

    blogs[blogIndex] = updatedBlog;

    res.status(200).json({
        message:"Blog updated successfully",
        data:updatedBlog
    })
})


// DELETE /blogs/:id - Delete a blog by ID
app.delete("/blogs/:id", (req, res)=>{

    const id = parseInt(req.params.id);

    //find the blog to delete
    const blogIndex = blogs.findIndex(b => b.id === id);

    //handle the error if blog not found
    if(blogIndex===-1){
        return res.status(404).json({
            message:"Blog not found"
        })
    }


    //delete the blog
    blogs.splice(blogIndex, 1);

    res.status(200).json({
        message:"Blog deleted successfully"
    })
})



// GET /query - Query blogs with search parameters
app.get("/query", (req, res)=>{
    const search = req.query.search;

    const filteredblogs = blogs.filter(blogs=>{
        return blogs.title.toLowerCase().includes(search.toLowerCase()) ||
               blogs.content.toLowerCase().includes(search.toLowerCase()) ||
               blogs.author.toLowerCase().includes(search.toLowerCase()) ||
               blogs.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    })

    if(filteredblogs.length === 0){
        return res.status(404).json({
            message:"No blogs found"
        })
    }

    res.status(200).json({
        message:"Blogs retrieved successfully",
        data:filteredblogs
    })
})  
//-------------Routes end here ----------------------------

app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})