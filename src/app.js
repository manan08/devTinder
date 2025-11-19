const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan')
const { connectDB } = require('./config/database');
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/authRouter');
const profileRouter = require('./routes/profileRouter');
const connectionRequestRouter = require('./routes/connectionRequestRouter');
const userRouter = require('./routes/userRouter');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', connectionRequestRouter);
app.use('/', userRouter);


connectDB()
    .then(() => {
        console.log('Connected to Database...');
        app.listen(3000, () => {
            console.log('Server listening on Port: 3000...');
        });
    })
    .catch((err) => {
        console.error('Error in Databse connection: ', err);
    })
