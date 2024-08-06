require('dotenv').config();
const path=require('path')
const express = require('express');
const { spawn } = require('child_process');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const chokidar = require('chokidar');
const fsm = require('fs/promises');
const BASE_URL = process.env.BASE_URL;
const port = process.env.PORT;
const http = require('http');
const socketIo = require('socket.io');
const FormData = require('form-data');
app.use(express.json());
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
app.use(bodyParser.json());


const MONGODB_URI = process.env.MONGODB_URI ;

// Middleware to parse JSON

// Connect to MongoDB using Mongoose
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');

        // Start the Express server after the database connection is established
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1); // Exit process with failure
    });

// Define a schema for attendance
const attendanceSchema = new mongoose.Schema({
    randomNumber: Number,
    enrollment: String,
    dateTime: Date,
    attendance: String,
}, { timestamps: true });

// Create a model for attendance
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Endpoint to receive attendance data
app.post('/api/attendance', async (req, res) => {
    const { randomNumber, enrollment, dateTime, attendance } = req.body;

    const newAttendance = new Attendance({
        randomNumber,
        enrollment,
        dateTime,
        attendance,
    });

    try {
        const result = await newAttendance.save();
        res.json({ message: 'Attendance saved successfully', id: result._id });
    } catch (error) {
        console.error('Error saving attendance', error);
        res.status(500).json({ message: 'Error saving attendance' });
    }
});






app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/homePage.html');
})

app.use(express.static(__dirname+'/public'));




const jsonFilePath = 'locationData.json';

const readJsonFile = async () => {
    try {
        const data = await fsm.readFile(jsonFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return null;
    }
};

const watcher = chokidar.watch(jsonFilePath);
watcher.on('change', async () => {
    console.log('JSON file changed. Reloading data...');
    const jsonData = await readJsonFile();
    io.emit('data-update', jsonData); 
});

let receivedRandomNumber = 0;
let temp1 = 28.5373343;
let temp2 =77.365916;


app.post('/api/random', (req, res) => {
    // receivedRandomNumber = req.body.randomNumber;
    console.log("in server for teacher location")
    console.log(req.body)
    let randomNumber=req.body.randomNum;
    let newTemp1=req.body.x;
    let newTemp2=req.body.y;
    receivedRandomNumber = randomNumber;
    temp1 = newTemp1;
    temp2 = newTemp2;
    console.log("the received coordinates of teachers are")
    console.log(temp1,temp2)
    res.json({ message: 'Random number received successfully' });
});

app.get('/api/randomcoordinates', (req, res) => {
    // Respond with the current values of temp1 and temp2
    res.json({
        temp1:temp1,
        temp2:temp2
    });
});




app.get('/teacher', (req, res) => {
    function generateRandomNumber() {
        const min = 100;
        const max = 999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    res.sendFile(__dirname + '/mam.html');
});
const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('Client connected');
});

app.get('/api/coordinates', (req, res) => {
    res.sendFile(__dirname + '/index.html');    
});


//by nitin

app.get('/student', (req, res) => {
    res.sendFile(__dirname + '/student.html');
  
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('public'));



//adding code for MongoDB

// const uri = 'mongodb+srv://geoapp:TlWtPJvHN8vxT7u0@cluster0.ctzrpva.mongodb.net/Attendence?retryWrites=true&w=majority&appName=Cluster0';


app.post('/teacher', (req, res) => {
    const data = req.body;
    
   
    console.log("hi", data);
        console.log("after hi sending this data");
        io.emit('dataUpdate', data);
        res.sendStatus(200);
});


app.post('/student', (req, res) => {
    const enteredCode = req.body.code;

    console.log("entered code is: ", enteredCode);
    console.log("i got: ", receivedRandomNumber);

    if (enteredCode == receivedRandomNumber) {
        res.redirect('/api/coordinates');
    } else {
        res.status(400).json({ error: "Code does not matched. Please try again." });
    }
});








//added by nitin
app.post('/cameras', upload.single('image'), async (req, res) => {
    console.log('Received image upload request.');
    if (!req.file) {
      console.error('No file uploaded.');
      return res.status(400).send('No file uploaded.');
    }
  
    const filePath = path.join(__dirname, req.file.path);
  
    try {
      const form = new FormData();
      form.append('image', fs.createReadStream(filePath));
  
      const response = await axios.post('http://localhost:5000/validate', form, {
        headers: form.getHeaders(),
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Error in axios request:', error);
      res.status(500).send(error.toString());
    } finally {
      fs.unlinkSync(filePath);
    }
  });
  
  

function isValidEnrollmentNumber(enrollmentNumber) {
    return /^\d{10}$/.test(enrollmentNumber);
}

