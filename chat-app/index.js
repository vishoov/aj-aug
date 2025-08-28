const express = require('express');
const app = express();

//1. how do we do an http handshake to upgrade to websocket protocol
const http = require('http');
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('Welcome to the Chat App!');
});


//2. CORS -> Cross Origin Resource Sharing -> another security layer for browsers
const cors = require('cors');

const corsOptions = {
    origin:"*", //any device can access this server
    methods:["GET","POST"],
    allowedHeaders:["Content-Type"],
    credentials:true    
}



//3. socket.io server setup
const { Server } = require("socket.io");
//the name of the server is going to be io 
const io = new Server(
    server, //1st argument is the server
    {
        cors:corsOptions
    }
)

//4. socket.io connection

//on -> we are recieving something 
//emit -> we are sending something

//event listener for connection event 
//js document.addEventListener('DOMContentLoaded', ()=>{})
io.on('connection', (socket)=>{
    console.log("A new connected added", socket.id);

    //5. listening to the message event from the frontend
    socket.on("message", (data)=>{
        console.log("Message received from the frontend: ", data);
        //6. broadcasting the message to all the connected clients except the sender
        const reciever = data.reciever;
        io.to(reciever).emit("message", data);
        //broadcast will send the message to all the connected clients except the sender
        // .to(socket.id)-> will send the message to a specific client
    })

    socket.on("typing", (data)=>{
       //setTimeout for handling the typing event
        socket.broadcast.emit("typing", data);
        //if the typing has stopped for 2 seconds, then emit the stop-typing event
        setTimeout(()=>{
            socket.broadcast.emit("stop-typing", {id:socket.id, message:"stopped typing"});
        }, 2000);
    })

    //listening to the join-room event from the frontend
    socket.on("join-room", (roomID)=>{
        console.log("Joining Room: ", roomID);

        //socket.join will add the socket to a specific room
        socket.join(roomID);

        //broadcasting to all the clients in the room except the sender
        socket.to(roomID).emit("user-connected", socket.id);
    })

    //event listener for disconnection event
    socket.on("disconnect", ()=>{
        console.log("A user disconnected", socket.id);
        socket.broadcast.emit("user-disconnected", socket.id);
    })

})


server.listen(3000, () => {
  console.log('Chat app listening on port 3000');
});

