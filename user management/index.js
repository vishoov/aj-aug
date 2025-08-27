const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./view/users.routes');
const loggingMiddleware = require('./middlewares/logging.mw');
const dotenv = require('dotenv');
dotenv.config();
const multer = require('multer');

const mongoURI = process.env.MONGO;
const limiter = require('./middlewares/rate-limit');
mongoose.connect(mongoURI)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
});

app.use(limiter); // Apply rate limiting middleware to all requests
app.use(loggingMiddleware);

// import sessionIDs from './sessionIDs.js';
// app.use((req, res, next)=>{
//     const clientID = req.header('Client-ID');

//     const sessionID = sessionIDs.find(id => id === clientID);



//     if(!sessionID){
//         return res.status(401).json({error:"Unauthorized: Invalid Client-ID"});
//     }
//     next();



// })



// //middleware error handling 
// //this will catch errors from async functions
const errorHandler = (err, req, res, next)=>{
    
    res.status(500).json({error:err.message || "Internal Server Error"},
        {
            status:error.status || 500
        }
    );
    console.error("Error", err);
    next();
}

app.use(errorHandler);

app.use(express.json());

app.use(userRoutes);


app.get("/", async (req, res)=>{
    try{
        res.sendFile(__dirname + '/index.html');

    }catch(err){
        console.error('Error handling request:', err);
        res.status(500).send('Internal Server Error');
    }
})
//req -> middleware (multer) -> route handler -> response


//multer setup for file uploads
const storagelogic = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/'); // specify the destination directory
        //null means no error 
        //uploads folder should exist
    },
    filename: function(req, file, cb){
        
        cb(null, Date.now().toLocaleString().replace(/[/,: ]/g, '-') + '-' + file.originalname); 
        
    }
})

const upload = multer({storage: storagelogic});


app.post("/upload", upload.single('file'), (req, res)=>{
    try{

        const fileDetails = req.file;

        console.log('File info:', req.file);
        res.send('File uploaded successfully');

    }catch(err){
        console.error('Error handling file upload:', err);
        res.status(500).send('Internal Server Error');
    }
})

const advancedUpload = multer({
    storage: storagelogic, 
    limits: {
        fileSize: 1*1024*1024, // 10MB file size limit
        files: 5, // max 5 files
        fieldSize: 1*1024*1024, // max 25MB per field
        fieldNameSize: 100, // max 100 bytes for field name
        fields:10 // max 10 non-file fields
    },
    fileFilter: (req, files, cb)=>{
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

        const fileExtension = files.originalname.substring(files.originalname.lastIndexOf('.')).toLowerCase();

        if(allowedMimes.includes(files.mimetype) && allowedExtensions.includes(fileExtension)){
            cb(null, true);
        }else{
            cb(new Error('Invalid file type. Only JPEG, PNG and GIF image files are allowed.'));
        }
    }
})

//multiple files upload
app.post('/upload-multiple', advancedUpload.array('files', 5), (req, res)=>{
    try{
        if(!req.files || req.files.length === 0){
            return res.status(400).send('No files uploaded');
        }

        console.log('Files info:', req.files);
        res.send('Multiple files uploaded successfully');
    }
    catch(err){
        console.error('Error handling multiple file upload:', err);
        res.status(500).send('Internal Server Error');
    }
})


const PORT = 3000;

app.listen(PORT, ()=>{
    try{
        console.log(`Server is running on port ${PORT}`);
    }
    catch(err){
        console.error('Error starting server:', err);
    }
})