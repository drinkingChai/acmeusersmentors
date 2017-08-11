const conn = require('./_db');
const faker = require('faker');

const Award = conn.define('award', {
	phrase: {
		type: conn.Sequelize.STRING,
		allowNull: false
	}
})

Award.createAward = (user)=> {
	return Award.create({
		phrase: faker.company.catchPhrase()
	}).then(award=> {
		award.setUser(user);
	});
}

Award.deleteAward = (id)=> {
	return Award.findOne({ where: { id: id }})
		.then(award=> award.destroy());
}

module.exports = Award;
