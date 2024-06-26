const express = require('express');
const router = express.Router();
const userController = require("../controllers/user_Controller.js");

router.get("/add", userController.add);
router.get("/printall", userController.printall);
router.get("/updateUserByID", userController.updateUserByID);
router.post("/login", userController.login);
router.get("/findUserByID", userController.findUserByID);
module.exports = router;
