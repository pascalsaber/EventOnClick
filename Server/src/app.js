//Libraries
const express = require('express'); //Express
const mongoose = require('mongoose'); //Mongoose
//const cors = require('cors'); //https://expressjs.com/en/resources/middleware/cors.html

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
app.listen(5000, () => console.log('Server is running on port 5000')); //הפעלה שרת הדפדפן

//Schema
const userSchema = new mongoose.Schema({
    name: String,
    age: { type: Number, min: 18, max: 65 },
});
const UserData = mongoose.model('User', userSchema);

//הפניות
// http://localhost:5000/api/add?name=Test2&age=25
app.get('/api/add', async (request, result) => {
    try {
        // מידע שמתקבל בפניה
        const req_name = request.query.name;
        const req_age = request.query.age;

        const newUser = new UserData({
            // איחסון באובייקט
            name: req_name,
            age: req_age
        });

        const process = await newUser.save();
        result.send(process);
    } catch (error) {
        result.status(500).send(error.message);
    }
});

app.get('/api/printall', async (request, result) => {
    try {
        const allUsers = await UserData.find();
        result.send(allUsers);
    } catch (error) {
        result.status(500).send(error.message);
    }
});

app.get('/api/findByID', async (request, result) => {
    try {
        const id = request.query.id;
        const data = await UserData.findById(id);

        if (!data) {
            return result.status(404).send('No data');
        }

        result.send(data);
    } catch (error) {
        result.status(500).send(error.message);
    }
});


app.get('/api/updateByID', async (request, result) => {
    try {
        const id = request.query.id;
        const req_name = request.query.name;
        const req_age = request.query.age;
        const data = await UserData.findByIdAndUpdate(id, { name: req_name, age: req_age });

        if (!data) {
            return result.status(404).send('No data');
        }

        result.send(data);
    } catch (error) {
        result.status(500).send(error.message);
    }
});