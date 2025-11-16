const express = require('express');
const router = express.Router();

// GET /feed -FEED API - TO FETCH USER DATA
router.get('/feed', async (req, res) => {
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

module.exports = router;
