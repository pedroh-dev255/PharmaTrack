const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const logRequest = require('./src/middlewares/logginMiddleware');
const authMiddleware = require('./src/middlewares/authMiddleware');
const {limiter, loginLimiter} = require("./src/middlewares/rateLimitMiddleware")

const authRoute = require('./src/routes/authRoute');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logRequest);
app.use(helmet());
app.use(limiter);
app.disable('x-powered-by');

app.get('/health', (req, res) => {
    return res.json({
        status: 'ok'
    });
});

app.post('/validate', authMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Token válido'
    });
});

app.use('/auth', loginLimiter, authRoute);


module.exports = app;