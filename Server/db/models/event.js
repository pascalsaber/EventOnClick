const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventShema = new Schema({

    event_name : {
        type: String,
        required: true
    },
    event_date : {
        type: Date,
        required: true
    },
    event_location : {
        type: String,
        enum: ["inside the hall", "outside the hall"]
    },

    type : {
        type: String,
        enum: ["Party", "wedding","batORbar mitzvah"]
    },
    Notes : { 
        type: String,
        maxlength : 500
    },
});



/*const existingEvent = await EventData.findOne({ event_date: yourDate });
if (existingEvent) {
    console.log('התאריך כבר קיים במסד הנתונים');
} else {
    console.log('התאריך פנוי');
}*/
