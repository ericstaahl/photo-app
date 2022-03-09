const express = require('express');
const router = express.Router();
const routesController = require('../controllers/album-controller');
const auth = require('../middlewares/auth');
const albumValidationRules = require('../validation/Album');

/* Get all resources */
router.get('/', auth.validateToken, routesController.index);

/* Get a specific resource */
router.get('/:albumId', auth.validateToken, routesController.show);

/* Store a new resource */
router.post('/', auth.validateToken, albumValidationRules.createRules, routesController.store);

/* Add a photo to the album */
router.post('/:albumId/photos', auth.validateToken, routesController.addPhoto);

/* Update a specific resource */
router.put('/:albumId', auth.validateToken, albumValidationRules.updateRules, routesController.update);

router.delete('/:albumId/photos/:photoId', auth.validateToken, routesController.destroy);
// /* Destroy a specific resource */
// router.delete('/:exampleId', exampleController.destroy);

module.exports = router;
