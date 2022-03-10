/**
 * Ablum Validation Rules
 */

const { body } = require('express-validator');

const createRules = [
	body('title').exists().isLength({ min: 3 }),
];

const updateRules = [
	body('title').optional().isLength({ min: 3 }),
];

module.exports = {
	createRules,
	updateRules,
}
