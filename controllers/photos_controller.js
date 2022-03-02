/**
 * Photos Controller
 */

const debug = require('debug')('books:example_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all resources
 *
 * GET /
 */
const index = async (req, res) => {
	const photos = await models.Photos.fetchAll({withRelated: ['user']});

	res.send({
		status: 'success',
		data: {
			photos,
		}
	});
}

/**
 * Get a specific resource
 *
 * GET /:exampleId
 */
const show = async (req, res) => {
	const photo = await new models.Photos({ id: req.params.photoId }).fetch();

	res.send({
		status: 'success',
		data: photo,
	});
}

/**
 * Store a new resource
 *
 * POST /
 */
 const store = async (req, res) => {
	// check for any validation errors

	try {
		const photo = await new models.Example(validData).save();
		debug("Created new example successfully: %O", example);

		res.send({
			status: 'success',
			data: example,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new example.',
		});
		throw error;
	}
}


module.exports = {
	index,
	show,
	store,
}
