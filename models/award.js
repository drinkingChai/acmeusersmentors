const conn = require('./_db');
const faker = require('faker');

const Award = conn.define('award', {
	phrase: {
		type: conn.Sequelize.STRING,
		allowNull: false
	}
})

Award.makeOne = (user)=> {
	return Award.create({
		phrase: faker.company.catchPhrase()
	}).then(award=> {
		return award.setUser(user);
	})
}

module.exports = Award;
