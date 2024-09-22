const authenticateToken = require('./auth'); // Adjust the path as needed
const bcrypt = require('bcryptjs');
const Event = require("../db/models/event.js");
const User = require("../db/models/user.js");

function encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10); //מחרוזת אקראית בגודל 10 טווים עבור ההצפנה
    // hash - את ההסיסמה המוצפנת שיש בתוכה את השילוב של הסימה המקורית והמחרוזת ההקראית שהמערכת יצרה
    const hashPassword = bcrypt.hashSync(password, salt);
    // מעדכנים את הסיסמה של המשתמש לאחר שהצפנו אותה 
    return hashPassword;
}

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

        const email_taken = await User.findOne({ email: newUser.email });
        //אם שם המשתמש תפוס
        if (email_taken)
            // מוחזרת שגיאה שהמשתמש כבר קיים במערכת 
            return result.status(404).send('Email is taken.');

        // אם המשתמש לא נמצא אז אפשר ליצור אותו במערכת 
        // מתחילים לעשות בדיקות לסיסמה שהמשתמש נתן 
        // בודקת אם הסיסמה חזקה מספיק ועומדת בדרישות שבנינו בה תפונקציה בעמוד סכימת היוזיר
        let isStrongPassword = await newUser.isStrongPassword(); //MUST USE AWAIT!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //אם הסיסמה לא חזקה, מחזירה הודעת שגיאה עם סטטוס 404
        if (isStrongPassword == false)
            return result.status(404).send('Password is not strong.');
        newUser.password = encryptPassword(newUser.password); //הצפנת סיסמא
        const progress = await newUser.save();
        result.send(progress);
        // במקרה של שגיאה, מחזירה הודעת שגיאה עם סטטוס 500 
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
exports.profile = [authenticateToken, // Middleware
    async (request, result) => {
        try {
            const userData = request.userData;
            result.json({ userData });
        } catch (error) {
            result.status(500).json({ message: 'An error occurred while fetching: ' + error });
        }
    }];

exports.updateUserByID = [authenticateToken, // Middleware
    async (request, result) => {
        try {
            const userData = request.userData;
            userData.password = request.body.password;
            // מתחילים לעשות בדיקות לסיסמה שהמשתמש נתן 
            // בודקת אם הסיסמה חזקה מספיק ועומדת בדרישות שבנינו בה תפונקציה בעמוד סכימת היוזיר
            let isStrongPassword = await userData.isStrongPassword(); //MUST USE AWAIT!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //אם הסיסמה לא חזקה, מחזירה הודעת שגיאה עם סטטוס 404
            if (isStrongPassword == false)
                return result.status(404).send('Password is not strong.');
            userData.password = encryptPassword(userData.password); //הצפנת סיסמא

            if (userData.email != request.body.email) {
                const email_taken = await User.findOne({ email: request.body.email });
                //אם שם המשתמש תפוס
                if (email_taken)
                    // מוחזרת שגיאה שהמשתמש כבר קיים במערכת 
                    return result.status(404).send('Email is taken.');
            }

            let progress = await User.findByIdAndUpdate(
                userData._id,
                {
                    firstName: request.body.firstName,
                    lastNAme: request.body.lastName,
                    password: userData.password,
                    email: request.body.email
                },
                { new: true })
            result.json(progress);
        } catch (error) {
            result.status(500).json({ message: 'An error occurred while fetching: ' + error });
        }
    }];

// מטרת הפונקציה היא לחפש ולהחזיר משתמש מהמסד הנתונים לפי אידי שלו
exports.findUserByID = [authenticateToken, // Middleware
    async (request, result) => {
        try {
            if (process.env.GLOBAL_TEST_MODE == 1) {
                console.log("Request Query: " + JSON.stringify(request.query)) //From query or body
                console.log("Request Body: " + JSON.stringify(request.body)) //From query or body
                console.log("Request Params: " + JSON.stringify(request.params)) //From query or body
                console.log("User Data: " + JSON.stringify(request.userData)) //From authenticateToken
            }
            if (request.userData.status != 1) // בדיקה שהמשתמש מנהל
                return result.status(404).send('Must be admin.');
            // חיפוש המשתמש לפי מספר האידי שלו
            const data = await User.findById(request.query.id);
            //אם המשתמש לא נמצא מוחזרת שגיאה 
            if (!data)
                return result.status(404).send('No data');
            result.send(data); // הפונקציה מחזירה את האובייקט של המשתמש
        } catch (error) {
            result.status(500).send(error.message);
        }
    }];

// פונקציה שמוצאת את כל המשתמשים במסד הנתונים ושולחת את התוצאה ללקוח
exports.printall = [authenticateToken, // Middleware
    async (request, result) => {
        try {
            const userData = request.userData;
            if (userData.status == 0)
                return result.status(404).send('Must be admin.');

            const allUsers = await User.find();
            result.json(allUsers);
        } catch (error) {
            result.status(500).json({ message: 'An error occurred while fetching: ' + error });
        }
    }];
