const validateSignUpData = (req) => {
    try {
        const { firstName, lastName, emailId, password, age, gender } = req.body;
        return { firstName, lastName, emailId, password, age, gender }
    } catch (error) {
        throw new Error('Missing some required parameters: ', error.message);
    }
}

const validateProfileUpdateData = (req) => {
    try {
        const ALLOWED_EDIT_FIELDS = ['firstName', 'lastName', 'emailId', 'age', 'gender'];

        const isValidData = Object.keys(req.body).every(field => ALLOWED_EDIT_FIELDS.includes(field));

        if (!isValidData) {
            return false;
        }

        return true;
    } catch (error) {
        console.log("Error in Validating Data", error.message);
        return false;
    }
}

module.exports = {
    validateSignUpData,
    validateProfileUpdateData
}