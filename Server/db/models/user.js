
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const event = require('./event.js')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        // הרווחים יוסרו משני בצדדים על מנת להבטיח שתשמיר בבסיס נתונים בצורה תקינה 
        trim: true,
        // מחייב לתת ערך בשדה 
        required: true,
        // שערך השדה חייב להיות ייחודי במסד הנתוניםו על מנת למנוע כפיליות 
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    age: {
        type: Number,
        trim: true,
        required: true,
        min: 18
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error(`Invalid email format: ${value}`);
        }
    },
    // משתמש רגיל יקבל סטטוס 1
    // משתמש מנהל יקבל סטטוס 0
    status: {
        type: Number,
        trim: true,
        required: true,
    }
   
});

//Token פונקציה לייצרת
userSchema.methods.generateToken = async function () {
    const user = this;
    let data = {
        signInTime: Date.now(),
        _id: this._id,
        username: this.username

    }
    const token = jwt.sign(data, process.env.GLOBAL_TOKEN_SECRET, { expiresIn: '1 hour' }); //1800s - 30 minutes
    //user.tokens.push({ token }); //הוספה למערך במקום האחרון
    return token;
}

// minLength:8 מינימום 8 תויים
// minLowercase: 1 מינימום אות 1 קטנה
// minUppercase:1 מינימום אות 1 גדולה
// minNumbers:1 מינימום מספר אחד
// minSymbols:1 מינימום תו אחד מיוחד
userSchema.methods.isStrongPassword = async function () {
    const user = this;
    if (validator.isStrongPassword(user.password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }))
        return true;
    else
        return false;
}

/*
userSchema.pre('save', async function(next) 
{
    const user = this;
    console.log("In save");
    try {   
        // בודק אם שדה הסיסמא עודכן
        if(user.isModified('password'))
        {
            //הסיסמא לאחר ההצפנה //bcrypt.hash()-פעולת ההצפנה 
            const hashedPassword = await bcrypt.hash(user.password, 8);
            user.password = hashedPassword;
            next(); // שיטה לקריאה לפונקיצה הבאה כדי לא להיתקע
        }
    }
    catch (err) {
        console.log(err);
    }
}); */

const UserData = mongoose.model('User', userSchema);
module.exports = UserData;