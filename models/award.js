const conn = require('./_db');
const faker = require('faker');

const Award = conn.define('award', {
	phrase: {
		type: conn.Sequelize.STRING,
		allowNull: false
	}
})

Award.getAwards = userId=> {
	return Award.findAll({ where: { userId: userId }});
}

Award.createAward = user=> {
	return Award.create({
		phrase: faker.company.catchPhrase()
	}).then(award=> {
		return award.setUser(user);
	})
}

Award.deleteAward = id=> {
	return Award.findOne({
		where: { id: id }
	}).then(award=> {
		return award.destroy().then(()=> {
			return Award.findAll({ where: { userId: award.userId }});
		});
	})
}

module.exports = Award;
