const express = require('express');
const router = express.Router();
const productController = require("../controllers/product_Controller");

router.post("/add", productController.add);
router.post("/findProductByCategory", productController.findProductByCategory);
router.post("/updateProductByID", productController.updateProductByID);
router.post("/deleteProductByID", productController.deleteProductByID);
router.get("/returnEnumListByType", productController.returnEnumListByType);
router.get("/returnArryByCategory", productController.returnArryByCategory);
module.exports = router;