const express = require('express');
const router = express.Router();
const { authUser } = require('../middlewares/auth');
const { validateProfileUpdateData } = require('../utils/validations');

// GET /user 
router.get('/profile', authUser, async (req, res) => {
    try {
        const user = req.user;
        res.send({ status: 'OK', message: 'User fetched', data: user })
    } catch (error) {
        console.error('Error fetching user details', error);
        res.status(500).send({ status: 'false', message: 'Error fetching user', data: [] })
    }
})

// PATCH /profile/edit
router.patch('/profile/edit', authUser, async (req, res) => {
    try {
        const isValidData = validateProfileUpdateData(req);

        if (!isValidData) {
            return res.status(400).json({ 'status': 'success', message: 'Invalid profile data' });
        }

        const user = req.user;

        Object.keys(req.body).forEach(key => user[key] = req.body[key]);

        await user.save();

        return res.json({ 'status': 'success', message: 'Profile Updated Successfully', data: user });
    } catch (error) {
        console.log('Error in Edit Profile: ', error.message);
        return res.status(500).json({ 'status': 'error', message: error.message, data: [] });
    }
})

module.exports = router;