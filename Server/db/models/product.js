const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categoryList = ["First Meal", "Second Meal", "Salad", "Table"];

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: categoryList,
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required: true,
    }
});

// מחזירה רשימה של משתנים בהתאם לפרמטר שנשלח
// במטרה להציג רשימה של אפשרויות באתר
ProductSchema.methods.enumRequest = async function (enumRequest) {
    if (enumRequest == "category")
        return categoryList;
    return "No data.";
};

//
const ProductData = mongoose.model('Product', ProductSchema);

module.exports = ProductData;
