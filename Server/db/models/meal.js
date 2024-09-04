const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const enumLocation = ["Inside the Hall", "Outside the Hall"];
//const enumType = ["Party", "Wedding", "Bar/Bat Mitzvah"];

const MealSchema = new Schema({

    firstMeal: {
        type: String,
        enum: enumLocation,
        required: true
    },
    secondMeal: {
        type: String,
        enum: enumType,
        required: true
    },
    amount: {
        type: Number,
        trim: true,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        min: 18
    }

});


/*EventSchema.methods.enumRequest = async function (enumRequest) {
    if (enumRequest == "location")
        return enumLocation;
    else if (enumRequest == "type")
        return enumType;
    return "No data.";
};*/



const MealData = mongoose.model('Meal', MealSchema);

module.exports =MealData ;
