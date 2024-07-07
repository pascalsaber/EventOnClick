
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
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]

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

userSchema.methods.assignUserToEvent = async function (thisUser, thisEvent) {
    try {
        const user = await user.findById(thisUser._id);
        const event = await event.findById(thisEvent._id);

        if (!user || !event) {
            console.log('user or event not found.');
            return;
        }

        // הוסף את הסטודנט למערך של הקורס
        event.users.push(user);
        await event.save();

        console.log(`User ${thisUser.firstName} ${thisUser.lastName} assigned to course ${thisEvent.name}.`);
    } catch (error) {
        console.error('Error assigning user to event:', error.message);
    }
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