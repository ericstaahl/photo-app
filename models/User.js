/**
 * User model
 */
const bcrypt = require('bcrypt');

module.exports = (bookshelf) => {
	return bookshelf.model('User', {
		tableName: 'users',
		// photos() {
		// 	return this.hasMany('Photo');
		// }
	},
		{
			async login(email, password) {
				const user = await new this({ email }).fetch({require:false});
				if (!user) {
					return false;
				};
				
				const hash = user.get('password');

				const result = await bcrypt.compare(password, hash);
				if (!result) {
					return false;
				};

				return user;
			}
		}
	);
};
