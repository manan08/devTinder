const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { validateSignUpData } = require('../utils/validations');


// POST /signup
router.post('/signup', async (req, res) => {

    const data = validateSignUpData(req);

    const { emailId, password } = data;

    // Check if user already exists
    const isUserExist = await User.findOne({ emailId });
    if (isUserExist) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await User.hashPassword(password);

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

router.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).send({ status: 'Error', message: 'Invalid Credentials' });
        }

        const isValidPassword = await user.comparePassword(password);
        console.log(isValidPassword)
        if (isValidPassword) {

            const token = user.generateAuthToken();
            res.cookie('token', token);

            return res.send({ status: 'Ok', message: 'Login Successful!' })
        } else {
            return res.status(400).send({ status: 'Error', message: 'Invalid Credentials' });
        }

    } catch (error) {
        console.log("Error in Login: ", error.message);
        return res.status(500).send({ status: 'Error', message: 'Internal Server Error' });
    }
})

router.post('/logout', async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now())
    })

    res.send('Logout Successful!!')
})

module.exports = router;