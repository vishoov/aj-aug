const express = require("express");
//import statement 

const app = express();
//create an express app that will be live to build the api and hence the features

app.use(express.json());

//routes for our application 
// document.addEventListener("click", ()=>{})
app.get("/helloworld", (req, res)=>{
    //req is an object that is created by express that contains the data present in the body of the request that we have recieved 
    //req stands for request
    //res stands for response 
    //json -> headers, body 
    //req -> json 
    const greeting = req.body;


    console.log(greeting)
    res.send("Hello")

}
)



app.get("/path", (req, res)=>{

    //url or the path of the route 
    const url = req.url;
    const path = req.path;
    const baseURL = req.baseUrl;
    const protocol = req.protocol;
    const secure = req.secure; //boolean value that tells us if https is enabled or not
    console.log("URL", url)
    console.log("Path", path)
    console.log("baseURL", baseURL)
    console.log("protocol", protocol)
    console.log("security", secure)


    res.send("okay")

});

//data info

app.get("/data", (req, res)=>{
    const body = req.body;
    const headers = req.headers;
    const cookies = req.cookies;

    console.log("body", body);
    console.log("headers", headers);
    console.log("cookies", cookies);
    res.send("data")
})

app.get("/types", (req, res)=>{
    const method = req.method;
    const fresh = req.fresh;
    const stale = req.stale;

    console.log("method", method);
    console.log("fresh", fresh);
    console.log("stale", stale);
    res.send("done")
})

app.get("/ip", (req, res)=>{
    const ip = req.ip;
    const ips = req.ips;
    const subdomains = req.subdomains;


    console.log("ip", ip);
    console.log("ips", ips);
    console.log("subdomains", subdomains);

    res.send("ok")
})

app.get("/res", (req, res)=>{
    // res.send this method sends a text line 
    // res.json({
    //     message:"Hello world",
    //     value:"This is a json file"
    // })

    res.status(404).sendFile(__dirname+ "/notes.txt");


    //network codes 

})


//Dynamic Routing 
//for whatever route i am calling the URL, the data will be specific to that

//route parameters -> pages 
app.get("/product/:id", (req, res)=>{
    const id = req.params.id;
    console.log(id);

    res.send("done")

})

//query parameters 
app.get("/query", (req, res)=>{
    const search = req.query.search;
    const age = req.query.age;
    console.log(search)
    console.log(age)
    res.send("done")
})

const PORT = 3000;

//write a port listener 
app.listen(PORT, ()=>{
    console.log("The server is live on port 3000")
})