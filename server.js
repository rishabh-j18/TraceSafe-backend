const express = require('express');
const cors= require('cors');
const connectDB = require('./db/db'); // Import the database connection function
require('dotenv').config({path:'./.env'});




// Initialize Express app
const app = express();
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON data
app.use(express.json());

// Set the port
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin:'http://localhost:3000',
    credentials: true
}));


// Connect to the database
connectDB();

const authRouter=require('./router/auth');
app.use(authRouter);


// Home route (basic API test)
app.get('/', (req, res) => {
  res.send('API is running');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
