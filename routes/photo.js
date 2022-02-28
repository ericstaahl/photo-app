const express = require('express');
const router = express.Router();
const routesController = require('../controllers/photos_controller');

/* Get all photos */
router.get ('/', routesController.index);

module.exports = router;
