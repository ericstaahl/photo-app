/**
 * User Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

/**
 * Register User validation rules
 *
 * Required: title
 * Optional: -
 */
const registerRules = [
	body('email').exists().isLength({ min: 2 }),
	body('first_name').exists().isLength({ min: 2 }),
	body('last_name').exists().isLength({ min: 2 }),
	body('password').exists().isLength({ min: 8 }),
];

/**
 * Update User validation rules
 *
 * Required: -
 * Optional: title
 */
const updateRules = [
	body('first_name').optional().isLength({ min: 2 }),
	body('last_name').optional().isLength({ min: 2 }),
	body('password').optional().isLength({ min: 8 }),
];

module.exports = {
	registerRules,
	updateRules,
}
