const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enumLocation = ["Inside the Hall", "Outside the Hall"];
const enumType = ["Party", "Wedding", "Bar/Bat Mitzvah"];

const EventSchema = new Schema({
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
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

EventSchema.methods.enumRequest = async function (enumRequest) {
    if (enumRequest == "location") {
        return enumLocation;
    }
    else if (enumRequest == "type") {
        return enumType;
    }
    return "No data.";
};

// בדיקת תאריך פנוי לאירוע
EventSchema.statics.validDate = async function (yourDate) {
    const findEvent = await EventData.findOne({ date: yourDate });
    if (findEvent) {
        console.log('התאריך כבר קיים במסד הנתונים');
    } else {
        console.log('התאריך פנוי');
    }
};

const EventData = mongoose.model('Event', EventSchema);

module.exports = EventData;
