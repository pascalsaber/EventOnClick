//Libraries
const express = require('express'); //Express

const cors = require('cors');

const mongoose = require('mongoose'); //Mongoose
//const cors = require('cors'); //https://expressjs.com/en/resources/middleware/cors.html

const bodyParser = require('body-parser'); //חובה עבור POST
const bcrypt = require('bcryptjs');

const UserRouter = require('../routers/user_Router');
const EventRouter = require('../routers/event_Router');
const ProductRouter = require('../routers/product_Router');
//תבנית התחברות לבסיס הנתונים
mongoose.connect('mongodb://localhost:27017/EventOnClick'); //חיבור לבסיס הנתונים
const mongoDB = mongoose.connection;

mongoDB.once('error', function () { //במידה ויש שגיאת התחברות
    console.log('Error on MongoDB');
});
mongoDB.once('open', function () { //במידה ובוצע חיבור בהצלחה
    console.log('Connected to MongoDB');
});

//הפעלה השרת
const app = express(); //יצירת עצם של התוכנית
//app.use(cors()); //

app.use(bodyParser.json());
//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors()); //חובה עבור העברת מידע מEXPREE לREACT

//app.use(bodyParser.raw())

// process תוכנית שלי
// Env קובץ dev.env
// PORT - משתנה עצמו
const port = process.env.GLOBAL_EXPRESS_PORT || 9999; //יש כאן בעיה לשלוף מידע מקובץ dev.env

//app.listen(5000, () => console.log('Server is running on port 5000')); //הפעלה שרת הדפדפן
// מאזינים לפורט
app.listen(port, () => {
    console.log(`Server is running on Port ${port}`);
    console.log(`Link: http://localhost:${port}`);
});

//הגדרת ניתובים ROUTER
// POST כל בקשת
// REQUEST תועבר כ 
// על פי הקישור אליו פונים
app.use('/user', UserRouter);
app.use('/event', EventRouter);
app.use('/product', ProductRouter);