// Importing required modules
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');

// Create an instance of express
const app = express();

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/assets', express.static('./public/assets'));

// MySQL session store configuration
var sessionStoreOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'shopping',
    createDatabaseTable: false,  // Set to true if you want to auto-create the sessions table
    schema: {
        tableName: 'sessions_table',
        columnNames: {
            session_id: 'custom_session_id',
            expires: 'custom_expires_column_name',
            data: 'custom_data_column_name'
        }
    }
};

// Initialize MySQLStore with session store options
var sessionStore = new MySQLStore(sessionStoreOptions);

// Setup session middleware
app.use(session({
    secret: 'my_secret',  // Secret key for signing the session ID cookie
    store: sessionStore,  // Use MySQL store for session storage
    resave: false,        // Don't save session if it wasn't modified
    saveUninitialized: false,  // Don't create session until something is stored
    //cookie: { secure: false } // Uncomment for HTTPS, true ensures cookies are only sent over HTTPS
}));

// Enable flash messages for temporary messages between requests
app.use(flash());

// Import route handlers (these files need to be created in the `routes/` folder)
const productRoute = require('./routes/productRoute');

// Use the product routes
app.use(productRoute);
const authRoute = require('./routes/authRoute');
const adminRoute = require('./routes/adminRoute');

// Use the route handlers
app.use(authRoute);
app.use('/admin', adminRoute);

// Starting the server
app.listen(4000, () => {
    console.log('The server is running on http://localhost:4000');
});

// Export the app (if needed for testing or modular usage)
module.exports = app;
