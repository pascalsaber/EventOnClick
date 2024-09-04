const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const enumType = ["First Meal", "Second Meal", "salad","Table"];

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: enumType,
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required: true,
    }
    
});

ProductSchema.methods.enumRequest = async function (enumRequest) {
    if (enumRequest == "type")
        return enumType;
    return "No data.";
};

const ProductData = mongoose.model('Product', ProductSchema);

module.exports = ProductData;
