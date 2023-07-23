const express = require('express');
const helmet = require('helmet');
const { Sequelize } = require('sequelize');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const winston = require('winston');  // Require winston

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const profileRoutes = require('./routes/profileRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const cookieParser = require('cookie-parser');

// somewhere in your app setup code
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
});

sequelize.authenticate()
    .then(() => {
        console.log('Connected to PostgreSQL Database');
        if (process.env.NODE_ENV === 'development') {
            sequelize.sync({force: true}).then(() => {
                console.log('All tables successfully created (or they already exist)');
            }).catch(err => console.error('Error creating tables:', err));
        }
    })
    .catch((err) => console.log('Failed to connect to PostgreSQL Database', err));

app.use(cookieParser());

// Set up CORS policy
const corsOptions = {
    origin: 'http://localhost:3000',  // Replace with your frontend origin
    optionsSuccessStatus: 200
}

// Create loggers
const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'log/error.log' })
    ]
});

const requestLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'log/access.log' })
    ]
});

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use((req, res, next) => {
    // Log the request
    requestLogger.info({
        timestamp: new Date().toISOString(),
        method: req.method,
        route: req.originalUrl,
        ip: req.ip,
        body: req.method === 'POST' ? req.body : undefined,
    });

    // Call next middleware
    next();
});

app.use('/api', authRoutes);
app.use('/api', chatRoutes);
app.use('/api', profileRoutes);
app.use('/api', paymentRoutes);
app.use('/api', tokenRoutes);
app.use('/api', userRoutes);

app.get('/', (req, res) => {
    res.status(200).send('Rosetta API');
});

// Error handling middleware
app.use((err, req, res, next) => {
    // Log the error
    errorLogger.error({
        timestamp: new Date().toISOString(),
        method: req.method,
        route: req.originalUrl,
        ip: req.ip,
        message: err.message,
        stack: err.stack,
    });

    if (process.env.NODE_ENV === 'development') {
        res.status(500).json({ message: err.message, stack: err.stack });  // Include error details in response
    } else {
        res.status(500).send('Something broke!');
    }
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Server listening on port ${port}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = app;