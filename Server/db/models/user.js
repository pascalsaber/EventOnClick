
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const validator = require('validator');
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
        min: 18,
        max: 65

    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error(`Invalid email format: ${value}`);
        }
    },


});

//token פונקציה לייצרת
userSchema.methods.generateToken = async function () {
    const user = this;

    let data = {
        signInTime: Date.now(),
        _id: this._id,
        username: this.username
    }
    const token = jwt.sign(data, process.env.GLOBAL_TOKEN_SECRET, { expiresIn: '1 hour' }); //1800s - 30 minutes

    //const token = jwt.sign({ _id: user._id }, 'H57gd1!@$nsdaf32487sd', { expiresIn: '1 hour' });
    //user.tokens.push({ token }); //הוספה למערך במקום האחרון
    return token;
}

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