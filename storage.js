//localStorags -> where we store the data in the browser that needs to be PERSISTENT
//sessionStorage -> where we store the data in the browser that needs to be cleared when the tab is closed - temporary storage
//cookies -> small pieces of data that are stored in the browser and sent to the server with every request
//we store tokens in localStorage
//because we need the token to be persistent

async function login (){
    //taking the email and pass
    //making an api call
    //response -> will contain the token

    //response.token

    //save it in the localStorage

    localStorage.setItem("token", response.token);
}