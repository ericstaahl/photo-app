const express = require('express');
const router = express.Router();
const userValidationRules = require('../validation/User');
const authController = require('../controllers/auth_controller');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'oh, hi' }});
});

router.use('/photos', require('./photo'));
router.use('/albums', require('./album'))

router.post('/login', authController.login);
router.post('/register', userValidationRules.registerRules, authController.register);
router.post('/refresh', authController.refresh);

module.exports = router;
