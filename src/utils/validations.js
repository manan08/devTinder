const validateSignUpData = (req) => {
    try {
        const { firstName, lastName, emailId, password, age, gender } = req.body;
        return { firstName, lastName, emailId, password, age, gender }
    } catch (error) {
        throw new Error('Missing some required parameters: ', error.message);
    }
}

module.exports = {
    validateSignUpData
}