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
	// const { photos } = photo
	res.send({
		status: 'success',
		data: userWithPhotos.relations.photos
		// data: photo,
	});
};


/**
 * Get a specific resource
 *
 * GET /:exampleId
 */





module.exports = {
	index,
}
