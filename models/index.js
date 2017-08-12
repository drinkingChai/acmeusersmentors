const conn = require('./_db');
const User = require('./user');
const Award = require('./award');


Award.belongsTo(User);
User.hasMany(Award);

User.belongsTo(User, { as: 'mentor' });
User.hasMany(User, { as: 'mentee', foreignKey: 'mentorId' });



const seed = ()=> {
	return Promise.all([
		User.create({ name: 'Bob' }),
		User.create({ name: 'Sweet' }),
		User.create({ name: 'Lera' })
	]).then(users=> {
		return Promise.all([
			Award.createAward(users[0]),
			Award.createAward(users[0]),
			Award.createAward(users[1]),
			Award.createAward(users[1]),
			Award.createAward(users[2])
		])
	}).then(()=> {
		return User.assignMentor(2, 'Bob');
	})
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
