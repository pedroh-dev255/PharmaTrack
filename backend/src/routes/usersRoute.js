const { Router } = require("express");
const userController = require("../controller/userController");
const router = Router();

router.get('/', userController.getUsers);

router.put('/:id/toggle-status', userController.toggleStatus);

module.exports = router;