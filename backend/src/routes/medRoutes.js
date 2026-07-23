const { Router } = require("express");
const localController = require('../controller/localController');
const grupoService = require('../controller/grupoController');
const medController = require('../controller/medController');
const router = Router();

router.get("/medicamentos", medController.get);
router.get("/locais", localController.getAll);
router.get("/grupos", grupoService.getAll);

module.exports = router;
