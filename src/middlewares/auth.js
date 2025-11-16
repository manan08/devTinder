const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(400).send('Please login again!');
        }

        const decodedData = jwt.verify(token, "DEV@Tinder$123");

        const userId = decodedData._id;

        if (!userId) {
            return res.status(400).send('Inavlid token');
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).send('User not found!');
        }

        req.user = user;
        next();

    } catch (error) {
        console.log('Error in authUser: ', error.message);
        return res.status(400).send('Invalid Request');
    }
}

module.exports = {
    authUser
}