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
 * Store a new photo in an album
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
	// Check if the photo already exists in the album
	const checkingAlbum = await new models.Albums({ id: albumId, user_id: user_id }).fetch({ withRelated: ['photos'], require: false });
	let exists = false;
	checkingAlbum.related('photos').forEach(photo => {
		if (photo_id == photo.id) {
			exists = true
		};
	});
	if (exists) {
		return res.send({
			status: 'fail',
			data: 'Photo already exists on the album',
		});
	};
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
	};
};

const addMultiplePhotos = async (req, res) => {
	const albumId = req.params.albumId;
	const user_id = req.user.user_id;
	const photo_ids = req.body.photo_id;
	// Check if the photos exist (and owned by the user) in the database
	const checkedIds = [];
	const checkingAlbum = await new models.Albums({ id: albumId, user_id: user_id }).fetch({ withRelated: ['photos'], require: false });
	for (const photo_id of photo_ids) {
		const photo = await new models.Photos({ id: photo_id, user_id: user_id }).fetch({ require: false });
		if (photo) {
			checkedIds.push(photo_id)
		};
	};
	console.log("All of the existing ID:s " + checkedIds)

	// Check if the photos already exists in the album
	const checkedIdsRound2 = [];
	for (const photo_id of checkedIds) {
		let exists = true;
		checkingAlbum.related('photos').forEach(photo => {
			if (photo_id == photo.id) {
				exists = false;
			};
		});
		if (exists) {
			checkedIdsRound2.push(photo_id);
		}
	};
	console.log("All of the ID:s not in the album: " + checkedIdsRound2)
	if (checkedIdsRound2.length == 0) {
		return res.status(200).send({
			status: 'The following photos already exist on the album',
			data: checkedIds,
		})
	}
	try {
		const album = await new models.Albums({ id: albumId, user_id: user_id }).photos().attach(checkedIdsRound2);

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
	};
};

/**
 * Update a specific resource
 *
 * PUT /:exampleId
 */
const update = async (req, res) => {
	const albumId = req.params.albumId;
	const user_id = req.user.user_id;

	// make sure example exists
	const album = await new models.Albums({ id: albumId, user_id: user_id }).fetch({ require: false });
	if (!album) {
		debug("Album to update was not found. %o", { id: albumId });
		res.status(404).send({
			status: 'fail',
			data: 'Album not found',
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
		const updatedAlbum = await album.save(validData);
		debug("Updated album successfully: %O", updatedAlbum);

		res.send({
			status: 'success',
			data: updatedAlbum,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating the album.',
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
	addMultiplePhotos,
	update,
	destroy,
}
