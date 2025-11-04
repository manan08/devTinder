const express = require('express');
const { connectDB } = require('./config/database');
const User = require('./models/user');
const app = express();

app.use(express.json());


app.post('/signup', async (req, res) => {
    const { firstName, lastName, emailId, password, age, gender } = req.body;

    const userData = {
        firstName,
        lastName,
        emailId,
        password,
        age,
        gender
    };

    // CREATING A NEW INSTNACE OF USER MODEL
    const user = new User(userData);

    try {
        await user.save();
        return res.status(201).send({ status: 'OK', message: 'User Created successfully!' });
    } catch (error) {
        console.error('Error adding new user', error);
        return res.status(500).send({ status: 'false', message: 'Internal Server Error' });
    }

})

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
