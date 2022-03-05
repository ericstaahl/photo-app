/**
 * User Controller
 */

const debug = require('debug')('books:example_controller');
const { matchedData, validationResult } = require('express-validator');
// const { Photos } = require('../models');
const models = require('../models');

// /**
//  * OLD SOLUTION!!!
//  * Get all photos of user
//  *
//  * GET /
//  */

// const index = async (req, res) => {
// 	const photo = await models.User.fetchById(req.user.user_id);
// 	const userWithPhotos = await photo.load('photos');
// 	res.send({
// 		status: 'success',
// 		data: userWithPhotos.relations.photos
// 	});
// };

const index = async (req, res) => {
	const user_id = req.user.user_id;
	console.log(user_id)
	const photo = await new models.Photos().where('user_id', '=', user_id).fetchAll({ require: false });
	console.log(photo);
	if (!photo) {
		res.status(404).send({
			status: 'fail',
			data: 'No photos found on the current user.',
		})
	} else
		res.status(200).send({
			status: 'success',
			data: photo,
		});
}



/**
 * Store a new photo on the current user
 *
 * POST /
 */

const store = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);
	// add the current user's id to the photo
	validData.user_id = req.user.user_id;
	try {
		const photo = await new models.Photos(validData).save();

		res.status(200).send({
			status: 'success',
			data: photo,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new photo.',
		});
		throw error;
	}
}


/**
 * OLD SOLUTION!!! 
 * Get a specific photo from the current user
 *
 * GET /:photoId
 */

// const show = async (req, res) => {
// 	const photo = await models.User.fetchById(req.user.user_id);
// 	// Filter the relations to only show the photo requested by the user.
// 	const userWithPhoto = await photo.load({
// 		photos: function (qb) {
// 			qb.where('photos.id', '=', req.params.photoId)
// 		}
// 	});


// 	console.log("Log: " + Object.keys(userWithPhoto.relations.photos))
// 	// TODO: double-check wether or not the this is a good way to check if no photo was found
// 	if (!userWithPhoto.relations.photos.length) {
// 		res.send({
// 			status: 'failed',
// 			data: "A photo with this id was not found on the user.",
// 		});
// 	} else {
// 		res.send({
// 			status: 'success',
// 			data: userWithPhoto.relations.photos,
// 		});
// 	}
// };

/**
 * Get a specific photo from the current user
 *
 * GET /:photoId
 */


const show = async (req, res) => {
	const photoId = req.params.photoId;
	const user_id = req.user.user_id;
	const photo = await new models.Photos({ id: photoId, user_id: user_id }).fetch({ require: false });
	if (!photo) {
		res.status(404).send({
			status: 'fail',
			data: 'The requested photo was not found',
		})
	} else
		res.status(200).send({
			status: 'success',
			data: photo,
		});
}
/**
 * Update a photo on the current user
 *
 * PUT /
 */
const update = async (req, res) => {

	const photoId = req.params.photoId;
	const user_id = req.user.user_id;

	// Check if the requested photo exist with the current user ID
	const photo = await new models.Photos({ id: photoId, user_id: user_id }).fetch({ require: false });
	if (!photo) {
		res.status(404).send({
			status: 'fail',
			data: 'Example Not Found',
		});
		return;
	};

	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	};

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
		const updatedPhoto = await photo.save(validData);

		res.status(200).send({
			status: 'success',
			data: updatedPhoto,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a new photo.',
		});
		throw error;
	};
};

module.exports = {
	index,
	show,
	store,
	update
}