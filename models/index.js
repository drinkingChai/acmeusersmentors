const conn = require('./_db');
const User = require('./user');
const Award = require('./award');


Award.belongsTo(User);
User.hasMany(Award);


const sync = ()=> {
	return conn.sync({ force: true });
}


module.exports = {
	sync,
	models: {
		User,
		Award
	}
};
