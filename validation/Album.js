/**
 * Example Validation Rules
 */

const { body } = require('express-validator');

/**
 * Create Example validation rules
 *
 * Required: title
 * Optional: -
 */
const createRules = [
	body('title').exists().isLength({ min: 3 }),
];

/**
 * Update Example validation rules
 *
 * Required: -
 * Optional: title
 */
const updateRules = [
	body('title').optional().isLength({ min: 3 }),
];

module.exports = {
	createRules,
	updateRules,
}
