const express = require('express');
const bcrypt = require('bcrypt');
const { connectDB } = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validations');
const app = express();

app.use(express.json());

// GET /user 
app.get('/user', async (req, res) => {
    const { emailId } = req.body;
    try {
        const userData = await User.find({ emailId });
        console.log(userData);
        res.send({ status: 'OK', message: 'User fetched', data: userData })
    } catch (error) {
        console.error('Error fetching user details', error);
        res.status(500).send({ status: 'false', message: 'Error fetching user', data: [] })
    }
})

// POST /signup
app.post('/signup', async (req, res) => {

    const data = validateSignUpData(req);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData = { ...data, password: hashedPassword };

    console.log('UserData', userData);

    // CREATING A NEW INSTNACE OF USER MODEL
    const user = new User(userData);

    try {
        await user.save();
        return res.status(201).send({ status: 'OK', message: 'User Created successfully!' });
    } catch (error) {
        console.error('Error adding new user', error.message);
        return res.status(500).send({ status: 'false', message: error.message });
    }

})

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).send({ status: 'Error', message: 'Invalid Credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log(isValidPassword)
        if (isValidPassword) {
            return res.send({ status: 'Ok', message: 'Login Successful!' })
        } else {
            return res.status(400).send({ status: 'Error', message: 'Invalid Credentials' });
        }

    } catch (error) {
        console.log("Error in Login: ", error.message);
        return res.status(500).send({ status: 'Error', message: 'Internal Server Error' });
    }
})

// GET /feed -FEED API - TO FETCH USER DATA
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length > 0) {
            res.send({ status: 'OK', message: 'Data fetched successfuly', data: users });
        } else {
            res.status(404).send({ status: 'false', message: 'Error fetching data', data: [] })
        }
    } catch (error) {
        console.error('Error fetching feed details', error);
        res.status(500).send({ status: 'false', message: 'Error fetching user', data: [] })
    }

})

// DELETE /user
app.delete('/user', async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send({ status: 'OK', message: 'User deleted successfuly' });

    } catch (error) {
        console.error('Error deleting user ', error);
        res.status(500).send({ status: 'false', message: 'Error deleteing user' })
    }
})

// PATCH /user
app.patch('/user', async (req, res) => {
    const { userId, data } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, data);
        res.send({ status: 'OK', message: 'User updated successfuly' });

    } catch (error) {
        console.error('Error updating user ', error);
        res.status(500).send({ status: 'false', message: 'Error updating user' })
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
