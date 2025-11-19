const express = require('express');
const router = express.Router();
const { authUser } = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

const USER_SAFE_DATA = ['firstName', 'lastName', 'age']

// GET /feed -FEED API - TO FETCH USER DATA
router.get('/feed', authUser, async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = (limit > 50) ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            '$or': [
                { 'fromUserId': req.user._id },
                { 'toUserId': req.user._id }
            ]
        }).select('fromUserId toUserId');

        const hideFromFeed = new Set();

        connectionRequests.forEach(request => {
            hideFromFeed.add(request.fromUserId.toString());
            hideFromFeed.add(request.toUserId.toString());
        });

        const data = await User.find({
            _id: { '$nin': Array.from(hideFromFeed) }
        })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.json({ status: 'success', message: 'Data fetched successfully!', data })

    } catch (error) {
        console.error('Error fetching feed details', error);
        res.status(500).send({ status: 'false', message: 'Error fetching user', data: [] })
    }
})

router.get('/user/request/received', authUser, async (req, res) => {
    try {
        const data = await ConnectionRequest.find({
            toUserId: req.user._id,
            status: 'interested'
        }).populate('fromUserId', USER_SAFE_DATA);

        return res.json({ status: 'success', message: 'Requests fetched successfully!', data });
    } catch (error) {
        console.log('Error in fetching requests: ', error.message);
        return res.status(500).json({ status: 'error', message: error.message })
    }
})

router.get('/user/connections', authUser, async (req, res) => {
    try {
        const connectionRequests = await ConnectionRequest.find({
            '$or': [
                { toUserId: req.user._id },
                { fromUserId: req.user._id }
            ],
            status: 'accepted'
        }).populate('fromUserId', USER_SAFE_DATA).populate('toUserId', USER_SAFE_DATA);

        const data = connectionRequests.map(request => {
            if (request.fromUserId._id.toString() === req.user._id.toString()) {
                return request.toUserId;
            }
            return request.fromUserId;
        });

        return res.json({ status: 'success', message: 'Connections fetched successfully!', data });
    } catch (error) {
        console.log('Error in fetching requests: ', error.message);
        return res.status(500).json({ status: 'error', message: error.message })
    }
})


module.exports = router;
