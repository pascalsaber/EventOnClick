const Event = require("../db/models/event");

exports.add = async (request, result) => {
    try {
        const newEvent = new Event(request.body); //יצירת אובייקט מסוג משתמש מבוסס על מידע שהתקבל בבקשה
        const process = await newEvent.save();
        result.send(process);
    } catch (error) {
        result.status(500).send(error.message);
    }
}
exports.enumRequest = async (request, result) => {
    try {
        const event = new Event();
        let enumLocation = await event.enumRequest(request.query.enumRequest);
        result.send(enumLocation);
    } catch (error) {
        result.status(500).send(error.message);
    }
}