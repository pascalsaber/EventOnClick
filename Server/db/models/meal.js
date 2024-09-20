const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MealSchema = new Schema({
    firstMeal: {
        type: String,
        required: true
    },
    secondMeal: {
        type: String,
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
        min: 1
    }
});

module.exports = MealSchema;
