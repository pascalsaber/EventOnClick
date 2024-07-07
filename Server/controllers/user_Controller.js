
const User = require("../db/models/user.js");
const bcrypt = require('bcryptjs');
const Event = require("../db/models/event.js");

exports.register = async (request, result) => {
    try {
        const newUser = new User(request.body); //יצירת אובייקט מסוג משתמש מבוסס על מידע שהתקבל בבקשה

        const username_taken = await User.findOne({ username: newUser.username });
        if (username_taken)
            return result.status(404).send('Username is taken.');

        let isStrongPassword = await newUser.isStrongPassword(); //MUST USE AWAIT!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if (isStrongPassword == false)
            return result.status(404).send('Password is not strong.');

        const salt = bcrypt.genSaltSync(10); //מחרוזת אקראית בגודל 10 טווים עבור ההצפנה
        // hash - את ההסיסמה המוצפנת שיש בתוכה את השילוב של הסימה המקורית והמחרוזת ההקראית שהמערכת יצרה
        const hashPassword = bcrypt.hashSync(newUser.password, salt);
        newUser.password = hashPassword;

        const progress = await newUser.save();
        result.send(progress);
    } catch (error) {
        result.status(500).send(error.message);
    }
}
exports.printall = async (request, result) => {
    try {
        const allUsers = await User.find();
        result.send(allUsers);
    } catch (error) {
        result.status(500).send(error.message);
    }
}
exports.login = async (request, result) => {
    try {
        let req_username = request.body.username;
        let req_password = request.body.password;

        const data = await User.findOne({ username: req_username });
        if (!data) {
            return result.status(401).send('Wrong username.'); //throw new Error
        }
        // אחרי ההשוואה בין הסיסמה שהמשתמש נתן לבין הסיסמה שנמצאת בסיס נתונים   
        const isValid = bcrypt.compareSync(req_password, data.password);
        if (!isValid) {
            return result.status(401).send('Wrong password.'); //throw new Error
        }
        let token = await data.generateToken();
        result.send({ token });
    } catch (error) {
        result.status(500).send('[Error] [#0010] ' + error.message);
    }
}

exports.profile = async (request, result) => {
    const jwt = require('jsonwebtoken');
    try {
        const token = request.headers.authorization.split(' ')[1]; // Extract token from header
        const decoded = jwt.verify(token, process.env.GLOBAL_TOKEN_SECRET);

        const data = await User.findOne({ _id: decoded._id });
        if (!data) {
            return result.status(401).send('No such ID in the database.'); //throw new Error
        }

        // Handle the verified data (e.g., user ID)
        result.json({ decoded, data });
    } catch (error) {
        result.status(401).json({ message: 'Invalid token' });
    }
}

exports.updateUserByID = async (request, result) => {
    try {
        const req_id = request.query.id;
        const req_password = request.query.password;
        const data = await User.findByIdAndUpdate(req_id, { password: req_password });

        if (!data) {
            return result.status(404).send('No data');
        }

        result.send(data);
    } catch (error) {
        result.status(500).send(error.message);
    }
}
exports.findUserByID = async (request, result) => {
    try {
        const id = request.query.id;
        const data = await User.findById(id);

        if (!data) {
            return result.status(404).send('No data');
        }

        result.send(data);
    } catch (error) {
        result.status(500).send(error.message);
    }
}
exports.test = async (request, result) => {
    try {
        const data = request.query.test;

        if (!data) {
            return result.status(404).send('No data');
        }

        result.send(data);
    } catch (error) {
        result.status(500).send(error.message);
    }
}
