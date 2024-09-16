const Event = require("../db/models/event");
const User = require("../db/models/user");

//request=בקשה , result=תוצאה 
//מטרת פונקציה היא להוסיף אירוע חדש למסד הנתונים
// 
exports.add = async (request, result) => {
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
            return result.status(401).send('No such ID in the database.'); //throw new Error
        }

        // הוספת ה-ID של המשתמש לגוף הבקשה
        request.body.userID = data._id;
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
}
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
            return result.status(401).send('No such ID in the database.'); //throw new Error
        }
        // אם קיים המשתמש
        // של המשתמש ID-מחפש את כל האירועים במסד הנתונים שקשורים ל
        const allEvents = await Event.find({ userID: decoded._id });
        // אם לא נמצאו אירועים, מחזיר הודעת שגיאה עם סטטוס 401 (לא מורשה)
        if (allEvents.length == 0) {
            return result.status(401).send('No events in the database.'); //throw new Error
        }
        // Handle the verified data (e.g., user ID)
        // שולח את כל האירועים שנמצאו חזרה ללקוח
        result.send(allEvents);
    } catch (error) {
        result.status(500).send(error.message);
    }
}
// 
//   אמורה לקבל את האי די של האירוע 
exports.updateMeals = async (request, result) => {
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
            return result.status(401).send('No such ID in the database.'); //throw new Error
        }

        // הוספת ה-ID של המשתמש לגוף הבקשה
        request.body.userID = data._id;

        let meals = JSON.parse(request.body.meals);
        let option1 = {
            firstMeal: meals.option1.firstMeal,
            secondMeal: meals.option1.secondMeal,
            amount: meals.option1.amount,
            price: meals.option1.price
        };
        
        let option2 = { firstMeal: "bbbb", secondMeal: "asdasd11", amount: 22, price: 77 };
        let option3 = { firstMeal: "454", secondMeal: "123123", amount: 33, price: 88 };
        let option4 = { firstMeal: "dfsdf", secondMeal: "dc32g", amount: 44, price: 99 };
        request.body.meals = [option1, option2, option3, option4];
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
}
