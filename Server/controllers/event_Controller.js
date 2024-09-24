const Event = require("../db/models/event");
const User = require("../db/models/user");
const authenticateToken = require("./auth");

//request=בקשה , result=תוצאה 
//מטרת פונקציה היא להוסיף אירוע חדש למסד הנתונים
// 
exports.add = [authenticateToken, async (request, result) => {
    try {
        const validDate = await Event.findOne({ date: request.body.date });
        if (validDate)
            return result.status(400).send('התאריך כבר קיים במסד הנתונים'); //throw new Error

        // הוספת ה-ID של המשתמש לגוף הבקשה
        request.body.userID = request.userData._id;
        //יצירת אובייקט מסוג משתמש מבוסס על מידע שהתקבל בבקשה
        const newEvent = new Event(request.body);
        // שמירת האירוע החדש במסד הנתונים
        const progress = await newEvent.save();
        // שליחת התגובה עם המידע על האירוע שנשמר
        result.send(progress);
    } catch (error) {
        // במקרה ומתבצעת שגיאה באחת מהשלבים 
        //(שגיאת שרת פנימית) מחזירים הודעת שגיאה עם סטטוס 500
        result.status(500).send(error.message);
    }
}];
// מטרתה להחזיר רשימה של אירועים בהתאם לבקשה
// לשאול את אהובי על הפונקציה הזאת הסתבכתי איתה 
exports.returnEnumListByType = async (request, result) => {
    try {
        const event = new Event();
        let enumList = await event.enumRequest(request.query.type);
        result.send(enumList);
    } catch (error) {
        result.status(500).send(error.message);
    }
}

exports.allEvents = async (request, result) => {
    try {
        // ייבוא מודול לפענוח הטוקן
        const jwt = require('jsonwebtoken');
        // חילוץ הטוקן מהכותרת של הבקשה
        const token = request.headers.authorization.split(' ')[1]; // Extract token from header
        // פענוח הטוקן באמצעות המפתח הסודי
        const decoded = jwt.verify(token, process.env.GLOBAL_TOKEN_SECRET);
        // שהתקבל מהטוקן ID-חיפוש המשתמש במסד הנתונים לפי ה
        const data = await User.findOne({ _id: decoded._id });
        //אם המשתמש לא נמצא, חוזרת שגיאה
        if (!data) {
            return result.status(400).send('No such ID in the database.'); //throw new Error
        }
        // אם קיים המשתמש
        // של המשתמש ID-מחפש את כל האירועים במסד הנתונים שקשורים ל
        const allEvents = await Event.find({ userID: decoded._id });
        // אם לא נמצאו אירועים, מחזיר הודעת שגיאה עם סטטוס (לא מורשה)
        if (allEvents.length == 0) {
            return result.status(400).send('No events in the database.'); //throw new Error
        }
        // Handle the verified data (e.g., user ID)
        // שולח את כל האירועים שנמצאו חזרה ללקוח
        result.send(allEvents);
    } catch (error) {
        result.status(500).send(error.message);
    }
}

exports.findOneEvent = async (request, result) => {
    try {
        // ייבוא מודול לפענוח הטוקן
        const jwt = require('jsonwebtoken');
        // חילוץ הטוקן מהכותרת של הבקשה
        const token = request.headers.authorization.split(' ')[1];
        // פענוח הטוקן באמצעות המפתח הסודי
        const decoded = jwt.verify(token, process.env.GLOBAL_TOKEN_SECRET);

        // חיפוש המשתמש במסד הנתונים לפי ה-ID שהתקבל מהטוקן
        const user = await User.findById(decoded._id);
        if (!user) {
            return result.status(400).send('No such user in the database.');
        }

        // חיפוש האירוע לפי ה-ID שהתקבל מהבקשה
        const event = await Event.findById(request.query.eventID);
        if (!event) {
            return result.status(400).send('Event not found.');
        }

        // בדיקה אם האירוע שייך למשתמש
        if (event.userID.toString() !== user._id.toString()) {
            return result.status(403).send('Event does not belong to the user.');
        }

        // החזרת פרטי האירוע
        result.send(event);
    } catch (error) {
        result.status(500).send(error.message);
    }
};

exports.updateEventByID = [authenticateToken, async (request, result) => {
    let event = await Event.findById({ _id: request.query.eventid }); //חיפוש אירוע לפי מפתח
    if (!event) //לא נמצא אירוע
        return result.status(400).send('No such Event ID in the database.'); //throw new Error

    if (event.userID.toString() != request.userData._id.toString()) // המפתח של המשתמש המחובר למערכת אינו תואם לאירוע
        return result.status(400).send('אירוע זה אינו שייך למשתמש המחובר.'); //throw new Error

    const validDate = await Event.findOne({ date: request.body.date });
    if (validDate)
        return result.status(400).send('התאריך כבר קיים במסד הנתונים'); //throw new Error

    const data = request.body;
    let progress = await Event.findByIdAndUpdate(
        request.query.eventid, // ID של האירוע לעדכון
        data,
        { new: true } // מחזיר את המסמך המעודכן
    );
    result.send(progress);
}];

exports.updateMealsOrDecoration = [authenticateToken, async (request, result) => {
    try {
        let event = await Event.findById({ _id: request.body.eventID }); //חיפוש אירוע לפי מפתח
        if (!event) //לא נמצא אירוע
            return result.status(400).send('No such Event ID in the database.'); //throw new Error

        if (event.userID.toString() != request.userData._id.toString()) // המפתח של המשתמש המחובר למערכת אינו תואם לאירוע
            return result.status(400).send('אירוע זה אינו שייך למשתמש המחובר.'); //throw new Error

        const data = await JSON.parse(request.body.data);
        console.log(JSON.stringify(data)); //TEST
        let formData = null //Meal || Decoration
        if (data.meals != null) {
            formData = data.meals;
        } else if (data.decorations != null) {
            formData = data.decorations;
        }

        let newList = [];
        Object.keys(formData).forEach(options => {
            newList.push(formData[options]);
        });

        let progress = null;
        if (data.meals != null) {
            progress = await Event.findByIdAndUpdate(
                event._id, // ID של האירוע לעדכון
                { meals: newList },
                { new: true } // מחזיר את המסמך המעודכן
            );
        } else if (data.decorations != null) {
            progress = await Event.findByIdAndUpdate(
                event._id, // ID של האירוע לעדכון
                { decorations: newList },
                { new: true } // מחזיר את המסמך המעודכן
            );
        }
        result.send(progress);
    } catch (error) {
        // במקרה ומתבצעת שגיאה באחת מהשלבים 
        //(שגיאת שרת פנימית) מחזירים הודעת שגיאה עם סטטוס 500
        result.status(500).send(error.message);
    }
}];

exports.updatePayment = [authenticateToken, async (request, result) => {
    try {
        let event = await Event.findById({ _id: request.body.eventID }); //חיפוש אירוע לפי מפתח
        if (!event) //לא נמצא אירוע
            return result.status(400).send('No such Event ID in the database.'); //throw new Error

        if (event.userID.toString() != request.userData._id.toString()) // המפתח של המשתמש המחובר למערכת אינו תואם לאירוע
            return result.status(400).send('אירוע זה אינו שייך למשתמש המחובר.'); //throw new Error
        const data = await JSON.parse(request.body.data);

        // return result.status(400).send(data.payments); //throw new Error 

        let progress = null;
        if (data.payments != null) {
            progress = await Event.findByIdAndUpdate(
                event._id, // ID של האירוע לעדכון
                { payments: data.payments },
                { new: true } // מחזיר את המסמך המעודכן
            );
        }
        result.send(progress);
    } catch (error) {
        // במקרה ומתבצעת שגיאה באחת מהשלבים 
        //(שגיאת שרת פנימית) מחזירים הודעת שגיאה עם סטטוס 500
        result.status(500).send(error.message);
    }
}]

//   אמורה לקבל את האי די של האירוע 
exports.deleteEvent = [authenticateToken, async (request, result) => {
    try {
        let event = await Event.findById({ _id: request.query.eventID }); //חיפוש אירוע לפי מפתח
        if (!event) //לא נמצא אירוע
            return result.status(400).send('No such Event ID in the database.'); //throw new Error

        if (event.userID.toString() != request.userData._id.toString()) // המפתח של המשתמש המחובר למערכת אינו תואם לאירוע
            return result.status(400).send('אירוע זה אינו שייך למשתמש המחובר.'); //throw new Error

        await Event.deleteOne(event._id);
        result.send("Event has been deleted.");
    } catch (error) {
        // במקרה ומתבצעת שגיאה באחת מהשלבים 
        //(שגיאת שרת פנימית) מחזירים הודעת שגיאה עם סטטוס 500
        result.status(500).send("Failed to delete event: " + error.message);
    }
}];
