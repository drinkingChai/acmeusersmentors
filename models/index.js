const conn = require('./_db');
const User = require('./user');
const Award = require('./award');


Award.belongsTo(User);
User.hasMany(Award);

User.belongsTo(User, { as: 'mentor' });
User.hasMany(User, { as: 'mentees', foreignKey: 'mentorId' });


const seed = ()=> {
	return Promise.all([
		User.create({ name: 'Bob' }),
		User.create({ name: 'Mary' }),
		User.create({ name: 'Susan' })
	]);
}


const sync = ()=> {
	return conn.sync({ force: true });
}


module.exports = {
	sync,
	seed,
	models: {
		User,
		Award
	}
};
