/**
 * Album Controller
 */

const debug = require('debug')('books:example_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all albums
 *
 * GET /
 */
const index = async (req, res) => {
	const user_id = req.user.user_id;
	const albums = await new models.Albums().where('user_id', '=', user_id).fetchAll({ require: false });
	if (!albums) {
		res.status(404).send({
			status: 'fail',
			data: 'No albums were found',
		})
	} else {
		res.status(200).send({
			status: 'success',
			data: albums,
		});
	};
};

/**
 * Get a specific album
 *
 * GET /:albumId
 */
const show = async (req, res) => {
	const albumId = req.params.albumId;
	const user_id = req.user.user_id;
	const album = await new models.Albums({ id: albumId, user_id: user_id }).fetch({ withRelated: ['photos'], require: false });
	if (!album) {
		res.status(404).send({
			status: 'fail',
			data: 'No album were found',
		})
	} else {
		res.status(200).send({
			status: 'success',
			data: album,
		});
	};
};

/**
 * Store a new album
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
	// add the current user's id to the album
	validData.user_id = req.user.user_id;
	try {
		const album = await new models.Albums(validData).save();

		res.status(200).send({
			status: 'success',
			data: album,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new album.',
		});
		throw error;
	}
}

/**
 * Store a new album
 *
 * POST /
 */
const addPhoto = async (req, res) => {
	const albumId = req.params.albumId;
	const user_id = req.user.user_id;
	const photo_id = req.body.photo_id;
	// Check if the photo exist (and owned by the user) in the database
	const photo = await new models.Photos({ id: photo_id, user_id: user_id }).fetch({ require: false });
	if (!photo) {
		return res.status(404).send({
			status: 'fail',
			data: 'Photo not found',
		});
	}
	try {
		const album = await new models.Albums({ id: albumId, user_id: user_id }).photos().attach(photo_id);

		res.status(200).send({
			status: 'success',
			data: album,
		})
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating relation.',
		});
		throw error;
	}
}

/**
 * Update a specific resource
 *
 * PUT /:exampleId
 */
const update = async (req, res) => {
	const exampleId = req.params.exampleId;

	// make sure example exists
	const example = await new models.Example({ id: exampleId }).fetch({ require: false });
	if (!example) {
		debug("Example to update was not found. %o", { id: exampleId });
		res.status(404).send({
			status: 'fail',
			data: 'Example Not Found',
		});
		return;
	}

	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
		const updatedExample = await example.save(validData);
		debug("Updated example successfully: %O", updatedExample);

		res.send({
			status: 'success',
			data: example,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a new example.',
		});
		throw error;
	}
}

/**
 * Destroy a specific resource
 *
 * DELETE /:exampleId
 */
const destroy = (req, res) => {
	res.status(400).send({
		status: 'fail',
		message: 'You need to write the code for deleting this resource yourself.',
	});
}

module.exports = {
	index,
	show,
	store,
	addPhoto,
	update,
	destroy,
}
