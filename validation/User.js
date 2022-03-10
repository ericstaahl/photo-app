/**
 * User Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');


// 'custom' checks whether a user exists with the email sent by the user.
// If not, the check passes and a user can be created (provided the other checks do not fail).

const registerRules = [
	body('email')
		.exists()
		.isLength({ min: 2 })
		.custom(async (req) => {
			console.log(req)
			const user = await new models.User({email: req}).fetch({ require: false });
			if (user) {
				return Promise.reject('Email already in use');
			};
		}),
	body('first_name').exists().isLength({ min: 2 }),
	body('last_name').exists().isLength({ min: 2 }),
	body('password').exists().isLength({ min: 8 }),
];

const updateRules = [
	body('first_name').optional().isLength({ min: 2 }),
	body('last_name').optional().isLength({ min: 2 }),
	body('password').optional().isLength({ min: 8 }),
];

module.exports = {
	registerRules,
	updateRules,
}
