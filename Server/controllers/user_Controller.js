const User = require("../db/models/user.js");
const bcrypt = require('bcryptjs');

exports.add = async (request, result) => {
    try {
        // מידע שמתקבל בפניה
        const req_username = request.query.username;
        const req_password = request.query.password;
        // salt - יכיל מחרוזת אקראית 
        const salt = bcrypt.genSaltSync(10);
        // hash - את ההסיסמה המוצפנת שיש בתוכה את השילוב של הסימה המקורית והמחרוזת ההקראית שהמערכת יצרה
        const hash = bcrypt.hashSync(req_password, salt);
        request.query.password = hash;

        const newUser = new User(request.query);
        /*
        const newUser = new User({
            // איחסון באובייקט
            username: req_username,
            password: hash
        });*/

        const process = await newUser.save();
        // עשיתי ניסוי להצגת האי די היחודי של המשתנה שלי 
        //const id=process._id;
        // וגם הצלחתי להציג אותו 
        //result.send(id);
        result.send(process);
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
            return result.status(404).send('No data');
        }
        // אחרי ההשוואה בין הסיסמה שהמשתמש נתן לבין הסיסמה שנמצאת בסיס נתונים   
        const isValid = bcrypt.compareSync(req_password, data.password);
        if (isValid) {
            result.send(data);
        } else {
            //throw new Error("Password mismatch");
            return result.status(500).send('Wrong password.');
        }
    } catch (error) {
        result.status(500).send('[Error] [#0010] ' + error.message);
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

