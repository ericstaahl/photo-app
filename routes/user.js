const express = require('express');
const router = express.Router();
const routesController = require('../controllers/user_controller');
const auth = require('../middlewares/auth');

/* Get all photos */
router.get ('/', auth.validateToken, routesController.index);
/* Get a photo */
router.get ('/:photoId', auth.validateToken, routesController.show);


module.exports = router;
