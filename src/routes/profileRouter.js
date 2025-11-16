const express = require('express');
const router = express.Router();
const { authUser } = require('../middlewares/auth');

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

module.exports = router;