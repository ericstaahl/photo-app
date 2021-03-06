/**
 * Authentication Controller
 */

const bcrypt = require('bcrypt');
const debug = require('debug')('books:example_controller');
const { matchedData, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const models = require('../models');

/**
 * Store a new user
 *
 * POST /
 */

const register = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
		validData.password = await bcrypt.hash(validData.password, 10);
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Error occured when attempting to hash password'
		});
		throw error;
	};

	try {
		const user = await new models.User(validData).save();
		debug("Created new user successfully: %O", user);

		// Avoid sending password and id back to user
		delete user.attributes.password;
		delete user.attributes.id;
		
		res.send({
			status: 'success',
			data: user,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new user.',
		});
		throw error;
	};
};

// Check if the user exists in the database and if so return an access-token and a refresh-token

const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await models.User.login(email, password);
	if (!user) {
		return res.status(401).send({
			status: "fail",
			data: "Authentication failed",
		});
	};
	const payload = {
		sub: user.get('email'),
		user_id: user.get('id'),
		name: user.get('first_name') + ' ' + user.get('last_name')
	};

	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME, });

	const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFETIME, });

	return res.send({
		status: 'success',
		data: {
			access_token,
			refresh_token
		}
	})
};

// Get a new access-token for the logged in user (as long as the refresh-token hasn't expired)
const refresh = async (req, res) => {
	try {
		const payload = jwt.verify(req.body.token, process.env.REFRESH_TOKEN_SECRET);
		delete payload.iat;
		delete payload.exp;

		const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME, });

		return res.send({
			status: 'success',
			data: {
				access_token,
			}
		})
	} catch {
		return res.status(401).send({
			status: 'fail',
			data: 'Invalid token'
		});
	}
}

module.exports = {
	login,
	register,
	refresh,
}
