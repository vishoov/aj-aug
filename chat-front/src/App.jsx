import React from 'react'
import './App.css'
import { useEffect, useMemo, useState } from 'react'
//1. install socket.io-client
//2. import io from socket.io-client
import { io } from "socket.io-client";
const App = () => {
//3. connect to the backend server using io function
  const [socketID, setSocketID] = useState(null);
  const [messages, setMessages] = useState([]);

  const joinRoom = (e)=>{
    e.preventDefault();

    const roomID = e.target[0].value;

    socket.emit("join-room", roomID);
    e.target[0].value = "";
  }
  const [isTyping, setIsTyping] = useState(false);
  const socket = useMemo(() => io("http://localhost:3000"), []);


  useEffect(()=>{
    //4. connection event listener
    socket.on("connect", ()=>{
      setSocketID(socket.id);
      console.log("connected to the backend with id: ", socket.id)
    })

    socket.on("user-connected", (id)=>{
      console.log("A new user connected with id: ", id);
      setMessages((prev)=>[...prev, `User connected: ${id}`]);
    })

    //disconnection event listener
    socket.on("disconnect", ()=>{
      console.log("disconnected from the backend");
    })

    socket.on("typing", (data)=>{
      console.log("User typing: ", data);

      setMessages((prev)=>[...prev, `User typing: ${data.id}`]);
    })

    socket.on("stop-typing", (data)=>{
      console.log("User stopped typing: ", data);
      setMessages((prev)=>[...prev, `User stopped typing: ${data.id}`]);
    })

    //listening to the message event from the backend
    socket.on("message", (data)=>{
      console.log("Message received from the backend: ", data.message, " from ", data.id);
      setMessages((prev)=>[...prev, data.message]);
  })
  }, [socket]);

  const startTyping = (e)=>{
    e.preventDefault();
    setIsTyping(true);

    //6. emitting typing event to the backend
if(isTyping){
      return;
}else{
    socket.emit("typing", {id:socketID, message:"typing..."});
}
  setTimeout(()=>{
    setIsTyping(false);
    //emitting stop-typing event to the backend
    socket.emit("stop-typing", {id:socketID, message:"stopped typing"});
  }, 2000);

  }



  const onSubmit = (e) =>{
    e.preventDefault();
    const message = e.target[0].value;
    const reciever = e.target[1].value;

    const data = {
      id:socketID,
      message:message,
      reciever:reciever
    }
    //5. emitting an event from the frontend to the backend
    socket.emit("message", data);
    //this will send the message to the whole server including the sender
    e.target[0].value = "";
  }

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 style={{ color: "#4CAF50", fontSize: "2.5rem" }}>Chat Application Frontend</h1>
      <h2>{socketID}</h2>

      <form onSubmit={onSubmit} style={{ marginTop: "20px", display: "inline-block" }}>
        <input 
          onKeyDown={startTyping}
          type="text" 
          placeholder="Enter Message" 
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
            width: "250px",
            marginRight: "10px",
            fontSize: "1rem"
          }} 
        />
        <input 
          type="text" 
          placeholder="Enter Reciever ID" 
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
            width: "250px",
            marginRight: "10px",
            fontSize: "1rem"
          }}
          />
        <button 
          type="submit" 
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "10px 20px",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </form>

      <form onSubmit={joinRoom} style={{ marginTop: "20px", display: "inline-block" }}>
        <input 
          type="text" 
          placeholder="Enter Room ID" 
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
            width: "250px",
            marginRight: "10px",
            fontSize: "1rem"
          }} 
        />
        
        <button 
          type="submit" 
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "10px 20px",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          Join Room
        </button>
      </form>

         
      <div style={{ marginTop: "30px", textAlign: "left", display: "inline-block", width: "300px" }}>
        <h3 style={{ borderBottom: "2px solid #4CAF50", paddingBottom: "10px" }}>Messages:</h3>
        <ul style={{listStyleType:'none', padding:0}}>
          {messages.map((msg, index)=>{
            return <li key = {index} style={{backgroundColor:'#f1f1f1', marginBottom:'10px', padding:'10px', borderRadius:'4px'}}>{msg}</li>
          })}
        </ul>
          </div>

    </div>
  )
  
}



export default App