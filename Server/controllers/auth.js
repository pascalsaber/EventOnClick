const jwt = require('jsonwebtoken'); // ייבוא מודל על מנת לפענוח ואימות טוקנים
const User = require('../db/models/user'); // Adjust the path as needed

const authenticateToken = async (request, result, next) => {
    try {
        const token = request.headers.authorization.split(' ')[1]; // Extract token from header
         //GLOBAL_TOKEN_SECRET מפענחת ומאמתת את הטוקן באמצעות המפתח הסודי שנמצא במשתנה הסביבה
        const decoded = jwt.verify(token, process.env.GLOBAL_TOKEN_SECRET); // Verify token
         // חיפוש המשתמש במסד הנתונים לפי ה-אידי ושמירה 
        const userData = await User.findOne({ _id: decoded._id }); // Find user by ID
        if (!userData) {
            return result.status(401).send('No such ID in the database.'); // Send 401 if no user found
        }
        request.userData = userData; // Attach user data to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        result.status(401).send('[Authentication Error] Invalid Token.'); // Send 401 if token is invalid
    }
};

module.exports = authenticateToken;