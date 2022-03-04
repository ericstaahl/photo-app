const express = require('express');
const router = express.Router();
const routesController = require('../controllers/user_controller');
const auth = require('../middlewares/auth');
const photoValidationRules = require('../validation/Photo');

/* Get all photos */
router.get ('/', auth.validateToken, routesController.index);
/* Get a photo */
router.get ('/:photoId', auth.validateToken, routesController.show);
/* Store a new photo */
router.post ('/', auth.validateToken, photoValidationRules.createRules, routesController.store);
/* Update a photo */
router.put ('/:photoId', auth.validateToken, photoValidationRules.updateRules, routesController.update)

module.exports = router;
