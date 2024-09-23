const express = require('express');
const router = express.Router();
const userController = require("../controllers/user_Controller.js");

router.post("/register", userController.register);
router.get("/printall", userController.printall);
router.post("/updateUserByID", userController.updateUserByID);
router.post("/login", userController.login);
router.get("/profile", userController.profile);
router.get("/findUserByID", userController.findUserByID);

module.exports = router;
