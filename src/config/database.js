const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        'mongodb+srv://manan3344acesharma:90GLsTOU6UHy9dsb@auth-0.d40qdxw.mongodb.net/devTinder'
    );
}

module.exports = { connectDB };
