require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');   // ✅ ENABLE CORS IMPORT
const users = require('./routes/users');
const dashboard = require('./routes/dashboard');
const categories = require('./routes/category');
const products = require('./routes/product');
const slots = require('./routes/slot');
const booking = require('./routes/booking');
const dbConnect = require('./db');
const userMiddleware = require('./middleware/user');
const app = express();

app.set('trust proxy', true);
// --------------------------------------
// DATABASE CONNECTION
// --------------------------------------
dbConnect();

// --------------------------------------
// ✅ ENABLE CORS BEFORE ANY ROUTES
// --------------------------------------
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// --------------------------------------
// Serve static files
// --------------------------------------

// Parse JSON body
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// --------------------------------------
// ROUTES
// --------------------------------------
app.get('/', (req, res) => {
    res.send('welcome makeupseven ');
});

app.use('/users', users);
app.use('/categories', categories);
app.use('/products', products);
app.use('/slots', slots);
app.use('/dashboard', dashboard);
app.use('/booking', booking);
app.use(userMiddleware);



// --------------------------------------
// SERVER LISTEN
// --------------------------------------
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
});
