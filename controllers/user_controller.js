/**
 * Photos Controller
 */

const debug = require('debug')('books:example_controller');
const { matchedData, validationResult } = require('express-validator');
const { Photos } = require('../models');
const models = require('../models');

/**
 * Get all photos of user
 *
 * GET /
 */

 const index = async (req, res) => {
	const photo = await models.User.fetchById(req.user.user_id);
	const userWithPhotos = await photo.load('photos');
	res.send({
		status: 'success',
		data: userWithPhotos.relations.photos
	});
};


/**
 * Get a specific photo from the current user
 *
 * GET /:photoId
 */

 const show = async (req, res) => {
	const photo = await models.User.fetchById(req.user.user_id);
	// Filter the relations to only show the photo requested by the user.
	const userWithPhoto = await photo.load({photos: function(qb) {
		qb.where('photos.id', '=', req.params.photoId)
	}});
	res.send({
		status: 'success',
		data: userWithPhoto,
	});
};




module.exports = {
	index,
	show
}
