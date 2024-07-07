const Event = require("../db/models/event");
const User = require("../db/models/user");

exports.add = async (request, result) => {
    try {

        //בכל פעולה שקשורה למשתמש נצתרך לפענח את המידע של הטוקן על מנת לאמת את הזהות
        const jwt = require('jsonwebtoken');
        const token = request.headers.authorization.split(' ')[1]; // Extract token from header
        const decoded = jwt.verify(token, process.env.GLOBAL_TOKEN_SECRET);

        const data = await User.findOne({ _id: decoded._id });
        if (!data) {
            return result.status(401).send('No such ID in the database.'); //throw new Error
        }

        request.body.userID = data._id;

        const newEvent = new Event(request.body); //יצירת אובייקט מסוג משתמש מבוסס על מידע שהתקבל בבקשה
        const progress = await newEvent.save();
        result.send(progress);
    } catch (error) {
        result.status(500).send(error.message);
    }
}
exports.enumRequest = async (request, result) => {
    try {
        const event = new Event();
        let enumList = await event.enumRequest(request.query.enumRequest);
        result.send(enumList);
    } catch (error) {
        result.status(500).send(error.message);
    }
}
exports.allEvents = async (request, result) => {
    try {
        const jwt = require('jsonwebtoken');
        const token = request.headers.authorization.split(' ')[1]; // Extract token from header
        const decoded = jwt.verify(token, process.env.GLOBAL_TOKEN_SECRET);
        const data = await User.findOne({ _id: decoded._id });
        if (!data) {
            return result.status(401).send('No such ID in the database.'); //throw new Error
        }

        const allEvents = await Event.find({ userID: decoded._id });
        if (allEvents.length == 0) {
            return result.status(401).send('No events in the database.'); //throw new Error
        }

        // Handle the verified data (e.g., user ID)
        result.send(allEvents);
    } catch (error) {
        result.status(500).send(error.message);
    }
}