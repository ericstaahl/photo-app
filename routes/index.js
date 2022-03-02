const express = require('express');
const router = express.Router();
const userValidationRules = require('../validation/user');
const authController = require('../controllers/auth_controller');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'oh, hi' }});
});

router.use('/example', require('./example'));
router.use('/photos', require('./photo'));
router.post('/register', userValidationRules.registerRules, authController.register);

module.exports = router;
