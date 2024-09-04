
const User = require("../db/models/user.js");
const bcrypt = require('bcryptjs');
const Event = require("../db/models/event.js");

//פונקציה אסינכרונית שמטרתה לרשום משתמש למערכת כולל הצפנת המידע ויצירת סיסמה מוצפנת יחודית למשתמש 
exports.register = async (request, result) => {
    try {
        //יצירת אובייקט מסוג משתמש מבוסס על מידע שהתקבל בבקשה
        const newUser = new User(request.body); 
        // בודקת אם שם המשתמש כבר קיים במסד הנתונים
        const username_taken = await User.findOne({ username: newUser.username });
        //אם שם המשתמש תפוס
        if (username_taken)
            // מוחזרת שגיאה שהמשתמש כבר קיים במערכת 
            return result.status(404).send('Username is taken.');
        // אם המשתמש לא נמצא אז אפשר ליצור אותו במערכת 
        // מתחילים לעשות בדיקות לסיסמה שהמשתמש נתן 
        // בודקת אם הסיסמה חזקה מספיק ועומדת בדרישות שבנינו בה תפונקציה בעמוד סכימת היוזיר
        //
        let isStrongPassword = await newUser.isStrongPassword(); //MUST USE AWAIT!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //אם הסיסמה לא חזקה, מחזירה הודעת שגיאה עם סטטוס 404
        if (isStrongPassword == false)
            return result.status(404).send('Password is not strong.');

        const salt = bcrypt.genSaltSync(10); //מחרוזת אקראית בגודל 10 טווים עבור ההצפנה
        // hash - את ההסיסמה המוצפנת שיש בתוכה את השילוב של הסימה המקורית והמחרוזת ההקראית שהמערכת יצרה
        const hashPassword = bcrypt.hashSync(newUser.password, salt);
        // מעדכנים את הסיסמה של המשתמש לאחר שהצפנו אותה 
        newUser.password = hashPassword;
        //שומרת את המשתמש החדש במסד הנתונים ושולחת את התוצאה ללקוח
        const progress = await newUser.save();
        result.send(progress);
       // במקרה של שגיאה, מחזירה הודעת שגיאה עם סטטוס 500 
    } catch (error) {
        result.status(500).send(error.message);
    }
}
// פונקציה שמוצאת את כל המשתמשים במסד הנתונים ושולחת את התוצאה ללקוח
exports.printall = async (request, result) => {
    try {
        // Userפרמטרים היא מחזירה את כל המשתמשים שנמצאים במודל הfind() כאשר לא מעבירים לפונקציה
        const allUsers = await User.find();

        result.send(allUsers);
    } catch (error) {
        result.status(500).send(error.message);
    }
}
// מטרת הפונקציה לאמת את פרטי ההתחברות של המשתמש (שם משתמש וסיסמה) וליצור טוקן אימות
exports.login = async (request, result) => {
    try {
        let req_username = request.body.username;
        let req_password = request.body.password;
        //data חיפוש אם שם המשתמש קיים במערכת ושמירת הנתונים במשתנה
        const data = await User.findOne({ username: req_username });
        if (!data) {
            return result.status(401).send('Wrong username.'); //throw new Error
        }
        // compareSync()-משמשת להשוואת סיסמה רגילה עם סיסמה מוצפנת כדי לבדוק אם הן תואמות
        // אחרי ההשוואה בין הסיסמה שהמשתמש נתן לבין הסיסמה שנמצאת בסיס נתונים   
        const isValid = bcrypt.compareSync(req_password, data.password);
        if (!isValid) {
            return result.status(401).send('Wrong password.'); //throw new Error
        }
       //יוצרת טוקן אימות עבור המשתמש שמכל את האידי של המשתמש ומוצפן באמצעות מפתח סודי
        let token = await data.generateToken();
        // שולחים את הטוקן בצורת אובייקט למשתמש 
        result.send({ token });
        //במקרה של שגיאה במהלך התהליך, הפונקציה מחזירה הודעת שגיאה עם סטטוס 500 ואת הודעת השגיאה
    } catch (error) {
        result.status(500).send('[Error] [#0010] ' + error.message);
    }
}
// מטרת הפונקציה היא לאמת את הטוקן שנשלח ע"י הלקוח ולשלוף את פרטי המשתמש ממסד הנתונים 
exports.profile = async (request, result) => {
    // ייבוא מודל על מנת לפענוח ואימות טוקנים
    const jwt = require('jsonwebtoken');
    try {
        // ככה מבצעים חילוץ הטוקן מהכותרת של הבקשה
        const token = request.headers.authorization.split(' ')[1]; // Extract token from header
        //GLOBAL_TOKEN_SECRET מפענחת ומאמתת את הטוקן באמצעות המפתח הסודי שנמצא במשתנה הסביבה
        const decoded = jwt.verify(token, process.env.GLOBAL_TOKEN_SECRET);
        // חיפוש המשתמש במסד הנתונים לפי ה-אידי ושמירה 
        const data = await User.findOne({ _id: decoded._id });

        if (!data) {
            //סטטוס 401 מציין שהבקשה לא הצליחה מכיוון חסר אישורי אימות 
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
            // סטטוס 404 מציין שהשרת לא מצא את הכתובת המבוקשת 
            return result.status(404).send('No data');
        }

        result.send(data);
    } catch (error) {
        //סטטוס 500 אם אי אפשר לגשת לשרת
        result.status(500).send(error.message);
    }
}
// מטרת הפונקציה היא לחפש ולהחזיר משתמש מהמסד הנתונים לפי אידי שלו
exports.findUserByID = async (request, result) => {
    try {
        // קבלת האידי של המשתמש לפי הבקשה והצוותו 
        const id = request.query.id;
        // חיפוש המשתמש לפי מיספר האידי שלו
        const data = await User.findById(id);
        //אם המשתמש לא נמצא מוחזרת שגיאה 
        if (!data) {
            return result.status(404).send('No data');
        }
        // אם המשתמש נמצא, הפונקציה מחזירה את האובייקט של המשתמש.
        result.send(data);
    } catch (error) {
        result.status(500).send(error.message);
    }
}

