const express = require('express');
const { authUser } = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const router = express.Router();

// SEND CONNECTION REQUEST AND CREATE ITS SCHEMA
router.post('/request/send/:status/:toUserId', authUser, async (req, res) => {
    try {

        const fromUserId = req.user._id;
        const { status, toUserId } = req.params;

        const ALLOWED_STATUS = ['ignored', 'interested'];

        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(400).json({ status: 'error', message: 'Invalid Status type!' });
        }

        const toUser = await User.findById(toUserId)

        if (!toUser) {
            return res.status(400).json({ status: 'error', message: 'User does not exist!' });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            '$or': [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        console.log(existingConnectionRequest);
        if (existingConnectionRequest) {
            return res.status(400).json({ status: 'error', message: 'Connection Request already exists!' });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        return res.json({ status: 'success', message: `${req.user.firstName} ${status == 'ignored' ? 'has' : 'is'} ${status} ${toUser.firstName}`, data })
    } catch (error) {
        console.log('Error in sending connection request', error.message);
        return res.status(500).json({ status: 'error', message: error.message });
    }
})

module.exports = router;