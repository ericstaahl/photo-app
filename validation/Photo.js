/**
 * Photo Validation Rules
 */

const { body } = require('express-validator');

/**
 * Create Photo validation rules
 *
 * Required: title
 * Required: url
 * Optional: comment
 */
const createRules = [
	body('title').exists().isLength({ min: 3 }),
	body('url').exists().isURL(),
	body('comment').optional().isLength({ min: 3 }),
];

/**
 * Update Photo validation rules
 *
 * Required: -
 * Optional: title
 */
const updateRules = [
	body('title').optional().isLength({ min: 3 }),
	body('url').optional().isURL(),
	body('comment').optional().isLength({ min: 3 }),
];

module.exports = {
	createRules,
	updateRules
}
