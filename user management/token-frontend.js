//example api usage for authentication with jwt token
//here we'll understand how a token, when recieved from the server, can be stored in the frontend and used for subsequent requests to protected routes

//we'll be using fetch api to make requests to the server

async function registerUser(name, email, password, age, role){
    const url = "http://localhost:3000/users";

    try{
        const response = await fetch(url, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({name, email, password, age, role})
        })

        if(!response.ok){
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("User registered successfully:", data);

        const token = data.token;

        //store the token in localStorage
        localStorage.setItem("authToken", token);
        console.log("Token stored in localStorage:", token);

    }
    catch(err){
        console.error("Error registering user:", err);
    }
}

//fetch users from protected route
async function protectedRouteCall(){
    const url = "http://localhost:3000/users";

    try{
        //first find the token from localStorage
        const token = localStorage.getItem("authToken");

        if(!token){
            throw new Error("No auth token found. Please login first.");
        }

        const response = await fetch(url, {
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}` //include the token in the Authorization header
             },
             body:null
        })

        if(!response.ok){
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched users:", data);

    }
    catch(err){
        console.error("Error fetching users:", err);
    }
}