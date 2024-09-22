const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DecorationSchema = new Schema({
    table: {
        type: String,
        required: true
    },
    map:{
        type: String,
        required: true
    },
    extra1: {
        type: String,
        required: true
    },
    extra2: {
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

module.exports = DecorationSchema;