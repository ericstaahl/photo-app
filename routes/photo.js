const express = require('express');
const router = express.Router();
const routesController = require('../controllers/photos_controller');

/* Get all photos */
router.get ('/', routesController.index);
/* Get a photo */
router.get ('/:photoId', routesController.show);


module.exports = router;
