const express = require('express');
const router = express.Router();
const productController = require("../controllers/product_Controller");

router.post("/add", productController.add);
router.post("/findProduct", productController.findProduct);
router.post("/updateProductByID", productController.updateProductByID);
router.post("/deleteProductByID", productController.deleteProductByID);
router.get("/returnEnumListByType", productController.returnEnumListByType);
module.exports = router;