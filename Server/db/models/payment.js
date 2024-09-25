const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    cardHolderName: {//שם_בעל_הכרטיס
        type: String,
        required: true
    },
    cardNumber: {//מספר_כרטיס
        type: Number,
        trim: true,
        required: true,
        maxlength: 16 // הגבלת מספר התווים ל-16
    },
    cardHolderID: {//תעודת_זהות_בעל_הכרטיס
        type: Number,
        trim: true,//משמשת להסרת רווחים מיותרים בתחילת ובסוף המחרוזת לפני שמירתה
        required: true,  
    },
    expiryDate: {//תאריך_תפוגה
        type: Date,
        required: true
    },
    securityCode: {//קוד_סודי
        type: Number,
        trim: true,//משמשת להסרת רווחים מיותרים בתחילת ובסוף המחרוזת לפני שמירתה
        required: true,
        maxlength: 3 // הגבלת מספר התווים ל-3
    },
    totalCost: {// עלות_כוללת
        type: Number,
        trim: true,
        required: true,
    }
});
// פונקציה לבדיקת תוקף התאריך
PaymentSchema.methods.isExpiryDateValid = function() {
    const today = new Date();
    return this.expiryDate > today;
};


module.exports = PaymentSchema;