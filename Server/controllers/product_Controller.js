const Product = require("../db/models/product");
const User = require("../db/models/user.js");
const authenticateToken = require("./auth");
// פונקציית הוספת מוצר
exports.add = async (request, result) => {
    try {
        const newProduct = new Product(request.body);
        //  NAME-חיפוש מוצר במסד הנתונים לפי ה
        const data = await Product.findOne({ name: newProduct.name });
        //אם המוצר נמצא, חוזרת שגיאה
        if (data) {
            return result.status(400).send('מוצר זה כבר קיים'); //throw new Error
        }
        const progress = await newProduct.save();
        // שליחת התגובה עם המידע על המוצר שנשמר
        result.send(progress);
    } catch (error) {
        // במקרה ומתבצעת שגיאה באחת מהשלבים 
        //(שגיאת שרת פנימית) מחזירים הודעת שגיאה עם סטטוס 500
        result.status(500).send(error.message);
    }
}
// פונקציית עדכון נתונים למוצר לפי המפתח היחודי שלו
exports.updateProductByID =[authenticateToken, async (request, result) => {
    try {
        if (request.userData.status != 1) // בדיקה שהמשתמש מנהל
                return result.status(400).send('Must be admin.');
        const req_id = request.body.id;
        let data = await Product.findById(req_id);
        if (!data) {
            // סטטוס 400 בקשה לא תקינה
            return result.status(400).send('מוצר זה אינו קיים');
        }

        // בדיקת שם מוצר
        let nameExists = await Product.findOne({ name: request.body.name });
        if (nameExists) {
            if (nameExists._id != req_id) // כדי לא להתייחס למוצר עצמו
                return result.status(400).send('מוצר זה כבר קיים, נא לתת שם אחר למוצר');
        }
        // שליפת רשימת הקטגוריה 
        let categoryList = await data.enumRequest("category");
        // חיפוש אם בקטגוריה ששלפתי קיים סוג הקטגוריה שקיבלתי בבקשה
        let categoryExists = categoryList.find(item => item == request.body.category)
        if (categoryExists == null)
            return result.status(400).send("קטגוריה אינה קיימת");
        // עדכון המוצר עם השינויים שקרו 
        data = await Product.findByIdAndUpdate(req_id, { name: request.body.name, price: request.body.price, category: request.body.category });
        // שליפת המוצר מרשימת המוצרים אחרי שעודכן על מנת להחזיר אותו ללקוח 
        data = await Product.findById(req_id);
        result.send(data);
    } catch (error) {
        //סטטוס 500 אם אי אפשר לגשת לשרת
        result.status(500).send(error.message);
    }
}];
// מחיקת מוצר מרקשימת המוצרים 
exports.deleteProductByID = async (request, result) => {
    try {
        if (request.userData.status != 1) // בדיקה שהמשתמש מנהל
                return result.status(400).send('Must be admin.');
        const req_id = request.body.id;
        const data = await Product.findByIdAndDelete(req_id);
        if (!data) {
            // סטטוס 404 מציין שהשרת לא מצא את הכתובת המבוקשת 
            return result.status(400).send('No data');
        }
        result.send(data);
    } catch (error) {
        //סטטוס 500 אם אי אפשר לגשת לשרת
        result.status(500).send(error.message);
    }
}
// הצגת רשימת המוצרים מלאה או לפי קטגוריה מסווימת 
exports.findProductByCategory = async (request, result) => {
    try {
        let data = null
        let category = request.query.category
        if (category == "" || category == null)
            data = await Product.find(); // מחזיר את כל המוצרים ללא סינון קטגוריות
        else
            data = await Product.find({ category: request.query.category });
        if (data.length === 0) {
            return result.status(400).send('אין בקטגוריה זו אף מוצר'); //throw new Error
        }
        result.json(data);
    } catch (error) {
        // במקרה ומתבצעת שגיאה באחת מהשלבים 
        //(שגיאת שרת פנימית) מחזירים הודעת שגיאה עם סטטוס 500
        result.status(500).send(error.message);
    }
}
exports.returnEnumListByType = async (request, result) => {
    try {
        const product = new Product();
        let enumList = await product.enumRequest(request.query.type);
        result.send(enumList); //["First Meal", "Second Meal", "Salad", "Table"...];
    } catch (error) {
        result.status(500).send(error.message);
    }
}

/*exports.returnArryByCategory = async (request, result) => {
    try {
        let toReturn = [];
        let list = await Product.find({ category: request.query.category });
        list.map(item => {
            toReturn.push(item.name);
        })
        result.send(toReturn);
    } catch (error) {
        result.status(500).send(error.message);
    }
}*/
