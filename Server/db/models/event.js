const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MealSchema = require('./meal')
const DecorationSchema = require('./decoration')
const PaymentSchema = require('./payment')
const enumLocation = ["Inside the Hall", "Outside the Hall"];
const enumType = ["Party", "Wedding", "Bar/Bat Mitzvah"];

const EventSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User', //"Users" table in MongoDB
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        enum: enumLocation,
        required: true
    },
    type: {
        type: String,
        enum: enumType,
        required: true
    },
    notes: {
        type: String,
        maxlength: 500,
    },/*
    meals: [{
        type: MealSchema,
        required: true
    }]*/
    meals: [MealSchema],
    decorations: [DecorationSchema],
    status: {
        type: String,
        required: true
    },
    payments: PaymentSchema


});

EventSchema.methods.enumRequest = async function (enumRequest) {
    if (enumRequest == "location")
        return enumLocation;
    else if (enumRequest == "type")
        return enumType;
    return "No data.";
};
EventSchema.methods.addToList = async function (reqBody) {
    try {
        const event = this;
        event.lists.push(reqBody); //הוספה למערך במקום האחרון
        await event.save();
    }
    catch (err) {
        console.log(err);
    }
};

// בדיקת תאריך פנוי לאירוע
EventSchema.methods.getMealsByField = function (field) {
    if (!this.meals) {
        return []; // מחזיר מערך ריק אם meals לא מוגדר
    }
    return this.meals
        .filter(meal => meal !== null && meal !== undefined) // סינון אובייקטים null או undefined
        .map(meal => meal[field]);
};

const EventData = mongoose.model('Event', EventSchema);

module.exports = EventData;
