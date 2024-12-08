const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Set up body parser to handle POST requests
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files (e.g., images, CSS, JavaScript)
app.use(express.static('public'));


// Set up session management
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// MySQL database connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Change with your MySQL username
    password: 'Aakash@123',  // Change with your MySQL password
    database: 'tourist'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected!');
});

// Set view engine as EJS
app.set('view engine', 'ejs');

// Serve static files like CSS
app.use(express.static('public'));

// Route to login page
app.get('/', (req, res) => {
    res.render('login', { activePage: 'login' });
});

// Route to register page
app.get('/register', (req, res) => {
    res.render('register', { activePage: 'register' });
});

// Route to dashboard
app.get('/dashboard', (req, res) => {
    if (req.session && req.session.user) {
        res.render('dashboard', { user: req.session.user, activePage: 'dashboard' });
    } else {
        res.redirect('/');
    }
});


// Simulated Hotels Data
const hotels = [
    { id: 1, name: "Grand Palace Hotel", location: "Location 1", latitude: 12.9716, longitude: 77.5946 },
    { id: 2, name: "Ocean View Resort", location: "Location 2", latitude: 15.3173, longitude: 75.7139 },
    { id: 3, name: "Mountain Retreat", location: "Location 3", latitude: 19.0760, longitude: 72.8777 }
];

// Hotels Route
app.get('/hotels', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.render('hotels', { hotels });
});


// Simulated Restaurants Data
const restaurants = [
    { id: 1, name: "Pasta Palace", location: "Location 1", latitude: 12.9716, longitude: 77.5946 },
    { id: 2, name: "Burger Bistro", location: "Location 2", latitude: 15.3173, longitude: 75.7139 },
    { id: 3, name: "Sushi Spot", location: "Location 3", latitude: 19.0760, longitude: 72.8777 }
];

// Restaurants Route
app.get('/restaurants', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.render('restaurants', { restaurants });
});

// Simulated Nearby Attractions Data
const attractions = [
    { id: 1, name: "Wonderland Park", location: "Location X", latitude: 12.9716, longitude: 77.5946 },
    { id: 2, name: "Historical Fort", location: "Location Y", latitude: 15.3173, longitude: 75.7139 },
    { id: 3, name: "Nature's Paradise", location: "Location Z", latitude: 28.7041, longitude: 77.1025 },
];

// Attractions Route
app.get('/attractions', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.render('attractions', { attractions });
});



// Route to handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database for the user credentials
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // If the user exists, store user details in the session
            req.session.user = results[0];
            res.redirect('/dashboard');
        } else {
            res.send('Invalid username or password.');
        }
    });
});

// Route to handle register form submission
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Insert the new user into the database
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err, result) => {
        if (err) throw err;

        // Redirect to login after successful registration
        res.redirect('/');
    });
});

// Route to handle logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// Handle errors for unmatched routes
app.use((req, res, next) => {
    res.status(404).send('Page Not Found');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
