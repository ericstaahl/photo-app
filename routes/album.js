const express = require('express');
const router = express.Router();
const routesController = require('../controllers/album-controller');
const auth = require('../middlewares/auth');
const albumValidationRules = require('../validation/Album');

/* Get all albums */
router.get('/', auth.validateToken, routesController.index);

/* Get a specific album */
router.get('/:albumId', auth.validateToken, routesController.show);

/* Store a new album */
router.post('/', auth.validateToken, albumValidationRules.createRules, routesController.store);

/* Add a photo to the album */
router.post('/:albumId/photos', auth.validateToken, routesController.addPhoto);

/* Update a specific album */
router.put('/:albumId', auth.validateToken, albumValidationRules.updateRules, routesController.update);

/* Remove a specific photo belonging to an album (just the relation) */
router.delete('/:albumId/photos/:photoId', auth.validateToken, routesController.removePhoto);

/* Destroy a specific album */
router.delete('/:albumId', auth.validateToken, routesController.destroy);

module.exports = router;
