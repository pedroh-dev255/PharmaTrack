const { Router } = require("express");
const authController = require("../controller/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;