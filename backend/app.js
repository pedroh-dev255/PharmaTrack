const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const logRequest = require('./src/middlewares/logginMiddleware');
const authMiddleware = require('./src/middlewares/authMiddleware');
const isAdminMiddleware = require('./src/middlewares/adminMiddleware');
const {limiter, loginLimiter} = require("./src/middlewares/rateLimitMiddleware")

const authRoute = require('./src/routes/authRoute');
const usersRoute = require('./src/routes/usersRoute')
const notificationRoute = require('./src/routes/notificationRoute');
const groupRoute = require('./src/routes/groupRoute');

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

app.get('/verify-admin', isAdminMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Usuário é administrador',
        isAdmin: true
    });
});

app.use('/auth', loginLimiter, authRoute);
app.use('/users', authMiddleware, isAdminMiddleware, usersRoute)
app.use('/notifications', authMiddleware, notificationRoute);
app.use('/groups', authMiddleware, groupRoute);


module.exports = app;