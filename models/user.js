const conn = require('./_db');
const Award = require('./award');

const User = conn.define('user', {
	name: {
		type: conn.Sequelize.STRING,
		allowNull: false
	}
}, {
	isMentor() {
		return Award.getAward(this).then(awards=> {
			return awards.length >= 2 ? true : false;
		})
	}
})

User.giveAward = id=> {
	return User.findOne({ where: { id: id }}).then(user=> {
		Award.createAward(user);
	})
}

User.removeAward = (userId, awardId)=> {
	return Award.deleteAward(awardId).then(awards=> {
		if (awards.length < 2) {
			return User.findAll({
				where: { mentorId: userId },
			});
		}
	}).then(mentees=> {
		if (mentees && mentees.length) {
			return Promise.all(mentees.map(mentee=> mentee.setMentor(null)))
		}
	})
}

User.assignMentor = (menteeId, mentorName)=> {
	return User.findOne({ where: { id: menteeId }}).then(mentee=> {
		return User.findOne({ where: { name: mentorName }}).then(mentor=> {
			mentee.setMentor(mentor);
		})
	})
}


module.exports = User;
